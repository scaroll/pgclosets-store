'use client'

"use client"

import { useEffect } from "react"

interface ConversionEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  userId?: string
  sessionId?: string
  page?: string
  timestamp?: number
}

interface ConversionTrackingProps {
  enableGoogleAnalytics?: boolean
  enableFacebookPixel?: boolean
  enableCustomTracking?: boolean
  debug?: boolean
}

// Custom conversion tracking hook
export function useConversionTracking() {
  const trackEvent = (event: ConversionEvent) => {
    const trackingData = {
      ...event,
      timestamp: Date.now(),
      page: window.location.pathname,
      sessionId: getSessionId(),
      userId: getUserId()
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_page: event.page,
        custom_parameter_session_id: trackingData.sessionId
      })
    }

    // Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', event.event, {
        content_category: event.category,
        content_name: event.action,
        value: event.value
      })
    }

    // Custom tracking (could send to your own analytics service)
    if (process.env.NODE_ENV === 'development') {
      console.log('Conversion Event:', trackingData)
    }

    // Send to custom analytics endpoint
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingData)
      }).catch(err => console.error('Analytics tracking failed:', err))
    }
  }

  // Pre-defined conversion events
  const trackConversions = {
    // Primary conversions
    quoteRequest: (value?: number) => trackEvent({
      event: 'Lead',
      category: 'Conversion',
      action: 'Quote_Request',
      label: 'Primary_CTA',
      value: value || 500 // Estimated lead value
    }),

    consultationBooking: (value?: number) => trackEvent({
      event: 'Lead',
      category: 'Conversion',
      action: 'Consultation_Booking',
      label: 'Schedule_CTA',
      value: value || 750
    }),

    phoneCall: () => trackEvent({
      event: 'Lead',
      category: 'Conversion',
      action: 'Phone_Call',
      label: 'Click_to_Call',
      value: 300
    }),

    emailContact: () => trackEvent({
      event: 'Lead',
      category: 'Conversion',
      action: 'Email_Contact',
      label: 'Contact_Form',
      value: 250
    }),

    // Micro-conversions
    productView: (productName: string) => trackEvent({
      event: 'ViewContent',
      category: 'Engagement',
      action: 'Product_View',
      label: productName
    }),

    catalogDownload: () => trackEvent({
      event: 'Lead',
      category: 'Engagement',
      action: 'Catalog_Download',
      value: 100
    }),

    videoWatch: (duration: number) => trackEvent({
      event: 'Engagement',
      category: 'Content',
      action: 'Video_Watch',
      value: duration
    }),

    quoteCalculatorUse: () => trackEvent({
      event: 'Engagement',
      category: 'Tool',
      action: 'Quote_Calculator',
      value: 150
    }),

    // Navigation events
    ctaClick: (ctaText: string, location: string) => trackEvent({
      event: 'Engagement',
      category: 'CTA',
      action: 'CTA_Click',
      label: `${ctaText}_${location}`
    }),

    pageScroll: (percentage: number) => trackEvent({
      event: 'Engagement',
      category: 'Page',
      action: 'Scroll_Depth',
      value: percentage
    }),

    // E-commerce events
    addToCart: (productName: string, value: number) => trackEvent({
      event: 'AddToCart',
      category: 'Ecommerce',
      action: 'Add_to_Cart',
      label: productName,
      value
    }),

    cartAbandonment: (cartValue: number) => trackEvent({
      event: 'CartAbandonment',
      category: 'Ecommerce',
      action: 'Cart_Abandonment',
      value: cartValue
    }),

    // Trust signals
    reviewRead: () => trackEvent({
      event: 'Engagement',
      category: 'Trust',
      action: 'Review_Read'
    }),

    galleryView: () => trackEvent({
      event: 'Engagement',
      category: 'Trust',
      action: 'Gallery_View'
    })
  }

  return { trackEvent, trackConversions }
}

// Utility functions
function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = sessionStorage.getItem('pgclosets_session_id')
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem('pgclosets_session_id', sessionId)
  }
  return sessionId
}

function getUserId(): string {
  if (typeof window === 'undefined') return ''

  let userId = localStorage.getItem('pgclosets_user_id')
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('pgclosets_user_id', userId)
  }
  return userId
}

// Component for tracking page views and setting up conversion tracking
export default function ConversionTracking({
  enableGoogleAnalytics = true,
  enableFacebookPixel = false,
  enableCustomTracking = true,
  debug = false
}: ConversionTrackingProps) {
  const { trackEvent } = useConversionTracking()

  useEffect(() => {
    // Track page view
    trackEvent({
      event: 'PageView',
      category: 'Navigation',
      action: 'Page_View',
      page: window.location.pathname
    })

    // Track session start if new session
    const sessionStart = sessionStorage.getItem('pgclosets_session_start')
    if (!sessionStart) {
      sessionStorage.setItem('pgclosets_session_start', Date.now().toString())
      trackEvent({
        event: 'SessionStart',
        category: 'Session',
        action: 'Session_Start'
      })
    }

    // Set up scroll tracking
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent

        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          trackEvent({
            event: 'Engagement',
            category: 'Page',
            action: 'Scroll_Depth',
            value: scrollPercent
          })
        }
      }
    }

    // Set up time on page tracking
    const startTime = Date.now()
    const trackTimeOnPage = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)

      // Track time milestones
      if ([30, 60, 120, 300].includes(timeOnPage)) {
        trackEvent({
          event: 'Engagement',
          category: 'Page',
          action: 'Time_on_Page',
          value: timeOnPage
        })
      }
    }

    // Set up exit intent tracking
    let exitIntentTriggered = false
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentTriggered) {
        exitIntentTriggered = true
        trackEvent({
          event: 'ExitIntent',
          category: 'Behavior',
          action: 'Exit_Intent'
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Time tracking intervals
    const timeInterval = setInterval(trackTimeOnPage, 1000)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearInterval(timeInterval)
    }
  }, [trackEvent])

  // This component doesn't render anything visible
  return null
}

// Enhanced CTA wrapper with automatic tracking
interface TrackingCTAProps {
  children: React.ReactNode
  ctaText: string
  ctaLocation: string
  conversionType: 'quote' | 'consultation' | 'phone' | 'email' | 'engagement'
  value?: number
  onClick?: () => void
  href?: string
  className?: string
}

export function TrackingCTA({
  children,
  ctaText,
  ctaLocation,
  conversionType,
  value,
  onClick,
  href,
  className = ""
}: TrackingCTAProps) {
  const { trackConversions } = useConversionTracking()

  const handleClick = () => {
    // Track the specific conversion type
    switch (conversionType) {
      case 'quote':
        trackConversions.quoteRequest(value)
        break
      case 'consultation':
        trackConversions.consultationBooking(value)
        break
      case 'phone':
        trackConversions.phoneCall()
        break
      case 'email':
        trackConversions.emailContact()
        break
      default:
        trackConversions.ctaClick(ctaText, ctaLocation)
    }

    // Call original onClick if provided
    if (onClick) {
      onClick()
    }

    // Navigate if href provided
    if (href && typeof window !== 'undefined') {
      window.location.href = href
    }
  }

  if (href) {
    return (
      <a href={href} onClick={handleClick} className={className}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}

// Global types for window objects
declare global {
  interface Window {
    gtag: any
    fbq: any
  }
}

export { ConversionTracking, TrackingCTA }