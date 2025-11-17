# Seed Data Guide
**JestFly Platform**

This guide explains how to populate your database with sample data for testing and development.

---

## Overview

Seed data is essential for:
- **Development:** Test features with realistic data
- **Demos:** Showcase functionality to stakeholders
- **QA:** Verify edge cases and workflows
- **Staging:** Mirror production-like environment

---

## Quick Start

### Option 1: SQL Scripts (Recommended)

```bash
# In Supabase SQL Editor, run these files in order:
1. seed-users.sql
2. seed-categories.sql
3. seed-products.sql
4. seed-nft.sql
5. seed-community.sql
```

### Option 2: Admin Dashboard

Use the admin panel to manually create content:
1. Login as admin
2. Navigate to relevant sections
3. Create products, posts, etc.

---

## Seed Data Scripts

### 1. User Profiles

```sql
-- Create sample users
-- Note: Auth users must be created via Supabase Auth or registration
-- This just adds profile data

INSERT INTO profiles (id, username, email, role, bio, avatar_url)
VALUES
  -- Admin user
  ('00000000-0000-0000-0000-000000000001', 'admin', 'admin@jestfly.com', 'admin', 'Platform Administrator', '/assets/avatars/admin.jpg'),
  
  -- Regular users
  ('00000000-0000-0000-0000-000000000002', 'johndoe', 'john@example.com', 'user', 'Music enthusiast and NFT collector', '/assets/avatars/john.jpg'),
  ('00000000-0000-0000-0000-000000000003', 'janedoe', 'jane@example.com', 'user', 'Artist and creator', '/assets/avatars/jane.jpg'),
  ('00000000-0000-0000-0000-000000000004', 'musicfan', 'fan@example.com', 'user', 'Love discovering new music', '/assets/avatars/fan.jpg')
ON CONFLICT (id) DO NOTHING;
```

**Note:** For real users, they must register through the app. These are just profiles for testing.

---

### 2. Site Configuration

```sql
-- Update homepage config
UPDATE site_config
SET config = '{
  "heroTitle": "MKSHA",
  "heroSubtitle": "It was the year 2076",
  "heroDescription": "Experience the future of music and digital collectibles",
  "showCrystal": true,
  "crystalAnimation": true,
  "showGallery": true,
  "ctaText": "Explore Now",
  "ctaLink": "/store",
  "backgroundColor": "#000000",
  "textColor": "#ffffff"
}'::jsonb
WHERE section = 'home';

-- Update store config
UPDATE site_config
SET config = '{
  "title": "Store",
  "description": "Browse our exclusive collection",
  "showCategories": true,
  "showFilters": true,
  "itemsPerPage": 12,
  "enableCart": true,
  "enableWishlist": true,
  "featuredCategory": "music"
}'::jsonb
WHERE section = 'store';

-- Update community config
UPDATE site_config
SET config = '{
  "title": "Community",
  "description": "Connect with fellow JestFlyers",
  "enablePosts": true,
  "enableComments": true,
  "enableLikes": true,
  "moderationEnabled": true,
  "postsPerPage": 20
}'::jsonb
WHERE section = 'community';
```

---

### 3. Homepage Hero Cards

```sql
-- Clear existing sample data
DELETE FROM homepage_hero_cards;

-- Add hero cards
INSERT INTO homepage_hero_cards (
  title, subtitle, description, image_url, button_text, button_url,
  gradient_from, gradient_to, order_index, is_active, animation_type
)
VALUES
  (
    'MKSHA',
    'It was the year 2076',
    'Experience the future of music, art, and digital collectibles in an immersive 3D environment',
    '/assets/hero/mksha.jpg',
    'Enter the Experience',
    '/store',
    '#8B5CF6',
    '#3B82F6',
    1,
    true,
    'fade-in'
  ),
  (
    'Exclusive NFTs',
    'Own a piece of history',
    'Limited edition digital collectibles with real-world utility',
    '/assets/hero/nft.jpg',
    'Browse NFTs',
    '/nft-store',
    '#F59E0B',
    '#EF4444',
    2,
    true,
    'slide-up'
  ),
  (
    'Join the Community',
    'Connect with creators',
    'Share your passion, discover new music, and collaborate with artists',
    '/assets/hero/community.jpg',
    'Join Now',
    '/community',
    '#10B981',
    '#3B82F6',
    3,
    true,
    'zoom-in'
  );
```

---

### 4. Store Categories

