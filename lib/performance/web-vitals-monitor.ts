/**
 * APPLE-GRADE WEB VITALS MONITORING
 * Real-time performance monitoring with Core Web Vitals tracking
 * and automated performance budget validation
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

interface PerformanceMetric {
  name: string;
  value: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  timestamp: number;
  navigationType?: string;
}

interface PerformanceThresholds {
  [key: string]: {
    good: number;
    poor: number;
    unit: string;
  };
}

const THRESHOLDS: PerformanceThresholds = {
  CLS: { good: 0.1, poor: 0.25, unit: '' },
  INP: { good: 200, poor: 500, unit: 'ms' }, // Replaces FID
  FID: { good: 100, poor: 300, unit: 'ms' }, // Keep for backward compatibility
  FCP: { good: 1800, poor: 3000, unit: 'ms' },
  LCP: { good: 2500, poor: 4000, unit: 'ms' },
  TTFB: { good: 800, poor: 1800, unit: 'ms' },
};

const APPLE_GRADE_TARGETS = {
  CLS: 0.05, // Stricter than standard
  INP: 100,  // Half of standard good (replaces FID)
  FID: 50,   // Keep for backward compatibility
  FCP: 1200, // 600ms faster than standard
  LCP: 1500, // 1s faster than standard
  TTFB: 400, // Half of standard good
};

class WebVitalsMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;
  private performanceBudget = {
    javascript: 300000, // 300KB gzipped
    css: 100000,       // 100KB gzipped
    images: 1000000,   // 1MB total
    total: 1500000,    // 1.5MB total
  };

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Only monitor in production or when explicitly enabled
    if (typeof window === 'undefined' ||
        (process.env.NODE_ENV === 'production' ||
         process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING === 'true')) {
      this.startMonitoring();
    }
  }

  private startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();

    // Monitor custom performance metrics
    this.monitorCustomMetrics();

    // Monitor resource loading
    this.monitorResourceTiming();

    // Monitor long tasks
    this.monitorLongTasks();

    // Set up reporting interval
    this.setupPeriodicReporting();
  }

  private monitorCoreWebVitals() {
    // Cumulative Layout Shift
    onCLS((metric) => {
      this.recordMetric('CLS', metric);
      this.evaluateCLSPerformance(metric);
    });

    // Interaction to Next Paint (replaces FID)
    onINP((metric) => {
      this.recordMetric('INP', metric);
      this.evaluateINPPerformance(metric);
    });

    // First Contentful Paint
    onFCP((metric) => {
      this.recordMetric('FCP', metric);
      this.evaluateFCPPerformance(metric);
    });

    // Largest Contentful Paint
    onLCP((metric) => {
      this.recordMetric('LCP', metric);
      this.evaluateLCPPerformance(metric);
    });

    // Time to First Byte
    onTTFB((metric) => {
      this.recordMetric('TTFB', metric);
      this.evaluateTTFBPerformance(metric);
    });
  }

  private recordMetric(name: string, metric: any) {
    const performanceMetric: PerformanceMetric = {
      name,
      value: metric.value,
      id: metric.id,
      rating: metric.rating,
      delta: metric.delta,
      timestamp: Date.now(),
      navigationType: this.getNavigationType(),
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name)!.push(performanceMetric);

    // Log performance warnings
    this.logPerformanceWarning(performanceMetric);

    // Send to analytics (in production)
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(performanceMetric);
    }
  }

  private evaluateCLSPerformance(metric: any) {
    if (metric.value > APPLE_GRADE_TARGETS.CLS) {
      console.warn(`⚠️ CLS exceeds Apple target: ${metric.value.toFixed(3)} > ${APPLE_GRADE_TARGETS.CLS}`);

      // Provide actionable insights
      if (metric.value > 0.25) {
        console.error('🚨 Critical layout shift detected. Check for:');
        console.error('   • Missing image dimensions');
        console.error('   • Dynamic content injection');
        console.error('   • Font loading issues');
        console.error('   • Ads or embeds without dimensions');
      }
    }
  }

  private evaluateFIDPerformance(metric: any) {
    if (metric.value > APPLE_GRADE_TARGETS.FID) {
      console.warn(`⚠️ FID exceeds Apple target: ${metric.value}ms > ${APPLE_GRADE_TARGETS.FID}ms`);

      if (metric.value > 300) {
        console.error('🚨 Slow input response detected. Optimize:');
        console.error('   • JavaScript execution time');
        console.error('   • Third-party script loading');
        console.error('   • Code splitting implementation');
      }
    }
  }

  private evaluateINPPerformance(metric: any) {
    if (metric.value > APPLE_GRADE_TARGETS.INP) {
      console.warn(`⚠️ INP exceeds Apple target: ${metric.value}ms > ${APPLE_GRADE_TARGETS.INP}ms`);

      if (metric.value > 500) {
        console.error('🚨 Slow interaction response detected. Optimize:');
        console.error('   • JavaScript execution time');
        console.error('   • Third-party script loading');
        console.error('   • Code splitting implementation');
        console.error('   • Event handler optimization');
      }
    }
  }

  private evaluateFCPPerformance(metric: any) {
    if (metric.value > APPLE_GRADE_TARGETS.FCP) {
      console.warn(`⚠️ FCP exceeds Apple target: ${metric.value}ms > ${APPLE_GRADE_TARGETS.FCP}ms`);

      if (metric.value > 3000) {
        console.error('🚨 Slow first paint detected. Check:');
        console.error('   • Server response time');
        console.error('   • Critical CSS inlining');
        console.error('   • Render-blocking resources');
        console.error('   • CDN performance');
      }
    }
  }

  private evaluateLCPPerformance(metric: any) {
    if (metric.value > APPLE_GRADE_TARGETS.LCP) {
      console.warn(`⚠️ LCP exceeds Apple target: ${metric.value}ms > ${APPLE_GRADE_TARGETS.LCP}ms`);

      if (metric.value > 4000) {
        console.error('🚨 Slow largest content paint detected. Optimize:');
        console.error('   • Hero image loading');
        console.error('   • Critical resource prioritization');
        console.error('   • Image format optimization');
        console.error('   • Preload critical resources');
      }
    }
  }

  private evaluateTTFBPerformance(metric: any) {
    if (metric.value > APPLE_GRADE_TARGETS.TTFB) {
      console.warn(`⚠️ TTFB exceeds Apple target: ${metric.value}ms > ${APPLE_GRADE_TARGETS.TTFB}ms`);

      if (metric.value > 1800) {
        console.error('🚨 Slow server response detected. Check:');
        console.error('   • Server performance');
        console.error('   • Database query optimization');
        console.error('   • CDN configuration');
        console.error('   • Backend caching');
      }
    }
  }

  private monitorCustomMetrics() {
    // Monitor First Contentful Paint more precisely
    this.observePerformanceEntry('paint', (entries) => {
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.recordCustomMetric('First-Contentful-Paint', entry.startTime);
        }
      });
    });

    // Monitor Time to Interactive
    this.monitorTimeToInteractive();

    // Monitor Memory usage
    this.monitorMemoryUsage();
  }

  private monitorTimeToInteractive() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastLongTask = entries[entries.length - 1];
        if (lastLongTask) {
          this.recordCustomMetric('Time-to-Interactive', lastLongTask.startTime + lastLongTask.duration);
        }
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('Long task monitoring not supported');
      }
    }
  }

  private monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordCustomMetric('JS-Heap-Used', memory.usedJSHeapSize);
        this.recordCustomMetric('JS-Heap-Total', memory.totalJSHeapSize);

        // Warn about memory leaks
        if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
          console.warn(`⚠️ High memory usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        }
      }, 30000); // Every 30 seconds
    }
  }

  private monitorResourceTiming() {
    this.observePerformanceEntry('resource', (entries) => {
      entries.forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;

        // Track slow resources
        if (resource.duration > 1000) { // > 1 second
          console.warn(`⚠️ Slow resource: ${resource.name} took ${resource.duration.toFixed(2)}ms`);
        }

        // Track failed resources
        if ((resource as any).transferSize === 0 && resource.name.startsWith('http')) {
          console.error(`🚨 Failed resource: ${resource.name}`);
        }
      });
    });
  }

  private monitorLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) { // > 50ms
            console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('Long task monitoring not supported');
      }
    }
  }

  private observePerformanceEntry(type: string, callback: (entries: any[]) => void) {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });

      try {
        observer.observe({ entryTypes: [type] });
        this.observers.push(observer);
      } catch (e) {
        console.warn(`${type} monitoring not supported`);
      }
    }
  }

  private recordCustomMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      id: `custom-${Date.now()}`,
      rating: this.getRating(name, value),
      timestamp: Date.now(),
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name)!.push(metric);
  }

  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = THRESHOLDS[metricName];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private getNavigationType(): string {
    if (typeof window !== 'undefined' && 'navigation' in window) {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        switch (navEntry.type) {
          case 'navigate': return 'normal';
          case 'reload': return 'reload';
          case 'back_forward': return 'back_forward';
          case 'prerender': return 'prerender';
        }
      }
    }
    return 'unknown';
  }

  private logPerformanceWarning(metric: PerformanceMetric) {
    const threshold = THRESHOLDS[metric.name];
    if (!threshold) return;

    const target = APPLE_GRADE_TARGETS[metric.name as keyof typeof APPLE_GRADE_TARGETS];
    if (target && metric.value > target) {
      const percentage = ((metric.value / target - 1) * 100).toFixed(0);
      console.warn(
        `🐌 ${metric.name} is ${percentage}% over Apple target: ` +
        `${metric.value}${threshold.unit} > ${target}${threshold.unit}`
      );
    }
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: {
          metric_rating: metric.rating,
          metric_delta: metric.delta,
        },
      });
    }

    // Send to Vercel Analytics if available
    if (typeof window !== 'undefined' && 'va' in window) {
      (window as any).va('web-vitals', {
        [metric.name]: metric.value,
        rating: metric.rating,
      });
    }
  }

  private setupPeriodicReporting() {
    // Report performance every 30 seconds in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        this.generatePerformanceReport();
      }, 30000);
    }
  }

  public generatePerformanceReport() {
    console.log('\n📊 PERFORMANCE REPORT');
    console.log('='.repeat(50));

    // Core Web Vitals
    const coreMetrics = ['CLS', 'INP', 'FCP', 'LCP', 'TTFB'];
    coreMetrics.forEach(metricName => {
      const metricData = this.metrics.get(metricName);
      if (metricData && metricData.length > 0) {
        const latest = metricData[metricData.length - 1];
        const target = APPLE_GRADE_TARGETS[metricName as keyof typeof APPLE_GRADE_TARGETS];
        const status = latest.value <= target ? '✅' : '⚠️';

        console.log(
          `${status} ${metricName}: ${latest.value.toFixed(2)}ms ` +
          `(Target: ${target}ms, Rating: ${latest.rating})`
        );
      }
    });

    // Performance summary
    const summary = this.calculatePerformanceSummary();
    console.log(`\n📈 Performance Score: ${summary.score}/100`);
    console.log(`🎯 Apple Grade: ${summary.grade}`);

    if (summary.issues.length > 0) {
      console.log('\n⚠️ Issues to address:');
      summary.issues.forEach(issue => console.log(`   • ${issue}`));
    }

    console.log('='.repeat(50));
  }

  private calculatePerformanceSummary() {
    let score = 100;
    const issues: string[] = [];

    const coreMetrics = ['CLS', 'INP', 'FCP', 'LCP', 'TTFB'];
    coreMetrics.forEach(metricName => {
      const metricData = this.metrics.get(metricName);
      if (metricData && metricData.length > 0) {
        const latest = metricData[metricData.length - 1];
        const target = APPLE_GRADE_TARGETS[metricName as keyof typeof APPLE_GRADE_TARGETS];

        if (latest.value > target) {
          const penalty = Math.min(20, ((latest.value / target - 1) * 20));
          score -= penalty;
          issues.push(`${metricName} exceeds Apple target`);
        }
      }
    });

    let grade = 'A+';
    if (score < 80) grade = 'A';
    if (score < 70) grade = 'B';
    if (score < 60) grade = 'C';
    if (score < 50) grade = 'D';
    if (score < 40) grade = 'F';

    return { score: Math.round(score), grade, issues };
  }

  public getMetrics(): PerformanceMetric[] {
    const allMetrics: PerformanceMetric[] = [];
    this.metrics.forEach(metricList => {
      allMetrics.push(...metricList);
    });
    return allMetrics;
  }

  public getPerformanceScore(): number {
    return this.calculatePerformanceSummary().score;
  }

  public getAppleGrade(): string {
    return this.calculatePerformanceSummary().grade;
  }
}

// Singleton instance
let webVitalsMonitor: WebVitalsMonitor;

export function getWebVitalsMonitor(): WebVitalsMonitor {
  if (!webVitalsMonitor) {
    webVitalsMonitor = new WebVitalsMonitor();
  }
  return webVitalsMonitor;
}

// Export for use in components
export { WebVitalsMonitor };
export default WebVitalsMonitor;