'use client'

import { useEffect, useCallback, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { ga4, type ProductItem } from '@/lib/analytics/ga4-events'
import { useCookiePreferences } from '@/components/analytics/cookie-consent'

interface UseAnalyticsOptions {
  enableScrollTracking?: boolean
  enableFormTracking?: boolean
  enablePerformanceTracking?: boolean
  scrollThreshold?: number[]
  debug?: boolean
}

interface FormTrackingData {
  formName: string
  formElement: HTMLFormElement
  startTime: number
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const {
    enableScrollTracking = true,
    enableFormTracking = true,
    enablePerformanceTracking = true,
    scrollThreshold = [25, 50, 75, 90],
    debug = false
  } = options

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { preferences, isLoaded, hasAnalyticsConsent } = useCookiePreferences()
  
  // Tracking state
  const scrollTracked = useRef<Set<number>>(new Set())
  const formTracking = useRef<Map<string, FormTrackingData>>(new Map())
  const pageStartTime = useRef<number>(Date.now())
  const isTrackingEnabled = useRef<boolean>(false)

  // Update tracking enabled state
  useEffect(() => {
    isTrackingEnabled.current = isLoaded && hasAnalyticsConsent
    if (debug) {
      console.log('[useAnalytics] Tracking enabled:', isTrackingEnabled.current)
    }
  }, [isLoaded, hasAnalyticsConsent, debug])

  // Page view tracking
  useEffect(() => {
    if (!isTrackingEnabled.current) return

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    
    // Reset page-specific tracking
    scrollTracked.current.clear()
    pageStartTime.current = Date.now()
    
    // Track page view
    ga4.pageView({
      page_location: url,
      page_title: document.title,
    })

    if (debug) {
      console.log('[useAnalytics] Page view tracked:', url)
    }
  }, [pathname, searchParams, debug])

  // Scroll tracking
  useEffect(() => {
    if (!enableScrollTracking || !isTrackingEnabled.current) return

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100)

      scrollThreshold.forEach(threshold => {
        if (scrollPercent >= threshold && !scrollTracked.current.has(threshold)) {
          scrollTracked.current.add(threshold)
          ga4.scrollEvent(threshold)
          
          if (debug) {
            console.log('[useAnalytics] Scroll tracked:', threshold + '%')
          }
        }
      })
    }

    const throttledScroll = throttle(handleScroll, 250)
    window.addEventListener('scroll', throttledScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [enableScrollTracking, scrollThreshold, debug])

  // Form tracking
  useEffect(() => {
    if (!enableFormTracking || !isTrackingEnabled.current) return

    const handleFormFocus = (event: Event) => {
      const form = (event.target as HTMLElement).closest('form')
      if (!form) return

      const formName = form.getAttribute('data-analytics-name') || 
                     form.getAttribute('name') || 
                     form.id || 
                     'unnamed-form'

      if (!formTracking.current.has(formName)) {
        formTracking.current.set(formName, {
          formName,
          formElement: form,
          startTime: Date.now()
        })

        ga4.formStart(formName)
        
        if (debug) {
          console.log('[useAnalytics] Form start tracked:', formName)
        }
      }
    }

    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement
      const formName = form.getAttribute('data-analytics-name') || 
                     form.getAttribute('name') || 
                     form.id || 
                     'unnamed-form'

      const trackingData = formTracking.current.get(formName)
      const timeTaken = trackingData ? Date.now() - trackingData.startTime : 0

      ga4.formSubmit(formName, true)
      
      if (timeTaken > 0) {
        ga4.timing('form_completion', timeTaken, 'Forms')
      }

      formTracking.current.delete(formName)
      
      if (debug) {
        console.log('[useAnalytics] Form submit tracked:', formName, `${timeTaken}ms`)
      }
    }

    // Use capture phase to ensure we catch all form interactions
    document.addEventListener('focusin', handleFormFocus, true)
    document.addEventListener('submit', handleFormSubmit, true)

    return () => {
      document.removeEventListener('focusin', handleFormFocus, true)
      document.removeEventListener('submit', handleFormSubmit, true)
    }
  }, [enableFormTracking, debug])

  // Performance tracking
  useEffect(() => {
    if (!enablePerformanceTracking || !isTrackingEnabled.current) return

    // Track Core Web Vitals
    const trackWebVitals = async () => {
      try {
        const { onCLS, onFCP, onLCP, onTTFB } = await import('web-vitals')

        onCLS((metric: any) => {
          ga4.timing('CLS', Math.round(metric.value * 1000), 'Web Vitals')
        })

        onFCP((metric: any) => {
          ga4.timing('FCP', Math.round(metric.value), 'Web Vitals')
        })

        onLCP((metric: any) => {
          ga4.timing('LCP', Math.round(metric.value), 'Web Vitals')
        })

        onTTFB((metric: any) => {
          ga4.timing('TTFB', Math.round(metric.value), 'Web Vitals')
        })

        if (debug) {
          console.log('[useAnalytics] Web Vitals tracking initialized')
        }
      } catch (error) {
        console.warn('[useAnalytics] Web Vitals tracking failed:', error)
      }
    }

    // Track page timing
    const trackPageTiming = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (navigation) {
          const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
          const domContentLoadedTime = navigation.domContentLoadedEventEnd - navigation.fetchStart
          const firstPaintTime = performance.getEntriesByName('first-paint')[0]?.startTime
          
          if (pageLoadTime > 0) {
            ga4.timing('page_load_time', Math.round(pageLoadTime), 'Navigation')
          }
          
          if (domContentLoadedTime > 0) {
            ga4.timing('dom_content_loaded', Math.round(domContentLoadedTime), 'Navigation')
          }
          
          if (firstPaintTime) {
            ga4.timing('first_paint', Math.round(firstPaintTime), 'Navigation')
          }

          if (debug) {
            console.log('[useAnalytics] Page timing tracked:', {
              pageLoadTime: Math.round(pageLoadTime),
              domContentLoadedTime: Math.round(domContentLoadedTime),
              firstPaintTime: firstPaintTime ? Math.round(firstPaintTime) : 'N/A'
            })
          }
        }
      }
    }

    // Initialize tracking
    trackWebVitals()
    
    // Track timing after page load
    if (document.readyState === 'complete') {
      trackPageTiming()
    } else {
      window.addEventListener('load', trackPageTiming)
    }

    return () => {
      window.removeEventListener('load', trackPageTiming)
    }
  }, [enablePerformanceTracking, debug])

  // Analytics functions to return
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (!isTrackingEnabled.current) {
      if (debug) console.log('[useAnalytics] Event not tracked (consent required):', eventName)
      return
    }

    ga4.customEvent({
      event_name: eventName,
      event_parameters: parameters
    })

    if (debug) {
      console.log('[useAnalytics] Custom event tracked:', eventName, parameters)
    }
  }, [debug])

  const trackPurchase = useCallback((transactionId: string, value: number, items: ProductItem[], additionalData?: any) => {
    if (!isTrackingEnabled.current) return

    ga4.purchase({
      transaction_id: transactionId,
      value,
      currency: 'CAD',
      items,
      ...additionalData
    })

    if (debug) {
      console.log('[useAnalytics] Purchase tracked:', { transactionId, value, items: items.length })
    }
  }, [debug])

  const trackAddToCart = useCallback((items: ProductItem[], value: number) => {
    if (!isTrackingEnabled.current) return

    ga4.addToCart({
      currency: 'CAD',
      value,
      items
    })

    if (debug) {
      console.log('[useAnalytics] Add to cart tracked:', { value, items: items.length })
    }
  }, [debug])

  const trackRemoveFromCart = useCallback((items: ProductItem[], value: number) => {
    if (!isTrackingEnabled.current) return

    ga4.removeFromCart({
      currency: 'CAD',
      value,
      items
    })

    if (debug) {
      console.log('[useAnalytics] Remove from cart tracked:', { value, items: items.length })
    }
  }, [debug])

  const trackViewItem = useCallback((itemId: string, itemName: string, itemCategory: string, price: number) => {
    if (!isTrackingEnabled.current) return

    ga4.viewItem({
      item_id: itemId,
      item_name: itemName,
      item_category: itemCategory,
      price,
      currency: 'CAD'
    })

    if (debug) {
      console.log('[useAnalytics] View item tracked:', { itemId, itemName, price })
    }
  }, [debug])

  const trackSearch = useCallback((searchTerm: string, results?: number) => {
    if (!isTrackingEnabled.current) return

    ga4.search(searchTerm, results)

    if (debug) {
      console.log('[useAnalytics] Search tracked:', { searchTerm, results })
    }
  }, [debug])

  const trackQuoteRequest = useCallback((productItems: ProductItem[], totalValue: number) => {
    if (!isTrackingEnabled.current) return

    ga4.quoteRequest(productItems, totalValue)

    if (debug) {
      console.log('[useAnalytics] Quote request tracked:', { totalValue, items: productItems.length })
    }
  }, [debug])

  const trackOutboundClick = useCallback((url: string, linkText?: string) => {
    if (!isTrackingEnabled.current) return

    ga4.outboundClick(url, linkText)

    if (debug) {
      console.log('[useAnalytics] Outbound click tracked:', { url, linkText })
    }
  }, [debug])

  const trackFileDownload = useCallback((fileName: string, fileExtension: string) => {
    if (!isTrackingEnabled.current) return

    ga4.fileDownload(fileName, fileExtension)

    if (debug) {
      console.log('[useAnalytics] File download tracked:', { fileName, fileExtension })
    }
  }, [debug])

  const trackException = useCallback((error: Error | string, fatal: boolean = false) => {
    if (!isTrackingEnabled.current) return

    const description = typeof error === 'string' ? error : error.message
    ga4.exception(description, fatal)

    if (debug) {
      console.log('[useAnalytics] Exception tracked:', { description, fatal })
    }
  }, [debug])

  const trackTiming = useCallback((name: string, value: number, category?: string) => {
    if (!isTrackingEnabled.current) return

    ga4.timing(name, value, category)

    if (debug) {
      console.log('[useAnalytics] Timing tracked:', { name, value, category })
    }
  }, [debug])

  return {
    // State
    isTrackingEnabled: isTrackingEnabled.current,
    hasConsent: hasAnalyticsConsent,
    preferences,

    // E-commerce tracking
    trackPurchase,
    trackAddToCart,
    trackRemoveFromCart,
    trackViewItem,

    // Interaction tracking
    trackEvent,
    trackSearch,
    trackQuoteRequest,
    trackOutboundClick,
    trackFileDownload,

    // Performance and error tracking
    trackTiming,
    trackException,

    // Direct access to GA4 instance for advanced usage
    ga4
  }
}

// Utility function for throttling
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }) as T
}

// Hook for tracking specific components
export function useComponentAnalytics(componentName: string, options: UseAnalyticsOptions = {}) {
  const analytics = useAnalytics(options)
  
  const trackComponentInteraction = useCallback((action: string, details?: Record<string, any>) => {
    analytics.trackEvent('component_interaction', {
      component_name: componentName,
      action,
      ...details
    })
  }, [analytics, componentName])

  const trackComponentView = useCallback((details?: Record<string, any>) => {
    analytics.trackEvent('component_view', {
      component_name: componentName,
      ...details
    })
  }, [analytics, componentName])

  const trackComponentError = useCallback((error: Error | string, details?: Record<string, any>) => {
    const errorMessage = typeof error === 'string' ? error : error.message
    
    analytics.trackEvent('component_error', {
      component_name: componentName,
      error_message: errorMessage,
      ...details
    })
  }, [analytics, componentName])

  return {
    ...analytics,
    trackComponentInteraction,
    trackComponentView,
    trackComponentError
  }
}