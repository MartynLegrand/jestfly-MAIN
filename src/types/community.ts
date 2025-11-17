export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type PostVisibility = 'public' | 'followers' | 'private';
export type MediaType = 'image' | 'video' | 'mixed';
export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'reply';
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed';

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  media_type?: MediaType;
  is_published: boolean;
  is_pinned: boolean;
  visibility: PostVisibility;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  hashtags: string[];
  mentions: string[];
  moderation_status: ModerationStatus;
  moderated_by?: string;
  moderated_at?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    username: string;
    avatar_url?: string;
    full_name?: string;
  };
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string;
  content: string;
  media_url?: string;
  likes_count: number;
  replies_count: number;
  is_edited: boolean;
  moderation_status: ModerationStatus;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    username: string;
    avatar_url?: string;
    full_name?: string;
  };
  is_liked?: boolean;
  replies?: CommunityComment[];
}

export interface CommunityLike {
  id: string;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  created_at: string;
}

export interface CommunityFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface CommunityNotification {
  id: string;
  user_id: string;
  actor_id: string;
  type: NotificationType;
  post_id?: string;
  comment_id?: string;
  is_read: boolean;
  created_at: string;
  actor?: {
    id: string;
    username: string;
    avatar_url?: string;
    full_name?: string;
  };
  post?: {
    id: string;
    content: string;
  };
  comment?: {
    id: string;
    content: string;
  };
}

export interface CommunityHashtag {
  id: string;
  tag: string;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityReport {
  id: string;
  reporter_id: string;
  post_id?: string;
  comment_id?: string;
  reason: string;
  status: ReportStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface CreatePostData {
  content: string;
  media_urls?: string[];
  media_type?: MediaType;
  visibility?: PostVisibility;
  hashtags?: string[];
  mentions?: string[];
}

export interface UpdatePostData {
  content?: string;
  is_published?: boolean;
  visibility?: PostVisibility;
}

export interface CreateCommentData {
  post_id: string;
  content: string;
  parent_comment_id?: string;
  media_url?: string;
}

export interface UserStats {
  posts_count: number;
  followers_count: number;
  following_count: number;
  likes_received: number;
}

export interface FeedOptions {
  limit?: number;
  offset?: number;
  user_id?: string;
  hashtag?: string;
  following_only?: boolean;
}
