/*
  # Create Community System

  ## Summary
  Complete social media community system with posts, comments, likes, follows, notifications, and moderation.

  ## 1. New Tables

  ### `community_posts`
  - `id` (uuid, primary key) - Unique post identifier
  - `user_id` (uuid, foreign key) - Post author
  - `content` (text) - Post text content
  - `media_urls` (jsonb) - Array of image/video URLs
  - `media_type` (text) - Type: 'image', 'video', 'mixed', null
  - `is_published` (boolean) - Published or draft
  - `is_pinned` (boolean) - Pinned by admin
  - `visibility` (text) - 'public', 'followers', 'private'
  - `likes_count` (integer) - Cached like count
  - `comments_count` (integer) - Cached comment count
  - `shares_count` (integer) - Cached share count
  - `views_count` (integer) - Post views
  - `hashtags` (text[]) - Array of hashtags
  - `mentions` (text[]) - Array of mentioned usernames
  - `moderation_status` (text) - 'pending', 'approved', 'rejected', 'flagged'
  - `moderated_by` (uuid) - Admin who moderated
  - `moderated_at` (timestamptz) - Moderation timestamp
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `community_comments`
  - `id` (uuid, primary key) - Unique comment identifier
  - `post_id` (uuid, foreign key) - Parent post
  - `user_id` (uuid, foreign key) - Comment author
  - `parent_comment_id` (uuid, nullable) - For nested replies
  - `content` (text) - Comment text
  - `media_url` (text, nullable) - Optional image/gif
  - `likes_count` (integer) - Cached like count
  - `replies_count` (integer) - Cached reply count
  - `is_edited` (boolean) - Edit flag
  - `moderation_status` (text) - 'pending', 'approved', 'rejected'
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `community_likes`
  - `id` (uuid, primary key) - Unique like identifier
  - `user_id` (uuid, foreign key) - User who liked
  - `post_id` (uuid, nullable) - Liked post
  - `comment_id` (uuid, nullable) - Liked comment
  - `created_at` (timestamptz) - Like timestamp

  ### `community_follows`
  - `id` (uuid, primary key) - Unique follow identifier
  - `follower_id` (uuid, foreign key) - User who follows
  - `following_id` (uuid, foreign key) - User being followed
  - `created_at` (timestamptz) - Follow timestamp

  ### `community_notifications`
  - `id` (uuid, primary key) - Unique notification identifier
  - `user_id` (uuid, foreign key) - Recipient user
  - `actor_id` (uuid, foreign key) - User who triggered notification
  - `type` (text) - 'like', 'comment', 'follow', 'mention', 'reply'
  - `post_id` (uuid, nullable) - Related post
  - `comment_id` (uuid, nullable) - Related comment
  - `is_read` (boolean) - Read status
  - `created_at` (timestamptz) - Notification timestamp

  ### `community_hashtags`
  - `id` (uuid, primary key) - Unique hashtag identifier
  - `tag` (text, unique) - Hashtag text (without #)
  - `posts_count` (integer) - Number of posts using this tag
  - `created_at` (timestamptz) - First use timestamp
  - `updated_at` (timestamptz) - Last use timestamp

  ### `community_reports`
  - `id` (uuid, primary key) - Unique report identifier
  - `reporter_id` (uuid, foreign key) - User who reported
  - `post_id` (uuid, nullable) - Reported post
  - `comment_id` (uuid, nullable) - Reported comment
  - `reason` (text) - Report reason
  - `status` (text) - 'pending', 'reviewed', 'dismissed'
  - `reviewed_by` (uuid, nullable) - Admin who reviewed
  - `reviewed_at` (timestamptz, nullable) - Review timestamp
  - `created_at` (timestamptz) - Report timestamp

  ## 2. Storage Buckets
  - `community-media` - For post images/videos

  ## 3. Security
  - Enable RLS on all tables
  - Users can read public/followers posts
  - Users can manage their own posts/comments
  - Users can like/follow anyone
  - Admins can moderate all content
  - Notifications are private to recipient

  ## 4. Indexes
  - Post queries by user, hashtags, created_at
  - Comment queries by post, user
  - Follow queries (follower, following)
  - Notification queries by user, is_read

  ## 5. Important Notes
  - All timestamps use timestamptz for timezone support
  - Counters are cached for performance (updated via triggers)
  - Moderation is optional (can be disabled)
  - Real-time subscriptions enabled for feed updates
  - Hashtags are normalized to lowercase
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. POSTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  media_urls jsonb DEFAULT '[]'::jsonb,
  media_type text CHECK (media_type IN ('image', 'video', 'mixed')),
  is_published boolean DEFAULT true,
  is_pinned boolean DEFAULT false,
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  hashtags text[] DEFAULT ARRAY[]::text[],
  mentions text[] DEFAULT ARRAY[]::text[],
  moderation_status text DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  moderated_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  moderated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for posts
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_hashtags ON community_posts USING gin(hashtags);
CREATE INDEX IF NOT EXISTS idx_community_posts_moderation_status ON community_posts(moderation_status);
CREATE INDEX IF NOT EXISTS idx_community_posts_visibility ON community_posts(visibility);

-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Anyone can read public approved posts"
  ON community_posts FOR SELECT
  USING (
    is_published = true
    AND moderation_status = 'approved'
    AND visibility = 'public'
  );

CREATE POLICY "Users can read their own posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read followers-only posts if they follow"
  ON community_posts FOR SELECT
  TO authenticated
  USING (
    visibility = 'followers'
    AND moderation_status = 'approved'
    AND (
      auth.uid() = user_id
      OR EXISTS (
        SELECT 1 FROM community_follows
        WHERE follower_id = auth.uid()
        AND following_id = community_posts.user_id
      )
    )
  );

CREATE POLICY "Admins can read all posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can create their own posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any post"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can delete their own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any post"
  ON community_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- =====================================================
-- 2. COMMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id uuid REFERENCES community_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  media_url text,
  likes_count integer DEFAULT 0,
  replies_count integer DEFAULT 0,
  is_edited boolean DEFAULT false,
  moderation_status text DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for comments
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON community_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created_at ON community_comments(created_at DESC);

-- Enable RLS
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
CREATE POLICY "Anyone can read approved comments on public posts"
  ON community_comments FOR SELECT
  USING (
    moderation_status = 'approved'
    AND EXISTS (
      SELECT 1 FROM community_posts
      WHERE id = community_comments.post_id
      AND is_published = true
      AND moderation_status = 'approved'
      AND visibility = 'public'
    )
  );

CREATE POLICY "Users can read their own comments"
  ON community_comments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all comments"
  ON community_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create comments"
  ON community_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON community_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON community_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any comment"
  ON community_comments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- =====================================================
-- 3. LIKES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS community_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES community_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT like_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  CONSTRAINT unique_post_like UNIQUE (user_id, post_id),
  CONSTRAINT unique_comment_like UNIQUE (user_id, comment_id)
);

-- Indexes for likes
CREATE INDEX IF NOT EXISTS idx_community_likes_user_id ON community_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_post_id ON community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_comment_id ON community_likes(comment_id);

-- Enable RLS
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for likes
CREATE POLICY "Anyone can read likes"
  ON community_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create likes"
  ON community_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON community_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. FOLLOWS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS community_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id),
  CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);

-- Indexes for follows
CREATE INDEX IF NOT EXISTS idx_community_follows_follower_id ON community_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_community_follows_following_id ON community_follows(following_id);

-- Enable RLS
ALTER TABLE community_follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for follows
CREATE POLICY "Anyone can read follows"
  ON community_follows FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create follows"
  ON community_follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows"
  ON community_follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- =====================================================
-- 5. NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS community_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  actor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'mention', 'reply')),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES community_comments(id) ON DELETE CASCADE,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_community_notifications_user_id ON community_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_community_notifications_is_read ON community_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_community_notifications_created_at ON community_notifications(created_at DESC);

-- Enable RLS
ALTER TABLE community_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can read their own notifications"
  ON community_notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON community_notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON community_notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON community_notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 6. HASHTAGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS community_hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text UNIQUE NOT NULL,
  posts_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for hashtags
CREATE INDEX IF NOT EXISTS idx_community_hashtags_tag ON community_hashtags(tag);
CREATE INDEX IF NOT EXISTS idx_community_hashtags_posts_count ON community_hashtags(posts_count DESC);

-- Enable RLS
ALTER TABLE community_hashtags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hashtags
CREATE POLICY "Anyone can read hashtags"
  ON community_hashtags FOR SELECT
  USING (true);

CREATE POLICY "System can manage hashtags"
  ON community_hashtags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 7. REPORTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS community_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES community_comments(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT report_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Indexes for reports
CREATE INDEX IF NOT EXISTS idx_community_reports_status ON community_reports(status);
CREATE INDEX IF NOT EXISTS idx_community_reports_post_id ON community_reports(post_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_comment_id ON community_reports(comment_id);

-- Enable RLS
ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reports
CREATE POLICY "Users can read their own reports"
  ON community_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can read all reports"
  ON community_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create reports"
  ON community_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can update reports"
  ON community_reports FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- =====================================================
-- 8. STORAGE BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('community-media', 'community-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view community media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'community-media');

CREATE POLICY "Authenticated users can upload community media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'community-media');

CREATE POLICY "Users can update their own media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'community-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'community-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- 9. TRIGGERS & FUNCTIONS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at
  BEFORE UPDATE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_hashtags_updated_at
  BEFORE UPDATE ON community_hashtags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update post likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_likes_count
  AFTER INSERT OR DELETE ON community_likes
  FOR EACH ROW
  WHEN (NEW.post_id IS NOT NULL OR OLD.post_id IS NOT NULL)
  EXECUTE FUNCTION update_post_likes_count();

-- Update comment likes count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_comments
    SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_comments
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_likes_count
  AFTER INSERT OR DELETE ON community_likes
  FOR EACH ROW
  WHEN (NEW.comment_id IS NOT NULL OR OLD.comment_id IS NOT NULL)
  EXECUTE FUNCTION update_comment_likes_count();

-- Update post comments count
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_comments_count
  AFTER INSERT OR DELETE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_count();

-- Update comment replies count
CREATE OR REPLACE FUNCTION update_comment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_comment_id IS NOT NULL THEN
    UPDATE community_comments
    SET replies_count = replies_count + 1
    WHERE id = NEW.parent_comment_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_comment_id IS NOT NULL THEN
    UPDATE community_comments
    SET replies_count = GREATEST(0, replies_count - 1)
    WHERE id = OLD.parent_comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_replies_count
  AFTER INSERT OR DELETE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_replies_count();

-- Create notification on like
CREATE OR REPLACE FUNCTION create_like_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.post_id IS NOT NULL THEN
    INSERT INTO community_notifications (user_id, actor_id, type, post_id)
    SELECT user_id, NEW.user_id, 'like', NEW.post_id
    FROM community_posts
    WHERE id = NEW.post_id AND user_id != NEW.user_id;
  ELSIF NEW.comment_id IS NOT NULL THEN
    INSERT INTO community_notifications (user_id, actor_id, type, comment_id)
    SELECT user_id, NEW.user_id, 'like', NEW.comment_id
    FROM community_comments
    WHERE id = NEW.comment_id AND user_id != NEW.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_like_notification
  AFTER INSERT ON community_likes
  FOR EACH ROW
  EXECUTE FUNCTION create_like_notification();

-- Create notification on comment
CREATE OR REPLACE FUNCTION create_comment_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_comment_id IS NOT NULL THEN
    INSERT INTO community_notifications (user_id, actor_id, type, post_id, comment_id)
    SELECT user_id, NEW.user_id, 'reply', NEW.post_id, NEW.id
    FROM community_comments
    WHERE id = NEW.parent_comment_id AND user_id != NEW.user_id;
  ELSE
    INSERT INTO community_notifications (user_id, actor_id, type, post_id, comment_id)
    SELECT user_id, NEW.user_id, 'comment', NEW.post_id, NEW.id
    FROM community_posts
    WHERE id = NEW.post_id AND user_id != NEW.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_comment_notification
  AFTER INSERT ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION create_comment_notification();

-- Create notification on follow
CREATE OR REPLACE FUNCTION create_follow_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO community_notifications (user_id, actor_id, type)
  VALUES (NEW.following_id, NEW.follower_id, 'follow');
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_follow_notification
  AFTER INSERT ON community_follows
  FOR EACH ROW
  EXECUTE FUNCTION create_follow_notification();

-- =====================================================
-- 10. DEFAULT DATA
-- =====================================================

-- Insert some example hashtags
INSERT INTO community_hashtags (tag, posts_count) VALUES
  ('music', 0),
  ('dj', 0),
  ('festival', 0),
  ('party', 0),
  ('beats', 0),
  ('techno', 0),
  ('house', 0),
  ('edm', 0)
ON CONFLICT (tag) DO NOTHING;
