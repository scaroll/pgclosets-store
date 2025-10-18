// Analytics Type Definitions for PG Closets Store
// Comprehensive TypeScript types for GA4, Cookie Consent, and Analytics tracking

// GA4 Event Parameter Types
export interface GA4EventParameters {
  // E-commerce parameters
  currency?: string
  value?: number
  transaction_id?: string
  item_list_id?: string
  item_list_name?: string
  coupon?: string
  shipping?: number
  tax?: number
  affiliation?: string

  // Content parameters
  content_type?: string
  content_id?: string
  content_group1?: string
  content_group2?: string
  content_group3?: string
  content_group4?: string
  content_group5?: string

  // Search parameters
  search_term?: string
  search_results?: number

  // Form parameters
  form_name?: string
  form_success?: boolean
  form_id?: string
  form_destination?: string

  // Video parameters
  video_title?: string
  video_url?: string
  video_duration?: number
  video_current_time?: number
  video_percent?: number
  video_provider?: string
  video_status?: string

  // File download parameters
  file_name?: string
  file_extension?: string
  file_type?: string
  link_url?: string
  link_text?: string
  link_domain?: string
  outbound?: boolean

  // Performance parameters
  engagement_time_msec?: number
  page_title?: string
  page_location?: string
  page_referrer?: string
  screen_resolution?: string
  language?: string

  // Custom parameters
  [key: string]: string | number | boolean | undefined
}

// Product Item Interface (enhanced)
export interface AnalyticsProductItem {
  item_id: string
  item_name: string
  item_category: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
  item_brand?: string
  item_variant?: string
  price: number
  quantity: number
  currency?: string
  item_list_id?: string
  item_list_name?: string
  index?: number
  discount?: number
  promotion_id?: string
  promotion_name?: string
  creative_name?: string
  creative_slot?: string
  location_id?: string
}

// E-commerce Event Types
export interface AnalyticsPurchaseEvent {
  transaction_id: string
  value: number
  currency: string
  items: AnalyticsProductItem[]
  coupon?: string
  shipping?: number
  tax?: number
  affiliation?: string
  user_id?: string
  payment_method?: string
  shipping_tier?: string
}

export interface AnalyticsAddToCartEvent {
  currency: string
  value: number
  items: AnalyticsProductItem[]
  user_id?: string
}

export interface AnalyticsRemoveFromCartEvent {
  currency: string
  value: number
  items: AnalyticsProductItem[]
  user_id?: string
}

export interface AnalyticsBeginCheckoutEvent {
  currency: string
  value: number
  items: AnalyticsProductItem[]
  coupon?: string
  payment_method?: string
  shipping_tier?: string
}

export interface AnalyticsViewItemEvent {
  item_id: string
  item_name: string
  item_category: string
  price: number
  currency?: string
  value?: number
  item_brand?: string
  item_variant?: string
  user_id?: string
}

export interface AnalyticsViewItemListEvent {
  item_list_id: string
  item_list_name: string
  items: AnalyticsProductItem[]
  user_id?: string
}

export interface AnalyticsSelectItemEvent {
  item_list_id: string
  item_list_name: string
  items: AnalyticsProductItem[]
  user_id?: string
}

// Cookie Consent Types
export interface CookieConsentPreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
  location: boolean
}

export interface CookieConsentData {
  version: string
  timestamp: number
  preferences: CookieConsentPreferences
  userAgent: string
  ipAddress?: string
  gdprConsent?: boolean
  ccpaConsent?: boolean
}

// Analytics Configuration Types
export interface AnalyticsConfig {
  measurementId: string
  debug: boolean
  enableCookieConsent: boolean
  enablePerformanceTracking: boolean
  enableScrollTracking: boolean
  enableFormTracking: boolean
  enableErrorTracking: boolean
  scrollThresholds: number[]
  cookieConsentConfig: CookieConsentConfig
  privacyConfig: PrivacyConfig
}

export interface CookieConsentConfig {
  companyName: string
  privacyPolicyUrl: string
  cookiePolicyUrl?: string
  consentVersion: string
  consentDuration: number // in milliseconds
  requiredCategories: (keyof CookieConsentPreferences)[]
  defaultPreferences: Partial<CookieConsentPreferences>
}

