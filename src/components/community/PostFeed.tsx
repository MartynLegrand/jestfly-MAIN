import { useEffect, useRef, useCallback } from 'react';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { Loader2 } from 'lucide-react';
import PostCard from './PostCard';
import { FeedOptions } from '@/types/community';

interface PostFeedProps {
  options?: FeedOptions;
  onCommentClick?: (postId: string) => void;
}

export default function PostFeed({ options, onCommentClick }: PostFeedProps) {
  const {
    posts,
    loading,
    hasMore,
    fetchPosts,
    likePost,
  } = useCommunityPosts(options);

  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading) {
        fetchPosts(false);
      }
    },
    [hasMore, loading, fetchPosts]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  const handleLike = async (postId: string) => {
    await likePost(postId);
  };

  const handleComment = (postId: string) => {
    if (onCommentClick) {
      onCommentClick(postId);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!loading && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 text-lg">No posts yet</p>
        <p className="text-white/40 text-sm mt-2">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => handleLike(post.id)}
          onComment={() => handleComment(post.id)}
        />
      ))}

      {hasMore && (
        <div ref={observerTarget} className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-500/50" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-white/40 text-sm">You've reached the end</p>
        </div>
      )}
    </div>
  );
}
