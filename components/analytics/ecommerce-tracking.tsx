"use client"

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  AnalyticsProductItem,
  AnalyticsPurchaseEvent,
  AnalyticsAddToCartEvent,
  AnalyticsBeginCheckoutEvent,
  AnalyticsViewItemEvent,
  AnalyticsViewItemListEvent
} from '../../types/analytics'
import { getAnalytics } from '../../lib/analytics'

// Enhanced E-commerce Data Layer
interface DataLayerEvent {
  event: string
  [key: string]: any
}

class EcommerceTracker {
  private analytics: any
  private dataLayerQueue: DataLayerEvent[] = []

  constructor() {
    this.analytics = getAnalytics()
    this.initializeDataLayer()
  }

  private initializeDataLayer(): void {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []

      // Process queued events
      this.dataLayerQueue.forEach(event => {
        window.dataLayer.push(event)
      })
      this.dataLayerQueue = []
    }
  }

  private pushToDataLayer(event: DataLayerEvent): void {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(event)
    } else {
      this.dataLayerQueue.push(event)
    }
  }

  // Product View Tracking
  public trackProductView(product: AnalyticsViewItemEvent): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'view_item',
      ecommerce: {
        currency: product.currency || 'CAD',
        value: product.value || product.price,
        items: [{
          item_id: product.item_id,
          item_name: product.item_name,
          item_category: product.item_category,
          price: product.price,
          item_brand: product.item_brand || 'PG Closets',
          item_variant: product.item_variant,
          quantity: 1
        }]
      },
      user_data: {
        user_id: product.user_id
      }
    }

    this.pushToDataLayer(event)
    this.analytics?.trackViewItem(product)
  }

  // Product List View Tracking
  public trackProductListView(data: AnalyticsViewItemListEvent): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'view_item_list',
      ecommerce: {
        item_list_id: data.item_list_id,
        item_list_name: data.item_list_name,
        items: data.items.map((item, index) => ({
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          item_category2: item.item_category2,
          item_category3: item.item_category3,
          item_brand: item.item_brand || 'PG Closets',
          item_variant: item.item_variant,
          price: item.price,
          quantity: item.quantity,
          index: index,
          item_list_id: data.item_list_id,
          item_list_name: data.item_list_name
        }))
      },
      user_data: {
        user_id: data.user_id
      }
    }

    this.pushToDataLayer(event)
    this.analytics?.trackViewItemList(data)
  }

  // Add to Cart Tracking
  public trackAddToCart(data: AnalyticsAddToCartEvent): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'add_to_cart',
      ecommerce: {
        currency: data.currency || 'CAD',
        value: data.value,
        items: data.items.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          item_category2: item.item_category2,
          item_brand: item.item_brand || 'PG Closets',
          item_variant: item.item_variant,
          price: item.price,
          quantity: item.quantity
        }))
      },
      user_data: {
        user_id: data.user_id
      }
    }

    this.pushToDataLayer(event)
    this.analytics?.trackAddToCart(data)
  }

  // Remove from Cart Tracking
  public trackRemoveFromCart(data: AnalyticsAddToCartEvent): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'remove_from_cart',
      ecommerce: {
        currency: data.currency || 'CAD',
        value: data.value,
        items: data.items.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          item_brand: item.item_brand || 'PG Closets',
          price: item.price,
          quantity: item.quantity
        }))
      },
      user_data: {
        user_id: data.user_id
      }
    }

    this.pushToDataLayer(event)
    this.analytics?.trackRemoveFromCart(data)
  }

  // Begin Checkout Tracking
  public trackBeginCheckout(data: AnalyticsBeginCheckoutEvent): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'begin_checkout',
      ecommerce: {
        currency: data.currency || 'CAD',
        value: data.value,
        coupon: data.coupon,
        items: data.items.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          item_brand: item.item_brand || 'PG Closets',
          item_variant: item.item_variant,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount || 0
        }))
      },
      checkout_data: {
        payment_method: data.payment_method,
        shipping_tier: data.shipping_tier
      }
    }

    this.pushToDataLayer(event)
    this.analytics?.trackBeginCheckout(data)
  }

  // Checkout Step Tracking
  public trackCheckoutStep(step: number, option?: string, items?: AnalyticsProductItem[]): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const stepNames = {
      1: 'shipping_info',
      2: 'payment_info',
      3: 'review_order',
      4: 'place_order'
    }

    const event: DataLayerEvent = {
      event: 'checkout_progress',
      ecommerce: {
        checkout_step: step,
        checkout_option: option,
        checkout_step_name: stepNames[step as keyof typeof stepNames] || `step_${step}`,
        items: items?.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          price: item.price,
          quantity: item.quantity
        }))
      }
    }

    this.pushToDataLayer(event)
    this.analytics?.trackCheckoutStep(step, option)
  }

  // Purchase Tracking
  public trackPurchase(data: AnalyticsPurchaseEvent): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'purchase',
      ecommerce: {
        transaction_id: data.transaction_id,
        value: data.value,
        currency: data.currency || 'CAD',
        tax: data.tax || 0,
        shipping: data.shipping || 0,
        coupon: data.coupon,
        affiliation: data.affiliation || 'PG Closets Store',
        items: data.items.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          item_category2: item.item_category2,
          item_category3: item.item_category3,
          item_brand: item.item_brand || 'PG Closets',
          item_variant: item.item_variant,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount || 0,
          promotion_id: item.promotion_id,
          promotion_name: item.promotion_name
        }))
      },
      purchase_data: {
        payment_method: data.payment_method,
        shipping_tier: data.shipping_tier,
        customer_type: 'returning', // Could be determined from user data
        order_type: this.determineOrderType(data.items)
      },
      user_data: {
        user_id: data.user_id
      }
    }

    this.pushToDataLayer(event)
    this.analytics?.trackPurchase(data)
  }

  // Promotion Tracking
  public trackViewPromotion(promotionId: string, promotionName: string, creativeName?: string, creativeSlot?: string): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'view_promotion',
      ecommerce: {
        promotion_id: promotionId,
        promotion_name: promotionName,
        creative_name: creativeName,
        creative_slot: creativeSlot
      }
    }

    this.pushToDataLayer(event)
    this.analytics?.trackPromotion(promotionId, promotionName, 'view')
  }

  public trackSelectPromotion(promotionId: string, promotionName: string, creativeName?: string): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'select_promotion',
      ecommerce: {
        promotion_id: promotionId,
        promotion_name: promotionName,
        creative_name: creativeName
      }
    }

    this.pushToDataLayer(event)
    this.analytics?.trackPromotion(promotionId, promotionName, 'select')
  }

  // Cart Abandonment Tracking
  public trackCartAbandonment(items: AnalyticsProductItem[], value: number, stage: string): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'cart_abandonment',
      ecommerce: {
        currency: 'CAD',
        value: value,
        abandonment_stage: stage,
        items: items.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          price: item.price,
          quantity: item.quantity
        }))
      },
      abandonment_data: {
        stage: stage,
        time_in_cart: this.getTimeInCart(),
        cart_size: items.length,
        total_value: value
      }
    }

    this.pushToDataLayer(event)
  }

  // Enhanced Product Search Tracking
  public trackProductSearch(searchTerm: string, resultsCount: number, filters?: Record<string, any>): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'search',
      search_data: {
        search_term: searchTerm,
        search_results: resultsCount,
        search_type: 'product',
        filters: filters,
        no_results: resultsCount === 0
      }
    }

    this.pushToDataLayer(event)
    this.analytics?.trackSearch(searchTerm, resultsCount)
  }

  // Product List Interaction Tracking
  public trackProductListInteraction(action: string, listId: string, listName: string, item: AnalyticsProductItem, position: number): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: action, // 'select_item' or 'select_content'
      ecommerce: {
        item_list_id: listId,
        item_list_name: listName,
        items: [{
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          price: item.price,
          index: position,
          item_list_id: listId,
          item_list_name: listName
        }]
      }
    }

    this.pushToDataLayer(event)
  }

  // Wishlist Tracking
  public trackAddToWishlist(item: AnalyticsProductItem): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'add_to_wishlist',
      ecommerce: {
        currency: 'CAD',
        value: item.price,
        items: [{
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          price: item.price,
          quantity: 1
        }]
      }
    }

    this.pushToDataLayer(event)
  }

  // Custom Product Events
  public trackProductComparison(items: AnalyticsProductItem[]): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'product_comparison',
      ecommerce: {
        items: items.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          price: item.price
        }))
      },
      comparison_data: {
        product_count: items.length,
        categories: [...new Set(items.map(item => item.item_category))]
      }
    }

    this.pushToDataLayer(event)
  }

  public trackQuickView(item: AnalyticsProductItem): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: DataLayerEvent = {
      event: 'product_quick_view',
      ecommerce: {
        currency: 'CAD',
        value: item.price,
        items: [{
          item_id: item.item_id,
          item_name: item.item_name,
          item_category: item.item_category,
          price: item.price
        }]
      }
    }

    this.pushToDataLayer(event)
  }

  // Utility Methods
  private determineOrderType(items: AnalyticsProductItem[]): string {
    if (items.length === 1) return 'single_item'
    if (items.length <= 3) return 'small_order'
    if (items.length <= 5) return 'medium_order'
    return 'large_order'
  }

  private getTimeInCart(): number {
    // Return time in milliseconds that items have been in cart
    // This would need to be tracked when items are added
    const cartStartTime = localStorage.getItem('cart_start_time')
    if (cartStartTime) {
      return Date.now() - parseInt(cartStartTime)
    }
    return 0
  }
}

