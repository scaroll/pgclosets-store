/**
 * Enhanced Google Analytics 4 Implementation
 * Agent #36: Complete GA4 setup with enhanced e-commerce and custom events
 *
 * Features:
 * - 30+ custom event types
 * - Enhanced e-commerce tracking
 * - User ID tracking for logged-in users
 * - Cross-domain tracking
 * - Custom dimensions and metrics
 * - Conversion goal setup
 */

import { trackEvent } from './gtm'

// ==========================================
// ENHANCED E-COMMERCE EVENTS
// ==========================================

/**
 * Track product impressions (view_item_list)
 */
export const trackProductImpressions = (params: {
  item_list_id: string
  item_list_name: string
  items: Array<{
    item_id: string
    item_name: string
    item_category: string
    item_category2?: string
    item_brand?: string
    price: number
    index?: number
  }>
}) => {
  trackEvent('view_item_list', {
    ecommerce: {
      item_list_id: params.item_list_id,
      item_list_name: params.item_list_name,
      items: params.items.map((item, index) => ({
        ...item,
        index: item.index ?? index,
        currency: 'CAD',
      })),
    },
  })
}

/**
 * Track product detail view (view_item)
 */
export const trackProductDetailView = (params: {
  item_id: string
  item_name: string
  item_category: string
  item_category2?: string
  item_brand?: string
  price: number
  variant?: string
}) => {
  trackEvent('view_item', {
    ecommerce: {
      currency: 'CAD',
      value: params.price,
      items: [
        {
          item_id: params.item_id,
          item_name: params.item_name,
          item_category: params.item_category,
          item_category2: params.item_category2,
          item_brand: params.item_brand || 'Renin',
          item_variant: params.variant,
          price: params.price,
          quantity: 1,
          currency: 'CAD',
        },
      ],
    },
  })
}

/**
 * Track product selection (select_item)
 */
export const trackProductSelect = (params: {
  item_list_id: string
  item_list_name: string
  item_id: string
  item_name: string
  item_category: string
  price: number
  index: number
}) => {
  trackEvent('select_item', {
    ecommerce: {
      item_list_id: params.item_list_id,
      item_list_name: params.item_list_name,
      items: [
        {
          item_id: params.item_id,
          item_name: params.item_name,
          item_category: params.item_category,
          price: params.price,
          index: params.index,
          currency: 'CAD',
        },
      ],
    },
  })
}

/**
 * Track add to cart (add_to_cart)
 */
export const trackAddToCart = (params: {
  items: Array<{
    item_id: string
    item_name: string
    item_category: string
    price: number
    quantity: number
    variant?: string
  }>
  value: number
}) => {
  trackEvent('add_to_cart', {
    ecommerce: {
      currency: 'CAD',
      value: params.value,
      items: params.items.map((item) => ({
        ...item,
        currency: 'CAD',
      })),
    },
  })
}

/**
 * Track remove from cart (remove_from_cart)
 */
export const trackRemoveFromCart = (params: {
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
  value: number
}) => {
  trackEvent('remove_from_cart', {
    ecommerce: {
      currency: 'CAD',
      value: params.value,
      items: params.items.map((item) => ({
        ...item,
        currency: 'CAD',
      })),
    },
  })
}

/**
 * Track begin checkout (begin_checkout)
 */
export const trackBeginCheckout = (params: {
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
  value: number
  coupon?: string
}) => {
  trackEvent('begin_checkout', {
    ecommerce: {
      currency: 'CAD',
      value: params.value,
      coupon: params.coupon,
      items: params.items.map((item) => ({
        ...item,
        currency: 'CAD',
      })),
    },
  })
}

/**
 * Track add payment info (add_payment_info)
 */
export const trackAddPaymentInfo = (params: {
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
  value: number
  payment_type: string
  coupon?: string
}) => {
  trackEvent('add_payment_info', {
    ecommerce: {
      currency: 'CAD',
      value: params.value,
      payment_type: params.payment_type,
      coupon: params.coupon,
      items: params.items.map((item) => ({
        ...item,
        currency: 'CAD',
      })),
    },
  })
}

/**
 * Track purchase completion (purchase)
 */
