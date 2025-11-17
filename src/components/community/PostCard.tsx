import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Clock, Bookmark } from 'lucide-react';
import { CommunityPost } from '@/types/community';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatDate } from '@/utils/dateUtils';
import { getInitials } from '@/utils/userUtils';

interface PostCardProps {
  post: CommunityPost;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onShare }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = () => {
    if (onLike) {
      onLike();
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment();
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.content.substring(0, 50),
          text: post.content,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
      if (onShare) {
        onShare();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  return (
    <div className="neo-blur rounded-xl overflow-hidden border border-white/10 transition-all duration-300 hover:border-purple-500/30">
      <div className="p-4 flex items-center space-x-3">
        <Avatar className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500">
          {post.profiles?.avatar_url ? (
            <AvatarImage src={post.profiles.avatar_url} alt={post.profiles.full_name || post.profiles.username} />
          ) : (
            <AvatarFallback>
              {post.profiles ? getInitials(post.profiles.full_name || post.profiles.username) : 'U'}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center">
            <p className="font-medium text-white">
              {post.profiles?.full_name || post.profiles?.username || 'User'}
            </p>
            <span className="mx-2 text-xs text-white/60">•</span>
            <p className="text-xs text-white/60 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(post.created_at)}
            </p>
          </div>
          <p className="text-xs text-white/60">
            @{post.profiles?.username || 'user'}
          </p>
        </div>

        <button
          onClick={toggleBookmark}
          className={`p-1 ${isBookmarked ? 'text-yellow-500' : 'text-white/70 hover:text-yellow-500'} transition-colors`}
        >
          <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-yellow-500' : ''}`} />
        </button>

        <button className="text-white/70 hover:text-white p-1">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 pb-3">
        <p className="text-white/90 whitespace-pre-line">{post.content}</p>

        {post.media_urls && post.media_urls.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {post.media_urls.slice(0, 4).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Post media ${index + 1}`}
                className="rounded-lg w-full h-48 object-cover"
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-3 flex items-center justify-between border-t border-white/5">
        <div className="flex items-center space-x-6">
          <button
            className={`flex items-center space-x-1.5 ${post.is_liked ? 'text-pink-500' : 'text-white/70 hover:text-pink-500'} transition-colors`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${post.is_liked ? 'fill-pink-500' : ''}`} />
            <span className="text-sm">{post.likes_count}</span>
          </button>

          <button
            className="flex items-center space-x-1.5 text-white/70 hover:text-blue-500 transition-colors"
            onClick={handleComment}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">{post.comments_count}</span>
          </button>

          <button
            className="flex items-center space-x-1.5 text-white/70 hover:text-green-500 transition-colors"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            <span className="text-sm">{post.shares_count}</span>
          </button>
        </div>

        {post.views_count > 0 && (
          <span className="text-xs text-white/40">{post.views_count} views</span>
        )}
      </div>

      {post.hashtags && post.hashtags.length > 0 && (
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {post.hashtags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-purple-900/30 text-purple-400 border-purple-700/40"
            >
              #{tag}
            </Badge>
          ))}
          {post.is_pinned && (
            <Badge
              variant="outline"
              className="bg-blue-900/30 text-blue-400 border-blue-700/40"
            >
              Pinned
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
