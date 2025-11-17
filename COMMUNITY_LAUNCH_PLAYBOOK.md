# Community System Launch Playbook

## Overview
This playbook guides the production launch of the JestFly Community system, covering technical setup, monitoring, moderation workflows, and rollback procedures.

---

## Pre-Launch Checklist

### Database & Infrastructure
- [ ] Apply all Supabase migrations (`20251117040000_create_community_system.sql`)
- [ ] Verify RLS policies are enabled on all community tables
- [ ] Create `community-media` storage bucket with public access
- [ ] Configure bucket size limits and allowed file types
- [ ] Run seed data script (`supabase/seed/community-seed.sql`)
- [ ] Verify database indexes for performance

### Environment Configuration
- [ ] Confirm `VITE_SUPABASE_URL` in `.env`
- [ ] Confirm `VITE_SUPABASE_ANON_KEY` in `.env`
- [ ] Test Supabase connection from frontend
- [ ] Verify storage bucket permissions

### Feature Configuration
- [ ] Enable/disable community features in site_config
- [ ] Set moderation requirements (auto-approve vs. review)
- [ ] Configure content limits (post length, media count, file sizes)
- [ ] Set rate limits for posting, commenting, following

### Testing
- [ ] Verify feed loading and infinite scroll
- [ ] Test post creation with text, images, videos
- [ ] Verify likes, comments, follows work correctly
- [ ] Test real-time notifications delivery
- [ ] Verify report submission and moderation workflows
- [ ] Test mobile responsiveness
- [ ] Run performance benchmarks (Lighthouse, load times)

---

## Launch Steps

### Phase 1: Soft Launch (Internal Testing)
**Duration**: 3-5 days  
**Audience**: Internal team + beta testers

1. **Deploy to staging environment**
   ```bash
   npm run build
   # Deploy to staging
   ```

2. **Invite beta testers**
   - Send guidelines and expectations
   - Provide feedback form
   - Set up monitoring dashboard

3. **Monitor key metrics**
   - Posts created per day
   - User engagement rate
   - Page load times
   - Error rates
   - Moderation queue size

4. **Daily standup**
   - Review feedback
   - Address critical bugs
   - Adjust configurations

### Phase 2: Limited Release
**Duration**: 1-2 weeks  
**Audience**: 10-20% of users

1. **Enable for subset of users**
   - Use feature flag or user whitelist
   - Gradually increase percentage

2. **Monitor health metrics**
   - Database performance (query times, connections)
   - API response times
   - Storage usage and costs
   - Moderation workload

3. **Scale moderation team**
   - Train additional moderators
   - Document common scenarios
   - Set up shift coverage

### Phase 3: Full Launch
**Duration**: Ongoing

1. **Enable for all users**
   - Announce via email, social media, in-app
   - Highlight key features and guidelines

2. **Monitor at scale**
   - Set up alerts for anomalies
   - Track engagement metrics
   - Review moderation efficiency

---

## Monitoring & Analytics

### Key Metrics to Track

**Engagement Metrics**
- Daily Active Users (DAU)
- Posts created per day
- Comments per post (average)
- Likes per post (average)
- Follow/unfollow rate
- Session duration in community

**Performance Metrics**
- Feed load time (target: <3s)
- Post creation time (target: <2s)
- Image upload time (target: <5s)
- Real-time notification delay (target: <1s)
- API error rate (target: <1%)

**Moderation Metrics**
- Reports submitted per day
- Time to review reports (target: <24h)
- Moderation actions taken (approve/reject/delete)
- False positive rate
- User appeals

**Health Metrics**
- Database connection pool usage
- Storage bucket size and growth rate
- API rate limit hits
- Real-time subscription count

### Tools & Dashboards
- **Supabase Dashboard**: Database metrics, RLS policies, storage
- **Browser DevTools**: Performance profiling, network requests
- **Custom Analytics**: Use `communityAnalytics` utility for engagement tracking
- **Error Tracking**: Monitor console errors and toast messages

---

## Moderation Workflows

### Daily Moderation Tasks
1. **Review pending content** (Target: <24h review time)
   - Check posts flagged as `pending` or `flagged`
   - Review comments with moderation status `pending`
   - Process user reports

2. **Monitor community health**
   - Review trending hashtags
   - Check for spam patterns
   - Identify problematic users

3. **Engage with community**
   - Pin high-quality posts
   - Respond to questions
   - Welcome new users

