-- ==============================================
-- JestFly Platform - Comprehensive Seed Data
-- ==============================================
-- This script populates the database with sample data for development and testing
-- Run this AFTER all migrations have been applied successfully
-- 
-- Usage: 
--   psql -h <host> -U <user> -d <database> -f seed-data.sql
--   OR via Supabase CLI: supabase db seed
-- ==============================================

-- Clean up existing seed data (optional - comment out for production)
-- DELETE FROM homepage_cards WHERE title LIKE 'Seed:%';
-- DELETE FROM store_products WHERE name LIKE 'Seed:%';
-- DELETE FROM community_posts WHERE content LIKE 'Seed:%';

BEGIN;

-- ==============================================
-- 1. HERO CONFIGURATION
-- ==============================================
-- Update or insert default hero config
INSERT INTO hero_config (
  media_type, 
  media_url, 
  title, 
  subtitle, 
  description, 
  cta_text, 
  cta_link, 
  overlay_opacity,
  content_position,
  is_active
) VALUES (
  'video',
  '/assets/videos/oculos2.mp4',
  'MKSHA',
  'It was the year 2076. The substance had arrived.',
  'Experience the future of digital entertainment and Web3 community',
  'Explore Now',
  '/store',
  0.3,
  'center',
  true
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ==============================================
-- 2. HOMEPAGE CARDS
-- ==============================================
INSERT INTO homepage_cards (order_index, card_type, title, description, image_url, link_url, is_published) VALUES
(1, 'link', 'NFT Store', 'Explore our exclusive NFT collection and limited edition digital collectibles', '/placeholder.svg', '/nft-store', true),
(2, 'link', 'Community Hub', 'Connect with fellow fans, share content, and join the conversation', '/placeholder.svg', '/community', true),
(3, 'link', 'Book Sessions', 'Schedule studio time, coaching sessions, or exclusive experiences', '/placeholder.svg', '/bookings', true),
(4, 'link', 'Resources', 'Access tutorials, guides, and educational content', '/placeholder.svg', '/resources', true),
(5, 'social', 'Instagram', 'Follow us on Instagram for daily updates', '/placeholder.svg', 'https://instagram.com/jestfly', true),
(6, 'social', 'Twitter', 'Join the conversation on Twitter', '/placeholder.svg', 'https://twitter.com/jestfly', true),
(7, 'custom', 'Latest Drop', 'Check out our newest NFT collection release', '/placeholder.svg', '/store?collection=latest', true)
ON CONFLICT DO NOTHING;

-- ==============================================
-- 3. SITE CONFIGURATION
-- ==============================================
-- Update site config sections with expanded settings
UPDATE site_config SET config = '{
  "heroTitle": "MKSHA",
  "heroSubtitle": "It was the year 2076. The substance had arrived.",
  "heroDescription": "Experience the future of digital entertainment and Web3 community",
  "showCrystal": true,
  "crystalAnimation": true,
  "showGallery": true,
  "showFeatures": true,
  "ctaText": "Get Started",
  "ctaLink": "/store",
  "theme": "dark",
  "accentColor": "#8B5CF6"
}'::jsonb WHERE section = 'home';

UPDATE site_config SET config = '{
  "title": "Store",
  "description": "Browse our exclusive collection of digital and physical products",
  "showCategories": true,
  "showFilters": true,
  "itemsPerPage": 12,
  "enableCart": true,
  "enableWishlist": true,
  "featuredCollection": "latest-drops",
  "bannerText": "Free shipping on orders over $50"
}'::jsonb WHERE section = 'store';

UPDATE site_config SET config = '{
  "title": "Community",
  "description": "Join our vibrant community of creators and fans",
  "enabled": true,
  "moderationEnabled": true,
  "allowAnonymousPosts": false,
  "maxPostLength": 5000,
  "maxMediaUploads": 10,
  "communityGuidelines": "/community/guidelines"
}'::jsonb WHERE section = 'community';

