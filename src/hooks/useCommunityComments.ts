import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CommunityComment, CreateCommentData } from '@/types/community';
import { toast } from 'sonner';

export function useCommunityComments(postId: string) {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar_url,
            full_name
          )
        `)
        .eq('post_id', postId)
        .is('parent_comment_id', null)
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const commentsWithLikes = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: like } = await supabase
              .from('community_likes')
              .select('id')
              .eq('comment_id', comment.id)
              .eq('user_id', user.id)
              .maybeSingle();

            const replies = await fetchReplies(comment.id);

            return { ...comment, is_liked: !!like, replies };
          }
          return comment;
        })
      );

      setComments(commentsWithLikes);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (parentId: string): Promise<CommunityComment[]> => {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar_url,
            full_name
          )
        `)
        .eq('parent_comment_id', parentId)
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return data || [];

      const repliesWithLikes = await Promise.all(
        (data || []).map(async (reply) => {
          const { data: like } = await supabase
            .from('community_likes')
            .select('id')
            .eq('comment_id', reply.id)
            .eq('user_id', user.id)
            .maybeSingle();

          return { ...reply, is_liked: !!like };
        })
      );

      return repliesWithLikes;
    } catch (error) {
      console.error('Error fetching replies:', error);
      return [];
    }
  };

  const createComment = async (commentData: CreateCommentData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('community_comments')
        .insert({
          post_id: commentData.post_id,
          user_id: user.id,
          content: commentData.content,
          parent_comment_id: commentData.parent_comment_id,
          media_url: commentData.media_url,
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

      if (commentData.parent_comment_id) {
        setComments(prev => prev.map(comment => {
          if (comment.id === commentData.parent_comment_id) {
            return {
              ...comment,
              replies_count: comment.replies_count + 1,
              replies: [...(comment.replies || []), data],
            };
          }
          return comment;
        }));
      } else {
        setComments(prev => [data, ...prev]);
      }

      toast.success('Comment posted!');
      return data;
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to post comment');
      throw error;
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('community_comments')
        .update({ content, is_edited: true })
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => prev.map(comment =>
        comment.id === commentId ? { ...comment, content, is_edited: true } : comment
      ));
      toast.success('Comment updated!');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('community_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
      throw error;
    }
  };

  const likeComment = async (commentId: string, isReply = false, parentId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const targetComment = isReply && parentId
        ? comments.find(comment => comment.id === parentId)?.replies?.find(reply => reply.id === commentId)
        : comments.find(comment => comment.id === commentId);

      if (!targetComment) return;

      if (targetComment.is_liked) {
        const { error } = await supabase
          .from('community_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (error) throw error;

        if (isReply && parentId) {
          setComments(prev => prev.map(comment => {
            if (comment.id === parentId && comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map(reply =>
                  reply.id === commentId
                    ? { ...reply, is_liked: false, likes_count: reply.likes_count - 1 }
                    : reply
                ),
              };
            }
            return comment;
          }));
        } else {
          setComments(prev => prev.map(comment =>
            comment.id === commentId
              ? { ...comment, is_liked: false, likes_count: comment.likes_count - 1 }
              : comment
          ));
        }
      } else {
        const { error } = await supabase
          .from('community_likes')
          .insert({ comment_id: commentId, user_id: user.id });

        if (error) throw error;

        if (isReply && parentId) {
          setComments(prev => prev.map(comment => {
            if (comment.id === parentId && comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map(reply =>
                  reply.id === commentId
                    ? { ...reply, is_liked: true, likes_count: reply.likes_count + 1 }
                    : reply
                ),
              };
            }
            return comment;
          }));
        } else {
          setComments(prev => prev.map(comment =>
            comment.id === commentId
              ? { ...comment, is_liked: true, likes_count: comment.likes_count + 1 }
              : comment
          ));
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return {
    comments,
    loading,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    refetch: fetchComments,
  };
}