### Moderation Actions
**Post/Comment Actions**
- **Approve**: Make content visible to all users
- **Reject**: Hide content, notify author
- **Flag**: Mark for secondary review
- **Delete**: Permanently remove content
- **Pin**: Highlight important posts

**User Actions**
- **Warning**: First offense, documented
- **Temporary Ban**: 7-day suspension
- **Permanent Ban**: Account deactivation

### Escalation Process
1. **Level 1**: Standard violations → Handled by moderators
2. **Level 2**: Repeated violations → Review by senior moderator
3. **Level 3**: Legal/safety concerns → Escalate to management

---

## Performance Optimization

### Caching Strategy
- Cache feed queries for 1 minute
- Cache user profiles for 5 minutes
- Cache hashtag trends for 15 minutes
- Invalidate cache on mutations

### Image Optimization
- Resize images on upload (max 2048x2048)
- Generate thumbnails for feed view
- Use lazy loading for images
- Implement progressive JPEG/WebP

### Database Optimization
- Use pagination (limit 20 posts per page)
- Index frequently queried fields
- Denormalize counters (likes, comments, views)
- Archive old content (>1 year)

### Real-time Subscriptions
- Limit to 5 active subscriptions per user
- Use presence channels for online status
- Debounce rapid updates
- Graceful degradation if disconnected

---

## Troubleshooting

### Common Issues

**Feed not loading**
- Check Supabase connection
- Verify RLS policies allow read access
- Check browser console for errors
- Confirm user authentication

**Images not uploading**
- Verify storage bucket exists and is public
- Check file size limits
- Confirm user has upload permissions
- Review browser network tab for errors

**Notifications not appearing**
- Check real-time subscription status
- Verify notification table has data
- Confirm RLS policies allow reads
- Check notification channel connection

**Slow performance**
- Review database query times in Supabase dashboard
- Check for N+1 queries
- Monitor API response times
- Use performance profiler in DevTools

---

## Rollback Procedures

### If Critical Issues Arise

**Level 1: Feature Disable**
1. Disable community routes in app router
2. Show maintenance message to users
3. Investigate and fix issue
4. Re-enable when resolved

**Level 2: Database Rollback**
1. Stop all write operations
2. Create database backup
3. Rollback migration: `supabase db reset`
4. Restore from backup if needed
5. Test thoroughly before re-launch

**Level 3: Full System Rollback**
1. Revert code to previous stable commit
2. Redeploy previous version
3. Notify users of temporary unavailability
4. Conduct post-mortem analysis

---

## Success Criteria

### Week 1
- [ ] 100+ posts created
- [ ] 500+ interactions (likes, comments)
- [ ] <5% error rate
- [ ] All reports reviewed within 24h
- [ ] No critical bugs

### Month 1
- [ ] 50% of users engaged with community
- [ ] 1000+ posts created
- [ ] Average 5+ comments per post
- [ ] <1% report rate
- [ ] Positive user feedback (>4/5 rating)

### Quarter 1
- [ ] 80% user engagement rate
- [ ] Active moderation team (3+ moderators)
- [ ] Community guidelines acceptance >95%
- [ ] Retention rate >70%
- [ ] Self-sustaining user-generated content

---

## Support Resources

### Documentation
- [SESSION_3_COMPLETE.md](./SESSION_3_COMPLETE.md) - Implementation details
- [Community Guidelines](./src/components/community/CommunityGuidelines.tsx) - User-facing rules
- [Database Schema](./supabase/migrations/20251117040000_create_community_system.sql) - Complete schema

### Code References
- **Hooks**: `src/hooks/useCommunityPosts.ts`, `useCommunityComments.ts`, etc.
- **Components**: `src/components/community/`
- **Admin**: `src/components/admin/sections/CommunityModerationTab.tsx`
- **Analytics**: `src/utils/communityAnalytics.ts`

### Contact
- **Technical Issues**: dev-team@jestfly.com
- **Moderation Support**: moderation@jestfly.com
- **User Support**: support@jestfly.com

---

## Appendix

### Rate Limits (Recommended)
- Posts: 10 per hour, 50 per day
- Comments: 30 per hour, 100 per day
- Likes: 100 per hour
- Follows: 50 per hour, 200 per day
- Reports: 10 per day

### Content Limits
- Post content: 5000 characters
- Comment content: 2000 characters
- Media per post: 4 files
- File size: 10MB per file
- Video length: 2 minutes

### Moderation Response Time Targets
- Critical reports (harassment, illegal): <2 hours
- High priority (spam, hate speech): <12 hours
- Standard reports: <24 hours
- Low priority (minor issues): <48 hours
