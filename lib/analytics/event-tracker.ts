// Event Tracking System - Division 11: Analytics & Intelligence
// Comprehensive event taxonomy with 50+ trackable events

import { getAnalytics } from '../analytics'
import type {
  AnalyticsProductItem,
  GA4EventParameters,
  LeadAnalyticsData
} from '../../types/analytics'

// ============================================================================
// EVENT TAXONOMY - 50+ Events Organized by Category
// ============================================================================

export enum EventCategory {
  // E-commerce Events (15 events)
  ECOMMERCE = 'ecommerce',

  // User Engagement (12 events)
  ENGAGEMENT = 'engagement',

  // Navigation (8 events)
  NAVIGATION = 'navigation',

  // Conversion (10 events)
  CONVERSION = 'conversion',

  // Content Interaction (8 events)
  CONTENT = 'content',

  // Performance (5 events)
  PERFORMANCE = 'performance',

  // Error & Quality (5 events)
  ERROR = 'error',

  // Social & Sharing (4 events)
  SOCIAL = 'social'
}

export enum EcommerceEvent {
  // Product Discovery
  VIEW_ITEM = 'view_item',
  VIEW_ITEM_LIST = 'view_item_list',
  SELECT_ITEM = 'select_item',
  SEARCH = 'search',

  // Product Interaction
  VIEW_PROMOTION = 'view_promotion',
  SELECT_PROMOTION = 'select_promotion',
  ADD_TO_WISHLIST = 'add_to_wishlist',

  // Cart Actions
  ADD_TO_CART = 'add_to_cart',
  REMOVE_FROM_CART = 'remove_from_cart',
  VIEW_CART = 'view_cart',

  // Checkout Process
  BEGIN_CHECKOUT = 'begin_checkout',
  ADD_PAYMENT_INFO = 'add_payment_info',
  ADD_SHIPPING_INFO = 'add_shipping_info',

  // Purchase
  PURCHASE = 'purchase',
  REFUND = 'refund'
}

export enum EngagementEvent {
  // Page Engagement
  PAGE_VIEW = 'page_view',
  SCROLL = 'scroll',
  TIME_ON_PAGE = 'time_on_page',

  // Click Interactions
  CLICK = 'click',
  CTA_CLICK = 'cta_click',
  BUTTON_CLICK = 'button_click',
  LINK_CLICK = 'link_click',

  // Media Interaction
  VIDEO_START = 'video_start',
  VIDEO_COMPLETE = 'video_complete',
  IMAGE_VIEW = 'image_view',
  IMAGE_ZOOM = 'image_zoom',

  // Form Interaction
  FORM_START = 'form_start'
}

export enum NavigationEvent {
  MENU_OPEN = 'menu_open',
  MENU_CLOSE = 'menu_close',
  SEARCH_OPEN = 'search_open',
  FILTER_APPLY = 'filter_apply',
  SORT_CHANGE = 'sort_change',
  PAGINATION = 'pagination',
  BREADCRUMB_CLICK = 'breadcrumb_click',
  TAB_CHANGE = 'tab_change'
}

export enum ConversionEvent {
  // Lead Generation
  GENERATE_LEAD = 'generate_lead',
  QUOTE_REQUEST = 'quote_request',
  CONSULTATION_REQUEST = 'consultation_request',
  CONTACT_FORM_SUBMIT = 'contact_form_submit',

  // Engagement
  PHONE_CLICK = 'phone_click',
  EMAIL_CLICK = 'email_click',
  LOCATION_CLICK = 'location_click',

  // Newsletter
  NEWSLETTER_SIGNUP = 'newsletter_signup',

  // Social Proof
  REVIEW_SUBMIT = 'review_submit',
  TESTIMONIAL_VIEW = 'testimonial_view'
}

export enum ContentEvent {
  // Downloads
  FILE_DOWNLOAD = 'file_download',
  CATALOG_DOWNLOAD = 'catalog_download',

  // Sharing
  SHARE = 'share',
  COPY_LINK = 'copy_link',

  // Content Consumption
  FAQ_EXPAND = 'faq_expand',
  ACCORDION_TOGGLE = 'accordion_toggle',
  MODAL_OPEN = 'modal_open',
  TOOLTIP_HOVER = 'tooltip_hover'
}

