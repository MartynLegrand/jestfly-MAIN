import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CommunityPost, CreatePostData, UpdatePostData, FeedOptions } from '@/types/community';
import { toast } from 'sonner';

export function useCommunityPosts(options?: FeedOptions) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (refresh = false) => {
    try {
      setLoading(true);

      let query = supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar_url,
            full_name
          )
        `)
        .eq('is_published', true)
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: false });

      if (options?.user_id) {
        query = query.eq('user_id', options.user_id);
      }

      if (options?.hashtag) {
        query = query.contains('hashtags', [options.hashtag]);
      }

      if (options?.following_only) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: following } = await supabase
            .from('community_follows')
            .select('following_id')
            .eq('follower_id', user.id);

          if (following && following.length > 0) {
            const followingIds = following.map(followRecord => followRecord.following_id);
            query = query.in('user_id', followingIds);
          }
        }
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      const postsWithLikes = await Promise.all(
        (data || []).map(async (post) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: like } = await supabase
              .from('community_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .maybeSingle();

            return { ...post, is_liked: !!like };
          }
          return post;
        })
      );

      if (refresh) {
        setPosts(postsWithLikes);
      } else {
        setPosts(prev => [...prev, ...postsWithLikes]);
      }

      if (!data || data.length < (options?.limit || 10)) {
        setHasMore(false);
      }

    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: CreatePostData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          content: postData.content,
          media_urls: postData.media_urls || [],
          media_type: postData.media_type,
          visibility: postData.visibility || 'public',
          hashtags: postData.hashtags || [],
          mentions: postData.mentions || [],
        })
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar_url,
            full_name
          )
        `)
        .single();

      if (error) throw error;

      setPosts(prev => [data, ...prev]);
      toast.success('Post created successfully!');
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
      throw error;
    }
  };

  const updatePost = async (postId: string, updates: UpdatePostData) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update(updates)
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.map(post => post.id === postId ? { ...post, ...updates } : post));
      toast.success('Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
      throw error;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const post = posts.find(existingPost => existingPost.id === postId);
      if (!post) return;

      if (post.is_liked) {
        const { error } = await supabase
          .from('community_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;

        setPosts(prev => prev.map(post =>
          post.id === postId
            ? { ...post, is_liked: false, likes_count: post.likes_count - 1 }
            : post
        ));
      } else {
        const { error } = await supabase
          .from('community_likes')
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;

        setPosts(prev => prev.map(post =>
          post.id === postId
            ? { ...post, is_liked: true, likes_count: post.likes_count + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const uploadMedia = async (file: File): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('community-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('community-media')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
      throw error;
    }
  };

  const incrementViews = async (postId: string) => {
    try {
      await supabase.rpc('increment_post_views', { post_id: postId });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, [options?.user_id, options?.hashtag, options?.following_only]);

  return {
    posts,
    loading,
    hasMore,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    uploadMedia,
    incrementViews,
    refetch: () => fetchPosts(true),
  };
}
