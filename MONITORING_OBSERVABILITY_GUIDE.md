# 📊 Monitoring & Observability Guide

## Overview

This guide covers the monitoring, observability, and alerting capabilities implemented in the JestFly platform for Agent 8: Release, Analytics & Observability Captain.

---

## 🎯 Monitoring Architecture

### Components

1. **Analytics Service** (`src/services/analytics/`)
   - User behavior tracking
   - Conversion funnel monitoring
   - Performance metrics
   - Custom event tracking

2. **Error Monitoring** (`src/services/monitoring/errorMonitoring.ts`)
   - Global error capture
   - Error queuing and reporting
   - Integration with error tracking services

3. **Health Checks** (`src/services/monitoring/healthCheck.ts`)
   - System health monitoring
   - Dependency checks
   - Performance diagnostics

4. **CI/CD Pipelines** (`.github/workflows/`)
   - Build verification
   - Test automation
   - Deployment monitoring

---

## 📈 Analytics Implementation

### Setup

The analytics service is automatically initialized when the application loads. Enable it via environment variables:

```env
VITE_ENABLE_ANALYTICS=true
VITE_ENVIRONMENT=production
```

### Event Tracking

#### Store Events
```typescript
import { trackStoreEvent } from '@/services/analytics';

// Track product view
trackStoreEvent.productViewed(productId, productName, price);

// Track add to cart
trackStoreEvent.addToCart(productId, productName, price, quantity);

// Track purchase
trackStoreEvent.purchaseCompleted(orderId, orderValue, paymentMethod);
```

#### NFT Events
```typescript
import { trackNFTEvent } from '@/services/analytics';

// Track NFT view
trackNFTEvent.nftViewed(nftId, nftName, price);

// Track NFT purchase
trackNFTEvent.nftPurchased(nftId, nftName, price, paymentMethod);

// Track wallet view
trackNFTEvent.walletViewed(balance, nftCount);
```

#### Community Events
```typescript
import { trackCommunityEvent } from '@/services/analytics';

// Track post creation
trackCommunityEvent.postCreated(postId, hasMedia);

// Track engagement
trackCommunityEvent.postLiked(postId);
trackCommunityEvent.commentCreated(postId, commentId);
trackCommunityEvent.userFollowed(followedUserId);
```

#### Admin Events
```typescript
import { trackAdminEvent } from '@/services/analytics';

// Track admin actions
trackAdminEvent.adminPanelAccessed(section);
trackAdminEvent.configurationChanged(configType, configKey);
trackAdminEvent.nftGenerated(nftId, nftType);
```

#### Performance Tracking
```typescript
import { trackPerformanceMetrics } from '@/services/analytics';

// Track page load
trackPerformanceMetrics.pageLoadTime(pageName, loadTime);

// Track API performance
trackPerformanceMetrics.apiResponseTime(endpoint, responseTime);

// Track 3D performance
trackPerformanceMetrics.fps(averageFPS, scene);
```

### Custom Events

Track custom events using the analytics service directly:

```typescript
import { analytics } from '@/services/analytics';

analytics.track({
  category: 'User',
  action: 'Button Click',
  label: 'Subscribe Button',
  value: 1,
  metadata: {
    location: 'Homepage',
    timestamp: Date.now()
  }
});
```

### User Identification

Identify users for personalized analytics:

```typescript
import { analytics } from '@/services/analytics';

analytics.identifyUser({
  userId: user.id,
  userRole: user.role,
  accountType: user.account_type,
  email: user.email
});
```

---

## 🚨 Error Monitoring

### Automatic Error Capture

The error monitoring service automatically captures:
- Unhandled JavaScript errors
- Unhandled promise rejections
- Component errors (when using error boundaries)

### Manual Error Reporting

```typescript
import { errorMonitoring } from '@/services/monitoring/errorMonitoring';

try {
  // Your code
  riskyOperation();
} catch (error) {
  errorMonitoring.captureError(error as Error, {
    component: 'CheckoutForm',
    action: 'Process Payment',
    userId: user.id,
    additionalInfo: {
      paymentMethod: 'stripe',
      amount: totalAmount
    }
  });
}
```

