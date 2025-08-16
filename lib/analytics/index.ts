// Analytics Library - PG Closets Store
// Comprehensive GA4 tracking, cookie consent, and performance monitoring

// Core GA4 tracking
export { ga4, GA4Analytics, createProductItem } from './ga4-events'
export type { 
  ProductItem, 
  PurchaseEvent, 
  ViewItemEvent, 
  AddToCartEvent, 
  BeginCheckoutEvent, 
  PageViewEvent, 
  CustomEvent 
} from './ga4-events'

// Web Vitals performance tracking
export { webVitalsTracker, WebVitalsTracker } from './web-vitals'
export type { WebVitalMetric, WebVitalsConfig } from './web-vitals'

// Paddle payment integration
export { paddleAnalytics, PaddleAnalyticsIntegration } from './paddle-integration'
export type { 
  PaddleProduct, 
  PaddleCheckoutData, 
  PaddleTransactionData 
} from './paddle-integration'

// Re-export components and hooks
export { GoogleTagManager } from '@/components/analytics/google-tag-manager'
export { 
  CookieConsent, 
  useCookiePreferences, 
  shouldLoadAnalytics 
} from '@/components/analytics/cookie-consent'
export type { CookiePreferences } from '@/components/analytics/cookie-consent'
export { 
  AnalyticsProvider, 
  useAnalyticsStatus, 
  AnalyticsDebugInfo 
} from '@/components/analytics/analytics-provider'
export { useAnalytics, useComponentAnalytics } from '@/hooks/use-analytics'

// Convenience functions for common tracking scenarios

/**
 * Initialize analytics for PG Closets store
 * Call this once in your app root
 */
export function initializePGClosetsAnalytics() {
  // Analytics will be initialized by AnalyticsProvider
  // This function is for any additional setup if needed
  console.log('[PG Closets Analytics] System ready')
}

/**
 * Track a product view with PG Closets product data
 */
export function trackProductView(product: {
  id: string
  name: string
  category: string
  price: number
  brand?: string
}) {
  import('./ga4-events').then(({ ga4 }) => {
    ga4.viewItem({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      currency: 'CAD'
    })
  })
}

/**
 * Track a quote request with multiple products
 */
export function trackQuoteRequest(products: Array<{
  id: string
  name: string
  category: string
  price: number
  quantity: number
}>) {
  import('./ga4-events').then(({ ga4, createProductItem }) => {
    const items = products.map(createProductItem)
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
    
    ga4.quoteRequest(items, totalValue)
  })
}

/**
 * Track a consultation booking
 */
export function trackConsultationBooking(serviceType: string = 'design_consultation') {
  import('./ga4-events').then(({ ga4 }) => {
    ga4.consultationBooking(serviceType, 0) // Free consultation
  })
}

/**
 * Track contact form submission
 */
export function trackContactForm(formType: string = 'contact_form', success: boolean = true) {
  import('./ga4-events').then(({ ga4 }) => {
    ga4.contactFormSubmit(formType, success)
  })
}

/**
 * Track product customization (door configuration, etc.)
 */
export function trackProductCustomization(
  productId: string, 
  customizationType: string, 
  customizationValue: string
) {
  import('./ga4-events').then(({ ga4 }) => {
    ga4.productCustomization(productId, customizationType, customizationValue)
  })
}

/**
 * Track search events with results count
 */
export function trackSiteSearch(searchTerm: string, resultsCount?: number) {
  import('./ga4-events').then(({ ga4 }) => {
    ga4.search(searchTerm, resultsCount)
  })
}

// Constants for PG Closets specific tracking
export const PG_CLOSETS_TRACKING = {
  MEASUREMENT_ID: 'G-M01QFYXCDN',
  CURRENCY: 'CAD',
  COMPANY_NAME: 'PG Closets',
  AFFILIATION: 'PG Closets Store',
  
  // Product categories
  CATEGORIES: {
    BARN_DOORS: 'Barn Doors',
    BYPASS_DOORS: 'Bypass Doors',
    BIFOLD_DOORS: 'Bifold Doors',
    PIVOT_DOORS: 'Pivot Doors',
    HARDWARE: 'Hardware',
    ACCESSORIES: 'Accessories'
  },
  
  // Event names
  EVENTS: {
    QUOTE_REQUEST: 'generate_lead',
    CONSULTATION_BOOKING: 'generate_lead',
    CONTACT_FORM: 'contact',
    PRODUCT_CUSTOMIZATION: 'customize',
    WISHLIST_ADD: 'add_to_wishlist',
    PRODUCT_COMPARE: 'compare'
  }
} as const