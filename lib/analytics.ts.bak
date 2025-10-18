// Analytics Core Library - GA4 Enhanced E-commerce & GDPR Compliance
// Comprehensive tracking for PG Closets Store with privacy-first design

import type {
  AnalyticsProductItem,
  AnalyticsPurchaseEvent,
  AnalyticsAddToCartEvent,
  AnalyticsBeginCheckoutEvent,
  AnalyticsViewItemEvent,
  AnalyticsViewItemListEvent,
  GA4EventParameters,
  CookieConsentPreferences,
  UserJourneyStep,
  LeadAnalyticsData,
  AnalyticsError,
  WebVitalsMetrics
} from '../types/analytics';



// Global Analytics Configuration
interface AnalyticsConfig {
  measurementId: string
  debug: boolean
  anonymizeIP: boolean
  enableAdvancedMatching: boolean
  cookieFlags: string
  customDimensions: Record<string, string>
  enableConsentMode: boolean
}

class Analytics {
  private config: AnalyticsConfig
  private isInitialized = false
  private consentPreferences: CookieConsentPreferences | null = null
  private sessionId: string
  private userId?: string
  private userJourney: UserJourneyStep[] = []
  private cartAbandonmentTimer?: NodeJS.Timeout

  constructor(config: Partial<AnalyticsConfig>) {
    this.config = {
      measurementId: '',
      debug: false,
      anonymizeIP: true,
      enableAdvancedMatching: false,
      cookieFlags: 'SameSite=Strict; Secure',
      customDimensions: {},
      enableConsentMode: true,
      ...config
    }

    this.sessionId = this.generateSessionId()
    this.initialize()
  }

  // Initialize Google Analytics with consent mode
  private initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function() { window.dataLayer.push(arguments) }

