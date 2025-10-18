/**
 * Conversion Tracking System
 * Agent #38: Comprehensive conversion tracking for all customer touchpoints
 *
 * Features:
 * - Quote request tracking
 * - Phone call tracking with dynamic number insertion
 * - Email signup tracking
 * - Product view tracking with engagement metrics
 * - Add to cart tracking
 * - Form submission tracking with field-level analytics
 * - Scroll depth tracking
 * - Video engagement tracking
 */

import { trackEvent, trackFormSubmit } from './gtm'
import { trackUnifiedEvent } from './tag-manager'

// ==========================================
// QUOTE REQUEST TRACKING
// ==========================================

export interface QuoteRequestData {
  quote_id: string
  quote_type: 'instant' | 'custom' | 'consultation'
  products: Array<{
    product_id: string
    product_name: string
    quantity: number
    price: number
  }>
  total_value: number
  customer_info: {
    name: string
    email: string
    phone: string
    postal_code: string
  }
  configuration?: Record<string, any>
  source: 'pdp' | 'quote_page' | 'header' | 'footer' | 'mobile_sticky'
}

/**
 * Track quote request initiation
 */
export const trackQuoteRequestStart = (data: {
  source: QuoteRequestData['source']
  product_id?: string
  product_name?: string
}) => {
  trackEvent('quote_request_start', {
    quote_source: data.source,
    product_id: data.product_id,
    product_name: data.product_name,
    event_category: 'Conversion',
    event_label: 'Quote Started',
  })
}

/**
 * Track quote request completion
 */
export const trackQuoteRequestComplete = (data: QuoteRequestData) => {
  // Track in GTM/GA4
  trackFormSubmit({
    form_name: 'Quote Request',
    form_type: 'quote',
    success: true,
    products: data.products.map((p) => p.product_id),
    lead_value: data.total_value,
  })

  // Track detailed quote info
  trackEvent('quote_request_complete', {
    quote_id: data.quote_id,
    quote_type: data.quote_type,
    quote_source: data.source,
    total_value: data.total_value,
    product_count: data.products.length,
    currency: 'CAD',
    postal_code: data.customer_info.postal_code,
    event_category: 'Conversion',
    event_label: 'Quote Completed',
  })

  // Track as lead in all platforms
  trackUnifiedEvent('lead', {
    form_name: 'Quote Request',
    form_type: data.quote_type,
    value: data.total_value,
  })

  // Track individual products
  data.products.forEach((product) => {
    trackEvent('quote_product', {
      quote_id: data.quote_id,
      product_id: product.product_id,
      product_name: product.product_name,
      quantity: product.quantity,
      price: product.price,
    })
  })
}

/**
 * Track quote request abandonment
 */
export const trackQuoteRequestAbandonment = (data: {
  source: QuoteRequestData['source']
  step: 'product_selection' | 'configuration' | 'contact_info'
  time_spent_seconds: number
  products_selected?: string[]
}) => {
  trackEvent('quote_request_abandoned', {
    quote_source: data.source,
    abandonment_step: data.step,
    time_spent: data.time_spent_seconds,
    products_selected: data.products_selected?.join(','),
    event_category: 'Conversion',
    event_label: 'Quote Abandoned',
  })
}

// ==========================================
// PHONE CALL TRACKING
// ==========================================

export interface PhoneCallData {
  phone_number: string
  location:
    | 'header'
    | 'footer'
    | 'pdp'
    | 'quote_page'
    | 'contact_page'
    | 'mobile_sticky'
  cta_text: string
  page_path: string
  is_dynamic_number?: boolean
  tracking_number?: string
}

/**
 * Track phone call click
 */
export const trackPhoneCallClick = (data: PhoneCallData) => {
  // Track in GTM/GA4
  trackEvent('phone_click', {
    phone_number: data.is_dynamic_number
      ? 'dynamic'
      : data.phone_number.replace(/\D/g, ''),
    tracking_number: data.tracking_number,
    call_location: data.location,
    cta_text: data.cta_text,
    page_path: data.page_path,
    value: 50, // Estimated call value
    currency: 'CAD',
    event_category: 'Conversion',
    event_label: 'Phone Click',
  })

  // Track as conversion
  trackEvent('conversion', {
    conversion_type: 'phone_call',
    value: 50,
    currency: 'CAD',
    location: data.location,
  })

  // Track in all marketing platforms
  trackUnifiedEvent('lead', {
    form_name: 'Phone Call',
    form_type: 'phone_call',
    value: 50,
  })
}