-- ==============================================
-- 4. STORE PRODUCTS (Expanded)
-- ==============================================
INSERT INTO store_products (
  name, slug, description, short_description, category_id,
  price, compare_at_price, stock_quantity, sku,
  featured_image, is_featured, is_active, tags
) VALUES
-- Digital Products
(
  'Seed: Summer Vibes Album',
  'seed-summer-vibes-album',
  'Complete digital album featuring 15 original tracks perfect for summer. High-quality 320kbps MP3 and FLAC formats included. Exclusive artwork and liner notes.',
  'Digital album - 15 tracks, multiple formats',
  (SELECT id FROM store_categories WHERE slug = 'digital' LIMIT 1),
  24.99,
  29.99,
  9999,
  'DIG-ALB-001',
  '/placeholder.svg',
  true,
  true,
  ARRAY['music', 'digital', 'album', 'summer']
),
(
  'Seed: Remix Pack Vol. 1',
  'seed-remix-pack-vol1',
  'Professional stems and remix-ready tracks from our latest hits. Includes MIDI files, samples, and project files for major DAWs.',
  'Remix stems and project files',
  (SELECT id FROM store_categories WHERE slug = 'digital' LIMIT 1),
  49.99,
  NULL,
  9999,
  'DIG-RMX-001',
  '/placeholder.svg',
  true,
  true,
  ARRAY['music', 'digital', 'stems', 'production']
),

-- Merchandise
(
  'Seed: Logo T-Shirt Black',
  'seed-logo-tshirt-black',
  'Premium 100% cotton t-shirt with embroidered logo. Comfortable fit, pre-shrunk fabric. Available in sizes S-XXL.',
  'Premium cotton t-shirt with logo',
  (SELECT id FROM store_categories WHERE slug = 'merch' LIMIT 1),
  29.99,
  NULL,
  150,
  'MERCH-TS-BLK-001',
  '/placeholder.svg',
  true,
  true,
  ARRAY['merch', 'clothing', 'tshirt']
),
(
  'Seed: Logo Hoodie Gray',
  'seed-logo-hoodie-gray',
  'Cozy fleece hoodie with front pocket and embroidered logo. Perfect for concerts or casual wear. Unisex sizing.',
  'Fleece hoodie with embroidered logo',
  (SELECT id FROM store_categories WHERE slug = 'merch' LIMIT 1),
  59.99,
  NULL,
  75,
  'MERCH-HD-GRY-001',
  '/placeholder.svg',
  true,
  true,
  ARRAY['merch', 'clothing', 'hoodie']
),
(
  'Seed: Limited Edition Poster Set',
  'seed-limited-poster-set',
  'Set of 3 high-quality 18x24 inch posters featuring exclusive artwork. Printed on premium matte paper. Limited to 500 sets.',
  'Set of 3 exclusive posters',
  (SELECT id FROM store_categories WHERE slug = 'merch' LIMIT 1),
  39.99,
  NULL,
  500,
  'MERCH-PST-SET-001',
  '/placeholder.svg',
  true,
  true,
  ARRAY['merch', 'art', 'collectible', 'limited']
),

-- Tickets
(
  'Seed: VIP Concert Experience',
  'seed-vip-concert-experience',
  'Ultimate VIP package including front-row seating, backstage meet & greet, exclusive merchandise bundle, and after-party access.',
  'VIP concert package with meet & greet',
  (SELECT id FROM store_categories WHERE slug = 'tickets' LIMIT 1),
  299.99,
  NULL,
  25,
  'TIX-VIP-001',
  '/placeholder.svg',
  true,
  true,
  ARRAY['tickets', 'vip', 'experience']
),
(
  'Seed: General Admission Ticket',
  'seed-general-admission-ticket',
  'General admission ticket to the upcoming concert. Early bird pricing available. All ages welcome.',
  'General admission concert ticket',
  (SELECT id FROM store_categories WHERE slug = 'tickets' LIMIT 1),
  49.99,
  59.99,
  500,
  'TIX-GA-001',
  '/placeholder.svg',
  false,
  true,
  ARRAY['tickets', 'concert']
),

-- Music
(
  'Seed: Signed CD Collection',
  'seed-signed-cd-collection',
  'Physical CD signed by the artist. Includes bonus tracks not available digitally. Limited edition packaging with holographic sticker.',
  'Hand-signed physical CD with bonus tracks',
  (SELECT id FROM store_categories WHERE slug = 'music' LIMIT 1),
  34.99,
  NULL,
  100,
  'MUS-CD-SGN-001',
  '/placeholder.svg',
  true,
  true,
  ARRAY['music', 'physical', 'signed', 'collectible']
)
ON CONFLICT (slug) DO NOTHING;

