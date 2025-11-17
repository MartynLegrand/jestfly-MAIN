-- ==============================================
-- JestFly Platform - Automated Health Check
-- ==============================================
-- This script performs comprehensive health checks on the database
-- Run this after migrations to verify system integrity
--
-- Usage:
--   psql -h <host> -U <user> -d <database> -f health-check.sql
--   OR via Supabase SQL Editor
-- ==============================================

\echo '=================================================='
\echo 'JestFly Platform Health Check'
\echo '=================================================='
\echo ''

-- ==============================================
-- 1. SCHEMA VERSION CHECK
-- ==============================================
\echo '1. Checking Migration Status...'
\echo ''

SELECT 
  'Migration Status' as check_name,
  COUNT(*) as applied_migrations,
  MAX(version) as latest_migration
FROM supabase_migrations.schema_migrations;

\echo ''

-- ==============================================
-- 2. TABLE EXISTENCE CHECK
-- ==============================================
\echo '2. Checking Required Tables...'
\echo ''

WITH required_tables AS (
  SELECT unnest(ARRAY[
    'profiles', 'models', 'site_config',
    'hero_config', 'homepage_cards',
    'store_categories', 'store_products', 'store_cart', 'store_orders', 'store_order_items',
    'nft_categories', 'nft_products', 'user_wallets', 'user_nft_inventory',
    'product_transactions', 'physical_items', 'wishlist', 'shopping_cart',
    'rewards_missions', 'user_rewards',
    'community_posts', 'community_comments', 'community_likes',
    'community_follows', 'community_notifications', 'community_hashtags', 'community_reports'
  ]) as table_name
),
actual_tables AS (
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
)
SELECT 
  'Table Existence' as check_name,
  COUNT(*) as required_tables,
  COUNT(CASE WHEN at.table_name IS NOT NULL THEN 1 END) as existing_tables,
  COUNT(CASE WHEN at.table_name IS NULL THEN 1 END) as missing_tables
FROM required_tables rt
LEFT JOIN actual_tables at ON rt.table_name = at.table_name;

-- List missing tables if any
\echo ''
\echo 'Missing Tables (if any):'
WITH required_tables AS (
  SELECT unnest(ARRAY[
    'profiles', 'models', 'site_config',
    'hero_config', 'homepage_cards',
    'store_categories', 'store_products', 'store_cart', 'store_orders', 'store_order_items',
    'nft_categories', 'nft_products', 'user_wallets', 'user_nft_inventory',
    'product_transactions', 'physical_items', 'wishlist', 'shopping_cart',
    'rewards_missions', 'user_rewards',
    'community_posts', 'community_comments', 'community_likes',
    'community_follows', 'community_notifications', 'community_hashtags', 'community_reports'
  ]) as table_name
),
actual_tables AS (
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
)
SELECT 
  '❌ ' || rt.table_name as missing_table
FROM required_tables rt
LEFT JOIN actual_tables at ON rt.table_name = at.table_name
WHERE at.table_name IS NULL;

\echo ''

-- ==============================================
-- 3. RLS CONFIGURATION CHECK
-- ==============================================
\echo '3. Checking Row Level Security (RLS)...'
\echo ''

SELECT 
  'RLS Configuration' as check_name,
  COUNT(*) as total_public_tables,
  COUNT(CASE WHEN rowsecurity THEN 1 END) as tables_with_rls,
  COUNT(CASE WHEN NOT rowsecurity THEN 1 END) as tables_without_rls
FROM pg_tables
WHERE schemaname = 'public';

-- Tables without RLS (potential security issue)
\echo ''
\echo 'Tables without RLS (review required):'
SELECT 
  '⚠️  ' || tablename as table_without_rls
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
ORDER BY tablename;

-- Tables with RLS but no policies (will block all access!)
\echo ''
\echo 'Tables with RLS but NO policies (CRITICAL):'
SELECT 
  '🔴 ' || t.tablename as critical_issue
FROM pg_tables t
WHERE t.schemaname = 'public'
  AND t.rowsecurity = true
  AND NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = t.schemaname
    AND p.tablename = t.tablename
  );

\echo ''

-- ==============================================
-- 4. STORAGE BUCKETS CHECK
-- ==============================================
\echo '4. Checking Storage Buckets...'
\echo ''

WITH required_buckets AS (
  SELECT unnest(ARRAY[
    'avatars', 'community-media', 'demos', 'hero-media',
    'nfts', 'press_kit', 'product-images', 'temp'
  ]) as bucket_name
),
actual_buckets AS (
  SELECT id as bucket_name FROM storage.buckets
)
SELECT 
  'Storage Buckets' as check_name,
  COUNT(*) as required_buckets,
  COUNT(CASE WHEN ab.bucket_name IS NOT NULL THEN 1 END) as existing_buckets,
  COUNT(CASE WHEN ab.bucket_name IS NULL THEN 1 END) as missing_buckets
