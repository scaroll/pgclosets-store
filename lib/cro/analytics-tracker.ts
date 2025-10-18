/**
 * DIVISION 5: CONVERSION RATE OPTIMIZATION
 * Analytics Tracker (Agent 25)
 *
 * Comprehensive conversion tracking and analytics
 */

export interface ConversionEvent {
  type: 'page_view' | 'add_to_cart' | 'begin_checkout' | 'purchase' | 'lead' | 'engagement'
  timestamp: number
  sessionId: string
  userId?: string
  page: string
  value?: number
  currency?: string
  items?: any[]
  metadata?: Record<string, any>
}

export interface ConversionFunnel {
  name: string
  steps: FunnelStep[]
  totalEntered: number
  completionRate: number
  dropOffRate: number
}

export interface FunnelStep {
  name: string
  entered: number
  completed: number
  conversionRate: number
  avgTimeOnStep: number
  dropOffReasons: Record<string, number>
}

class CROAnalyticsTracker {
  private events: ConversionEvent[] = []
  private sessionId: string
  private userId?: string

  constructor() {
    this.sessionId = this.getSessionId()
    this.loadUserId()
  }

  /**
   * Track conversion event
   */
  track(event: Omit<ConversionEvent, 'timestamp' | 'sessionId' | 'userId'>): void {
    const fullEvent: ConversionEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    this.events.push(fullEvent)
    this.sendToAnalytics(fullEvent)
    this.saveToStorage()
  }

