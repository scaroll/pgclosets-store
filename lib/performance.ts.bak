/**
 * Performance monitoring and optimization utilities
 */

// Web Vitals tracking
export interface WebVitalsMetrics {
  FCP: number | null; // First Contentful Paint
  LCP: number | null; // Largest Contentful Paint
  FID: number | null; // First Input Delay
  CLS: number | null; // Cumulative Layout Shift
  TTFB: number | null; // Time to First Byte
  INP: number | null; // Interaction to Next Paint
}

// Initialize Web Vitals tracking
export function initWebVitals(callback?: (metrics: WebVitalsMetrics) => void) {
  if (typeof window === 'undefined') return;

  const metrics: WebVitalsMetrics = {
    FCP: null,
    LCP: null,
    FID: null,
    CLS: null,
    TTFB: null,
    INP: null,
  };

  // Track FCP
  const fcpObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        metrics.FCP = entry.startTime;
        if (callback) callback(metrics);
      }
    }
  });
  fcpObserver.observe({ entryTypes: ['paint'] });

  // Track LCP
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    metrics.LCP = lastEntry.startTime;
    if (callback) callback(metrics);
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // Track FID
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // @ts-ignore
      if (entry.processingStart && entry.startTime) {
        // @ts-ignore
        metrics.FID = entry.processingStart - entry.startTime;
        if (callback) callback(metrics);
      }
    }
  });
  fidObserver.observe({ entryTypes: ['first-input'] });

  // Track CLS
  let clsValue = 0;
  const clsEntries: any[] = [];
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // @ts-ignore
      if (!entry.hadRecentInput) {
        // @ts-ignore
        clsValue += entry.value;
        clsEntries.push(entry);
      }
    }
    metrics.CLS = clsValue;
    if (callback) callback(metrics);
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });

  // Track TTFB
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigationEntry) {
    metrics.TTFB = navigationEntry.responseStart - navigationEntry.fetchStart;
  }

  return metrics;
}

// Report Web Vitals to analytics
export function reportWebVitals(metrics: WebVitalsMetrics) {
  // Report to Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    Object.entries(metrics).forEach(([name, value]) => {
      if (value !== null) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: name,
          value: Math.round(value),
          non_interaction: true,
        });
      }
    });
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metrics);
  }
}

// Image optimization helper
export function getOptimizedImageUrl(
  src: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  }
) {
  // If it's already a full URL, return as-is
  if (src.startsWith('http')) {
    return src;
  }

  // Build optimized URL for local images
  const params = new URLSearchParams();
  if (options?.width) params.set('w', options.width.toString());
  if (options?.height) params.set('h', options.height.toString());
  if (options?.quality) params.set('q', options.quality.toString());
  if (options?.format) params.set('fm', options.format);

  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
}

// Lazy loading utility
export function setupLazyLoading() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const images = document.querySelectorAll('img[data-lazy]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.lazy;
        if (src) {
          img.src = src;
          img.removeAttribute('data-lazy');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px',
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Prefetch critical resources
export function prefetchCriticalResources(resources: string[]) {
  if (typeof window === 'undefined') return;

  resources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    document.head.appendChild(link);
  });
}

// Monitor and report long tasks
export function monitorLongTasks(threshold = 50) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // @ts-ignore
      if (entry.duration > threshold) {
        console.warn('Long task detected:', {
          // @ts-ignore
          duration: entry.duration,
          // @ts-ignore
          startTime: entry.startTime,
          name: entry.name,
        });
      }
    }
  });

  observer.observe({ entryTypes: ['longtask'] });
}

// Resource hints helper
export function addResourceHints(hints: Array<{
  url: string;
  type: 'dns-prefetch' | 'preconnect' | 'prefetch' | 'preload';
  as?: string;
  crossorigin?: boolean;
}>) {
  if (typeof document === 'undefined') return;

  hints.forEach(({ url, type, as, crossorigin }) => {
    const link = document.createElement('link');
    link.rel = type;
    link.href = url;
    if (as) link.setAttribute('as', as);
    if (crossorigin) link.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(link);
  });
}

// Bundle size monitoring
export function reportBundleSize() {
  if (typeof window === 'undefined' || !performance.getEntriesByType) {
    return;
  }

  const resources = performance.getEntriesByType('resource');
  const scripts = resources.filter((r) => r.name.includes('.js'));
  const styles = resources.filter((r) => r.name.includes('.css'));
  const images = resources.filter((r) =>
    r.name.includes('.jpg') ||
    r.name.includes('.png') ||
    r.name.includes('.webp')
  );

  const totalScriptSize = scripts.reduce((acc, s) => acc + (s.transferSize || 0), 0);
  const totalStyleSize = styles.reduce((acc, s) => acc + (s.transferSize || 0), 0);
  const totalImageSize = images.reduce((acc, i) => acc + (i.transferSize || 0), 0);

  console.log('Bundle Sizes:', {
    scripts: `${(totalScriptSize / 1024).toFixed(2)} KB`,
    styles: `${(totalStyleSize / 1024).toFixed(2)} KB`,
    images: `${(totalImageSize / 1024).toFixed(2)} KB`,
    total: `${((totalScriptSize + totalStyleSize + totalImageSize) / 1024).toFixed(2)} KB`,
  });
}

// Memory monitoring
export function monitorMemory(callback?: (memory: any) => void) {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return;
  }

  const checkMemory = () => {
    // @ts-ignore
    const memory = performance.memory;
    if (memory) {
      const memoryInfo = {
        usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
      };

      if (callback) {
        callback(memoryInfo);
      }

      // Warn if memory usage is high
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      if (usagePercent > 90) {
        console.warn('High memory usage detected:', memoryInfo);
      }
    }
  };

  // Check memory every 30 seconds
  setInterval(checkMemory, 30000);

  // Initial check
  checkMemory();
}

// Performance marks and measures
export class PerformanceTracker {
  private marks: Map<string, number> = new Map();

  mark(name: string) {
    this.marks.set(name, performance.now());
    if ('mark' in performance) {
      performance.mark(name);
    }
  }

  measure(name: string, startMark: string, endMark?: string) {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();

    if (start && end) {
      const duration = end - (typeof start === 'number' ? start : 0);

      if ('measure' in performance) {
        performance.measure(name, startMark, endMark);
      }

      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      return duration;
    }

    return null;
  }

  clear() {
    this.marks.clear();
    if ('clearMarks' in performance) {
      performance.clearMarks();
    }
    if ('clearMeasures' in performance) {
      performance.clearMeasures();
    }
  }
}

// Export a singleton instance
export const performanceTracker = new PerformanceTracker();

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  // Initialize Web Vitals tracking
  initWebVitals((metrics) => {
    reportWebVitals(metrics);
  });

  // Setup lazy loading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLazyLoading);
  } else {
    setupLazyLoading();
  }

  // Monitor long tasks in development
  if (process.env.NODE_ENV === 'development') {
    monitorLongTasks();
    monitorMemory();
  }
}