// Singleton instance
let ecommerceTracker: EcommerceTracker | null = null

export function getEcommerceTracker(): EcommerceTracker {
  if (!ecommerceTracker) {
    ecommerceTracker = new EcommerceTracker()
  }
  return ecommerceTracker
}

// React Hook for E-commerce Tracking
export function useEcommerceTracking() {
  const tracker = useRef<EcommerceTracker | null>(null)

  useEffect(() => {
    tracker.current = getEcommerceTracker()
  }, [])

  return {
    trackProductView: (product: AnalyticsViewItemEvent) => tracker.current?.trackProductView(product),
    trackProductListView: (data: AnalyticsViewItemListEvent) => tracker.current?.trackProductListView(data),
    trackAddToCart: (data: AnalyticsAddToCartEvent) => tracker.current?.trackAddToCart(data),
    trackRemoveFromCart: (data: AnalyticsAddToCartEvent) => tracker.current?.trackRemoveFromCart(data),
    trackBeginCheckout: (data: AnalyticsBeginCheckoutEvent) => tracker.current?.trackBeginCheckout(data),
    trackCheckoutStep: (step: number, option?: string, items?: AnalyticsProductItem[]) =>
      tracker.current?.trackCheckoutStep(step, option, items),
    trackPurchase: (data: AnalyticsPurchaseEvent) => tracker.current?.trackPurchase(data),
    trackProductSearch: (term: string, results: number, filters?: Record<string, any>) =>
      tracker.current?.trackProductSearch(term, results, filters),
    trackAddToWishlist: (item: AnalyticsProductItem) => tracker.current?.trackAddToWishlist(item),
    trackProductComparison: (items: AnalyticsProductItem[]) => tracker.current?.trackProductComparison(items),
    trackQuickView: (item: AnalyticsProductItem) => tracker.current?.trackQuickView(item),
    trackViewPromotion: (id: string, name: string, creative?: string, slot?: string) =>
      tracker.current?.trackViewPromotion(id, name, creative, slot),
    trackSelectPromotion: (id: string, name: string, creative?: string) =>
      tracker.current?.trackSelectPromotion(id, name, creative)
  }
}

// Component for automatic page view tracking
export function EcommercePageTracker({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const tracker = getEcommerceTracker()

    // Track initial page view
    const handleRouteChange = () => {
      // Add small delay to ensure page title is updated
      setTimeout(() => {
        if (tracker && typeof window !== 'undefined') {
          const analytics = getAnalytics()
          if (analytics?.hasAnalyticsConsent()) {
            analytics.trackPageView()
          }
        }
      }, 100)
    }

    // Track route changes
    handleRouteChange()
  }, [router])

  return <>{children}</>
}

export { EcommerceTracker }