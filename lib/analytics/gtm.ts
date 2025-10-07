/**
 * Google Tag Manager Integration
 *
 * Provides GTM initialization and type-safe event tracking for PG Closets v2.
 * Includes data layer events for page views, product interactions, lead generation,
 * and user engagement tracking.
 */

import { AnalyticsProductItem, GA4EventParameters } from '@/types/analytics'

// GTM Configuration
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || ''

/**
 * Initialize GTM data layer
 */
export const initDataLayer = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
  }
}

/**
 * Core event tracking function
 *
 * @param event - Event name
 * @param params - Event parameters
 */
export const trackEvent = (event: string, params: Record<string, any> = {}) => {
  if (typeof window === 'undefined' || !GTM_ID) return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event,
    ...params,
    timestamp: new Date().toISOString(),
    // Add session data if available
    ...(sessionStorage && {
      session_id: sessionStorage.getItem('analytics_session_id')
    })
  })

  if (process.env.NODE_ENV === 'development') {
    console.log('[GTM Event]', event, params)
  }
}

/**
 * Page View Tracking
 * Track all page views with full metadata
 */
export const trackPageView = (params?: {
  page_title?: string
  page_location?: string
  page_path?: string
}) => {
  trackEvent('page_view', {
    page_title: params?.page_title || document.title,
    page_location: params?.page_location || window.location.href,
    page_path: params?.page_path || window.location.pathname,
    page_referrer: document.referrer,
    language: navigator.language,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
  })
}

/**
 * Product View Tracking (PDP)
 * Track when users view product detail pages
 */
export const trackProductView = (product: {
  id: string
  name: string
  category: string
  type: string
  brand?: string
  variant?: string
  price?: number
}) => {
  trackEvent('product_view', {
    ecommerce: {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_category2: product.type,
          item_brand: product.brand || 'Renin',
          item_variant: product.variant,
          price: product.price,
          currency: 'CAD',
        },
      ],
    },
    product_id: product.id,
    product_name: product.name,
    product_category: product.category,
    product_type: product.type,
    currency: 'CAD',
  })
}

/**
 * Product List View Tracking
 * Track when users view product listing pages
 */
export const trackProductListView = (params: {
  list_id: string
  list_name: string
  items: AnalyticsProductItem[]
}) => {
  trackEvent('view_item_list', {
    ecommerce: {
      item_list_id: params.list_id,
      item_list_name: params.list_name,
      items: params.items.map((item, index) => ({
        ...item,
        index,
        currency: 'CAD',
      })),
    },
  })
}

/**
 * Add to Quote Tracking (Variant Selection)
 * Track when users select variants or request quotes
 */
export const trackAddToQuote = (params: {
  product: {
    id: string
    name: string
    category: string
    price: number
  }
  variant?: string
  quantity?: number
  options?: Record<string, any>
}) => {
  trackEvent('add_to_quote', {
    ecommerce: {
      currency: 'CAD',
      value: params.product.price * (params.quantity || 1),
      items: [
        {
          item_id: params.product.id,
          item_name: params.product.name,
          item_category: params.product.category,
          item_variant: params.variant,
          price: params.product.price,
          quantity: params.quantity || 1,
          currency: 'CAD',
        },
      ],
    },
    product_id: params.product.id,
    variant: params.variant,
    quantity: params.quantity || 1,
    options: params.options,
  })
}

/**
 * Form Submit Tracking
 * Track all form submissions (lead forms, contact, quote requests)
 */
export const trackFormSubmit = (params: {
  form_name: string
  form_id?: string
  form_type: 'quote' | 'contact' | 'newsletter' | 'booking'
  success: boolean
  products?: string[]
  lead_value?: number
}) => {
  trackEvent('form_submit', {
    form_name: params.form_name,
    form_id: params.form_id,
    form_type: params.form_type,
    form_success: params.success,
    products: params.products,
    lead_value: params.lead_value,
    currency: 'CAD',
  })

  // Track as lead generation event if successful
  if (params.success) {
    trackEvent('generate_lead', {
      lead_type: params.form_type,
      value: params.lead_value || 0,
      currency: 'CAD',
    })
  }
}


/**
 * Email Click Tracking
 * Track mailto: link clicks
 */