### Error Boundaries

Use with React Error Boundaries:

```typescript
import { captureComponentError } from '@/services/monitoring/errorMonitoring';

class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: any) {
    captureComponentError(error, 'MyComponent', errorInfo);
  }
}
```

### Viewing Recent Errors

```typescript
import { errorMonitoring } from '@/services/monitoring/errorMonitoring';

// Get recent errors (useful for admin dashboard)
const recentErrors = errorMonitoring.getRecentErrors();

// Clear error queue
errorMonitoring.clearErrors();
```

---

## 🏥 Health Checks

### Running Health Checks

```typescript
import { healthCheck } from '@/services/monitoring/healthCheck';

// Run all health checks
const status = await healthCheck.runHealthChecks();

console.log('System Status:', status.status);
console.log('Checks:', status.checks);
```

### Health Check Response

```json
{
  "status": "healthy", // or "degraded" or "unhealthy"
  "checks": {
    "supabase": {
      "status": "pass",
      "responseTime": 45
    },
    "localStorage": {
      "status": "pass"
    },
    "webgl": {
      "status": "pass"
    }
  },
  "timestamp": "2025-11-17T10:30:00.000Z"
}
```

### System Information

```typescript
import { healthCheck } from '@/services/monitoring/healthCheck';

const systemInfo = healthCheck.getSystemInfo();
```

Returns:
- User agent
- Platform
- Language
- Online status
- Screen resolution
- Viewport size
- Memory usage (if available)

### Creating a Health Check Endpoint

For monitoring tools to ping:

```typescript
// Example API route
app.get('/api/health', async (req, res) => {
  const status = await healthCheck.runHealthChecks();
  
  res.status(status.status === 'healthy' ? 200 : 503).json(status);
});
```

---

## 📊 Key Metrics to Monitor

### Performance Metrics

1. **Page Load Time**
   - Target: < 3 seconds
   - Measure: window.performance.timing

2. **Time to Interactive (TTI)**
   - Target: < 5 seconds
   - Measure: Lighthouse metrics

3. **First Contentful Paint (FCP)**
   - Target: < 1.8 seconds
   - Measure: Performance API

4. **3D Scene FPS**
   - Desktop Target: 60 FPS
   - Mobile Target: ≥ 55 FPS
   - Monitor via `trackPerformanceMetrics.fps()`

### Business Metrics

1. **Conversion Rates**
   - Product view → Add to cart: __%
   - Add to cart → Purchase: __%
   - NFT view → Purchase: __%

2. **User Engagement**
   - Daily active users (DAU)
   - Posts per user
   - Average session duration
   - Bounce rate

3. **Revenue Metrics**
   - Average order value
   - Revenue per user
   - NFT sales volume
   - Jest Coin transaction volume

### System Health Metrics

1. **Error Rate**
   - Target: < 1%
   - Monitor via error monitoring service

2. **API Response Time**
   - Target: < 500ms (P95)
   - Track via `trackPerformanceMetrics.apiResponseTime()`

3. **Database Performance**
   - Query response time
   - Connection pool usage
   - Failed queries

4. **Availability**
   - Target: 99.9% uptime
   - Monitor via health checks

---

## 🔔 Alerting Strategy

### Critical Alerts (Immediate Response)

1. **System Down**
   - Health check fails
   - Multiple 5xx errors
   - Database unreachable

2. **High Error Rate**
   - Error rate > 5%
   - Errors > 100/minute

3. **Payment Failures**
   - Payment gateway errors
   - Multiple failed transactions

### Warning Alerts (Review within 1 hour)

1. **Performance Degradation**
   - Page load time > 5 seconds
   - FPS < 30 consistently
   - API response time > 2 seconds

2. **Elevated Error Rate**
   - Error rate 1-5%
   - Errors 50-100/minute

3. **Resource Exhaustion**
   - High memory usage
   - Database connection pool near limit

### Info Alerts (Review daily)

1. **Usage Trends**
   - Unusual traffic patterns
   - Conversion rate changes
   - User behavior shifts

2. **Maintenance**
   - Security vulnerabilities discovered
   - Package updates available
   - Certificate expiration warnings