FROM required_buckets rb
LEFT JOIN actual_buckets ab ON rb.bucket_name = ab.bucket_name;

-- List missing buckets
\echo ''
\echo 'Missing Storage Buckets (if any):'
WITH required_buckets AS (
  SELECT unnest(ARRAY[
    'avatars', 'community-media', 'demos', 'hero-media',
    'nfts', 'press_kit', 'product-images', 'temp'
  ]) as bucket_name
),
actual_buckets AS (
  SELECT id as bucket_name FROM storage.buckets
)
SELECT 
  '❌ ' || rb.bucket_name as missing_bucket
FROM required_buckets rb
LEFT JOIN actual_buckets ab ON rb.bucket_name = ab.bucket_name
WHERE ab.bucket_name IS NULL;

\echo ''

-- ==============================================
-- 5. DATA POPULATION CHECK
-- ==============================================
\echo '5. Checking Data Population...'
\echo ''

SELECT 
  'Data Population' as check_name,
  (SELECT COUNT(*) FROM site_config) as site_config_entries,
  (SELECT COUNT(*) FROM hero_config) as hero_configs,
  (SELECT COUNT(*) FROM homepage_cards) as homepage_cards,
  (SELECT COUNT(*) FROM store_categories) as store_categories,
  (SELECT COUNT(*) FROM store_products) as store_products,
  (SELECT COUNT(*) FROM nft_categories) as nft_categories,
  (SELECT COUNT(*) FROM nft_products) as nft_products,
  (SELECT COUNT(*) FROM rewards_missions) as rewards_missions,
  (SELECT COUNT(*) FROM community_hashtags) as hashtags;

\echo ''

-- ==============================================
-- 6. INDEXES CHECK
-- ==============================================
\echo '6. Checking Database Indexes...'
\echo ''

SELECT 
  'Index Statistics' as check_name,
  COUNT(*) as total_indexes,
  COUNT(CASE WHEN indisunique THEN 1 END) as unique_indexes,
  COUNT(CASE WHEN NOT indisunique THEN 1 END) as non_unique_indexes
FROM pg_index i
JOIN pg_class c ON i.indexrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public';

\echo ''

-- ==============================================
-- 7. FUNCTIONS & TRIGGERS CHECK
-- ==============================================
\echo '7. Checking Functions and Triggers...'
\echo ''

SELECT 
  'Functions' as check_name,
  COUNT(*) as custom_functions
FROM information_schema.routines
WHERE routine_schema = 'public';

SELECT 
  'Triggers' as check_name,
  COUNT(*) as active_triggers
FROM information_schema.triggers
WHERE trigger_schema = 'public';

\echo ''

-- ==============================================
-- 8. POLICIES CHECK
-- ==============================================
\echo '8. Checking RLS Policies...'
\echo ''

SELECT 
  'RLS Policies' as check_name,
  COUNT(*) as total_policies,
  COUNT(DISTINCT tablename) as tables_with_policies
FROM pg_policies
WHERE schemaname = 'public';

-- Policy distribution
\echo ''
\echo 'Top 10 Tables by Policy Count:'
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY policy_count DESC
LIMIT 10;

\echo ''

-- ==============================================
-- 9. DATABASE SIZE CHECK
-- ==============================================
\echo '9. Checking Database Size...'
\echo ''

SELECT 
  'Database Size' as check_name,
  pg_size_pretty(pg_database_size(current_database())) as total_size;

-- Top 10 largest tables
\echo ''
\echo 'Top 10 Largest Tables:'
SELECT 
  schemaname || '.' || tablename as table_name,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;

\echo ''

-- ==============================================
-- 10. ENUM TYPES CHECK
-- ==============================================
\echo '10. Checking Custom ENUM Types...'
\echo ''

SELECT 
  'Custom ENUMs' as check_name,
  COUNT(*) as enum_count
FROM pg_type
WHERE typtype = 'e'
  AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- List all ENUMs
\echo ''
\echo 'Custom ENUM Types:'
SELECT 
  typname as enum_name,
  array_agg(enumlabel ORDER BY enumsortorder) as values
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
GROUP BY typname
ORDER BY typname;

\echo ''

-- ==============================================
-- 11. FOREIGN KEY CONSTRAINTS CHECK
-- ==============================================
\echo '11. Checking Foreign Key Constraints...'
\echo ''

