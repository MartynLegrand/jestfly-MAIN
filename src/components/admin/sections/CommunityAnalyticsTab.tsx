import { useState, useEffect } from 'react';
import { TrendingUp, Users, MessageSquare, Heart, Flag, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { communityAnalytics } from '@/utils/communityAnalytics';

interface CommunityStats {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalFollows: number;
  totalReports: number;
  activeUsers: number;
  postsToday: number;
  commentsToday: number;
  reportsPending: number;
}

export default function CommunityAnalyticsTab() {
  const [stats, setStats] = useState<CommunityStats>({
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    totalFollows: 0,
    totalReports: 0,
    activeUsers: 0,
    postsToday: 0,
    commentsToday: 0,
    reportsPending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 300000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const timeRanges = {
        '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };
      const startTime = timeRanges[timeRange];

      const [
        postsResult,
        commentsResult,
        likesResult,
        followsResult,
        reportsResult,
        postsTodayResult,
        commentsTodayResult,
        reportsPendingResult,
      ] = await Promise.all([
        supabase
          .from('community_posts')
          .select('id', { count: 'exact', head: true })
          .eq('is_published', true),
        supabase
          .from('community_comments')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('community_likes')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('community_follows')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('community_reports')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('community_posts')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', startTime.toISOString()),
        supabase
          .from('community_comments')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', startTime.toISOString()),
        supabase
          .from('community_reports')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
      ]);

      // Get active users (users who posted or commented in the time range)
      const { data: activePosts } = await supabase
        .from('community_posts')
        .select('user_id')
        .gte('created_at', startTime.toISOString());

      const { data: activeComments } = await supabase
        .from('community_comments')
        .select('user_id')
        .gte('created_at', startTime.toISOString());

      const activeUserIds = new Set([
        ...(activePosts?.map(p => p.user_id) || []),
        ...(activeComments?.map(c => c.user_id) || []),
      ]);

      setStats({
        totalPosts: postsResult.count || 0,
        totalComments: commentsResult.count || 0,
        totalLikes: likesResult.count || 0,
        totalFollows: followsResult.count || 0,
        totalReports: reportsResult.count || 0,
        activeUsers: activeUserIds.size,
        postsToday: postsTodayResult.count || 0,
        commentsToday: commentsTodayResult.count || 0,
        reportsPending: reportsPendingResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching community stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const performanceSummary = communityAnalytics.getPerformanceSummary();
  const engagementSummary = communityAnalytics.getEngagementSummary();

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    trend, 
    color = 'text-white' 
  }: { 
    title: string; 
    value: number | string; 
    icon: React.ReactNode; 
    trend?: string; 
    color?: string;
  }) => (
    <Card className="bg-gray-900/50 border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm font-medium">{title}</p>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
            {trend && (
              <Badge variant="secondary" className="mt-2 bg-green-900/30 text-green-400">
                {trend}
              </Badge>
            )}
          </div>
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Community Analytics</h2>
          <p className="text-white/60 text-sm">Monitor community health and engagement</p>
        </div>

        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
          <TabsList className="bg-gray-800/50">
            <TabsTrigger value="24h">24 Hours</TabsTrigger>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Users"
          value={loading ? '-' : stats.activeUsers}
          icon={<Users className="h-6 w-6 text-purple-400" />}
          color="text-purple-400"
        />
        <StatCard
          title="Posts"
          value={loading ? '-' : stats.postsToday}
          icon={<MessageSquare className="h-6 w-6 text-blue-400" />}
          color="text-blue-400"
        />
        <StatCard
          title="Comments"
          value={loading ? '-' : stats.commentsToday}
          icon={<Heart className="h-6 w-6 text-pink-400" />}
          color="text-pink-400"
        />
        <StatCard
          title="Reports Pending"
          value={loading ? '-' : stats.reportsPending}
          icon={<Flag className="h-6 w-6 text-red-400" />}
          color={stats.reportsPending > 10 ? 'text-red-400' : 'text-green-400'}
        />
      </div>

      {/* Detailed Stats */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-800/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gray-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  All-Time Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Posts</span>
                  <span className="text-white font-semibold">{stats.totalPosts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Comments</span>
                  <span className="text-white font-semibold">{stats.totalComments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Likes</span>
                  <span className="text-white font-semibold">{stats.totalLikes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Follows</span>
                  <span className="text-white font-semibold">{stats.totalFollows}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Reports</span>
                  <span className="text-white font-semibold">{stats.totalReports}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  Engagement Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Avg Comments/Post</span>
                  <span className="text-white font-semibold">
                    {stats.totalPosts > 0 
                      ? (stats.totalComments / stats.totalPosts).toFixed(1)
                      : '0'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Avg Likes/Post</span>
                  <span className="text-white font-semibold">
                    {stats.totalPosts > 0 
                      ? (stats.totalLikes / stats.totalPosts).toFixed(1)
                      : '0'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Report Rate</span>
                  <span className="text-white font-semibold">
                    {stats.totalPosts > 0 
                      ? ((stats.totalReports / stats.totalPosts) * 100).toFixed(2)
                      : '0'
                    }%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Active User Rate</span>
                  <Badge variant="secondary" className="bg-green-900/30 text-green-400">
                    {stats.activeUsers > 0 ? 'Healthy' : 'Low'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-gray-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Performance Metrics (Client-Side)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-white/60 text-sm mb-2">Average Operation Time</p>
                  <p className="text-2xl font-bold text-white">
                    {performanceSummary.avgDuration.toFixed(0)}ms
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-2">Success Rate</p>
                  <p className="text-2xl font-bold text-green-400">
                    {performanceSummary.successRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-2">Total Operations</p>
                  <p className="text-2xl font-bold text-white">
                    {performanceSummary.totalOperations}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-2">Slow Operations</p>
                  <p className={`text-2xl font-bold ${performanceSummary.slowOperations > 5 ? 'text-red-400' : 'text-green-400'}`}>
                    {performanceSummary.slowOperations}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-sm">
                  <strong>Note:</strong> Performance metrics are tracked client-side and reset on page refresh.
                  For production monitoring, integrate with analytics service (e.g., Google Analytics, Sentry).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card className="bg-gray-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Engagement Events (Session)</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(engagementSummary).length === 0 ? (
                <p className="text-white/60 text-center py-8">
                  No engagement events tracked yet in this session.
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(engagementSummary).map(([action, count]) => (
                    <div key={action} className="flex justify-between items-center">
                      <span className="text-white/70 capitalize">
                        {action.replace(/_/g, ' ')}
                      </span>
                      <Badge variant="secondary" className="bg-purple-900/30 text-purple-400">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
