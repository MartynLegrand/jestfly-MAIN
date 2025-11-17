import { Button } from '@/components/ui/button';
import { useCommunityFollows } from '@/hooks/useCommunityFollows';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface FollowButtonProps {
  userId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  className?: string;
}

export default function FollowButton({
  userId,
  variant = 'default',
  size = 'default',
  showIcon = true,
  className = '',
}: FollowButtonProps) {
  const { currentUser } = useAuth();
  const { isFollowing, followUser, unfollowUser } = useCommunityFollows(userId);
  const [loading, setLoading] = useState(false);

  if (!currentUser || currentUser.id === userId) {
    return null;
  }

  const handleClick = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant={isFollowing ? 'outline' : variant}
      size={size}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {showIcon && (
            isFollowing ? (
              <UserMinus className="h-4 w-4 mr-2" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )
          )}
          {isFollowing ? 'Unfollow' : 'Follow'}
        </>
      )}
    </Button>
  );
}
