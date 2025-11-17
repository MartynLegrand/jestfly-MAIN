# Database Migration Runbook
**JestFly Platform**

This document provides detailed instructions for managing database migrations.

---

## Overview

JestFly uses **Supabase** (PostgreSQL) as its database. All schema changes are managed through SQL migration files located in `/supabase/migrations/`.

**Total Migrations:** 7  
**Database Version:** PostgreSQL 15.x (Supabase managed)

---

## Migration Files

### Migration Order

Execute in this exact order:

1. **20251117011743_fix_missing_rls_policies.sql** - RLS policy fixes
2. **20251117012226_create_models_table.sql** - 3D models table
3. **20251117030043_nft_marketplace_enhancements.sql** - NFT system
4. **20251117033643_create_site_config.sql** - Configuration storage
5. **20251117034759_create_homepage_system.sql** - Homepage tables
6. **20251117035616_create_store_system.sql** - E-commerce tables
7. **20251117040000_create_community_system.sql** - Social features

---

## Migration 1: RLS Policies Fix
**File:** `20251117011743_fix_missing_rls_policies.sql`

### Purpose
Fixes missing Row Level Security (RLS) policies for core tables.

### Tables Affected
- `profiles`

### What It Does
- Enables RLS on profiles table
- Adds policies for public read, user update own profile
- Ensures data security from the start

### Verification
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- Should return: rowsecurity = true
```

---

## Migration 2: Models Table
**File:** `20251117012226_create_models_table.sql`

### Purpose
Creates table for storing 3D model metadata.

### Tables Created
- `models` - 3D model information

### Schema
```sql
CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  tags TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Verification
```sql
SELECT * FROM models LIMIT 1;
-- Should return empty result (table exists, no data yet)
```

---

## Migration 3: NFT Marketplace Enhancements
**File:** `20251117030043_nft_marketplace_enhancements.sql`

### Purpose
Complete NFT marketplace system with products, wallets, inventory, and transactions.

### Tables Created
1. `nft_categories` - NFT product categories
2. `nft_products` - NFT product catalog
3. `user_wallets` - Jest Coin wallets
4. `user_nft_inventory` - User's owned NFTs
5. `product_transactions` - Transaction history
6. `physical_items` - Physical product tracking
7. `shopping_cart` - Shopping cart items
8. `wishlist` - User wishlists
9. `rewards_missions` - Missions to earn Jest Coins
10. `user_rewards` - Rewards history

### Key Features
- Support for digital, physical, and hybrid products
- Rarity system (common, uncommon, rare, epic, legendary)
- Dual pricing (Jest Coins + fiat)
- Edition numbering for limited releases
- Certificate generation for ownership
- Mission system for earning rewards

### Default Data Inserted
- 6 NFT categories: Music, Art, Collectibles, Merchandise, Events, Experiences
- Sample rewards missions

### Verification
```sql
-- Check NFT categories
SELECT name FROM nft_categories ORDER BY name;
-- Should return 6 categories

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%nft%' OR table_name LIKE '%wallet%';
```

---

## Migration 4: Site Configuration
**File:** `20251117033643_create_site_config.sql`

### Purpose
Centralized configuration storage for all site sections.

### Tables Created
- `site_config` - JSONB configuration storage

### Schema
```sql
CREATE TABLE site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section TEXT UNIQUE NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Default Sections Inserted
- `home` - Homepage settings
- `store` - Store settings
- `community` - Community settings
- `bookings` - Booking system settings
- `resources` - Resources page settings
- `notes` - Notes system settings
- `demo` - Demo submission settings
- `presskit` - Press kit settings
- `profile` - Profile settings
- `livestream` - Live stream settings
- `airdrop` - Airdrop settings

### RLS Policies
- Public can READ all configs
- Only admins can MODIFY configs

### Verification
```sql
-- Check sections
SELECT section FROM site_config ORDER BY section;
-- Should return 11 sections