/**
 * Dynamic Number Insertion (DNI)
 * Replace static phone numbers with tracking numbers based on source
 */
export const setupDynamicNumberInsertion = () => {
  if (typeof window === 'undefined') return

  // Get traffic source
  const params = new URLSearchParams(window.location.search)
  const source = params.get('utm_source')
  const medium = params.get('utm_medium')
  const campaign = params.get('utm_campaign')

  // Mapping of sources to tracking numbers
  const trackingNumbers: Record<string, string> = {
    google_ads: process.env.NEXT_PUBLIC_PHONE_TRACKING_GOOGLE_ADS || '',
    facebook_ads: process.env.NEXT_PUBLIC_PHONE_TRACKING_FACEBOOK || '',
    tiktok_ads: process.env.NEXT_PUBLIC_PHONE_TRACKING_TIKTOK || '',
    organic: process.env.NEXT_PUBLIC_PHONE_TRACKING_ORGANIC || '',
    direct: process.env.NEXT_PUBLIC_PHONE_TRACKING_DIRECT || '',
  }

  // Determine which tracking number to use
  let trackingNumber = ''
  if (source === 'google' && medium === 'cpc') {
    trackingNumber = trackingNumbers.google_ads
  } else if (source === 'facebook' || source === 'fb') {
    trackingNumber = trackingNumbers.facebook_ads
  } else if (source === 'tiktok') {
    trackingNumber = trackingNumbers.tiktok_ads
  } else if (medium === 'organic') {
    trackingNumber = trackingNumbers.organic
  } else {
    trackingNumber = trackingNumbers.direct
  }

  // Replace phone numbers if tracking number available
  if (trackingNumber) {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]')
    phoneLinks.forEach((link) => {
      const originalNumber = link.getAttribute('href')
      link.setAttribute('href', `tel:${trackingNumber}`)
      link.setAttribute('data-original-number', originalNumber || '')
      link.setAttribute('data-tracking-number', trackingNumber)
      link.setAttribute('data-source', source || 'unknown')
    })

    // Also update displayed phone numbers
    const phoneSpans = document.querySelectorAll('[data-phone-number]')
    phoneSpans.forEach((span) => {
      span.textContent = formatPhoneNumber(trackingNumber)
    })
  }
}

/**
 * Format phone number for display
 */
const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

// ==========================================
// EMAIL SIGNUP TRACKING
// ==========================================

export interface EmailSignupData {
  email: string
  signup_source: 'newsletter' | 'quote' | 'account' | 'checkout'
  signup_location: string
  list_name?: string
  preferences?: string[]
}

/**
 * Track email signup
 */
export const trackEmailSignup = (data: EmailSignupData) => {
  trackEvent('email_signup', {
    signup_source: data.signup_source,
    signup_location: data.signup_location,
    list_name: data.list_name,
    preferences: data.preferences?.join(','),
    value: 10,
    currency: 'CAD',
    event_category: 'Conversion',
    event_label: 'Email Signup',
  })

  // Track as lead
  trackUnifiedEvent('lead', {
    form_name: 'Email Signup',
    form_type: data.signup_source,
    value: 10,
  })
}

/**
 * Track email verification
 */
export const trackEmailVerification = (data: {
  email: string
  verification_method: 'link' | 'code'
  success: boolean
}) => {
  trackEvent('email_verification', {
    verification_method: data.verification_method,
    verification_success: data.success,
    event_category: 'User Account',
    event_label: 'Email Verification',
  })
}

// ==========================================
// PRODUCT VIEW TRACKING WITH ENGAGEMENT
// ==========================================

export interface ProductViewData {
  product_id: string
  product_name: string
  product_category: string
  product_type: string
  price: number
  view_duration_seconds?: number
  scroll_depth_percent?: number
  images_viewed?: number
  configurator_opened?: boolean
}

/**
 * Track product detail page view with engagement
 */
export const trackProductViewEngagement = (data: ProductViewData) => {
  trackEvent('product_view_engagement', {
    product_id: data.product_id,
    product_name: data.product_name,
    product_category: data.product_category,
    product_type: data.product_type,
    price: data.price,
    view_duration: data.view_duration_seconds,
    scroll_depth: data.scroll_depth_percent,
    images_viewed: data.images_viewed,
    configurator_opened: data.configurator_opened,
    engagement_score: calculateEngagementScore(data),
    event_category: 'Product Engagement',
    event_label: 'Product View',
  })

  // Track in marketing platforms
  trackUnifiedEvent('product_view', {
    product_id: data.product_id,
    product_name: data.product_name,
    category: data.product_category,
    price: data.price,
  })
}

