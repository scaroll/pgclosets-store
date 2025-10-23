import { getCLS, getFID, getFCP, getLCP, getTTFB, getINP } from 'web-vitals'

interface PerformanceMetrics {
  // Core Web Vitals
  cls: number // Cumulative Layout Shift
  fid: number // First Input Delay
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  ttfb: number // Time to First Byte
  inp: number // Interaction to Next Paint

  // Custom Metrics
  renderTime: number
  hydrationTime: number
  bundleSize: number
  apiResponseTime: number
  imageLoadTime: number
  cacheHitRate: number
  memoryUsage: number
  errorRate: number
  conversionRate: number
}

class PerformanceMonitoring {
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []
  private startTime: number = Date.now()

  constructor() {
    this.initializeCoreWebVitals()
    this.initializeCustomMetrics()
    this.initializeErrorTracking()
    this.initializeResourceTiming()
  }

  // Core Web Vitals monitoring
  private initializeCoreWebVitals() {
    const sendToAnalytics = (metric: any) => {
      // Send to Vercel Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
          custom_parameter_1: metric.name,
          custom_parameter_2: metric.delta,
        })
      }

      // Send to custom analytics endpoint
      this.sendMetricToBackend(metric.name, metric.value, {
        id: metric.id,
        delta: metric.delta,
        navigationType: this.getNavigationType(),
        deviceType: this.getDeviceType(),
        connectionType: this.getConnectionType(),
      })

      this.metrics[metric.name.toLowerCase() as keyof PerformanceMetrics] = metric.value
    }

    getCLS(sendToAnalytics)
    getFID(sendToAnalytics)
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)
    getINP(sendToAnalytics)
  }

  // Custom performance metrics
  private initializeCustomMetrics() {
    // Render time monitoring
    this.measureRenderTime()

    // Hydration time for React components
    this.measureHydrationTime()

    // Bundle size monitoring
    this.measureBundleSize()

    // API response time
    this.measureAPIResponseTime()

    // Image loading performance
    this.measureImageLoadTime()

    // Cache performance
    this.measureCachePerformance()

    // Memory usage
    this.measureMemoryUsage()

    // Conversion tracking
    this.initializeConversionTracking()
  }

  private measureRenderTime() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.name === 'render-time') {
            this.metrics.renderTime = entry.duration
            this.sendMetricToBackend('renderTime', entry.duration)
          }
        }
      })
      observer.observe({ entryTypes: ['measure'] })
      this.observers.push(observer)
    }
  }

  private measureHydrationTime() {
    // Measure React hydration time
    if ('performance' in window) {
      const hydrationStart = performance.getEntriesByName('hydration-start')[0]
      const hydrationEnd = performance.getEntriesByName('hydration-end')[0]

      if (hydrationStart && hydrationEnd) {
        const hydrationTime = hydrationEnd.startTime - hydrationStart.startTime
        this.metrics.hydrationTime = hydrationTime
        this.sendMetricToBackend('hydrationTime', hydrationTime)
      }
    }
  }

  private measureBundleSize() {
    // Calculate total bundle size from network resources
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      let totalSize = 0

      resources.forEach((resource) => {
        if (resource.transferSize) {
          totalSize += resource.transferSize
        }
      })

      this.metrics.bundleSize = totalSize
      this.sendMetricToBackend('bundleSize', totalSize)
    }
  }

  private measureAPIResponseTime() {
    const originalFetch = window.fetch
    const responseTimes: number[] = []

    window.fetch = async (...args) => {
      const startTime = performance.now()
      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()
        const responseTime = endTime - startTime

        if (args[0]?.toString().includes('/api/')) {
          responseTimes.push(responseTime)

          // Send average response time every 10 API calls
          if (responseTimes.length % 10 === 0) {
            const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            this.metrics.apiResponseTime = avgResponseTime
            this.sendMetricToBackend('apiResponseTime', avgResponseTime)
          }
        }

        return response
      } catch (error) {
        const endTime = performance.now()
        const responseTime = endTime - startTime

        // Log failed API calls
        this.sendMetricToBackend('apiError', responseTime, {
          url: args[0]?.toString(),
          error: error?.message,
        })

        throw error
      }
    }
  }

  private measureImageLoadTime() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource' && entry.initiatorType === 'img') {
            const loadTime = (entry as PerformanceResourceTiming).responseEnd - entry.startTime
            this.sendMetricToBackend('imageLoadTime', loadTime, {
              imageUrl: entry.name,
              imageSize: (entry as PerformanceResourceTiming).transferSize,
            })
          }
        }
      })
      observer.observe({ entryTypes: ['resource'] })
      this.observers.push(observer)
    }
  }

  private measureCachePerformance() {
    if ('PerformanceObserver' in window) {
      let cacheHits = 0
      let totalRequests = 0

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            totalRequests++
            const resource = entry as PerformanceResourceTiming

            // Check if resource was served from cache
            if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
              cacheHits++
            }
          }
        }

        if (totalRequests % 20 === 0) {
          const cacheHitRate = (cacheHits / totalRequests) * 100
          this.metrics.cacheHitRate = cacheHitRate
          this.sendMetricToBackend('cacheHitRate', cacheHitRate)
        }
      })
      observer.observe({ entryTypes: ['resource'] })
      this.observers.push(observer)
    }
  }

  private measureMemoryUsage() {
    if ('memory' in performance) {
      const measureMemory = () => {
        const memory = (performance as any).memory
        const memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize * 100

        this.metrics.memoryUsage = memoryUsage
        this.sendMetricToBackend('memoryUsage', memoryUsage, {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        })
      }

      // Measure memory usage every 30 seconds
      setInterval(measureMemory, 30000)
      measureMemory() // Initial measurement
    }
  }

  private initializeErrorTracking() {
    let errorCount = 0
    let totalInteractions = 0

    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      errorCount++
      this.sendMetricToBackend('jsError', 1, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      errorCount++
      this.sendMetricToBackend('unhandledRejection', 1, {
        reason: event.reason,
      })
    })

    // Track user interactions
    ['click', 'scroll', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        totalInteractions++
      }, { passive: true })
    })

    // Calculate error rate every minute
    setInterval(() => {
      if (totalInteractions > 0) {
        const errorRate = (errorCount / totalInteractions) * 100
        this.metrics.errorRate = errorRate
        this.sendMetricToBackend('errorRate', errorRate)
      }
    }, 60000)
  }

  private initializeResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceResourceTiming[]

        entries.forEach(entry => {
          const timingData = {
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration,
            transferSize: entry.transferSize,
            encodedBodySize: entry.encodedBodySize,
            decodedBodySize: entry.decodedBodySize,
            serverTiming: entry.serverTiming || [],
          }

          this.sendMetricToBackend('resourceTiming', entry.duration, timingData)
        })
      })
      observer.observe({ entryTypes: ['resource'] })
      this.observers.push(observer)
    }
  }

  private initializeConversionTracking() {
    // Track key user conversions
    const conversionEvents = [
      { selector: '[data-conversion="quote-request"]', event: 'quote_request' },
      { selector: '[data-conversion="contact-form"]', event: 'contact_form' },
      { selector: '[data-conversion="phone-call"]', event: 'phone_call' },
      { selector: '[data-conversion="product-view"]', event: 'product_view' },
      { selector: '[data-conversion="cart-add"]', event: 'cart_add' },
    ]

    conversionEvents.forEach(({ selector, event }) => {
      document.addEventListener('click', (e) => {
        const target = e.target as Element
        if (target.matches(selector) || target.closest(selector)) {
          this.trackConversion(event)
        }
      })
    })
  }

  private trackConversion(type: string) {
    this.sendMetricToBackend('conversion', 1, {
      type,
      timestamp: Date.now(),
      page: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    })

    // Update conversion rate
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        event_category: 'Ecommerce',
        event_label: type,
        value: 1,
      })
    }
  }

  // Utility methods
  private getNavigationType(): string {
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return ['navigate', 'reload', 'back_forward', 'prerender'][navigation.type] || 'unknown'
    }
    return 'unknown'
  }

  private getDeviceType(): string {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  private getConnectionType(): string {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      return connection?.effectiveType || 'unknown'
    }
    return 'unknown'
  }

  private async sendMetricToBackend(name: string, value: number, metadata?: any) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          value,
          metadata,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          sessionId: this.getSessionId(),
        }),
      })
    } catch (error) {
      // Silently fail to avoid impacting user experience
      console.warn('Failed to send performance metric:', error)
    }
  }

  private getSessionId(): string {
    const key = 'pgclosets_session_id'
    let sessionId = sessionStorage.getItem(key)
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem(key, sessionId)
    }
    return sessionId
  }

  // Public methods
  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  public getPerformanceScore(): number {
    const weights = {
      cls: 15,
      fid: 15,
      fcp: 15,
      lcp: 25,
      inp: 15,
      ttfb: 15,
    }

    let score = 0
    let totalWeight = 0

    Object.entries(weights).forEach(([metric, weight]) => {
      const value = this.metrics[metric as keyof PerformanceMetrics]
      if (value !== undefined) {
        score += this.getMetricScore(metric, value) * weight
        totalWeight += weight
      }
    })

    return totalWeight > 0 ? Math.round(score / totalWeight) : 0
  }

  private getMetricScore(metric: string, value: number): number {
    const thresholds = {
      cls: { good: 0.1, poor: 0.25 },
      fid: { good: 100, poor: 300 },
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      inp: { good: 200, poor: 500 },
      ttfb: { good: 800, poor: 1800 },
    }

    const threshold = thresholds[metric as keyof typeof thresholds]
    if (!threshold) return 100

    if (value <= threshold.good) return 100
    if (value >= threshold.poor) return 0

    // Linear interpolation between good and poor
    const range = threshold.poor - threshold.good
    const position = (value - threshold.good) / range
    return Math.round(100 * (1 - position))
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitoring()

// Export metrics type for TypeScript usage
export type { PerformanceMetrics }