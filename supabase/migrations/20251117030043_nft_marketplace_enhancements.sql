/*
  # NFT Marketplace Enhancements

  ## Purpose
  Adds missing tables for complete NFT marketplace with Jest Coin integration

  ## New Tables
  1. **nft_products** - Enhanced product catalog for store
  2. **nft_categories** - Product categorization
  3. **user_wallets** - Jest Coin balance (if not exists)
  4. **user_nft_inventory** - User owned NFTs  
  5. **physical_items** - Physical product shipping
  6. **wishlist** - User wishlist
  7. **shopping_cart** - Shopping cart
  8. **rewards_missions** - Daily missions
  9. **user_rewards** - User rewards tracking

  ## Security
  All tables have RLS enabled with appropriate policies
*/

-- Create ENUMs
DO $$ BEGIN
  CREATE TYPE product_type AS ENUM ('digital', 'physical', 'hybrid');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE product_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_status_enum AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('jestcoin', 'money', 'hybrid');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE delivery_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. NFT Categories
CREATE TABLE IF NOT EXISTS nft_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES nft_categories(id) ON DELETE CASCADE,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. NFT Products (Enhanced Store Products)
CREATE TABLE IF NOT EXISTS nft_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES nft_categories(id) ON DELETE SET NULL,
  product_type product_type NOT NULL DEFAULT 'digital',
  price_jestcoin INTEGER DEFAULT 0,
  price_money DECIMAL(10,2) DEFAULT 0,
  payment_methods payment_method NOT NULL DEFAULT 'hybrid',
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  model_3d_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  attributes JSONB DEFAULT '{}'::jsonb,
  rarity product_rarity DEFAULT 'common',
  stock_quantity INTEGER DEFAULT 0,
  unlimited_stock BOOLEAN DEFAULT false,
  max_per_user INTEGER DEFAULT 0,
  is_limited_edition BOOLEAN DEFAULT false,
  edition_size INTEGER,
  edition_number INTEGER,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  featured_order INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  total_sold INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. User Wallets (Enhanced)
CREATE TABLE IF NOT EXISTS user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT positive_balance CHECK (balance >= 0)
);

-- 4. User NFT Inventory
CREATE TABLE IF NOT EXISTS user_nft_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES nft_products(id) ON DELETE CASCADE,
  purchase_price_jestcoin INTEGER DEFAULT 0,
  purchase_price_money DECIMAL(10,2) DEFAULT 0,
  payment_method payment_method NOT NULL,
  token_id TEXT UNIQUE,
  certificate_url TEXT,
  qr_code TEXT,
  is_redeemed BOOLEAN DEFAULT false,
  redeemed_at TIMESTAMPTZ,
  is_showcased BOOLEAN DEFAULT false,
  showcase_order INTEGER DEFAULT 0,
  acquired_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Product Transactions
CREATE TABLE IF NOT EXISTS product_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID REFERENCES nft_products(id) ON DELETE SET NULL,
  inventory_id UUID REFERENCES user_nft_inventory(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL,
  amount_jestcoin INTEGER DEFAULT 0,
  amount_money DECIMAL(10,2) DEFAULT 0,
  payment_method payment_method NOT NULL,
  status transaction_status_enum DEFAULT 'pending',
  error_message TEXT,
  payment_intent_id TEXT,
  payment_gateway TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 6. Physical Items
CREATE TABLE IF NOT EXISTS physical_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id UUID UNIQUE NOT NULL REFERENCES user_nft_inventory(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT,
  tracking_number TEXT,
  carrier TEXT,
  status delivery_status DEFAULT 'pending',
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Wishlist
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES nft_products(id) ON DELETE CASCADE,
  price_alert_jestcoin INTEGER,
  price_alert_money DECIMAL(10,2),
  notify_on_availability BOOLEAN DEFAULT true,
  added_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_wishlist_item UNIQUE(user_id, product_id)
);

-- 8. Shopping Cart
CREATE TABLE IF NOT EXISTS shopping_cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES nft_products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  selected_payment_method payment_method,
  added_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_cart_item UNIQUE(user_id, product_id),
  CONSTRAINT positive_quantity CHECK (quantity > 0)
);

