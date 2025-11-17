# Row Level Security (RLS) Validation Checklist

## Overview
This document provides a comprehensive checklist for validating that Row Level Security (RLS) policies are correctly configured across all tables in the JestFly platform.

## General RLS Requirements

- [ ] RLS is enabled on all tables containing user data
- [ ] Admin users can access all records
- [ ] Regular users can only access their own records or public records
- [ ] Anonymous users have read-only access to public content
- [ ] Service role bypasses RLS for system operations

## RLS Validation by Table

### Core User Tables

#### ✅ profiles
- [ ] RLS enabled: `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`
- [ ] Users can view their own profile
- [ ] Users can update their own profile
- [ ] Admins can view all profiles
- [ ] Admins can update all profiles
- [ ] Public cannot create profiles (handled by trigger)

**Test Queries:**
```sql
-- As authenticated user (should see only own profile)
SELECT * FROM profiles WHERE id = auth.uid();

-- As admin (should see all profiles)
SELECT * FROM profiles; -- Returns all if admin

-- Try to update another user's profile (should fail)
UPDATE profiles SET display_name = 'Hacked' WHERE id != auth.uid();
```

### NFT System Tables

#### ✅ nft_collections
- [ ] RLS enabled
- [ ] Public can view published collections
- [ ] Creators can manage their collections
- [ ] Admins have full access

#### ✅ nft_items
- [ ] RLS enabled
- [ ] Public can view listed NFTs
- [ ] Owners can view their NFTs
- [ ] Creators can manage their NFTs
- [ ] Admins have full access

#### ✅ nft_categories
- [ ] RLS enabled
- [ ] Public can read all categories
- [ ] Only admins can modify categories

#### ✅ nft_products
- [ ] RLS enabled
- [ ] Public can view active products
- [ ] Admins can manage all products

#### ✅ nft_transactions
- [ ] RLS enabled
- [ ] Users can view their own transactions
- [ ] Admins can view all transactions
- [ ] System can create transactions

**Test Queries:**
```sql
-- Public user should see only active NFT products
SELECT * FROM nft_products WHERE is_active = true;

-- Authenticated user should see their inventory
SELECT * FROM user_nft_inventory WHERE user_id = auth.uid();

-- Try to view another user's wallet (should fail)
SELECT * FROM user_wallets WHERE user_id != auth.uid();
```

### Store System Tables

#### ✅ store_categories
- [ ] RLS enabled
- [ ] Anyone can read active categories
- [ ] Admins can read all categories
- [ ] Only admins can modify categories

#### ✅ store_products
- [ ] RLS enabled
- [ ] Anyone can read active products
- [ ] Admins can read all products
- [ ] Only admins can modify products

#### ✅ store_cart
- [ ] RLS enabled
- [ ] Users can read their own cart
- [ ] Guests can read cart by session
- [ ] Users can manage their own cart
- [ ] Guests can manage cart by session

#### ✅ store_orders
- [ ] RLS enabled
- [ ] Users can read their own orders
- [ ] Admins can read all orders
- [ ] Users can create their own orders
- [ ] Only admins can update orders

#### ✅ store_order_items
- [ ] RLS enabled
- [ ] Users can read items from their orders
- [ ] Admins can read all order items
- [ ] Users can create order items for their orders

**Test Queries:**
```sql
-- Add item to cart
INSERT INTO store_cart (user_id, product_id, quantity, price_snapshot)
VALUES (auth.uid(), 'some-product-id', 1, 29.99);

-- View own cart (should succeed)
SELECT * FROM store_cart WHERE user_id = auth.uid();

-- Try to view another user's cart (should fail)
SELECT * FROM store_cart WHERE user_id != auth.uid();
```

### Community System Tables

#### ✅ community_posts
- [ ] RLS enabled
- [ ] Anyone can read public approved posts
- [ ] Users can read their own posts
- [ ] Users can read followers-only posts if they follow
- [ ] Admins can read all posts
- [ ] Users can create their own posts
- [ ] Users can update their own posts
- [ ] Admins can update any post
- [ ] Users can delete their own posts
- [ ] Admins can delete any post

