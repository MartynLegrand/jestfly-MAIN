# 🚀 Production Deployment Checklist

## Pre-Deployment Verification

### Environment Configuration
- [ ] All environment variables are set in production `.env`
  - [ ] `VITE_SUPABASE_URL` configured
  - [ ] `VITE_SUPABASE_ANON_KEY` configured
  - [ ] `VITE_ENABLE_ANALYTICS=true`
  - [ ] `VITE_ENVIRONMENT=production`
- [ ] `.env.example` updated with all required variables
- [ ] Secrets are stored securely (GitHub Secrets, Vault, etc.)
- [ ] No development/staging credentials in production config

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] Linter passes with no errors (`npm run lint`)
- [ ] TypeScript compilation successful (`npx tsc --noEmit`)
- [ ] No console.log statements in production code (except monitoring)
- [ ] Code review completed and approved
- [ ] Security vulnerabilities addressed (`npm audit`)

### Build Verification
- [ ] Production build successful (`npm run build`)
- [ ] Build artifacts generated in `/dist` directory
- [ ] Bundle size within acceptable limits (< 2.5 MB warning threshold)
- [ ] Source maps generated for debugging
- [ ] Assets properly optimized and compressed

### Database & Backend
- [ ] All Supabase migrations applied to production
- [ ] RLS policies tested and verified
- [ ] Database backups configured
- [ ] Storage buckets configured with proper permissions
- [ ] API rate limits configured
- [ ] Seed data populated (if applicable)

### Analytics & Monitoring
- [ ] Analytics tracking configured and tested
- [ ] Error monitoring service integrated (Sentry/Rollbar)
- [ ] Performance monitoring enabled
- [ ] Health check endpoints functional
- [ ] Logging infrastructure in place
- [ ] Alerting rules configured

### Performance
- [ ] Lighthouse score ≥ 90 for key pages
- [ ] 3D scenes achieve ≥ 55 FPS on mobile
- [ ] Page load time < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] Lazy loading implemented for heavy components
- [ ] Code splitting optimized
- [ ] Image optimization complete

### Security
- [ ] HTTPS configured and enforced
- [ ] CORS settings properly configured
- [ ] Authentication flows tested
- [ ] Authorization rules verified
- [ ] API keys and secrets not exposed in client code
- [ ] Content Security Policy (CSP) configured
- [ ] XSS and CSRF protections in place

### User Experience
- [ ] All critical user flows tested end-to-end
  - [ ] User registration and login
  - [ ] Product browsing and purchase
  - [ ] NFT marketplace transactions
  - [ ] Community interactions
  - [ ] Admin panel functionality
