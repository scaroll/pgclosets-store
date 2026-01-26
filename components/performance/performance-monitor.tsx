"use client"

import { useCallback } from 'react'

// Performance tracking hook
export function usePerformanceTracking() {
  const trackEvent = useCallback((eventName: string, data?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Event:', eventName, data)
    }
  }, [])

  const trackTiming = useCallback((name: string, duration: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Timing:', name, duration + 'ms')
    }
  }, [])

  return { trackEvent, trackTiming }
}

// Performance monitoring component - placeholder
export default function PerformanceMonitor() {
  return null
}
