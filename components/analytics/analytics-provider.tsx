"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { initializeAnalytics } from '../../lib/analytics'
import { ConsentBanner, useConsentPreferences } from './consent-banner'
import { EcommercePageTracker } from './ecommerce-tracking'
import { AnalyticsErrorBoundary } from './error-tracking'
import { withVoidConsentGuard, withAnalyticsGuard } from '../../lib/analytics/use-consent-guard'
import type { CookieConsentPreferences, AnalyticsConfig } from '../../types/analytics'

// Analytics Context
interface AnalyticsContextValue {
  isInitialized: boolean
  hasConsent: boolean
  preferences: CookieConsentPreferences | null
  updatePreferences: (preferences: CookieConsentPreferences) => void
  analytics: any
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null)

// Analytics Provider Props
interface AnalyticsProviderProps {
  children: React.ReactNode
  measurementId: string
  config?: Partial<AnalyticsConfig>
  debug?: boolean
  enableCookieConsent?: boolean
  privacyPolicyUrl?: string
  cookiePolicyUrl?: string
  companyName?: string
}

export function AnalyticsProvider({
  children,
  measurementId,
  config = {},
  debug = false,
  enableCookieConsent = true,
  privacyPolicyUrl = "/privacy-policy",
  cookiePolicyUrl = "/cookie-policy",
  companyName = "PG Closets"
}: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)
  const initializationRef = useRef(false)

  const {
    preferences,
    hasConsent,
    hasAnalyticsConsent,
    updatePreferences: updateConsentPreferences
  } = useConsentPreferences()

  // Initialize analytics when consent is given
  useEffect(() => {
    if (!initializationRef.current && (!enableCookieConsent || hasAnalyticsConsent)) {
      initializationRef.current = true

      const analyticsConfig: Partial<AnalyticsConfig> = {
        measurementId,
        debug,
        enableCookieConsent,
        ...config
      }

      try {
        const analyticsInstance = initializeAnalytics(analyticsConfig)

        if (analyticsInstance && preferences) {
          analyticsInstance.updateConsentPreferences(preferences)
        }

        setAnalytics(analyticsInstance)
        setIsInitialized(true)

        // Track initial page view
        if (analyticsInstance?.hasAnalyticsConsent()) {
          analyticsInstance.trackPageView()
        }

      } catch (error) {
        console.error('Failed to initialize analytics:', error)
      }
    }
  }, [measurementId, debug, enableCookieConsent, hasAnalyticsConsent, preferences, config])

  // Update analytics preferences when consent changes
  useEffect(() => {
    if (analytics && preferences) {
      analytics.updateConsentPreferences(preferences)
    }
  }, [analytics, preferences])

  const handleConsentChange = (newPreferences: CookieConsentPreferences) => {
    updateConsentPreferences(newPreferences)

    if (analytics) {
      analytics.updateConsentPreferences(newPreferences)
    }

    // Initialize analytics if not already done and analytics consent is given
    if (!isInitialized && newPreferences.analytics && !initializationRef.current) {
      initializationRef.current = true

      const analyticsConfig: Partial<AnalyticsConfig> = {
        measurementId,
        debug,
        enableCookieConsent,
        ...config
      }

      try {
        const analyticsInstance = initializeAnalytics(analyticsConfig)
        analyticsInstance.updateConsentPreferences(newPreferences)
        setAnalytics(analyticsInstance)
        setIsInitialized(true)

        // Track initial page view
        analyticsInstance.trackPageView()
      } catch (error) {
        console.error('Failed to initialize analytics after consent:', error)
      }
    }
  }

  const contextValue: AnalyticsContextValue = {
    isInitialized,
    hasConsent,
    preferences,
    updatePreferences: handleConsentChange,
    analytics
  }

  return (
    <AnalyticsContext.Provider value={contextValue}>
      <AnalyticsErrorBoundary>
        {enableCookieConsent && (
          <ConsentBanner
            onConsentChange={handleConsentChange}
            companyName={companyName}
            privacyPolicyUrl={privacyPolicyUrl}
            cookiePolicyUrl={cookiePolicyUrl}
          />
        )}

        <EcommercePageTracker>
          {children}
        </EcommercePageTracker>
      </AnalyticsErrorBoundary>
    </AnalyticsContext.Provider>
  )
}

// Hook to use analytics context
export function useAnalytics() {
  const context = useContext(AnalyticsContext)

  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }

  return context
}

