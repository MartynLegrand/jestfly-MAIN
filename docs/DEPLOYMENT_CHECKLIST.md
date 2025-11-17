# Deployment Checklist
**JestFly Platform**

Use this checklist before deploying to production.

---

## Pre-Deployment Checklist

### Code & Build ✅
- [ ] All code committed and pushed
- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Bundle size acceptable (< 3 MB)
- [ ] All dependencies up to date
- [ ] No security vulnerabilities: `npm audit`

### Database & Backend ✅
- [ ] All migrations applied to production database
- [ ] Seed data loaded (if needed)
- [ ] RLS policies verified and tested
- [ ] Storage buckets created
- [ ] Storage policies configured
- [ ] Database backups enabled
- [ ] Connection limits configured

### Environment & Configuration ✅
- [ ] Production `.env` variables set
- [ ] `VITE_APP_ENV=production`
- [ ] `VITE_APP_URL` set to production domain
- [ ] Supabase URL and keys configured
- [ ] Payment provider keys set (Stripe, etc.)
- [ ] Analytics keys configured
- [ ] Error tracking configured (Sentry)
- [ ] Email service configured (if applicable)
- [ ] Debug mode disabled (`VITE_DEBUG=false`)

### Security ✅
- [ ] All API keys are in environment variables (not hardcoded)
- [ ] Service role keys are server-side only
- [ ] CORS configured correctly
- [ ] Rate limiting configured
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] HTTPS enforced
- [ ] Security headers configured

### Content & Data ✅
- [ ] Homepage content finalized
- [ ] Products added to store
- [ ] NFTs created and published
- [ ] About/Contact pages complete
- [ ] Legal pages (Terms, Privacy) published
- [ ] 404 and error pages styled
- [ ] Default images/assets uploaded
- [ ] Press kit materials uploaded

### Testing ✅
- [ ] Manual testing in staging environment
- [ ] User registration works
- [ ] Login/logout works
- [ ] Password reset works
- [ ] Product browsing works
- [ ] Cart functionality works
- [ ] Checkout flow works (if implemented)
- [ ] NFT browsing works
- [ ] Community features work
- [ ] Admin panel accessible
- [ ] Mobile responsive verified
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Performance tested (Lighthouse > 85)

### Monitoring & Analytics ✅
- [ ] Error tracking active (Sentry/similar)
- [ ] Analytics tracking active (GA4/PostHog)
- [ ] Performance monitoring configured
- [ ] Uptime monitoring set up
- [ ] Alert notifications configured
- [ ] Log aggregation configured

### DNS & Domain ✅
- [ ] Custom domain purchased (if applicable)
- [ ] DNS records configured
- [ ] SSL certificate obtained/configured
- [ ] WWW and non-WWW redirect configured
- [ ] Domain propagation verified

### Hosting Platform ✅
- [ ] Hosting provider selected
- [ ] Account created and configured
- [ ] Billing information added
- [ ] Auto-deploy enabled (if using)
- [ ] Environment variables set in platform
- [ ] Build settings configured
- [ ] Deploy previews enabled
- [ ] Rollback plan documented

---

## Deployment Steps

### Step 1: Final Build
```bash
# Clean previous builds
rm -rf dist/

# Build for production
npm run build

# Verify build output
ls -lh dist/
```

### Step 2: Deploy to Hosting

**Option A: Netlify**
```bash
netlify deploy --prod --dir=dist
```

**Option B: Vercel**
```bash
vercel --prod
```

**Option C: Manual Upload**
1. Upload `dist/` folder contents
2. Configure web server to serve index.html for all routes

### Step 3: Verify Deployment

#### Smoke Tests
1. Visit production URL
2. Homepage loads correctly
3. 3D scene renders
4. Navigation works
5. User can register
6. User can login
7. Store page loads
8. NFT marketplace loads
9. Community page loads
10. Admin panel (admin only)

#### Performance Check
```bash
# Run Lighthouse
npx lighthouse https://yoursite.com --view
```

Expected scores:
- Performance: > 85
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Step 4: Configure Post-Deployment

#### Update Supabase Redirect URLs
1. Go to Supabase Dashboard
2. Authentication → URL Configuration
3. Add production URLs:
   - `https://yoursite.com/**`
   - `https://www.yoursite.com/**`

