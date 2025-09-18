"use client"

import { useEffect } from "react"
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals"

interface VitalMetric {
  name: string
  value: number
  delta: number
  id: string
  rating: 'good' | 'needs-improvement' | 'poor'
}

interface PerformanceData extends VitalMetric {
  timestamp: number
  url: string
  connection?: string
  deviceType?: string
}

// Core Web Vitals thresholds
const VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 }
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS]
  if (!thresholds) return 'good'

  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown'

  const userAgent = navigator.userAgent
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

function getConnectionType(): string {
  if (typeof window === 'undefined') return 'unknown'

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  if (connection) {
    return connection.effectiveType || connection.type || 'unknown'
  }
  return 'unknown'
}

function sendVitalToAnalytics(data: PerformanceData) {
  // Send to multiple analytics platforms

  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', 'web_vitals', {
      metric_name: data.name,
      metric_value: Math.round(data.value),
      metric_rating: data.rating,
      metric_delta: Math.round(data.delta),
      metric_id: data.id,
      device_type: data.deviceType,
      connection_type: data.connection,
      page_url: data.url
    })
  }

  // Vercel Analytics
  if (typeof window !== 'undefined' && (window as any).va) {
    ;(window as any).va('track', 'WebVital', {
      name: data.name,
      value: data.value,
      rating: data.rating,
      deviceType: data.deviceType,
      connection: data.connection
    })
  }

  // PostHog (if available)
  if (typeof window !== 'undefined' && (window as any).posthog) {
    ;(window as any).posthog.capture('web_vital', {
      metric_name: data.name,
      metric_value: data.value,
      metric_rating: data.rating,
      device_type: data.deviceType,
      connection_type: data.connection
    })
  }

  // Console logging in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`🏎️ Web Vital: ${data.name}`)
    console.log(`Value: ${Math.round(data.value)}ms`)
    console.log(`Rating: ${data.rating}`)
    console.log(`Device: ${data.deviceType}`)
    console.log(`Connection: ${data.connection}`)
    console.groupEnd()
  }
}

// Resource timing monitoring
function monitorResourceTiming() {
  if (typeof window === 'undefined' || !window.performance) return

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        const resource = entry as PerformanceResourceTiming

        // Monitor slow resources (> 2s)
        if (resource.duration > 2000) {
          console.warn('🐌 Slow resource detected:', {
            name: resource.name,
            duration: Math.round(resource.duration),
            size: resource.transferSize,
            type: resource.initiatorType
          })

          // Send slow resource data to analytics
          if (typeof window !== 'undefined' && (window as any).gtag) {
            ;(window as any).gtag('event', 'slow_resource', {
              resource_name: resource.name,
              resource_duration: Math.round(resource.duration),
              resource_size: resource.transferSize,
              resource_type: resource.initiatorType
            })
          }
        }
      }
    }
  })

  observer.observe({ entryTypes: ['resource'] })
}

// Layout shift monitoring for images
function monitorLayoutShifts() {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
        const layoutShift = entry as PerformanceEntry & {
          value: number
          sources?: Array<{ node?: Element }>
        }

        if (layoutShift.value > 0.1) {
          console.warn('📐 Large layout shift detected:', {
            value: layoutShift.value,
            sources: layoutShift.sources?.map(source => source.node?.tagName).join(', ')
          })
        }
      }
    }
  })

  observer.observe({ entryTypes: ['layout-shift'] })
}

// Long task monitoring
function monitorLongTasks() {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'longtask') {
        console.warn('⏱️ Long task detected:', {
          duration: Math.round(entry.duration),
          startTime: Math.round(entry.startTime)
        })

        // Send long task data to analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          ;(window as any).gtag('event', 'long_task', {
            task_duration: Math.round(entry.duration),
            task_start_time: Math.round(entry.startTime)
          })
        }
      }
    }
  })

  try {
    observer.observe({ entryTypes: ['longtask'] })
  } catch (e) {
    // Long tasks not supported in this browser
  }
}

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const deviceType = getDeviceType()
    const connection = getConnectionType()
    const url = window.location.href

    // Core Web Vitals monitoring
    onLCP((metric) => {
      sendVitalToAnalytics({
        ...metric,
        timestamp: Date.now(),
        url,
        deviceType,
        connection,
        rating: getRating('LCP', metric.value)
      })
    })

    // FID is deprecated, using INP instead
    onINP((metric) => {
      sendVitalToAnalytics({
        ...metric,
        timestamp: Date.now(),
        url,
        deviceType,
        connection,
        rating: getRating('INP', metric.value)
      })
    })

    onCLS((metric) => {
      sendVitalToAnalytics({
        ...metric,
        timestamp: Date.now(),
        url,
        deviceType,
        connection,
        rating: getRating('CLS', metric.value)
      })
    })

    onFCP((metric) => {
      sendVitalToAnalytics({
        ...metric,
        timestamp: Date.now(),
        url,
        deviceType,
        connection,
        rating: getRating('FCP', metric.value)
      })
    })

    onTTFB((metric) => {
      sendVitalToAnalytics({
        ...metric,
        timestamp: Date.now(),
        url,
        deviceType,
        connection,
        rating: getRating('TTFB', metric.value)
      })
    })

    // Additional monitoring
    monitorResourceTiming()
    monitorLayoutShifts()
    monitorLongTasks()

    // Memory usage monitoring (if available)
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn('🧠 High memory usage detected:', {
            used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
          })
        }
      }, 30000) // Check every 30 seconds
    }

    // Page load timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
          console.log('📄 Page load complete:', {
            totalTime: Math.round(pageLoadTime),
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            domInteractive: Math.round(navigation.domInteractive - navigation.fetchStart)
          })

          // Send page load timing to analytics
          if (typeof window !== 'undefined' && (window as any).gtag) {
            ;(window as any).gtag('event', 'page_timing', {
              page_load_time: Math.round(pageLoadTime),
              dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
              dom_interactive: Math.round(navigation.domInteractive - navigation.fetchStart)
            })
          }
        }
      }, 0)
    })

    // Log initial page info
    console.log('🚀 Performance monitoring initialized:', {
      deviceType,
      connection,
      url,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent.substring(0, 50) + '...'
    })

  }, [])

  // This component doesn't render anything
  return null
}

// Hook for manual performance tracking
export function usePerformanceTracking() {
  const trackEvent = (eventName: string, duration: number, metadata?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'performance_event', {
        event_name: eventName,
        event_duration: Math.round(duration),
        ...metadata
      })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ Performance Event: ${eventName}`, {
        duration: Math.round(duration),
        ...metadata
      })
    }
  }

  const markStart = (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${name}-start`)
    }
  }

  const markEnd = (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${name}-end`)
      try {
        performance.measure(name, `${name}-start`, `${name}-end`)
        const measure = performance.getEntriesByName(name, 'measure')[0]
        trackEvent(name, measure.duration)
      } catch (e) {
        console.warn('Performance measurement failed:', e)
      }
    }
  }

  return { trackEvent, markStart, markEnd }
}