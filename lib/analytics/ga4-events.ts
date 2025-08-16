// GA4 E-commerce Event Tracking Library for PG Closets
// Comprehensive tracking for Paddle payments and store interactions

export interface ProductItem {
  item_id: string
  item_name: string
  item_category: string
  item_category2?: string
  item_brand?: string
  item_variant?: string
  price: number
  quantity: number
  currency?: string
  item_list_id?: string
  item_list_name?: string
  index?: number
}

export interface PurchaseEvent {
  transaction_id: string
  value: number
  currency: string
  items: ProductItem[]
  coupon?: string
  shipping?: number
  tax?: number
  affiliation?: string
}

export interface ViewItemEvent {
  item_id: string
  item_name: string
  item_category: string
  price: number
  currency?: string
  value?: number
}

export interface AddToCartEvent {
  currency: string
  value: number
  items: ProductItem[]
}

export interface BeginCheckoutEvent {
  currency: string
  value: number
  items: ProductItem[]
  coupon?: string
}

export interface PageViewEvent {
  page_title?: string
  page_location?: string
  page_referrer?: string
  content_group1?: string
  content_group2?: string
}

export interface CustomEvent {
  event_name: string
  event_parameters?: Record<string, any>
}

class GA4Analytics {
  private measurementId: string
  private debug: boolean
  private isInitialized: boolean = false

  constructor(measurementId: string, debug: boolean = false) {
    this.measurementId = measurementId
    this.debug = debug
  }