export interface PrivacyConfig {
  anonymizeIP: boolean
  allowAdStorageSignals: boolean
  allowAnalyticsStorageSignals: boolean
  allowPersonalizationSignals: boolean
  restrictedDataProcessing: boolean
  dataRetentionDays: number
}

// Paddle Integration Types
export interface PaddleAnalyticsProduct {
  id: string
  name: string
  price: number
  currency: string
  category?: string
  variant?: string
  quantity?: number
  sku?: string
  description?: string
}

export interface PaddleAnalyticsCheckout {
  checkout_id: string
  products: PaddleAnalyticsProduct[]
  customer_email?: string
  customer_country?: string
  total_amount: number
  currency: string
  coupon_code?: string
  tax_amount?: number
  custom_data?: Record<string, any>
  subscription_plan_id?: string
  trial_days?: number
}

export interface PaddleAnalyticsTransaction {
  transaction_id: string
  checkout_id: string
  receipt_url: string
  products: PaddleAnalyticsProduct[]
  customer_email: string
  customer_country: string
  customer_id: string
  total_amount: number
  currency: string
  coupon_code?: string
  tax_amount?: number
  payment_method: string
  subscription_id?: string
  subscription_plan_id?: string
  is_subscription: boolean
  is_trial: boolean
  custom_data?: Record<string, any>
  created_at: string
}

// Web Vitals Types
export interface WebVitalsMetrics {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP'
  value: number
  delta: number
  id: string
  navigationType: 'navigate' | 'reload' | 'back_forward' | 'prerender'
  rating: 'good' | 'needs-improvement' | 'poor'
}

export interface PerformanceMetrics {
  webVitals: WebVitalsMetrics[]
  customTimings: {
    name: string
    value: number
    category: string
    timestamp: number
  }[]
  navigationTiming: {
    pageLoadTime: number
    domContentLoadedTime: number
    firstPaintTime: number
    firstContentfulPaintTime: number
  }
  resourceTiming: {
    name: string
    type: string
    duration: number
    size: number
  }[]
}

// Form Analytics Types
export interface FormAnalyticsData {
  formName: string
  formId?: string
  fields: FormFieldData[]
  startTime: number
  completionTime?: number
  submitTime?: number
  abandonmentTime?: number
  errors: FormErrorData[]
  validationIssues: string[]
}

export interface FormFieldData {
  name: string
  type: string
  required: boolean
  filled: boolean
  timeToFill?: number
  changesCount: number
  validationErrors: string[]
}

export interface FormErrorData {
  fieldName: string
  errorType: string
  errorMessage: string
  timestamp: number
}

// Component Analytics Types
export interface ComponentAnalyticsData {
  componentName: string
  componentId?: string
  interactions: ComponentInteraction[]
  viewTime: number
  viewTimestamp: number
  errors: ComponentError[]
  performance: ComponentPerformance
}

export interface ComponentInteraction {
  action: string
  element?: string
  timestamp: number
  value?: number | string
  metadata?: Record<string, any>
}

export interface ComponentError {
  errorType: string
  errorMessage: string
  stack?: string
  timestamp: number
  recoverable: boolean
}

export interface ComponentPerformance {
  renderTime: number
  mountTime: number
  updateCount: number
  memoryUsage?: number
}

// Search Analytics Types
export interface SearchAnalyticsData {
  searchTerm: string
  searchType: 'product' | 'content' | 'global'
  resultsCount: number
  timestamp: number
  filters: SearchFilter[]
  selectedResult?: SearchResult
  sessionId: string
  userId?: string
}

export interface SearchFilter {
  name: string
  value: string | number | boolean
  type: 'category' | 'price' | 'brand' | 'rating' | 'availability'
}

export interface SearchResult {
  id: string
  title: string
  category: string
  position: number
  price?: number
  clickTimestamp: number
}

// User Journey Analytics Types
export interface UserJourneyStep {
  page: string
  timestamp: number
  action: string
  duration: number
  metadata?: Record<string, any>
}

