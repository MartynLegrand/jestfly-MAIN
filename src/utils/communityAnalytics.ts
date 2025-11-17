/**
 * Community Analytics & Performance Monitoring
 * 
 * This utility provides hooks for monitoring community engagement,
 * performance metrics, and analytics events.
 */

export interface AnalyticsEvent {
  category: 'community' | 'moderation' | 'engagement' | 'performance';
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  success: boolean;
  error?: string;
}

class CommunityAnalytics {
  private events: AnalyticsEvent[] = [];
  private metrics: PerformanceMetric[] = [];
  private performanceThresholds = {
    feedLoad: 3000, // 3 seconds
    postCreation: 2000, // 2 seconds
    commentLoad: 1500, // 1.5 seconds
    imageUpload: 5000, // 5 seconds
  };

  /**
   * Track an analytics event
   */
  trackEvent(event: AnalyticsEvent): void {
    this.events.push({
      ...event,
      metadata: {
        ...event.metadata,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      },
    });

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('[Analytics]', event);
    }

    // In production, send to analytics service
    // Example: gtag('event', event.action, { ... })
  }

  /**
   * Track a performance metric
   */
  trackPerformance(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Check against thresholds
    const threshold = this.performanceThresholds[metric.name as keyof typeof this.performanceThresholds];
    if (threshold && metric.duration > threshold) {
      console.warn(
        `[Performance] ${metric.name} took ${metric.duration}ms (threshold: ${threshold}ms)`
      );
      
      // Track slow performance as an event
      this.trackEvent({
        category: 'performance',
        action: 'slow_operation',
        label: metric.name,
        value: metric.duration,
        metadata: { threshold, error: metric.error },
      });
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log('[Performance]', metric);
    }
  }

  /**
   * Start a performance timer
   */
  startTimer(name: string): () => void {
    const startTime = performance.now();

    return (success: boolean = true, error?: string) => {
      const duration = performance.now() - startTime;
      this.trackPerformance({
        name,
        duration,
        timestamp: Date.now(),
        success,
        error,
      });
    };
  }

  /**
   * Track community engagement metrics
   */
  trackEngagement(action: 'post_created' | 'post_liked' | 'comment_added' | 'user_followed' | 'content_reported', metadata?: Record<string, any>): void {
    this.trackEvent({
      category: 'engagement',
      action,
      metadata,
    });
  }

  /**
   * Track moderation actions
   */
  trackModeration(action: 'content_approved' | 'content_rejected' | 'content_flagged' | 'user_banned' | 'report_reviewed', metadata?: Record<string, any>): void {
    this.trackEvent({
      category: 'moderation',
      action,
      metadata,
    });
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    avgDuration: number;
    slowOperations: number;
    totalOperations: number;
    successRate: number;
  } {
    if (this.metrics.length === 0) {
      return { avgDuration: 0, slowOperations: 0, totalOperations: 0, successRate: 0 };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const successCount = this.metrics.filter(m => m.success).length;
    const slowCount = this.metrics.filter(m => {
      const threshold = this.performanceThresholds[m.name as keyof typeof this.performanceThresholds];
      return threshold && m.duration > threshold;
    }).length;

    return {
      avgDuration: totalDuration / this.metrics.length,
      slowOperations: slowCount,
      totalOperations: this.metrics.length,
      successRate: (successCount / this.metrics.length) * 100,
    };
  }

  /**
   * Get engagement summary
   */
  getEngagementSummary(): Record<string, number> {
    const engagementEvents = this.events.filter(e => e.category === 'engagement');
    const summary: Record<string, number> = {};

    engagementEvents.forEach(event => {
      summary[event.action] = (summary[event.action] || 0) + 1;
    });

    return summary;
  }

  /**
   * Clear old metrics (keep last hour)
   */
  clearOldMetrics(): void {
    const oneHourAgo = Date.now() - 3600000;
    this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
    this.events = this.events.filter(e => {
      const timestamp = e.metadata?.timestamp as number;
      return timestamp && timestamp > oneHourAgo;
    });
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): { events: AnalyticsEvent[]; metrics: PerformanceMetric[] } {
    return {
      events: [...this.events],
      metrics: [...this.metrics],
    };
  }
}

// Singleton instance
export const communityAnalytics = new CommunityAnalytics();

// Auto-cleanup every hour
setInterval(() => {
  communityAnalytics.clearOldMetrics();
}, 3600000);

// Export helper hooks
export const useCommunityAnalytics = () => {
  return {
    trackEvent: (event: AnalyticsEvent) => communityAnalytics.trackEvent(event),
    trackEngagement: (action: Parameters<typeof communityAnalytics.trackEngagement>[0], metadata?: Record<string, any>) =>
      communityAnalytics.trackEngagement(action, metadata),
    trackModeration: (action: Parameters<typeof communityAnalytics.trackModeration>[0], metadata?: Record<string, any>) =>
      communityAnalytics.trackModeration(action, metadata),
    startTimer: (name: string) => communityAnalytics.startTimer(name),
    getPerformanceSummary: () => communityAnalytics.getPerformanceSummary(),
    getEngagementSummary: () => communityAnalytics.getEngagementSummary(),
  };
};
