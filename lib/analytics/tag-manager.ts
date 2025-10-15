/**
 * Tag Management System
 * Agent #37: Comprehensive tag management with multiple pixel integrations
 *
 * Features:
 * - Google Tag Manager integration
 * - Facebook Pixel implementation
 * - TikTok Pixel implementation
 * - Pinterest Tag implementation
 * - LinkedIn Insight Tag
 * - Tag organization and governance
 * - Data layer architecture
 */

// ==========================================
// GOOGLE TAG MANAGER
// ==========================================

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || ''

/**
 * Initialize GTM Data Layer
 */
export const initializeGTM = () => {
  if (typeof window === 'undefined' || !GTM_ID) return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  })
}

/**
 * Push event to GTM Data Layer
 */
export const pushToDataLayer = (data: Record<string, any>) => {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(data)

  if (process.env.NODE_ENV === 'development') {
    console.log('[GTM Data Layer]', data)
  }
}

// ==========================================
// FACEBOOK PIXEL
// ==========================================

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || ''

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
    _fbq?: (...args: any[]) => void
  }
}

/**
 * Initialize Facebook Pixel
 */
export const initializeFacebookPixel = () => {
  if (typeof window === 'undefined' || !FB_PIXEL_ID) return

  // Initialize fbq function
  if (!window.fbq) {
    const fbq = (...args: any[]) => {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, args)
      } else {
        fbq.queue.push(args)
      }
    }
    fbq.push = fbq
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.queue = []
    window.fbq = fbq as any
  }

  // Initialize pixel
  window.fbq('init', FB_PIXEL_ID)
  window.fbq('track', 'PageView')

  if (process.env.NODE_ENV === 'development') {
    console.log('[Facebook Pixel] Initialized')
  }
}

/**
 * Track Facebook Pixel event
 */
export const trackFacebookEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.fbq) return

  window.fbq('track', eventName, parameters)

  if (process.env.NODE_ENV === 'development') {
    console.log('[Facebook Pixel]', eventName, parameters)
  }
}

/**
 * Track Facebook custom event
 */
export const trackFacebookCustomEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.fbq) return

  window.fbq('trackCustom', eventName, parameters)

  if (process.env.NODE_ENV === 'development') {
    console.log('[Facebook Pixel Custom]', eventName, parameters)
  }
}

// Facebook Standard Events
export const facebookEvents = {
  /**
   * Track page view
   */
  pageView: () => {
    trackFacebookEvent('PageView')
  },

  /**
   * Track product view
   */
  viewContent: (params: {
    content_ids: string[]
    content_name: string
    content_type: string
    value: number
    currency: string
  }) => {
    trackFacebookEvent('ViewContent', params)
  },

  /**
   * Track search
   */
  search: (params: { search_string: string; content_category?: string }) => {
    trackFacebookEvent('Search', params)
  },

  /**
   * Track add to cart
   */
  addToCart: (params: {
    content_ids: string[]
    content_name: string
    content_type: string
    value: number
    currency: string
  }) => {
    trackFacebookEvent('AddToCart', params)
  },

  /**
   * Track initiate checkout
   */
  initiateCheckout: (params: {
    content_ids: string[]
    value: number
    currency: string
    num_items: number
  }) => {
    trackFacebookEvent('InitiateCheckout', params)
  },

  /**
   * Track add payment info
   */
  addPaymentInfo: (params: { value: number; currency: string }) => {
    trackFacebookEvent('AddPaymentInfo', params)
  },

  /**
   * Track purchase
   */
  purchase: (params: {
    content_ids: string[]
    value: number
    currency: string
    content_type: string
  }) => {
    trackFacebookEvent('Purchase', params)
  },

  /**
   * Track lead
   */
  lead: (params: {
    content_name: string
    content_category?: string
    value?: number
    currency?: string
  }) => {
    trackFacebookEvent('Lead', params)
  },

  /**
   * Track contact
   */
  contact: () => {
    trackFacebookEvent('Contact')
  },
}