export const trackPurchaseComplete = (params: {
  transaction_id: string
  value: number
  tax?: number
  shipping?: number
  items: Array<{
    item_id: string
    item_name: string
    item_category: string
    price: number
    quantity: number
  }>
  coupon?: string
  affiliation?: string
}) => {
  trackEvent('purchase', {
    ecommerce: {
      transaction_id: params.transaction_id,
      affiliation: params.affiliation || 'PG Closets',
      value: params.value,
      tax: params.tax || 0,
      shipping: params.shipping || 0,
      currency: 'CAD',
      coupon: params.coupon,
      items: params.items.map((item, index) => ({
        ...item,
        index,
        currency: 'CAD',
      })),
    },
  })
}

/**
 * Track refund (refund)
 */
export const trackRefund = (params: {
  transaction_id: string
  value: number
  items?: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
}) => {
  trackEvent('refund', {
    ecommerce: {
      transaction_id: params.transaction_id,
      value: params.value,
      currency: 'CAD',
      items: params.items?.map((item) => ({
        ...item,
        currency: 'CAD',
      })),
    },
  })
}

// ==========================================
// LEAD GENERATION & CONVERSION EVENTS
// ==========================================

/**
 * Track quote request (generate_lead)
 */
export const trackQuoteRequest = (params: {
  lead_source: string
  lead_value: number
  products: string[]
  quote_type: 'instant' | 'custom' | 'consultation'
  customer_type?: 'new' | 'returning'
}) => {
  trackEvent('generate_lead', {
    lead_source: params.lead_source,
    value: params.lead_value,
    currency: 'CAD',
    quote_type: params.quote_type,
    products: params.products.join(','),
    customer_type: params.customer_type,
    event_category: 'Lead Generation',
    event_label: 'Quote Request',
  })
}

/**
 * Track consultation booking (book_consultation)
 */
export const trackConsultationBooking = (params: {
  consultation_type: 'in-home' | 'virtual' | 'showroom'
  preferred_date?: string
  service_area: string
  lead_value: number
}) => {
  trackEvent('book_consultation', {
    consultation_type: params.consultation_type,
    preferred_date: params.preferred_date,
    service_area: params.service_area,
    value: params.lead_value,
    currency: 'CAD',
    event_category: 'Lead Generation',
    event_label: 'Consultation Booking',
  })
}

/**
 * Track phone call initiation (initiate_call)
 */
export const trackCallInitiation = (params: {
  phone_number: string
  location: string
  cta_text: string
  page_path: string
}) => {
  trackEvent('initiate_call', {
    phone_number: params.phone_number,
    location: params.location,
    cta_text: params.cta_text,
    page_path: params.page_path,
    value: 50, // Estimated lead value
    currency: 'CAD',
    event_category: 'Lead Generation',
    event_label: 'Phone Call Initiated',
  })
}

/**
 * Track email initiation (initiate_email)
 */
export const trackEmailInitiation = (params: {
  email_address: string
  location: string
  cta_text: string
  page_path: string
}) => {
  trackEvent('initiate_email', {
    email_address: params.email_address,
    location: params.location,
    cta_text: params.cta_text,
    page_path: params.page_path,
    value: 30, // Estimated lead value
    currency: 'CAD',
    event_category: 'Lead Generation',
    event_label: 'Email Initiated',
  })
}

/**
 * Track newsletter signup (newsletter_signup)
 */
export const trackNewsletterSignup = (params: {
  source: string
  signup_location: string
}) => {
  trackEvent('newsletter_signup', {
    source: params.source,
    signup_location: params.signup_location,
    value: 10,
    currency: 'CAD',
    event_category: 'Lead Generation',
    event_label: 'Newsletter Signup',
  })
}

// ==========================================
// ENGAGEMENT EVENTS
// ==========================================

/**
 * Track scroll depth (scroll_depth)
 */
export const trackScrollDepth = (params: {
  scroll_percentage: number
  page_path: string
  page_title: string
}) => {
  // Only track milestone percentages
  const milestones = [25, 50, 75, 90, 100]
  if (!milestones.includes(params.scroll_percentage)) return

  trackEvent('scroll_depth', {
    scroll_percentage: params.scroll_percentage,
    page_path: params.page_path,
    page_title: params.page_title,
    event_category: 'Engagement',
    event_label: `Scroll ${params.scroll_percentage}%`,
  })
}

/**
 * Track time on page (time_on_page)
 */
export const trackTimeOnPage = (params: {
  page_path: string
  time_seconds: number
  engagement_type: 'active' | 'passive'
}) => {
  trackEvent('time_on_page', {
    page_path: params.page_path,
    time_seconds: params.time_seconds,
    engagement_type: params.engagement_type,
    event_category: 'Engagement',
    event_label: `${params.time_seconds}s on page`,
  })
}