```sql
-- Add store categories
INSERT INTO store_categories (name, slug, description, icon, color, is_active, order_index)
VALUES
  ('Music', 'music', 'Albums, singles, and exclusive tracks', 'Music', '#8B5CF6', true, 1),
  ('Merchandise', 'merchandise', 'T-shirts, hoodies, and accessories', 'ShoppingBag', '#F59E0B', true, 2),
  ('Art', 'art', 'Digital and physical artwork', 'Palette', '#EF4444', true, 3),
  ('Collectibles', 'collectibles', 'Limited edition items', 'Star', '#10B981', true, 4),
  ('Events', 'events', 'Concert tickets and experiences', 'Calendar', '#3B82F6', true, 5)
ON CONFLICT (slug) DO NOTHING;
```

---

### 5. Store Products

```sql
-- Get category IDs
DO $$
DECLARE
  music_cat_id UUID;
  merch_cat_id UUID;
  art_cat_id UUID;
BEGIN
  SELECT id INTO music_cat_id FROM store_categories WHERE slug = 'music';
  SELECT id INTO merch_cat_id FROM store_categories WHERE slug = 'merchandise';
  SELECT id INTO art_cat_id FROM store_categories WHERE slug = 'art';

  -- Insert products
  INSERT INTO store_products (
    name, slug, description, category_id, price, compare_at_price,
    stock_quantity, sku, images, featured_image, is_featured, is_active, tags
  )
  VALUES
    -- Music products
    (
      'MKSHA - 2076 Album',
      'mksha-2076-album',
      'The complete 2076 experience. 15 tracks of futuristic soundscapes and immersive storytelling.',
      music_cat_id,
      29.99,
      39.99,
      1000,
      'MKS-2076-DIG',
      ARRAY['/assets/products/album-cover.jpg', '/assets/products/album-back.jpg'],
      '/assets/products/album-cover.jpg',
      true,
      true,
      ARRAY['album', 'digital', 'new']
    ),
    (
      'MKSHA - Title Track Single',
      'mksha-title-track',
      'The hit single that started it all. Digital download with exclusive artwork.',
      music_cat_id,
      1.99,
      NULL,
      NULL,
      'MKS-TITLE-DIG',
      ARRAY['/assets/products/single-cover.jpg'],
      '/assets/products/single-cover.jpg',
      false,
      true,
      ARRAY['single', 'digital']
    ),
    
    -- Merchandise
    (
      'MKSHA 2076 T-Shirt',
      'mksha-2076-tshirt',
      'Premium cotton t-shirt with official 2076 album artwork. Available in multiple sizes.',
      merch_cat_id,
      34.99,
      NULL,
      250,
      'MKS-TS-BLK-M',
      ARRAY['/assets/products/tshirt-front.jpg', '/assets/products/tshirt-back.jpg'],
      '/assets/products/tshirt-front.jpg',
      true,
      true,
      ARRAY['apparel', 'merchandise']
    ),
    (
      'MKSHA Logo Hoodie',
      'mksha-logo-hoodie',
      'Comfortable fleece hoodie with embroidered logo. Perfect for any season.',
      merch_cat_id,
      59.99,
      NULL,
      150,
      'MKS-HD-BLK-M',
      ARRAY['/assets/products/hoodie.jpg'],
      '/assets/products/hoodie.jpg',
      false,
      true,
      ARRAY['apparel', 'merchandise', 'featured']
    ),
    
    -- Art
    (
      '2076 Poster Set',
      '2076-poster-set',
      'Set of 3 limited edition posters featuring scenes from the 2076 universe.',
      art_cat_id,
      49.99,
      NULL,
      100,
      'MKS-PST-SET',
      ARRAY['/assets/products/poster1.jpg', '/assets/products/poster2.jpg', '/assets/products/poster3.jpg'],
      '/assets/products/poster1.jpg',
      true,
      true,
      ARRAY['art', 'poster', 'limited']
    );
END $$;
```

---

### 6. NFT Products