  /**
   * Track page view with CRO context
   */
  trackPageView(page: string, metadata?: Record<string, any>): void {
    this.track({
      type: 'page_view',
      page,
      metadata
    })

    // Track with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: page
      })
    }
  }

  /**
   * Track add to cart
   */
  trackAddToCart(items: any[], value: number): void {
    this.track({
      type: 'add_to_cart',
      page: window.location.pathname,
      items,
      value,
      currency: 'CAD'
    })

    // Track with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'add_to_cart', {
        currency: 'CAD',
        value,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      })
    }
  }

  /**
   * Track checkout start
   */
  trackBeginCheckout(items: any[], value: number): void {
    this.track({
      type: 'begin_checkout',
      page: window.location.pathname,
      items,
      value,
      currency: 'CAD'
    })

    // Track with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'CAD',
        value,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      })
    }
  }

  /**
   * Track purchase
   */
  trackPurchase(
    transactionId: string,
    items: any[],
    value: number,
    tax?: number,
    shipping?: number
  ): void {
    this.track({
      type: 'purchase',
      page: window.location.pathname,
      items,
      value,
      currency: 'CAD',
      metadata: {
        transaction_id: transactionId,
        tax,
        shipping
      }
    })

    // Track with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: transactionId,
        currency: 'CAD',
        value,
        tax: tax || 0,
        shipping: shipping || 0,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      })
    }
  }

  /**
   * Track lead generation
   */
  trackLead(leadType: 'quote' | 'consultation' | 'contact', metadata?: Record<string, any>): void {
    this.track({
      type: 'lead',
      page: window.location.pathname,
      metadata: {
        ...metadata,
        lead_type: leadType
      }
    })

    // Track with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'generate_lead', {
        value: 0,
        currency: 'CAD',
        lead_type: leadType
      })
    }
  }

  /**
   * Track engagement
   */
  trackEngagement(action: string, metadata?: Record<string, any>): void {
    this.track({
      type: 'engagement',
      page: window.location.pathname,
      metadata: {
        ...metadata,
        action
      }
    })

    // Track with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'engagement', {
        engagement_action: action,
        ...metadata
      })
    }
  }

  /**
   * Get conversion funnel analysis
   */
  getConversionFunnel(funnelName: string): ConversionFunnel | null {
    // Define funnels
    const funnels: Record<string, string[]> = {
      purchase: ['page_view', 'add_to_cart', 'begin_checkout', 'purchase'],
      quote: ['page_view', 'engagement', 'lead']
    }

    const steps = funnels[funnelName]
    if (!steps) return null

    const funnelSteps: FunnelStep[] = []
    let previousCount = 0

    steps.forEach((stepType, index) => {
      const stepEvents = this.events.filter(e => e.type === stepType as any)
      const count = stepEvents.length

      const step: FunnelStep = {
        name: stepType,
        entered: count,
        completed: index < steps.length - 1 ? this.events.filter(e => e.type === steps[index + 1] as any).length : count,
        conversionRate: previousCount > 0 ? count / previousCount : 1,
        avgTimeOnStep: this.calculateAvgTimeOnStep(stepType as any),
        dropOffReasons: {}
      }

      funnelSteps.push(step)
      previousCount = count
    })

    const totalEntered = funnelSteps[0]?.entered || 0
    const completed = funnelSteps[funnelSteps.length - 1]?.completed || 0

    return {
      name: funnelName,
      steps: funnelSteps,
      totalEntered,
      completionRate: totalEntered > 0 ? completed / totalEntered : 0,
      dropOffRate: totalEntered > 0 ? 1 - (completed / totalEntered) : 0
    }
  }

  /**
   * Get conversion metrics
   */
  getMetrics(): {
    totalEvents: number
    totalValue: number
    conversionRate: number
    avgOrderValue: number
    cartAbandonmentRate: number
    checkoutAbandonmentRate: number
  } {
    const pageViews = this.events.filter(e => e.type === 'page_view').length
    const addToCarts = this.events.filter(e => e.type === 'add_to_cart').length
    const checkouts = this.events.filter(e => e.type === 'begin_checkout').length
    const purchases = this.events.filter(e => e.type === 'purchase')

    const totalValue = purchases.reduce((sum, e) => sum + (e.value || 0), 0)
    const avgOrderValue = purchases.length > 0 ? totalValue / purchases.length : 0

    return {
      totalEvents: this.events.length,
      totalValue,
      conversionRate: pageViews > 0 ? purchases.length / pageViews : 0,
      avgOrderValue,
      cartAbandonmentRate: addToCarts > 0 ? 1 - (checkouts / addToCarts) : 0,
      checkoutAbandonmentRate: checkouts > 0 ? 1 - (purchases.length / checkouts) : 0
    }
  }

  /**
   * Calculate average time on step
   */
  private calculateAvgTimeOnStep(stepType: ConversionEvent['type']): number {
    const stepEvents = this.events.filter(e => e.type === stepType)
    if (stepEvents.length === 0) return 0

    const times: number[] = []
    for (let i = 0; i < stepEvents.length - 1; i++) {
      times.push(stepEvents[i + 1].timestamp - stepEvents[i].timestamp)
    }

    return times.length > 0 ? times.reduce((sum, t) => sum + t, 0) / times.length : 0
  }

  /**
   * Send to analytics
   */
  private sendToAnalytics(event: ConversionEvent): void {
    // Could send to external analytics service
    // For now, just log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[CRO Analytics]', event)
    }
  }

  /**
   * Get or create session ID
   */
  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server'

    let sessionId = sessionStorage.getItem('cro_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('cro_session_id', sessionId)
    }
    return sessionId
  }

  /**
   * Load user ID
   */
  private loadUserId(): void {
    if (typeof window === 'undefined') return

    const userId = localStorage.getItem('cro_user_id')
    if (userId) {
      this.userId = userId
    }
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    this.userId = userId
    if (typeof window !== 'undefined') {
      localStorage.setItem('cro_user_id', userId)
    }
  }

  /**
   * Save events to storage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    // Keep last 100 events
    const recentEvents = this.events.slice(-100)
    sessionStorage.setItem('cro_events', JSON.stringify(recentEvents))
  }

  /**
   * Load events from storage
   */
  loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = sessionStorage.getItem('cro_events')
      if (stored) {
        this.events = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load CRO events:', error)
    }
  }

  /**
   * Export events as CSV
   */
  exportCSV(): string {
    const headers = ['timestamp', 'type', 'page', 'value', 'sessionId', 'userId']
    const rows = this.events.map(event => [
      new Date(event.timestamp).toISOString(),
      event.type,
      event.page,
      event.value || '',
      event.sessionId,
      event.userId || ''
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }
}

// Singleton instance
let tracker: CROAnalyticsTracker | null = null

export function getCROAnalyticsTracker(): CROAnalyticsTracker {
  if (!tracker) {
    tracker = new CROAnalyticsTracker()
    tracker.loadFromStorage()
  }
  return tracker
}

/**
 * React Hook for CRO Analytics
 */
export function useCROAnalytics() {
  const tracker = getCROAnalyticsTracker()

  return {
    trackPageView: (page: string, metadata?: Record<string, any>) => tracker.trackPageView(page, metadata),
    trackAddToCart: (items: any[], value: number) => tracker.trackAddToCart(items, value),
    trackBeginCheckout: (items: any[], value: number) => tracker.trackBeginCheckout(items, value),
    trackPurchase: (id: string, items: any[], value: number, tax?: number, shipping?: number) =>
      tracker.trackPurchase(id, items, value, tax, shipping),
    trackLead: (type: 'quote' | 'consultation' | 'contact', metadata?: Record<string, any>) =>
      tracker.trackLead(type, metadata),
    trackEngagement: (action: string, metadata?: Record<string, any>) =>
      tracker.trackEngagement(action, metadata),
    getMetrics: () => tracker.getMetrics(),
    getFunnel: (name: string) => tracker.getConversionFunnel(name),
    setUserId: (id: string) => tracker.setUserId(id)
  }
}
