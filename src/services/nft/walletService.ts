import { supabase } from '@/integrations/supabase/client';
import type { UserWallet } from '@/types/nftTypes';

export const walletService = {
  async getWallet(userId: string) {
    const { data, error } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return await this.createWallet(userId);
    }

    return data as UserWallet;
  },

  async createWallet(userId: string) {
    const { data, error } = await supabase
      .from('user_wallets')
      .insert({
        user_id: userId,
        balance: 0,
        total_earned: 0,
        total_spent: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data as UserWallet;
  },

  async getBalance(userId: string) {
    const wallet = await this.getWallet(userId);
    return wallet.balance;
  },

  async addBalance(userId: string, amount: number) {
    const { data, error } = await supabase.rpc('add_wallet_balance', {
      p_user_id: userId,
      p_amount: amount,
    });

    if (error) throw error;
    return data;
  },

  async deductBalance(userId: string, amount: number) {
    const { data, error } = await supabase.rpc('deduct_wallet_balance', {
      p_user_id: userId,
      p_amount: amount,
    });

    if (error) throw error;
    return data;
  },

  async getTransactionHistory(userId: string) {
    const { data, error } = await supabase
      .from('product_transactions')
      .select('*, product:nft_products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};