---

## 📱 Monitoring Dashboards

### Recommended Dashboard Layout

#### 1. Overview Dashboard
- System health status
- Error rate (last 24h)
- Active users
- Revenue (last 24h)
- Key conversion rates

#### 2. Performance Dashboard
- Average page load time
- API response times
- 3D scene FPS
- Bundle size
- Lighthouse scores

#### 3. User Behavior Dashboard
- User journey funnels
- Popular pages
- Drop-off points
- Session duration
- Device breakdown

#### 4. Business Metrics Dashboard
- Revenue trends
- Conversion funnels
- Product performance
- NFT sales
- Community engagement

#### 5. Error Dashboard
- Error rate over time
- Top errors by frequency
- Errors by component
- Recent error log
- Error resolution status

---

## 🔧 Integration with Third-Party Services

### Google Analytics 4

Add to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

The analytics service will automatically integrate with `gtag` if available.

### Sentry Error Tracking

Install and configure:

```bash
npm install @sentry/react
```

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.VITE_ENVIRONMENT,
  tracesSampleRate: 1.0
});
```

The error monitoring service will automatically integrate with Sentry.

### PostHog Analytics

```bash
npm install posthog-js
```

```typescript
import posthog from 'posthog-js';

posthog.init('YOUR_POSTHOG_KEY', {
  api_host: 'https://app.posthog.com'
});
```

### Custom API Endpoint

The services send data to `/api/analytics` and `/api/errors` by default in production. Implement these endpoints in your backend:

```typescript
// Example Express.js endpoints
app.post('/api/analytics', (req, res) => {
  const event = req.body;
  // Store in database or forward to analytics service
  res.status(200).json({ success: true });
});

app.post('/api/errors', (req, res) => {
  const error = req.body;
  // Log error, send alerts, etc.
  res.status(200).json({ success: true });
});
```

---

## 🔍 Debugging & Troubleshooting

### Enable Debug Mode

Set in `.env`:
```env
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_MONITORING=true
```

All events will be logged to console.

### Common Issues

**Analytics not tracking**
- Check `VITE_ENABLE_ANALYTICS` is `true`
- Verify environment variables are loaded
- Check browser console for errors
- Ensure analytics provider is configured

**Errors not being captured**
- Check `VITE_ENABLE_MONITORING` is not `false`
- Verify error monitoring service initialized
- Check network tab for failed requests

**Health checks failing**
- Verify Supabase credentials
- Check network connectivity
- Ensure database is accessible
- Check CORS configuration

---

## 📚 Best Practices

### Do's

✅ Track all critical user actions  
✅ Monitor performance continuously  
✅ Set up alerts for critical issues  
✅ Review dashboards daily  
✅ Document tracking decisions  
✅ Test tracking in staging first  
✅ Respect user privacy (GDPR, CCPA)

### Don'ts

❌ Track personally identifiable information (PII) without consent  
❌ Over-track (creates noise)  
❌ Ignore error patterns  
❌ Skip testing tracking implementations  
❌ Forget to update tracking on feature changes  
❌ Send sensitive data to third-party services

---

## 🔐 Privacy & Compliance

### GDPR Compliance

- Obtain user consent for analytics
- Provide opt-out mechanism
- Don't track PII without explicit consent
- Implement data retention policies
- Honor data deletion requests

### Implementation

```typescript
// Check consent before tracking
const hasConsent = checkUserConsent();

if (hasConsent) {
  analytics.track(event);
}
```

---

## 📖 Additional Resources

- [Analytics Service Documentation](./src/services/analytics/index.ts)
- [Error Monitoring Documentation](./src/services/monitoring/errorMonitoring.ts)
- [Health Check Documentation](./src/services/monitoring/healthCheck.ts)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Release Notes](./RELEASE_NOTES.md)

---

## 🆘 Support

For questions or issues:
- **GitHub Issues**: [Report bugs or request features](https://github.com/MartynLegrand/jestfly-MAIN/issues)
- **Documentation**: Check existing docs first
- **Team Chat**: Reach out to DevOps or Engineering team

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-17  
**Next Review**: 2025-12-17
