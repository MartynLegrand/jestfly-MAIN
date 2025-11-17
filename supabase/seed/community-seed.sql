-- Community Seed Data
-- This script seeds the database with sample community content for testing and demonstration

-- Note: This assumes you have at least one user in the profiles table
-- Replace 'YOUR_USER_ID' with an actual user ID from your profiles table

-- Insert sample community posts
DO $$
DECLARE
    sample_user_id uuid;
BEGIN
    -- Get a sample user ID (or create a test user if needed)
    SELECT id INTO sample_user_id FROM profiles LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        -- Insert welcome post
        INSERT INTO community_posts (
            user_id,
            content,
            media_urls,
            media_type,
            is_published,
            visibility,
            hashtags,
            moderation_status,
            likes_count,
            comments_count,
            views_count
        ) VALUES (
            sample_user_id,
            'Welcome to the JestFly Community! 🎵🎧

This is your space to connect with fellow music lovers, share your DJ sets, discover new tracks, and be part of an amazing community of creators and fans.

What brings you here today? Drop a comment and introduce yourself! 👇',
            ARRAY[]::text[],
            NULL,
            true,
            'public',
            ARRAY['welcome', 'community', 'music', 'dj'],
            'approved',
            42,
            15,
            387
        );

        -- Insert DJ tips post
        INSERT INTO community_posts (
            user_id,
            content,
            media_urls,
            media_type,
            is_published,
            visibility,
            hashtags,
            moderation_status,
            likes_count,
            comments_count,
            views_count
        ) VALUES (
            sample_user_id,
            '🎛️ DJ Pro Tip of the Day:

Master your transitions by practicing beatmatching for at least 30 minutes daily. Start with tracks in the same genre and tempo range (±5 BPM).

Remember: smooth transitions = happy crowds! 🔥

What''s your go-to mixing technique? Share below! 👇',
            ARRAY[]::text[],
            NULL,
            true,
            'public',
            ARRAY['dj', 'tips', 'mixing', 'beatmatching', 'music'],
            'approved',
            128,
            34,
            892
        );

        -- Insert festival announcement post
        INSERT INTO community_posts (
            user_id,
            content,
            media_urls,
            media_type,
            is_published,
            visibility,
            hashtags,
            moderation_status,
            likes_count,
            comments_count,
            views_count
        ) VALUES (
            sample_user_id,
            '🎉 HUGE ANNOUNCEMENT 🎉

We''re bringing the JestFly experience to festivals worldwide this summer! 

✨ 12 cities
✨ 50+ DJs
✨ Exclusive NFT drops
✨ Meet & Greet sessions

First city announcement coming Monday! Any guesses where we''ll be? 🤔

#JestFlyWorldTour',
            ARRAY[]::text[],
            NULL,
            true,
            'public',
            ARRAY['festival', 'tour', 'announcement', 'music', 'live'],
            'approved',
            567,
            123,
            2451
        );

        -- Insert gear discussion post
        INSERT INTO community_posts (
            user_id,
            content,
            media_urls,
            media_type,
            is_published,
            visibility,
            hashtags,
            moderation_status,
            likes_count,
            comments_count,
            views_count
        ) VALUES (
            sample_user_id,
            'Looking to upgrade my setup! 🎧

Currently using Pioneer DDJ-400. Ready to level up.

Torn between:
🔸 Pioneer DDJ-1000
🔸 Denon Prime 4

What would you choose and why? Drop your thoughts below! 

Budget: $2000-2500',
            ARRAY[]::text[],
            NULL,
            true,
            'public',
            ARRAY['gear', 'dj', 'equipment', 'advice'],
            'approved',
            87,
            56,
            643
        );

        -- Insert music production post
        INSERT INTO community_posts (
            user_id,
            content,
            media_urls,
            media_type,
            is_published,
            visibility,
            hashtags,
            moderation_status,
            likes_count,
            comments_count,
            views_count
        ) VALUES (
            sample_user_id,
            'Just finished my first original track! 🎶✨

Been working on this for 3 months. House/Tech House vibes.

Link in bio to listen! Would love your feedback. 

What DAW do you use for production?',
            ARRAY[]::text[],
            NULL,
            true,
            'public',
            ARRAY['production', 'music', 'house', 'techhouse', 'newmusic'],
            'approved',
            234,
            78,
            1234
        );

        -- Insert community hashtags
        INSERT INTO community_hashtags (tag, posts_count) VALUES
            ('music', 5),
            ('dj', 4),
            ('welcome', 1),
            ('community', 1),
            ('tips', 1),
            ('mixing', 1),
            ('beatmatching', 1),
            ('festival', 1),
            ('tour', 1),
            ('announcement', 1),
            ('live', 1),
            ('gear', 1),
            ('equipment', 1),
            ('advice', 1),
            ('production', 1),
            ('house', 1),
            ('techhouse', 1),
            ('newmusic', 1)
        ON CONFLICT (tag) DO UPDATE SET
            posts_count = community_hashtags.posts_count + EXCLUDED.posts_count,
            updated_at = NOW();

        RAISE NOTICE 'Community seed data inserted successfully!';
    ELSE
        RAISE NOTICE 'No users found. Please create at least one user before seeding community data.';
    END IF;
END $$;