/**
 * Track video engagement (video_engagement)
 */
export const trackVideoEngagement = (params: {
  video_title: string
  video_url: string
  action: 'play' | 'pause' | 'complete' | '25%' | '50%' | '75%'
  current_time: number
  duration: number
  video_provider: string
}) => {
  trackEvent('video_engagement', {
    video_title: params.video_title,
    video_url: params.video_url,
    video_action: params.action,
    video_current_time: params.current_time,
    video_duration: params.duration,
    video_percent: Math.round((params.current_time / params.duration) * 100),
    video_provider: params.video_provider,
    event_category: 'Engagement',
    event_label: `Video ${params.action}`,
  })
}

/**
 * Track image gallery interaction (gallery_interaction)
 */
export const trackGalleryInteraction = (params: {
  product_id: string
  product_name: string
  action: 'open' | 'next' | 'previous' | 'zoom' | 'close'
  image_index: number
  total_images: number
}) => {
  trackEvent('gallery_interaction', {
    product_id: params.product_id,
    product_name: params.product_name,
    gallery_action: params.action,
    image_index: params.image_index,
    total_images: params.total_images,
    event_category: 'Engagement',
    event_label: 'Image Gallery',
  })
}

/**
 * Track configurator usage (configurator_interaction)
 */
export const trackConfiguratorInteraction = (params: {
  product_id: string
  product_name: string
  action: 'open' | 'configure' | 'calculate' | 'add_to_quote' | 'close'
  configuration?: Record<string, any>
  estimated_price?: number
}) => {
  trackEvent('configurator_interaction', {
    product_id: params.product_id,
    product_name: params.product_name,
    configurator_action: params.action,
    configuration: JSON.stringify(params.configuration),
    estimated_price: params.estimated_price,
    event_category: 'Product Engagement',
    event_label: 'Configurator',
  })
}

/**
 * Track product comparison (compare_products)
 */
export const trackProductComparison = (params: {
  products: Array<{
    item_id: string
    item_name: string
    price: number
  }>
  comparison_type: 'side_by_side' | 'feature_matrix'
}) => {
  trackEvent('compare_products', {
    product_count: params.products.length,
    products: params.products.map((p) => p.item_id).join(','),
    comparison_type: params.comparison_type,
    event_category: 'Product Engagement',
    event_label: 'Product Comparison',
  })
}

/**
 * Track filter usage (filter_products)
 */
export const trackFilterUsage = (params: {
  filter_type: string
  filter_value: string
  results_count: number
  page_path: string
}) => {
  trackEvent('filter_products', {
    filter_type: params.filter_type,
    filter_value: params.filter_value,
    results_count: params.results_count,
    page_path: params.page_path,
    event_category: 'Product Discovery',
    event_label: `Filter: ${params.filter_type}`,
  })
}

/**
 * Track sort usage (sort_products)
 */
export const trackSortUsage = (params: {
  sort_option: string
  results_count: number
  page_path: string
}) => {
  trackEvent('sort_products', {
    sort_option: params.sort_option,
    results_count: params.results_count,
    page_path: params.page_path,
    event_category: 'Product Discovery',
    event_label: `Sort: ${params.sort_option}`,
  })
}

// ==========================================
// SITE NAVIGATION EVENTS
// ==========================================

/**
 * Track search (search)
 */
export const trackSiteSearch = (params: {
  search_term: string
  search_type: 'product' | 'content' | 'help'
  results_count: number
  filters?: Record<string, any>
  selected_result_position?: number
}) => {
  trackEvent('search', {
    search_term: params.search_term,
    search_type: params.search_type,
    results_count: params.results_count,
    filters: JSON.stringify(params.filters),
    selected_result_position: params.selected_result_position,
    event_category: 'Site Navigation',
    event_label: 'Search',
  })
}

/**
 * Track navigation menu click (menu_click)
 */
export const trackMenuClick = (params: {
  menu_location: 'header' | 'footer' | 'mobile' | 'mega_menu'
  menu_item: string
  destination_url: string
}) => {
  trackEvent('menu_click', {
    menu_location: params.menu_location,
    menu_item: params.menu_item,
    destination_url: params.destination_url,
    event_category: 'Site Navigation',
    event_label: `Menu: ${params.menu_location}`,
  })
}

