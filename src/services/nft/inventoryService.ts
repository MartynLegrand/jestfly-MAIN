import { supabase } from '@/integrations/supabase/client';
import type { UserNFTInventory, PaymentMethod } from '@/types/nftTypes';

export const inventoryService = {
  async getUserInventory(userId: string) {
    const { data, error } = await supabase
      .from('user_nft_inventory')
      .select('*, product:nft_products(*, category:nft_categories(*))')
      .eq('user_id', userId)
      .order('acquired_at', { ascending: false });

    if (error) throw error;
    return data as UserNFTInventory[];
  },

  async getShowcasedNFTs(userId: string) {
    const { data, error } = await supabase
      .from('user_nft_inventory')
      .select('*, product:nft_products(*)')
      .eq('user_id', userId)
      .eq('is_showcased', true)
      .order('showcase_order', { ascending: true });

    if (error) throw error;
    return data as UserNFTInventory[];
  },

  async getInventoryItem(inventoryId: string) {
    const { data, error } = await supabase
      .from('user_nft_inventory')
      .select('*, product:nft_products(*)')
      .eq('id', inventoryId)
      .maybeSingle();

    if (error) throw error;
    return data as UserNFTInventory | null;
  },

  async addToInventory(
    userId: string,
    productId: string,
    paymentMethod: PaymentMethod,
    priceJestCoin: number,
    priceMoney: number
  ) {
    const tokenId = `${productId}-${userId}-${Date.now()}`;

    const { data, error } = await supabase
      .from('user_nft_inventory')
      .insert({
        user_id: userId,
        product_id: productId,
        payment_method: paymentMethod,
        purchase_price_jestcoin: priceJestCoin,
        purchase_price_money: priceMoney,
        token_id: tokenId,
      })
      .select('*, product:nft_products(*)')
      .single();

    if (error) throw error;
    return data as UserNFTInventory;
  },

  async updateShowcase(inventoryId: string, isShowcased: boolean, showcaseOrder?: number) {
    const { data, error } = await supabase
      .from('user_nft_inventory')
      .update({
        is_showcased: isShowcased,
        ...(showcaseOrder !== undefined && { showcase_order: showcaseOrder }),
      })
      .eq('id', inventoryId)
      .select('*, product:nft_products(*)')
      .single();

    if (error) throw error;
    return data as UserNFTInventory;
  },

  async redeemNFT(inventoryId: string) {
    const { data, error } = await supabase
      .from('user_nft_inventory')
      .update({
        is_redeemed: true,
        redeemed_at: new Date().toISOString(),
      })
      .eq('id', inventoryId)
      .select('*, product:nft_products(*)')
      .single();

    if (error) throw error;
    return data as UserNFTInventory;
  },

  async getInventoryStats(userId: string) {
    const inventory = await this.getUserInventory(userId);

    const stats = {
      total_nfts: inventory.length,
      total_spent_jestcoin: 0,
      total_spent_money: 0,
      by_rarity: {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
      },
      by_type: {
        digital: 0,
        physical: 0,
        hybrid: 0,
      },
    };

    inventory.forEach(item => {
      stats.total_spent_jestcoin += item.purchase_price_jestcoin;
      stats.total_spent_money += parseFloat(item.purchase_price_money.toString());

      if (item.product) {
        stats.by_rarity[item.product.rarity]++;
        stats.by_type[item.product.product_type]++;
      }
    });

    return stats;
  },
};