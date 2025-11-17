# Environment Setup Guide
**JestFly Platform**

This guide will help you set up your development and production environments.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Database Migrations](#database-migrations)
5. [Storage Buckets](#storage-buckets)
6. [Environment Variables](#environment-variables)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** 18.x or higher ([Install](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Git** ([Install](https://git-scm.com/))

### Required Accounts
- **Supabase Account** ([Sign up](https://supabase.com))
- **Stripe Account** (optional, for payments) ([Sign up](https://stripe.com))

### Recommended Tools
- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript
- **Supabase CLI** (optional, for local development) ([Install](https://supabase.com/docs/guides/cli))

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MartynLegrand/jestfly-MAIN.git
cd jestfly-MAIN
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React, React Router
- Supabase client
- Tailwind CSS, shadcn/ui
- Three.js (for 3D)
- And 700+ other dependencies

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your values
nano .env  # or use your preferred editor
```

**Minimum required variables:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Supabase Configuration

### Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose an organization (or create one)
4. Enter project details:
   - Name: `jestfly` (or your preference)
   - Database Password: (save this securely!)
   - Region: Choose closest to your users
5. Wait 2-3 minutes for project creation

### Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings > API**
2. Copy the following values:

**Project URL:**
```
https://xxxxx.supabase.co
```
Add to `.env` as `VITE_SUPABASE_URL`

**Anon/Public Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Add to `.env` as `VITE_SUPABASE_ANON_KEY`

**Service Role Key** (keep this secret!):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Store securely, only use server-side

### Step 3: Configure Authentication

1. Go to **Authentication > Providers**
2. Enable providers you want:
   - ✅ Email (enabled by default)
   - Google (optional, requires client ID)
   - GitHub (optional)
   - Discord (optional)

3. Configure Email Templates:
   - Go to **Authentication > Email Templates**
   - Customize "Confirm signup" email
   - Customize "Reset password" email
   - Update redirect URLs to your domain

4. Set Redirect URLs:
   - Go to **Authentication > URL Configuration**
   - Add redirect URLs:
     - `http://localhost:5173/**` (development)
     - `https://yoursite.com/**` (production)

---

## Database Migrations

### Apply Migrations via SQL Editor

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Apply migrations in order:

#### Migration 1: RLS Policies Fix
```bash
# File: supabase/migrations/20251117011743_fix_missing_rls_policies.sql
```
Copy the content and execute in SQL Editor.

#### Migration 2: Models Table
```bash
# File: supabase/migrations/20251117012226_create_models_table.sql
```

#### Migration 3: NFT Marketplace
```bash
# File: supabase/migrations/20251117030043_nft_marketplace_enhancements.sql
```

#### Migration 4: Site Configuration
```bash
# File: supabase/migrations/20251117033643_create_site_config.sql
```

#### Migration 5: Homepage System
```bash
# File: supabase/migrations/20251117034759_create_homepage_system.sql
```

#### Migration 6: Store System
```bash
# File: supabase/migrations/20251117035616_create_store_system.sql
```

#### Migration 7: Community System
```bash
# File: supabase/migrations/20251117040000_create_community_system.sql
```

### Verify Migrations

After running all migrations, verify tables exist:

1. Go to **Table Editor**
2. You should see these tables:
   - `profiles`
   - `models`
   - `site_config`
   - `homepage_hero_cards`
   - `store_products`
   - `store_categories`
   - `store_cart`
   - `store_orders`
   - `store_order_items`
   - `nft_products`
   - `nft_categories`
   - `user_wallets`
   - `user_nft_inventory`
   - `product_transactions`
   - `physical_items`
   - `shopping_cart`
   - `wishlist`
   - `rewards_missions`
   - `user_rewards`
   - `community_posts`
   - `community_comments`
   - `community_likes`
   - `community_follows`
   - `notifications`

---

## Storage Buckets

### Create Required Buckets

1. Go to **Storage** in Supabase dashboard
2. Create these buckets:

#### 1. `product-images`
- **Public:** Yes
- **Purpose:** Store product images
- **File size limit:** 10 MB
- **Allowed MIME types:** image/jpeg, image/png, image/webp, image/gif

#### 2. `community-media`
- **Public:** Yes
- **Purpose:** Community post images/videos
- **File size limit:** 10 MB (images), 50 MB (videos)
- **Allowed MIME types:** image/*, video/*

#### 3. `nft-assets`
- **Public:** Yes
- **Purpose:** NFT images, 3D models, metadata
- **File size limit:** 20 MB
- **Allowed MIME types:** image/*, model/gltf-binary, application/json

#### 4. `user-avatars`
- **Public:** Yes
- **Purpose:** User profile pictures
- **File size limit:** 5 MB
- **Allowed MIME types:** image/jpeg, image/png, image/webp

#### 5. `models`
- **Public:** Yes
- **Purpose:** 3D model files (.glb, .gltf)
- **File size limit:** 50 MB
- **Allowed MIME types:** model/gltf-binary, model/gltf+json

### Configure Storage Policies

For each bucket, set RLS policies:

```sql
-- Example for product-images bucket
-- Allow public read
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow users to update their own files
CREATE POLICY "User update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid() = owner)
WITH CHECK (bucket_id = 'product-images');

-- Allow users to delete their own files
CREATE POLICY "User delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);
```

Repeat similar policies for other buckets.

---

## Environment Variables

### Required Variables

```env
# Minimum to run the app
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optional Variables

#### For E-commerce (Stripe)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...  # Server-side only!
```

#### For Analytics
```env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_POSTHOG_KEY=phc_...
```

#### For Error Tracking
```env
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Variable Naming Convention

- `VITE_*` - Exposed to client-side code
- No prefix - Server-side only (never sent to browser)

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All migrations applied
- [ ] Storage buckets created
- [ ] RLS policies configured
- [ ] Environment variables set
- [ ] Build succeeds locally
- [ ] Test user accounts created
- [ ] Admin users assigned

### Deployment Steps

#### 1. Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

#### 2. Deploy to Hosting Platform

**Option A: Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Option B: Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Option C: GitHub Pages**
```bash
# Build
npm run build

# Deploy (using gh-pages package)
npm install -g gh-pages
gh-pages -d dist
```

#### 3. Configure Environment Variables

In your hosting platform dashboard:
1. Add all `VITE_*` variables
2. Set `VITE_APP_ENV=production`
3. Set `VITE_APP_URL` to your domain

#### 4. Update Supabase Redirect URLs

In Supabase dashboard:
1. Go to **Authentication > URL Configuration**
2. Add your production domain:
   - `https://yoursite.com/**`

#### 5. Configure Custom Domain (Optional)

Follow your hosting provider's instructions to add a custom domain.

### Post-Deployment Verification

- [ ] Homepage loads
- [ ] 3D scene renders
- [ ] User can register/login
- [ ] Store page displays products
- [ ] NFT marketplace loads
- [ ] Community feed works
- [ ] Admin panel accessible (admin users only)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Lighthouse score > 85

---

## Troubleshooting

### Common Issues

#### 1. "Failed to fetch" or "Network Error"

**Cause:** Wrong Supabase URL or key

**Solution:**
- Verify `VITE_SUPABASE_URL` in `.env`
- Verify `VITE_SUPABASE_ANON_KEY` in `.env`
- Restart dev server after changing `.env`

#### 2. "relation does not exist" SQL Error

**Cause:** Migrations not applied

**Solution:**
- Run all migrations in Supabase SQL Editor
- Verify tables exist in Table Editor

#### 3. "Storage bucket not found"

**Cause:** Buckets not created

**Solution:**
- Create required storage buckets in Supabase
- Verify bucket names match code

#### 4. "Access denied" or RLS Policy Errors

**Cause:** Missing or incorrect RLS policies

**Solution:**
- Check RLS policies in Supabase
- Ensure policies allow expected operations
- Test with different user roles

#### 5. "Module not found" Build Error

**Cause:** Missing dependencies

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 6. White Screen in Production

**Cause:** Asset path issues

**Solution:**
- Check browser console for 404 errors
- Verify base path in `vite.config.ts`
- Ensure assets are in `public/` folder

#### 7. 3D Scene Not Loading

**Cause:** WebGL not supported or model file missing

**Solution:**
- Test WebGL: visit https://get.webgl.org/
- Check model files exist in `public/models/`
- Check console for Three.js errors

### Getting Help

- **Documentation:** Check other docs in `/docs` folder
- **Build Logs:** Check console output during `npm run build`
- **Browser Console:** Press F12 to see errors
- **Supabase Logs:** Check Logs section in Supabase dashboard

---

## Next Steps

After completing environment setup:

1. Read [MIGRATION_RUNBOOK.md](./MIGRATION_RUNBOOK.md) for database details
2. Read [SEED_DATA_GUIDE.md](./SEED_DATA_GUIDE.md) to populate test data
3. Read [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) to learn admin features
4. Read [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) before going live

---

**Last Updated:** November 17, 2025  
**Agent:** 2 (Data, Access & Environment Guardian)
