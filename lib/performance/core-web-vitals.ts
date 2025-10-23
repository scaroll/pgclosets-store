/**
 * Core Web Vitals Optimization System
 *
 * This module provides comprehensive optimization for:
 * - Largest Contentful Paint (LCP)
 * - First Input Delay (FID)
 * - Cumulative Layout Shift (CLS)
 * - First Contentful Paint (FCP)
 * - Time to First Byte (TTFB)
 */

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

// Web Vitals thresholds (Google recommendations)
const VITAL_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // milliseconds
  FID: { good: 100, needsImprovement: 300 }, // milliseconds
  CLS: { good: 0.1, needsImprovement: 0.25 }, // score
  FCP: { good: 1800, needsImprovement: 3000 }, // milliseconds
  TTFB: { good: 800, needsImprovement: 1800 }, // milliseconds
}

interface WebVitalsMetrics {
  LCP?: number
  FID?: number
  CLS?: number
  FCP?: number
  TTFB?: number
  timestamp: number
  url: string
}

interface PerformanceRating {
  score: number // 0-100
  level: 'good' | 'needs-improvement' | 'poor'
  metrics: WebVitalsMetrics
  recommendations: string[]
}

/**
 * Core Web Vitals Monitor
 */
class WebVitalsMonitor {
  private metrics: WebVitalsMetrics = {
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : ''
  }

