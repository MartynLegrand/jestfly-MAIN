/**
 * Analytics Service
 * Centralized analytics tracking for JestFly platform
 * Tracks user interactions, conversions, and system events
 */

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

interface UserProperties {
  userId?: string;
  userRole?: string;
  accountType?: string;
  [key: string]: any;
}

class AnalyticsService {
  private isEnabled: boolean;
  private environment: string;
  private sessionId: string;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    this.environment = import.meta.env.VITE_ENVIRONMENT || 'development';
    this.sessionId = this.generateSessionId();
    
    if (this.isEnabled) {
      console.log('[Analytics] Service initialized', {
        environment: this.environment,
        sessionId: this.sessionId
      });
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track a custom event
   */
  track(event: AnalyticsEvent): void {
    if (!this.isEnabled) return;

    const payload = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      environment: this.environment,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    console.log('[Analytics] Event tracked:', payload);
    
    // Send to analytics provider (e.g., Google Analytics, Mixpanel, PostHog)
    this.sendToProvider(payload);
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string, properties?: Record<string, any>): void {
    this.track({
      category: 'Navigation',
      action: 'Page View',
      label: pageName,
      metadata: properties
    });
  }

  /**
   * Track user properties
   */
  identifyUser(properties: UserProperties): void {
    if (!this.isEnabled) return;

    console.log('[Analytics] User identified:', properties);
    
    // Send user properties to analytics provider
    this.sendToProvider({
      type: 'identify',
      properties,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.track({
      category: 'Error',
      action: 'Error Occurred',
      label: error.message,
      metadata: {
        stack: error.stack,
        ...context
      }
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(metric: string, value: number, metadata?: Record<string, any>): void {
    this.track({
      category: 'Performance',
      action: metric,
      value,
      metadata
    });
  }

  /**
   * Send data to analytics provider
   */
  private sendToProvider(data: any): void {
    // Implement integration with your analytics provider
    // Example: Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', data.action, {
        event_category: data.category,
        event_label: data.label,
        value: data.value,
        ...data.metadata
      });
    }

    // Example: Custom API endpoint
    if (this.environment === 'production') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(err => console.error('[Analytics] Failed to send event:', err));
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsService();

// Convenience methods for common tracking scenarios

/**
 * E-commerce / Store Events
 */
export const trackStoreEvent = {
  productViewed: (productId: string, productName: string, price: number) => {
    analytics.track({
      category: 'Store',
      action: 'Product Viewed',
      label: productName,
      value: price,
      metadata: { productId }
    });
  },

  addToCart: (productId: string, productName: string, price: number, quantity: number) => {
    analytics.track({
      category: 'Store',
      action: 'Add to Cart',
      label: productName,
      value: price * quantity,
      metadata: { productId, quantity }
    });
  },

  removeFromCart: (productId: string, productName: string) => {
    analytics.track({
      category: 'Store',
      action: 'Remove from Cart',
      label: productName,
      metadata: { productId }
    });
  },

  checkoutStarted: (cartValue: number, itemCount: number) => {
    analytics.track({
      category: 'Store',
      action: 'Checkout Started',
      value: cartValue,
      metadata: { itemCount }
    });
  },

  purchaseCompleted: (orderId: string, orderValue: number, paymentMethod: string) => {
    analytics.track({
      category: 'Store',
      action: 'Purchase Completed',
      value: orderValue,
      metadata: { orderId, paymentMethod }
    });
  }
};

/**
 * NFT Marketplace Events
 */
export const trackNFTEvent = {
  nftViewed: (nftId: string, nftName: string, price: number) => {
    analytics.track({
      category: 'NFT',
      action: 'NFT Viewed',
      label: nftName,
      value: price,
      metadata: { nftId }
    });
  },

  nftPurchased: (nftId: string, nftName: string, price: number, paymentMethod: string) => {
    analytics.track({
      category: 'NFT',
      action: 'NFT Purchased',
      label: nftName,
      value: price,
      metadata: { nftId, paymentMethod }
    });
  },

  walletViewed: (balance: number, nftCount: number) => {
    analytics.track({
      category: 'NFT',
      action: 'Wallet Viewed',
      metadata: { balance, nftCount }
    });
  }
};

/**
 * Community Events
 */
export const trackCommunityEvent = {
  postCreated: (postId: string, hasMedia: boolean) => {
    analytics.track({
      category: 'Community',
      action: 'Post Created',
      metadata: { postId, hasMedia }
    });
  },

  postLiked: (postId: string) => {
    analytics.track({
      category: 'Community',
      action: 'Post Liked',
      metadata: { postId }
    });
  },

  commentCreated: (postId: string, commentId: string) => {
    analytics.track({
      category: 'Community',
      action: 'Comment Created',
      metadata: { postId, commentId }
    });
  },

  userFollowed: (followedUserId: string) => {
    analytics.track({
      category: 'Community',
      action: 'User Followed',
      metadata: { followedUserId }
    });
  },

  feedScrolled: (postsViewed: number) => {
    analytics.track({
      category: 'Community',
      action: 'Feed Scrolled',
      value: postsViewed
    });
  }
};

/**
 * Admin Events
 */
export const trackAdminEvent = {
  adminPanelAccessed: (section: string) => {
    analytics.track({
      category: 'Admin',
      action: 'Panel Accessed',
      label: section
    });
  },

  configurationChanged: (configType: string, configKey: string) => {
    analytics.track({
      category: 'Admin',
      action: 'Configuration Changed',
      label: configType,
      metadata: { configKey }
    });
  },

  contentPublished: (contentType: string, contentId: string) => {
    analytics.track({
      category: 'Admin',
      action: 'Content Published',
      label: contentType,
      metadata: { contentId }
    });
  },

  nftGenerated: (nftId: string, nftType: string) => {
    analytics.track({
      category: 'Admin',
      action: 'NFT Generated',
      label: nftType,
      metadata: { nftId }
    });
  }
};

/**
 * Performance Tracking
 */
export const trackPerformanceMetrics = {
  pageLoadTime: (pageName: string, loadTime: number) => {
    analytics.trackPerformance('Page Load Time', loadTime, { pageName });
  },

  apiResponseTime: (endpoint: string, responseTime: number) => {
    analytics.trackPerformance('API Response Time', responseTime, { endpoint });
  },

  fps: (averageFPS: number, scene: string) => {
    analytics.trackPerformance('3D Scene FPS', averageFPS, { scene });
  },

  bundleSize: (size: number) => {
    analytics.trackPerformance('Bundle Size', size);
  }
};

export default analytics;