export const trackEmailClick = (params: {
  email_address: string
  location?: string
  cta_text?: string
}) => {
  trackEvent('email_click', {
    email_address: params.email_address,
    location: params.location || window.location.pathname,
    cta_text: params.cta_text,
    interaction_type: 'click_to_email',
  })

  // Track as conversion event
  trackEvent('conversion', {
    conversion_type: 'email_initiated',
    value: 30, // Estimated lead value
    currency: 'CAD',
  })
}

/**
 * Search Tracking
 * Track internal site searches
 */
export const trackSearch = (params: {
  search_term: string
  search_type?: 'product' | 'content' | 'global'
  results_count?: number
  filters?: Record<string, any>
}) => {
  trackEvent('search', {
    search_term: params.search_term,
    search_type: params.search_type || 'global',
    search_results: params.results_count,
    filters: params.filters,
  })
}

/**
 * Outbound Link Tracking
 * Track clicks to external links
 */
export const trackOutboundClick = (params: {
  url: string
  link_text?: string
  link_domain?: string
}) => {
  trackEvent('outbound_click', {
    link_url: params.url,
    link_text: params.link_text,
    link_domain: params.link_domain || new URL(params.url).hostname,
    outbound: true,
  })
}

/**
 * Video Interaction Tracking
 * Track video plays, pauses, completions
 */
export const trackVideoInteraction = (params: {
  video_title: string
  video_url: string
  video_action: 'play' | 'pause' | 'complete' | 'progress'
  video_current_time?: number
  video_duration?: number
  video_percent?: number
}) => {
  trackEvent('video_interaction', {
    video_title: params.video_title,
    video_url: params.video_url,
    video_status: params.video_action,
    video_current_time: params.video_current_time,
    video_duration: params.video_duration,
    video_percent: params.video_percent,
    video_provider: 'self_hosted',
  })
}

/**
 * File Download Tracking
 * Track PDF, catalog, or other file downloads
 */
export const trackFileDownload = (params: {
  file_name: string
  file_url: string
  file_type?: string
}) => {
  const fileExtension = params.file_name.split('.').pop() || ''

  trackEvent('file_download', {
    file_name: params.file_name,
    file_extension: fileExtension,
    file_url: params.file_url,
    file_type: params.file_type || fileExtension,
  })
}

/**
 * Scroll Depth Tracking
 * Track scroll depth milestones
 */
export const trackScrollDepth = (params: {
  scroll_depth_threshold: number
  page_path?: string
}) => {
  trackEvent('scroll_depth', {
    scroll_depth_threshold: params.scroll_depth_threshold,
    page_path: params.page_path || window.location.pathname,
  })
}

/**
 * Error Tracking
 * Track JavaScript errors and exceptions
 */
export const trackError = (params: {
  error_message: string
  error_type?: string
  error_stack?: string
  fatal?: boolean
}) => {
  trackEvent('exception', {
    description: params.error_message,
    error_type: params.error_type || 'javascript_error',
    error_stack: params.error_stack,
    fatal: params.fatal || false,
    page_location: window.location.href,
  })
}

/**
 * E-commerce Purchase Tracking
 * Track completed purchases/quotes
 */
export const trackPurchase = (params: {
  transaction_id: string
  value: number
  items: AnalyticsProductItem[]
  tax?: number
  shipping?: number
  coupon?: string
}) => {
  trackEvent('purchase', {
    ecommerce: {
      transaction_id: params.transaction_id,
      value: params.value,
      currency: 'CAD',
      tax: params.tax,
      shipping: params.shipping,
      coupon: params.coupon,
      items: params.items.map((item, index) => ({
        ...item,
        index,
        currency: 'CAD',
      })),
    },
  })
}

/**
 * Custom Event Tracking
 * For tracking any custom events not covered above
 */
export const trackCustomEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  trackEvent(eventName, params)
}

/**
 * User Timing Tracking
 * Track custom performance timings
 */
export const trackTiming = (params: {
  name: string
  value: number
  category?: string
  label?: string
}) => {
  trackEvent('timing_complete', {
    name: params.name,
    value: Math.round(params.value),
    event_category: params.category || 'Performance',
    event_label: params.label,
  })
}

/**
 * Get lowest price from product for tracking
 */
export const getLowestPrice = (product: any): number => {
  if (!product.variants || product.variants.length === 0) return 0
  return Math.min(...product.variants.map((v: any) => v.priceCAD || 0))
}