-- ==============================================
-- 5. NFT CATEGORIES
-- ==============================================
INSERT INTO nft_categories (name, slug, description, icon, is_featured, display_order) VALUES
('Music', 'music', 'Exclusive music NFTs including tracks, albums, and stems', '🎵', true, 1),
('Art', 'art', 'Digital artwork and visual creations', '🎨', true, 2),
('Collectibles', 'collectibles', 'Limited edition digital collectibles', '💎', true, 3),
('Merchandise', 'merchandise', 'Physical merchandise with NFT authentication', '👕', true, 4),
('Events', 'events', 'Event tickets and VIP access as NFTs', '🎫', true, 5),
('Experiences', 'experiences', 'Exclusive experiences and meet & greets', '✨', false, 6),
('Generative Art', 'generative-art', 'Algorithmically generated unique artworks', '🌈', false, 7)
ON CONFLICT (slug) DO NOTHING;

-- ==============================================
-- 6. NFT PRODUCTS
-- ==============================================
INSERT INTO nft_products (
  name, slug, description, category_id,
  product_type, price_jestcoin, price_money, payment_methods,
  image_url, rarity, stock_quantity, unlimited_stock,
  is_limited_edition, edition_size, is_active, is_featured, tags
) VALUES
-- Music NFTs
(
  'Seed: Genesis Track #001',
  'seed-genesis-track-001',
  'The first ever track minted as an NFT. Includes exclusive stems, behind-the-scenes content, and lifetime streaming rights.',
  (SELECT id FROM nft_categories WHERE slug = 'music' LIMIT 1),
  'digital',
  1000,
  99.99,
  'hybrid',
  '/placeholder.svg',
  'legendary',
  1,
  false,
  true,
  1,
  true,
  true,
  ARRAY['music', 'nft', 'genesis', 'legendary']
),
(
  'Seed: Exclusive Beat Pack',
  'seed-exclusive-beat-pack',
  'Collection of 10 unreleased beats as NFTs. Each includes commercial licensing rights.',
  (SELECT id FROM nft_categories WHERE slug = 'music' LIMIT 1),
  'digital',
  500,
  49.99,
  'hybrid',
  '/placeholder.svg',
  'rare',
  50,
  false,
  true,
  50,
  true,
  true,
  ARRAY['music', 'nft', 'beats', 'licensing']
),

-- Art NFTs
(
  'Seed: Cyber Dreams Collection',
  'seed-cyber-dreams-collection',
  'Futuristic digital art collection. Each piece is uniquely generated with different color schemes and patterns.',
  (SELECT id FROM nft_categories WHERE slug = 'art' LIMIT 1),
  'digital',
  250,
  24.99,
  'hybrid',
  '/placeholder.svg',
  'uncommon',
  100,
  false,
  true,
  100,
  true,
  true,
  ARRAY['art', 'nft', 'generative', 'cyber']
),

-- Collectibles
(
  'Seed: Fan Badge Level 1',
  'seed-fan-badge-level-1',
  'Entry-level fan badge NFT. Grants access to exclusive Discord channels and early ticket sales.',
  (SELECT id FROM nft_categories WHERE slug = 'collectibles' LIMIT 1),
  'digital',
  100,
  9.99,
  'hybrid',
  '/placeholder.svg',
  'common',
  1000,
  false,
  false,
  NULL,
  true,
  false,
  ARRAY['collectible', 'nft', 'badge', 'utility']
),

-- Hybrid (Physical + Digital)
(
  'Seed: Authenticated Vinyl + NFT',
  'seed-authenticated-vinyl-nft',
  'Limited edition vinyl record with matching NFT certificate. Physical item ships worldwide.',
  (SELECT id FROM nft_categories WHERE slug = 'merchandise' LIMIT 1),
  'hybrid',
  750,
  149.99,
  'hybrid',
  '/placeholder.svg',
  'epic',
  25,
  false,
  true,
  25,
  true,
  true,
  ARRAY['music', 'vinyl', 'nft', 'physical', 'limited']
),

-- Experience NFTs
(
  'Seed: Virtual Meet & Greet',
  'seed-virtual-meet-greet',
  '30-minute virtual meet and greet session. Redeemable within 6 months of purchase.',
  (SELECT id FROM nft_categories WHERE slug = 'experiences' LIMIT 1),
  'digital',
  2000,
  199.99,
  'hybrid',
  '/placeholder.svg',
  'epic',
  10,
  false,
  true,
  10,
  true,
  true,
  ARRAY['experience', 'nft', 'meet-greet', 'virtual']
)
ON CONFLICT (slug) DO NOTHING;

