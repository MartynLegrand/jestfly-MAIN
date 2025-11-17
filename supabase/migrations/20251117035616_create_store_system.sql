/*
  # Store System - Complete E-commerce

  1. New Tables
    - `store_categories`
      - Product categories with hierarchy support
      - Icon and color customization
      - Active/inactive toggle
    
    - `store_products`
      - Complete product information
      - Images, pricing, inventory
      - SEO fields
      - Category relationship
    
    - `store_cart`
      - User shopping cart
      - Session-based for guests
      - Quantity management
    
    - `store_orders`
      - Order tracking
      - Payment status
      - Shipping information
    
    - `store_order_items`
      - Order line items
      - Price snapshot at time of order

  2. Storage
    - `product-images` bucket for product photos
    - Public access for serving images

  3. Security
    - Enable RLS on all tables
    - Public can read products and categories
    - Users can manage their own cart and orders
    - Only admins can modify products and categories
*/

-- Categories table
CREATE TABLE IF NOT EXISTS store_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#8B5CF6',
  parent_id UUID REFERENCES store_categories(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES store_categories(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku TEXT UNIQUE,
  barcode TEXT,
  stock_quantity INTEGER DEFAULT 0,
  track_inventory BOOLEAN DEFAULT true,
  allow_backorder BOOLEAN DEFAULT false,
  weight DECIMAL(10,2),
  dimensions JSONB DEFAULT '{"length": 0, "width": 0, "height": 0}'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  featured_image TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_digital BOOLEAN DEFAULT false,
  download_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shopping cart table
CREATE TABLE IF NOT EXISTS store_cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  product_id UUID REFERENCES store_products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_snapshot DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_cart_item UNIQUE (user_id, product_id),
  CONSTRAINT unique_session_item UNIQUE (session_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  payment_intent_id TEXT,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  shipping_address JSONB,
  billing_address JSONB,
  customer_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS store_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES store_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES store_products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON store_categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON store_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON store_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_products_slug ON store_products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON store_products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON store_products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON store_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_sku ON store_products(sku);

CREATE INDEX IF NOT EXISTS idx_cart_user ON store_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session ON store_cart(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_product ON store_cart(product_id);

CREATE INDEX IF NOT EXISTS idx_orders_user ON store_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON store_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON store_orders(status);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON store_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON store_order_items(product_id);

-- Enable RLS
ALTER TABLE store_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Categories

-- Anyone can read active categories
CREATE POLICY "Anyone can read active categories"
  ON store_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can read all categories
CREATE POLICY "Admins can read all categories"
  ON store_categories FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can modify categories
CREATE POLICY "Only admins can modify categories"
  ON store_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for Products

-- Anyone can read active products
CREATE POLICY "Anyone can read active products"
  ON store_products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can read all products
CREATE POLICY "Admins can read all products"
  ON store_products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can modify products
CREATE POLICY "Only admins can modify products"
  ON store_products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for Cart

-- Users can read their own cart
CREATE POLICY "Users can read own cart"
  ON store_cart FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Guests can read cart by session
CREATE POLICY "Guests can read cart by session"
  ON store_cart FOR SELECT
  TO anon
  USING (session_id IS NOT NULL);

-- Users can manage their own cart
CREATE POLICY "Users can manage own cart"
  ON store_cart FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Guests can manage cart by session
CREATE POLICY "Guests can manage cart by session"
  ON store_cart FOR ALL
  TO anon
  USING (session_id IS NOT NULL)
  WITH CHECK (session_id IS NOT NULL);

-- RLS Policies for Orders

-- Users can read their own orders
CREATE POLICY "Users can read own orders"
  ON store_orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can read all orders
CREATE POLICY "Admins can read all orders"
  ON store_orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can create their own orders
CREATE POLICY "Users can create own orders"
  ON store_orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Only admins can update orders
CREATE POLICY "Only admins can update orders"
  ON store_orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for Order Items

-- Users can read items from their orders
CREATE POLICY "Users can read own order items"
  ON store_order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM store_orders
      WHERE store_orders.id = store_order_items.order_id
      AND store_orders.user_id = auth.uid()
    )
  );

-- Admins can read all order items
CREATE POLICY "Admins can read all order items"
  ON store_order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can create order items for their orders
CREATE POLICY "Users can create order items"
  ON store_order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM store_orders
      WHERE store_orders.id = store_order_items.order_id
      AND store_orders.user_id = auth.uid()
    )
  );

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_order_number ON store_orders;
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON store_orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_store_categories_updated_at ON store_categories;
CREATE TRIGGER update_store_categories_updated_at
  BEFORE UPDATE ON store_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_store_products_updated_at ON store_products;
CREATE TRIGGER update_store_products_updated_at
  BEFORE UPDATE ON store_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_store_cart_updated_at ON store_cart;
CREATE TRIGGER update_store_cart_updated_at
  BEFORE UPDATE ON store_cart
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_store_orders_updated_at ON store_orders;
CREATE TRIGGER update_store_orders_updated_at
  BEFORE UPDATE ON store_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO store_categories (name, slug, description, icon, color, display_order, is_active) VALUES
('Music', 'music', 'Music tracks, albums and merchandise', '🎵', '#8B5CF6', 1, true),
('Merch', 'merch', 'T-shirts, hoodies and accessories', '👕', '#EC4899', 2, true),
('Digital', 'digital', 'Digital downloads and content', '💿', '#3B82F6', 3, true),
('Tickets', 'tickets', 'Event tickets and passes', '🎫', '#10B981', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO store_products (
  name, slug, description, short_description, category_id, 
  price, stock_quantity, featured_image, is_featured, is_active
) VALUES
(
  'Latest Album - Digital Download',
  'latest-album-digital',
  'Get instant access to our latest album with 12 exclusive tracks.',
  'Digital album with 12 tracks',
  (SELECT id FROM store_categories WHERE slug = 'digital' LIMIT 1),
  19.99,
  999,
  '/placeholder.svg',
  true,
  true
),
(
  'Limited Edition T-Shirt',
  'limited-tshirt',
  'Premium quality t-shirt with exclusive artwork. Available in S, M, L, XL.',
  'Premium t-shirt with exclusive art',
  (SELECT id FROM store_categories WHERE slug = 'merch' LIMIT 1),
  29.99,
  50,
  '/placeholder.svg',
  true,
  true
),
(
  'VIP Concert Pass',
  'vip-concert-pass',
  'VIP access to our next concert including backstage meet & greet.',
  'VIP concert access + meet & greet',
  (SELECT id FROM store_categories WHERE slug = 'tickets' LIMIT 1),
  149.99,
  20,
  '/placeholder.svg',
  true,
  true
)
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE store_categories IS 'Product categories with hierarchy support';
COMMENT ON TABLE store_products IS 'Complete product catalog with inventory and SEO';
COMMENT ON TABLE store_cart IS 'Shopping cart for authenticated users and guest sessions';
COMMENT ON TABLE store_orders IS 'Order tracking and management';
COMMENT ON TABLE store_order_items IS 'Line items for each order';