export enum PerformanceEvent {
  PAGE_LOAD = 'page_load',
  RESOURCE_TIMING = 'resource_timing',
  WEB_VITALS = 'web_vitals',
  PERFORMANCE_SCORE = 'performance_score',
  BUNDLE_SIZE = 'bundle_size'
}

export enum ErrorEvent {
  JAVASCRIPT_ERROR = 'javascript_error',
  NETWORK_ERROR = 'network_error',
  FORM_VALIDATION_ERROR = 'form_validation_error',
  PAYMENT_ERROR = 'payment_error',
  CHECKOUT_ERROR = 'checkout_error'
}

export enum SocialEvent {
  SOCIAL_SHARE = 'social_share',
  SOCIAL_FOLLOW = 'social_follow',
  SOCIAL_LIKE = 'social_like',
  SOCIAL_COMMENT = 'social_comment'
}

// ============================================================================
// EVENT TRACKER CLASS
// ============================================================================

export class EventTracker {
  private analytics = getAnalytics()
  private sessionStartTime = Date.now()
  private pageStartTime = Date.now()
  private eventQueue: Array<{event: string; params: any}> = []
  private isProcessing = false

  // ============================================================================
  // E-COMMERCE EVENTS
  // ============================================================================

  /**
   * Track product view
   */
  trackViewItem(product: {
    id: string
    name: string
    category: string
    price: number
    brand?: string
    variant?: string
  }) {
    this.analytics?.trackViewItem({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      currency: 'CAD',
      item_brand: product.brand,
      item_variant: product.variant
    })

    this.queueEvent(EcommerceEvent.VIEW_ITEM, {
      item_id: product.id,
      item_name: product.name,
      category: product.category,
      price: product.price
    })
  }

  /**
   * Track product list view (category, search results, etc.)
   */
  trackViewItemList(listId: string, listName: string, items: AnalyticsProductItem[]) {
    this.analytics?.trackViewItemList({
      item_list_id: listId,
      item_list_name: listName,
      items
    })

    this.queueEvent(EcommerceEvent.VIEW_ITEM_LIST, {
      list_id: listId,
      list_name: listName,
      item_count: items.length
    })
  }

  /**
   * Track product selection from list
   */
  trackSelectItem(item: AnalyticsProductItem, listId: string, listName: string) {
    const analytics = this.analytics
    if (!analytics) return

    analytics.gtag?.('event', 'select_item', {
      item_list_id: listId,
      item_list_name: listName,
      items: [item]
    })

    this.queueEvent(EcommerceEvent.SELECT_ITEM, {
      item_id: item.item_id,
      list_name: listName
    })
  }

  /**
   * Track search
   */
  trackSearch(searchTerm: string, resultsCount?: number) {
    this.analytics?.trackSearch(searchTerm, resultsCount)

    this.queueEvent(EcommerceEvent.SEARCH, {
      search_term: searchTerm,
      results: resultsCount || 0
    })
  }

  /**
   * Track add to cart
   */
  trackAddToCart(items: AnalyticsProductItem[], value: number) {
    this.analytics?.trackAddToCart({
      currency: 'CAD',
      value,
      items
    })

    this.queueEvent(EcommerceEvent.ADD_TO_CART, {
      value,
      item_count: items.length
    })
  }

  /**
   * Track remove from cart
   */
  trackRemoveFromCart(items: AnalyticsProductItem[], value: number) {
    this.analytics?.trackRemoveFromCart({
      currency: 'CAD',
      value,
      items
    })

    this.queueEvent(EcommerceEvent.REMOVE_FROM_CART, {
      value,
      item_count: items.length
    })
  }

  /**
   * Track view cart
   */
  trackViewCart(items: AnalyticsProductItem[], value: number) {
    this.queueEvent(EcommerceEvent.VIEW_CART, {
      value,
      item_count: items.length,
      items
    })
  }

  /**
   * Track begin checkout
   */
  trackBeginCheckout(items: AnalyticsProductItem[], value: number, options?: {
    coupon?: string
    payment_method?: string
    shipping_tier?: string
  }) {
    this.analytics?.trackBeginCheckout({
      currency: 'CAD',
      value,
      items,
      ...options
    })

    this.queueEvent(EcommerceEvent.BEGIN_CHECKOUT, {
      value,
      item_count: items.length,
      ...options
    })
  }

  /**
   * Track add payment info
   */
  trackAddPaymentInfo(paymentType: string, value: number) {
    this.queueEvent(EcommerceEvent.ADD_PAYMENT_INFO, {
      payment_type: paymentType,
      value
    })
  }

