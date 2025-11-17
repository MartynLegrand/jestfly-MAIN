# Storage Bucket Configuration Guide

## Overview
This document describes all storage buckets used in the JestFly platform, their purposes, policies, and configuration.

## Storage Architecture

JestFly uses Supabase Storage for managing media files and user uploads. All buckets are configured with appropriate access policies and size limits.

## Bucket List

### 1. avatars
**Purpose:** User profile avatars  
**Public Access:** Yes  
**Max File Size:** 2 MB  
**Allowed File Types:** image/jpeg, image/png, image/gif, image/webp

**Policies:**
- ✅ Anyone can view avatars
- ✅ Authenticated users can upload avatars (to their own folder)
- ✅ Users can update their own avatars
- ✅ Users can delete their own avatars

**Path Structure:**
```
/avatars/{user_id}/{filename}
```

**Configuration:**
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
```

---

### 2. community-media
**Purpose:** User-generated content for community posts  
**Public Access:** Yes  
**Max File Size:** 10 MB  
**Allowed File Types:** image/*, video/mp4, video/webm

**Policies:**
- ✅ Anyone can view community media
- ✅ Authenticated users can upload community media
- ✅ Users can update their own media
- ✅ Users can delete their own media

**Path Structure:**
```
/community-media/{user_id}/posts/{post_id}/{filename}
/community-media/{user_id}/comments/{comment_id}/{filename}
```

**Configuration:**
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-media',
  'community-media',
  true,
  10485760, -- 10 MB
  ARRAY['image/*', 'video/mp4', 'video/webm']
);
```

---