#### ✅ community_comments
- [ ] RLS enabled
- [ ] Anyone can read approved comments on public posts
- [ ] Users can read their own comments
- [ ] Admins can read all comments
- [ ] Authenticated users can create comments
- [ ] Users can update their own comments
- [ ] Users can delete their own comments
- [ ] Admins can delete any comment

#### ✅ community_likes
- [ ] RLS enabled
- [ ] Anyone can read likes
- [ ] Authenticated users can create likes
- [ ] Users can delete their own likes

#### ✅ community_follows
- [ ] RLS enabled
- [ ] Anyone can read follows
- [ ] Authenticated users can create follows
- [ ] Users can delete their own follows

#### ✅ community_notifications
- [ ] RLS enabled
- [ ] Users can read their own notifications
- [ ] System can create notifications
- [ ] Users can update their own notifications
- [ ] Users can delete their own notifications

#### ✅ community_hashtags
- [ ] RLS enabled
- [ ] Anyone can read hashtags
- [ ] System can manage hashtags

#### ✅ community_reports
- [ ] RLS enabled
- [ ] Users can read their own reports
- [ ] Admins can read all reports
- [ ] Authenticated users can create reports
- [ ] Admins can update reports

**Test Queries:**
```sql
-- Create a post (should succeed as authenticated user)
INSERT INTO community_posts (user_id, content, visibility)
VALUES (auth.uid(), 'Test post', 'public');

-- Read public posts (should succeed)
SELECT * FROM community_posts 
WHERE visibility = 'public' 
  AND moderation_status = 'approved' 
  AND is_published = true;

-- Try to delete another user's post (should fail unless admin)
DELETE FROM community_posts WHERE user_id != auth.uid();
```

### Homepage & Configuration Tables

#### ✅ hero_config
- [ ] RLS enabled
- [ ] Anyone can read active hero config
- [ ] Only admins can insert hero config
- [ ] Only admins can update hero config
- [ ] Only admins can delete hero config

#### ✅ homepage_cards
- [ ] RLS enabled
- [ ] Anyone can read published cards
- [ ] Admins can read all cards (including drafts)
- [ ] Only admins can insert cards
- [ ] Only admins can update cards
- [ ] Only admins can delete cards

#### ✅ site_config
- [ ] RLS enabled
- [ ] Anyone can read configurations
- [ ] Only admins can modify configurations

**Test Queries:**
```sql
-- Read site config (should succeed for anyone)
SELECT * FROM site_config WHERE section = 'home';

-- Try to update site config as non-admin (should fail)
UPDATE site_config SET config = '{"test": true}'::jsonb WHERE section = 'home';
```

### Wallet & Rewards Tables

#### ✅ user_wallets
- [ ] RLS enabled
- [ ] Users can view their own wallet
- [ ] Admins can view all wallets
- [ ] Only admins/system can modify wallets

#### ✅ rewards_missions
- [ ] RLS enabled
- [ ] Public can view active missions
- [ ] Admins can manage all missions

#### ✅ user_rewards
- [ ] RLS enabled
- [ ] Users can view their own rewards
- [ ] Admins can view all rewards

**Test Queries:**
```sql
-- View own wallet (should succeed)
SELECT * FROM user_wallets WHERE user_id = auth.uid();

-- View available missions (should succeed)
SELECT * FROM rewards_missions WHERE is_active = true;

-- Try to modify wallet balance directly (should fail unless admin)
UPDATE user_wallets SET balance = 999999 WHERE user_id = auth.uid();
```

### Models & 3D Content Tables

#### ✅ models
- [ ] RLS enabled
- [ ] Public can view active models
- [ ] Admins can view all models
- [ ] Only admins can insert models
- [ ] Only admins can update models
- [ ] Only admins can delete models

**Test Queries:**
```sql
-- View active models (should succeed)
SELECT * FROM models WHERE is_active = true;

-- Try to create model as non-admin (should fail)
INSERT INTO models (name, model_type, params)
VALUES ('Test Model', 'crystal', '{}');
```

### Storage Buckets

#### ✅ avatars
- [ ] Public can view avatars
- [ ] Authenticated users can upload avatars
- [ ] Users can update their own avatars
- [ ] Users can delete their own avatars

#### ✅ community-media
- [ ] Anyone can view community media
- [ ] Authenticated users can upload community media
- [ ] Users can update their own media
- [ ] Users can delete their own media

