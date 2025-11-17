import { useState } from 'react';
import { Plus, TrendingUp, Users, Hash } from 'lucide-react';
import PostFeed from './PostFeed';
import CreatePostModal from './CreatePostModal';
import CommentsList from './CommentsList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export default function CommunityFeedPage() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<'all' | 'following'>('all');

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Community Feed</h1>
            <p className="text-white/60">Connect with fans and share your moments</p>
          </div>

          <Button
            onClick={() => setShowCreatePost(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>

        <Tabs
          value={feedType}
          onValueChange={(v) => setFeedType(v as 'all' | 'following')}
          className="mb-6"
        >
          <TabsList className="bg-gray-900/50 border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              For You
            </TabsTrigger>
            <TabsTrigger value="following" className="data-[state=active]:bg-purple-600">
              <Users className="h-4 w-4 mr-2" />
              Following
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <PostFeed
              onCommentClick={(postId) => setSelectedPostForComments(postId)}
            />
          </TabsContent>

          <TabsContent value="following" className="mt-6">
            <PostFeed
              options={{ following_only: true }}
              onCommentClick={(postId) => setSelectedPostForComments(postId)}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Card className="bg-gray-900/50 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Hash className="h-5 w-5 mr-2 text-purple-400" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {['music', 'dj', 'festival', 'party', 'beats'].map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center justify-between p-3 bg-black/30 rounded-lg hover:bg-black/50 cursor-pointer transition-colors"
                  >
                    <span className="text-white/80">#{tag}</span>
                    <span className="text-white/40 text-sm">Trending</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreatePostModal
        open={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={() => {
          setShowCreatePost(false);
        }}
      />

      {selectedPostForComments && (
        <CommentsList
          postId={selectedPostForComments}
          open={!!selectedPostForComments}
          onClose={() => setSelectedPostForComments(null)}
        />
      )}
    </div>
  );
}
