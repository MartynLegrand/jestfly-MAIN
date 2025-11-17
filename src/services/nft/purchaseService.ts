import { supabase } from '@/integrations/supabase/client';
import { walletService } from './walletService';
import { inventoryService } from './inventoryService';
import { cartService } from './cartService';
import { rewardsService } from './rewardsService';
import type { 
  PurchaseNFTInput, 
  PaymentMethod, 
  NFTProduct,
  ProductTransaction 
} from '@/types/nftTypes';

export const purchaseService = {
  /**
   * Process a single NFT purchase
   * Handles Jest Coin, fiat, and hybrid payments
   */
  async purchaseNFT(userId: string, input: PurchaseNFTInput): Promise<ProductTransaction> {
    // Get product details
    const { data: product, error: productError } = await supabase
      .from('nft_products')
      .select('*')
      .eq('id', input.product_id)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      throw new Error('Product not found or inactive');
    }

    // Validate stock availability
    if (!product.unlimited_stock && product.stock_quantity < input.quantity) {
      throw new Error('Insufficient stock available');
    }

    // Calculate total cost
    const totalJestCoin = product.price_jestcoin * input.quantity;
    const totalMoney = parseFloat(product.price_money.toString()) * input.quantity;

    // Validate payment method compatibility
    if (input.payment_method === 'jestcoin' && product.payment_methods === 'money') {
      throw new Error('This product only accepts fiat payment');
    }
    if (input.payment_method === 'money' && product.payment_methods === 'jestcoin') {
      throw new Error('This product only accepts Jest Coin payment');
    }

    // Check user wallet balance for Jest Coin payment
    if (input.payment_method === 'jestcoin' || input.payment_method === 'hybrid') {
      const wallet = await walletService.getWallet(userId);
      const requiredJC = input.payment_method === 'hybrid' 
        ? totalJestCoin / 2 
        : totalJestCoin;
      
      if (wallet.balance < requiredJC) {
        throw new Error('Insufficient Jest Coin balance');
      }
    }

    // Start transaction
    const transactionData = {
      user_id: userId,
      product_id: input.product_id,
      transaction_type: 'purchase',
      amount_jestcoin: input.payment_method === 'jestcoin' ? totalJestCoin :
                        input.payment_method === 'hybrid' ? totalJestCoin / 2 : 0,
      amount_money: input.payment_method === 'money' ? totalMoney :
                     input.payment_method === 'hybrid' ? totalMoney / 2 : 0,
      payment_method: input.payment_method,
      status: 'pending' as const,
      metadata: {
        quantity: input.quantity,
        shipping_address: input.shipping_address,
      },
    };

    const { data: transaction, error: transactionError } = await supabase
      .from('product_transactions')
      .insert(transactionData)
      .select()
      .single();

    if (transactionError) {
      throw new Error('Failed to create transaction');
    }

    try {
      // Deduct Jest Coin from wallet if applicable
      if (input.payment_method === 'jestcoin') {
        await walletService.deductBalance(userId, totalJestCoin);
      } else if (input.payment_method === 'hybrid') {
        await walletService.deductBalance(userId, totalJestCoin / 2);
      }

      // Process fiat payment (mock for now - integrate Stripe here)
      if (input.payment_method === 'money' || input.payment_method === 'hybrid') {
        // TODO: Integrate with Stripe or payment gateway
        // For now, we'll mark as completed immediately
        console.log('Fiat payment would be processed here');
      }

      // Add items to inventory
      for (let i = 0; i < input.quantity; i++) {
        await inventoryService.addToInventory(
          userId,
          input.product_id,
          input.payment_method,
          product.price_jestcoin,
          parseFloat(product.price_money.toString())
        );
      }

      // Update stock if not unlimited
      if (!product.unlimited_stock) {
        await supabase
          .from('nft_products')
          .update({
            stock_quantity: product.stock_quantity - input.quantity,
            total_sold: product.total_sold + input.quantity,
          })
          .eq('id', input.product_id);
      } else {
        // Just update total_sold
        await supabase
          .from('nft_products')
          .update({
            total_sold: product.total_sold + input.quantity,
          })
          .eq('id', input.product_id);
      }

      // Handle physical item shipping info
      if ((product.product_type === 'physical' || product.product_type === 'hybrid') 
          && input.shipping_address) {
        // Get the last created inventory item for this purchase
        const { data: inventoryItems } = await supabase
          .from('user_nft_inventory')
          .select('id')
          .eq('user_id', userId)
          .eq('product_id', input.product_id)
          .order('acquired_at', { ascending: false })
          .limit(input.quantity);

        if (inventoryItems) {
          for (const item of inventoryItems) {
            await supabase
              .from('physical_items')
              .insert({
                inventory_id: item.id,
                recipient_name: input.shipping_address.recipient_name,
                address_line1: input.shipping_address.address_line1,
                address_line2: input.shipping_address.address_line2,
                city: input.shipping_address.city,
                state: input.shipping_address.state,
                postal_code: input.shipping_address.postal_code,
                country: input.shipping_address.country,
                phone: input.shipping_address.phone,
                status: 'pending',
              });
          }
        }
      }

      // Update transaction status to completed
      const { data: completedTransaction, error: updateError } = await supabase
        .from('product_transactions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          inventory_id: transaction.id, // Reference for tracking
        })
        .eq('id', transaction.id)
        .select('*, product:nft_products(*)')
        .single();

      if (updateError) {
        throw new Error('Failed to update transaction status');
      }

      // Trigger first purchase mission check
      try {
        await rewardsService.triggerFirstPurchase(userId);
      } catch (error) {
        // Don't fail the purchase if mission trigger fails
        console.error('Failed to trigger first purchase mission:', error);
      }

      return completedTransaction as ProductTransaction;
    } catch (error: any) {
      // Rollback transaction on error
      await supabase
        .from('product_transactions')
        .update({
          status: 'failed',
          error_message: error.message,
        })
        .eq('id', transaction.id);

      throw error;
    }
  },

  /**
   * Purchase entire cart
   */
  async purchaseCart(userId: string): Promise<ProductTransaction[]> {
    const cart = await cartService.getCart(userId);
    
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    const transactions: ProductTransaction[] = [];
    const errors: string[] = [];

    for (const item of cart) {
      if (!item.product) continue;
      
      try {
        // Determine if product requires shipping
        const needsShipping = item.product.product_type === 'physical' 
                            || item.product.product_type === 'hybrid';
        
        const purchaseInput: PurchaseNFTInput = {
          product_id: item.product_id,
          quantity: item.quantity,
          payment_method: item.selected_payment_method || item.product.payment_methods,
          // Shipping address would need to be provided separately for cart checkout
          // This is a simplified version
        };

        const transaction = await this.purchaseNFT(userId, purchaseInput);
        transactions.push(transaction);
      } catch (error: any) {
        errors.push(`Failed to purchase ${item.product?.name}: ${error.message}`);
      }
    }

    // Clear successfully purchased items from cart
    if (transactions.length > 0) {
      await cartService.clearCart(userId);
    }

    if (errors.length > 0 && transactions.length === 0) {
      throw new Error(errors.join('; '));
    }

    return transactions;
  },

  /**
   * Get user's purchase history
   */
  async getPurchaseHistory(userId: string): Promise<ProductTransaction[]> {
    const { data, error } = await supabase
      .from('product_transactions')
      .select('*, product:nft_products(*, category:nft_categories(*))')
      .eq('user_id', userId)
      .eq('transaction_type', 'purchase')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ProductTransaction[];
  },

  /**
   * Check if user can purchase product (stock, limits, etc.)
   */
  async canPurchase(
    userId: string, 
    productId: string, 
    quantity: number
  ): Promise<{ canPurchase: boolean; reason?: string }> {
    const { data: product } = await supabase
      .from('nft_products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (!product) {
      return { canPurchase: false, reason: 'Product not found or inactive' };
    }

    // Check stock
    if (!product.unlimited_stock && product.stock_quantity < quantity) {
      return { canPurchase: false, reason: 'Insufficient stock' };
    }

    // Check per-user limit
    if (product.max_per_user > 0) {
      const { data: userInventory } = await supabase
        .from('user_nft_inventory')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId);

      const currentOwned = userInventory?.length || 0;
      if (currentOwned + quantity > product.max_per_user) {
        return { 
          canPurchase: false, 
          reason: `Maximum ${product.max_per_user} per user. You own ${currentOwned}.` 
        };
      }
    }

    return { canPurchase: true };
  },
};
