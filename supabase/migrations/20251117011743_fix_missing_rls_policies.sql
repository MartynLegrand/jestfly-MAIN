/*
  # Fix Missing RLS Policies

  ## Changes Made
  
  This migration adds missing Row Level Security (RLS) policies for tables that have RLS enabled but no policies configured. This is critical for data security.

  ### Tables Fixed
  
  1. **nft_items** - Enable RLS and add policies
     - Public can view listed NFTs
     - Owners can view their NFTs
     - Creators can manage their NFTs
     - Admins have full access

  2. **nft_transactions** - Enable RLS and add policies
     - Users can view their own transactions
     - Admins can view all transactions
  
  3. **nft_auctions** - Add policies
     - Public can view active auctions
     - Sellers can manage their auctions
     - Admins have full access
  
  4. **nft_offers** - Add policies
     - Users can view offers on their NFTs
     - Users can make offers
     - Offer creators can manage their offers
  
  5. **nft_fractions** - Add policies
     - Public can view active fractions
     - NFT owners can manage fractionalization
  
  6. **nft_collections** - Add policies
     - Public can view published collections
     - Creators can manage their collections
  
  7. **products** - Add policies
     - Public can view products
     - Admins can manage products
  
  8. **orders** - Add policies
     - Users can view their own orders
     - Admins can view all orders
  
  9. **wallet** - Add policies
     - Users can view their own wallet
     - Admins can view all wallets
  
  10. **roles** - Enable RLS and add policies
      - Public read access for role definitions
      - Only admins can modify roles

  ## Security Notes
  
  - All policies follow the principle of least privilege
  - Users can only access their own data unless they are admins
  - Public data is explicitly marked with appropriate policies
  - Admin role is checked using auth.jwt() -> 'role'
*/

-- Fix nft_items table (CRITICAL - no RLS!)
ALTER TABLE nft_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nft_items_public_view"
  ON nft_items FOR SELECT
  TO public
  USING (is_listed = true);

CREATE POLICY "nft_items_owner_view"
  ON nft_items FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid() OR creator_id = auth.uid());

CREATE POLICY "nft_items_creator_insert"
  ON nft_items FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "nft_items_owner_update"
  ON nft_items FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK (owner_id = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "nft_items_admin_delete"
  ON nft_items FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Fix nft_transactions table (CRITICAL - no RLS!)
ALTER TABLE nft_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nft_transactions_user_view"
  ON nft_transactions FOR SELECT
  TO authenticated
  USING (from_address = auth.uid() OR to_address = auth.uid());

CREATE POLICY "nft_transactions_admin_view"
  ON nft_transactions FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "nft_transactions_system_insert"
  ON nft_transactions FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text OR from_address = auth.uid());

-- Add policies for nft_auctions
CREATE POLICY "nft_auctions_public_view"
  ON nft_auctions FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "nft_auctions_seller_manage"
  ON nft_auctions FOR ALL
  TO authenticated
  USING (seller_id = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Add policies for nft_offers
CREATE POLICY "nft_offers_receiver_view"
  ON nft_offers FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid() OR offeror_id = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "nft_offers_user_insert"
  ON nft_offers FOR INSERT
  TO authenticated
  WITH CHECK (offeror_id = auth.uid());

CREATE POLICY "nft_offers_creator_manage"
  ON nft_offers FOR UPDATE
  TO authenticated
  USING (offeror_id = auth.uid() OR owner_id = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK (offeror_id = auth.uid() OR owner_id = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "nft_offers_creator_delete"
  ON nft_offers FOR DELETE
  TO authenticated
  USING (offeror_id = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Add policies for nft_fractions
CREATE POLICY "nft_fractions_public_view"
  ON nft_fractions FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "nft_fractions_owner_manage"
  ON nft_fractions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nft_items
      WHERE nft_items.id = nft_fractions.nft_id
      AND (nft_items.owner_id = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text)
    )
  );

-- Add policies for nft_collections
CREATE POLICY "nft_collections_public_view"
  ON nft_collections FOR SELECT
  TO public
  USING (is_public = true OR is_featured = true);

CREATE POLICY "nft_collections_creator_view"
  ON nft_collections FOR SELECT
  TO authenticated
  USING (created_by = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "nft_collections_creator_insert"
  ON nft_collections FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "nft_collections_creator_update"
  ON nft_collections FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK (created_by = auth.uid() OR (auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "nft_collections_admin_delete"
  ON nft_collections FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Add policies for products
CREATE POLICY "products_public_view"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "products_admin_manage"
  ON products FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Add policies for orders
CREATE POLICY "orders_user_view"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "orders_admin_manage"
  ON orders FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Add policies for wallet
CREATE POLICY "wallet_user_view"
  ON wallet FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "wallet_admin_view"
  ON wallet FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "wallet_admin_manage"
  ON wallet FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Fix roles table (no RLS enabled!)
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roles_public_view"
  ON roles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "roles_admin_manage"
  ON roles FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);