// Enhanced analytics hook with all tracking methods
export function useAnalyticsTracking() {
  const { analytics, hasConsent } = useAnalytics()

  // E-commerce tracking
  const trackPurchase = withVoidConsentGuard(
    hasConsent,
    analytics,
    (transactionId: string, value: number, items: any[], additionalData?: any) => {
      analytics.trackPurchase({
        transaction_id: transactionId,
        value,
        currency: 'CAD',
        items,
        ...additionalData
      })
    }
  )

  const trackAddToCart = withVoidConsentGuard(
    hasConsent,
    analytics,
    (items: any[], value: number) => {
      analytics.trackAddToCart({
        currency: 'CAD',
        value,
        items
      })
    }
  )

  const trackRemoveFromCart = withVoidConsentGuard(
    hasConsent,
    analytics,
    (items: any[], value: number) => {
      analytics.trackRemoveFromCart({
        currency: 'CAD',
        value,
        items
      })
    }
  )

  const trackViewItem = withVoidConsentGuard(
    hasConsent,
    analytics,
    (itemId: string, itemName: string, itemCategory: string, price: number) => {
      analytics.trackViewItem({
        item_id: itemId,
        item_name: itemName,
        item_category: itemCategory,
        price,
        currency: 'CAD'
      })
    }
  )

  const trackBeginCheckout = withVoidConsentGuard(
    hasConsent,
    analytics,
    (items: any[], value: number, additionalData?: any) => {
      analytics.trackBeginCheckout({
        currency: 'CAD',
        value,
        items,
        ...additionalData
      })
    }
  )

  // Interaction tracking
  const trackEvent = withVoidConsentGuard(
    hasConsent,
    analytics,
    (eventName: string, parameters?: Record<string, any>) => {
      analytics.gtag('event', eventName, {
        event_category: 'Custom Events',
        event_label: eventName,
        ...parameters
      })
    }
  )

  const trackSearch = withVoidConsentGuard(
    hasConsent,
    analytics,
    (searchTerm: string, results?: number) => {
      analytics.trackSearch(searchTerm, results)
    }
  )

  const trackQuoteRequest = withVoidConsentGuard(
    hasConsent,
    analytics,
    (productItems: any[], totalValue: number) => {
      analytics.trackQuoteRequest({
        leadType: 'quote_request',
        leadSource: 'website',
        leadValue: totalValue,
        products: productItems,
        contactInfo: {},
        timestamp: Date.now(),
        sessionId: analytics.getSessionId()
      })
    }
  )

  const trackOutboundClick = withVoidConsentGuard(
    hasConsent,
    analytics,
    (url: string, linkText?: string) => {
      analytics.trackOutboundClick(url, linkText)
    }
  )

  const trackFileDownload = withVoidConsentGuard(
    hasConsent,
    analytics,
    (fileName: string, fileExtension: string) => {
      analytics.trackFileDownload(fileName, fileExtension)
    }
  )

  const trackFormSubmission = withVoidConsentGuard(
    hasConsent,
    analytics,
    (formName: string, success: boolean = true) => {
      analytics.trackFormSubmission(formName, undefined, success)
    }
  )

  const trackPhoneClick = withVoidConsentGuard(
    hasConsent,
    analytics,
    (phoneNumber: string) => {
      trackEvent('phone_click', {
        event_category: 'Contact',
        event_label: 'Phone Click',
        phone_number: phoneNumber
      })
    }
  )

  const trackEmailClick = withVoidConsentGuard(
    hasConsent,
    analytics,
    (emailAddress: string) => {
      trackEvent('email_click', {
        event_category: 'Contact',
        event_label: 'Email Click',
        email_address: emailAddress
      })
    }
  )

  // Performance and error tracking
  const trackTiming = withVoidConsentGuard(
    hasConsent,
    analytics,
    (name: string, value: number, category?: string) => {
      analytics.gtag('event', 'timing_complete', {
        name,
        value,
        event_category: category || 'Performance',
        event_label: name
      })
    }
  )

  const trackException = withVoidConsentGuard(
    hasConsent,
    analytics,
    (error: Error | string, fatal?: boolean) => {
      const errorMessage = typeof error === 'string' ? error : error.message
      const errorStack = typeof error === 'string' ? undefined : error.stack

      analytics.trackError({
        errorType: 'manual',
        errorMessage,
        errorStack,
        fatal: fatal || false,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: analytics.getSessionId()
      })
    }
  )

  // User identification (no consent required for ID management)
  const setUserId = withAnalyticsGuard(
    analytics,
    (userId: string) => {
      analytics.setUserId(userId)
    }
  )

  const clearUserId = withAnalyticsGuard(
    analytics,
    () => {
      analytics.clearUserId()
    }
  )

  // Page tracking
  const trackPageView = withVoidConsentGuard(
    hasConsent,
    analytics,
    (path?: string, title?: string) => {
      analytics.trackPageView(path, title)
    }
  )

  return {
    // State
    isTrackingEnabled: hasConsent && !!analytics,
    hasConsent,

    // E-commerce tracking
    trackPurchase,
    trackAddToCart,
    trackRemoveFromCart,
    trackViewItem,
    trackBeginCheckout,

    // Interaction tracking
    trackEvent,
    trackSearch,
    trackQuoteRequest,
    trackOutboundClick,
    trackFileDownload,
    trackFormSubmission,
    trackPhoneClick,
    trackEmailClick,

    // Performance and error tracking
    trackTiming,
    trackException,

    // User management
    setUserId,
    clearUserId,

    // Page tracking
    trackPageView,

    // Direct access to analytics instance
    analytics
  }
}

// Utility component for tracking specific elements
export function TrackableElement({
  children,
  trackingName,
  trackingCategory = 'interaction',
  trackingValue = 1,
  onClick,
  ...props
}: {
  children: React.ReactNode
  trackingName: string
  trackingCategory?: string
  trackingValue?: number
  onClick?: () => void
  [key: string]: any
}) {
  const { trackEvent } = useAnalyticsTracking()

  const handleClick = () => {
    trackEvent(trackingName, {
      event_category: trackingCategory,
      event_label: trackingName,
      value: trackingValue
    })
    onClick?.()
  }

  return (
    <div {...props} onClick={handleClick}>
      {children}
    </div>
  )
}

// Component for automatic scroll tracking
export function ScrollTracker({ children }: { children: React.ReactNode }) {
  const { trackEvent } = useAnalyticsTracking()
  const [trackedMilestones, setTrackedMilestones] = useState<Set<number>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      const milestones = [25, 50, 75, 90, 100]
      const milestone = milestones.find(m =>
        scrollPercent >= m &&
        scrollPercent < m + 5 &&
        !trackedMilestones.has(m)
      )

      if (milestone) {
        setTrackedMilestones(prev => new Set([...prev, milestone]))
        trackEvent(`scroll_depth_${milestone}`, {
          event_category: 'Engagement',
          event_label: `Scroll ${milestone}%`,
          value: milestone
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [trackEvent, trackedMilestones])

  return <>{children}</>
}

export { AnalyticsContext }