import { supabase } from '@/integrations/supabase/client';
import { walletService } from './walletService';
import type { RewardsMission, UserReward } from '@/types/nftTypes';

export const rewardsService = {
  /**
   * Get all active missions
   */
  async getActiveMissions(): Promise<RewardsMission[]> {
    const { data, error } = await supabase
      .from('rewards_missions')
      .select('*')
      .eq('is_active', true)
      .order('reward_amount', { ascending: false });

    if (error) throw error;
    return data as RewardsMission[];
  },

  /**
   * Get user's completed rewards
   */
  async getUserRewards(userId: string): Promise<UserReward[]> {
    const { data, error } = await supabase
      .from('user_rewards')
      .select('*, mission:rewards_missions(*)')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    return data as UserReward[];
  },

  /**
   * Check if user has completed a mission
   */
  async hasMissionCompleted(userId: string, missionId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_rewards')
      .select('id')
      .eq('user_id', userId)
      .eq('mission_id', missionId)
      .maybeSingle();

    if (error) throw error;
    return data !== null;
  },

  /**
   * Complete a mission and award rewards
   */
  async completeMission(userId: string, missionId: string): Promise<UserReward> {
    // Check if already completed
    const alreadyCompleted = await this.hasMissionCompleted(userId, missionId);
    if (alreadyCompleted) {
      throw new Error('Mission already completed');
    }

    // Get mission details
    const { data: mission, error: missionError } = await supabase
      .from('rewards_missions')
      .select('*')
      .eq('id', missionId)
      .eq('is_active', true)
      .single();

    if (missionError || !mission) {
      throw new Error('Mission not found or inactive');
    }

    // Check max completions if applicable
    if (mission.max_completions) {
      const { data: completionCount } = await supabase
        .from('user_rewards')
        .select('id', { count: 'exact' })
        .eq('mission_id', missionId);

      if (completionCount && completionCount.length >= mission.max_completions) {
        throw new Error('Mission has reached maximum completions');
      }
    }

    // Create reward record
    const { data: reward, error: rewardError } = await supabase
      .from('user_rewards')
      .insert({
        user_id: userId,
        mission_id: missionId,
        reward_amount: mission.reward_amount,
      })
      .select('*, mission:rewards_missions(*)')
      .single();

    if (rewardError) throw rewardError;

    // Add balance to wallet
    await walletService.addBalance(userId, mission.reward_amount);

    return reward as UserReward;
  },

  /**
   * Get mission stats for a user
   */
  async getUserMissionStats(userId: string) {
    const [rewards, missions] = await Promise.all([
      this.getUserRewards(userId),
      this.getActiveMissions(),
    ]);

    const totalCompleted = rewards.length;
    const totalAvailable = missions.length;
    const totalEarned = rewards.reduce((sum, r) => sum + r.reward_amount, 0);

    return {
      totalCompleted,
      totalAvailable,
      totalEarned,
      completionRate: totalAvailable > 0 ? (totalCompleted / totalAvailable) * 100 : 0,
    };
  },

  /**
   * Check and auto-complete missions based on user actions
   */
  async checkAndCompleteMissions(userId: string, action: string) {
    const missions = await this.getActiveMissions();

    for (const mission of missions) {
      // Check if mission matches the action
      if (mission.mission_type === action) {
        const alreadyCompleted = await this.hasMissionCompleted(userId, mission.id);
        
        if (!alreadyCompleted) {
          try {
            await this.completeMission(userId, mission.id);
          } catch (error) {
            console.error(`Failed to auto-complete mission ${mission.id}:`, error);
          }
        }
      }
    }
  },

  /**
   * Trigger mission completion for common actions
   */
  async triggerDailyLogin(userId: string) {
    return this.checkAndCompleteMissions(userId, 'daily_login');
  },

  async triggerFirstPurchase(userId: string) {
    // Check if this is actually their first purchase
    const { data: purchases } = await supabase
      .from('product_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .eq('transaction_type', 'purchase');

    if (purchases && purchases.length === 1) {
      return this.checkAndCompleteMissions(userId, 'first_purchase');
    }
  },

  async triggerProfileComplete(userId: string) {
    return this.checkAndCompleteMissions(userId, 'complete_profile');
  },

  async triggerSocialShare(userId: string) {
    return this.checkAndCompleteMissions(userId, 'social_share');
  },

  async triggerReferral(userId: string) {
    return this.checkAndCompleteMissions(userId, 'referral');
  },
};