/**
 * Calculate engagement score (0-100)
 */
const calculateEngagementScore = (data: ProductViewData): number => {
  let score = 0

  // Time on page (max 30 points)
  if (data.view_duration_seconds) {
    score += Math.min((data.view_duration_seconds / 120) * 30, 30)
  }

  // Scroll depth (max 25 points)
  if (data.scroll_depth_percent) {
    score += (data.scroll_depth_percent / 100) * 25
  }

  // Images viewed (max 20 points)
  if (data.images_viewed) {
    score += Math.min(data.images_viewed * 5, 20)
  }

  // Configurator opened (25 points)
  if (data.configurator_opened) {
    score += 25
  }

  return Math.round(score)
}

// ==========================================
// FORM SUBMISSION TRACKING
// ==========================================

export interface FormSubmissionData {
  form_id: string
  form_name: string
  form_type: 'quote' | 'contact' | 'newsletter' | 'consultation' | 'support'
  fields_completed: string[]
  time_to_complete_seconds: number
  validation_errors?: Array<{
    field: string
    error: string
  }>
  success: boolean
  lead_value?: number
}

/**
 * Track form submission with detailed analytics
 */
export const trackFormSubmission = (data: FormSubmissionData) => {
  trackFormSubmit({
    form_name: data.form_name,
    form_id: data.form_id,
    form_type: data.form_type,
    success: data.success,
    lead_value: data.lead_value,
  })

  // Track detailed form metrics
  trackEvent('form_analytics', {
    form_id: data.form_id,
    form_name: data.form_name,
    fields_completed: data.fields_completed.length,
    time_to_complete: data.time_to_complete_seconds,
    completion_rate: data.success ? 100 : 0,
    validation_errors: data.validation_errors?.length || 0,
    event_category: 'Form Analytics',
    event_label: data.form_name,
  })

  // Track individual field errors
  data.validation_errors?.forEach((error) => {
    trackEvent('form_field_error', {
      form_id: data.form_id,
      field_name: error.field,
      error_message: error.error,
      event_category: 'Form Errors',
      event_label: `${data.form_name}: ${error.field}`,
    })
  })
}

/**
 * Track form field interactions
 */
export const trackFormFieldInteraction = (data: {
  form_id: string
  field_name: string
  interaction_type: 'focus' | 'blur' | 'change'
  field_value_length?: number
  time_in_field_seconds?: number
}) => {
  trackEvent('form_field_interaction', {
    form_id: data.form_id,
    field_name: data.field_name,
    interaction_type: data.interaction_type,
    field_value_length: data.field_value_length,
    time_in_field: data.time_in_field_seconds,
    event_category: 'Form Interaction',
    event_label: `${data.form_id}: ${data.field_name}`,
  })
}

// ==========================================
// SCROLL DEPTH TRACKING
// ==========================================

/**
 * Initialize scroll depth tracking
 */
export const initializeScrollTracking = () => {
  if (typeof window === 'undefined') return

  const milestones = [25, 50, 75, 90, 100]
  const reached = new Set<number>()

  const checkScrollDepth = () => {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollPercentage = Math.round(
      ((scrollTop + windowHeight) / documentHeight) * 100
    )

    milestones.forEach((milestone) => {
      if (scrollPercentage >= milestone && !reached.has(milestone)) {
        reached.add(milestone)
        trackScrollMilestone(milestone)
      }
    })
  }

  // Throttle scroll events
  let ticking = false
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkScrollDepth()
        ticking = false
      })
      ticking = true
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  // Cleanup
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}

/**
 * Track scroll milestone
 */
const trackScrollMilestone = (percentage: number) => {
  trackEvent('scroll_depth', {
    scroll_percentage: percentage,
    page_path: window.location.pathname,
    page_title: document.title,
    event_category: 'Engagement',
    event_label: `Scroll ${percentage}%`,
  })
}

// ==========================================
// VIDEO ENGAGEMENT TRACKING
// ==========================================

export interface VideoEngagementData {
  video_id: string
  video_title: string
  video_url: string
  video_duration: number
  provider: 'youtube' | 'vimeo' | 'self_hosted'
}

/**
 * Initialize video engagement tracking
 */
