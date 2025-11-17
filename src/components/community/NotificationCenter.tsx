import { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, AtSign, MessageSquare, X, Check, Trash2 } from 'lucide-react';
import { useCommunityNotifications } from '@/hooks/useCommunityNotifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommunityNotification, NotificationType } from '@/types/community';

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useCommunityNotifications();

  const [open, setOpen] = useState(false);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'mention':
        return <AtSign className="h-4 w-4 text-purple-500" />;
      case 'reply':
        return <MessageSquare className="h-4 w-4 text-cyan-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationText = (notification: CommunityNotification) => {
    const actor = notification.actor?.full_name || notification.actor?.username || 'Someone';

    switch (notification.type) {
      case 'like':
        return notification.comment_id
          ? `${actor} liked your comment`
          : `${actor} liked your post`;
      case 'comment':
        return `${actor} commented on your post`;
      case 'follow':
        return `${actor} started following you`;
      case 'mention':
        return `${actor} mentioned you`;
      case 'reply':
        return `${actor} replied to your comment`;
      default:
        return 'New notification';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleNotificationClick = (notification: CommunityNotification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[400px] p-0 bg-gray-900/95 border border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/60">
              <Bell className="h-12 w-12 mb-3 text-white/20" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${
                    !notification.is_read ? 'bg-purple-500/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500">
                      {notification.actor?.avatar_url ? (
                        <AvatarImage
                          src={notification.actor.avatar_url}
                          alt={notification.actor.username}
                        />
                      ) : (
                        <AvatarFallback>
                          {notification.actor
                            ? getInitials(notification.actor.full_name || notification.actor.username)
                            : 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">
                            {getNotificationText(notification)}
                          </p>
                          {notification.post?.content && (
                            <p className="text-xs text-white/50 mt-1 line-clamp-2">
                              {notification.post.content}
                            </p>
                          )}
                          <p className="text-xs text-white/40 mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="h-8 w-8 text-white/40 hover:text-white hover:bg-red-500/20"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>

                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