SELECT 
  'Foreign Keys' as check_name,
  COUNT(*) as total_foreign_keys
FROM information_schema.table_constraints
WHERE constraint_schema = 'public'
  AND constraint_type = 'FOREIGN KEY';

\echo ''

-- ==============================================
-- 12. UNIQUE CONSTRAINTS CHECK
-- ==============================================
\echo '12. Checking Unique Constraints...'
\echo ''

SELECT 
  'Unique Constraints' as check_name,
  COUNT(*) as total_unique_constraints
FROM information_schema.table_constraints
WHERE constraint_schema = 'public'
  AND constraint_type = 'UNIQUE';

\echo ''

-- ==============================================
-- 13. PERFORMANCE METRICS
-- ==============================================
\echo '13. Checking Performance Metrics...'
\echo ''

-- Connection count
SELECT 
  'Active Connections' as metric_name,
  COUNT(*) as value
FROM pg_stat_activity
WHERE datname = current_database();

-- Cache hit ratio (should be > 95%)
SELECT 
  'Cache Hit Ratio' as metric_name,
  ROUND(
    100.0 * sum(blks_hit) / NULLIF(sum(blks_hit) + sum(blks_read), 0),
    2
  ) || '%' as value
FROM pg_stat_database
WHERE datname = current_database();

\echo ''

-- ==============================================
-- 14. SECURITY CHECKS
-- ==============================================
\echo '14. Checking Security Configuration...'
\echo ''

-- Check for tables with public INSERT/UPDATE/DELETE
SELECT 
  'Public Write Access' as check_name,
  COUNT(DISTINCT tablename) as tables_with_public_write
FROM pg_policies
WHERE schemaname = 'public'
  AND roles @> ARRAY['anon']
  AND cmd IN ('INSERT', 'UPDATE', 'DELETE');

\echo ''
\echo 'Tables with anonymous write access (should be reviewed):'
SELECT DISTINCT
  '⚠️  ' || tablename as table_name,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
  AND roles @> ARRAY['anon']
  AND cmd IN ('INSERT', 'UPDATE', 'DELETE')
ORDER BY tablename;

\echo ''

-- ==============================================
-- 15. CRITICAL CONFIGURATION CHECK
-- ==============================================
\echo '15. Checking Critical Configurations...'
\echo ''

-- Check if site_config has required sections
WITH required_sections AS (
  SELECT unnest(ARRAY[
    'home', 'store', 'community', 'bookings', 'resources',
    'notes', 'demo', 'presskit', 'profile', 'livestream', 'airdrop'
  ]) as section
),
actual_sections AS (
  SELECT section FROM site_config
)
SELECT 
  'Site Config Sections' as check_name,
  COUNT(*) as required_sections,
  COUNT(CASE WHEN a_s.section IS NOT NULL THEN 1 END) as configured_sections,
  COUNT(CASE WHEN a_s.section IS NULL THEN 1 END) as missing_sections
FROM required_sections r_s
LEFT JOIN actual_sections a_s ON r_s.section = a_s.section;

\echo ''

-- ==============================================
-- HEALTH CHECK SUMMARY
-- ==============================================
\echo '=================================================='
\echo 'HEALTH CHECK SUMMARY'
\echo '=================================================='
\echo ''

WITH health_status AS (
  SELECT
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') > 20 as has_tables,
    (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) > 15 as has_rls,
    (SELECT COUNT(*) FROM storage.buckets) >= 5 as has_buckets,
    (SELECT COUNT(*) FROM site_config) >= 5 as has_config,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') > 30 as has_policies
)
SELECT
  CASE
    WHEN has_tables AND has_rls AND has_buckets AND has_config AND has_policies
    THEN '✅ HEALTHY - All critical checks passed'
    ELSE '⚠️  NEEDS ATTENTION - Some checks failed'
  END as overall_status,
  CASE WHEN has_tables THEN '✅' ELSE '❌' END as tables_status,
  CASE WHEN has_rls THEN '✅' ELSE '❌' END as rls_status,
  CASE WHEN has_buckets THEN '✅' ELSE '❌' END as storage_status,
  CASE WHEN has_config THEN '✅' ELSE '❌' END as config_status,
  CASE WHEN has_policies THEN '✅' ELSE '❌' END as policies_status,
  NOW() as checked_at
FROM health_status;

\echo ''
\echo '=================================================='
\echo 'Health Check Complete'
\echo '=================================================='
\echo ''
\echo 'For detailed issues, review the sections above.'
\echo 'If critical issues are found, refer to MIGRATION_RUNBOOK.md'
\echo ''
