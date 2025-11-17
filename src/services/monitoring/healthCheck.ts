/**
 * Health Check Service
 * Monitors system health and dependencies
 */

import { supabase } from '@/integrations/supabase/client';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    [key: string]: {
      status: 'pass' | 'fail';
      responseTime?: number;
      message?: string;
    };
  };
  timestamp: string;
}

class HealthCheckService {
  /**
   * Run all health checks
   */
  async runHealthChecks(): Promise<HealthStatus> {
    const startTime = Date.now();
    const checks: HealthStatus['checks'] = {};

    // Check Supabase connection
    checks.supabase = await this.checkSupabase();

    // Check localStorage availability
    checks.localStorage = this.checkLocalStorage();

    // Check WebGL support (for 3D features)
    checks.webgl = this.checkWebGL();

    // Determine overall status
    const failedChecks = Object.values(checks).filter(c => c.status === 'fail').length;
    const status: HealthStatus['status'] = 
      failedChecks === 0 ? 'healthy' :
      failedChecks <= 1 ? 'degraded' :
      'unhealthy';

    return {
      status,
      checks,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check Supabase connection
   */
  private async checkSupabase(): Promise<{ status: 'pass' | 'fail'; responseTime?: number; message?: string }> {
    const startTime = Date.now();
    try {
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .maybeSingle();

      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          status: 'fail',
          responseTime,
          message: error.message
        };
      }

      return {
        status: 'pass',
        responseTime
      };
    } catch (error) {
      return {
        status: 'fail',
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check localStorage availability
   */
  private checkLocalStorage(): { status: 'pass' | 'fail'; message?: string } {
    try {
      const testKey = '__health_check__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return { status: 'pass' };
    } catch {
      return {
        status: 'fail',
        message: 'localStorage not available'
      };
    }
  }

  /**
   * Check WebGL support
   */
  private checkWebGL(): { status: 'pass' | 'fail'; message?: string } {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl) {
        return { status: 'pass' };
      }
      
      return {
        status: 'fail',
        message: 'WebGL not supported'
      };
    } catch {
      return {
        status: 'fail',
        message: 'WebGL check failed'
      };
    }
  }

  /**
   * Get system information
   */
  getSystemInfo() {
    interface PerformanceMemory {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    }

    const perfWithMemory = performance as Performance & { memory?: PerformanceMemory };

    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      online: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      memory: perfWithMemory.memory ? {
        usedJSHeapSize: perfWithMemory.memory.usedJSHeapSize,
        totalJSHeapSize: perfWithMemory.memory.totalJSHeapSize,
        jsHeapSizeLimit: perfWithMemory.memory.jsHeapSizeLimit
      } : undefined
    };
  }
}

export const healthCheck = new HealthCheckService();
export default healthCheck;
