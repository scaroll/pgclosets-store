"use client"

import { useEffect, useRef } from 'react'
import { getAnalytics } from '../../lib/analytics'
import { getFunnelTracker, FunnelStep } from './conversion-funnel'
import type { AnalyticsProductItem } from '../../types/analytics'

// Cart Abandonment Tracking Types
interface CartAbandonmentEvent {
  sessionId: string
  userId?: string
  abandonmentTime: number
  cartValue: number
  itemCount: number
  items: AnalyticsProductItem[]
  abandonmentStage: AbandonmentStage
  timeInCart: number
  pageExitedFrom: string
  deviceType: string
  trafficSource: string
  previousActions: string[]
  recoveryOpportunity: boolean
}

enum AbandonmentStage {
  CART_PAGE = 'cart_page',
  SHIPPING_INFO = 'shipping_info',
  PAYMENT_INFO = 'payment_info',
  REVIEW_ORDER = 'review_order',
  PAYMENT_PROCESSING = 'payment_processing'
}

interface CartSession {
  sessionId: string
  userId?: string
  startTime: number
  lastActivity: number
  items: AnalyticsProductItem[]
  value: number
  stage: AbandonmentStage
  events: CartEvent[]
  recoveryAttempts: number
  isAbandoned: boolean
}

interface CartEvent {
  type: 'add_item' | 'remove_item' | 'update_quantity' | 'apply_coupon' | 'remove_coupon' | 'proceed_checkout' | 'abandon' | 'session_start' | 'cart_value_change' | 'stage_progression' | 'checkout_complete' | 'abandonment' | 'page_hidden' | 'page_visible'
  timestamp: number
  data: any
}

class CartAbandonmentTracker {
  private analytics: any
  private funnelTracker: any
  private currentSession: CartSession | null = null
  private abandonmentTimers: Map<string, NodeJS.Timeout> = new Map()
  private recoveryCallbacks: Map<string, Function> = new Map()

  // Configuration
  private readonly ABANDONMENT_TIMEOUTS = {
    [AbandonmentStage.CART_PAGE]: 30 * 60 * 1000, // 30 minutes
    [AbandonmentStage.SHIPPING_INFO]: 15 * 60 * 1000, // 15 minutes
    [AbandonmentStage.PAYMENT_INFO]: 10 * 60 * 1000, // 10 minutes
    [AbandonmentStage.REVIEW_ORDER]: 5 * 60 * 1000, // 5 minutes
    [AbandonmentStage.PAYMENT_PROCESSING]: 2 * 60 * 1000 // 2 minutes
  }

  constructor() {
    this.analytics = getAnalytics()
    this.funnelTracker = getFunnelTracker()
    this.initializeTracking()
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined') return

    // Restore session from localStorage
    this.restoreSession()

    // Set up page unload tracking
    this.setupPageUnloadTracking()

    // Set up visibility change tracking
    this.setupVisibilityTracking()

    // Set up periodic session updates
    this.setupSessionUpdates()
  }

  // Session Management
  public startCartSession(userId?: string): void {
    if (this.currentSession) {
      this.endSession()
    }

    const sessionId = this.generateSessionId()
    this.currentSession = {
      sessionId,
      ...(userId !== undefined && { userId }),
      startTime: Date.now(),
      lastActivity: Date.now(),
      items: [],
      value: 0,
      stage: AbandonmentStage.CART_PAGE,
      events: [],
      recoveryAttempts: 0,
      isAbandoned: false
    }

    this.saveSession()
    this.startAbandonmentTimer()

    // Track cart session start
    this.trackEvent('session_start')
  }

  public updateCartItems(items: AnalyticsProductItem[]): void {
    if (!this.currentSession) {
      this.startCartSession()
    }

    if (!this.currentSession) return

    const previousValue = this.currentSession.value
    const newValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    this.currentSession.items = [...items]
    this.currentSession.value = newValue
    this.currentSession.lastActivity = Date.now()

    // Track value change
    if (newValue !== previousValue) {
      this.trackEvent('cart_value_change', {
        previous_value: previousValue,
        new_value: newValue,
        value_change: newValue - previousValue,
        item_count: items.length
      })
    }

    this.saveSession()
    this.resetAbandonmentTimer()
  }

