/**
 * Mobile Analytics Tracking System
 * Touch heatmaps, scroll depth, gestures, and mobile-specific metrics
 *
 * @module lib/mobile/analytics
 * @agent Agent #15 - Mobile Experience & PWA
 */

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
  elementId?: string;
  elementClass?: string;
  pageUrl: string;
}

export interface ScrollDepth {
  maxDepth: number; // Percentage
  timeToMaxDepth: number; // Milliseconds
  scrollEvents: number;
  pageHeight: number;
}

export interface GestureEvent {
  type: 'swipe' | 'pinch' | 'long-press' | 'double-tap';
  direction?: string;
  timestamp: number;
  pageUrl: string;
}

export interface MobileMetrics {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screenSize: { width: number; height: number };
  viewport: { width: number; height: number };
  pixelRatio: number;
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
  connectionType: string;
  batteryLevel?: number;
  isStandalone: boolean;
}

/**
 * Mobile Analytics Tracker
 */
export class MobileAnalytics {
  private static instance: MobileAnalytics | null = null;
  private touchHeatmap: TouchPoint[] = [];
  private scrollDepths: Map<string, ScrollDepth> = new Map();
  private gestureEvents: GestureEvent[] = [];
  private sessionStart: number = Date.now();
  private maxStorageSize = 1000; // Max events to store

  private constructor() {
    this.initializeTracking();
  }

  static getInstance(): MobileAnalytics {
    if (!MobileAnalytics.instance) {
      MobileAnalytics.instance = new MobileAnalytics();
    }
    return MobileAnalytics.instance;
  }

  /**
   * Initialize tracking
   */
  private initializeTracking(): void {
    if (typeof window === 'undefined') return;

    // Track touches
    this.trackTouches();

    // Track scroll depth
    this.trackScrollDepth();

    // Track orientation changes
    this.trackOrientation();

    // Track visibility changes
    this.trackVisibility();

    // Send analytics on page unload
    this.setupBeforeUnload();
  }