  /**
   * Track add shipping info
   */
  trackAddShippingInfo(shippingTier: string, value: number) {
    this.queueEvent(EcommerceEvent.ADD_SHIPPING_INFO, {
      shipping_tier: shippingTier,
      value
    })
  }

  /**
   * Track purchase
   */
  trackPurchase(transactionId: string, value: number, items: AnalyticsProductItem[], options?: {
    tax?: number
    shipping?: number
    coupon?: string
    payment_method?: string
  }) {
    this.analytics?.trackPurchase({
      transaction_id: transactionId,
      value,
      currency: 'CAD',
      items,
      ...options
    })

    this.queueEvent(EcommerceEvent.PURCHASE, {
      transaction_id: transactionId,
      value,
      item_count: items.length,
      ...options
    })
  }

  // ============================================================================
  // ENGAGEMENT EVENTS
  // ============================================================================

  /**
   * Track page view
   */
  trackPageView(path?: string, title?: string) {
    this.pageStartTime = Date.now()
    this.analytics?.trackPageView(path, title)

    this.queueEvent(EngagementEvent.PAGE_VIEW, {
      page_path: path || window.location.pathname,
      page_title: title || document.title
    })
  }

  /**
   * Track scroll depth
   */
  trackScroll(depth: number) {
    this.queueEvent(EngagementEvent.SCROLL, {
      scroll_depth: depth,
      page_path: window.location.pathname
    })
  }

  /**
   * Track time on page
   */
  trackTimeOnPage() {
    const timeOnPage = Date.now() - this.pageStartTime

    this.queueEvent(EngagementEvent.TIME_ON_PAGE, {
      time_seconds: Math.round(timeOnPage / 1000),
      page_path: window.location.pathname
    })

    return timeOnPage
  }

  /**
   * Track generic click
   */
  trackClick(element: string, label?: string, value?: number) {
    this.queueEvent(EngagementEvent.CLICK, {
      element,
      label,
      value
    })
  }

  /**
   * Track CTA click
   */
  trackCTAClick(ctaName: string, location: string, destination?: string) {
    this.queueEvent(EngagementEvent.CTA_CLICK, {
      cta_name: ctaName,
      cta_location: location,
      cta_destination: destination
    })
  }

  /**
   * Track button click
   */
  trackButtonClick(buttonName: string, buttonLocation: string) {
    this.queueEvent(EngagementEvent.BUTTON_CLICK, {
      button_name: buttonName,
      button_location: buttonLocation
    })
  }

  /**
   * Track video interaction
   */
  trackVideoStart(videoTitle: string, videoDuration: number) {
    this.queueEvent(EngagementEvent.VIDEO_START, {
      video_title: videoTitle,
      video_duration: videoDuration
    })
  }

  trackVideoComplete(videoTitle: string, watchTime: number) {
    this.queueEvent(EngagementEvent.VIDEO_COMPLETE, {
      video_title: videoTitle,
      watch_time: watchTime
    })
  }

  /**
   * Track image interaction
   */
  trackImageView(imageName: string, imageCategory: string) {
    this.queueEvent(EngagementEvent.IMAGE_VIEW, {
      image_name: imageName,
      image_category: imageCategory
    })
  }

  trackImageZoom(imageName: string) {
    this.queueEvent(EngagementEvent.IMAGE_ZOOM, {
      image_name: imageName
    })
  }

  /**
   * Track form start
   */
  trackFormStart(formName: string, formId?: string) {
    this.queueEvent(EngagementEvent.FORM_START, {
      form_name: formName,
      form_id: formId
    })
  }

  // ============================================================================
  // NAVIGATION EVENTS
  // ============================================================================

  /**
   * Track menu interaction
   */
  trackMenuOpen(menuType: string) {
    this.queueEvent(NavigationEvent.MENU_OPEN, { menu_type: menuType })
  }

  trackMenuClose(menuType: string) {
    this.queueEvent(NavigationEvent.MENU_CLOSE, { menu_type: menuType })
  }

  /**
   * Track search overlay
   */
  trackSearchOpen() {
    this.queueEvent(NavigationEvent.SEARCH_OPEN, {})
  }

  /**
   * Track filter application
   */
  trackFilterApply(filterType: string, filterValue: string) {
    this.queueEvent(NavigationEvent.FILTER_APPLY, {
      filter_type: filterType,
      filter_value: filterValue
    })
  }