  public addToCart(item: AnalyticsProductItem): void {
    if (!this.currentSession) {
      this.startCartSession()
    }

    if (!this.currentSession) return

    // Check if item already exists
    const existingItemIndex = this.currentSession.items.findIndex(
      cartItem => cartItem.item_id === item.item_id
    )

    if (existingItemIndex >= 0) {
      // Update quantity
      const existingItem = this.currentSession.items[existingItemIndex]
      if (existingItem) {
        existingItem.quantity += item.quantity
      }
    } else {
      // Add new item
      this.currentSession.items.push(item)
    }

    this.currentSession.value = this.calculateCartValue()
    this.currentSession.lastActivity = Date.now()

    this.trackEvent('add_item', {
      item_id: item.item_id,
      item_name: item.item_name,
      item_price: item.price,
      quantity: item.quantity,
      cart_value: this.currentSession.value,
      cart_size: this.currentSession.items.length
    })

    this.saveSession()
    this.resetAbandonmentTimer()

    // Track in GA4
    this.analytics?.trackAddToCart({
      currency: 'CAD',
      value: item.price * item.quantity,
      items: [item],
      user_id: this.currentSession.userId
    })
  }

  public removeFromCart(itemId: string): void {
    if (!this.currentSession) return

    const itemIndex = this.currentSession.items.findIndex(item => item.item_id === itemId)
    if (itemIndex >= 0) {
      const removedItem = this.currentSession.items[itemIndex]
      if (removedItem) {
        this.currentSession.items.splice(itemIndex, 1)
        this.currentSession.value = this.calculateCartValue()
        this.currentSession.lastActivity = Date.now()

        this.trackEvent('remove_item', {
          item_id: removedItem.item_id,
          item_name: removedItem.item_name,
          item_price: removedItem.price,
          quantity: removedItem.quantity,
          cart_value: this.currentSession.value,
          cart_size: this.currentSession.items.length
        })
      }

      this.saveSession()

      // If cart is empty, track abandonment
      if (this.currentSession.items.length === 0) {
        this.trackAbandonment('cart_emptied')
      } else {
        this.resetAbandonmentTimer()
      }
    }
  }

  public progressToCheckoutStage(stage: AbandonmentStage): void {
    if (!this.currentSession) return

    const previousStage = this.currentSession.stage
    this.currentSession.stage = stage
    this.currentSession.lastActivity = Date.now()

    this.trackEvent('stage_progression', {
      previous_stage: previousStage,
      new_stage: stage,
      time_in_previous_stage: Date.now() - this.currentSession.startTime
    })

    this.saveSession()
    this.resetAbandonmentTimer()

    // Track funnel progression
    this.funnelTracker?.trackFunnelStep(
      this.mapStageToFunnelStep(stage),
      `checkout_${stage}`,
      this.currentSession.value
    )
  }

  public completeCheckout(transactionId: string): void {
    if (!this.currentSession) return

    this.trackEvent('checkout_complete', {
      transaction_id: transactionId,
      final_value: this.currentSession.value,
      item_count: this.currentSession.items.length,
      time_to_complete: Date.now() - this.currentSession.startTime
    })

    // Clear abandonment timer
    this.clearAbandonmentTimer()

    // Track purchase
    this.analytics?.trackPurchase({
      transaction_id: transactionId,
      value: this.currentSession.value,
      currency: 'CAD',
      items: this.currentSession.items,
      user_id: this.currentSession.userId
    })

    // End session
    this.endSession()
  }

  // Abandonment Detection
  private startAbandonmentTimer(): void {
    if (!this.currentSession) return

    this.clearAbandonmentTimer()

    const timeout = this.ABANDONMENT_TIMEOUTS[this.currentSession.stage]
    const timer = setTimeout(() => {
      this.trackAbandonment('timeout')
    }, timeout)

    this.abandonmentTimers.set(this.currentSession.sessionId, timer)
  }

