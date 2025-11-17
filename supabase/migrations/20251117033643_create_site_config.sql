-- Create site_config table for storing admin panel configurations
CREATE TABLE IF NOT EXISTS site_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT UNIQUE NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_site_config_section ON site_config(section);

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read configurations
CREATE POLICY "Anyone can read site config"
  ON site_config
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policy: Only admins can update/insert configurations
CREATE POLICY "Only admins can modify site config"
  ON site_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default configurations for all sections
INSERT INTO site_config (section, config) VALUES
('home', '{
  "heroTitle": "MKSHA",
  "heroSubtitle": "It was the year 2076. The substance had arrived.",
  "heroDescription": "",
  "showCrystal": true,
  "crystalAnimation": true,
  "showGallery": true,
  "showFeatures": true,
  "ctaText": "Get Started",
  "ctaLink": "/store"
}'::jsonb),
('store', '{
  "title": "Store",
  "description": "Browse our collection",
  "showCategories": true,
  "showFilters": true,
  "itemsPerPage": 12,
  "enableCart": true,
  "enableWishlist": true
}'::jsonb),
('community', '{
  "title": "Community",
  "description": "Join our community",
  "enabled": true
}'::jsonb),
('bookings', '{
  "title": "Bookings",
  "description": "Book your session",
  "enabled": true
}'::jsonb),
('resources', '{
  "title": "Resources",
  "description": "Educational resources",
  "enabled": true
}'::jsonb),
('notes', '{
  "title": "Notes",
  "description": "Your personal notes",
  "enabled": true
}'::jsonb),
('demo', '{
  "title": "Demo Submission",
  "description": "Submit your demo",
  "enabled": true
}'::jsonb),
('presskit', '{
  "title": "Press Kit",
  "description": "Press materials and media",
  "enabled": true
}'::jsonb),
('profile', '{
  "title": "Profile",
  "description": "User profile settings",
  "enabled": true
}'::jsonb),
('livestream', '{
  "title": "Live Stream",
  "description": "Live streaming configuration",
  "enabled": true
}'::jsonb),
('airdrop', '{
  "title": "Airdrop",
  "description": "Token airdrop system",
  "enabled": true
}'::jsonb)
ON CONFLICT (section) DO NOTHING;

COMMENT ON TABLE site_config IS 'Stores configuration for each section of the website';
COMMENT ON COLUMN site_config.section IS 'Unique identifier for each website section';
COMMENT ON COLUMN site_config.config IS 'JSON configuration object for the section';