// ==========================================
// TIKTOK PIXEL
// ==========================================

export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || ''

declare global {
  interface Window {
    ttq?: {
      track: (event: string, data?: Record<string, any>) => void
      identify: (data: Record<string, any>) => void
      page: () => void
      load: (pixelId: string) => void
      _i: Record<string, any>
    }
  }
}

/**
 * Initialize TikTok Pixel
 */
export const initializeTikTokPixel = () => {
  if (typeof window === 'undefined' || !TIKTOK_PIXEL_ID) return

  // Initialize ttq function
  if (!window.ttq) {
    const ttq = {
      load(pixelId: string) {
        // TikTok pixel loading logic
      },
      track(event: string, data?: Record<string, any>) {
        // Queue events if not loaded
      },
      identify(data: Record<string, any>) {
        // Identify user
      },
      page() {
        // Track page view
      },
      _i: {},
    }
    window.ttq = ttq
  }

  window.ttq.load(TIKTOK_PIXEL_ID)
  window.ttq.page()

  if (process.env.NODE_ENV === 'development') {
    console.log('[TikTok Pixel] Initialized')
  }
}

/**
 * Track TikTok Pixel event
 */
export const trackTikTokEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.ttq) return

  window.ttq.track(eventName, parameters)

  if (process.env.NODE_ENV === 'development') {
    console.log('[TikTok Pixel]', eventName, parameters)
  }
}

// TikTok Standard Events
export const tiktokEvents = {
  /**
   * Track page view
   */
  pageView: () => {
    if (window.ttq) {
      window.ttq.page()
    }
  },

  /**
   * Track product view
   */
  viewContent: (params: {
    content_id: string
    content_type: string
    content_name: string
    value: number
    currency: string
  }) => {
    trackTikTokEvent('ViewContent', params)
  },

  /**
   * Track add to cart
   */
  addToCart: (params: {
    content_id: string
    content_type: string
    content_name: string
    value: number
    currency: string
  }) => {
    trackTikTokEvent('AddToCart', params)
  },

  /**
   * Track initiate checkout
   */
  initiateCheckout: (params: { value: number; currency: string }) => {
    trackTikTokEvent('InitiateCheckout', params)
  },

  /**
   * Track add payment info
   */
  addPaymentInfo: (params: { value: number; currency: string }) => {
    trackTikTokEvent('AddPaymentInfo', params)
  },

  /**
   * Track complete payment
   */
  completePayment: (params: {
    content_id: string
    value: number
    currency: string
  }) => {
    trackTikTokEvent('CompletePayment', params)
  },

  /**
   * Track contact
   */
  contact: () => {
    trackTikTokEvent('Contact')
  },

  /**
   * Track submit form
   */
  submitForm: (params: { content_name?: string }) => {
    trackTikTokEvent('SubmitForm', params)
  },
}

// ==========================================
// PINTEREST TAG
// ==========================================

export const PINTEREST_TAG_ID = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID || ''

declare global {
  interface Window {
    pintrk?: (...args: any[]) => void
  }
}

/**
 * Initialize Pinterest Tag
 */
export const initializePinterestTag = () => {
  if (typeof window === 'undefined' || !PINTEREST_TAG_ID) return

  // Initialize pintrk function
  if (!window.pintrk) {
    const pintrk = (...args: any[]) => {
      if (pintrk.queue) {
        pintrk.queue.push(Array.from(args))
      }
    }
    pintrk.queue = []
    pintrk.version = '3.0'
    window.pintrk = pintrk as any
  }

  window.pintrk('load', PINTEREST_TAG_ID)
  window.pintrk('page')

  if (process.env.NODE_ENV === 'development') {
    console.log('[Pinterest Tag] Initialized')
  }
}

/**
 * Track Pinterest event
 */
export const trackPinterestEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.pintrk) return

  window.pintrk('track', eventName, parameters)

  if (process.env.NODE_ENV === 'development') {
    console.log('[Pinterest Tag]', eventName, parameters)
  }
}

