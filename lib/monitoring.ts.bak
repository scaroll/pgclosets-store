"use client"

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Track page load performance
  trackPageLoad(pageName: string) {
    if (typeof window === 'undefined') return

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (!navigation) return

    const metrics = {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint(),
      largestContentfulPaint: this.getLargestContentfulPaint(),
      totalLoadTime: navigation.loadEventEnd - navigation.startTime,
      networkTime: navigation.responseEnd - navigation.requestStart,
      renderTime: navigation.loadEventEnd - navigation.responseEnd,
    }

    // Store metrics
    Object.entries(metrics).forEach(([key, value]) => {
      if (value > 0) {
        const metricKey = `${pageName}.${key}`
        if (!this.metrics.has(metricKey)) {
          this.metrics.set(metricKey, [])
        }
        this.metrics.get(metricKey)!.push(value)
      }
    })

    // Report to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance metrics for ${pageName}:`, metrics)
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && window.gtag) {
      window.gtag('event', 'page_load_performance', {
        event_category: 'Performance',
        page_name: pageName,
        load_time: Math.round(metrics.totalLoadTime),
        first_contentful_paint: Math.round(metrics.firstContentfulPaint || 0),
        largest_contentful_paint: Math.round(metrics.largestContentfulPaint || 0),
      })
    }
  }

  // Track user interactions
  trackInteraction(action: string, element: string, duration?: number) {
    if (typeof window === 'undefined') return

    const metric = {
      action,
      element,
      duration,
      timestamp: Date.now(),
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Interaction tracked:', metric)
    }

    if (process.env.NODE_ENV === 'production' && window.gtag) {
      window.gtag('event', 'user_interaction', {
        event_category: 'Interaction',
        action,
        element,
        duration: duration ? Math.round(duration) : undefined,
      })
    }
  }

  // Track conversion events
  trackConversion(event: string, value?: number, currency = 'CAD') {
    if (typeof window === 'undefined') return

    if (process.env.NODE_ENV === 'development') {
      console.log('Conversion tracked:', { event, value, currency })
    }

    if (process.env.NODE_ENV === 'production' && window.gtag) {
      window.gtag('event', 'conversion', {
        event_category: 'Ecommerce',
        event_label: event,
        value: value || 0,
        currency,
      })
    }
  }

  // Get performance insights
  getInsights(pageName?: string): Record<string, any> {
    const insights: Record<string, any> = {}

    this.metrics.forEach((values, key) => {
      if (!pageName || key.startsWith(pageName)) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length
        const min = Math.min(...values)
        const max = Math.max(...values)
        const p95 = this.percentile(values, 0.95)

        insights[key] = {
          average: Math.round(avg),
          min: Math.round(min),
          max: Math.round(max),
          p95: Math.round(p95),
          samples: values.length,
        }
      }
    })

    return insights
  }

  private getFirstPaint(): number {
    const entries = performance.getEntriesByName('first-paint')
    return entries.length > 0 ? entries[0].startTime : 0
  }

  private getFirstContentfulPaint(): number {
    const entries = performance.getEntriesByName('first-contentful-paint')
    return entries.length > 0 ? entries[0].startTime : 0
  }

  private getLargestContentfulPaint(): number {
    return new Promise<number>((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
          observer.disconnect()
        })
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
        
        // Timeout after 10 seconds
        setTimeout(() => {
          observer.disconnect()
          resolve(0)
        }, 10000)
      } else {
        resolve(0)
      }
    }) as any
  }

  private percentile(values: number[], percentile: number): number {
    const sorted = values.slice().sort((a, b) => a - b)
    const index = Math.ceil(sorted.length * percentile) - 1
    return sorted[index] || 0
  }
}

// Uptime monitoring
export class UptimeMonitor {
  private static checkInterval: NodeJS.Timeout | null = null
  private static isMonitoring = false

  static startMonitoring(intervalMs = 60000) {
    if (this.isMonitoring) return

    this.isMonitoring = true
    this.checkInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/health', {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' }
        })

        const data = await response.json()
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Health check:', data)
        }

        // In production, you could send this to a monitoring service
        if (process.env.NODE_ENV === 'production' && !response.ok) {
          console.error('Health check failed:', data)
          // Send alert to monitoring service
        }
      } catch (error) {
        console.error('Health check error:', error)
        // Send alert to monitoring service
      }
    }, intervalMs)
  }

  static stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
    this.isMonitoring = false
  }
}

