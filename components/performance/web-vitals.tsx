"use client"

import { useEffect } from 'react'
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals'

// Performance monitoring and Core Web Vitals tracking
export function WebVitals() {
  useEffect(() => {
    function sendToAnalytics(metric: any) {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric)
      }

      // Send to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
          custom_parameter_1: Math.round(metric.value),
          custom_parameter_2: metric.id,
        })
      }

      // You can also send to other analytics services here
      // Example: sending to a custom API
      if (typeof window !== 'undefined' && window.fetch) {
        fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(metric),
          keepalive: true
        }).catch(console.error)
      }
    }

    // Track all Core Web Vitals
    onCLS(sendToAnalytics)  // Cumulative Layout Shift
    onFCP(sendToAnalytics)  // First Contentful Paint
    onLCP(sendToAnalytics)  // Largest Contentful Paint
    onTTFB(sendToAnalytics) // Time to First Byte

    // Additional performance monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor page load times
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (perfData) {
          const metrics = {
            dns: perfData.domainLookupEnd - perfData.domainLookupStart,
            tcp: perfData.connectEnd - perfData.connectStart,
            request: perfData.responseStart - perfData.requestStart,
            response: perfData.responseEnd - perfData.responseStart,
            dom: perfData.domContentLoadedEventEnd - perfData.responseEnd,
            total: perfData.loadEventEnd - perfData.navigationStart
          }
          
          console.log('Performance Metrics:', metrics)
          
          // Send to analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_metrics', {
              dns_time: Math.round(metrics.dns),
              tcp_time: Math.round(metrics.tcp),
              request_time: Math.round(metrics.request),
              response_time: Math.round(metrics.response),
              dom_time: Math.round(metrics.dom),
              total_time: Math.round(metrics.total)
            })
          }
        }
      })

      // Monitor resource loading
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming
            
            // Track slow resources (>1s)
            if (resourceEntry.duration > 1000) {
              console.warn('Slow resource detected:', {
                name: resourceEntry.name,
                duration: resourceEntry.duration,
                type: resourceEntry.initiatorType
              })
            }
          }
        }
      })
      
      observer.observe({ entryTypes: ['resource'] })
    }
  }, [])

  return null // This component doesn't render anything
}

// Performance budget monitoring
export function PerformanceBudget() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkBudget = () => {
      // Check bundle size via performance.timing
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (!nav) return

      const transferSize = nav.transferSize || 0
      const encodedBodySize = nav.encodedBodySize || 0
      
      // Performance budgets
      const budgets = {
        initialLoad: 2000, // 2s for initial load
        transferSize: 500000, // 500KB transfer size
        encodedBodySize: 1000000 // 1MB encoded size
      }

      // Check against budgets
      if (nav.loadEventEnd - nav.navigationStart > budgets.initialLoad) {
        console.warn(`Performance Budget Exceeded: Load time ${nav.loadEventEnd - nav.navigationStart}ms > ${budgets.initialLoad}ms`)
      }

      if (transferSize > budgets.transferSize) {
        console.warn(`Performance Budget Exceeded: Transfer size ${transferSize} > ${budgets.transferSize}`)
      }

      if (encodedBodySize > budgets.encodedBodySize) {
        console.warn(`Performance Budget Exceeded: Encoded body size ${encodedBodySize} > ${budgets.encodedBodySize}`)
      }
    }

    window.addEventListener('load', checkBudget)
    return () => window.removeEventListener('load', checkBudget)
  }, [])

  return null
}

// Image performance monitoring
export function ImagePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource' && (entry as PerformanceResourceTiming).initiatorType === 'img') {
          const imgEntry = entry as PerformanceResourceTiming
          
          // Track large images (>100KB)
          if (imgEntry.transferSize && imgEntry.transferSize > 100000) {
            console.warn('Large image detected:', {
              url: imgEntry.name,
              size: imgEntry.transferSize,
              loadTime: imgEntry.duration
            })
          }

          // Track slow loading images (>2s)
          if (imgEntry.duration > 2000) {
            console.warn('Slow image loading:', {
              url: imgEntry.name,
              loadTime: imgEntry.duration
            })
          }
        }
      }
    })

    observer.observe({ entryTypes: ['resource'] })

    return () => observer.disconnect()
  }, [])

  return null
}