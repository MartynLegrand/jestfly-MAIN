# Admin Dashboard Guide
**JestFly Platform**

Complete guide to using the Admin Dashboard.

---

## Accessing the Admin Panel

**URL:** `/admin`  
**Required Role:** Admin  
**Authentication:** Must be logged in with admin privileges

### Setting Admin Role

In Supabase, update a user's profile:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'youremail@example.com';
```

---

## Dashboard Overview

The admin dashboard has 19 configuration tabs organized into 3 categories:

### Pages (12 tabs)
- Home, Store, NFT Store, Community, Bookings, Resources
- Notes, Demo Submission, Press Kit, Profile, Live Stream, Airdrop

### Design (6 tabs)
- Colors, Fonts, Layout, Elements, 3D Models, Materials

### System (1 tab)
- Settings

---

## Tab-by-Tab Guide

### 1. Overview Tab
- Dashboard cards for quick access
- Click any card to jump to that section
- Shows statistics (if implemented)

### 2. Home Tab
- Configure homepage hero section
- Manage hero cards
- Set CTAs and links
- Toggle 3D crystal display
- Configure gallery

### 3. Store Tab
- Set store title and description
- Enable/disable categories
- Configure filters
- Set items per page
- Enable cart and wishlist

### 4. NFT Store Tab (NFT Generator)
**Location:** Admin Dashboard → NFT Generator tab

#### Creating an NFT Product

1. **Basic Info Tab:**
   - Name: Product title
   - Slug: Auto-generated URL (editable)
   - Description: Detailed product info
   - Type: Digital / Physical / Hybrid
   - Rarity: Common / Uncommon / Rare / Epic / Legendary
   - Tags: For search and filtering

2. **Pricing Tab:**
   - Jest Coins Price: Virtual currency amount
   - USD Price: Real money amount
   - Payment Methods: Jest Coin / Money / Both
   - Stock Control:
     - Limited or unlimited supply
     - Max per user
     - Edition numbering

3. **Media Tab:**
   - Main Image URL
   - Gallery Images (multiple)
   - Video URL (promotional)
   - 3D Model (.glb file)

4. **Advanced Tab:**
   - Custom metadata
   - Special attributes
   - Additional settings

#### Viewing Products
- Sidebar shows all created products
- Click to edit existing products
- Visual preview with image, type, rarity, prices

### 5. Community Tab
- Enable/disable features (posts, comments, likes)
- Set moderation settings
- Configure posts per page
- Community guidelines

### 6-12. Other Page Tabs
Similar configuration pattern:
- Title and description
- Feature toggles
- Display settings
- Custom configurations

---

## Design System Tabs

### Colors Tab
- Primary, secondary, accent colors
- Background and text colors
- Gradient configurations
- Theme presets

### Fonts Tab
- Heading font family
- Body font family
- Font sizes and weights
- Line heights

### Layout Tab
- Page layouts
- Grid systems
- Spacing scales
- Responsive breakpoints

### Elements Tab
- Button styles
- Card designs
- Form elements
- Navigation styles

### 3D Models Tab
- Manage 3D assets
- Upload .glb files
- Preview models
- Set default models

### Materials Tab
- Material properties
- Metalness, roughness
- Transparency settings
- Lighting configuration

---

## Common Tasks

### Adding a New Product (Store)

1. Go to Admin → Store Config (or use ProductManager)
2. Click "Add Product"
3. Fill in:
   - Name, description
   - Price, compare price
   - Category
   - Stock quantity
   - Images
   - SKU
   - Tags
4. Set featured status
5. Click "Save"

### Creating an NFT

1. Go to Admin → NFT Generator
2. Fill in all tabs:
   - Basic Info (required)
   - Pricing (required)
   - Media (at least one image)
   - Advanced (optional)
3. Click "Create NFT Product"
4. Product appears in sidebar
5. Click "Publish" to make live

### Updating Homepage

1. Go to Admin → Home
2. Update hero title, subtitle
3. Toggle features (crystal, gallery)
4. Set CTA text and link
5. Changes auto-save
6. Toast confirms: "Home configuration saved!"

### Managing Site Config

1. Go to relevant tab
2. Edit fields
3. Click "Save Changes"
4. Data saved to `site_config` table
5. Frontend reads updated config

---

## Keyboard Shortcuts (Admin Only)

**Note:** These work anywhere in the app when logged in as admin.

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Open Admin Quick Menu |
| `Ctrl/Cmd + Shift + A` | Go to Admin Panel |
| `Ctrl/Cmd + Shift + H` | Go to Homepage |
| `Ctrl/Cmd + Shift + N` | Go to NFT Store |

### Admin Quick Access Menu
- Floating button (bottom-right)
- Quick links to all admin sections
- Shows keyboard shortcuts
- Platform-specific (Mac vs Windows/Linux)

---

## Tips & Best Practices

### 1. Auto-Save
- Most forms auto-save on change
- Watch for toast notifications
- No manual save needed (usually)

### 2. Image URLs
- Use absolute URLs (https://...)
- Or relative URLs (/assets/...)
- Test image loads before saving
- Recommended size: 1920x1080 for heroes

### 3. Slugs
- Auto-generated from names
- URL-friendly (lowercase, hyphens)
- Must be unique
- Can be edited if needed

### 4. Pricing
- Set both Jest Coin and USD prices for flexibility
- Payment method determines which is used
- "Both" allows user choice

### 5. Stock Management
- Use "unlimited" for digital products
- Set limits for physical items
- Monitor stock levels
- Get alerts when low (if implemented)

### 6. Testing Changes
- Test in development first
- Use preview mode (if available)
- Check mobile responsive
- Verify links work

---

## Troubleshooting

### Changes Not Showing

**Issue:** Updated config but frontend unchanged

**Solutions:**
- Hard refresh browser (Ctrl/Cmd + Shift + R)
- Clear browser cache
- Verify data saved in Supabase
- Check console for errors

### Can't Access Admin Panel

**Issue:** Redirected or "Unauthorized" message

**Solutions:**
- Verify logged in
- Check role in Supabase: `SELECT role FROM profiles WHERE id = auth.uid()`
- Should be 'admin'
- Logout and login again

### Images Not Loading

**Issue:** Broken image icons

**Solutions:**
- Verify URL is correct
- Check image exists at URL
- Ensure image is publicly accessible
- Check browser console for 404 errors
- Use Supabase Storage for uploads

### Save Button Not Working

**Issue:** Clicking save does nothing

**Solutions:**
- Check browser console for errors
- Verify required fields filled
- Check network tab for failed requests
- Ensure not rate limited

---

## Security Notes

### Important Reminders

1. **Admin Access:** Only trusted users should have admin role
2. **SQL Injection:** All inputs are sanitized
3. **RLS Policies:** Database enforces admin-only modifications
4. **Session Security:** Admin sessions expire (configure in Supabase)
5. **Audit Logs:** Consider implementing for production

### Best Practices

- Don't share admin credentials
- Use strong passwords
- Enable 2FA on Supabase account
- Regularly review admin users
- Monitor for suspicious activity

---

## Advanced Features

### Bulk Operations (Future)

- Import/export products via CSV
- Batch update prices
- Mass publish/unpublish
- Bulk delete (with confirmation)

### Scheduling (Future)

- Schedule product launches
- Time-limited offers
- Automated price changes
- Campaign management

### Analytics (Future)

- View product performance
- Track user engagement
- Monitor sales trends
- Export reports

---

## Data Management

### Exporting Data

Currently manual via Supabase:
1. Go to Table Editor
2. Select table
3. Export as CSV

### Importing Data

Currently manual:
1. Prepare CSV with correct columns
2. Use Supabase import feature
3. Or use seed SQL scripts

### Backing Up

Recommended schedule:
- Daily: Automated Supabase backups
- Weekly: Manual export of critical data
- Before major changes: Full backup

---

## Getting Help

### Resources

- Full documentation in `/docs` folder
- Check `NFT_SYSTEM_GUIDE.md` for NFT details
- See `SESSION_*_COMPLETE.md` for feature docs
- Review `ADMIN_DASHBOARD_COMPLETE.md`

### Support Channels

- Check browser console (F12)
- Review Supabase logs
- Check GitHub issues
- Contact dev team

---

## Quick Reference

### Common URLs
- Admin Panel: `/admin`
- Homepage: `/`
- Store: `/store`
- NFT Store: `/nft-store`
- Community: `/community`

### Key Tables
- `site_config` - All configuration
- `store_products` - Store items
- `nft_products` - NFT items
- `homepage_hero_cards` - Hero cards

### Essential Queries
```sql
-- Get all config
SELECT * FROM site_config;

-- List all products
SELECT name, price FROM store_products;

-- Check admin users
SELECT username, role FROM profiles WHERE role = 'admin';
```

---

**Last Updated:** November 17, 2025  
**Agent:** 3 (Admin Experience & Configuration Integrator)
