'use client';

// Performance monitoring utilities for the products page

export interface PerformanceMetrics {
  domNodes: number;
  renderTime: number;
  imageLoadTime: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  memoryUsage?: number;
}

export class ProductsPagePerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private startTime: number;

  constructor() {
    this.startTime = performance.now();
  }

  // Measure DOM nodes in the products container
  measureDOMNodes(containerId: string = 'products-grid'): number {
    const container = document.getElementById(containerId);
    if (!container) return 0;

    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_ELEMENT,
      null
    );

    let nodeCount = 0;
    while (walker.nextNode()) {
      nodeCount++;
    }

    this.metrics.domNodes = nodeCount;
    return nodeCount;
  }

  // Measure render time
  measureRenderTime(): number {
    const renderTime = performance.now() - this.startTime;
    this.metrics.renderTime = renderTime;
    return renderTime;
  }

  // Measure image loading performance
  measureImageLoading(): Promise<number> {
    return new Promise((resolve) => {
      const images = document.querySelectorAll('#products-grid img');
      let loadedCount = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        resolve(0);
        return;
      }

      const startTime = performance.now();

      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          const loadTime = performance.now() - startTime;
          this.metrics.imageLoadTime = loadTime;
          resolve(loadTime);
        }
      };

      images.forEach((img) => {
        if ((img as HTMLImageElement).complete) {
          onImageLoad();
        } else {
          img.addEventListener('load', onImageLoad);
          img.addEventListener('error', onImageLoad); // Count errors as "loaded"
        }
      });
    });
  }

  // Get memory usage if available
  measureMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize;
      return memory.usedJSHeapSize;
    }
    return undefined;
  }

  // Get Web Vitals metrics
  measureWebVitals(): Promise<Partial<PerformanceMetrics>> {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });

      // Measure Time to Interactive (simplified)
      setTimeout(() => {
        this.metrics.timeToInteractive = performance.now() - this.startTime;
        resolve(this.metrics);
      }, 100);
    });
  }

  // Get all metrics
  getAllMetrics(): Partial<PerformanceMetrics> {
    return {
      ...this.metrics,
      renderTime: this.measureRenderTime(),
      domNodes: this.measureDOMNodes(),
      memoryUsage: this.measureMemoryUsage()
    };
  }

  // Log performance report
  logPerformanceReport(): void {
    const metrics = this.getAllMetrics();

    console.group('🚀 Products Page Performance Report');
    console.log('📊 DOM Nodes:', metrics.domNodes);
    console.log('⏱️ Render Time:', `${metrics.renderTime?.toFixed(2)}ms`);
    console.log('🖼️ Image Load Time:', `${metrics.imageLoadTime?.toFixed(2)}ms`);
    console.log('🎨 First Contentful Paint:', `${metrics.firstContentfulPaint?.toFixed(2)}ms`);
    console.log('⚡ Time to Interactive:', `${metrics.timeToInteractive?.toFixed(2)}ms`);

    if (metrics.memoryUsage) {
      console.log('💾 Memory Usage:', `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB`);
    }

    // Performance analysis
    this.analyzePerformance(metrics);
    console.groupEnd();
  }

  // Analyze performance and provide recommendations
  private analyzePerformance(metrics: Partial<PerformanceMetrics>): void {
    const recommendations: string[] = [];

    if (metrics.domNodes && metrics.domNodes > 1000) {
      recommendations.push('⚠️ High DOM node count detected. Consider implementing virtual scrolling.');
    } else if (metrics.domNodes && metrics.domNodes < 100) {
      recommendations.push('✅ DOM node count is optimal.');
    }

    if (metrics.renderTime && metrics.renderTime > 1000) {
      recommendations.push('⚠️ Slow render time. Consider React.memo and useMemo optimizations.');
    } else if (metrics.renderTime && metrics.renderTime < 500) {
      recommendations.push('✅ Fast render time achieved.');
    }

    if (metrics.imageLoadTime && metrics.imageLoadTime > 3000) {
      recommendations.push('⚠️ Slow image loading. Consider lazy loading and image optimization.');
    } else if (metrics.imageLoadTime && metrics.imageLoadTime < 1000) {
      recommendations.push('✅ Fast image loading achieved.');
    }

    if (recommendations.length > 0) {
      console.group('💡 Performance Recommendations');
      recommendations.forEach(rec => console.log(rec));
      console.groupEnd();
    }
  }
}

// Hook for using performance monitoring in React components
export function usePerformanceMonitoring() {
  const monitor = new ProductsPagePerformanceMonitor();

  const measureAndReport = async () => {
    await monitor.measureWebVitals();
    await monitor.measureImageLoading();
    monitor.logPerformanceReport();
  };

  return {
    monitor,
    measureAndReport,
    measureDOMNodes: () => monitor.measureDOMNodes(),
    measureRenderTime: () => monitor.measureRenderTime()
  };
}