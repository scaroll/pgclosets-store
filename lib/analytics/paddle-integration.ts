// Paddle Payment Integration with GA4 E-commerce Tracking
// Comprehensive tracking for Paddle checkout events and transactions

import { ga4, type ProductItem, type PurchaseEvent } from './ga4-events'

export interface PaddleProduct {
  id: string
  name: string
  price: number
  currency: string
  category?: string
  variant?: string
  quantity?: number
}

export interface PaddleCheckoutData {
  checkout_id: string
  products: PaddleProduct[]
  customer_email?: string
  customer_country?: string
  total_amount: number
  currency: string
  coupon_code?: string
  tax_amount?: number
  custom_data?: Record<string, any>
}

export interface PaddleTransactionData {
  transaction_id: string
  checkout_id: string
  receipt_url: string
  products: PaddleProduct[]
  customer_email: string
  customer_country: string
  total_amount: number
  currency: string
  coupon_code?: string
  tax_amount?: number
  payment_method: string
  subscription_id?: string
  is_subscription: boolean
  custom_data?: Record<string, any>
}

class PaddleAnalyticsIntegration {
  private debug: boolean
  private trackingEnabled: boolean = false

  constructor(debug: boolean = false) {
    this.debug = debug
    this.initializePaddleTracking()
  }

  private initializePaddleTracking() {
    if (typeof window === 'undefined') return

    // Check if Paddle is available
    const checkPaddle = () => {
      if (window.Paddle) {
        this.setupPaddleEventListeners()
        this.trackingEnabled = true
        
        if (this.debug) {
          console.log('[PaddleAnalytics] Paddle integration initialized')
        }
      } else {
        // Retry after a short delay
        setTimeout(checkPaddle, 1000)
      }
    }

    checkPaddle()
  }

  private setupPaddleEventListeners() {
    if (!window.Paddle || !window.Paddle.on) return

    // Checkout opened
    window.Paddle.on('checkout.loaded', (data: any) => {
      this.trackCheckoutStarted(data)
    })

    // Checkout completed
    window.Paddle.on('checkout.completed', (data: any) => {
      this.trackPurchaseCompleted(data)
    })

    // Checkout closed (abandoned)
    window.Paddle.on('checkout.closed', (data: any) => {
      this.trackCheckoutAbandoned(data)
    })

    // Payment method selected
    window.Paddle.on('checkout.payment_method_selected', (data: any) => {
      this.trackPaymentMethodSelected(data)
    })

    // Coupon applied
    window.Paddle.on('checkout.coupon_applied', (data: any) => {
      this.trackCouponApplied(data)
    })

    // Subscription events
    window.Paddle.on('subscription.created', (data: any) => {
      this.trackSubscriptionCreated(data)
    })

    window.Paddle.on('subscription.updated', (data: any) => {
      this.trackSubscriptionUpdated(data)
    })

    window.Paddle.on('subscription.cancelled', (data: any) => {
      this.trackSubscriptionCancelled(data)
    })
  }

  // Convert Paddle product to GA4 product item
  private paddleProductToGA4Item(product: PaddleProduct): ProductItem {
    return {
      item_id: product.id,
      item_name: product.name,
      item_category: product.category || 'Closet Products',
      item_brand: 'Renin',
      item_variant: product.variant,
      price: product.price,
      quantity: product.quantity || 1,
      currency: product.currency
    }
  }

  // Track checkout initiation
  private trackCheckoutStarted(paddleData: any) {
    try {
      const checkoutData = this.extractCheckoutData(paddleData)
      const ga4Items = checkoutData.products.map(p => this.paddleProductToGA4Item(p))

      // Track begin_checkout event
      ga4.beginCheckout({
        currency: checkoutData.currency,
        value: checkoutData.total_amount,
        items: ga4Items,
        coupon: checkoutData.coupon_code
      })

      // Track custom event with additional context
      ga4.customEvent({
        event_name: 'paddle_checkout_started',
        event_parameters: {
          checkout_id: checkoutData.checkout_id,
          currency: checkoutData.currency,
          value: checkoutData.total_amount,
          customer_country: checkoutData.customer_country,
          product_count: checkoutData.products.length
        }
      })

      if (this.debug) {
        console.log('[PaddleAnalytics] Checkout started:', checkoutData)
      }
    } catch (error) {
      console.error('[PaddleAnalytics] Error tracking checkout started:', error)
      ga4.exception('Paddle checkout start tracking error', false)
    }
  }

