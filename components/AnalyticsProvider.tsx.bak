/**
 * Analytics Provider Component
 *
 * Combines GTM and GA4 implementations with GDPR-ready consent mode.
 * Performance optimized with deferred loading.
 * Only renders in production environment.
 */

'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { GoogleTagManager } from './GoogleTagManager'
import { initGA4, setDefaultConsent, updateConsentMode } from '@/lib/analytics/ga4'
import { initDataLayer, trackPageView } from '@/lib/analytics/gtm'

interface AnalyticsProviderProps {
  /**
   * Whether to require user consent before tracking
   * @default true
   */
  requireConsent?: boolean

  /**
   * Delay before initializing analytics (ms)
   * Helps with performance by deferring non-critical scripts
   * @default 2000
   */
  delayMs?: number
}

export function AnalyticsProvider({ requireConsent = true, delayMs = 2000 }: AnalyticsProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isInitialized, setIsInitialized] = useState(false)
  const [_hasConsent, setHasConsent] = useState(false)

  // Only load in production
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  // Initialize analytics with delay for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      // Set default consent mode (GDPR-ready)
      if (requireConsent) {
        setDefaultConsent({
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          functionality_storage: 'granted',
          personalization_storage: 'denied',
          security_storage: 'granted',
          wait_for_update: 500,
        })
      } else {
        setDefaultConsent({
          analytics_storage: 'granted',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          functionality_storage: 'granted',
          personalization_storage: 'denied',
          security_storage: 'granted',
        })
      }

      // Initialize data layer
      initDataLayer()

      // Initialize GA4
      initGA4({
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        send_page_view: false, // We'll handle this manually
      })

      setIsInitialized(true)

      // Check for stored consent
      if (typeof window !== 'undefined') {
        const storedConsent = localStorage.getItem('analytics_consent')
        if (storedConsent === 'granted') {
          handleConsentGranted()
        }
      }
    }, delayMs)

    return () => clearTimeout(timer)
  }, [requireConsent, delayMs])

  // Handle consent granted
  const handleConsentGranted = () => {
    updateConsentMode({
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })

    setHasConsent(true)

    // Store consent
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_consent', 'granted')
      localStorage.setItem('analytics_consent_date', new Date().toISOString())
    }
  }

  // Track page views on route changes
  useEffect(() => {
    if (!isInitialized) return

    // Track page view
    trackPageView({
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams, isInitialized])

  // Listen for custom consent events
  useEffect(() => {
    const handleConsentEvent = (event: CustomEvent) => {
      if (event.detail.analytics === true) {
        handleConsentGranted()
      }
    }

    window.addEventListener('analytics-consent' as any, handleConsentEvent)

    return () => {
      window.removeEventListener('analytics-consent' as any, handleConsentEvent)
    }
  }, [])

  return (
    <>
      <GoogleTagManager />

      {/* Web Vitals will be tracked via PerformanceMonitor component */}
    </>
  )
}

/**
 * Hook to programmatically grant analytics consent
 */
export function useAnalyticsConsent() {
  const grantConsent = () => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('analytics-consent', {
        detail: { analytics: true },
      })
      window.dispatchEvent(event)
    }
  }

  const revokeConsent = () => {
    if (typeof window !== 'undefined') {
      updateConsentMode({
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      })

      localStorage.removeItem('analytics_consent')
      localStorage.removeItem('analytics_consent_date')
    }
  }

  const checkConsent = (): boolean => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('analytics_consent') === 'granted'
  }

  return {
    grantConsent,
    revokeConsent,
    hasConsent: checkConsent(),
  }
}