-- Test admin policy (requires admin role)
SELECT * FROM site_config WHERE section = 'home';
```

---

## Migration 5: Homepage System
**File:** `20251117034759_create_homepage_system.sql`

### Purpose
Dynamic homepage content management.

### Tables Created
- `homepage_hero_cards` - Hero section cards

### Schema Features
- Card title, subtitle, description
- Image and button configuration
- Ordering system
- Active/inactive toggle
- Gradient customization
- Animation settings

### Default Data
- Sample hero card with MKSHA branding

### Verification
```sql
SELECT title, is_active FROM homepage_hero_cards;
-- Should return at least 1 card
```

---

## Migration 6: Store System
**File:** `20251117035616_create_store_system.sql`

### Purpose
Complete e-commerce system for traditional products.

### Tables Created
1. `store_categories` - Product categories
2. `store_products` - Product catalog
3. `store_cart` - Shopping cart
4. `store_orders` - Order management
5. `store_order_items` - Order line items

### Storage Bucket Created
- `product-images` - For product photos

### Key Features
- Hierarchical categories
- Product variants and SKUs
- Stock management
- Featured products
- Digital downloads support
- Order status tracking
- Payment status tracking
- Shipping address storage

### Default Data
- Sample product categories
- Example products

### Verification
```sql
-- Check categories
SELECT name FROM store_categories ORDER BY name;

-- Check products
SELECT name, price, stock_quantity FROM store_products;

-- Check storage bucket
SELECT name FROM storage.buckets WHERE name = 'product-images';
```

---

## Migration 7: Community System
**File:** `20251117040000_create_community_system.sql`

### Purpose
Full-featured social community platform.

### Tables Created
1. `community_posts` - User posts
2. `community_comments` - Post comments
3. `community_likes` - Likes tracking
4. `community_follows` - Follow relationships
5. `community_reports` - Content moderation
6. `notifications` - User notifications

### Storage Bucket Created
- `community-media` - For post images/videos

### Key Features
- Text and media posts
- Nested comments (replies)
- Like system for posts and comments
- Follow/unfollow users
- Content moderation and reporting
- Real-time notifications
- Hashtag support
- Mention system (@username)

### RLS Policies
- Users can only modify their own content
- Public can read published/approved content
- Moderators can review reports
- Comprehensive security model

### Verification
```sql
-- Check all community tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'community_%';

-- Should return 5 tables

-- Check notifications table
SELECT COUNT(*) FROM notifications;
-- Should return 0 (no notifications yet)
```

---

## Applying Migrations

### Method 1: Supabase Dashboard (Recommended)

1. **Login to Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in sidebar
   - Click "New Query"

3. **Copy Migration Content**
   - Open migration file from `/supabase/migrations/`
   - Copy entire content

4. **Execute Migration**
   - Paste into SQL editor
   - Click "Run" (or press Ctrl/Cmd + Enter)
   - Wait for success message

5. **Verify Results**
   - Check "Table Editor" to see new tables
   - Run verification queries

6. **Repeat for All Migrations**
   - Execute in order (1 through 7)
   - Don't skip any migrations

### Method 2: Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Apply all migrations
supabase db push

# Or apply specific migration
supabase db push --file supabase/migrations/20251117011743_fix_missing_rls_policies.sql
```

### Method 3: Direct SQL Client (Advanced)

```bash
# Using psql
psql postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres -f supabase/migrations/20251117011743_fix_missing_rls_policies.sql
```

---

## Rollback Procedures

### General Rollback Strategy

Supabase doesn't have automatic rollback. To rollback:

1. **Identify what to undo**
   - Review the migration SQL
   - Identify created tables, policies, functions

2. **Write rollback SQL**
   ```sql
   -- Example rollback for models table
   DROP TABLE IF EXISTS models CASCADE;
   ```

3. **Execute carefully**
   - Test in staging first
   - Backup data before rollback

### Rollback Scripts

#### Rollback Migration 7 (Community)
```sql
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS community_reports CASCADE;
DROP TABLE IF EXISTS community_follows CASCADE;
DROP TABLE IF EXISTS community_likes CASCADE;
DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DELETE FROM storage.buckets WHERE name = 'community-media';
```

