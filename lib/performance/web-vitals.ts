/**
 * Web Vitals Tracking
 *
 * Monitors and reports Core Web Vitals (LCP, CLS, INP, FCP)
 * to analytics for performance monitoring.
 */

import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from 'web-vitals'
import { trackEvent, trackTiming } from '@/lib/analytics/gtm'

/**
 * Web Vitals thresholds for rating
 */
const THRESHOLDS = {
  LCP: {
    good: 2200,      // ≤ 2.2s
    poor: 4000,      // > 4s
  },
  CLS: {
    good: 0.1,       // ≤ 0.1
    poor: 0.25,      // > 0.25
  },
  INP: {
    good: 200,       // ≤ 200ms
    poor: 500,       // > 500ms
  },
  FCP: {
    good: 1500,      // ≤ 1.5s
    poor: 3000,      // > 3s
  },
  TTFB: {
    good: 600,       // ≤ 600ms
    poor: 1800,      // > 1.8s
  },
} as const

/**
 * Get rating based on metric value and thresholds
 */
function getRating(
  metricName: keyof typeof THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Send metric to analytics
 */
function sendToAnalytics(metric: Metric) {
  const { name, value, delta, id, navigationType } = metric

  // Get rating
  const rating = getRating(name as keyof typeof THRESHOLDS, value)

  // Track as web vitals event
  trackEvent('web_vitals', {
    metric_name: name,
    value: Math.round(value),
    delta: Math.round(delta),
    metric_id: id,
    metric_rating: rating,
    navigation_type: navigationType,
    event_category: 'Web Vitals',
  })

  // Also track as user timing for additional visibility
  trackTiming({
    name: `web_vitals_${name.toLowerCase()}`,
    value: Math.round(value),
    category: 'Web Vitals',
    label: rating,
  })

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(value),
      rating,
      delta: Math.round(delta),
      id,
    })
  }

  // Alert if metric is poor
  if (rating === 'poor') {
    console.warn(
      `[Web Vitals] Poor ${name}: ${Math.round(value)} (threshold: ${
        THRESHOLDS[name as keyof typeof THRESHOLDS].poor
      })`
    )
  }
}

/**
 * Initialize Web Vitals tracking
 * Call this once in your app layout or root component
 */
export function reportWebVitals() {
  // Only track in browser
  if (typeof window === 'undefined') return

  // Track Largest Contentful Paint (LCP)
  onLCP(sendToAnalytics, { reportAllChanges: false })

  // Track Cumulative Layout Shift (CLS)
  onCLS(sendToAnalytics, { reportAllChanges: false })

  // Track Interaction to Next Paint (INP)
  onINP(sendToAnalytics, { reportAllChanges: false })

  // Track First Contentful Paint (FCP)
  onFCP(sendToAnalytics, { reportAllChanges: false })

  // Track Time to First Byte (TTFB)
  onTTFB(sendToAnalytics, { reportAllChanges: false })

  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals] Tracking initialized')
  }
}

/**
 * Get current Web Vitals metrics
 * Useful for debugging or displaying performance data
 */
export async function getCurrentWebVitals(): Promise<{
  lcp: number | null
  cls: number | null
  inp: number | null
  fcp: number | null
  ttfb: number | null
}> {
  return new Promise((resolve) => {
    const metrics = {
      lcp: null as number | null,
      cls: null as number | null,
      inp: null as number | null,
      fcp: null as number | null,
      ttfb: null as number | null,
    }

    let count = 0
    const expectedMetrics = 5

    const checkComplete = () => {
      count++
      if (count === expectedMetrics) {
        resolve(metrics)
      }
    }

    onLCP((metric) => {
      metrics.lcp = Math.round(metric.value)
      checkComplete()
    })

    onCLS((metric) => {
      metrics.cls = Math.round(metric.value * 1000) / 1000
      checkComplete()
    })

    onINP((metric) => {
      metrics.inp = Math.round(metric.value)
      checkComplete()
    })

    onFCP((metric) => {
      metrics.fcp = Math.round(metric.value)
      checkComplete()
    })

    onTTFB((metric) => {
      metrics.ttfb = Math.round(metric.value)
      checkComplete()
    })

    // Timeout after 5 seconds
    setTimeout(() => {
      resolve(metrics)
    }, 5000)
  })
}

