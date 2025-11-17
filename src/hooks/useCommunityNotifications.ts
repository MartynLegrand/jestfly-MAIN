import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CommunityNotification } from '@/types/community';
import { toast } from 'sonner';

export function useCommunityNotifications() {
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('community_notifications')
        .select(`
          *,
          actor:actor_id (
            id,
            username,
            avatar_url,
            full_name
          ),
          post:post_id (
            id,
            content
          ),
          comment:comment_id (
            id,
            content
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount((data || []).filter(notif => !notif.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('community_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.map(notif =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('community_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('community_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      const notification = notifications.find(notif => notif.id === notificationId);
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const subscribeToNotifications = () => {
    const { data: { user } } = supabase.auth.getUser();

    user.then(({ data: userData }) => {
      if (!userData?.user) return;

      const subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'community_notifications',
            filter: `user_id=eq.${userData.user.id}`,
          },
          (payload) => {
            setNotifications(prev => [payload.new as CommunityNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            toast.info('New notification');
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    });
  };

  useEffect(() => {
    fetchNotifications();
    const unsubscribe = subscribeToNotifications();
    return () => {
      if (unsubscribe) {
        unsubscribe;
      }
    };
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications,
  };
}