### 3. demos
**Purpose:** Demo submissions and audio files from artists  
**Public Access:** No (Private)  
**Max File Size:** 50 MB  
**Allowed File Types:** audio/*, video/*, application/zip

**Policies:**
- ❌ Public cannot view demos
- ✅ Authenticated users can upload demos (to their own folder)
- ✅ Users can view their own demos
- ✅ Admins can view all demos
- ✅ Users can delete their own demos

**Path Structure:**
```
/demos/{user_id}/{submission_id}/{filename}
```

**Configuration:**
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'demos',
  'demos',
  false,
  52428800, -- 50 MB
  ARRAY['audio/*', 'video/*', 'application/zip']
);
```

---

### 4. hero-media
**Purpose:** Homepage hero section videos and images  
**Public Access:** Yes  
**Max File Size:** 100 MB  
**Allowed File Types:** video/*, image/*

**Policies:**
- ✅ Anyone can view hero media
- ✅ Only admins can upload hero media
- ✅ Only admins can update hero media
- ✅ Only admins can delete hero media

**Path Structure:**
```
/hero-media/videos/{filename}
/hero-media/images/{filename}
```

**Configuration:**
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-media',
  'hero-media',
  true,
  104857600, -- 100 MB
  ARRAY['video/*', 'image/*']
);
```

---

### 5. nfts
**Purpose:** NFT images, metadata, and related files  
**Public Access:** Yes  
**Max File Size:** 20 MB  
**Allowed File Types:** image/*, video/*, audio/*, application/json

**Policies:**
- ✅ Anyone can view NFT files
- ✅ Creators and admins can upload NFT files
- ✅ Creators can update their own NFT files
- ✅ Creators can delete their own NFT files

**Path Structure:**
```
/nfts/collections/{collection_id}/{nft_id}/{filename}
/nfts/metadata/{nft_id}.json
/nfts/thumbnails/{nft_id}.jpg
```

**Configuration:**
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'nfts',
  'nfts',
  true,
  20971520, -- 20 MB
  ARRAY['image/*', 'video/*', 'audio/*', 'application/json']
);
```

---

### 6. press_kit
**Purpose:** Press materials and media assets  
**Public Access:** Yes  
**Max File Size:** 50 MB  
**Allowed File Types:** image/*, video/*, application/pdf, application/zip

**Policies:**
- ✅ Anyone can view press kit materials
- ✅ Only admins can upload press materials
- ✅ Only admins can update press materials
- ✅ Only admins can delete press materials

**Path Structure:**
```
/press_kit/photos/{filename}
/press_kit/logos/{filename}
/press_kit/documents/{filename}
/press_kit/videos/{filename}
```

**Configuration:**
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'press_kit',
  'press_kit',
  true,
  52428800, -- 50 MB
  ARRAY['image/*', 'video/*', 'application/pdf', 'application/zip']
);
```

---

### 7. product-images
**Purpose:** Product images for store items  
**Public Access:** Yes  
**Max File Size:** 5 MB  
**Allowed File Types:** image/jpeg, image/png, image/webp

**Policies:**
- ✅ Anyone can view product images
- ✅ Only admins can upload product images
- ✅ Only admins can update product images
- ✅ Only admins can delete product images

**Path Structure:**
```
/product-images/{product_id}/main.jpg
/product-images/{product_id}/gallery/{index}.jpg
/product-images/{product_id}/thumbnails/{size}.jpg
```

**Configuration:**
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);
```

---

### 8. temp
**Purpose:** Temporary file uploads and processing  
**Public Access:** No (Private)  
**Max File Size:** 20 MB  
**Allowed File Types:** All (*)

**Policies:**
- ❌ Public cannot view temp files
- ✅ Authenticated users can upload temp files (to their own folder)
- ✅ Users can view their own temp files
- ✅ Users can delete their own temp files
- 🔄 Files auto-delete after 24 hours

**Path Structure:**
```
/temp/{user_id}/{timestamp}_{filename}
```

**Configuration:**
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'temp',
  'temp',
  false,
  20971520, -- 20 MB
  NULL -- Allow all types
);
```

---

## Storage Policy Templates

### Public Bucket with Admin-Only Write

```sql
-- View policy (anyone)
CREATE POLICY "public_view"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bucket_name');

-- Upload policy (admin only)
CREATE POLICY "admin_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'bucket_name' 
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update policy (admin only)
CREATE POLICY "admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'bucket_name'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Delete policy (admin only)
CREATE POLICY "admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'bucket_name'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Public Bucket with User-Owned Files

```sql
-- View policy (anyone)
CREATE POLICY "public_view"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bucket_name');

-- Upload policy (authenticated, own folder)
CREATE POLICY "user_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'bucket_name'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Update policy (own files only)
CREATE POLICY "user_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'bucket_name'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete policy (own files only)
CREATE POLICY "user_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'bucket_name'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

### Private Bucket with User Access

```sql
-- View policy (own files only)
CREATE POLICY "user_view_own"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'bucket_name'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin view all
CREATE POLICY "admin_view_all"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'bucket_name'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Upload policy (own folder)
CREATE POLICY "user_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'bucket_name'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete policy (own files)
CREATE POLICY "user_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'bucket_name'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

## Client-Side Upload Examples

### Upload Avatar

```typescript
import { supabase } from '@/integrations/supabase/client';

async function uploadAvatar(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true // Replace existing avatar
    });
    
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
    
  return publicUrl;
}
```

### Upload Community Post Image

```typescript
async function uploadPostImage(file: File, userId: string, postId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/posts/${postId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('community-media')
    .upload(fileName, file, {
      cacheControl: '3600'
    });
    
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('community-media')
    .getPublicUrl(fileName);
    
  return publicUrl;
}
```

### Upload Product Image (Admin)

```typescript
async function uploadProductImage(file: File, productId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}/main.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });
    
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);
    
  return publicUrl;
}
```

## File Size Limits

| Bucket | Max File Size | Recommended Size |
|--------|--------------|------------------|
| avatars | 2 MB | 500 KB |
| community-media | 10 MB | 3 MB |
| demos | 50 MB | 20 MB |
| hero-media | 100 MB | 50 MB |
| nfts | 20 MB | 5 MB |
| press_kit | 50 MB | 10 MB |
| product-images | 5 MB | 1 MB |
| temp | 20 MB | - |

## Best Practices

### 1. Image Optimization
- Always compress images before upload
- Use WebP format when possible
- Generate thumbnails server-side
- Use CDN for delivery

### 2. Security
- Validate file types on client AND server
- Scan uploads for malware
- Use signed URLs for sensitive content
- Implement rate limiting

### 3. Performance
- Use lazy loading for images
- Implement progressive loading
- Cache frequently accessed files
- Use appropriate image sizes

### 4. Organization
- Use consistent naming conventions
- Organize files in logical folders
- Clean up old/unused files regularly
- Implement soft delete for safety

## Cleanup Scripts

### Delete Old Temp Files

```sql
-- Delete temp files older than 24 hours
DELETE FROM storage.objects
WHERE bucket_id = 'temp'
  AND created_at < NOW() - INTERVAL '24 hours';
```

### Find Orphaned Files

```sql
-- Find avatar files without associated profiles
SELECT o.name
FROM storage.objects o
WHERE o.bucket_id = 'avatars'
  AND NOT EXISTS (
    SELECT 1 FROM profiles p
    WHERE (storage.foldername(o.name))[1] = p.id::text
  );
```

### Storage Usage Report

```sql
-- Storage usage by bucket
SELECT
  bucket_id,
  COUNT(*) as file_count,
  pg_size_pretty(SUM(
    (metadata->>'size')::bigint
  )) as total_size
FROM storage.objects
GROUP BY bucket_id
ORDER BY SUM((metadata->>'size')::bigint) DESC;
```

## Troubleshooting

### Issue: Upload fails with "Policy violation"

**Solution:** Check that:
1. User is authenticated
2. File path matches policy requirements
3. User has proper permissions
4. File size is within limits

### Issue: File not visible after upload

**Solution:** Check that:
1. Bucket is set to public
2. RLS policies allow SELECT
3. File path is correct
4. Browser cache isn't stale

### Issue: Slow upload speeds

**Solution:**
1. Compress files before upload
2. Use multipart upload for large files
3. Check network connection
4. Consider CDN for better delivery

## Monitoring

Set up monitoring for:
- [ ] Total storage usage per bucket
- [ ] Upload success/failure rates
- [ ] Average upload times
- [ ] Most accessed files
- [ ] Orphaned files count
- [ ] Policy violations

## Backup Strategy

- [ ] Regular snapshots of critical buckets
- [ ] Versioning enabled on important files
- [ ] Off-site backup for press_kit and nfts
- [ ] Test restore procedures quarterly

## Sign-Off

- [ ] All buckets created
- [ ] Policies configured and tested
- [ ] File size limits set
- [ ] Cleanup scripts scheduled
- [ ] Monitoring configured
- [ ] Documentation complete

**Configured by:** _______________  
**Date:** _______________