  /**
   * Track sort change
   */
  trackSortChange(sortOption: string) {
    this.queueEvent(NavigationEvent.SORT_CHANGE, {
      sort_option: sortOption
    })
  }

  /**
   * Track pagination
   */
  trackPagination(page: number, totalPages: number) {
    this.queueEvent(NavigationEvent.PAGINATION, {
      page,
      total_pages: totalPages
    })
  }

  /**
   * Track breadcrumb click
   */
  trackBreadcrumbClick(level: number, label: string) {
    this.queueEvent(NavigationEvent.BREADCRUMB_CLICK, {
      level,
      label
    })
  }

  /**
   * Track tab change
   */
  trackTabChange(tabName: string, tabGroup: string) {
    this.queueEvent(NavigationEvent.TAB_CHANGE, {
      tab_name: tabName,
      tab_group: tabGroup
    })
  }

  // ============================================================================
  // CONVERSION EVENTS
  // ============================================================================

  /**
   * Track quote request
   */
  trackQuoteRequest(leadData: LeadAnalyticsData) {
    this.analytics?.trackQuoteRequest(leadData)

    this.queueEvent(ConversionEvent.QUOTE_REQUEST, {
      lead_value: leadData.leadValue,
      lead_type: leadData.leadType,
      contact_method: leadData.contactInfo.email ? 'email' : 'phone'
    })
  }

  /**
   * Track consultation request
   */
  trackConsultationRequest(service: string, preferredDate?: string) {
    this.queueEvent(ConversionEvent.CONSULTATION_REQUEST, {
      service,
      preferred_date: preferredDate
    })
  }

  /**
   * Track contact form submission
   */
  trackContactFormSubmit(subject: string, success: boolean) {
    this.queueEvent(ConversionEvent.CONTACT_FORM_SUBMIT, {
      subject,
      success
    })
  }

  /**
   * Track phone click
   */
  trackPhoneClick(phoneNumber: string, location: string) {
    this.queueEvent(ConversionEvent.PHONE_CLICK, {
      phone_number: phoneNumber,
      location
    })
  }

  /**
   * Track email click
   */
  trackEmailClick(emailAddress: string, location: string) {
    this.queueEvent(ConversionEvent.EMAIL_CLICK, {
      email_address: emailAddress,
      location
    })
  }

  /**
   * Track location/directions click
   */
  trackLocationClick(location: string) {
    this.queueEvent(ConversionEvent.LOCATION_CLICK, {
      location
    })
  }

  /**
   * Track newsletter signup
   */
  trackNewsletterSignup(source: string) {
    this.queueEvent(ConversionEvent.NEWSLETTER_SIGNUP, {
      source
    })
  }

  /**
   * Track review submission
   */
  trackReviewSubmit(productId: string, rating: number) {
    this.queueEvent(ConversionEvent.REVIEW_SUBMIT, {
      product_id: productId,
      rating
    })
  }

  // ============================================================================
  // CONTENT EVENTS
  // ============================================================================

  /**
   * Track file download
   */
  trackFileDownload(fileName: string, fileType: string, fileSize?: number) {
    this.analytics?.trackFileDownload(fileName, fileType)

    this.queueEvent(ContentEvent.FILE_DOWNLOAD, {
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize
    })
  }

  /**
   * Track catalog download
   */
  trackCatalogDownload(catalogType: string) {
    this.queueEvent(ContentEvent.CATALOG_DOWNLOAD, {
      catalog_type: catalogType
    })
  }

  /**
   * Track share action
   */
  trackShare(platform: string, content: string) {
    this.queueEvent(ContentEvent.SHARE, {
      platform,
      content
    })
  }

  /**
   * Track copy link
   */
  trackCopyLink(url: string) {
    this.queueEvent(ContentEvent.COPY_LINK, {
      url
    })
  }

  /**
   * Track FAQ expand
   */
  trackFAQExpand(question: string) {
    this.queueEvent(ContentEvent.FAQ_EXPAND, {
      question
    })
  }

  /**
   * Track accordion toggle
   */
  trackAccordionToggle(section: string, isOpen: boolean) {
    this.queueEvent(ContentEvent.ACCORDION_TOGGLE, {
      section,
      is_open: isOpen
    })
  }

  /**
   * Track modal open
   */
  trackModalOpen(modalType: string, modalTitle: string) {
    this.queueEvent(ContentEvent.MODAL_OPEN, {
      modal_type: modalType,
      modal_title: modalTitle
    })
  }

