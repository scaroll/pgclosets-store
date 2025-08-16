'use client'

import { useEffect, useState } from 'react'
import { GoogleTagManager } from './google-tag-manager'
import { CookieConsent, useCookiePreferences, shouldLoadAnalytics } from './cookie-consent'
import { webVitalsTracker } from '@/lib/analytics/web-vitals'

interface AnalyticsProviderProps {
  measurementId: string
  children: React.ReactNode
  debug?: boolean
  enableCookieConsent?: boolean
  privacyPolicyUrl?: string
  companyName?: string
}

export function AnalyticsProvider({
  measurementId,
  children,
  debug = false,
  enableCookieConsent = true,
  privacyPolicyUrl = '/privacy',
  companyName = 'PG Closets'
}: AnalyticsProviderProps) {
  const [shouldLoadGA, setShouldLoadGA] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Check if analytics should be loaded based on cookie consent
  useEffect(() => {
    const checkAnalyticsConsent = () => {
      if (!enableCookieConsent) {
        // If cookie consent is disabled, load analytics immediately
        setShouldLoadGA(true)
        return
      }

      const hasConsent = shouldLoadAnalytics()
      setShouldLoadGA(hasConsent)
      
      if (debug) {
        console.log('[AnalyticsProvider] Analytics consent status:', hasConsent)
      }
    }

    // Check immediately
    checkAnalyticsConsent()

    // Listen for localStorage changes (cookie consent updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pgclosets_cookie_preferences') {
        checkAnalyticsConsent()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [enableCookieConsent, debug])

  // Handle cookie preference changes
  const handlePreferencesChange = (preferences: any) => {
    setShouldLoadGA(preferences.analytics)
    
    if (debug) {
      console.log('[AnalyticsProvider] Cookie preferences updated:', preferences)
    }

    // If analytics was just enabled, initialize web vitals
    if (preferences.analytics && !isInitialized) {
      setTimeout(() => {
        webVitalsTracker.initialize()
        setIsInitialized(true)
      }, 1000)
    }
  }

  // Initialize web vitals when GA4 is loaded
  useEffect(() => {
    if (shouldLoadGA && !isInitialized) {
      setTimeout(() => {
        webVitalsTracker.initialize()
        setIsInitialized(true)
        
        if (debug) {
          console.log('[AnalyticsProvider] Web Vitals initialized')
        }
      }, 1000)
    }
  }, [shouldLoadGA, isInitialized, debug])

  return (
    <>
      {/* Load Google Analytics only if consent is given */}
      {shouldLoadGA && (
        <GoogleTagManager 
          measurementId={measurementId} 
          debug={debug}
        />
      )}

      {/* Cookie Consent Banner */}
      {enableCookieConsent && (
        <CookieConsent
          onPreferencesChange={handlePreferencesChange}
          companyName={companyName}
          privacyPolicyUrl={privacyPolicyUrl}
          debug={debug}
        />
      )}

      {/* App Content */}
      {children}
    </>
  )
}

// Hook to check if analytics is loaded
export function useAnalyticsStatus() {
  const { preferences, isLoaded, hasAnalyticsConsent } = useCookiePreferences()
  const [isGALoaded, setIsGALoaded] = useState(false)

  useEffect(() => {
    const checkGAStatus = () => {
      const gaLoaded = typeof window !== 'undefined' && 
                     typeof window.gtag === 'function' && 
                     hasAnalyticsConsent

      setIsGALoaded(gaLoaded)
    }

    checkGAStatus()

    // Check periodically for GA load status
    const interval = setInterval(checkGAStatus, 1000)

    return () => clearInterval(interval)
  }, [hasAnalyticsConsent])

  return {
    isLoaded,
    hasAnalyticsConsent,
    isGALoaded,
    preferences
  }
}

// Debug component for development
export function AnalyticsDebugInfo() {
  const { isLoaded, hasAnalyticsConsent, isGALoaded, preferences } = useAnalyticsStatus()
  const [vitalsData, setVitalsData] = useState<any>(null)

  useEffect(() => {
    const updateVitalsData = () => {
      const summary = webVitalsTracker.getVitalsSummary()
      setVitalsData(summary)
    }

    updateVitalsData()
    const interval = setInterval(updateVitalsData, 5000)

    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Analytics Debug</h3>
      
      <div className="space-y-1">
        <div>Consent Loaded: {isLoaded ? '✅' : '❌'}</div>
        <div>Analytics Consent: {hasAnalyticsConsent ? '✅' : '❌'}</div>
        <div>GA4 Loaded: {isGALoaded ? '✅' : '❌'}</div>
      </div>

      <div className="mt-2">
        <div className="font-semibold">Cookie Preferences:</div>
        <div>Necessary: {preferences.necessary ? '✅' : '❌'}</div>
        <div>Analytics: {preferences.analytics ? '✅' : '❌'}</div>
        <div>Marketing: {preferences.marketing ? '✅' : '❌'}</div>
        <div>Functional: {preferences.functional ? '✅' : '❌'}</div>
        <div>Location: {preferences.location ? '✅' : '❌'}</div>
      </div>

      {vitalsData && Object.keys(vitalsData).length > 0 && (
        <div className="mt-2">
          <div className="font-semibold">Web Vitals:</div>
          {Object.entries(vitalsData).map(([metric, data]: [string, any]) => (
            <div key={metric} className="text-xs">
              {metric}: {data.value} ({data.rating})
            </div>
          ))}
        </div>
      )}
    </div>
  )
}