#### Rollback Migration 6 (Store)
```sql
DROP TABLE IF EXISTS store_order_items CASCADE;
DROP TABLE IF EXISTS store_orders CASCADE;
DROP TABLE IF EXISTS store_cart CASCADE;
DROP TABLE IF EXISTS store_products CASCADE;
DROP TABLE IF EXISTS store_categories CASCADE;
DELETE FROM storage.buckets WHERE name = 'product-images';
```

#### Rollback Migration 5 (Homepage)
```sql
DROP TABLE IF EXISTS homepage_hero_cards CASCADE;
```

#### Rollback Migration 4 (Site Config)
```sql
DROP TABLE IF EXISTS site_config CASCADE;
```

#### Rollback Migration 3 (NFT)
```sql
DROP TABLE IF EXISTS user_rewards CASCADE;
DROP TABLE IF EXISTS rewards_missions CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS shopping_cart CASCADE;
DROP TABLE IF EXISTS physical_items CASCADE;
DROP TABLE IF EXISTS product_transactions CASCADE;
DROP TABLE IF EXISTS user_nft_inventory CASCADE;
DROP TABLE IF EXISTS user_wallets CASCADE;
DROP TABLE IF EXISTS nft_products CASCADE;
DROP TABLE IF EXISTS nft_categories CASCADE;
```

---

## Verification Checklist

After applying all migrations:

- [ ] All 7 migrations executed successfully
- [ ] No SQL errors in execution log
- [ ] All tables visible in Table Editor
- [ ] Storage buckets created (product-images, community-media)
- [ ] RLS enabled on all tables
- [ ] Default data inserted (categories, config sections)
- [ ] Can insert test data into each table
- [ ] Can query data without errors
- [ ] Foreign key constraints working
- [ ] Indexes created (check execution plans)

### Full Table List

Execute this to see all tables:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables (24+):
- community_comments
- community_follows
- community_likes
- community_posts
- community_reports
- homepage_hero_cards
- models
- nft_categories
- nft_products
- notifications
- physical_items
- product_transactions
- profiles
- rewards_missions
- shopping_cart
- site_config
- store_cart
- store_categories
- store_order_items
- store_orders
- store_products
- user_nft_inventory
- user_rewards
- user_wallets
- wishlist

---

## Troubleshooting

### Issue: "relation already exists"

**Cause:** Migration already applied

**Solution:**
- Skip this migration
- Or drop table first: `DROP TABLE IF EXISTS table_name CASCADE;`

### Issue: "permission denied"

**Cause:** Insufficient database permissions

**Solution:**
- Ensure you're using Service Role key (not Anon key)
- Or execute via Supabase Dashboard (recommended)

### Issue: "foreign key constraint violation"

**Cause:** Trying to insert data before related tables exist

**Solution:**
- Apply migrations in correct order
- Delete conflicting data
- Check if referenced table exists

### Issue: "function uuid_generate_v4() does not exist"

**Cause:** UUID extension not enabled

**Solution:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## Backup & Restore

### Creating Backup

**Via Supabase CLI:**
```bash
supabase db dump -f backup.sql
```

**Via Dashboard:**
1. Go to Database > Backups
2. Download latest backup
3. Or use SQL Editor to export specific tables

### Restoring from Backup

```bash
supabase db reset --file backup.sql
```

**Warning:** This will erase ALL data!

---

## Migration Best Practices

1. **Always backup before migrating**
2. **Test in development first**
3. **Apply in correct order**
4. **Verify after each migration**
5. **Document custom changes**
6. **Never edit migration files after applied**
7. **Use descriptive migration names**
8. **Include rollback SQL in comments**

---

## Next Steps

After migrations:
1. Read [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md) to add sample data
2. Read [RLS_VERIFICATION.md](./RLS_VERIFICATION.md) to test security
3. Test application with populated database

---

**Last Updated:** November 17, 2025  
**Agent:** 2 (Data, Access & Environment Guardian)