  // ============================================================================
  // PERFORMANCE EVENTS
  // ============================================================================

  /**
   * Track page load time
   */
  trackPageLoad(loadTime: number, resources?: any) {
    this.queueEvent(PerformanceEvent.PAGE_LOAD, {
      load_time: loadTime,
      resources
    })
  }

  /**
   * Track Web Vitals
   */
  trackWebVitals(metric: {
    name: string
    value: number
    rating: string
  }) {
    this.analytics?.trackWebVitals(metric as any)

    this.queueEvent(PerformanceEvent.WEB_VITALS, metric)
  }

  // ============================================================================
  // ERROR EVENTS
  // ============================================================================

  /**
   * Track JavaScript error
   */
  trackJavaScriptError(error: Error, fatal: boolean = false) {
    this.analytics?.trackError({
      errorType: 'javascript',
      errorMessage: error.message,
      errorStack: error.stack,
      fatal,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.analytics?.getSessionId() || ''
    })

    this.queueEvent(ErrorEvent.JAVASCRIPT_ERROR, {
      error_message: error.message,
      fatal
    })
  }

  /**
   * Track form validation error
   */
  trackFormValidationError(formName: string, fieldName: string, errorType: string) {
    this.queueEvent(ErrorEvent.FORM_VALIDATION_ERROR, {
      form_name: formName,
      field_name: fieldName,
      error_type: errorType
    })
  }

  /**
   * Track checkout error
   */
  trackCheckoutError(stage: string, errorMessage: string) {
    this.queueEvent(ErrorEvent.CHECKOUT_ERROR, {
      checkout_stage: stage,
      error_message: errorMessage
    })
  }

  // ============================================================================
  // SOCIAL EVENTS
  // ============================================================================

  /**
   * Track social share
   */
  trackSocialShare(platform: string, content: string, contentType: string) {
    this.queueEvent(SocialEvent.SOCIAL_SHARE, {
      platform,
      content,
      content_type: contentType
    })
  }

  /**
   * Track social follow
   */
  trackSocialFollow(platform: string) {
    this.queueEvent(SocialEvent.SOCIAL_FOLLOW, {
      platform
    })
  }

  // ============================================================================
  // EVENT QUEUE MANAGEMENT
  // ============================================================================

  /**
   * Queue event for batch processing
   */
  private queueEvent(event: string, params: any) {
    this.eventQueue.push({ event, params })

    // Auto-process queue if it gets too large
    if (this.eventQueue.length >= 10 && !this.isProcessing) {
      this.processQueue()
    }
  }

  /**
   * Process queued events
   */
  async processQueue() {
    if (this.isProcessing || this.eventQueue.length === 0) return

    this.isProcessing = true

    try {
      // Send events to analytics backend (if configured)
      // For now, just log to console in debug mode
      if (process.env.NODE_ENV === 'development') {
        console.log('[EventTracker] Processing queue:', this.eventQueue)
      }

      // Clear the queue
      this.eventQueue = []
    } catch (error) {
      console.error('[EventTracker] Error processing queue:', error)
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Get queue stats
   */
  getQueueStats() {
    return {
      queueLength: this.eventQueue.length,
      isProcessing: this.isProcessing,
      sessionDuration: Date.now() - this.sessionStartTime
    }
  }

  /**
   * Flush queue manually
   */
  flush() {
    return this.processQueue()
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let eventTrackerInstance: EventTracker | null = null

export function getEventTracker(): EventTracker {
  if (!eventTrackerInstance) {
    eventTrackerInstance = new EventTracker()
  }
  return eventTrackerInstance
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export const eventTracker = {
  get instance() {
    return getEventTracker()
  },

  // Quick access methods
  trackPageView: (path?: string, title?: string) => getEventTracker().trackPageView(path, title),
  trackClick: (element: string, label?: string) => getEventTracker().trackClick(element, label),
  trackCTAClick: (name: string, location: string) => getEventTracker().trackCTAClick(name, location),
  trackSearch: (term: string, results?: number) => getEventTracker().trackSearch(term, results),
  trackQuoteRequest: (data: LeadAnalyticsData) => getEventTracker().trackQuoteRequest(data),
  trackError: (error: Error, fatal?: boolean) => getEventTracker().trackJavaScriptError(error, fatal)
}