  private resetAbandonmentTimer(): void {
    this.startAbandonmentTimer()
  }

  private clearAbandonmentTimer(): void {
    if (!this.currentSession) return

    const timer = this.abandonmentTimers.get(this.currentSession.sessionId)
    if (timer) {
      clearTimeout(timer)
      this.abandonmentTimers.delete(this.currentSession.sessionId)
    }
  }

  private trackAbandonment(reason: string): void {
    if (!this.currentSession || this.currentSession.isAbandoned) return

    this.currentSession.isAbandoned = true
    this.currentSession.lastActivity = Date.now()

    const abandonmentEvent: CartAbandonmentEvent = {
      sessionId: this.currentSession.sessionId,
      ...(this.currentSession.userId !== undefined && { userId: this.currentSession.userId }),
      abandonmentTime: Date.now(),
      cartValue: this.currentSession.value,
      itemCount: this.currentSession.items.length,
      items: [...this.currentSession.items],
      abandonmentStage: this.currentSession.stage,
      timeInCart: Date.now() - this.currentSession.startTime,
      pageExitedFrom: window.location.pathname,
      deviceType: this.getDeviceType(),
      trafficSource: this.getTrafficSource(),
      previousActions: this.currentSession.events.map(e => e.type),
      recoveryOpportunity: this.currentSession.value > 50 // Minimum value for recovery
    }

    // Track in GA4
    this.analytics?.gtag('event', 'cart_abandonment', {
      event_category: 'E-commerce',
      event_label: 'Cart Abandoned',
      currency: 'CAD',
      value: abandonmentEvent.cartValue,
      abandonment_stage: abandonmentEvent.abandonmentStage,
      abandonment_reason: reason,
      time_in_cart: abandonmentEvent.timeInCart,
      item_count: abandonmentEvent.itemCount,
      recovery_opportunity: abandonmentEvent.recoveryOpportunity,
      custom_map: {
        cart_value: abandonmentEvent.cartValue,
        stage: abandonmentEvent.abandonmentStage,
        device_type: abandonmentEvent.deviceType
      }
    })

    // Track funnel abandonment
    this.funnelTracker?.trackAbandonmentPoint(
      this.mapStageToFunnelStep(this.currentSession.stage),
      reason
    )

    // Store abandonment data for recovery
    this.storeAbandonmentData(abandonmentEvent)

    // Trigger recovery callbacks
    this.triggerRecoveryCallbacks(abandonmentEvent)

    this.trackEvent('abandonment', {
      reason,
      stage: this.currentSession.stage,
      value: this.currentSession.value,
      time_in_cart: abandonmentEvent.timeInCart
    })

    this.saveSession()
  }

  // Recovery Tracking
  public trackRecoveryAttempt(method: string, success: boolean): void {
    if (!this.currentSession) return

    this.currentSession.recoveryAttempts++

    this.analytics?.gtag('event', 'cart_recovery_attempt', {
      event_category: 'E-commerce',
      event_label: 'Recovery Attempt',
      recovery_method: method,
      recovery_success: success,
      attempt_number: this.currentSession.recoveryAttempts,
      cart_value: this.currentSession.value
    })

    if (success) {
      this.currentSession.isAbandoned = false
      this.resetAbandonmentTimer()

      this.analytics?.gtag('event', 'cart_recovery_success', {
        event_category: 'E-commerce',
        event_label: 'Recovery Success',
        recovery_method: method,
        cart_value: this.currentSession.value,
        time_to_recovery: Date.now() - this.currentSession.lastActivity
      })
    }

    this.saveSession()
  }