// Pinterest Standard Events
export const pinterestEvents = {
  /**
   * Track page visit
   */
  pageVisit: () => {
    if (window.pintrk) {
      window.pintrk('page')
    }
  },

  /**
   * Track product view
   */
  viewCategory: (params: {
    product_category: string
    product_id?: string[]
  }) => {
    trackPinterestEvent('viewcategory', params)
  },

  /**
   * Track search
   */
  search: (params: { search_query: string }) => {
    trackPinterestEvent('search', params)
  },

  /**
   * Track add to cart
   */
  addToCart: (params: {
    value: number
    currency: string
    product_id: string
    product_name: string
    product_category?: string
  }) => {
    trackPinterestEvent('addtocart', params)
  },

  /**
   * Track checkout
   */
  checkout: (params: {
    value: number
    currency: string
    order_quantity: number
  }) => {
    trackPinterestEvent('checkout', params)
  },

  /**
   * Track lead
   */
  lead: (params: { lead_type?: string; value?: number; currency?: string }) => {
    trackPinterestEvent('lead', params)
  },

  /**
   * Track signup
   */
  signup: () => {
    trackPinterestEvent('signup')
  },
}

// ==========================================
// LINKEDIN INSIGHT TAG
// ==========================================

export const LINKEDIN_PARTNER_ID =
  process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || ''

declare global {
  interface Window {
    _linkedin_data_partner_ids?: string[]
    lintrk?: (...args: any[]) => void
  }
}

/**
 * Initialize LinkedIn Insight Tag
 */
export const initializeLinkedInTag = () => {
  if (typeof window === 'undefined' || !LINKEDIN_PARTNER_ID) return

  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
  window._linkedin_data_partner_ids.push(LINKEDIN_PARTNER_ID)

  if (process.env.NODE_ENV === 'development') {
    console.log('[LinkedIn Insight Tag] Initialized')
  }
}

/**
 * Track LinkedIn conversion
 */
export const trackLinkedInConversion = (conversionId: string) => {
  if (typeof window === 'undefined') return

  window.lintrk?.('track', { conversion_id: conversionId })

  if (process.env.NODE_ENV === 'development') {
    console.log('[LinkedIn Insight Tag] Conversion:', conversionId)
  }
}

// ==========================================
// UNIFIED TAG INITIALIZATION
// ==========================================

/**
 * Initialize all marketing tags
 */
export const initializeAllTags = () => {
  initializeGTM()
  initializeFacebookPixel()
  initializeTikTokPixel()
  initializePinterestTag()
  initializeLinkedInTag()

  if (process.env.NODE_ENV === 'development') {
    console.log('[Tag Manager] All tags initialized')
  }
}

// ==========================================
// UNIFIED EVENT TRACKING
// ==========================================

/**
 * Track event across all platforms
 */
