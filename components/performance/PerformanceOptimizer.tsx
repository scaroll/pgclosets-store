'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { getWebVitalsMonitor } from '@/lib/performance/web-vitals-monitor';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableMonitoring?: boolean;
  enablePreloading?: boolean;
  enablePrefetching?: boolean;
}

/**
 * APPLE-GRADE PERFORMANCE OPTIMIZER COMPONENT
 * Provides comprehensive performance optimizations including:
 * - Resource preloading and prefetching
 * - Service worker registration
 * - Performance monitoring
 * - Critical resource prioritization
 */
export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  enableMonitoring = true,
  enablePreloading = true,
  enablePrefetching = true,
}) => {
  const [isOptimized, setIsOptimized] = useState(false);
  const [performanceScore, setPerformanceScore] = useState<number | null>(null);

  useEffect(() => {
    // Initialize performance optimizations
    initializeOptimizations();

    // Set up performance monitoring
    if (enableMonitoring) {
      const monitor = getWebVitalsMonitor();

      // Update performance score every 5 seconds
      const scoreInterval = setInterval(() => {
        const score = monitor.getPerformanceScore();
        setPerformanceScore(score);
      }, 5000);

      return () => clearInterval(scoreInterval);
    }
  }, [enableMonitoring]);

  const initializeOptimizations = async () => {
    try {
      // Preload critical resources
      if (enablePreloading) {
        await preloadCriticalResources();
      }

      // Initialize resource hints
      if (enablePrefetching) {
        initializeResourceHints();
      }

      // Set up intersection observer for lazy loading
      setupIntersectionObserver();

      // Optimize font loading
      optimizeFontLoading();

      // Set up performance budget monitoring
      setupPerformanceBudgetMonitoring();

      setIsOptimized(true);
    } catch (error) {
      console.error('Performance optimization failed:', error);
    }
  };

  const preloadCriticalResources = async () => {
    const criticalResources = [
      // Critical images
      { href: '/images/elegant-barn-door-closet.png', as: 'image', type: 'image/png' },
      { href: '/images/optimized/elegant-barn-door-closet/mobile.webp', as: 'image', type: 'image/webp' },

      // Critical fonts
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap', as: 'style' },
      { href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap', as: 'style' },

      // Critical scripts (if any)
      // { href: '/scripts/critical.js', as: 'script' },
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      document.head.appendChild(link);
    });
  };

  const initializeResourceHints = () => {
    // DNS prefetch for external domains
    const domains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'www.google-analytics.com',
      'www.googletagmanager.com',
      'cdn.renin.com',
      'images.unsplash.com',
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect for critical domains
    const criticalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
    ];

    criticalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  };

  const setupIntersectionObserver = () => {
    if (!('IntersectionObserver' in window)) return;

    // Lazy load images below the fold
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1,
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });

    // Lazy load components
    const componentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          // Trigger component loading logic here
          element.classList.add('in-view');
          componentObserver.unobserve(element);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.1,
    });

    // Observe lazy components
    document.querySelectorAll('[data-lazy-component]').forEach(el => {
      componentObserver.observe(el);
    });
  };

  const optimizeFontLoading = () => {
    // Optimize font display with font-face loading
    if ('fonts' in document) {
      Promise.all([
        document.fonts.load('400 1em Inter'),
        document.fonts.load('500 1em Inter'),
        document.fonts.load('600 1em Inter'),
        document.fonts.load('400 1em Playfair Display'),
        document.fonts.load('600 1em Playfair Display'),
        document.fonts.load('700 1em Playfair Display'),
      ]).then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }

    // Fallback for browsers without font loading API
    setTimeout(() => {
      document.documentElement.classList.add('fonts-fallback-loaded');
    }, 3000);
  };

  const setupPerformanceBudgetMonitoring = () => {
    // Monitor bundle sizes
    if ('performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;
      const jsHeapSize = memory.usedJSHeapSize / 1024 / 1024; // MB

      // Warn if memory usage is high
      if (jsHeapSize > 50) {
        console.warn(`High memory usage: ${jsHeapSize.toFixed(2)}MB`);
      }
    }

    // Monitor resource loading
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;

          // Warn about slow resources
          if (resource.duration > 2000) {
            console.warn(`Slow resource: ${resource.name} took ${resource.duration.toFixed(2)}ms`);
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      // Resource timing might not be supported
    }
  };

  return (
    <>
      {children}

      {/* Performance monitoring scripts */}
      {enableMonitoring && (
        <Script
          id="performance-monitor"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', () => {
                  console.log('🚀 Performance monitoring initialized');

                  // Log performance metrics
                  if ('performance' in window) {
                    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;

                    console.log('⏱️ Performance Metrics:');
                    console.log('   Load Time:', loadTime + 'ms');
                    console.log('   DOM Content Loaded:', domContentLoaded + 'ms');
                  }
                });
              }
            `
          }}
        />
      )}

      {/* Critical resource preloading */}
      {enablePreloading && (
        <Script
          id="resource-preloader"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Preload critical resources
              (function() {
                const criticalResources = [
                  { href: '/images/optimized/elegant-barn-door-closet/mobile.webp', as: 'image', type: 'image/webp' },
                  { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap', as: 'style' }
                ];

                criticalResources.forEach(resource => {
                  const link = document.createElement('link');
                  link.rel = 'preload';
                  link.href = resource.href;
                  link.as = resource.as;
                  if (resource.type) link.type = resource.type;
                  document.head.appendChild(link);
                });
              })();
            `
          }}
        />
      )}

      {/* Performance indicator for development */}
      {process.env.NODE_ENV === 'development' && performanceScore !== null && (
        <div className="fixed top-4 right-4 z-50 bg-black text-white px-3 py-1 rounded-md text-sm font-mono">
          Score: {performanceScore}/100
        </div>
      )}
    </>
  );
};

/**
 * Performance metrics display component
 */
export const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    const monitor = getWebVitalsMonitor();
    const interval = setInterval(() => {
      setMetrics(monitor.getMetrics().slice(-5)); // Last 5 metrics
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-xs">
      <h4 className="font-bold mb-2">Performance Metrics</h4>
      {metrics.map((metric, index) => (
        <div key={`${metric.name}-${index}`} className="mb-1">
          <span className="text-green-400">{metric.name}:</span>{' '}
          <span className="text-yellow-300">{metric.value.toFixed(2)}</span>
          <span className="text-gray-400"> ({metric.rating})</span>
        </div>
      ))}
    </div>
  );
};

/**
 * Resource preloading hook
 */
export const useResourcePreloader = (resources: Array<{ href: string; as: string; type?: string }>) => {
  useEffect(() => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      document.head.appendChild(link);
    });
  }, [resources]);
};

export default PerformanceOptimizer;