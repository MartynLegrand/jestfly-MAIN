# JestFly Migration Runbook

## Overview
This runbook provides step-by-step instructions for applying database migrations, validating the schema, and rolling back changes if needed.

## Prerequisites

- Access to Supabase project (Project ID: `xqjhoojjmyyajmwybgpd`)
- Supabase CLI installed: `npm install -g supabase`
- Database credentials with appropriate permissions
- Backup of current database state

## Migration Files

All migrations are located in `/supabase/migrations/` and are applied in chronological order:

1. `20251117011743_fix_missing_rls_policies.sql` - RLS policies for NFT, products, orders, wallet tables
2. `20251117012226_create_models_table.sql` - 3D models configuration table
3. `20251117030043_nft_marketplace_enhancements.sql` - Complete NFT marketplace tables
4. `20251117033643_create_site_config.sql` - Site configuration system
5. `20251117034759_create_homepage_system.sql` - Hero and homepage cards
6. `20251117035616_create_store_system.sql` - E-commerce store system
7. `20251117040000_create_community_system.sql` - Social community features

## Pre-Migration Checklist

- [ ] Backup current database
- [ ] Review migration files for conflicts
- [ ] Ensure no active user sessions during migration
- [ ] Verify database connection
- [ ] Check available disk space
- [ ] Notify team of maintenance window

## Migration Steps

### Option 1: Using Supabase CLI (Recommended)

```bash
# 1. Link to your Supabase project
supabase link --project-ref xqjhoojjmyyajmwybgpd

# 2. Check migration status
supabase db status

# 3. Apply all pending migrations
supabase db push

# 4. Verify migrations were applied
supabase db status
```

### Option 2: Manual SQL Execution

```bash
# 1. Connect to your database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xqjhoojjmyyajmwybgpd.supabase.co:5432/postgres"

# 2. Apply each migration in order
\i supabase/migrations/20251117011743_fix_missing_rls_policies.sql
\i supabase/migrations/20251117012226_create_models_table.sql
\i supabase/migrations/20251117030043_nft_marketplace_enhancements.sql
\i supabase/migrations/20251117033643_create_site_config.sql
\i supabase/migrations/20251117034759_create_homepage_system.sql
\i supabase/migrations/20251117035616_create_store_system.sql
\i supabase/migrations/20251117040000_create_community_system.sql

# 3. Verify tables were created
\dt public.*

# 4. Check for errors in logs
SELECT * FROM pg_stat_activity WHERE state = 'error';
```

### Option 3: Supabase Dashboard

1. Navigate to https://app.supabase.com/project/xqjhoojjmyyajmwybgpd
2. Go to "SQL Editor"
3. Copy and paste each migration file content
4. Execute in chronological order
5. Verify success messages

## Post-Migration Validation

### 1. Verify Tables Exist

```sql
-- Check all expected tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected tables (minimum):
-- community_comments, community_follows, community_hashtags,
-- community_likes, community_notifications, community_posts,
-- community_reports, hero_config, homepage_cards, models,
-- nft_categories, nft_products, physical_items, product_transactions,
-- rewards_missions, shopping_cart, site_config, store_cart,
-- store_categories, store_order_items, store_orders, store_products,
-- user_nft_inventory, user_rewards, user_wallets, wishlist
```

### 2. Verify RLS Policies

```sql
-- List all RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true;
```

### 3. Verify Storage Buckets

```sql
-- Check storage buckets exist
SELECT id, name, public FROM storage.buckets;

-- Expected buckets:
-- avatars, community-media, demos, hero-media, nfts, 
-- press_kit, product-images, products, temp
```

### 4. Verify Triggers and Functions

```sql
-- List all custom functions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- List all triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

### 5. Test Basic Operations

```sql
-- Test insert (requires admin role)
INSERT INTO site_config (section, config) 
VALUES ('test', '{"test": true}'::jsonb);

-- Test select (public access)
SELECT * FROM site_config WHERE section = 'test';

