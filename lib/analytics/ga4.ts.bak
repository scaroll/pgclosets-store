/**
 * Google Analytics 4 Configuration
 *
 * GA4-specific configuration, custom events, user properties,
 * and enhanced measurement settings for PG Closets v2.
 */

// GA4 Measurement ID
export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || ''

/**
 * GA4 Configuration Options
 */
export interface GA4Config {
  // Privacy and consent
  anonymize_ip?: boolean
  allow_google_signals?: boolean
  allow_ad_personalization_signals?: boolean

  // Cookie settings
  cookie_domain?: string
  cookie_expires?: number
  cookie_prefix?: string
  cookie_update?: boolean
  cookie_flags?: string

  // Content grouping
  content_group?: string

  // Custom dimensions
  custom_map?: Record<string, string>

  // Page view settings
  send_page_view?: boolean
  page_title?: string
  page_location?: string
  page_path?: string

  // Debug mode
  debug_mode?: boolean

  // User properties
  user_id?: string
  user_properties?: Record<string, any>
}

/**
 * Initialize GA4 with configuration
 */
export const initGA4 = (config: GA4Config = {}) => {
  if (typeof window === 'undefined' || !GA4_MEASUREMENT_ID) return

  const defaultConfig: GA4Config = {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_domain: 'auto',
    cookie_expires: 63072000, // 2 years in seconds
    cookie_update: true,
    send_page_view: true,
    debug_mode: process.env.NODE_ENV === 'development',
  }

  const finalConfig = { ...defaultConfig, ...config }

  // Initialize gtag
  window.gtag = window.gtag || function() {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', GA4_MEASUREMENT_ID, finalConfig)

  if (process.env.NODE_ENV === 'development') {
    console.log('[GA4] Initialized with config:', finalConfig)
  }
}

/**
 * Set user properties
 */
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('set', 'user_properties', properties)

  if (process.env.NODE_ENV === 'development') {
    console.log('[GA4] User properties set:', properties)
  }
}

/**
 * Set user ID for cross-device tracking
 */
export const setUserId = (userId: string | null) => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('config', GA4_MEASUREMENT_ID, {
    user_id: userId,
  })

  if (process.env.NODE_ENV === 'development') {
    console.log('[GA4] User ID set:', userId)
  }
}

/**
 * Configure consent mode (GDPR compliance)
 */
export const updateConsentMode = (consent: {
  analytics_storage?: 'granted' | 'denied'
  ad_storage?: 'granted' | 'denied'
  ad_user_data?: 'granted' | 'denied'
  ad_personalization?: 'granted' | 'denied'
  functionality_storage?: 'granted' | 'denied'
  personalization_storage?: 'granted' | 'denied'
  security_storage?: 'granted' | 'denied'
}) => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('consent', 'update', consent)

  if (process.env.NODE_ENV === 'development') {
    console.log('[GA4] Consent updated:', consent)
  }
}

/**
 * Set default consent mode (before user interaction)
 */
export const setDefaultConsent = (consent: {
  analytics_storage?: 'granted' | 'denied'
  ad_storage?: 'granted' | 'denied'
  ad_user_data?: 'granted' | 'denied'
  ad_personalization?: 'granted' | 'denied'
  functionality_storage?: 'granted' | 'denied'
  personalization_storage?: 'granted' | 'denied'
  security_storage?: 'granted' | 'denied'
  wait_for_update?: number
}) => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('consent', 'default', consent)

  if (process.env.NODE_ENV === 'development') {
    console.log('[GA4] Default consent set:', consent)
  }
}

/**
 * Enhanced Measurement Configuration
 * These are automatically tracked by GA4 when enabled
 */
export interface EnhancedMeasurementConfig {
  page_changes: boolean        // Page view changes (SPA)
  scrolls: boolean             // Scroll depth (90%)
  outbound_clicks: boolean     // Clicks to external domains
  site_search: boolean         // Site search
  video_engagement: boolean    // YouTube video engagement
  file_downloads: boolean      // PDF, docx, xlsx, etc.
}

/**
 * Configure enhanced measurement
 * Note: This is typically done in GA4 admin UI, but can be verified here
 */
export const enhancedMeasurementConfig: EnhancedMeasurementConfig = {
  page_changes: true,
  scrolls: true,
  outbound_clicks: true,
  site_search: true,
  video_engagement: true,
  file_downloads: true,
}

