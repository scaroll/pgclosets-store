/**
 * GA4 Event Tracking Helpers for PG Closets
 *
 * Provides easy-to-use event tracking functions for common user interactions.
 * Integrates with both GTM dataLayer and GA4 gtag for comprehensive tracking.
 */

import { trackEvent as gtmTrackEvent } from './gtm'

// Re-export trackEvent for components that need direct access
export { trackEvent } from './gtm'

/**
 * Track CTA click events
 */
export const trackCTAClick = (params: {
  location: 'grid' | 'pdp' | 'header' | 'hero' | 'footer' | 'sticky_mobile' | 'quote_page' | 'request_work'
  label: 'get_quote' | 'book_measurement' | 'email_us' | 'view_details' | 'add_to_cart'
  product_id?: string
  product_name?: string
}) => {
  gtmTrackEvent('cta_click', {
    cta_location: params.location,
    cta_label: params.label,
    product_id: params.product_id,
    product_name: params.product_name,
    event_category: 'User Engagement',
    event_label: `${params.location}_${params.label}`,
  })

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] CTA Click:', params)
  }
}

/**
 * Track sticky mobile CTA clicks (PDP)
 */
export const trackStickyMobileCTA = (params: {
  product_id: string
  product_name: string
}) => {
  trackCTAClick({
    location: 'sticky_mobile',
    label: 'get_quote',
    product_id: params.product_id,
    product_name: params.product_name,
  })

  gtmTrackEvent('sticky_cta_click', {
    product_id: params.product_id,
    product_name: params.product_name,
    event_category: 'User Engagement',
    event_label: 'Mobile Sticky CTA',
  })
}

/**
 * Track quote form events
 */
export const trackQuoteStart = (params?: {
  source?: 'pdp' | 'quote_page' | 'header' | 'hero'
  product_id?: string
  product_name?: string
  door_type?: string
  opening_width?: number
  opening_height?: number
  panel_count?: number
  finish?: string
  soft_close?: boolean
  quantity?: number
}) => {
  gtmTrackEvent('quote_start', {
    source: params?.source || 'unknown',
    product_id: params?.product_id,
    product_name: params?.product_name,
    // Core fields only - no PII
    door_type: params?.door_type,
    opening_width: params?.opening_width,
    opening_height: params?.opening_height,
    panel_count: params?.panel_count,
    finish: params?.finish,
    soft_close: params?.soft_close,
    quantity: params?.quantity,
    event_category: 'Lead Generation',
    event_label: 'Quote Form Started',
  })
}

export const trackQuoteSubmit = (params: {
  form_id: string
  products?: string[]
  total_value?: number
  success: boolean
  door_type?: string
  opening_width?: number
  opening_height?: number
  panel_count?: number
  finish?: string
  soft_close?: boolean
  quantity?: number
}) => {
  gtmTrackEvent('quote_submit', {
    form_id: params.form_id,
    products: params.products,
    total_value: params.total_value,
    success: params.success,
    // Core fields only - no PII
    door_type: params?.door_type,
    opening_width: params?.opening_width,
    opening_height: params?.opening_height,
    panel_count: params?.panel_count,
    finish: params?.finish,
    soft_close: params?.soft_close,
    quantity: params?.quantity,
    event_category: 'Lead Generation',
    event_label: params.success ? 'Quote Submitted Successfully' : 'Quote Submission Failed',
  })

  // Track as conversion if successful
  if (params.success) {
    gtmTrackEvent('conversion', {
      conversion_type: 'quote_request',
      value: params.total_value || 0,
      currency: 'CAD',
    })
  }
}

/**
 * Track filter and sort interactions
 */
export const trackFilterApply = (params: {
  filter_type: string
  filter_value: string
  results_count?: number
}) => {
  gtmTrackEvent('filter_apply', {
    filter_type: params.filter_type,
    filter_value: params.filter_value,
    results_count: params.results_count,
    event_category: 'Product Discovery',
    event_label: `Filter: ${params.filter_type}`,
  })
}

export const trackSortChange = (params: {
  sort_type: string
  sort_direction: 'asc' | 'desc'
}) => {
  gtmTrackEvent('sort_change', {
    sort_type: params.sort_type,
    sort_direction: params.sort_direction,
    event_category: 'Product Discovery',
    event_label: `Sort: ${params.sort_type}`,
  })
}

/**
 * Track measurement helper interactions
 */
export const trackMeasurementHelperClick = (params: {
  location: 'pdp' | 'quote_page' | 'request_work'
}) => {
  gtmTrackEvent('measurement_helper_click', {
    location: params.location,
    event_category: 'User Assistance',
    event_label: 'Measurement Guide Clicked',
  })
}

/**
 * Track social proof views
 */
export const trackSocialProofView = (params: {
  location: 'pdp' | 'hero' | 'quote_page'
  proof_type: 'rating' | 'installs' | 'bbb' | 'warranty'
}) => {
  gtmTrackEvent('social_proof_view', {
    location: params.location,
    proof_type: params.proof_type,
    event_category: 'Trust Signals',
    event_label: `Social Proof: ${params.proof_type}`,
  })
}

/**
 * Track reassurance copy views
 */
export const trackReassuranceCopyView = (params: {
  location: 'pdp' | 'quote_page' | 'request_work'
  copy_type: 'no_obligation' | 'reply_24h' | 'both'
}) => {
  gtmTrackEvent('reassurance_copy_view', {
    location: params.location,
    copy_type: params.copy_type,
    event_category: 'Trust Signals',
    event_label: `Reassurance Copy: ${params.copy_type}`,
  })
}

/**
 * Track grid card interactions
 */
export const trackGridCardView = (params: {
  product_id: string
  product_name: string
  position: number
  list_name: string
}) => {
  gtmTrackEvent('grid_card_view', {
    product_id: params.product_id,
    product_name: params.product_name,
    position: params.position,
    list_name: params.list_name,
    event_category: 'Product Discovery',
    event_label: 'Grid Card Viewed',
  })
}

export const trackGridCardCTAClick = (params: {
  product_id: string
  product_name: string
  cta_type: 'get_quote' | 'view_details'
  position: number
}) => {
  gtmTrackEvent('grid_card_cta_click', {
    product_id: params.product_id,
    product_name: params.product_name,
    cta_type: params.cta_type,
    position: params.position,
    event_category: 'User Engagement',
    event_label: `Grid Card CTA: ${params.cta_type}`,
  })

  // Also track as generic CTA click
  trackCTAClick({
    location: 'grid',
    label: params.cta_type === 'get_quote' ? 'get_quote' : 'view_details',
    product_id: params.product_id,
    product_name: params.product_name,
  })
}

/**
 * Helper to initialize session tracking
 */
export const initSessionTracking = () => {
  if (typeof window === 'undefined') return

  // Create session ID if not exists
  if (!sessionStorage.getItem('analytics_session_id')) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
    sessionStorage.setItem('analytics_session_start', new Date().toISOString())
  }
}

/**
 * Helper to get current session data
 */
export const getSessionData = () => {
  if (typeof window === 'undefined') return null

  return {
    session_id: sessionStorage.getItem('analytics_session_id'),
    session_start: sessionStorage.getItem('analytics_session_start'),
    session_duration: sessionStorage.getItem('analytics_session_start')
      ? Date.now() - new Date(sessionStorage.getItem('analytics_session_start')!).getTime()
      : 0,
  }
}