```sql
-- Get NFT category IDs
DO $$
DECLARE
  music_cat_id UUID;
  art_cat_id UUID;
BEGIN
  SELECT id INTO music_cat_id FROM nft_categories WHERE name = 'Music';
  SELECT id INTO art_cat_id FROM nft_categories WHERE name = 'Art';

  -- Insert NFT products
  INSERT INTO nft_products (
    name, slug, description, category_id, product_type, rarity,
    price_jest_coins, price_usd, payment_methods,
    max_supply, stock_available, image_url, is_active, is_featured
  )
  VALUES
    (
      'Genesis MKSHA NFT',
      'genesis-mksha-nft',
      'The first ever MKSHA NFT. Includes exclusive album access and VIP event entry.',
      music_cat_id,
      'digital',
      'legendary',
      10000,
      999.00,
      'both',
      100,
      75,
      '/assets/nft/genesis.jpg',
      true,
      true
    ),
    (
      '2076 Album Cover Art',
      '2076-album-cover-art',
      'Official album cover as collectible NFT. Signed by the artist.',
      art_cat_id,
      'digital',
      'rare',
      500,
      49.99,
      'both',
      500,
      420,
      '/assets/nft/album-cover.jpg',
      true,
      true
    ),
    (
      'MKSHA Concert Ticket + NFT',
      'mksha-concert-nft',
      'Physical concert ticket with commemorative NFT. Redeemable for future events.',
      music_cat_id,
      'hybrid',
      'epic',
      2500,
      199.99,
      'both',
      1000,
      856,
      '/assets/nft/concert.jpg',
      true,
      false
    );
END $$;
```

---

### 7. User Wallets

```sql
-- Create wallets for test users with some starting balance
INSERT INTO user_wallets (user_id, balance, total_earned, total_spent)
VALUES
  ('00000000-0000-0000-0000-000000000002', 5000, 5000, 0),
  ('00000000-0000-0000-0000-000000000003', 3000, 3500, 500),
  ('00000000-0000-0000-0000-000000000004', 1500, 2000, 500)
ON CONFLICT (user_id) DO NOTHING;
```

---

### 8. Rewards Missions

```sql
-- Add sample missions (some may already exist from migration)
INSERT INTO rewards_missions (
  title, description, mission_type, reward_amount,
  requirements, is_active, order_index
)
VALUES
  (
    'Welcome Bonus',
    'Complete your profile to earn Jest Coins',
    'profile_completion',
    500,
    '{"complete_profile": true}',
    true,
    1
  ),
  (
    'First Purchase',
    'Make your first purchase and earn bonus coins',
    'first_purchase',
    1000,
    '{"make_purchase": true}',
    true,
    2
  ),
  (
    'Social Butterfly',
    'Follow 10 community members',
    'social',
    250,
    '{"follow_count": 10}',
    true,
    3
  ),
  (
    'Content Creator',
    'Create your first community post',
    'content_creation',
    100,
    '{"create_post": true}',
    true,
    4
  )
ON CONFLICT (title) DO NOTHING;
```

---

### 9. Community Posts

```sql
-- Add sample community posts
INSERT INTO community_posts (
  user_id, content, post_type, media_urls, hashtags,
  is_published, moderation_status
)
VALUES
  (
    '00000000-0000-0000-0000-000000000002',
    'Just got my hands on the Genesis MKSHA NFT! The artwork is incredible 🔥 #MKSHA #NFT #Music',
    'text',
    ARRAY['/assets/community/post1.jpg'],
    ARRAY['MKSHA', 'NFT', 'Music'],
    true,
    'approved'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Can''t wait for the 2076 tour! Who else is going? #2076Tour #MKSHA',
    'text',
    NULL,
    ARRAY['2076Tour', 'MKSHA'],
    true,
    'approved'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'New album on repeat all week. Every track is a masterpiece. What''s your favorite? #MKSHA2076',
    'text',
    NULL,
    ARRAY['MKSHA2076'],
    true,
    'approved'
  );
```

---

### 10. Community Comments

```sql
-- Add sample comments to posts
DO $$
DECLARE
  post1_id UUID;
  post2_id UUID;
BEGIN
  -- Get first two post IDs
  SELECT id INTO post1_id FROM community_posts LIMIT 1 OFFSET 0;
  SELECT id INTO post2_id FROM community_posts LIMIT 1 OFFSET 1;

  -- Add comments
  INSERT INTO community_comments (
    post_id, user_id, content, parent_comment_id
  )
  VALUES
    (post1_id, '00000000-0000-0000-0000-000000000003', 'Welcome to the club! That NFT is 🔥', NULL),
    (post1_id, '00000000-0000-0000-0000-000000000004', 'So jealous! Sold out before I could get one', NULL),
    (post2_id, '00000000-0000-0000-0000-000000000002', 'I''ll be there! Can''t wait!', NULL);
END $$;
```

---

### 11. Press Kit Data