-- 9. Rewards Missions
CREATE TABLE IF NOT EXISTS rewards_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  mission_type TEXT NOT NULL,
  reward_amount INTEGER NOT NULL,
  requirements JSONB DEFAULT '{}'::jsonb,
  is_daily BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  max_completions INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. User Rewards
CREATE TABLE IF NOT EXISTS user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  mission_id UUID NOT NULL REFERENCES rewards_missions(id) ON DELETE CASCADE,
  reward_amount INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_nft_products_category ON nft_products(category_id);
CREATE INDEX IF NOT EXISTS idx_nft_products_active ON nft_products(is_active);
CREATE INDEX IF NOT EXISTS idx_nft_products_featured ON nft_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_nft_products_rarity ON nft_products(rarity);
CREATE INDEX IF NOT EXISTS idx_nft_products_type ON nft_products(product_type);
CREATE INDEX IF NOT EXISTS idx_user_inventory_user ON user_nft_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_user_inventory_product ON user_nft_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_product_transactions_user ON product_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_product_transactions_status ON product_transactions(status);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON shopping_cart(user_id);

-- Enable RLS
ALTER TABLE nft_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_nft_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE physical_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "categories_public_view" ON nft_categories FOR SELECT TO public USING (true);
CREATE POLICY "categories_admin_all" ON nft_categories FOR ALL TO authenticated USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "products_public_view" ON nft_products FOR SELECT TO public USING (is_active = true);
CREATE POLICY "products_admin_all" ON nft_products FOR ALL TO authenticated USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "wallets_own_view" ON user_wallets FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "wallets_admin_all" ON user_wallets FOR ALL TO authenticated USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "inventory_own_view" ON user_nft_inventory FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "inventory_public_showcased" ON user_nft_inventory FOR SELECT TO public USING (is_showcased = true);
CREATE POLICY "inventory_admin_all" ON user_nft_inventory FOR ALL TO authenticated USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "transactions_own_view" ON product_transactions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "transactions_admin_all" ON product_transactions FOR ALL TO authenticated USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "physical_own_view" ON physical_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM user_nft_inventory WHERE user_nft_inventory.id = physical_items.inventory_id AND user_nft_inventory.user_id = auth.uid())
);
CREATE POLICY "physical_admin_all" ON physical_items FOR ALL TO authenticated USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "wishlist_own_all" ON wishlist FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "cart_own_all" ON shopping_cart FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "missions_public_view" ON rewards_missions FOR SELECT TO public USING (is_active = true);
CREATE POLICY "missions_admin_all" ON rewards_missions FOR ALL TO authenticated USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "rewards_own_view" ON user_rewards FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "rewards_admin_all" ON user_rewards FOR ALL TO authenticated USING ((auth.jwt() ->> 'role') = 'admin');

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_nft_categories_updated_at BEFORE UPDATE ON nft_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nft_products_updated_at BEFORE UPDATE ON nft_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_wallets_updated_at BEFORE UPDATE ON user_wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_physical_items_updated_at BEFORE UPDATE ON physical_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopping_cart_updated_at BEFORE UPDATE ON shopping_cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO nft_categories (name, slug, description, icon, is_featured, display_order) VALUES
  ('Music', 'music', 'Digital music NFTs and exclusive tracks', '🎵', true, 1),
  ('Art', 'art', 'Digital artwork and visual creations', '🎨', true, 2),
  ('Collectibles', 'collectibles', 'Limited edition collectible items', '💎', true, 3),
  ('Merchandise', 'merchandise', 'Physical merchandise with NFT certificates', '👕', true, 4),
  ('Events', 'events', 'Event tickets and VIP access passes', '🎫', true, 5),
  ('Experiences', 'experiences', 'Exclusive experiences and meet & greets', '✨', false, 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample missions
INSERT INTO rewards_missions (title, description, mission_type, reward_amount, is_daily, is_active) VALUES
  ('Daily Login', 'Login to your account daily', 'daily_login', 10, true, true),
  ('First Purchase', 'Make your first NFT purchase', 'first_purchase', 100, false, true),
  ('Share on Social', 'Share your NFT collection on social media', 'social_share', 25, true, true),
  ('Complete Profile', 'Fill out your profile information', 'profile_complete', 50, false, true),
  ('Refer a Friend', 'Invite a friend to join the platform', 'referral', 150, false, true)
ON CONFLICT DO NOTHING;