// Error rate tracking
export class ErrorRateTracker {
  private static errors: Array<{ timestamp: number; error: string }> = []
  private static pageViews = 0

  static recordError(error: string) {
    this.errors.push({
      timestamp: Date.now(),
      error,
    })

    // Keep only last 1000 errors
    if (this.errors.length > 1000) {
      this.errors = this.errors.slice(-1000)
    }
  }

  static recordPageView() {
    this.pageViews++
  }

  static getErrorRate(timeWindowMs = 3600000): number {
    const now = Date.now()
    const recentErrors = this.errors.filter(
      error => now - error.timestamp < timeWindowMs
    )
    
    return this.pageViews > 0 ? recentErrors.length / this.pageViews : 0
  }

  static getErrorStats(timeWindowMs = 3600000) {
    const now = Date.now()
    const recentErrors = this.errors.filter(
      error => now - error.timestamp < timeWindowMs
    )

    const errorCounts: Record<string, number> = {}
    recentErrors.forEach(({ error }) => {
      errorCounts[error] = (errorCounts[error] || 0) + 1
    })

    return {
      totalErrors: recentErrors.length,
      errorRate: this.getErrorRate(timeWindowMs),
      mostCommonErrors: Object.entries(errorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      timeWindow: timeWindowMs,
    }
  }
}

// User experience monitoring
export class UXMonitor {
  static trackUserJourney(step: string, metadata?: Record<string, any>) {
    const journey = {
      step,
      timestamp: Date.now(),
      metadata,
      url: typeof window !== 'undefined' ? window.location.href : '',
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('User journey:', journey)
    }

    // Store in sessionStorage for journey analysis
    if (typeof window !== 'undefined') {
      const existingJourney = JSON.parse(
        sessionStorage.getItem('userJourney') || '[]'
      )
      existingJourney.push(journey)
      
      // Keep only last 50 steps
      if (existingJourney.length > 50) {
        existingJourney.splice(0, existingJourney.length - 50)
      }
      
      sessionStorage.setItem('userJourney', JSON.stringify(existingJourney))
    }

    // Send to analytics
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'user_journey', {
        event_category: 'UX',
        event_label: step,
        ...metadata,
      })
    }
  }

  static getUserJourney(): Array<any> {
    if (typeof window === 'undefined') return []
    return JSON.parse(sessionStorage.getItem('userJourney') || '[]')
  }

  static trackFormAbandonment(formName: string, fieldName: string, value: string) {
    this.trackUserJourney('form_abandonment', {
      form: formName,
      field: fieldName,
      value_length: value.length,
      filled_fields: document.querySelectorAll(`form[name="${formName}"] input:not([value=""])`).length,
    })
  }

  static trackScrollDepth(depth: number) {
    // Track scroll depth at 25%, 50%, 75%, 100%
    const thresholds = [25, 50, 75, 100]
    const threshold = thresholds.find(t => depth >= t && depth < t + 5)
    
    if (threshold) {
      this.trackUserJourney('scroll_depth', {
        depth: threshold,
        url: window.location.pathname,
      })
    }
  }
}

// Global monitoring initialization
export function initializeMonitoring() {
  if (typeof window === 'undefined') return

  const monitor = PerformanceMonitor.getInstance()
  
  // Track page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      monitor.trackPageLoad(window.location.pathname)
      ErrorRateTracker.recordPageView()
    }, 100)
  })

  // Track scroll depth
  let maxScroll = 0
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    )
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent
      UXMonitor.trackScrollDepth(scrollPercent)
    }
  })

  // Track clicks
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const element = target.tagName.toLowerCase()
    const action = target.getAttribute('data-action') || 'click'
    
    monitor.trackInteraction(action, element)
  })

  // Start uptime monitoring in production
  if (process.env.NODE_ENV === 'production') {
    UptimeMonitor.startMonitoring(300000) // Every 5 minutes
  }

  // Track unhandled errors
  window.addEventListener('error', (event) => {
    ErrorRateTracker.recordError(event.error?.message || 'Unknown error')
  })

  window.addEventListener('unhandledrejection', (event) => {
    ErrorRateTracker.recordError(event.reason?.message || 'Unhandled promise rejection')
  })
}

// Export instances
export const performanceMonitor = PerformanceMonitor.getInstance()