```sql
-- Update press kit configuration (if table exists)
UPDATE site_config
SET config = '{
  "artistName": "MKSHA",
  "genre": "Electronic / Futuristic",
  "bio": "MKSHA is a visionary artist creating immersive sonic experiences that transport listeners to the year 2076.",
  "highlights": [
    "Over 1M streams on first album",
    "Featured in top electronic music playlists",
    "Pioneering NFT integration in music"
  ],
  "pressContact": {
    "name": "Press Team",
    "email": "press@jestfly.com",
    "phone": "+1-555-0123"
  },
  "socialMedia": {
    "instagram": "@mksha2076",
    "twitter": "@mksha",
    "spotify": "mksha"
  },
  "downloadLinks": {
    "pressKit": "/downloads/mksha-press-kit.pdf",
    "photos": "/downloads/mksha-photos.zip",
    "logos": "/downloads/mksha-logos.zip"
  }
}'::jsonb
WHERE section = 'presskit';
```

---

## Verification Queries

After seeding, verify data:

```sql
-- Check user profiles
SELECT username, role FROM profiles ORDER BY created_at;

-- Check site config
SELECT section, jsonb_pretty(config) FROM site_config;

-- Check hero cards
SELECT title, is_active FROM homepage_hero_cards ORDER BY order_index;

-- Check store categories
SELECT name, is_active FROM store_categories ORDER BY order_index;

-- Check store products
SELECT name, price, stock_quantity, is_featured FROM store_products;

-- Check NFT products
SELECT name, rarity, price_jest_coins, price_usd FROM nft_products;

-- Check wallets
SELECT 
  p.username,
  w.balance,
  w.total_earned
FROM user_wallets w
JOIN profiles p ON w.user_id = p.id;

-- Check community posts
SELECT 
  p.username,
  cp.content,
  cp.created_at
FROM community_posts cp
JOIN profiles p ON cp.user_id = p.id
ORDER BY cp.created_at DESC;

-- Check comments
SELECT 
  p.username,
  c.content,
  c.created_at
FROM community_comments c
JOIN profiles p ON c.user_id = p.id
ORDER BY c.created_at DESC;
```

---

## Bulk Data Generation

For larger datasets, use this approach:

```sql
-- Generate 100 products
INSERT INTO store_products (name, slug, description, category_id, price, stock_quantity)
SELECT
  'Product ' || generate_series,
  'product-' || generate_series,
  'Description for product ' || generate_series,
  (SELECT id FROM store_categories ORDER BY random() LIMIT 1),
  (random() * 100)::numeric(10,2),
  (random() * 1000)::integer
FROM generate_series(1, 100);

-- Generate 50 community posts
INSERT INTO community_posts (user_id, content, post_type, is_published, moderation_status)
SELECT
  (SELECT id FROM profiles WHERE role = 'user' ORDER BY random() LIMIT 1),
  'This is test post number ' || generate_series,
  'text',
  true,
  'approved'
FROM generate_series(1, 50);
```

---

## Resetting Data

To clear all seed data and start fresh:

```sql
-- WARNING: This deletes ALL data!

-- Disable triggers temporarily
SET session_replication_role = 'replica';

-- Delete data (respects foreign keys)
DELETE FROM community_comments;
DELETE FROM community_posts;
DELETE FROM user_rewards;
DELETE FROM user_nft_inventory;
DELETE FROM product_transactions;
DELETE FROM shopping_cart;
DELETE FROM wishlist;
DELETE FROM store_order_items;
DELETE FROM store_orders;
DELETE FROM store_cart;
DELETE FROM store_products;
DELETE FROM nft_products;
DELETE FROM user_wallets;
DELETE FROM homepage_hero_cards;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Reset site_config to defaults
UPDATE site_config SET config = '{}';
```

---

## Best Practices

1. **Start Small:** Add a few records first, test, then add more
2. **Use Transactions:** Wrap multiple inserts in a transaction
3. **Check Conflicts:** Use `ON CONFLICT DO NOTHING` to avoid errors
4. **Verify Relations:** Ensure foreign keys exist before inserting
5. **Test in Dev First:** Never seed production directly
6. **Document Changes:** Note any custom seed data you add
7. **Use UUIDs:** Generate proper UUIDs for IDs

---

## Next Steps

After seeding:
1. Test application with populated data
2. Verify all features work correctly
3. Adjust seed data as needed
4. Create automated seed scripts for CI/CD

---

**Last Updated:** November 17, 2025  
**Agent:** 2 (Data, Access & Environment Guardian)
