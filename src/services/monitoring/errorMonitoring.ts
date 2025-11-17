/**
 * Error Monitoring Service
 * Captures and reports errors for observability
 */

import { analytics } from '../analytics';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalInfo?: Record<string, unknown>;
}

interface ErrorData {
  message: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  component?: string;
  action?: string;
  userId?: string;
  additionalInfo?: Record<string, unknown>;
}

class ErrorMonitoringService {
  private isEnabled: boolean;
  private errorQueue: ErrorData[] = [];
  private maxQueueSize = 50;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_MONITORING !== 'false';
    this.setupGlobalErrorHandlers();
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        component: 'Global',
        action: 'Unhandled Error',
        additionalInfo: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        new Error(event.reason?.message || 'Unhandled Promise Rejection'),
        {
          component: 'Global',
          action: 'Unhandled Promise Rejection',
          additionalInfo: { reason: event.reason }
        }
      );
    });
  }

  /**
   * Capture an error
   */
  captureError(error: Error, context?: ErrorContext): void {
    if (!this.isEnabled) return;

    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context
    };

    console.error('[Error Monitoring]', errorData);

    // Add to queue
    this.errorQueue.push(errorData);
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // Send to analytics
    analytics.trackError(error, context);

    // Send to error tracking service (e.g., Sentry, Rollbar)
    this.sendToErrorService(errorData);
  }

  /**
   * Capture a warning
   */
  captureWarning(message: string, context?: ErrorContext): void {
    if (!this.isEnabled) return;

    const warningData = {
      level: 'warning',
      message,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...context
    };

    console.warn('[Warning]', warningData);
  }

  /**
   * Get recent errors
   */
  getRecentErrors(): ErrorData[] {
    return [...this.errorQueue];
  }

  /**
   * Clear error queue
   */
  clearErrors(): void {
    this.errorQueue = [];
  }

  /**
   * Send error to tracking service
   */
  private sendToErrorService(errorData: ErrorData): void {
    // Integrate with error tracking service
    // Example: Sentry
    if (typeof window !== 'undefined' && (window as Window & { Sentry?: { captureException: (data: unknown) => void } }).Sentry) {
      (window as Window & { Sentry: { captureException: (data: unknown) => void } }).Sentry.captureException(errorData);
    }

    // Example: Custom API endpoint
    if (import.meta.env.VITE_ENVIRONMENT === 'production') {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      }).catch(err => console.error('[Error Monitoring] Failed to send error:', err));
    }
  }
}

export const errorMonitoring = new ErrorMonitoringService();

/**
 * React Error Boundary helper
 */
export const captureComponentError = (
  error: Error,
  componentName: string,
  errorInfo?: Record<string, unknown>
): void => {
  errorMonitoring.captureError(error, {
    component: componentName,
    action: 'Component Error',
    additionalInfo: { errorInfo }
  });
};

export default errorMonitoring;