  // Track completed purchase
  private trackPurchaseCompleted(paddleData: any) {
    try {
      const transactionData = this.extractTransactionData(paddleData)
      const ga4Items = transactionData.products.map(p => this.paddleProductToGA4Item(p))

      // Track purchase event
      const purchaseEvent: PurchaseEvent = {
        transaction_id: transactionData.transaction_id,
        value: transactionData.total_amount,
        currency: transactionData.currency,
        items: ga4Items,
        coupon: transactionData.coupon_code,
        tax: transactionData.tax_amount,
        affiliation: 'PG Closets Store'
      }

      ga4.purchase(purchaseEvent)

      // Track additional paddle-specific event
      ga4.customEvent({
        event_name: 'paddle_purchase_completed',
        event_parameters: {
          transaction_id: transactionData.transaction_id,
          checkout_id: transactionData.checkout_id,
          currency: transactionData.currency,
          value: transactionData.total_amount,
          payment_method: transactionData.payment_method,
          customer_country: transactionData.customer_country,
          is_subscription: transactionData.is_subscription,
          subscription_id: transactionData.subscription_id
        }
      })

      // Track subscription-specific event if applicable
      if (transactionData.is_subscription) {
        ga4.customEvent({
          event_name: 'subscription_purchase',
          event_parameters: {
            subscription_id: transactionData.subscription_id,
            transaction_id: transactionData.transaction_id,
            value: transactionData.total_amount,
            currency: transactionData.currency
          }
        })
      }

      if (this.debug) {
        console.log('[PaddleAnalytics] Purchase completed:', transactionData)
      }
    } catch (error) {
      console.error('[PaddleAnalytics] Error tracking purchase completed:', error)
      ga4.exception('Paddle purchase tracking error', false)
    }
  }

  // Track checkout abandonment
  private trackCheckoutAbandoned(paddleData: any) {
    try {
      const checkoutData = this.extractCheckoutData(paddleData)

      ga4.customEvent({
        event_name: 'paddle_checkout_abandoned',
        event_parameters: {
          checkout_id: checkoutData.checkout_id,
          currency: checkoutData.currency,
          value: checkoutData.total_amount,
          abandonment_stage: paddleData.stage || 'unknown'
        }
      })

      if (this.debug) {
        console.log('[PaddleAnalytics] Checkout abandoned:', checkoutData)
      }
    } catch (error) {
      console.error('[PaddleAnalytics] Error tracking checkout abandonment:', error)
    }
  }

  // Track payment method selection
  private trackPaymentMethodSelected(paddleData: any) {
    ga4.customEvent({
      event_name: 'payment_method_selected',
      event_parameters: {
        payment_method: paddleData.payment_method,
        checkout_id: paddleData.checkout_id
      }
    })

    if (this.debug) {
      console.log('[PaddleAnalytics] Payment method selected:', paddleData.payment_method)
    }
  }

  // Track coupon application
  private trackCouponApplied(paddleData: any) {
    ga4.customEvent({
      event_name: 'coupon_applied',
      event_parameters: {
        coupon_code: paddleData.coupon_code,
        discount_amount: paddleData.discount_amount,
        checkout_id: paddleData.checkout_id
      }
    })

    if (this.debug) {
      console.log('[PaddleAnalytics] Coupon applied:', paddleData.coupon_code)
    }
  }

  // Track subscription creation
  private trackSubscriptionCreated(paddleData: any) {
    ga4.customEvent({
      event_name: 'subscription_created',
      event_parameters: {
        subscription_id: paddleData.subscription_id,
        plan_id: paddleData.plan_id,
        customer_id: paddleData.customer_id,
        billing_cycle: paddleData.billing_cycle
      }
    })

    if (this.debug) {
      console.log('[PaddleAnalytics] Subscription created:', paddleData.subscription_id)
    }
  }

