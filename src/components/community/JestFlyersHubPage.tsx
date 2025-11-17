import { useState } from 'react';
import { Plus, TrendingUp, Users } from 'lucide-react';
import PostFeed from './PostFeed';
import CreatePostModalNew from './CreatePostModalNew';
import CommentsListNew from './CommentsListNew';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '../../contexts/auth';
import { toast } from 'sonner';

const JestFlyersHubPage = () => {
  const { currentUser } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<'all' | 'following'>('all');

  const handleCreatePost = () => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para criar um post');
      return;
    }
    setShowCreatePost(true);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-12 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              JestFlyers Hub
            </h1>
            <p className="text-white/70">Conecte-se com a comunidade e veja o que está acontecendo.</p>
          </div>

          <Button
            onClick={handleCreatePost}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Post
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
      </div>

      <CreatePostModalNew
        open={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={() => {
          setShowCreatePost(false);
        }}
      />

      {selectedPostForComments && (
        <CommentsListNew
          postId={selectedPostForComments}
          open={!!selectedPostForComments}
          onClose={() => setSelectedPostForComments(null)}
        />
      )}
    </div>
  );
};

export default JestFlyersHubPage;