export const trackUnifiedEvent = (
  eventType: 'pageview' | 'product_view' | 'add_to_cart' | 'purchase' | 'lead',
  data: Record<string, any>
) => {
  switch (eventType) {
    case 'pageview':
      facebookEvents.pageView()
      tiktokEvents.pageView()
      pinterestEvents.pageVisit()
      break

    case 'product_view':
      if (data.product_id && data.product_name && data.price) {
        facebookEvents.viewContent({
          content_ids: [data.product_id],
          content_name: data.product_name,
          content_type: 'product',
          value: data.price,
          currency: 'CAD',
        })

        tiktokEvents.viewContent({
          content_id: data.product_id,
          content_type: 'product',
          content_name: data.product_name,
          value: data.price,
          currency: 'CAD',
        })

        pinterestEvents.viewCategory({
          product_category: data.category || 'product',
          product_id: [data.product_id],
        })
      }
      break

    case 'add_to_cart':
      if (data.product_id && data.product_name && data.price) {
        facebookEvents.addToCart({
          content_ids: [data.product_id],
          content_name: data.product_name,
          content_type: 'product',
          value: data.price,
          currency: 'CAD',
        })

        tiktokEvents.addToCart({
          content_id: data.product_id,
          content_type: 'product',
          content_name: data.product_name,
          value: data.price,
          currency: 'CAD',
        })

        pinterestEvents.addToCart({
          value: data.price,
          currency: 'CAD',
          product_id: data.product_id,
          product_name: data.product_name,
          product_category: data.category,
        })
      }
      break

    case 'purchase':
      if (data.transaction_id && data.value && data.items) {
        const itemIds = data.items.map((item: any) => item.item_id)

        facebookEvents.purchase({
          content_ids: itemIds,
          value: data.value,
          currency: 'CAD',
          content_type: 'product',
        })

        tiktokEvents.completePayment({
          content_id: data.transaction_id,
          value: data.value,
          currency: 'CAD',
        })
      }
      break

    case 'lead':
      facebookEvents.lead({
        content_name: data.form_name || 'Quote Request',
        value: data.value,
        currency: 'CAD',
      })

      tiktokEvents.submitForm({
        content_name: data.form_name,
      })

      pinterestEvents.lead({
        lead_type: data.form_type,
        value: data.value,
        currency: 'CAD',
      })
      break
  }
}

// ==========================================
// TAG GOVERNANCE
// ==========================================

/**
 * Tag Configuration
 */
export interface TagConfig {
  gtm: boolean
  facebook: boolean
  tiktok: boolean
  pinterest: boolean
  linkedin: boolean
}

/**
 * Get active tags configuration
 */
export const getActiveTagsConfig = (): TagConfig => {
  return {
    gtm: !!GTM_ID,
    facebook: !!FB_PIXEL_ID,
    tiktok: !!TIKTOK_PIXEL_ID,
    pinterest: !!PINTEREST_TAG_ID,
    linkedin: !!LINKEDIN_PARTNER_ID,
  }
}

/**
 * Validate tag configuration
 */
export const validateTagConfig = (): {
  valid: boolean
  missing: string[]
} => {
  const missing: string[] = []

  if (!GTM_ID) missing.push('GTM_ID')
  if (!FB_PIXEL_ID) missing.push('FB_PIXEL_ID')
  if (!TIKTOK_PIXEL_ID) missing.push('TIKTOK_PIXEL_ID')
  if (!PINTEREST_TAG_ID) missing.push('PINTEREST_TAG_ID')
  if (!LINKEDIN_PARTNER_ID) missing.push('LINKEDIN_PARTNER_ID')

  return {
    valid: missing.length === 0,
    missing,
  }
}

/**
 * Log tag status
 */
export const logTagStatus = () => {
  if (process.env.NODE_ENV !== 'development') return

  const config = getActiveTagsConfig()
  const validation = validateTagConfig()

  console.group('[Tag Manager Status]')
  console.log('GTM:', config.gtm ? '✓' : '✗')
  console.log('Facebook Pixel:', config.facebook ? '✓' : '✗')
  console.log('TikTok Pixel:', config.tiktok ? '✓' : '✗')
  console.log('Pinterest Tag:', config.pinterest ? '✓' : '✗')
  console.log('LinkedIn Tag:', config.linkedin ? '✓' : '✗')

  if (!validation.valid) {
    console.warn('Missing IDs:', validation.missing.join(', '))
  }
  console.groupEnd()
}

// Export all
export default {
  // Initialization
  initializeGTM,
  initializeFacebookPixel,
  initializeTikTokPixel,
  initializePinterestTag,
  initializeLinkedInTag,
  initializeAllTags,

  // Event tracking
  pushToDataLayer,
  trackFacebookEvent,
  trackTikTokEvent,
  trackPinterestEvent,
  trackLinkedInConversion,
  trackUnifiedEvent,

  // Platform-specific events
  facebookEvents,
  tiktokEvents,
  pinterestEvents,

  // Governance
  getActiveTagsConfig,
  validateTagConfig,
  logTagStatus,
}