/**
 * Track breadcrumb click (breadcrumb_click)
 */
export const trackBreadcrumbClick = (params: {
  breadcrumb_level: number
  breadcrumb_text: string
  destination_url: string
}) => {
  trackEvent('breadcrumb_click', {
    breadcrumb_level: params.breadcrumb_level,
    breadcrumb_text: params.breadcrumb_text,
    destination_url: params.destination_url,
    event_category: 'Site Navigation',
    event_label: 'Breadcrumb',
  })
}

// ==========================================
// SOCIAL & SHARING EVENTS
// ==========================================

/**
 * Track social share (share_content)
 */
export const trackSocialShare = (params: {
  content_type: 'product' | 'blog' | 'page'
  content_id: string
  content_name: string
  share_method: 'facebook' | 'twitter' | 'pinterest' | 'email' | 'copy_link'
}) => {
  trackEvent('share', {
    content_type: params.content_type,
    item_id: params.content_id,
    content_name: params.content_name,
    method: params.share_method,
    event_category: 'Social',
    event_label: `Share: ${params.share_method}`,
  })
}

/**
 * Track review interaction (review_interaction)
 */
export const trackReviewInteraction = (params: {
  product_id: string
  product_name: string
  action: 'view' | 'helpful' | 'not_helpful' | 'report'
  review_id: string
  rating?: number
}) => {
  trackEvent('review_interaction', {
    product_id: params.product_id,
    product_name: params.product_name,
    review_action: params.action,
    review_id: params.review_id,
    rating: params.rating,
    event_category: 'Product Engagement',
    event_label: 'Review Interaction',
  })
}

// ==========================================
// CUSTOMER SERVICE EVENTS
// ==========================================

/**
 * Track FAQ interaction (faq_interaction)
 */
export const trackFAQInteraction = (params: {
  question_id: string
  question_text: string
  action: 'expand' | 'collapse' | 'helpful' | 'not_helpful'
  category: string
}) => {
  trackEvent('faq_interaction', {
    question_id: params.question_id,
    question_text: params.question_text,
    faq_action: params.action,
    faq_category: params.category,
    event_category: 'Customer Service',
    event_label: 'FAQ',
  })
}

/**
 * Track live chat interaction (chat_interaction)
 */
export const trackChatInteraction = (params: {
  action: 'open' | 'message_sent' | 'agent_connected' | 'close'
  chat_id?: string
  page_path: string
}) => {
  trackEvent('chat_interaction', {
    chat_action: params.action,
    chat_id: params.chat_id,
    page_path: params.page_path,
    event_category: 'Customer Service',
    event_label: 'Live Chat',
  })
}

// ==========================================
// ERROR & QUALITY EVENTS
// ==========================================

/**
 * Track form errors (form_error)
 */
export const trackFormError = (params: {
  form_name: string
  form_id: string
  field_name: string
  error_type: string
  error_message: string
}) => {
  trackEvent('form_error', {
    form_name: params.form_name,
    form_id: params.form_id,
    field_name: params.field_name,
    error_type: params.error_type,
    error_message: params.error_message,
    event_category: 'Errors',
    event_label: 'Form Validation Error',
  })
}

/**
 * Track JavaScript errors (exception)
 */
export const trackJavaScriptError = (params: {
  error_message: string
  error_stack?: string
  error_type: string
  fatal: boolean
  page_path: string
}) => {
  trackEvent('exception', {
    description: params.error_message,
    error_stack: params.error_stack,
    error_type: params.error_type,
    fatal: params.fatal,
    page_location: params.page_path,
    event_category: 'Errors',
    event_label: 'JavaScript Error',
  })
}

/**
 * Track 404 errors (page_not_found)
 */
export const track404Error = (params: {
  page_path: string
  referrer: string
}) => {
  trackEvent('page_not_found', {
    page_path: params.page_path,
    page_referrer: params.referrer,
    event_category: 'Errors',
    event_label: '404 Not Found',
  })
}

// ==========================================
// USER PROPERTIES & IDENTITY
// ==========================================

/**
 * Set user ID for logged-in users
 */
export const setAnalyticsUserId = (userId: string | null) => {
  if (typeof window === 'undefined') return

  window.gtag?.('config', process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '', {
    user_id: userId,
  })

  // Also set in data layer for GTM
  window.dataLayer?.push({
    user_id: userId,
  })
}

/**
 * Set custom user properties
 */
