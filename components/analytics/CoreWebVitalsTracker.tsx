"use client"

/**
 * Core Web Vitals Tracker - Phase 6
 *
 * Automatically tracks Core Web Vitals and sends to GA4:
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay) / INP (Interaction to Next Paint)
 * - CLS (Cumulative Layout Shift)
 * - TTFB (Time to First Byte)
 *
 * Uses web-vitals library for accurate measurements.
 */

import { useEffect } from 'react'
import { trackCoreWebVitals } from '@/lib/analytics/enhanced-tracking'

// Thresholds for rating metrics
const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
}

function getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop'
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

function getPageType(): string {
  if (typeof window === 'undefined') return 'unknown'
  const path = window.location.pathname
  if (path === '/') return 'homepage'
  if (path.includes('/collections/')) return 'collection'
  if (path.includes('/products/')) return 'pdp'
  if (path.includes('/instant-estimate')) return 'estimator'
  return 'other'
}

export function CoreWebVitalsTracker() {
  useEffect(() => {
    // Only track in browser environment
    if (typeof window === 'undefined') return

    const deviceType = getDeviceType()
    const pageType = getPageType()

    // Track using Performance Observer API (native browser API)
    // More reliable than web-vitals library for production

    // Track FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')

      if (fcpEntry) {
        const fcpValue = fcpEntry.startTime
        trackCoreWebVitals({
          metric_name: 'FCP',
          metric_value: fcpValue,
          metric_rating: getRating('FCP', fcpValue),
          page_type: pageType,
          device_type: deviceType,
        })
        fcpObserver.disconnect()
      }
    })

    try {
      fcpObserver.observe({ entryTypes: ['paint'] })
    } catch (e) {
      console.warn('[Analytics] FCP tracking not supported')
    }

    // Track LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1] as any

      if (lastEntry) {
        const lcpValue = lastEntry.startTime
        trackCoreWebVitals({
          metric_name: 'LCP',
          metric_value: lcpValue,
          metric_rating: getRating('LCP', lcpValue),
          page_type: pageType,
          device_type: deviceType,
        })
      }
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.warn('[Analytics] LCP tracking not supported')
    }

    // Track FID (First Input Delay)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry: any) => {
        const fidValue = entry.processingStart - entry.startTime
        trackCoreWebVitals({
          metric_name: 'FID',
          metric_value: fidValue,
          metric_rating: getRating('FID', fidValue),
          page_type: pageType,
          device_type: deviceType,
        })
      })
      fidObserver.disconnect()
    })

    try {
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      console.warn('[Analytics] FID tracking not supported')
    }

    // Track CLS (Cumulative Layout Shift)
    let clsValue = 0
    let clsEntries: any[] = []

    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          clsEntries.push(entry)
        }
      }
    })

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('[Analytics] CLS tracking not supported')
    }

    // Report CLS on page visibility change or after 5 seconds
    const reportCLS = () => {
      if (clsEntries.length > 0) {
        trackCoreWebVitals({
          metric_name: 'CLS',
          metric_value: clsValue,
          metric_rating: getRating('CLS', clsValue),
          page_type: pageType,
          device_type: deviceType,
        })
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportCLS()
      }
    })

    setTimeout(reportCLS, 5000) // Also report after 5 seconds

    // Track TTFB (Time to First Byte)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      const ttfbValue = navigationEntry.responseStart - navigationEntry.requestStart

      trackCoreWebVitals({
        metric_name: 'TTFB',
        metric_value: ttfbValue,
        metric_rating: getRating('TTFB', ttfbValue),
        page_type: pageType,
        device_type: deviceType,
      })
    }

    // Track INP (Interaction to Next Paint) - Chrome 96+
    if ('PerformanceEventTiming' in window) {
      const inpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as any[]
        entries.forEach((entry) => {
          if (entry.processingStart && entry.processingEnd) {
            const inpValue = entry.processingEnd - entry.startTime
            trackCoreWebVitals({
              metric_name: 'INP',
              metric_value: inpValue,
              metric_rating: getRating('INP', inpValue),
              page_type: pageType,
              device_type: deviceType,
            })
          }
        })
      })

      try {
        inpObserver.observe({ entryTypes: ['event'] })
      } catch (e) {
        console.warn('[Analytics] INP tracking not supported')
      }
    }

    // Cleanup
    return () => {
      try {
        fcpObserver.disconnect()
        lcpObserver.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
      } catch (e) {
        // Observers may already be disconnected
      }
    }
  }, [])

  // This component doesn't render anything
  return null
}
