import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CommunityFollow } from '@/types/community';
import { toast } from 'sonner';

export function useCommunityFollows(userId?: string) {
  const [followers, setFollowers] = useState<CommunityFollow[]>([]);
  const [following, setFollowing] = useState<CommunityFollow[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFollows = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const [followersResult, followingResult] = await Promise.all([
        supabase
          .from('community_follows')
          .select('*')
          .eq('following_id', userId),
        supabase
          .from('community_follows')
          .select('*')
          .eq('follower_id', userId),
      ]);

      if (followersResult.error) throw followersResult.error;
      if (followingResult.error) throw followingResult.error;

      setFollowers(followersResult.data || []);
      setFollowing(followingResult.data || []);

      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id !== userId) {
        const { data: followCheck } = await supabase
          .from('community_follows')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', userId)
          .maybeSingle();

        setIsFollowing(!!followCheck);
      }
    } catch (error) {
      console.error('Error fetching follows:', error);
      toast.error('Failed to load follow data');
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (targetUserId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      if (user.id === targetUserId) throw new Error('Cannot follow yourself');

      const { error } = await supabase
        .from('community_follows')
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
        });

      if (error) throw error;

      if (userId === targetUserId) {
        setFollowers(prev => [...prev, {
          id: crypto.randomUUID(),
          follower_id: user.id,
          following_id: targetUserId,
          created_at: new Date().toISOString(),
        }]);
      }

      setIsFollowing(true);
      toast.success('Following user!');
    } catch (error: any) {
      console.error('Error following user:', error);
      if (error.message.includes('duplicate')) {
        toast.error('Already following this user');
      } else {
        toast.error('Failed to follow user');
      }
      throw error;
    }
  };

  const unfollowUser = async (targetUserId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('community_follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

      if (error) throw error;

      if (userId === targetUserId) {
        setFollowers(prev => prev.filter(f => f.follower_id !== user.id));
      }

      setIsFollowing(false);
      toast.success('Unfollowed user');
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
      throw error;
    }
  };

  const toggleFollow = async (targetUserId: string) => {
    if (isFollowing) {
      await unfollowUser(targetUserId);
    } else {
      await followUser(targetUserId);
    }
  };

  const getFollowersCount = () => followers.length;
  const getFollowingCount = () => following.length;

  useEffect(() => {
    if (userId) {
      fetchFollows();
    }
  }, [userId]);

  return {
    followers,
    following,
    isFollowing,
    loading,
    followUser,
    unfollowUser,
    toggleFollow,
    getFollowersCount,
    getFollowingCount,
    refetch: fetchFollows,
  };
}