-- Clean up test
DELETE FROM site_config WHERE section = 'test';
```

## Seed Data

After successful migration, populate with seed data:

```bash
# Run seed data script
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xqjhoojjmyyajmwybgpd.supabase.co:5432/postgres" \
  -f scripts/seed-data.sql

# OR via Supabase SQL Editor
# Copy contents of scripts/seed-data.sql and execute
```

## Rollback Procedures

### Scenario 1: Recent Migration Failed

```sql
-- Roll back last transaction if still in progress
ROLLBACK;

-- Check migration history
SELECT * FROM supabase_migrations.schema_migrations 
ORDER BY version DESC LIMIT 5;

-- If using Supabase CLI
supabase db reset  -- WARNING: This drops entire database!
```

### Scenario 2: Need to Undo Specific Migration

```bash
# Create rollback migration
supabase migration new rollback_[migration_name]

# Write SQL to reverse changes, for example:
# DROP TABLE IF EXISTS table_name CASCADE;
# DROP FUNCTION IF EXISTS function_name CASCADE;
# ALTER TABLE table_name DROP COLUMN column_name;

# Apply rollback
supabase db push
```

### Scenario 3: Complete Rollback to Backup

```bash
# Restore from backup (Supabase Dashboard)
# 1. Go to Database > Backups
# 2. Select backup point before migration
# 3. Click "Restore"

# OR manually restore
pg_restore -h db.xqjhoojjmyyajmwybgpd.supabase.co \
  -U postgres -d postgres backup_file.dump
```

## Rollback Scripts

### Rollback Migration 7 (Community System)

```sql
-- Drop community tables
DROP TABLE IF EXISTS community_reports CASCADE;
DROP TABLE IF EXISTS community_hashtags CASCADE;
DROP TABLE IF EXISTS community_notifications CASCADE;
DROP TABLE IF EXISTS community_follows CASCADE;
DROP TABLE IF EXISTS community_likes CASCADE;
DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;

-- Drop related functions and triggers
DROP FUNCTION IF EXISTS create_follow_notification() CASCADE;
DROP FUNCTION IF EXISTS create_comment_notification() CASCADE;
DROP FUNCTION IF EXISTS create_like_notification() CASCADE;
DROP FUNCTION IF EXISTS update_comment_replies_count() CASCADE;
DROP FUNCTION IF EXISTS update_post_comments_count() CASCADE;
DROP FUNCTION IF EXISTS update_comment_likes_count() CASCADE;
DROP FUNCTION IF EXISTS update_post_likes_count() CASCADE;
```

### Rollback Migration 6 (Store System)

```sql
-- Drop store tables
DROP TABLE IF EXISTS store_order_items CASCADE;
DROP TABLE IF EXISTS store_orders CASCADE;
DROP TABLE IF EXISTS store_cart CASCADE;
DROP TABLE IF EXISTS store_products CASCADE;
DROP TABLE IF EXISTS store_categories CASCADE;

-- Drop related functions
DROP FUNCTION IF EXISTS set_order_number() CASCADE;
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;
```

### Rollback Migration 5 (Homepage System)

```sql
-- Drop homepage tables
DROP TABLE IF EXISTS homepage_cards CASCADE;
DROP TABLE IF EXISTS hero_config CASCADE;
```

### Rollback Migration 4 (Site Config)

```sql
-- Drop site config table
DROP TABLE IF EXISTS site_config CASCADE;
```

### Rollback Migration 3 (NFT Marketplace)

```sql
-- Drop NFT marketplace tables
DROP TABLE IF EXISTS user_rewards CASCADE;
DROP TABLE IF EXISTS rewards_missions CASCADE;
DROP TABLE IF EXISTS shopping_cart CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS physical_items CASCADE;
DROP TABLE IF EXISTS product_transactions CASCADE;
DROP TABLE IF EXISTS user_nft_inventory CASCADE;
DROP TABLE IF EXISTS user_wallets CASCADE;
DROP TABLE IF EXISTS nft_products CASCADE;
DROP TABLE IF EXISTS nft_categories CASCADE;