- [ ] Mobile responsiveness verified (iOS and Android)
- [ ] Cross-browser testing complete (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility audit passed (WCAG AA compliance)
- [ ] Loading states and error messages user-friendly

### Content & Data
- [ ] Sample/demo content populated
- [ ] Default admin account created
- [ ] Marketing hero and cards configured
- [ ] Store products seeded
- [ ] NFT marketplace items available
- [ ] Community guidelines published
- [ ] Terms of Service and Privacy Policy links active

### Integration Testing
- [ ] Payment processing tested (Stripe/Jest Coin)
- [ ] Email notifications working
- [ ] Real-time features functional (notifications, chat)
- [ ] File uploads working correctly
- [ ] 3D model loading verified
- [ ] Third-party API integrations tested

## Deployment Process

### Step 1: Pre-Deployment
- [ ] Create deployment announcement
- [ ] Notify team of deployment window
- [ ] Schedule maintenance window (if needed)
- [ ] Backup current production state
- [ ] Tag release in git: `git tag -a v1.0.0 -m "Release v1.0.0"`

### Step 2: Deployment
- [ ] Merge to `main` branch
- [ ] Trigger production deployment workflow
- [ ] Monitor deployment logs
- [ ] Wait for deployment completion
- [ ] Verify deployment success

### Step 3: Post-Deployment Verification
- [ ] Run smoke tests on production URL
  - [ ] Homepage loads correctly
  - [ ] User can log in
  - [ ] Store is accessible
  - [ ] NFT marketplace functional
  - [ ] Community features working
  - [ ] Admin panel accessible
- [ ] Check error monitoring dashboard (no new errors)
- [ ] Verify analytics events being tracked
- [ ] Check performance metrics
- [ ] Test critical user flows
- [ ] Verify database connectivity
- [ ] Check storage bucket access

### Step 4: Monitoring
- [ ] Monitor error rates (first 1 hour)
- [ ] Check performance metrics (first 1 hour)
- [ ] Monitor user activity
- [ ] Watch server logs for anomalies
- [ ] Track conversion rates
- [ ] Monitor API response times

## Smoke Tests

### Quick Manual Smoke Test Script
Run these tests immediately after deployment:

1. **Homepage** (`/`)
   - [ ] Page loads without errors
   - [ ] Hero section displays correctly
   - [ ] Navigation menu works
   - [ ] 3D elements render

2. **Authentication** (`/login`, `/signup`)
   - [ ] Login form works
   - [ ] Registration form works
   - [ ] Password reset functional

3. **Store** (`/store`, `/nft-store`)
   - [ ] Product catalog loads
   - [ ] Product details page works
   - [ ] Add to cart functional
   - [ ] Cart page displays correctly

4. **Community** (`/community`)
   - [ ] Feed loads posts
   - [ ] Can create new post
   - [ ] Like/comment features work
   - [ ] Follow functionality works

5. **Admin Panel** (`/admin`)
   - [ ] Admin can log in
   - [ ] All tabs accessible
   - [ ] Configuration changes save
   - [ ] NFT generator works

6. **Performance**
   - [ ] Page load < 3 seconds
   - [ ] No console errors
   - [ ] 3D scenes render smoothly
   - [ ] Mobile performance acceptable

## Rollback Procedure

If critical issues are discovered:

### Quick Rollback
1. Identify the last known good deployment
2. Revert to previous git tag:
   ```bash
   git revert HEAD
   git push origin main
   ```
3. Trigger deployment workflow
4. Monitor deployment
5. Verify rollback success

### Database Rollback (if needed)
1. Restore database from backup:
   ```bash
   # Using Supabase CLI
   supabase db reset --db-url <backup-url>
   ```
2. Verify data integrity
3. Test critical queries

### Communication
1. Notify team of rollback
2. Update status page (if applicable)
3. Communicate with affected users
4. Document incident for post-mortem

## Post-Deployment Tasks

### Immediate (within 1 hour)
- [ ] Monitor error dashboard
- [ ] Check analytics for unusual patterns
- [ ] Verify all smoke tests passing
- [ ] Update deployment log
- [ ] Notify team of successful deployment

### Within 24 hours
- [ ] Review performance metrics
- [ ] Check user feedback/reports
- [ ] Monitor conversion rates
- [ ] Review server logs
- [ ] Update documentation if needed

### Within 1 week
- [ ] Conduct post-deployment review meeting
- [ ] Document lessons learned
- [ ] Update deployment procedures if needed
- [ ] Address any minor issues discovered
- [ ] Plan next release cycle

## Sign-Off Criteria

Deployment is considered successful when:

- [ ] All smoke tests passing
- [ ] Error rate < 1% (in first hour)
- [ ] Page load time < 3 seconds (P95)
- [ ] Core user flows functional
- [ ] No critical bugs reported
- [ ] Performance metrics within acceptable range
- [ ] Analytics tracking correctly
- [ ] Team sign-off obtained

## Emergency Contacts

- **DevOps Lead**: [Contact Info]
- **Technical Lead**: [Contact Info]
- **Product Owner**: [Contact Info]
- **On-Call Engineer**: [Contact Info]

## Additional Resources

- **Monitoring Dashboard**: [URL]
- **Error Tracking**: [URL]
- **Analytics Dashboard**: [URL]
- **Status Page**: [URL]
- **Documentation**: [URL]
- **Runbook**: [URL]

---

## Checklist Version
- **Version**: 1.0.0
- **Last Updated**: 2025-11-17
- **Next Review**: 2025-12-17

## Notes

_Add deployment-specific notes here_

---

**Deployment Lead Signature**: _________________ Date: _______

**Technical Lead Approval**: _________________ Date: _______

**Product Owner Approval**: _________________ Date: _______