/**
 * Custom Event Definitions
 * Define custom events with their parameters
 */
export const customEvents = {
  // Lead generation events
  quote_request: {
    event_category: 'Lead Generation',
    event_label: 'Quote Request Form',
  },
  consultation_booking: {
    event_category: 'Lead Generation',
    event_label: 'Consultation Booking',
  },
  phone_call_initiated: {
    event_category: 'Lead Generation',
    event_label: 'Phone Call Click',
  },
  email_initiated: {
    event_category: 'Lead Generation',
    event_label: 'Email Click',
  },

  // Product engagement events
  product_comparison: {
    event_category: 'Product Engagement',
    event_label: 'Product Comparison',
  },
  product_share: {
    event_category: 'Product Engagement',
    event_label: 'Product Share',
  },
  variant_selection: {
    event_category: 'Product Engagement',
    event_label: 'Variant Selection',
  },
  installation_addon_selected: {
    event_category: 'Product Engagement',
    event_label: 'Installation Add-on',
  },

  // Content engagement events
  video_interaction: {
    event_category: 'Content Engagement',
    event_label: 'Video Interaction',
  },
  gallery_interaction: {
    event_category: 'Content Engagement',
    event_label: 'Image Gallery',
  },
  review_interaction: {
    event_category: 'Content Engagement',
    event_label: 'Customer Review',
  },

  // Navigation events
  menu_interaction: {
    event_category: 'Navigation',
    event_label: 'Menu Click',
  },
  filter_applied: {
    event_category: 'Navigation',
    event_label: 'Product Filter',
  },
  search_performed: {
    event_category: 'Navigation',
    event_label: 'Site Search',
  },

  // Error events
  form_error: {
    event_category: 'Errors',
    event_label: 'Form Validation Error',
  },
  page_error: {
    event_category: 'Errors',
    event_label: 'Page Error',
  },
  api_error: {
    event_category: 'Errors',
    event_label: 'API Error',
  },
} as const

/**
 * Conversion Events
 * Define key conversion events for goal tracking
 */
export const conversionEvents = [
  'quote_request',
  'consultation_booking',
  'phone_call_initiated',
  'email_initiated',
  'form_submit',
  'generate_lead',
] as const

/**
 * User Properties
 * Define custom user properties for segmentation
 */
export interface UserProperties {
  customer_type?: 'new' | 'returning' | 'lead'
  service_area?: string
  preferred_category?: string
  price_range?: 'budget' | 'mid' | 'premium'
  visit_count?: number
  last_visit_date?: string
  lifetime_value?: number
}

/**
 * Set custom user properties
 */
export const setCustomUserProperties = (properties: UserProperties) => {
  setUserProperties(properties)
}

/**
 * Track conversion event
 */
export const trackConversion = (
  conversionName: typeof conversionEvents[number],
  value?: number,
  params?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', conversionName, {
    value: value || 0,
    currency: 'CAD',
    ...params,
  })

  if (process.env.NODE_ENV === 'development') {
    console.log('[GA4] Conversion tracked:', conversionName, value, params)
  }
}

/**
 * Debug mode helpers
 */
export const enableDebugMode = () => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('config', GA4_MEASUREMENT_ID, {
    debug_mode: true,
  })

  console.log('[GA4] Debug mode enabled')
}

export const disableDebugMode = () => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('config', GA4_MEASUREMENT_ID, {
    debug_mode: false,
  })

  console.log('[GA4] Debug mode disabled')
}

/**
 * Opt-out of GA4 tracking
 */
export const optOut = () => {
  if (typeof window === 'undefined') return

  const disableStr = `ga-disable-${GA4_MEASUREMENT_ID}`
  window[disableStr] = true

  console.log('[GA4] Tracking disabled')
}

/**
 * Opt-in to GA4 tracking
 */
export const optIn = () => {
  if (typeof window === 'undefined') return

  const disableStr = `ga-disable-${GA4_MEASUREMENT_ID}`
  window[disableStr] = false

  console.log('[GA4] Tracking enabled')
}

/**
 * Check if tracking is enabled
 */
export const isTrackingEnabled = (): boolean => {
  if (typeof window === 'undefined') return false

  const disableStr = `ga-disable-${GA4_MEASUREMENT_ID}`
  return !window[disableStr]
}