    // Configure consent mode BEFORE loading gtag
    if (this.config.enableConsentMode) {
      this.gtag('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted',
        wait_for_update: 500
      })
    }

    // Load Google Analytics
    this.gtag('js', new Date())
    this.gtag('config', this.config.measurementId, {
      anonymize_ip: this.config.anonymizeIP,
      send_page_view: false, // We'll send manually for better control
      debug_mode: this.config.debug,
      custom_map: this.config.customDimensions,
      allow_enhanced_conversions: this.config.enableAdvancedMatching,
      cookie_flags: this.config.cookieFlags
    })

    this.isInitialized = true
    this.trackPageView() // Track initial page view
  }

  // Utility function for gtag calls
  private gtag(...args: any[]): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag(...args)
    }
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // GDPR Consent Management
  public updateConsentPreferences(preferences: CookieConsentPreferences): void {
    this.consentPreferences = preferences

    if (this.config.enableConsentMode) {
      this.gtag('consent', 'update', {
        ad_storage: preferences.marketing ? 'granted' : 'denied',
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        functionality_storage: preferences.functional ? 'granted' : 'denied',
        personalization_storage: preferences.marketing ? 'granted' : 'denied'
      })
    }

    // Store consent preferences
    localStorage.setItem('analytics_consent', JSON.stringify({
      preferences,
      timestamp: Date.now(),
      version: '1.0'
    }))
  }

  public getConsentPreferences(): CookieConsentPreferences | null {
    try {
      const stored = localStorage.getItem('analytics_consent')
      if (stored) {
        const { preferences } = JSON.parse(stored)
        return preferences
      }
    } catch (error) {
      console.warn('Failed to get consent preferences:', error)
    }
    return null
  }

  public hasAnalyticsConsent(): boolean {
    const preferences = this.getConsentPreferences()
    return preferences?.analytics === true
  }

  // Core Page Tracking
  public trackPageView(path?: string, title?: string): void {
    if (!this.hasAnalyticsConsent()) return

    const pageData: GA4EventParameters = {
      page_title: title || document.title,
      page_location: window.location.href,
      page_referrer: document.referrer,
      content_group1: this.getContentGroup(path || window.location.pathname),
      content_group2: this.getDeviceType(),
      content_group3: this.getTrafficSource(),
      engagement_time_msec: 0
    }

    this.gtag('event', 'page_view', pageData)
    this.addToUserJourney('page_view', pageData.page_location || '', 0)
  }

  // E-commerce Tracking
  public trackPurchase(data: AnalyticsPurchaseEvent): void {
    if (!this.hasAnalyticsConsent()) return

    // Enhanced e-commerce purchase event
    this.gtag('event', 'purchase', {
      transaction_id: data.transaction_id,
      value: data.value,
      currency: data.currency || 'CAD',
      tax: data.tax || 0,
      shipping: data.shipping || 0,
      coupon: data.coupon,
      affiliation: data.affiliation || 'PG Closets Store',
      items: data.items.map(this.formatProductItem),
      // Custom dimensions
      payment_method: data.payment_method,
      shipping_tier: data.shipping_tier,
      customer_ltv: this.calculateCustomerLTV(data.user_id),
      order_type: this.getOrderType(data.items)
    })

    // Track revenue goal
    this.gtag('event', 'conversion', {
      send_to: `${this.config.measurementId}/purchase`,
      value: data.value,
      currency: data.currency || 'CAD'
    })

    this.addToUserJourney('purchase', data.transaction_id, data.value)
  }

  public trackAddToCart(data: AnalyticsAddToCartEvent): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'add_to_cart', {
      currency: data.currency || 'CAD',
      value: data.value,
      items: data.items.map(this.formatProductItem)
    })

    // Start cart abandonment tracking
    this.startCartAbandonmentTracking(data.items, data.value)
    this.addToUserJourney('add_to_cart', 'cart', data.value)
  }

  public trackRemoveFromCart(data: AnalyticsAddToCartEvent): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'remove_from_cart', {
      currency: data.currency || 'CAD',
      value: data.value,
      items: data.items.map(this.formatProductItem)
    })

    this.addToUserJourney('remove_from_cart', 'cart', -data.value)
  }

  public trackBeginCheckout(data: AnalyticsBeginCheckoutEvent): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'begin_checkout', {
      currency: data.currency || 'CAD',
      value: data.value,
      items: data.items.map(this.formatProductItem),
      coupon: data.coupon,
      payment_method: data.payment_method,
      shipping_tier: data.shipping_tier
    })

    // Clear cart abandonment tracking as user progressed
    this.clearCartAbandonmentTracking()
    this.addToUserJourney('begin_checkout', 'checkout', data.value)
  }

  public trackViewItem(data: AnalyticsViewItemEvent): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'view_item', {
      currency: data.currency || 'CAD',
      value: data.value || data.price,
      items: [{
        item_id: data.item_id,
        item_name: data.item_name,
        item_category: data.item_category,
        price: data.price,
        item_brand: data.item_brand || 'PG Closets',
        item_variant: data.item_variant,
        quantity: 1
      }]
    })

    this.addToUserJourney('view_item', data.item_id, data.price)
  }

  public trackViewItemList(data: AnalyticsViewItemListEvent): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'view_item_list', {
      item_list_id: data.item_list_id,
      item_list_name: data.item_list_name,
      items: data.items.map(this.formatProductItem)
    })

    this.addToUserJourney('view_item_list', data.item_list_name, 0)
  }

  // Custom Event Tracking
  public trackQuoteRequest(data: LeadAnalyticsData): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'generate_lead', {
      currency: data.currency || 'CAD',
      value: data.leadValue || 0,
      lead_type: data.leadType,
      lead_source: data.leadSource,
      contact_method: data.contactInfo.email ? 'email' : 'phone',
      items: data.products?.map(this.formatProductItem) || []
    })

    // Track as conversion goal
    this.gtag('event', 'conversion', {
      send_to: `${this.config.measurementId}/quote_request`,
      value: data.leadValue || 1
    })

    this.addToUserJourney('quote_request', data.leadType, data.leadValue || 0)
  }

  public trackFormSubmission(formName: string, formId?: string, success: boolean = true): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'form_submit', {
      form_name: formName,
      form_id: formId,
      form_success: success,
      event_category: 'Form Interaction',
      event_label: formName
    })

    if (success) {
      this.gtag('event', 'conversion', {
        send_to: `${this.config.measurementId}/form_submit`,
        form_name: formName
      })
    }

    this.addToUserJourney('form_submit', formName, success ? 1 : 0)
  }

  public trackSearch(searchTerm: string, resultsCount?: number): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'search', {
      search_term: searchTerm,
      search_results: resultsCount,
      event_category: 'Site Search',
      event_label: searchTerm
    })

    this.addToUserJourney('search', searchTerm, resultsCount || 0)
  }

  public trackOutboundClick(url: string, linkText?: string): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'click', {
      event_category: 'Outbound Links',
      event_label: url,
      link_url: url,
      link_text: linkText,
      outbound: true
    })

    this.addToUserJourney('outbound_click', url, 0)
  }

  public trackFileDownload(fileName: string, fileType: string): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'file_download', {
      event_category: 'File Download',
      event_label: fileName,
      file_name: fileName,
      file_extension: fileType,
      file_type: fileType
    })

    this.addToUserJourney('file_download', fileName, 0)
  }

  // Performance Tracking
  public trackWebVitals(metric: WebVitalsMetrics): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.name,
      value: Math.round(metric.value),
      metric_rating: metric.rating,
      navigation_type: metric.navigationType,
      custom_map: {
        metric_value: metric.value,
        metric_delta: metric.delta
      }
    })
  }

  public trackError(error: AnalyticsError): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'exception', {
      description: error.errorMessage,
      fatal: error.fatal,
      error_type: error.errorType,
      event_category: 'JavaScript Errors',
      event_label: error.errorType,
      page_url: error.url
    })

    this.addToUserJourney('error', error.errorType, error.fatal ? 1 : 0)
  }

  // Cart Abandonment Tracking
  private startCartAbandonmentTracking(items: AnalyticsProductItem[], value: number): void {
    this.clearCartAbandonmentTracking()

    this.cartAbandonmentTimer = setTimeout(() => {
      this.gtag('event', 'cart_abandonment', {
        event_category: 'E-commerce',
        event_label: 'Cart Abandoned',
        currency: 'CAD',
        value,
        items: items.map(this.formatProductItem),
        abandonment_stage: 'cart'
      })
    }, 30 * 60 * 1000) // 30 minutes
  }

  private clearCartAbandonmentTracking(): void {
    if (this.cartAbandonmentTimer) {
      clearTimeout(this.cartAbandonmentTimer)
      this.cartAbandonmentTimer = undefined
    }
  }

  // User Journey Tracking
  private addToUserJourney(action: string, page: string, value: number): void {
    const step: UserJourneyStep = {
      page,
      timestamp: Date.now(),
      action,
      duration: 0, // Will be calculated on next step
      metadata: { value }
    }

    // Calculate duration for previous step
    if (this.userJourney.length > 0) {
      const lastStep = this.userJourney[this.userJourney.length - 1]
      lastStep.duration = step.timestamp - lastStep.timestamp
    }

    this.userJourney.push(step)

    // Limit journey steps to prevent memory issues
    if (this.userJourney.length > 50) {
      this.userJourney = this.userJourney.slice(-30)
    }
  }

  public getUserJourney(): UserJourneyStep[] {
    return [...this.userJourney]
  }

  // Utility Methods
  private formatProductItem = (item: AnalyticsProductItem) => ({
    item_id: item.item_id,
    item_name: item.item_name,
    item_category: item.item_category,
    item_category2: item.item_category2,
    item_category3: item.item_category3,
    item_brand: item.item_brand || 'PG Closets',
    item_variant: item.item_variant,
    price: item.price,
    quantity: item.quantity,
    currency: item.currency || 'CAD',
    item_list_id: item.item_list_id,
    item_list_name: item.item_list_name,
    index: item.index,
    discount: item.discount || 0,
    promotion_id: item.promotion_id,
    promotion_name: item.promotion_name
  })

  private getContentGroup(path: string): string {
    if (path.includes('/products/')) return 'Product Pages'
    if (path.includes('/admin/')) return 'Admin'
    if (path.includes('/cart')) return 'Cart'
    if (path.includes('/checkout')) return 'Checkout'
    if (path.includes('/account/')) return 'Account'
    if (path.includes('/about')) return 'About'
    if (path.includes('/contact')) return 'Contact'
    if (path.includes('/faq')) return 'FAQ'
    if (path === '/') return 'Homepage'
    return 'Other'
  }

  private getDeviceType(): string {
    const width = window.innerWidth
    if (width <= 768) return 'Mobile'
    if (width <= 1024) return 'Tablet'
    return 'Desktop'
  }

  private getTrafficSource(): string {
    const referrer = document.referrer
    if (!referrer) return 'Direct'
    if (referrer.includes('google.com')) return 'Google'
    if (referrer.includes('facebook.com')) return 'Facebook'
    if (referrer.includes('instagram.com')) return 'Instagram'
    if (referrer.includes('bing.com')) return 'Bing'
    if (referrer.includes('yahoo.com')) return 'Yahoo'
    return 'Referral'
  }

  private calculateCustomerLTV(userId?: string): number {
    // Placeholder for customer LTV calculation
    // In real implementation, this would fetch from database
    return 0
  }

  private getOrderType(items: AnalyticsProductItem[]): string {
    if (items.length === 1) return 'Single Item'
    if (items.length <= 3) return 'Small Order'
    if (items.length <= 5) return 'Medium Order'
    return 'Large Order'
  }

  // Enhanced Methods for Complex Tracking
  public trackCheckoutStep(step: number, option?: string): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'checkout_progress', {
      checkout_step: step,
      checkout_option: option,
      event_category: 'E-commerce',
      event_label: `Checkout Step ${step}`
    })
  }

  public trackPromotion(promotionId: string, promotionName: string, action: 'view' | 'select'): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', action === 'view' ? 'view_promotion' : 'select_promotion', {
      promotion_id: promotionId,
      promotion_name: promotionName,
      event_category: 'Promotions',
      event_label: promotionName
    })
  }

  public trackEngagement(engagementType: string, value?: number): void {
    if (!this.hasAnalyticsConsent()) return

    this.gtag('event', 'engagement', {
      engagement_type: engagementType,
      value,
      event_category: 'User Engagement',
      event_label: engagementType
    })
  }

  // Session Management
  public getSessionId(): string {
    return this.sessionId
  }

  public setUserId(userId: string): void {
    this.userId = userId
    if (this.hasAnalyticsConsent()) {
      this.gtag('config', this.config.measurementId, {
        user_id: userId
      })
    }
  }

  public clearUserId(): void {
    this.userId = undefined
  }
}

// Singleton instance
let analyticsInstance: Analytics | null = null

export function initializeAnalytics(config: Partial<AnalyticsConfig>): Analytics {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics(config)
  }
  return analyticsInstance
}

export function getAnalytics(): Analytics | null {
  return analyticsInstance
}

// Export for easy access
export { Analytics }
export type { AnalyticsConfig }