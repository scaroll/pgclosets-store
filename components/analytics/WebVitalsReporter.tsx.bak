/**
 * Web Vitals Reporter Component
 *
 * Client component that initializes Web Vitals tracking.
 * Should be included in the root layout to monitor performance.
 */

'use client'

import { useEffect } from 'react'
import { reportWebVitals, trackPageLoadMetrics } from '@/lib/performance/web-vitals'

export function WebVitalsReporter() {
  useEffect(() => {
    // Initialize Web Vitals tracking
    reportWebVitals()

    // Track page load metrics
    trackPageLoadMetrics()

    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals Reporter] Initialized')
    }
  }, [])

  return null
}