#### ✅ hero-media
- [ ] Public can view hero media
- [ ] Only admins can upload hero media

#### ✅ product-images
- [ ] Public can view product images
- [ ] Only admins can upload product images

#### ✅ nfts
- [ ] Public can view NFT files
- [ ] Authenticated users can upload NFT files
- [ ] Creators can manage their NFT files

**Test Queries:**
```sql
-- Check storage policies
SELECT * FROM storage.objects WHERE bucket_id = 'avatars';

-- Try to delete another user's avatar (should fail)
DELETE FROM storage.objects 
WHERE bucket_id = 'avatars' 
  AND owner != auth.uid();
```

## Automated RLS Validation Script

Run this script to automatically check RLS configuration:

```sql
-- Check which tables have RLS enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ NOT ENABLED'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY rowsecurity DESC, tablename;

-- Count policies per table
SELECT 
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY policy_count DESC, tablename;

-- Find tables with RLS enabled but no policies (DANGEROUS!)
SELECT t.tablename
FROM pg_tables t
WHERE t.schemaname = 'public'
  AND t.rowsecurity = true
  AND NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = t.schemaname
    AND p.tablename = t.tablename
  );

-- Check for tables without RLS that might need it
SELECT tablename
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND tablename NOT IN (
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND rowsecurity = true
  )
ORDER BY tablename;
```

## Security Best Practices

### ✅ Authentication Checks
- [ ] All sensitive operations require authentication
- [ ] Service role key is never exposed to client
- [ ] JWT tokens are validated properly
- [ ] Session management is secure

### ✅ Authorization Checks
- [ ] Admin checks use `auth.jwt() ->> 'role' = 'admin'` or profile table
- [ ] Owner checks use `auth.uid() = user_id`
- [ ] Public access is explicitly defined

### ✅ Data Leakage Prevention
- [ ] SELECT policies prevent unauthorized reads
- [ ] INSERT policies prevent unauthorized creates
- [ ] UPDATE policies prevent unauthorized modifications
- [ ] DELETE policies prevent unauthorized deletions

### ✅ Performance Considerations
- [ ] RLS policies use indexed columns
- [ ] Complex policies are optimized
- [ ] No N+1 query issues in policies

## Common RLS Pitfalls to Avoid

❌ **Forgetting to enable RLS**
```sql
-- Always enable RLS after creating tables
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

❌ **No policies = no access**
```sql
-- If RLS is enabled but no policies exist, nobody can access the table!
-- Always create at least a SELECT policy for public data
```

❌ **Using anon key with RLS bypass**
```sql
-- Never use service role key on client side
-- Service role bypasses ALL RLS policies!
```

❌ **Forgetting WITH CHECK clause**
```sql
-- UPDATE and INSERT need WITH CHECK
CREATE POLICY "policy_name" ON table_name
FOR UPDATE USING (condition) WITH CHECK (condition);
```

❌ **Not testing as different users**
```sql
-- Always test policies from multiple perspectives:
-- 1. As anonymous user
-- 2. As authenticated user (owner)
-- 3. As authenticated user (non-owner)
-- 4. As admin
```

## Testing Procedure

1. **Setup Test Users**
   ```sql
   -- Create test users with different roles
   -- admin@test.com (admin)
   -- user1@test.com (regular user)
   -- user2@test.com (regular user)
   ```

2. **Run Policy Tests**
   - Login as each test user
   - Attempt authorized operations (should succeed)
   - Attempt unauthorized operations (should fail)
   - Verify error messages are appropriate

3. **Load Testing**
   - Test with realistic data volumes
   - Monitor query performance
   - Check for slow policy evaluations

4. **Security Audit**
   - Review all policies
   - Check for potential bypasses
   - Verify no sensitive data leaks

## Sign-Off

- [ ] All tables have RLS enabled where needed
- [ ] All policies tested and validated
- [ ] No tables with RLS but no policies
- [ ] Storage bucket policies configured
- [ ] Admin access verified
- [ ] User access verified
- [ ] Anonymous access verified
- [ ] Documentation updated

**Validated by:** _______________  
**Date:** _______________  
**Next Review:** _______________
