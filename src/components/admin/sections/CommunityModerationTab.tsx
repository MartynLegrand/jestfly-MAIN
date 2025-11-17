import { useState, useEffect } from 'react';
import { Check, X, Flag, Trash2, Pin, Eye, MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { CommunityPost, CommunityComment, CommunityReport } from '@/types/community';

export default function CommunityModerationTab() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsData, commentsData, reportsData] = await Promise.all([
        supabase
          .from('community_posts')
          .select('*, profiles:user_id(id, username, avatar_url, full_name)')
          .in('moderation_status', ['pending', 'flagged'])
          .order('created_at', { ascending: false }),
        supabase
          .from('community_comments')
          .select('*, profiles:user_id(id, username, avatar_url, full_name)')
          .eq('moderation_status', 'pending')
          .order('created_at', { ascending: false }),
        supabase
          .from('community_reports')
          .select(`
            *,
            reporter:reporter_id(id, username, avatar_url, full_name),
            post:post_id(id, content),
            comment:comment_id(id, content)
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
      ]);

      if (postsData.error) throw postsData.error;
      if (commentsData.error) throw commentsData.error;
      if (reportsData.error) throw reportsData.error;

      setPosts(postsData.data || []);
      setComments(commentsData.data || []);
      setReports(reportsData.data || []);
    } catch (error) {
      console.error('Error fetching moderation data:', error);
      toast.error('Failed to load moderation data');
    } finally {
      setLoading(false);
    }
  };

  const moderatePost = async (postId: string, status: 'approved' | 'rejected') => {
    setActionLoading(postId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('community_posts')
        .update({
          moderation_status: status,
          moderated_by: user.id,
          moderated_at: new Date().toISOString(),
        })
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.filter(p => p.id !== postId));
      toast.success(`Post ${status}`);
    } catch (error) {
      console.error('Error moderating post:', error);
      toast.error('Failed to moderate post');
    } finally {
      setActionLoading(null);
    }
  };

  const deletePost = async (postId: string) => {
    setActionLoading(postId);
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.filter(p => p.id !== postId));
      toast.success('Post deleted');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setActionLoading(null);
    }
  };

  const pinPost = async (postId: string, isPinned: boolean) => {
    setActionLoading(postId);
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ is_pinned: !isPinned })
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_pinned: !isPinned } : p));
      toast.success(isPinned ? 'Post unpinned' : 'Post pinned');
    } catch (error) {
      console.error('Error pinning post:', error);
      toast.error('Failed to pin post');
    } finally {
      setActionLoading(null);
    }
  };

  const moderateComment = async (commentId: string, status: 'approved' | 'rejected') => {
    setActionLoading(commentId);
    try {
      const { error } = await supabase
        .from('community_comments')
        .update({ moderation_status: status })
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success(`Comment ${status}`);
    } catch (error) {
      console.error('Error moderating comment:', error);
      toast.error('Failed to moderate comment');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteComment = async (commentId: string) => {
    setActionLoading(commentId);
    try {
      const { error } = await supabase
        .from('community_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    } finally {
      setActionLoading(null);
    }
  };

  const reviewReport = async (reportId: string, status: 'reviewed' | 'dismissed') => {
    setActionLoading(reportId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('community_reports')
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (error) throw error;

      setReports(prev => prev.filter(r => r.id !== reportId));
      toast.success(`Report ${status}`);
    } catch (error) {
      console.error('Error reviewing report:', error);
      toast.error('Failed to review report');
    } finally {
      setActionLoading(null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Community Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="posts" className="space-y-4">
            <TabsList className="bg-gray-800/50">
              <TabsTrigger value="posts">
                Posts
                {posts.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {posts.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="comments">
                Comments
                {comments.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {comments.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="reports">
                Reports
                {reports.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {reports.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              <ScrollArea className="h-[600px]">
                {posts.length === 0 ? (
                  <div className="text-center py-12 text-white/60">
                    <Eye className="h-12 w-12 mx-auto mb-3 text-white/20" />
                    <p>No posts pending moderation</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Card key={post.id} className="bg-gray-800/30 border-white/5">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              {post.profiles?.avatar_url ? (
                                <AvatarImage src={post.profiles.avatar_url} />
                              ) : (
                                <AvatarFallback>
                                  {post.profiles ? getInitials(post.profiles.full_name || post.profiles.username) : 'U'}
                                </AvatarFallback>
                              )}
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-white text-sm">
                                  {post.profiles?.full_name || post.profiles?.username}
                                </p>
                                <Badge variant={post.moderation_status === 'flagged' ? 'destructive' : 'secondary'}>
                                  {post.moderation_status}
                                </Badge>
                                <span className="text-xs text-white/50">
                                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                </span>
                              </div>

                              <p className="text-white/80 text-sm mt-2 whitespace-pre-line">
                                {post.content}
                              </p>

                              {post.media_urls && post.media_urls.length > 0 && (
                                <div className="mt-2 grid grid-cols-4 gap-2">
                                  {post.media_urls.slice(0, 4).map((url, i) => (
                                    <img
                                      key={i}
                                      src={url}
                                      alt={`Media ${i + 1}`}
                                      className="w-full h-20 object-cover rounded"
                                    />
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center gap-2 mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => moderatePost(post.id, 'approved')}
                                  disabled={actionLoading === post.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => moderatePost(post.id, 'rejected')}
                                  disabled={actionLoading === post.id}
                                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => pinPost(post.id, post.is_pinned)}
                                  disabled={actionLoading === post.id}
                                  className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
                                >
                                  <Pin className="h-3 w-3 mr-1" />
                                  {post.is_pinned ? 'Unpin' : 'Pin'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deletePost(post.id)}
                                  disabled={actionLoading === post.id}
                                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <ScrollArea className="h-[600px]">
                {comments.length === 0 ? (
                  <div className="text-center py-12 text-white/60">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-white/20" />
                    <p>No comments pending moderation</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id} className="bg-gray-800/30 border-white/5">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              {comment.profiles?.avatar_url ? (
                                <AvatarImage src={comment.profiles.avatar_url} />
                              ) : (
                                <AvatarFallback>
                                  {comment.profiles ? getInitials(comment.profiles.full_name || comment.profiles.username) : 'U'}
                                </AvatarFallback>
                              )}
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-white text-sm">
                                  {comment.profiles?.full_name || comment.profiles?.username}
                                </p>
                                <span className="text-xs text-white/50">
                                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </span>
                              </div>

                              <p className="text-white/80 text-sm mt-2">
                                {comment.content}
                              </p>

                              <div className="flex items-center gap-2 mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => moderateComment(comment.id, 'approved')}
                                  disabled={actionLoading === comment.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => moderateComment(comment.id, 'rejected')}
                                  disabled={actionLoading === comment.id}
                                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteComment(comment.id)}
                                  disabled={actionLoading === comment.id}
                                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <ScrollArea className="h-[600px]">
                {reports.length === 0 ? (
                  <div className="text-center py-12 text-white/60">
                    <Flag className="h-12 w-12 mx-auto mb-3 text-white/20" />
                    <p>No pending reports</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <Card key={report.id} className="bg-gray-800/30 border-white/5">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Flag className="h-4 w-4 text-red-500" />
                              <p className="font-medium text-white text-sm">
                                Report from {report.reporter?.username}
                              </p>
                              <span className="text-xs text-white/50">
                                {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                              </span>
                            </div>

                            <p className="text-white/80 text-sm">
                              <span className="text-white/60">Reason:</span> {report.reason}
                            </p>

                            {report.post && (
                              <div className="bg-gray-900/50 p-3 rounded">
                                <p className="text-xs text-white/50 mb-1">Reported post:</p>
                                <p className="text-white/80 text-sm line-clamp-3">
                                  {report.post.content}
                                </p>
                              </div>
                            )}

                            {report.comment && (
                              <div className="bg-gray-900/50 p-3 rounded">
                                <p className="text-xs text-white/50 mb-1">Reported comment:</p>
                                <p className="text-white/80 text-sm">
                                  {report.comment.content}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => reviewReport(report.id, 'reviewed')}
                                disabled={actionLoading === report.id}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Take Action
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => reviewReport(report.id, 'dismissed')}
                                disabled={actionLoading === report.id}
                                className="border-gray-500 text-gray-400 hover:bg-gray-500/10"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
