"use client"

import { useEffect, useState } from 'react'
import { BUSINESS_INFO } from '@/lib/business-config'

interface AnalyticsStatus {
  gtagLoaded: boolean
  gaConfigured: boolean
  dataLayerExists: boolean
  gaMeasurementId: string | null
  pageViewSent: boolean
  errors: string[]
}


export function AnalyticsValidator() {
  const [status, setStatus] = useState<AnalyticsStatus>({
    gtagLoaded: false,
    gaConfigured: false,
    dataLayerExists: false,
    gaMeasurementId: null,
    pageViewSent: false,
    errors: []
  })

  useEffect(() => {
    // Only run validation in development or when explicitly enabled
    const shouldValidate = process.env.NODE_ENV === 'development' || 
                          typeof window !== 'undefined' && window.location.search.includes('validate-analytics=true')
    
    if (!shouldValidate) return

    const validateAnalytics = () => {
      const errors: string[] = []
      const gaMeasurementId = process.env.NEXT_PUBLIC_GA_ID || null

      // Check if GA ID is configured
      if (!gaMeasurementId) {
        errors.push('NEXT_PUBLIC_GA_ID environment variable not set')
      }

      // Check if dataLayer exists
      const dataLayerExists = typeof window !== 'undefined' && Array.isArray(window.dataLayer)
      if (!dataLayerExists) {
        errors.push('Google Analytics dataLayer not initialized')
      }

      // Check if gtag function is available
      const gtagLoaded = typeof window !== 'undefined' && typeof window.gtag === 'function'
      if (!gtagLoaded) {
        errors.push('Google Analytics gtag function not loaded')
      }

      // Check if GA is configured
      const gaConfigured = gtagLoaded && gaMeasurementId !== null
      
      // Send test page view if everything is working
      let pageViewSent = false
      if (gaConfigured && window.gtag) {
        try {
          window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            custom_parameter: 'analytics_validation'
          })
          pageViewSent = true
        } catch (error) {
          errors.push(`Failed to send test page view: ${error}`)
        }
      }

      setStatus({
        gtagLoaded,
        gaConfigured,
        dataLayerExists,
        gaMeasurementId,
        pageViewSent,
        errors
      })

      // Log validation results to console
      console.log('🔍 Google Analytics Validation Results:', {
        gtagLoaded,
        gaConfigured,
        dataLayerExists,
        gaMeasurementId,
        pageViewSent,
        errors,
        dataLayerContents: window.dataLayer?.slice(-5) // Last 5 entries
      })
    }

    // Run validation after a short delay to ensure GA has loaded
    const timer = setTimeout(validateAnalytics, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Only render in development or when validation is explicitly requested
  const shouldShow = process.env.NODE_ENV === 'development' || 
                     (typeof window !== 'undefined' && window.location.search.includes('validate-analytics=true'))

  if (!shouldShow) return null

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: status.errors.length > 0 ? '#fee2e2' : '#dcfce7',
        border: `2px solid ${status.errors.length > 0 ? '#ef4444' : '#22c55e'}`,
        borderRadius: '8px',
        padding: '12px',
        fontSize: '12px',
        maxWidth: '300px',
        zIndex: 9999,
        fontFamily: 'monospace',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
        {status.errors.length === 0 ? '✅' : '❌'} Analytics Status
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        <strong>GA ID:</strong> {status.gaMeasurementId || 'Not configured'}
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        <strong>gtag loaded:</strong> {status.gtagLoaded ? '✅' : '❌'}
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        <strong>DataLayer:</strong> {status.dataLayerExists ? '✅' : '❌'}
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        <strong>Configured:</strong> {status.gaConfigured ? '✅' : '❌'}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Test sent:</strong> {status.pageViewSent ? '✅' : '❌'}
      </div>
      
      {status.errors.length > 0 && (
        <div>
          <strong style={{ color: '#ef4444' }}>Errors:</strong>
          <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
            {status.errors.map((error, index) => (
              <li key={index} style={{ color: '#ef4444', fontSize: '11px' }}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>
        Add ?validate-analytics=true to any URL to show this validator in production
      </div>
    </div>
  )
}

/**
 * Business Analytics Events
 * Provides consistent event tracking for business metrics
 */
export function trackBusinessEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    console.warn('Google Analytics not available for event tracking')
    return
  }

  const businessContext = {
    business_name: BUSINESS_INFO.name,
    location: BUSINESS_INFO.address.city,
    service_area: BUSINESS_INFO.serviceAreas[0], // Primary service area
    ...parameters
  }

  window.gtag('event', eventName, businessContext)
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Business Event Tracked:', eventName, businessContext)
  }
}

/**
 * Enhanced page view tracking with business context
 */
export function trackEnhancedPageView(additionalData?: Record<string, any>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  const pageData = {
    page_title: document.title,
    page_location: window.location.href,
    business_name: BUSINESS_INFO.name,
    service_area: BUSINESS_INFO.address.city,
    ...additionalData
  }

  window.gtag('event', 'page_view', pageData)
  
  if (process.env.NODE_ENV === 'development') {
    console.log('📄 Enhanced Page View:', pageData)
  }
}