import React, { useState } from 'react';
import { Heart, MessageSquare, Clock, Send, Loader2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCommunityComments } from '@/hooks/useCommunityComments';
import { CommunityComment } from '@/types/community';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CommentsListProps {
  postId: string;
  open: boolean;
  onClose: () => void;
}

export default function CommentsListNew({ postId, open, onClose }: CommentsListProps) {
  const {
    comments,
    loading,
    createComment,
    likeComment,
  } = useCommunityComments(postId);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await createComment({
        post_id: postId,
        content: newComment,
      });
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      await createComment({
        post_id: postId,
        content: replyContent,
        parent_comment_id: parentId,
      });
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true
      });
    } catch (e) {
      return 'Unknown date';
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

  const CommentItem = ({ comment, isReply = false }: { comment: CommunityComment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-12 mt-3' : ''} bg-black/20 p-3 rounded-lg`}>
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500">
          {comment.profiles?.avatar_url ? (
            <AvatarImage src={comment.profiles.avatar_url} alt={comment.profiles.username} />
          ) : (
            <AvatarFallback>
              {comment.profiles ? getInitials(comment.profiles.full_name || comment.profiles.username) : 'U'}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center">
            <p className="font-medium text-white text-sm">
              {comment.profiles?.full_name || comment.profiles?.username || 'User'}
            </p>
            <span className="mx-2 text-xs text-white/60">•</span>
            <p className="text-xs text-white/60 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(comment.created_at)}
            </p>
            {comment.is_edited && (
              <>
                <span className="mx-2 text-xs text-white/60">•</span>
                <span className="text-xs text-white/40">Edited</span>
              </>
            )}
          </div>

          <p className="text-white/80 text-sm mt-1 whitespace-pre-line">{comment.content}</p>

          {comment.media_url && (
            <img
              src={comment.media_url}
              alt="Comment media"
              className="mt-2 rounded-lg max-w-xs"
            />
          )}

          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => likeComment(comment.id, isReply, comment.parent_comment_id || undefined)}
              className={`flex items-center space-x-1 ${comment.is_liked ? 'text-pink-500' : 'text-white/50 hover:text-pink-500'} text-xs transition-colors`}
            >
              <Heart className={`h-3.5 w-3.5 ${comment.is_liked ? 'fill-pink-500' : ''}`} />
              <span>{comment.likes_count}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center space-x-1 text-white/50 hover:text-blue-500 text-xs transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Reply</span>
                {comment.replies_count > 0 && (
                  <span>({comment.replies_count})</span>
                )}
              </button>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[60px] bg-black/40 border-gray-700 text-white text-sm resize-none"
                maxLength={1000}
              />
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={submitting || !replyContent.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                  className="border-gray-700"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col bg-gray-900/95 border border-white/10 p-0">
        <DialogHeader className="p-4 border-b border-white/10">
          <DialogTitle className="text-white">Comments</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-white/20" />
              <p>No comments yet</p>
              <p className="text-sm text-white/40 mt-1">Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>

        <form onSubmit={handleSubmitComment} className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-black/40 border-gray-700 text-white resize-none min-h-[60px]"
              maxLength={2000}
            />
            <Button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="mt-1 text-xs text-white/40">
            {newComment.length}/2000 characters
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
