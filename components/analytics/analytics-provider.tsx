"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { initializeAnalytics } from '../../lib/analytics'
import { ConsentBanner, useConsentPreferences } from './consent-banner'
import { EcommercePageTracker } from './ecommerce-tracking'
import { AnalyticsErrorBoundary } from './error-tracking'
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
        anonymizeIP: true,
        enableAdvancedMatching: false,
        enableConsentMode: enableCookieConsent,
        customDimensions: {
          user_type: 'custom_map.user_type',
          page_category: 'custom_map.page_category',
          device_type: 'custom_map.device_type'
        },
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
        anonymizeIP: true,
        enableAdvancedMatching: false,
        enableConsentMode: enableCookieConsent,
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
  const trackPurchase = (transactionId: string, value: number, items: any[], additionalData?: any) => {
    if (!hasConsent || !analytics) return
    analytics.trackPurchase({
      transaction_id: transactionId,
      value,
      currency: 'CAD',
      items,
      ...additionalData
    })
  }

  const trackAddToCart = (items: any[], value: number) => {
    if (!hasConsent || !analytics) return
    analytics.trackAddToCart({
      currency: 'CAD',
      value,
      items
    })
  }

  const trackRemoveFromCart = (items: any[], value: number) => {
    if (!hasConsent || !analytics) return
    analytics.trackRemoveFromCart({
      currency: 'CAD',
      value,
      items
    })
  }

  const trackViewItem = (itemId: string, itemName: string, itemCategory: string, price: number) => {
    if (!hasConsent || !analytics) return
    analytics.trackViewItem({
      item_id: itemId,
      item_name: itemName,
      item_category: itemCategory,
      price,
      currency: 'CAD'
    })
  }

  const trackBeginCheckout = (items: any[], value: number, additionalData?: any) => {
    if (!hasConsent || !analytics) return
    analytics.trackBeginCheckout({
      currency: 'CAD',
      value,
      items,
      ...additionalData
    })
  }

  // Interaction tracking
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (!hasConsent || !analytics) return
    analytics.gtag('event', eventName, {
      event_category: 'Custom Events',
      event_label: eventName,
      ...parameters
    })
  }

  const trackSearch = (searchTerm: string, results?: number) => {
    if (!hasConsent || !analytics) return
    analytics.trackSearch(searchTerm, results)
  }

  const trackQuoteRequest = (productItems: any[], totalValue: number) => {
    if (!hasConsent || !analytics) return
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

  const trackOutboundClick = (url: string, linkText?: string) => {
    if (!hasConsent || !analytics) return
    analytics.trackOutboundClick(url, linkText)
  }

  const trackFileDownload = (fileName: string, fileExtension: string) => {
    if (!hasConsent || !analytics) return
    analytics.trackFileDownload(fileName, fileExtension)
  }

  const trackFormSubmission = (formName: string, success: boolean = true) => {
    if (!hasConsent || !analytics) return
    analytics.trackFormSubmission(formName, undefined, success)
  }

  const trackPhoneClick = (phoneNumber: string) => {
    if (!hasConsent || !analytics) return
    trackEvent('phone_click', {
      event_category: 'Contact',
      event_label: 'Phone Click',
      phone_number: phoneNumber
    })
  }

  const trackEmailClick = (emailAddress: string) => {
    if (!hasConsent || !analytics) return
    trackEvent('email_click', {
      event_category: 'Contact',
      event_label: 'Email Click',
      email_address: emailAddress
    })
  }

  // Performance and error tracking
  const trackTiming = (name: string, value: number, category?: string) => {
    if (!hasConsent || !analytics) return
    analytics.gtag('event', 'timing_complete', {
      name,
      value,
      event_category: category || 'Performance',
      event_label: name
    })
  }

  const trackException = (error: Error | string, fatal?: boolean) => {
    if (!hasConsent || !analytics) return
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

  // User identification
  const setUserId = (userId: string) => {
    if (!analytics) return
    analytics.setUserId(userId)
  }

  const clearUserId = () => {
    if (!analytics) return
    analytics.clearUserId()
  }

  // Page tracking
  const trackPageView = (path?: string, title?: string) => {
    if (!hasConsent || !analytics) return
    analytics.trackPageView(path, title)
  }

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