  private gtag(...args: any[]) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag(...args)
      if (this.debug) {
        console.log('[GA4 Event]', ...args)
      }
    } else if (this.debug) {
      console.warn('[GA4] gtag not available, event not sent:', args)
    }
  }

  private validateProductItem(item: ProductItem): boolean {
    const required = ['item_id', 'item_name', 'item_category', 'price', 'quantity']
    const missing = required.filter(field => !item[field as keyof ProductItem])
    
    if (missing.length > 0) {
      console.warn('[GA4] Invalid product item, missing fields:', missing, item)
      return false
    }
    return true
  }

  // Page View Tracking
  pageView(event: PageViewEvent = {}) {
    this.gtag('event', 'page_view', {
      page_title: event.page_title || document.title,
      page_location: event.page_location || window.location.href,
      page_referrer: event.page_referrer || document.referrer,
      content_group1: event.content_group1,
      content_group2: event.content_group2,
    })
  }

  // E-commerce Events

  // Track product purchases (for Paddle integration)
  purchase(event: PurchaseEvent) {
    const validItems = event.items.filter(item => this.validateProductItem(item))
    
    if (validItems.length === 0) {
      console.warn('[GA4] Purchase event has no valid items')
      return
    }

    this.gtag('event', 'purchase', {
      transaction_id: event.transaction_id,
      value: event.value,
      currency: event.currency || 'CAD',
      items: validItems,
      coupon: event.coupon,
      shipping: event.shipping,
      tax: event.tax,
      affiliation: event.affiliation || 'PG Closets Store',
    })
  }

  // Track product views
  viewItem(event: ViewItemEvent) {
    this.gtag('event', 'view_item', {
      currency: event.currency || 'CAD',
      value: event.value || event.price,
      items: [{
        item_id: event.item_id,
        item_name: event.item_name,
        item_category: event.item_category,
        price: event.price,
        quantity: 1,
      }]
    })
  }

  // Track add to cart events
  addToCart(event: AddToCartEvent) {
    const validItems = event.items.filter(item => this.validateProductItem(item))
    
    if (validItems.length === 0) {
      console.warn('[GA4] Add to cart event has no valid items')
      return
    }

    this.gtag('event', 'add_to_cart', {
      currency: event.currency,
      value: event.value,
      items: validItems,
    })
  }

  // Track remove from cart events
  removeFromCart(event: AddToCartEvent) {
    const validItems = event.items.filter(item => this.validateProductItem(item))
    
    this.gtag('event', 'remove_from_cart', {
      currency: event.currency,
      value: event.value,
      items: validItems,
    })
  }

  // Track checkout process
  beginCheckout(event: BeginCheckoutEvent) {
    const validItems = event.items.filter(item => this.validateProductItem(item))
    
    if (validItems.length === 0) {
      console.warn('[GA4] Begin checkout event has no valid items')
      return
    }

    this.gtag('event', 'begin_checkout', {
      currency: event.currency,
      value: event.value,
      items: validItems,
      coupon: event.coupon,
    })
  }

  // Track product list views (category pages, search results)
  viewItemList(listId: string, listName: string, items: ProductItem[]) {
    const validItems = items.filter(item => this.validateProductItem(item))
    
    this.gtag('event', 'view_item_list', {
      item_list_id: listId,
      item_list_name: listName,
      items: validItems,
    })
  }

  // Track product clicks in lists
  selectItem(listId: string, listName: string, item: ProductItem) {
    if (!this.validateProductItem(item)) return

    this.gtag('event', 'select_item', {
      item_list_id: listId,
      item_list_name: listName,
      items: [item],
    })
  }

  // Track search events
  search(searchTerm: string, results?: number) {
    this.gtag('event', 'search', {
      search_term: searchTerm,
      ...(results !== undefined && { search_results: results }),
    })
  }

  // Track form interactions
  formStart(formName: string) {
    this.gtag('event', 'form_start', {
      form_name: formName,
      engagement_time_msec: Date.now(),
    })
  }

  formSubmit(formName: string, success: boolean = true) {
    this.gtag('event', 'form_submit', {
      form_name: formName,
      form_success: success,
    })
  }

  // Track user engagement
  scrollEvent(percent: number) {
    // Only track significant scroll milestones
    if ([25, 50, 75, 90].includes(percent)) {
      this.gtag('event', 'scroll', {
        percent_scrolled: percent,
      })
    }
  }

  // Track file downloads
  fileDownload(fileName: string, fileExtension: string) {
    this.gtag('event', 'file_download', {
      file_name: fileName,
      file_extension: fileExtension,
      link_url: window.location.href,
    })
  }

  // Track outbound links
  outboundClick(url: string, linkText?: string) {
    this.gtag('event', 'click', {
      link_url: url,
      link_text: linkText,
      outbound: true,
    })
  }

  // Track video interactions
  videoStart(videoTitle: string, videoDuration?: number) {
    this.gtag('event', 'video_start', {
      video_title: videoTitle,
      video_duration: videoDuration,
    })
  }

  videoComplete(videoTitle: string, videoDuration?: number) {
    this.gtag('event', 'video_complete', {
      video_title: videoTitle,
      video_duration: videoDuration,
    })
  }

  // Track custom events
  customEvent(event: CustomEvent) {
    this.gtag('event', event.event_name, event.event_parameters || {})
  }

  // Track timing events
  timing(name: string, value: number, category?: string) {
    this.gtag('event', 'timing_complete', {
      name,
      value,
      event_category: category || 'Performance',
    })
  }

  // Track exceptions
  exception(description: string, fatal: boolean = false) {
    this.gtag('event', 'exception', {
      description,
      fatal,
    })
  }

  // PG Closets specific events

  // Track quote requests
  quoteRequest(productItems: ProductItem[], totalValue: number) {
    this.gtag('event', 'generate_lead', {
      currency: 'CAD',
      value: totalValue,
      lead_type: 'quote_request',
      items: productItems.filter(item => this.validateProductItem(item)),
    })
  }

  // Track consultation bookings
  consultationBooking(serviceType: string, value?: number) {
    this.gtag('event', 'generate_lead', {
      currency: 'CAD',
      value: value || 0,
      lead_type: 'consultation_booking',
      service_type: serviceType,
    })
  }

  // Track contact form submissions
  contactFormSubmit(formType: string, success: boolean = true) {
    this.gtag('event', 'contact', {
      method: formType,
      success,
    })
  }

  // Jobber Form Specific Events

  // Track form view when it comes into viewport
  jobberFormView(formPosition: string, clientHubId: string) {
    this.gtag('event', 'view_form', {
      form_name: 'jobber_quote_request',
      form_id: clientHubId,
      form_position: formPosition,
      form_type: 'embedded_jobber_form'
    })
  }

  // Track when user starts filling the form
  jobberFormStart(formPosition: string) {
    this.gtag('event', 'form_start', {
      form_name: 'jobber_quote',
      form_position: formPosition,
      timestamp: new Date().toISOString(),
      form_type: 'jobber_embedded'
    })
  }

  // Track individual field interactions
  jobberFormFieldInteraction(fieldName: string, interactionType: 'focus' | 'completed') {
    this.gtag('event', 'form_field_interaction', {
      field_name: fieldName,
      interaction_type: interactionType,
      form_name: 'jobber_quote'
    })
  }

  // Track form submission with lead value estimation
  jobberFormSubmit(formPosition: string, additionalData?: {
    fields_filled?: number;
    estimated_value?: number;
    project_type?: string;
    urgency?: string;
  }) {
    // Generate lead event for high-value tracking
    this.gtag('event', 'generate_lead', {
      currency: 'CAD',
      value: additionalData?.estimated_value || 2000,
      form_name: 'jobber_quote',
      form_position: formPosition,
      fields_filled: additionalData?.fields_filled,
      lead_source: 'jobber_form',
      project_type: additionalData?.project_type,
      urgency: additionalData?.urgency
    })

    // Also track as form submit
    this.gtag('event', 'form_submit', {
      form_name: 'jobber_quote',
      form_position: formPosition,
      form_success: true
    })
  }

  // Track phone clicks from form error states
  jobberPhoneClick(context: string, phoneNumber: string = '(613) 262-2604') {
    this.gtag('event', 'phone_click', {
      click_context: context,
      phone_number: phoneNumber,
      contact_method: 'phone',
      source: 'jobber_form_fallback'
    })
  }

  // Track form loading errors
  jobberFormError(errorType: string, errorMessage?: string) {
    this.gtag('event', 'exception', {
      description: `Jobber form error: ${errorType} - ${errorMessage}`,
      fatal: false,
      error_type: errorType,
      form_name: 'jobber_quote'
    })
  }

  // Track A/B test assignments for form variations
  jobberFormABTest(variant: 'A' | 'B', testName: string = 'jobber_form_variation') {
    this.gtag('event', 'ab_test_assigned', {
      test_name: testName,
      variant: variant,
      form_name: 'jobber_quote'
    })
  }

  // Track exit intent popup triggers
  exitIntentTriggered(pagePath: string) {
    this.gtag('event', 'exit_intent_triggered', {
      page_path: pagePath,
      trigger_type: 'mouse_leave',
      popup_content: 'jobber_quote_form'
    })
  }

  // Track product customizations
  productCustomization(productId: string, customizationType: string, customizationValue: string) {
    this.gtag('event', 'customize', {
      item_id: productId,
      customization_type: customizationType,
      customization_value: customizationValue,
    })
  }

  // Track wishlist actions
  addToWishlist(item: ProductItem) {
    if (!this.validateProductItem(item)) return

    this.gtag('event', 'add_to_wishlist', {
      currency: 'CAD',
      value: item.price,
      items: [item],
    })
  }

  // Track product comparisons
  compareProducts(items: ProductItem[]) {
    const validItems = items.filter(item => this.validateProductItem(item))
    
    this.gtag('event', 'compare', {
      items: validItems,
      comparison_count: validItems.length,
    })
  }
}

// Singleton instance for the PG Closets store
export const ga4 = new GA4Analytics('G-M01QFYXCDN', process.env.NODE_ENV === 'development')

// Export the class for custom instances if needed
export { GA4Analytics }

// Helper function to create product items from PG Closets product data
export function createProductItem(product: {
  id: string
  name: string
  price: number
  category: string
  brand?: string
  variant?: string
  quantity?: number
}): ProductItem {
  return {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    item_brand: product.brand || 'Renin',
    item_variant: product.variant,
    price: product.price,
    quantity: product.quantity || 1,
    currency: 'CAD',
  }
}