  // Track subscription updates
  private trackSubscriptionUpdated(paddleData: any) {
    ga4.customEvent({
      event_name: 'subscription_updated',
      event_parameters: {
        subscription_id: paddleData.subscription_id,
        old_plan_id: paddleData.old_plan_id,
        new_plan_id: paddleData.new_plan_id,
        update_type: paddleData.update_type
      }
    })

    if (this.debug) {
      console.log('[PaddleAnalytics] Subscription updated:', paddleData.subscription_id)
    }
  }

  // Track subscription cancellation
  private trackSubscriptionCancelled(paddleData: any) {
    ga4.customEvent({
      event_name: 'subscription_cancelled',
      event_parameters: {
        subscription_id: paddleData.subscription_id,
        cancellation_reason: paddleData.cancellation_reason,
        effective_date: paddleData.effective_date
      }
    })

    if (this.debug) {
      console.log('[PaddleAnalytics] Subscription cancelled:', paddleData.subscription_id)
    }
  }

  // Extract checkout data from Paddle event
  private extractCheckoutData(paddleData: any): PaddleCheckoutData {
    return {
      checkout_id: paddleData.checkout?.id || paddleData.id,
      products: this.extractProducts(paddleData),
      customer_email: paddleData.customer?.email,
      customer_country: paddleData.customer?.country,
      total_amount: paddleData.totals?.grand_total || paddleData.total,
      currency: paddleData.currency || 'CAD',
      coupon_code: paddleData.discount?.coupon_code,
      tax_amount: paddleData.totals?.tax || paddleData.tax,
      custom_data: paddleData.custom_data
    }
  }

  // Extract transaction data from Paddle event
  private extractTransactionData(paddleData: any): PaddleTransactionData {
    return {
      transaction_id: paddleData.transaction?.id || paddleData.order?.id,
      checkout_id: paddleData.checkout?.id,
      receipt_url: paddleData.receipt_url,
      products: this.extractProducts(paddleData),
      customer_email: paddleData.customer?.email,
      customer_country: paddleData.customer?.country,
      total_amount: paddleData.totals?.grand_total || paddleData.total,
      currency: paddleData.currency || 'CAD',
      coupon_code: paddleData.discount?.coupon_code,
      tax_amount: paddleData.totals?.tax || paddleData.tax,
      payment_method: paddleData.payment_method?.type,
      subscription_id: paddleData.subscription?.id,
      is_subscription: !!paddleData.subscription,
      custom_data: paddleData.custom_data
    }
  }

  // Extract products from Paddle data
  private extractProducts(paddleData: any): PaddleProduct[] {
    const items = paddleData.items || paddleData.products || []
    
    return items.map((item: any) => ({
      id: item.product?.id || item.id,
      name: item.product?.name || item.name,
      price: item.price?.unit_price || item.unit_price || item.price,
      currency: item.price?.currency || paddleData.currency || 'CAD',
      category: item.product?.category || 'Closet Products',
      variant: item.product?.variant || item.variant,
      quantity: item.quantity || 1
    }))
  }

  // Manual tracking methods for custom implementations

  // Manually track a purchase (for server-side confirmations)
  trackManualPurchase(transactionData: PaddleTransactionData) {
    this.trackPurchaseCompleted(transactionData)
  }

  // Track refund
  trackRefund(transactionId: string, refundAmount: number, currency: string = 'CAD') {
    ga4.customEvent({
      event_name: 'refund',
      event_parameters: {
        transaction_id: transactionId,
        currency,
        value: refundAmount
      }
    })

    if (this.debug) {
      console.log('[PaddleAnalytics] Refund tracked:', { transactionId, refundAmount })
    }
  }

  // Track subscription renewal
  trackSubscriptionRenewal(subscriptionId: string, amount: number, currency: string = 'CAD') {
    ga4.customEvent({
      event_name: 'subscription_renewal',
      event_parameters: {
        subscription_id: subscriptionId,
        currency,
        value: amount
      }
    })

    if (this.debug) {
      console.log('[PaddleAnalytics] Subscription renewal tracked:', { subscriptionId, amount })
    }
  }

  // Get tracking status
  isTrackingEnabled(): boolean {
    return this.trackingEnabled
  }
}

// Singleton instance
export const paddleAnalytics = new PaddleAnalyticsIntegration(
  process.env.NODE_ENV === 'development'
)


export { PaddleAnalyticsIntegration }