export const setAnalyticsUserProperties = (properties: {
  customer_type?: 'new' | 'returning' | 'vip'
  service_area?: string
  preferred_category?: string
  price_range?: 'budget' | 'mid' | 'premium'
  lifetime_value?: number
  visit_count?: number
}) => {
  if (typeof window === 'undefined') return

  window.gtag?.('set', 'user_properties', properties)

  // Also set in data layer for GTM
  window.dataLayer?.push({
    user_properties: properties,
  })
}

/**
 * Track user login (login)
 */
export const trackUserLogin = (params: {
  method: 'email' | 'google' | 'facebook' | 'apple'
  user_id: string
}) => {
  setAnalyticsUserId(params.user_id)

  trackEvent('login', {
    method: params.method,
    event_category: 'User Account',
    event_label: 'Login',
  })
}

/**
 * Track user signup (sign_up)
 */
export const trackUserSignup = (params: {
  method: 'email' | 'google' | 'facebook' | 'apple'
  user_id: string
}) => {
  setAnalyticsUserId(params.user_id)

  trackEvent('sign_up', {
    method: params.method,
    event_category: 'User Account',
    event_label: 'Sign Up',
  })
}

/**
 * Track user logout (logout)
 */
export const trackUserLogout = () => {
  trackEvent('logout', {
    event_category: 'User Account',
    event_label: 'Logout',
  })

  // Clear user ID
  setAnalyticsUserId(null)
}

// ==========================================
// FILE DOWNLOADS
// ==========================================

/**
 * Track file download (file_download)
 */
export const trackFileDownload = (params: {
  file_name: string
  file_url: string
  file_type: 'pdf' | 'catalog' | 'guide' | 'spec_sheet' | 'warranty' | 'other'
  file_category?: string
}) => {
  const fileExtension = params.file_name.split('.').pop() || ''

  trackEvent('file_download', {
    file_name: params.file_name,
    file_extension: fileExtension,
    file_url: params.file_url,
    file_type: params.file_type,
    file_category: params.file_category,
    event_category: 'Content Engagement',
    event_label: `Download: ${params.file_type}`,
  })
}

// ==========================================
// PROMO & CAMPAIGN EVENTS
// ==========================================

/**
 * Track promotion view (view_promotion)
 */
export const trackPromotionView = (params: {
  promotion_id: string
  promotion_name: string
  creative_name: string
  creative_slot: string
  location_id: string
}) => {
  trackEvent('view_promotion', {
    ecommerce: {
      promotion_id: params.promotion_id,
      promotion_name: params.promotion_name,
      creative_name: params.creative_name,
      creative_slot: params.creative_slot,
      location_id: params.location_id,
    },
  })
}

/**
 * Track promotion click (select_promotion)
 */
export const trackPromotionClick = (params: {
  promotion_id: string
  promotion_name: string
  creative_name: string
  creative_slot: string
  location_id: string
}) => {
  trackEvent('select_promotion', {
    ecommerce: {
      promotion_id: params.promotion_id,
      promotion_name: params.promotion_name,
      creative_name: params.creative_name,
      creative_slot: params.creative_slot,
      location_id: params.location_id,
    },
  })
}

// Export all functions
export default {
  // E-commerce
  trackProductImpressions,
  trackProductDetailView,
  trackProductSelect,
  trackAddToCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  trackAddPaymentInfo,
  trackPurchaseComplete,
  trackRefund,

  // Lead Generation
  trackQuoteRequest,
  trackConsultationBooking,
  trackCallInitiation,
  trackEmailInitiation,
  trackNewsletterSignup,

  // Engagement
  trackScrollDepth,
  trackTimeOnPage,
  trackVideoEngagement,
  trackGalleryInteraction,
  trackConfiguratorInteraction,
  trackProductComparison,
  trackFilterUsage,
  trackSortUsage,

  // Navigation
  trackSiteSearch,
  trackMenuClick,
  trackBreadcrumbClick,

  // Social
  trackSocialShare,
  trackReviewInteraction,

  // Customer Service
  trackFAQInteraction,
  trackChatInteraction,

  // Errors
  trackFormError,
  trackJavaScriptError,
  track404Error,

  // User Identity
  setAnalyticsUserId,
  setAnalyticsUserProperties,
  trackUserLogin,
  trackUserSignup,
  trackUserLogout,

  // Files
  trackFileDownload,

  // Promotions
  trackPromotionView,
  trackPromotionClick,
}
