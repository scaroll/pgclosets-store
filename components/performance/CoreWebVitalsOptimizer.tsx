'use client'

import { useEffect, useRef, useState } from 'react'

interface WebVitalsMetrics {
  lcp: number | null
  fid: number | null
  cls: number | null
  fcp: number | null
  ttfb: number | null
}

interface CoreWebVitalsOptimizerProps {
  enableMonitoring?: boolean
  reportingEndpoint?: string
  onMetricUpdate?: (metrics: WebVitalsMetrics) => void
}

/**
 * Advanced Core Web Vitals optimization and monitoring
 */
export function CoreWebVitalsOptimizer({
  enableMonitoring = true,
  reportingEndpoint,
  onMetricUpdate
}: CoreWebVitalsOptimizerProps) {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  })

  const metricsRef = useRef(metrics)
  const observerRef = useRef<any>(null)

  useEffect(() => {
    metricsRef.current = metrics
  }, [metrics])

  useEffect(() => {
    if (!enableMonitoring || typeof window === 'undefined') return

    // Initialize performance monitoring
    initializePerformanceMonitoring()

    // Initialize layout shift observer
    initializeLayoutShiftObserver()

    // Initialize first input delay observer
    initializeFirstInputDelayObserver()

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [enableMonitoring])

  const initializePerformanceMonitoring = () => {
    // Performance Observer for navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            const ttfb = entry.responseStart - entry.requestStart
            updateMetric('ttfb', ttfb)
          }
        })
      })

      navObserver.observe({ entryTypes: ['navigation'] })

      // Performance Observer for paint timing
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            updateMetric('fcp', entry.startTime)
          }
        })
      })

      paintObserver.observe({ entryTypes: ['paint'] })

      // Performance Observer for largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          updateMetric('lcp', lastEntry.startTime)
        }
      })

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    }
  }

  const initializeLayoutShiftObserver = () => {
    if (!('PerformanceObserver' in window)) return

    let clsValue = 0
    observerRef.current = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          updateMetric('cls', clsValue)
        }
      })
    })

    observerRef.current.observe({ entryTypes: ['layout-shift'] })
  }

  const initializeFirstInputDelayObserver = () => {
    if (!('PerformanceObserver' in window)) return

    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (entry.entryType === 'first-input') {
          updateMetric('fid', entry.processingStart - entry.startTime)
        }
      })
    })

    fidObserver.observe({ entryTypes: ['first-input'] })
  }

  const updateMetric = (metricName: keyof WebVitalsMetrics, value: number) => {
    const updatedMetrics = { ...metricsRef.current, [metricName]: value }
    setMetrics(updatedMetrics)
    onMetricUpdate?.(updatedMetrics)

    // Log performance warnings
    logPerformanceWarnings(metricName, value)

    // Send metrics to analytics endpoint
    if (reportingEndpoint) {
      sendMetricsToAnalytics(metricName, value)
    }
  }

  const logPerformanceWarnings = (metricName: string, value: number) => {
    const thresholds = {
      lcp: 2500,  // Good: <2.5s
      fid: 100,   // Good: <100ms
      cls: 0.1,   // Good: <0.1
      fcp: 1800,  // Good: <1.8s
      ttfb: 800   // Good: <800ms
    }

    const threshold = thresholds[metricName as keyof typeof thresholds]
    if (value > threshold) {
      console.warn(`⚠️ Performance warning: ${metricName.toUpperCase()} (${value.toFixed(2)}) exceeds threshold (${threshold})`)
    }
  }

  const sendMetricsToAnalytics = (metricName: string, value: number) => {
    if (typeof window === 'undefined' || !reportingEndpoint) return

    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metricName,
        value: Math.round(value),
        non_interaction: true
      })
    }

    // Send to custom endpoint
    fetch(reportingEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        metric: metricName,
        value,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }),
      keepalive: true
    }).catch(error => {
      console.error('Failed to send performance metrics:', error)
    })
  }

  return null // This component doesn't render anything visible
}

// React component for performance optimization utilities
export function PerformanceUtilities() {
  useEffect(() => {
    // Preload critical resources
    preloadCriticalResources()

    // Optimize font loading
    optimizeFontLoading()

    // Implement resource hints
    addResourceHints()

    // Set up service worker for caching
    setupServiceWorker()
  }, [])

  const preloadCriticalResources = () => {
    // Preload critical images
    const criticalImages = [
      '/images/elegant-barn-door-closet.webp',
      '/images/luxury-modern-walk-in-closet.webp'
    ]

    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }

  const optimizeFontLoading = () => {
    // Add font display swap optimization
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
        src: url('/fonts/inter-regular.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Playfair Display';
        font-display: swap;
        src: url('/fonts/playfair-regular.woff2') format('woff2');
      }
    `
    document.head.appendChild(style)
  }

  const addResourceHints = () => {
    // DNS prefetch for external domains
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com'
    ]

    domains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })

    // Preconnect for critical domains
    const preconnectDomains = [
      'https://fonts.gstatic.com'
    ]

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }

  const setupServiceWorker = () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }

  return null
}

// Hook for using performance metrics
export function useWebVitals() {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  })

  const updateMetrics = (newMetrics: WebVitalsMetrics) => {
    setMetrics(newMetrics)
  }

  return { metrics, updateMetrics }
}

export default CoreWebVitalsOptimizer