export interface UserSession {
  sessionId: string
  userId?: string
  startTime: number
  endTime?: number
  steps: UserJourneyStep[]
  totalPageViews: number
  totalEvents: number
  conversionEvents: string[]
  deviceInfo: DeviceInfo
  trafficSource: TrafficSource
}

export interface DeviceInfo {
  userAgent: string
  screenResolution: string
  viewportSize: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  operatingSystem: string
  browser: string
  isBot: boolean
}

export interface TrafficSource {
  source: string
  medium: string
  campaign?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
}

// Lead Generation Types
export interface LeadAnalyticsData {
  leadType: 'quote_request' | 'consultation_booking' | 'contact_form' | 'newsletter' | 'download'
  leadSource: string
  leadValue?: number
  currency?: string
  products?: AnalyticsProductItem[]
  contactInfo: {
    email?: string
    phone?: string
    name?: string
    company?: string
  }
  preferences?: Record<string, any>
  timestamp: number
  sessionId: string
}

// Error Tracking Types
export interface AnalyticsError {
  errorType: 'javascript' | 'network' | 'analytics' | 'form' | 'payment'
  errorMessage: string
  errorStack?: string
  fatal: boolean
  timestamp: number
  url: string
  userAgent: string
  userId?: string
  sessionId: string
  context?: Record<string, any>
}

// Analytics Event Types Union
export type AnalyticsEvent = 
  | { type: 'page_view'; data: GA4EventParameters }
  | { type: 'purchase'; data: AnalyticsPurchaseEvent }
  | { type: 'add_to_cart'; data: AnalyticsAddToCartEvent }
  | { type: 'remove_from_cart'; data: AnalyticsRemoveFromCartEvent }
  | { type: 'begin_checkout'; data: AnalyticsBeginCheckoutEvent }
  | { type: 'view_item'; data: AnalyticsViewItemEvent }
  | { type: 'view_item_list'; data: AnalyticsViewItemListEvent }
  | { type: 'select_item'; data: AnalyticsSelectItemEvent }
  | { type: 'search'; data: SearchAnalyticsData }
  | { type: 'form_submit'; data: FormAnalyticsData }
  | { type: 'lead_generation'; data: LeadAnalyticsData }
  | { type: 'component_interaction'; data: ComponentAnalyticsData }
  | { type: 'error'; data: AnalyticsError }
  | { type: 'custom'; data: GA4EventParameters & { event_name: string } }

// Analytics Provider Props
export interface AnalyticsProviderProps {
  measurementId: string
  children: React.ReactNode
  config?: Partial<AnalyticsConfig>
  debug?: boolean
  enableCookieConsent?: boolean
  privacyPolicyUrl?: string
  companyName?: string
}

// Hook Return Types
export interface UseAnalyticsReturn {
  // State
  isTrackingEnabled: boolean
  hasConsent: boolean
  preferences: CookieConsentPreferences

  // E-commerce tracking
  trackPurchase: (transactionId: string, value: number, items: AnalyticsProductItem[], additionalData?: Record<string, unknown>) => void
  trackAddToCart: (items: AnalyticsProductItem[], value: number) => void
  trackRemoveFromCart: (items: AnalyticsProductItem[], value: number) => void
  trackViewItem: (itemId: string, itemName: string, itemCategory: string, price: number) => void

  // Interaction tracking
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void
  trackSearch: (searchTerm: string, results?: number) => void
  trackQuoteRequest: (productItems: AnalyticsProductItem[], totalValue: number) => void
  trackOutboundClick: (url: string, linkText?: string) => void
  trackFileDownload: (fileName: string, fileExtension: string) => void

  // Performance and error tracking
  trackTiming: (name: string, value: number, category?: string) => void
  trackException: (error: Error | string, fatal?: boolean) => void

  // Direct access to GA4 instance
  ga4: {
    track: (eventName: string, parameters?: Record<string, unknown>) => void;
    ecommerce: (command: string, data?: Record<string, unknown>) => void;
    config: (trackingId: string, config?: Record<string, unknown>) => void;
  }
}

// Global Analytics Interface
declare global {
  interface Window {
    gtag(...args: unknown[]): void
    dataLayer: unknown[]
  }
}