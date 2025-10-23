interface AnalyticsEvent {
  name: string
  params: Record<string, any>
  timestamp: number
  userId?: string
  sessionId: string
  userAgent: string
  url: string
}

interface ConversionEvent {
  type: 'quote_request' | 'contact_form' | 'phone_call' | 'product_view' | 'cart_add' | 'purchase'
  value?: number
  currency?: string
  items?: any[]
  metadata?: any
}

class ComprehensiveAnalytics {
  private sessionId: string
  private userId: string | null = null
  private isInitialized = false
  private eventQueue: AnalyticsEvent[] = []
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeTracking()
  }

  private generateSessionId(): string {
    const key = 'pgclosets_session_id'
    let sessionId = this.getStorageItem(key)

    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      this.setStorageItem(key, sessionId)
    }

    return sessionId
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined' || this.isInitialized) return

    this.userId = this.getUserId()
    this.trackPageView()
    this.setupEventListeners()
    this.setupVisibilityTracking()
    this.setupErrorTracking()
    this.setupPerformanceTracking()
    this.initializeEcommerceTracking()

    this.isInitialized = true

    // Process any queued events
    this.processEventQueue()
  }

  // Page view tracking
  trackPageView(url?: string, title?: string): void {
    const pageData = {
      page_location: url || window.location.href,
      page_title: title || document.title,
      page_referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: Date.now(),
      session_id: this.sessionId,
      user_id: this.userId,
    }

    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_location: pageData.page_location,
        page_title: pageData.page_title,
        custom_map: {
          'custom_parameter_1': 'session_id',
          'custom_parameter_2': 'user_segment',
        },
      })

      gtag('event', 'page_view', {
        ...pageData,
        custom_parameter_1: this.sessionId,
        custom_parameter_2: this.getUserSegment(),
      })
    }

    // Send to custom analytics
    this.trackEvent('page_view', pageData)
  }

  // Custom event tracking
  trackEvent(name: string, params: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      name,
      params,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    if (this.isOnline) {
      this.sendEvent(event)
    } else {
      this.eventQueue.push(event)
    }
  }

  // E-commerce tracking
  trackConversion(conversion: ConversionEvent): void {
    const eventData = {
      event_category: 'ecommerce',
      event_label: conversion.type,
      value: conversion.value,
      currency: conversion.currency || 'CAD',
      items: conversion.items || [],
      user_segment: this.getUserSegment(),
      device_type: this.getDeviceType(),
      time_on_page: this.getTimeOnPage(),
      ...conversion.metadata,
    }

    // Google Analytics e-commerce events
    if (typeof gtag !== 'undefined') {
      if (conversion.type === 'purchase') {
        gtag('event', 'purchase', {
          transaction_id: this.generateTransactionId(),
          value: conversion.value,
          currency: conversion.currency || 'CAD',
          items: conversion.items || [],
        })
      } else {
        gtag('event', conversion.type, eventData)
      }
    }

    // Custom conversion tracking
    this.trackEvent(`conversion_${conversion.type}`, eventData)

    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
      if (conversion.type === 'purchase') {
        fbq('track', 'Purchase', {
          value: conversion.value,
          currency: conversion.currency || 'CAD',
          content_ids: conversion.items?.map(item => item.id) || [],
          content_type: 'product',
        })
      } else if (conversion.type === 'quote_request') {
        fbq('track', 'Lead', {
          value: conversion.value || 0,
          currency: conversion.currency || 'CAD',
        })
      }
    }

    // LinkedIn Insight Tag
    if (typeof lintrk !== 'undefined') {
      lintrk('track', { conversion_id: conversion.type })
    }
  }

  // Product interaction tracking
  trackProductInteraction(productId: string, action: 'view' | 'click' | 'add_to_cart' | 'remove_from_cart', metadata?: any): void {
    this.trackEvent('product_interaction', {
      product_id: productId,
      action,
      category: metadata?.category,
      price: metadata?.price,
      brand: metadata?.brand || 'PG Closets',
      variant: metadata?.variant,
      quantity: metadata?.quantity || 1,
      list_name: metadata?.list_name,
      list_position: metadata?.list_position,
    })
  }

  // User engagement tracking
  trackEngagement(type: 'scroll_depth' | 'time_on_page' | 'form_interaction' | 'video_play', data: any): void {
    this.trackEvent('user_engagement', {
      engagement_type: type,
      ...data,
      session_duration: Date.now() - this.getSessionStartTime(),
    })
  }

  // Lead generation tracking
  trackLead(source: string, type: 'quote' | 'consultation' | 'newsletter', value?: number): void {
    this.trackEvent('lead_generated', {
      lead_source: source,
      lead_type: type,
      lead_value: value || 0,
      user_segment: this.getUserSegment(),
      page_url: window.location.href,
      referrer: document.referrer,
    })

    // Track conversion
    this.trackConversion({
      type: type === 'quote' ? 'quote_request' : 'contact_form',
      value,
      metadata: { source, lead_type: type },
    })
  }

  // Phone call tracking
  trackPhoneCall(phoneNumber: string, source: string): void {
    this.trackEvent('phone_call', {
      phone_number: phoneNumber,
      call_source: source,
      page_url: window.location.href,
      user_segment: this.getUserSegment(),
    })

    this.trackConversion({
      type: 'phone_call',
      metadata: { phone_number, source },
    })
  }

  // Search tracking
  trackSearch(query: string, resultsCount: number, filters?: any): void {
    this.trackEvent('site_search', {
      search_term: query,
      results_count: resultsCount,
      search_filters: filters,
      search_category: 'products',
    })
  }

  // Form tracking
  trackFormSubmission(formName: string, formData?: any): void {
    this.trackEvent('form_submission', {
      form_name: formName,
      form_data_keys: formData ? Object.keys(formData) : [],
      submission_time: Date.now(),
    })

    if (formName === 'contact' || formName === 'quote') {
      this.trackLead('website_form', formName === 'quote' ? 'quote' : 'consultation')
    }
  }

  // Setup event listeners
  private setupEventListeners(): void {
    // Track clicks on external links
    document.addEventListener('click', (event) => {
      const target = event.target as Element
      const link = target.closest('a') as HTMLAnchorElement

      if (link && link.href && !link.href.includes(window.location.hostname)) {
        this.trackEvent('outbound_click', {
          destination_url: link.href,
          link_text: link.textContent?.trim(),
          link_id: link.id,
        })
      }
    })

    // Track file downloads
    document.addEventListener('click', (event) => {
      const target = event.target as Element
      const link = target.closest('a') as HTMLAnchorElement

      if (link && link.href) {
        const fileExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.jpg', '.png']
        const hasFileExtension = fileExtensions.some(ext => link.href.includes(ext))

        if (hasFileExtension) {
          this.trackEvent('file_download', {
            file_url: link.href,
            file_name: link.href.split('/').pop(),
            file_extension: link.href.split('.').pop(),
          })
        }
      }
    })

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      const formName = form.name || form.id || 'unnamed_form'

      this.trackFormSubmission(formName, {
        hasFiles: !!form.querySelector('input[type="file"]'),
        fieldCount: form.elements.length,
      })
    })

    // Track search queries
    const searchInputs = document.querySelectorAll('input[type="search"], input[name*="search"], input[placeholder*="search"]')
    searchInputs.forEach(input => {
      input.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement
        if (target.value.trim()) {
          this.trackSearch(target.value.trim(), 0) // Results count will be updated later
        }
      })
    })
  }

  // Visibility tracking
  private setupVisibilityTracking(): void {
    let isVisible = !document.hidden
    let hiddenStartTime = 0

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isVisible) {
        hiddenStartTime = Date.now()
        isVisible = false
      } else if (!document.hidden && !isVisible) {
        const hiddenDuration = Date.now() - hiddenStartTime
        this.trackEvent('visibility_change', {
          action: 'visible',
          hidden_duration: hiddenDuration,
        })
        isVisible = true
      }
    })
  }

  // Error tracking
  private setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.trackEvent('javascript_error', {
        error_message: event.message,
        error_filename: event.filename,
        error_lineno: event.lineno,
        error_colno: event.colno,
        error_stack: event.error?.stack,
      })
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('unhandled_promise_rejection', {
        rejection_reason: event.reason?.toString(),
        rejection_stack: event.reason?.stack,
      })
    })
  }

  // Performance tracking
  private setupPerformanceTracking(): void {
    if ('PerformanceObserver' in window) {
      // Track Long Tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackEvent('long_task', {
            duration: entry.duration,
            start_time: entry.startTime,
            task_type: entry.name,
          })
        }
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })

      // Track Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.trackEvent('largest_contentful_paint', {
          value: lastEntry.startTime,
          element: lastEntry.element?.tagName || 'unknown',
        })
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    }
  }

  // E-commerce initialization
  private initializeEcommerceTracking(): void {
    // Enhanced E-commerce for Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        custom_map: {
          'custom_parameter_1': 'session_id',
          'custom_parameter_2': 'user_segment',
          'custom_parameter_3': 'product_category',
        },
      })
    }

    // Track cart events
    this.trackCartEvents()
  }

  private trackCartEvents(): void {
    // Listen for cart events from other parts of the application
    window.addEventListener('cart_updated', (event: any) => {
      const cartData = event.detail
      this.trackEvent('cart_updated', {
        cart_total: cartData.total,
        cart_items_count: cartData.items?.length || 0,
        cart_currency: cartData.currency || 'CAD',
      })
    })
  }

  // Helper methods
  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.warn('Failed to send analytics event:', error)
      this.eventQueue.push(event)
    }
  }

  private processEventQueue(): void {
    if (this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    events.forEach(event => {
      this.sendEvent(event)
    })
  }

  private getUserId(): string | null {
    return this.getStorageItem('user_id') || null
  }

  private getUserSegment(): string {
    const segment = this.getStorageItem('user_segment')
    if (segment) return segment

    const newSegment = this.calculateUserSegment()
    this.setStorageItem('user_segment', newSegment)
    return newSegment
  }

  private calculateUserSegment(): string {
    const isNewVisitor = !this.getStorageItem('session_start')
    const referrer = document.referrer
    const userAgent = navigator.userAgent

    if (isNewVisitor) return 'new_visitor'
    if (referrer.includes('google.com')) return 'organic_search'
    if (referrer.includes('facebook.com') || referrer.includes('instagram.com')) return 'social'
    if (/Mobile|Android|iPhone/.test(userAgent)) return 'mobile_user'
    return 'returning_visitor'
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return 'mobile'
    if (/Tablet|iPad/.test(userAgent)) return 'tablet'
    return 'desktop'
  }

  private getTimeOnPage(): number {
    const sessionStart = this.getSessionStartTime()
    return Date.now() - sessionStart
  }

  private getSessionStartTime(): number {
    const startTime = this.getStorageItem('session_start')
    if (startTime) return parseInt(startTime)

    const now = Date.now()
    this.setStorageItem('session_start', now.toString())
    return now
  }

  private generateTransactionId(): string {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  private getStorageItem(key: string): string | null {
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key)
    } catch {
      return null
    }
  }

  private setStorageItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch {
      try {
        sessionStorage.setItem(key, value)
      } catch {
        // Storage not available
      }
    }
  }
}

// Create singleton instance
export const analytics = new ComprehensiveAnalytics()

// Export for use in components
export default analytics