#### Set Up Monitoring
1. Configure error tracking
2. Set up uptime monitoring
3. Configure performance alerts
4. Set up log forwarding

#### Verify Integrations
- [ ] Payment provider webhook configured
- [ ] Email service verified
- [ ] Analytics events firing
- [ ] Error tracking receiving events

### Step 5: Post-Deployment Testing

Test critical paths:
- [ ] User registration → email verification
- [ ] Login → profile access
- [ ] Browse products → add to cart
- [ ] NFT browsing → details page
- [ ] Community → create post
- [ ] Admin login → dashboard access

---

## Platform-Specific Guides

### Netlify Deployment

#### Initial Setup
```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init
```

#### Build Settings
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18.x

#### Environment Variables
Add in Netlify dashboard: Site Settings → Environment Variables

#### Custom Domain
Site Settings → Domain Management → Add Custom Domain

#### Redirects
Create `public/_redirects`:
```
/*    /index.html   200
```

### Vercel Deployment

#### Initial Setup
```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

#### Configuration
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### GitHub Pages

#### Setup
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"deploy": "gh-pages -d dist"

# Update vite.config.ts base path
base: '/repo-name/'
```

#### Deploy
```bash
npm run build
npm run deploy
```

---

## Rollback Procedures

### Quick Rollback (Netlify/Vercel)
1. Go to dashboard
2. Deployments tab
3. Find previous working deployment
4. Click "Publish" or "Promote to Production"

### Manual Rollback
1. Checkout previous commit
2. Build and deploy
```bash
git checkout <previous-commit-hash>
npm run build
# Deploy using your method
```

### Database Rollback
```bash
# Use Supabase dashboard
# Or restore from backup
```

**WARNING:** Database rollback may cause data loss!

---

## Monitoring Dashboard

### Metrics to Track

**Performance:**
- Page load time
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

**Business:**
- User registrations
- Active users
- Product views
- Cart additions
- Purchases (when implemented)
- NFT sales
- Community posts

**Technical:**
- Error rate
- Uptime percentage
- API response times
- Database query performance
- CDN hit rate

### Alert Thresholds

Set up alerts for:
- Error rate > 1%
- Uptime < 99%
- Page load time > 3s
- Build failures
- Security vulnerabilities

---

## Maintenance Windows

### Scheduled Maintenance
- Announce 24-48 hours in advance
- Choose low-traffic time (typically 2-4 AM)
- Display maintenance page
- Keep window < 2 hours
- Monitor after completion

### Emergency Maintenance
- Notify users immediately
- Fix critical issue
- Deploy hotfix
- Monitor closely
- Post-mortem review

---

## Backup & Recovery

### Automated Backups
- Database: Daily via Supabase
- Files: Daily via storage provider
- Config: Version controlled (Git)

### Recovery Time Objectives (RTO)
- Critical bugs: < 1 hour
- Major issues: < 4 hours
- Minor issues: < 24 hours

### Recovery Point Objective (RPO)
- Maximum data loss: 24 hours
- Aim for: < 1 hour

---

## Launch Checklist

### Day Before Launch
- [ ] All checklists complete
- [ ] Team briefed
- [ ] Support channels ready
- [ ] Monitoring configured
- [ ] Rollback plan ready

### Launch Day
- [ ] Deploy to production
- [ ] Run smoke tests
- [ ] Monitor errors closely
- [ ] Check analytics
- [ ] Test critical paths
- [ ] Notify stakeholders

### First Week
- [ ] Daily monitoring
- [ ] Address issues quickly
- [ ] Collect user feedback
- [ ] Performance tuning
- [ ] Content updates as needed

---

## Post-Launch Support

### Expected Issues
- Minor bugs
- Performance tuning needed
- User questions
- Content updates

### Response Times
- Critical bugs: < 1 hour
- High priority: < 4 hours
- Medium priority: < 24 hours
- Low priority: < 1 week

---

## Success Metrics

### Technical Success
- Uptime > 99.9%
- Page load < 3s
- Error rate < 0.1%
- Lighthouse scores > 85

### Business Success
- User registrations meeting targets
- Active user growth
- Feature adoption rates
- Revenue metrics (when applicable)

---

**Deployment Status:** Not Yet Deployed  
**Target Date:** TBD  
**Last Updated:** November 17, 2025  
**Agent:** 8 (Release, Analytics & Observability Captain)