-- Drop ENUMs
DROP TYPE IF EXISTS delivery_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS transaction_status_enum CASCADE;
DROP TYPE IF EXISTS product_rarity CASCADE;
```

### Rollback Migration 2 (Models Table)

```sql
-- Drop models table
DROP TABLE IF EXISTS models CASCADE;
DROP FUNCTION IF EXISTS update_models_updated_at() CASCADE;
```

### Rollback Migration 1 (RLS Policies)

```sql
-- Note: This only added policies, not tables
-- To rollback, drop the policies:

-- Drop NFT item policies
DROP POLICY IF EXISTS "nft_items_public_view" ON nft_items;
DROP POLICY IF EXISTS "nft_items_owner_view" ON nft_items;
DROP POLICY IF EXISTS "nft_items_creator_insert" ON nft_items;
-- ... (repeat for all policies added in migration)
```

## Troubleshooting

### Issue: Migration Fails Due to Missing Table

**Solution:**
- Check if previous migrations were applied
- Verify table dependencies
- Run migrations in correct order

### Issue: RLS Policy Error

**Solution:**
```sql
-- Temporarily disable RLS for debugging
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- Re-enable after fixing
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Issue: Permission Denied

**Solution:**
- Verify you're using service role key, not anon key
- Check user permissions: `\du` in psql
- Ensure proper GRANT statements exist

### Issue: Unique Constraint Violation

**Solution:**
```sql
-- Check for existing data
SELECT * FROM table_name WHERE unique_column = 'value';

-- Use ON CONFLICT in migrations
INSERT INTO table_name (...)
VALUES (...)
ON CONFLICT (unique_column) DO NOTHING;
```

## Health Check Script

Run this after migration to verify system health:

```sql
-- Comprehensive health check
WITH table_counts AS (
  SELECT 
    'hero_config' as table_name, COUNT(*) as count FROM hero_config
  UNION ALL SELECT 'homepage_cards', COUNT(*) FROM homepage_cards
  UNION ALL SELECT 'site_config', COUNT(*) FROM site_config
  UNION ALL SELECT 'store_products', COUNT(*) FROM store_products
  UNION ALL SELECT 'store_categories', COUNT(*) FROM store_categories
  UNION ALL SELECT 'nft_products', COUNT(*) FROM nft_products
  UNION ALL SELECT 'nft_categories', COUNT(*) FROM nft_categories
  UNION ALL SELECT 'rewards_missions', COUNT(*) FROM rewards_missions
  UNION ALL SELECT 'community_hashtags', COUNT(*) FROM community_hashtags
),
rls_check AS (
  SELECT COUNT(*) as tables_with_rls
  FROM pg_tables
  WHERE schemaname = 'public' AND rowsecurity = true
),
storage_check AS (
  SELECT COUNT(*) as bucket_count
  FROM storage.buckets
)
SELECT 
  (SELECT COUNT(*) FROM table_counts WHERE count > 0) as tables_with_data,
  (SELECT tables_with_rls FROM rls_check) as tables_with_rls,
  (SELECT bucket_count FROM storage_check) as storage_buckets,
  NOW() as checked_at;
```

## Monitoring Post-Migration

### Performance Checks

```sql
-- Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Error Monitoring

```sql
-- Check for constraint violations
SELECT * FROM pg_stat_database WHERE datname = 'postgres';

-- Check for deadlocks
SELECT * FROM pg_stat_database_conflicts WHERE datname = 'postgres';
```

## Support and Escalation

If issues persist:

1. **Check Supabase Status**: https://status.supabase.com
2. **Review Logs**: Supabase Dashboard > Logs
3. **Contact Support**: support@supabase.com with project ID
4. **Community**: https://github.com/supabase/supabase/discussions

## Change Log

| Date | Migration | Status | Notes |
|------|-----------|--------|-------|
| 2024-11-17 | Initial 7 migrations | Pending | Ready for deployment |

## Sign-Off

- [ ] Migrations tested in development
- [ ] Seed data validated
- [ ] RLS policies verified
- [ ] Rollback procedures tested
- [ ] Team notified
- [ ] Documentation updated

**Approved by:** _______________  
**Date:** _______________