export const initializeVideoTracking = (data: VideoEngagementData) => {
  const milestones = [25, 50, 75, 100]
  const reached = new Set<number>()

  return {
    onPlay: () => {
      trackVideoEvent({
        ...data,
        action: 'play',
        current_time: 0,
      })
    },

    onPause: (currentTime: number) => {
      trackVideoEvent({
        ...data,
        action: 'pause',
        current_time: currentTime,
      })
    },

    onProgress: (currentTime: number) => {
      const percentage = Math.round(
        (currentTime / data.video_duration) * 100
      )

      milestones.forEach((milestone) => {
        if (percentage >= milestone && !reached.has(milestone)) {
          reached.add(milestone)
          trackVideoEvent({
            ...data,
            action: `${milestone}%` as any,
            current_time: currentTime,
          })
        }
      })
    },

    onComplete: () => {
      trackVideoEvent({
        ...data,
        action: 'complete',
        current_time: data.video_duration,
      })
    },
  }
}

/**
 * Track video event
 */
const trackVideoEvent = (data: {
  video_id: string
  video_title: string
  video_url: string
  video_duration: number
  provider: string
  action: 'play' | 'pause' | 'complete' | '25%' | '50%' | '75%' | '100%'
  current_time: number
}) => {
  trackEvent('video_engagement', {
    video_id: data.video_id,
    video_title: data.video_title,
    video_url: data.video_url,
    video_duration: data.video_duration,
    video_provider: data.provider,
    video_action: data.action,
    video_current_time: data.current_time,
    video_percent: Math.round(
      (data.current_time / data.video_duration) * 100
    ),
    event_category: 'Video Engagement',
    event_label: `${data.video_title}: ${data.action}`,
  })
}

// ==========================================
// CONVERSION FUNNEL TRACKING
// ==========================================

export interface ConversionFunnelStep {
  step_number: number
  step_name: string
  timestamp: Date
  data?: Record<string, any>
}

/**
 * Track conversion funnel progression
 */
export class ConversionFunnel {
  private steps: ConversionFunnelStep[] = []
  private funnelType: string

  constructor(funnelType: 'quote' | 'purchase' | 'signup') {
    this.funnelType = funnelType
  }

  addStep(stepName: string, data?: Record<string, any>) {
    const step: ConversionFunnelStep = {
      step_number: this.steps.length + 1,
      step_name: stepName,
      timestamp: new Date(),
      data,
    }

    this.steps.push(step)

    trackEvent('funnel_step', {
      funnel_type: this.funnelType,
      step_number: step.step_number,
      step_name: step.step_name,
      total_steps: this.getExpectedSteps(),
      progress_percentage: this.getProgress(),
      event_category: 'Conversion Funnel',
      event_label: `${this.funnelType}: ${stepName}`,
    })
  }

  complete() {
    const duration = this.getDuration()

    trackEvent('funnel_complete', {
      funnel_type: this.funnelType,
      total_steps: this.steps.length,
      duration_seconds: duration,
      event_category: 'Conversion Funnel',
      event_label: `${this.funnelType}: Complete`,
    })
  }

  abandon(reason?: string) {
    const currentStep = this.steps[this.steps.length - 1]
    const duration = this.getDuration()

    trackEvent('funnel_abandon', {
      funnel_type: this.funnelType,
      abandonment_step: currentStep?.step_name,
      step_number: currentStep?.step_number,
      duration_seconds: duration,
      abandonment_reason: reason,
      event_category: 'Conversion Funnel',
      event_label: `${this.funnelType}: Abandoned`,
    })
  }

  private getExpectedSteps(): number {
    const expectedSteps = {
      quote: 4, // View -> Configure -> Contact Info -> Submit
      purchase: 5, // View -> Cart -> Checkout -> Payment -> Complete
      signup: 3, // Start -> Info -> Verify
    }
    return expectedSteps[this.funnelType] || 0
  }

  private getProgress(): number {
    const expected = this.getExpectedSteps()
    return expected > 0
      ? Math.round((this.steps.length / expected) * 100)
      : 0
  }

  private getDuration(): number {
    if (this.steps.length === 0) return 0
    const first = this.steps[0].timestamp.getTime()
    const last = this.steps[this.steps.length - 1].timestamp.getTime()
    return Math.round((last - first) / 1000)
  }
}

// Export all
export default {
  // Quote tracking
  trackQuoteRequestStart,
  trackQuoteRequestComplete,
  trackQuoteRequestAbandonment,

  // Phone tracking
  trackPhoneCallClick,
  setupDynamicNumberInsertion,

  // Email tracking
  trackEmailSignup,
  trackEmailVerification,

  // Product tracking
  trackProductViewEngagement,

  // Form tracking
  trackFormSubmission,
  trackFormFieldInteraction,

  // Engagement tracking
  initializeScrollTracking,
  initializeVideoTracking,

  // Funnel tracking
  ConversionFunnel,
}