-- ==============================================
-- 7. REWARDS MISSIONS
-- ==============================================
INSERT INTO rewards_missions (title, description, mission_type, reward_amount, requirements, is_daily, is_active) VALUES
('Seed: Daily Login', 'Login to your account every day to earn Jest Coins', 'daily_login', 10, '{"action": "login"}'::jsonb, true, true),
('Seed: First Purchase', 'Make your first purchase in the store', 'first_purchase', 100, '{"action": "purchase", "count": 1}'::jsonb, false, true),
('Seed: Share Collection', 'Share your NFT collection on social media', 'social_share', 25, '{"action": "share", "platform": "any"}'::jsonb, true, true),
('Seed: Complete Profile', 'Fill out your complete profile information', 'profile_complete', 50, '{"action": "profile", "fields": ["avatar", "bio", "social_links"]}'::jsonb, false, true),
('Seed: Refer a Friend', 'Invite a friend to join the platform', 'referral', 150, '{"action": "referral", "verified": true}'::jsonb, false, true),
('Seed: Post in Community', 'Create your first post in the community', 'community_post', 20, '{"action": "post", "count": 1}'::jsonb, false, true),
('Seed: Weekly Active', 'Be active on the platform for 7 consecutive days', 'weekly_active', 100, '{"action": "active_days", "count": 7}'::jsonb, false, true)
ON CONFLICT DO NOTHING;

-- ==============================================
-- 8. COMMUNITY HASHTAGS
-- ==============================================
INSERT INTO community_hashtags (tag, posts_count) VALUES
('music', 0),
('dj', 0),
('festival', 0),
('party', 0),
('beats', 0),
('techno', 0),
('house', 0),
('edm', 0),
('nft', 0),
('web3', 0),
('community', 0),
('newmusic', 0),
('production', 0),
('remix', 0),
('livemusic', 0)
ON CONFLICT (tag) DO NOTHING;

-- ==============================================
-- 9. SAMPLE COMMUNITY POSTS (If profiles exist)
-- ==============================================
-- Note: This section requires actual user profiles to exist
-- Uncomment and modify user_id values after creating test users

/*
INSERT INTO community_posts (user_id, content, visibility, is_published, hashtags) VALUES
((SELECT id FROM profiles WHERE email = 'admin@jestfly.com' LIMIT 1),
  'Seed: Welcome to the JestFly community! 🎉 We''re excited to have you here. Share your music, connect with fellow artists, and explore exclusive NFTs.',
  'public',
  true,
  ARRAY['welcome', 'community', 'music']
),
((SELECT id FROM profiles WHERE email = 'artist@jestfly.com' LIMIT 1),
  'Seed: Just dropped my latest track as an NFT! Check it out in the marketplace. Limited edition - only 50 mints available! 🎵 #newmusic #nft',
  'public',
  true,
  ARRAY['newmusic', 'nft', 'drops']
);
*/

-- ==============================================
-- 10. PRESS KIT MATERIALS (Sample)
-- ==============================================
-- Note: Requires actual files to be uploaded
-- This creates placeholder records

/*
INSERT INTO press_materials (title, description, file_path, file_type, file_size, is_public, created_by) VALUES
('Seed: Artist Biography', 'Official artist biography and background information', '/press/bio.pdf', 'application/pdf', 125000, true, (SELECT id FROM profiles WHERE email = 'admin@jestfly.com' LIMIT 1)),
('Seed: Press Photos', 'High-resolution promotional photos for media use', '/press/photos.zip', 'application/zip', 25000000, true, (SELECT id FROM profiles WHERE email = 'admin@jestfly.com' LIMIT 1)),
('Seed: Logo Package', 'Brand logos in various formats (PNG, SVG, EPS)', '/press/logos.zip', 'application/zip', 5000000, true, (SELECT id FROM profiles WHERE email = 'admin@jestfly.com' LIMIT 1))
ON CONFLICT DO NOTHING;
*/

COMMIT;

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================
-- Run these to verify seed data was inserted correctly

-- Check homepage cards
SELECT COUNT(*) as homepage_cards_count FROM homepage_cards WHERE is_published = true;

-- Check store products
SELECT COUNT(*) as store_products_count FROM store_products WHERE is_active = true;

-- Check NFT products  
SELECT COUNT(*) as nft_products_count FROM nft_products WHERE is_active = true;

-- Check categories
SELECT COUNT(*) as store_categories_count FROM store_categories WHERE is_active = true;
SELECT COUNT(*) as nft_categories_count FROM nft_categories WHERE is_featured = true;

-- Check missions
SELECT COUNT(*) as missions_count FROM rewards_missions WHERE is_active = true;

-- Check hashtags
SELECT COUNT(*) as hashtags_count FROM community_hashtags;

-- Display summary
SELECT 
  'Seed data loaded successfully!' as status,
  NOW() as completed_at;