  /**
   * Track touch events for heatmap
   */
  private trackTouches(): void {
    document.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        const touch = e.touches[0];
        const element = e.target as HTMLElement;

        const touchPoint: TouchPoint = {
          x: touch.clientX,
          y: touch.clientY,
          timestamp: Date.now(),
          elementId: element.id || undefined,
          elementClass: element.className || undefined,
          pageUrl: window.location.pathname,
        };

        this.touchHeatmap.push(touchPoint);

        // Limit storage
        if (this.touchHeatmap.length > this.maxStorageSize) {
          this.touchHeatmap = this.touchHeatmap.slice(-this.maxStorageSize);
        }
      },
      { passive: true }
    );
  }

  /**
   * Track scroll depth
   */
  private trackScrollDepth(): void {
    let maxScrollDepth = 0;
    let scrollStartTime = Date.now();
    let scrollEventCount = 0;
    const pageUrl = window.location.pathname;

    const handleScroll = () => {
      scrollEventCount++;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      const currentDepth = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      if (currentDepth > maxScrollDepth) {
        maxScrollDepth = currentDepth;

        this.scrollDepths.set(pageUrl, {
          maxDepth: maxScrollDepth,
          timeToMaxDepth: Date.now() - scrollStartTime,
          scrollEvents: scrollEventCount,
          pageHeight: documentHeight,
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Track orientation changes
   */
  private trackOrientation(): void {
    const trackOrientationChange = () => {
      const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

      this.trackEvent('orientation_change', {
        orientation,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('orientationchange', trackOrientationChange);
    window.addEventListener('resize', trackOrientationChange);
  }

  /**
   * Track visibility changes
   */
  private trackVisibility(): void {
    let hiddenTime = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenTime = Date.now();
      } else if (hiddenTime > 0) {
        const timeHidden = Date.now() - hiddenTime;

        this.trackEvent('page_visible', {
          timeHidden,
          pageUrl: window.location.pathname,
        });

        hiddenTime = 0;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  /**
   * Setup before unload handler
   */
  private setupBeforeUnload(): void {
    window.addEventListener('beforeunload', () => {
      this.flush();
    });

    // Also flush periodically
    setInterval(() => this.flush(), 30000); // Every 30 seconds
  }

  /**
   * Track custom gesture event
   */
  trackGesture(
    type: 'swipe' | 'pinch' | 'long-press' | 'double-tap',
    direction?: string
  ): void {
    const event: GestureEvent = {
      type,
      direction,
      timestamp: Date.now(),
      pageUrl: window.location.pathname,
    };

    this.gestureEvents.push(event);

    // Limit storage
    if (this.gestureEvents.length > this.maxStorageSize) {
      this.gestureEvents = this.gestureEvents.slice(-this.maxStorageSize);
    }
  }

  /**
   * Track custom event
   */
  trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (typeof window === 'undefined') return;

    // Send to your analytics service
    try {
      // Example: Google Analytics 4
      if ((window as any).gtag) {
        (window as any).gtag('event', eventName, {
          ...properties,
          session_duration: Date.now() - this.sessionStart,
          device_type: this.getDeviceType(),
          is_standalone: this.isStandalone(),
        });
      }

      // Example: PostHog
      if ((window as any).posthog) {
        (window as any).posthog.capture(eventName, {
          ...properties,
          session_duration: Date.now() - this.sessionStart,
          device_type: this.getDeviceType(),
          is_standalone: this.isStandalone(),
        });
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  /**
   * Get mobile metrics
   */
  getMobileMetrics(): MobileMetrics {
    const nav = navigator as any;

    return {
      deviceType: this.getDeviceType(),
      screenSize: {
        width: screen.width,
        height: screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      pixelRatio: window.devicePixelRatio,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      touchSupport: 'ontouchstart' in window,
      connectionType: nav.connection?.effectiveType || 'unknown',
      isStandalone: this.isStandalone(),
    };
  }

  /**
   * Get touch heatmap data
   */
  getTouchHeatmap(): TouchPoint[] {
    return [...this.touchHeatmap];
  }

  /**
   * Get scroll depth data
   */
  getScrollDepth(pageUrl?: string): ScrollDepth | undefined {
    if (pageUrl) {
      return this.scrollDepths.get(pageUrl);
    }
    return this.scrollDepths.get(window.location.pathname);
  }

  /**
   * Get all scroll depths
   */
  getAllScrollDepths(): Map<string, ScrollDepth> {
    return new Map(this.scrollDepths);
  }

  /**
   * Get gesture events
   */
  getGestureEvents(): GestureEvent[] {
    return [...this.gestureEvents];
  }

  /**
   * Flush analytics data to server
   */
  async flush(): Promise<void> {
    if (this.touchHeatmap.length === 0 && this.gestureEvents.length === 0) {
      return;
    }

    const data = {
      touchHeatmap: this.getTouchHeatmap(),
      scrollDepths: Array.from(this.getAllScrollDepths().entries()),
      gestureEvents: this.getGestureEvents(),
      metrics: this.getMobileMetrics(),
      sessionDuration: Date.now() - this.sessionStart,
      timestamp: Date.now(),
    };

    try {
      // Send to analytics endpoint
      await fetch('/api/analytics/mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true, // Important for beforeunload
      });

      // Clear stored data after successful send
      this.touchHeatmap = [];
      this.gestureEvents = [];
    } catch (error) {
      console.error('Failed to send analytics:', error);

      // Store in localStorage as fallback
      try {
        localStorage.setItem('pending-analytics', JSON.stringify(data));
      } catch (storageError) {
        console.error('Failed to store analytics locally:', storageError);
      }
    }
  }

  /**
   * Check if running in standalone mode (installed PWA)
   */
  private isStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone ||
      document.referrer.includes('android-app://')
    );
  }

  /**
   * Detect device type
   */
  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;

    if (width < 768) {
      return 'mobile';
    } else if (width < 1024) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  /**
   * Track conversion funnel
   */
  trackFunnelStep(step: string, metadata?: Record<string, any>): void {
    this.trackEvent('funnel_step', {
      step,
      ...metadata,
    });
  }

  /**
   * Track mobile-specific conversion
   */
  trackMobileConversion(type: string, value?: number): void {
    this.trackEvent('mobile_conversion', {
      conversion_type: type,
      conversion_value: value,
      device_type: this.getDeviceType(),
      is_standalone: this.isStandalone(),
    });
  }
}

/**
 * React Hook for mobile analytics
 */
export function useMobileAnalytics() {
  const analytics = React.useMemo(() => MobileAnalytics.getInstance(), []);

  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackGesture: analytics.trackGesture.bind(analytics),
    trackFunnelStep: analytics.trackFunnelStep.bind(analytics),
    trackConversion: analytics.trackMobileConversion.bind(analytics),
    getMetrics: analytics.getMobileMetrics.bind(analytics),
  };
}

// Re-export React for hooks
import React from 'react';
