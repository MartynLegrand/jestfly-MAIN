/*
  # Homepage System - Hero & Cards

  1. New Tables
    - `hero_config`
      - Complete hero section configuration
      - Media type selection (video/3d/image)
      - CTA button settings
      - Animation and overlay settings
    
    - `homepage_cards`
      - Dynamic cards after hero section
      - Support for social, NFT, custom, and link types
      - Ordering and publishing system
      - Visual effects configuration

  2. Storage
    - `hero-media` bucket for hero videos/images
    - Public access for serving media

  3. Security
    - Enable RLS on all tables
    - Anyone can read published content
    - Only admins can modify content
*/

-- Hero configuration table
CREATE TABLE IF NOT EXISTS hero_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_type TEXT CHECK (media_type IN ('video', '3d', 'image')) DEFAULT 'video',
  media_url TEXT,
  model_id UUID,
  title TEXT NOT NULL DEFAULT 'Welcome',
  subtitle TEXT,
  description TEXT,
  cta_text TEXT DEFAULT 'Get Started',
  cta_link TEXT DEFAULT '/store',
  cta_style JSONB DEFAULT '{"variant": "default", "size": "lg"}'::jsonb,
  overlay_opacity DECIMAL(3,2) DEFAULT 0.3,
  content_position TEXT DEFAULT 'center' CHECK (content_position IN ('left', 'center', 'right')),
  animation_settings JSONB DEFAULT '{"autoplay": true, "loop": true}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage cards table
CREATE TABLE IF NOT EXISTS homepage_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_index INTEGER NOT NULL DEFAULT 0,
  card_type TEXT CHECK (card_type IN ('social', 'nft', 'custom', 'link')) DEFAULT 'custom',
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  social_network TEXT,
  nft_id UUID,
  visual_effects JSONB DEFAULT '{"hover": "scale", "animation": "fade-in"}'::jsonb,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_homepage_cards_order ON homepage_cards(order_index);
CREATE INDEX IF NOT EXISTS idx_homepage_cards_published ON homepage_cards(is_published);
CREATE INDEX IF NOT EXISTS idx_homepage_cards_type ON homepage_cards(card_type);
CREATE INDEX IF NOT EXISTS idx_hero_config_active ON hero_config(is_active);

-- Enable RLS
ALTER TABLE hero_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hero_config

-- Anyone can read active hero config
CREATE POLICY "Anyone can read active hero config"
  ON hero_config
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Only admins can insert hero config
CREATE POLICY "Only admins can insert hero config"
  ON hero_config
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can update hero config
CREATE POLICY "Only admins can update hero config"
  ON hero_config
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can delete hero config
CREATE POLICY "Only admins can delete hero config"
  ON hero_config
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for homepage_cards

-- Anyone can read published cards
CREATE POLICY "Anyone can read published cards"
  ON homepage_cards
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admins can read all cards (including drafts)
CREATE POLICY "Admins can read all cards"
  ON homepage_cards
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can insert cards
CREATE POLICY "Only admins can insert cards"
  ON homepage_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can update cards
CREATE POLICY "Only admins can update cards"
  ON homepage_cards
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can delete cards
CREATE POLICY "Only admins can delete cards"
  ON homepage_cards
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default hero configuration
INSERT INTO hero_config (
  media_type,
  media_url,
  title,
  subtitle,
  description,
  cta_text,
  cta_link,
  is_active
) VALUES (
  'video',
  '/assets/videos/oculos2.mp4',
  'MKSHA',
  'It was the year 2076. The substance had arrived.',
  'Welcome to the future of digital experiences',
  'Explore Now',
  '/store',
  true
) ON CONFLICT DO NOTHING;

-- Insert default homepage cards
INSERT INTO homepage_cards (order_index, card_type, title, description, image_url, link_url, is_published) VALUES
(1, 'link', 'NFT Store', 'Explore our exclusive NFT collection', '/placeholder.svg', '/nft-store', true),
(2, 'link', 'Community', 'Join our vibrant community', '/placeholder.svg', '/community', true),
(3, 'link', 'Bookings', 'Schedule your session', '/placeholder.svg', '/bookings', true),
(4, 'social', 'Instagram', 'Follow us on Instagram', '/placeholder.svg', 'https://instagram.com', false),
(5, 'social', 'Twitter', 'Join the conversation', '/placeholder.svg', 'https://twitter.com', false),
(6, 'custom', 'Latest Drop', 'Check out our newest release', '/placeholder.svg', '/store', false)
ON CONFLICT DO NOTHING;

-- Create storage bucket for hero media (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-media', 'hero-media', true)
ON CONFLICT (id) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_hero_config_updated_at ON hero_config;
CREATE TRIGGER update_hero_config_updated_at
  BEFORE UPDATE ON hero_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_homepage_cards_updated_at ON homepage_cards;
CREATE TRIGGER update_homepage_cards_updated_at
  BEFORE UPDATE ON homepage_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE hero_config IS 'Configuration for homepage hero section with video/3D support';
COMMENT ON TABLE homepage_cards IS 'Dynamic cards displayed after hero section on homepage';