/**
 * Create a performance observer for custom metrics
 */
export function observePerformance(
  entryType: string,
  callback: (entry: PerformanceEntry) => void
) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        callback(entry)
      }
    })

    observer.observe({ entryTypes: [entryType] })

    return observer
  } catch (error) {
    console.error('[Performance Observer] Error:', error)
    return null
  }
}

/**
 * Track custom performance timing
 */
export function trackCustomTiming(
  name: string,
  startMark: string,
  endMark: string
) {
  if (typeof window === 'undefined' || !performance.mark) return

  try {
    performance.mark(endMark)
    performance.measure(name, startMark, endMark)

    const measure = performance.getEntriesByName(name)[0]
    if (measure) {
      trackTiming({
        name,
        value: Math.round(measure.duration),
        category: 'Custom Timing',
      })

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Custom Timing] ${name}: ${Math.round(measure.duration)}ms`)
      }
    }
  } catch (error) {
    console.error('[Custom Timing] Error:', error)
  }
}

/**
 * Start a custom performance measurement
 */
export function startPerformanceMeasure(name: string) {
  if (typeof window === 'undefined' || !performance.mark) return

  try {
    performance.mark(`${name}-start`)
  } catch (error) {
    console.error('[Performance Mark] Error:', error)
  }
}

/**
 * End a custom performance measurement and track it
 */
export function endPerformanceMeasure(name: string) {
  if (typeof window === 'undefined' || !performance.mark) return

  try {
    trackCustomTiming(name, `${name}-start`, `${name}-end`)
  } catch (error) {
    console.error('[Performance Measure] Error:', error)
  }
}

/**
 * Clear performance marks and measures
 */
export function clearPerformanceMarks(name?: string) {
  if (typeof window === 'undefined') return

  try {
    if (name) {
      performance.clearMarks(name)
      performance.clearMeasures(name)
    } else {
      performance.clearMarks()
      performance.clearMeasures()
    }
  } catch (error) {
    console.error('[Performance Clear] Error:', error)
  }
}

/**
 * Get all performance entries
 */
export function getPerformanceEntries() {
  if (typeof window === 'undefined') return []

  return performance.getEntries()
}

/**
 * Get resource timing entries
 */
export function getResourceTimings() {
  if (typeof window === 'undefined') return []

  return performance.getEntriesByType('resource') as PerformanceResourceTiming[]
}

/**
 * Get navigation timing
 */
export function getNavigationTiming() {
  if (typeof window === 'undefined') return null

  const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
  return entry || null
}

/**
 * Calculate and track page load metrics
 */
export function trackPageLoadMetrics() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    setTimeout(() => {
      const navTiming = getNavigationTiming()
      if (!navTiming) return

      // Calculate metrics
      const pageLoadTime = navTiming.loadEventEnd - navTiming.fetchStart
      const domContentLoadedTime = navTiming.domContentLoadedEventEnd - navTiming.fetchStart
      const domInteractive = navTiming.domInteractive - navTiming.fetchStart
      const dnsTime = navTiming.domainLookupEnd - navTiming.domainLookupStart
      const tcpTime = navTiming.connectEnd - navTiming.connectStart
      const responseTime = navTiming.responseEnd - navTiming.requestStart

      // Track metrics
      trackTiming({
        name: 'page_load_time',
        value: Math.round(pageLoadTime),
        category: 'Navigation Timing',
      })

      trackTiming({
        name: 'dom_content_loaded',
        value: Math.round(domContentLoadedTime),
        category: 'Navigation Timing',
      })

      trackTiming({
        name: 'dom_interactive',
        value: Math.round(domInteractive),
        category: 'Navigation Timing',
      })

      trackTiming({
        name: 'dns_time',
        value: Math.round(dnsTime),
        category: 'Network Timing',
      })

      trackTiming({
        name: 'tcp_time',
        value: Math.round(tcpTime),
        category: 'Network Timing',
      })

      trackTiming({
        name: 'response_time',
        value: Math.round(responseTime),
        category: 'Network Timing',
      })

      if (process.env.NODE_ENV === 'development') {
        console.log('[Page Load Metrics]', {
          pageLoadTime: Math.round(pageLoadTime),
          domContentLoadedTime: Math.round(domContentLoadedTime),
          domInteractive: Math.round(domInteractive),
        })
      }
    }, 0)
  })
}