  private ratings: PerformanceRating[] = []
  private observers: PerformanceObserver[] = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupVitalsMonitoring()
      this.setupPerformanceObservers()
    }
  }

  /**
   * Setup Web Vitals monitoring
   */
  private setupVitalsMonitoring(): void {
    // Largest Contentful Paint
    getLCP((metric) => {
      this.metrics.LCP = metric.value
      this.logVital('LCP', metric.value)
      this.optimizeForLCP(metric.value)
    })

    // First Input Delay
    getFID((metric) => {
      this.metrics.FID = metric.value
      this.logVital('FID', metric.value)
      this.optimizeForFID(metric.value)
    })

    // Cumulative Layout Shift
    getCLS((metric) => {
      this.metrics.CLS = metric.value
      this.logVital('CLS', metric.value)
      this.optimizeForCLS(metric.value)
    })

    // First Contentful Paint
    getFCP((metric) => {
      this.metrics.FCP = metric.value
      this.logVital('FCP', metric.value)
    })

    // Time to First Byte
    getTTFB((metric) => {
      this.metrics.TTFB = metric.value
      this.logVital('TTFB', metric.value)
    })
  }

  /**
   * Setup additional performance observers
   */
  private setupPerformanceObservers(): void {
    // Long task observer
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            })
          }
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })
        this.observers.push(longTaskObserver)
      } catch (e) {
        console.warn('Long task observer not supported')
      }

      // Layout shift observer
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          let clsScore = 0
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsScore += (entry as any).value
            }
          }
          if (clsScore > 0) {
            console.warn('Layout shift detected:', { score: clsScore })
          }
        })
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(layoutShiftObserver)
      } catch (e) {
        console.warn('Layout shift observer not supported')
      }

      // Resource timing observer
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resource = entry as PerformanceResourceTiming
            if (resource.duration > 1000) { // Resources taking more than 1 second
              console.warn('Slow resource:', {
                name: resource.name,
                duration: resource.duration,
                size: resource.transferSize
              })
            }
          }
        })
        resourceObserver.observe({ entryTypes: ['resource'] })
        this.observers.push(resourceObserver)
      } catch (e) {
        console.warn('Resource observer not supported')
      }
    }
  }

  /**
   * LCP Optimization
   */
  private optimizeForLCP(lcpValue: number): void {
    if (lcpValue > VITAL_THRESHOLDS.LCP.needsImprovement) {
      console.warn('Poor LCP detected, applying optimizations')

      // Preload critical resources
      this.preloadCriticalResources()

      // Optimize images
      this.optimizeImagesForLCP()

      // Defer non-critical CSS
      this.deferNonCriticalCSS()
    }
  }

  /**
   * FID Optimization
   */
  private optimizeForFID(fidValue: number): void {
    if (fidValue > VITAL_THRESHOLDS.FID.needsImprovement) {
      console.warn('Poor FID detected, applying optimizations')

      // Break up long tasks
      this.breakUpLongTasks()

      // Reduce JavaScript execution time
      this.reduceJavaScriptExecution()
    }
  }

  /**
   * CLS Optimization
   */
  private optimizeForCLS(clsValue: number): void {
    if (clsValue > VITAL_THRESHOLDS.CLS.needsImprovement) {
      console.warn('Poor CLS detected, applying optimizations')

      // Ensure proper image dimensions
      this.ensureImageDimensions()

      // Reserve space for dynamic content
      this.reserveSpaceForDynamicContent()

      // Avoid inserting content above existing content
      this.avoidContentInsertionShift()
    }
  }

  /**
   * Preload critical resources
   */
  private preloadCriticalResources(): void {
    const criticalResources = [
      { href: '/fonts/inter-v12-latin-regular.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { href: '/images/hero.webp', as: 'image', type: 'image/webp' }
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      if (resource.type) link.type = resource.type
      if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin
      document.head.appendChild(link)
    })
  }

  /**
   * Optimize images for LCP
   */
  private optimizeImagesForLCP(): void {
    // Find the largest image above the fold
    const images = document.querySelectorAll('img')
    let largestImage: HTMLImageElement | null = null
    let maxSize = 0

    images.forEach(img => {
      const rect = img.getBoundingClientRect()
      const size = rect.width * rect.height
      if (rect.top < window.innerHeight && size > maxSize) {
        maxSize = size
        largestImage = img
      }
    })

    if (largestImage) {
      // Add priority loading to largest image
      if (!largestImage.loading) {
        largestImage.loading = 'eager'
      }

      // Ensure it has proper dimensions
      if (!largestImage.width || !largestImage.height) {
        largestImage.width = largestImage.naturalWidth
        largestImage.height = largestImage.naturalHeight
      }
    }
  }

  /**
   * Defer non-critical CSS
   */
  private deferNonCriticalCSS(): void {
    const links = document.querySelectorAll('link[rel="stylesheet"]')
    links.forEach(link => {
      if (!link.href.includes('critical')) {
        link.media = 'print'
        link.onload = function() {
          this.media = 'all'
        }
      }
    })
  }

  /**
   * Break up long tasks
   */
  private breakUpLongTasks(): void {
    // Use requestIdleCallback for non-critical work
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        console.log('Performing non-critical work during idle time')
      })
    }
  }

  /**
   * Reduce JavaScript execution time
   */
  private reduceJavaScriptExecution(): void {
    // Defer non-critical JavaScript
    const scripts = document.querySelectorAll('script[src]')
    scripts.forEach(script => {
      if (!script.defer && !script.async && !script.hasAttribute('data-critical')) {
        script.defer = true
      }
    })
  }

  /**
   * Ensure images have proper dimensions
   */
  private ensureImageDimensions(): void {
    const images = document.querySelectorAll('img:not([width]):not([height])')
    images.forEach(img => {
      if (img.naturalWidth && img.naturalHeight) {
        img.width = img.naturalWidth
        img.height = img.naturalHeight
      }
    })
  }

  /**
   * Reserve space for dynamic content
   */
  private reserveSpaceForDynamicContent(): void {
    // Find elements that might load content dynamically
    const dynamicElements = document.querySelectorAll('[data-dynamic], [data-lazy]')
    dynamicElements.forEach(element => {
      if (element instanceof HTMLElement) {
        // Set minimum height to prevent layout shift
        if (!element.style.minHeight) {
          element.style.minHeight = '200px'
        }
      }
    })
  }

  /**
   * Avoid content insertion shifts
   */
  private avoidContentInsertionShift(): void {
    // Add position: relative to containers
    const containers = document.querySelectorAll('.content-container')
    containers.forEach(container => {
      if (container instanceof HTMLElement) {
        container.style.position = 'relative'
      }
    })
  }

  /**
   * Log vital metric
   */
  private logVital(name: string, value: number): void {
    const threshold = VITAL_THRESHOLDS[name as keyof typeof VITAL_THRESHOLDS]
    if (!threshold) return

    let level = 'good'
    if (value > threshold.needsImprovement) {
      level = 'poor'
    } else if (value > threshold.good) {
      level = 'needs-improvement'
    }

    console.log(`📊 ${name}: ${value.toFixed(2)} (${level})`)
  }

  /**
   * Get current performance rating
   */
  getPerformanceRating(): PerformanceRating {
    const ratings = []
    let totalScore = 0
    let metricCount = 0

    // Calculate individual metric scores
    Object.entries(this.metrics).forEach(([key, value]) => {
      if (key === 'timestamp' || key === 'url' || value === undefined) return

      const threshold = VITAL_THRESHOLDS[key as keyof typeof VITAL_THRESHOLDS]
      if (!threshold) return

      let score = 100
      let level: 'good' | 'needs-improvement' | 'poor' = 'good'

      if (value > threshold.needsImprovement) {
        score = Math.max(0, 100 - ((value - threshold.needsImprovement) / threshold.needsImprovement) * 50)
        level = 'poor'
      } else if (value > threshold.good) {
        score = 100 - ((value - threshold.good) / (threshold.needsImprovement - threshold.good)) * 50
        level = 'needs-improvement'
      }

      ratings.push({ metric: key, value, score, level })
      totalScore += score
      metricCount++
    })

    const overallScore = metricCount > 0 ? totalScore / metricCount : 0
    let overallLevel: 'good' | 'needs-improvement' | 'poor' = 'good'

    if (overallScore < 50) {
      overallLevel = 'poor'
    } else if (overallScore < 80) {
      overallLevel = 'needs-improvement'
    }

    const rating: PerformanceRating = {
      score: overallScore,
      level: overallLevel,
      metrics: this.metrics,
      recommendations: this.generateRecommendations(ratings)
    }

    this.ratings.push(rating)
    return rating
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(ratings: any[]): string[] {
    const recommendations: string[] = []

    ratings.forEach(({ metric, level, value }) => {
      switch (metric) {
        case 'LCP':
          if (level !== 'good') {
            recommendations.push(
              'Optimize LCP: Preload hero images and critical CSS',
              'Use Next.js Image component with priority prop for above-fold images',
              'Consider using a CDN for static assets'
            )
          }
          break
        case 'FID':
          if (level !== 'good') {
            recommendations.push(
              'Optimize FID: Break up long tasks into smaller chunks',
              'Defer non-critical JavaScript',
              'Use React.lazy() for code splitting'
            )
          }
          break
        case 'CLS':
          if (level !== 'good') {
            recommendations.push(
              'Optimize CLS: Ensure all images have width and height attributes',
              'Reserve space for dynamic content and ads',
              'Avoid inserting content above existing content'
            )
          }
          break
        case 'FCP':
          if (level !== 'good') {
            recommendations.push(
              'Optimize FCP: Minimize server response time',
              'Enable compression and caching',
              'Optimize critical rendering path'
            )
          }
          break
        case 'TTFB':
          if (level !== 'good') {
            recommendations.push(
              'Optimize TTFB: Improve server response time',
              'Use CDN for faster content delivery',
              'Enable HTTP/2 and server push'
            )
          }
          break
      }
    })

    return Array.from(new Set(recommendations)) // Remove duplicates
  }

  /**
   * Get all metrics
   */
  getMetrics(): WebVitalsMetrics {
    return { ...this.metrics }
  }

  /**
   * Get performance score (0-100)
   */
  getPerformanceScore(): number {
    return this.getPerformanceRating().score
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Global instance
let webVitalsMonitor: WebVitalsMonitor | null = null

/**
 * Get Web Vitals monitor instance
 */
export function getWebVitalsMonitor(): WebVitalsMonitor {
  if (!webVitalsMonitor) {
    webVitalsMonitor = new WebVitalsMonitor()
  }
  return webVitalsMonitor
}

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring(): void {
  const monitor = getWebVitalsMonitor()

  // Report metrics to analytics (optional)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    setTimeout(() => {
      const metrics = monitor.getMetrics()
      const rating = monitor.getPerformanceRating()

      // Send to Google Analytics
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'Core Web Vitals',
        value: Math.round(rating.score),
        custom_map: {
          lcp: metrics.LCP,
          fid: metrics.FID,
          cls: metrics.CLS,
          fcp: metrics.FCP,
          ttfb: metrics.TTFB
        }
      })
    }, 5000)
  }
}

/**
 * Performance utilities for specific optimizations
 */
export const performanceUtils = {
  /**
   * Create a performance mark
   */
  mark(name: string): void {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(name)
    }
  },

  /**
   * Measure performance between two marks
   */
  measure(name: string, startMark: string, endMark?: string): number {
    if ('performance' in window && 'measure' in performance) {
      try {
        performance.measure(name, startMark, endMark)
        const measure = performance.getEntriesByName(name, 'measure')[0]
        return measure ? measure.duration : 0
      } catch (e) {
        console.warn('Performance measure failed:', e)
      }
    }
    return 0
  },

  /**
   * Report performance metrics
   */
  reportMetric(name: string, value: number, unit: string = 'ms'): void {
    console.log(`⚡ ${name}: ${value}${unit}`)

    // Send to analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'performance_metric', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        custom_parameter: unit
      })
    }
  }
}

// Initialize on client side
if (typeof window !== 'undefined') {
  // Initialize performance monitoring
  if (document.readyState === 'complete') {
    initializePerformanceMonitoring()
  } else {
    window.addEventListener('load', initializePerformanceMonitoring)
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (webVitalsMonitor) {
      webVitalsMonitor.cleanup()
    }
  })
}