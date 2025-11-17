import { supabase } from '@/integrations/supabase/client';
import type { ShoppingCart, PaymentMethod } from '@/types/nftTypes';

export const cartService = {
  async getCart(userId: string) {
    const { data, error } = await supabase
      .from('shopping_cart')
      .select('*, product:nft_products(*, category:nft_categories(*))')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) throw error;
    return data as ShoppingCart[];
  },

  async addToCart(userId: string, productId: string, quantity = 1, paymentMethod?: PaymentMethod) {
    const existing = await supabase
      .from('shopping_cart')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing.data) {
      const { data, error } = await supabase
        .from('shopping_cart')
        .update({
          quantity: existing.data.quantity + quantity,
          selected_payment_method: paymentMethod,
        })
        .eq('id', existing.data.id)
        .select('*, product:nft_products(*)')
        .single();

      if (error) throw error;
      return data as ShoppingCart;
    }

    const { data, error } = await supabase
      .from('shopping_cart')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity,
        selected_payment_method: paymentMethod,
      })
      .select('*, product:nft_products(*)')
      .single();

    if (error) throw error;
    return data as ShoppingCart;
  },

  async updateQuantity(cartItemId: string, quantity: number) {
    const { data, error} = await supabase
      .from('shopping_cart')
      .update({ quantity })
      .eq('id', cartItemId)
      .select('*, product:nft_products(*)')
      .single();

    if (error) throw error;
    return data as ShoppingCart;
  },

  async updatePaymentMethod(cartItemId: string, paymentMethod: PaymentMethod) {
    const { data, error } = await supabase
      .from('shopping_cart')
      .update({ selected_payment_method: paymentMethod })
      .eq('id', cartItemId)
      .select('*, product:nft_products(*)')
      .single();

    if (error) throw error;
    return data as ShoppingCart;
  },

  async removeFromCart(cartItemId: string) {
    const { error } = await supabase
      .from('shopping_cart')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
  },

  async clearCart(userId: string) {
    const { error } = await supabase
      .from('shopping_cart')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },

  async getCartTotal(userId: string) {
    const cart = await this.getCart(userId);

    let totalJestCoin = 0;
    let totalMoney = 0;

    cart.forEach(item => {
      if (item.product) {
        if (item.selected_payment_method === 'jestcoin' || item.selected_payment_method === 'hybrid') {
          totalJestCoin += item.product.price_jestcoin * item.quantity;
        }
        if (item.selected_payment_method === 'money' || item.selected_payment_method === 'hybrid') {
          totalMoney += parseFloat(item.product.price_money.toString()) * item.quantity;
        }
      }
    });

    return {
      totalJestCoin,
      totalMoney,
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    };
  },
};