  // Analytics and Reporting
  public getAbandonmentAnalytics(): any {
    const abandonmentData = this.getStoredAbandonmentData()

    return {
      totalAbandonments: abandonmentData.length,
      averageCartValue: this.calculateAverageCartValue(abandonmentData),
      mostCommonStage: this.getMostCommonAbandonmentStage(abandonmentData),
      averageTimeInCart: this.calculateAverageTimeInCart(abandonmentData),
      recoveryOpportunities: abandonmentData.filter(a => a.recoveryOpportunity).length,
      deviceBreakdown: this.getDeviceBreakdown(abandonmentData),
      stageBreakdown: this.getStageBreakdown(abandonmentData)
    }
  }

  // Utility Methods
  private trackEvent(type: CartEvent['type'], data?: any): void {
    if (!this.currentSession) return

    this.currentSession.events.push({
      type,
      timestamp: Date.now(),
      data: data || {}
    })
  }

  private calculateCartValue(): number {
    if (!this.currentSession) return 0
    return this.currentSession.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  private generateSessionId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private mapStageToFunnelStep(stage: AbandonmentStage): FunnelStep {
    switch (stage) {
      case AbandonmentStage.CART_PAGE:
        return FunnelStep.CONSIDERATION
      case AbandonmentStage.SHIPPING_INFO:
        return FunnelStep.INTENT
      case AbandonmentStage.PAYMENT_INFO:
        return FunnelStep.EVALUATION
      case AbandonmentStage.REVIEW_ORDER:
        return FunnelStep.EVALUATION
      case AbandonmentStage.PAYMENT_PROCESSING:
        return FunnelStep.PURCHASE
      default:
        return FunnelStep.CONSIDERATION
    }
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
    return 'Referral'
  }

  // Storage Methods
  private saveSession(): void {
    if (!this.currentSession) return
    localStorage.setItem('cart_session', JSON.stringify(this.currentSession))
  }

  private restoreSession(): void {
    try {
      const stored = localStorage.getItem('cart_session')
      if (stored) {
        this.currentSession = JSON.parse(stored)
        if (this.currentSession && !this.currentSession.isAbandoned) {
          this.startAbandonmentTimer()
        }
      }
    } catch (error) {
      console.warn('Failed to restore cart session:', error)
    }
  }

  private endSession(): void {
    this.clearAbandonmentTimer()
    localStorage.removeItem('cart_session')
    this.currentSession = null
  }

  private storeAbandonmentData(event: CartAbandonmentEvent): void {
    try {
      const stored = localStorage.getItem('cart_abandonments')
      const abandonments = stored ? JSON.parse(stored) : []
      abandonments.push(event)

      // Keep only last 50 abandonments
      if (abandonments.length > 50) {
        abandonments.splice(0, abandonments.length - 50)
      }

      localStorage.setItem('cart_abandonments', JSON.stringify(abandonments))
    } catch (error) {
      console.warn('Failed to store abandonment data:', error)
    }
  }

  private getStoredAbandonmentData(): CartAbandonmentEvent[] {
    try {
      const stored = localStorage.getItem('cart_abandonments')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      return []
    }
  }

  // Analytics Calculation Methods
  private calculateAverageCartValue(abandonments: CartAbandonmentEvent[]): number {
    if (abandonments.length === 0) return 0
    const total = abandonments.reduce((sum, a) => sum + a.cartValue, 0)
    return Math.round((total / abandonments.length) * 100) / 100
  }

  private getMostCommonAbandonmentStage(abandonments: CartAbandonmentEvent[]): string {
    if (abandonments.length === 0) return 'none'
    const stageCounts = abandonments.reduce((counts, a) => {
      counts[a.abandonmentStage] = (counts[a.abandonmentStage] || 0) + 1
      return counts
    }, {} as Record<string, number>)

    const sorted = Object.entries(stageCounts).sort(([,a], [,b]) => b - a)
    const mostCommon = sorted[0]
    return mostCommon ? mostCommon[0] : 'none'
  }

  private calculateAverageTimeInCart(abandonments: CartAbandonmentEvent[]): number {
    if (abandonments.length === 0) return 0
    const total = abandonments.reduce((sum, a) => sum + a.timeInCart, 0)
    return Math.round((total / abandonments.length) / 1000) // Convert to seconds
  }

  private getDeviceBreakdown(abandonments: CartAbandonmentEvent[]): Record<string, number> {
    return abandonments.reduce((breakdown, a) => {
      breakdown[a.deviceType] = (breakdown[a.deviceType] || 0) + 1
      return breakdown
    }, {} as Record<string, number>)
  }

  private getStageBreakdown(abandonments: CartAbandonmentEvent[]): Record<string, number> {
    return abandonments.reduce((breakdown, a) => {
      breakdown[a.abandonmentStage] = (breakdown[a.abandonmentStage] || 0) + 1
      return breakdown
    }, {} as Record<string, number>)
  }

  // Event Setup Methods
  private setupPageUnloadTracking(): void {
    window.addEventListener('beforeunload', () => {
      if (this.currentSession && !this.currentSession.isAbandoned && this.currentSession.items.length > 0) {
        this.trackAbandonment('page_unload')
      }
    })
  }

  private setupVisibilityTracking(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.currentSession && !this.currentSession.isAbandoned) {
        // Don't immediately abandon, but track the visibility change
        this.trackEvent('page_hidden')
      } else if (!document.hidden && this.currentSession) {
        this.trackEvent('page_visible')
        this.currentSession.lastActivity = Date.now()
        this.resetAbandonmentTimer()
      }
    })
  }

  private setupSessionUpdates(): void {
    // Update session activity every 30 seconds while user is active
    setInterval(() => {
      if (this.currentSession && !this.currentSession.isAbandoned) {
        this.currentSession.lastActivity = Date.now()
        this.saveSession()
      }
    }, 30000)
  }

  private triggerRecoveryCallbacks(event: CartAbandonmentEvent): void {
    this.recoveryCallbacks.forEach(callback => {
      try {
        callback(event)
      } catch (error) {
        console.warn('Recovery callback error:', error)
      }
    })
  }

  // Public API
  public onCartAbandonment(callback: (event: CartAbandonmentEvent) => void): void {
    const id = `callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.recoveryCallbacks.set(id, callback)
  }

  public getCurrentSession(): CartSession | null {
    return this.currentSession
  }

  public isSessionActive(): boolean {
    return this.currentSession !== null && !this.currentSession.isAbandoned
  }
}

// Singleton instance
let cartAbandonmentTracker: CartAbandonmentTracker | null = null

export function getCartAbandonmentTracker(): CartAbandonmentTracker {
  if (!cartAbandonmentTracker) {
    cartAbandonmentTracker = new CartAbandonmentTracker()
  }
  return cartAbandonmentTracker
}

// React Hook
export function useCartAbandonmentTracking() {
  const tracker = useRef<CartAbandonmentTracker | null>(null)

  useEffect(() => {
    tracker.current = getCartAbandonmentTracker()
  }, [])

  return {
    startSession: (userId?: string) => tracker.current?.startCartSession(userId),
    addToCart: (item: AnalyticsProductItem) => tracker.current?.addToCart(item),
    removeFromCart: (itemId: string) => tracker.current?.removeFromCart(itemId),
    updateCartItems: (items: AnalyticsProductItem[]) => tracker.current?.updateCartItems(items),
    progressToStage: (stage: AbandonmentStage) => tracker.current?.progressToCheckoutStage(stage),
    completeCheckout: (transactionId: string) => tracker.current?.completeCheckout(transactionId),
    trackRecovery: (method: string, success: boolean) => tracker.current?.trackRecoveryAttempt(method, success),
    getAnalytics: () => tracker.current?.getAbandonmentAnalytics(),
    getCurrentSession: () => tracker.current?.getCurrentSession(),
    isActive: () => tracker.current?.isSessionActive() || false,
    onAbandonment: (callback: (event: CartAbandonmentEvent) => void) => tracker.current?.onCartAbandonment(callback)
  }
}

export { CartAbandonmentTracker, AbandonmentStage }
export type { CartAbandonmentEvent, CartSession, CartEvent }