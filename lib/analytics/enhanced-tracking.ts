/**
 * Enhanced Analytics Tracking - Phase 6
 *
 * Extends analytics coverage to 90%+ with 8 comprehensive event categories:
 * 1. Navigation Events
 * 2. Product Discovery Events
 * 3. Wizard/Estimator Events (already implemented)
 * 4. Conversion Events
 * 5. Engagement Events
 * 6. Performance Events (Core Web Vitals)
 * 7. Error Events
 * 8. User Behavior Events
 *
 * Integrates with existing GTM/GA4 setup while adding enhanced tracking.
 */

import { trackEvent as gtmTrackEvent } from './gtm'

// ============================================================================
// CATEGORY 1: NAVIGATION EVENTS
// ============================================================================

/**
 * Track main navigation clicks
 */
export const trackNavigationClick = (params: {
  link_text: string
  link_url: string
  menu_section: 'main_nav' | 'footer' | 'breadcrumb' | 'sidebar' | 'mega_menu'
  destination_type: 'internal' | 'external'
}) => {
  gtmTrackEvent('navigation_click', {
    ...params,
    event_category: 'Navigation',
    event_label: `${params.menu_section}: ${params.link_text}`,
  })
}

/**
 * Track mega menu interactions
 */
export const trackMegaMenuInteraction = (params: {
  action: 'open' | 'close' | 'click'
  menu_item?: string
  section?: string
  time_spent?: number
}) => {
  gtmTrackEvent('mega_menu_interaction', {
    ...params,
    event_category: 'Navigation',
    event_label: `Mega Menu: ${params.action}`,
  })
}

/**
 * Track breadcrumb navigation
 */
export const trackBreadcrumbClick = (params: {
  breadcrumb_text: string
  breadcrumb_level: number
  destination_url: string
}) => {
  gtmTrackEvent('breadcrumb_click', {
    ...params,
    event_category: 'Navigation',
    event_label: `Breadcrumb Level ${params.breadcrumb_level}`,
  })
}

/**
 * Track mobile menu interactions
 */
export const trackMobileMenuInteraction = (params: {
  action: 'open' | 'close' | 'click'
  menu_item?: string
}) => {
  gtmTrackEvent('mobile_menu_interaction', {
    ...params,
    event_category: 'Navigation',
    event_label: `Mobile Menu: ${params.action}`,
  })
}

// ============================================================================
// CATEGORY 2: PRODUCT DISCOVERY EVENTS
// ============================================================================

/**
 * Track product card impressions (viewport entry)
 */
export const trackProductImpression = (params: {
  product_id: string
  product_name: string
  product_category: string
  position: number
  list_name: string
  price?: number
}) => {
  gtmTrackEvent('product_impression', {
    ...params,
    event_category: 'Product Discovery',
    event_label: `Product Impression: ${params.product_name}`,
  })
}

/**
 * Track product comparison interactions
 */
export const trackProductComparison = (params: {
  action: 'add' | 'remove' | 'view' | 'clear'
  product_id?: string
  product_name?: string
  comparison_count?: number
}) => {
  gtmTrackEvent('product_comparison', {
    ...params,
    event_category: 'Product Discovery',
    event_label: `Compare: ${params.action}`,
  })
}

/**
 * Track product image gallery interactions
 */
export const trackImageGallery = (params: {
  action: 'next' | 'previous' | 'thumbnail_click' | 'zoom' | 'fullscreen'
  product_id: string
  product_name: string
  image_index?: number
}) => {
  gtmTrackEvent('image_gallery_interaction', {
    ...params,
    event_category: 'Product Discovery',
    event_label: `Gallery: ${params.action}`,
  })
}

/**
 * Track collection/category browsing
 */
export const trackCollectionView = (params: {
  collection_name: string
  collection_slug: string
  product_count: number
  filters_applied?: string[]
  sort_applied?: string
}) => {
  gtmTrackEvent('collection_view', {
    ...params,
    event_category: 'Product Discovery',
    event_label: `Collection: ${params.collection_name}`,
  })
}

// ============================================================================
// CATEGORY 3: WIZARD/ESTIMATOR EVENTS (Integration with existing)
// ============================================================================

/**
 * Enhanced wizard tracking with additional context
 */
export const trackWizardProgress = (params: {
  step_number: number
  total_steps: number
  door_type?: string
  dimensions?: { width: number; height: number }
  panels?: number
  completion_percentage: number
  time_on_step: number
  abandoned?: boolean
}) => {
  gtmTrackEvent('wizard_progress', {
    ...params,
    event_category: 'Estimator Wizard',
    event_label: `Step ${params.step_number} of ${params.total_steps}`,
    progress_value: params.completion_percentage,
  })
}

/**
 * Track wizard errors and validation issues
 */
export const trackWizardError = (params: {
  step_number: number
  error_type: 'validation' | 'data' | 'calculation' | 'technical'
  error_message: string
  field_name?: string
  user_input?: string
}) => {
  gtmTrackEvent('wizard_error', {
    ...params,
    event_category: 'Estimator Wizard',
    event_label: `Error: ${params.error_type}`,
    non_interaction: false,
  })
}

/**
 * Track dimension preset usage
 */
export const trackDimensionPreset = (params: {
  preset_name: string
  width: number
  height: number
  source: 'wizard' | 'quick_config'
}) => {
  gtmTrackEvent('dimension_preset_used', {
    ...params,
    event_category: 'Estimator Wizard',
    event_label: `Preset: ${params.preset_name}`,
  })
}

// ============================================================================
// CATEGORY 4: CONVERSION EVENTS
// ============================================================================

/**
 * Track phone number clicks (call intent)
 */
export const trackPhoneClick = (params: {
  phone_number: string
  location: 'header' | 'footer' | 'sticky_bar' | 'pdp' | 'wizard' | 'hero'
  cta_text?: string
  device_type?: 'mobile' | 'desktop'
}) => {
  gtmTrackEvent('phone_click', {
    ...params,
    event_category: 'Conversion',
    event_label: `Call Intent: ${params.location}`,
    conversion_value: 50, // Estimated lead value for call
  })

  // Track as conversion
  gtmTrackEvent('conversion', {
    conversion_type: 'phone_click',
    value: 50,
    currency: 'CAD',
    location: params.location,
  })
}

/**
 * Track booking/measurement request initiation
 */
export const trackBookingStart = (params: {
  booking_type: 'measurement' | 'consultation' | 'installation'
  source: 'wizard' | 'header' | 'footer' | 'pdp' | 'direct'
  product_interest?: string
  estimated_value?: number
}) => {
  gtmTrackEvent('booking_start', {
    ...params,
    event_category: 'Conversion',
    event_label: `Booking Started: ${params.booking_type}`,
  })
}

/**
 * Track booking completion
 */
export const trackBookingComplete = (params: {
  booking_type: 'measurement' | 'consultation' | 'installation'
  booking_id: string
  success: boolean
  product_interest?: string
  estimated_value?: number
  preferred_date?: string
}) => {
  gtmTrackEvent('booking_complete', {
    ...params,
    event_category: 'Conversion',
    event_label: params.success ? 'Booking Confirmed' : 'Booking Failed',
  })

  // Track as conversion if successful
  if (params.success) {
    gtmTrackEvent('conversion', {
      conversion_type: 'booking_completed',
      value: params.estimated_value || 100,
      currency: 'CAD',
      booking_type: params.booking_type,
    })
  }
}

/**
 * Track quote request from wizard
 */
export const trackQuoteRequest = (params: {
  product_name: string
  product_category: string
  total_estimate: number
  door_type: string
  dimensions: string
  panels: number
  finish: string
  addons: string[]
  source: 'wizard' | 'pdp' | 'direct'
}) => {
  gtmTrackEvent('quote_request', {
    ...params,
    event_category: 'Conversion',
    event_label: `Quote: ${params.product_name}`,
    conversion_value: params.total_estimate,
  })

  // Track as conversion
  gtmTrackEvent('conversion', {
    conversion_type: 'quote_request',
    value: params.total_estimate,
    currency: 'CAD',
    product: params.product_name,
  })
}

// ============================================================================
// CATEGORY 5: ENGAGEMENT EVENTS
// ============================================================================

/**
 * Track scroll depth milestones
 */
export const trackScrollMilestone = (params: {
  milestone: 25 | 50 | 75 | 90 | 100
  page_type: 'homepage' | 'pdp' | 'collection' | 'content' | 'other'
  time_to_milestone: number
}) => {
  gtmTrackEvent('scroll_milestone', {
    ...params,
    event_category: 'Engagement',
    event_label: `Scroll ${params.milestone}%`,
    scroll_depth: params.milestone,
  })
}

/**
 * Track time on page milestones
 */
export const trackTimeOnPage = (params: {
  milestone: 30 | 60 | 120 | 300 // seconds
  page_type: string
  engaged: boolean // Actively scrolling/clicking vs idle
}) => {
  gtmTrackEvent('time_on_page', {
    ...params,
    event_category: 'Engagement',
    event_label: `${params.milestone}s on ${params.page_type}`,
    time_value: params.milestone,
  })
}

/**
 * Track social sharing
 */
export const trackSocialShare = (params: {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'pinterest' | 'email' | 'copy_link'
  content_type: 'product' | 'page' | 'blog' | 'gallery'
  content_id: string
  content_title: string
}) => {
  gtmTrackEvent('social_share', {
    ...params,
    event_category: 'Engagement',
    event_label: `Share: ${params.platform}`,
  })
}

/**
 * Track trust signal interactions
 */
export const trackTrustSignalClick = (params: {
  signal_type: 'warranty' | 'bbb' | 'reviews' | 'certifications' | 'guarantees'
  location: 'header' | 'footer' | 'pdp' | 'wizard' | 'hero'
  action: 'click' | 'expand' | 'read_more'
}) => {
  gtmTrackEvent('trust_signal_click', {
    ...params,
    event_category: 'Engagement',
    event_label: `Trust: ${params.signal_type}`,
  })
}

/**
 * Track FAQ interactions
 */
export const trackFAQInteraction = (params: {
  action: 'expand' | 'collapse' | 'search'
  question_text?: string
  question_category?: string
  search_term?: string
}) => {
  gtmTrackEvent('faq_interaction', {
    ...params,
    event_category: 'Engagement',
    event_label: `FAQ: ${params.action}`,
  })
}

// ============================================================================
// CATEGORY 6: PERFORMANCE EVENTS (Core Web Vitals)
// ============================================================================

/**
 * Track Core Web Vitals
 */
export const trackCoreWebVitals = (params: {
  metric_name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'INP'
  metric_value: number
  metric_rating: 'good' | 'needs-improvement' | 'poor'
  page_type: string
  device_type: 'mobile' | 'desktop' | 'tablet'
}) => {
  gtmTrackEvent('web_vitals', {
    ...params,
    event_category: 'Performance',
    event_label: `${params.metric_name}: ${params.metric_rating}`,
    metric_value: Math.round(params.metric_value),
  })
}

/**
 * Track page load performance
 */
export const trackPageLoadPerformance = (params: {
  page_type: string
  load_time: number
  dom_content_loaded: number
  first_paint: number
  bundle_size?: number
  resource_count?: number
}) => {
  gtmTrackEvent('page_load_performance', {
    ...params,
    event_category: 'Performance',
    event_label: `Load Time: ${Math.round(params.load_time)}ms`,
    performance_score: calculatePerformanceScore(params.load_time),
  })
}

/**
 * Track resource loading errors
 */
export const trackResourceError = (params: {
  resource_type: 'script' | 'image' | 'stylesheet' | 'font' | 'video' | 'other'
  resource_url: string
  error_message?: string
}) => {
  gtmTrackEvent('resource_error', {
    ...params,
    event_category: 'Performance',
    event_label: `Resource Error: ${params.resource_type}`,
  })
}

/**
 * Calculate simple performance score
 */
function calculatePerformanceScore(loadTime: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (loadTime < 1000) return 'excellent'
  if (loadTime < 2500) return 'good'
  if (loadTime < 4000) return 'fair'
  return 'poor'
}

// ============================================================================
// CATEGORY 7: ERROR EVENTS
// ============================================================================

/**
 * Track form validation errors
 */
export const trackFormValidationError = (params: {
  form_name: string
  form_type: 'wizard' | 'contact' | 'booking' | 'quote'
  field_name: string
  error_type: 'required' | 'format' | 'range' | 'custom'
  error_message: string
  user_input?: string
}) => {
  gtmTrackEvent('form_validation_error', {
    ...params,
    event_category: 'Error',
    event_label: `Validation: ${params.form_name} - ${params.field_name}`,
  })
}

/**
 * Track 404/page not found
 */
export const track404Error = (params: {
  requested_url: string
  referrer?: string
  search_engine?: boolean
}) => {
  gtmTrackEvent('page_not_found', {
    ...params,
    event_category: 'Error',
    event_label: `404: ${params.requested_url}`,
  })
}

/**
 * Track API/network errors
 */
export const trackAPIError = (params: {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  status_code?: number
  error_message: string
  retry_count?: number
}) => {
  gtmTrackEvent('api_error', {
    ...params,
    event_category: 'Error',
    event_label: `API Error: ${params.endpoint}`,
  })
}

// ============================================================================
// CATEGORY 8: USER BEHAVIOR EVENTS
// ============================================================================

/**
 * Track traffic source attribution
 */
export const trackTrafficSource = (params: {
  source: string // google, facebook, direct, referral, etc.
  medium: string // organic, cpc, social, referral, etc.
  campaign?: string
  landing_page: string
  device_category: 'mobile' | 'desktop' | 'tablet'
}) => {
  gtmTrackEvent('traffic_source', {
    ...params,
    event_category: 'User Behavior',
    event_label: `Source: ${params.source} / ${params.medium}`,
  })
}

/**
 * Track session start with device/location data
 */
export const trackSessionStart = (params: {
  device_type: 'mobile' | 'desktop' | 'tablet'
  browser: string
  browser_version?: string
  os: string
  viewport_size: string
  connection_type?: string
  referrer?: string
}) => {
  gtmTrackEvent('session_start', {
    ...params,
    event_category: 'User Behavior',
    event_label: `Session: ${params.device_type} - ${params.browser}`,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track exit intent (mouse leaving viewport)
 */
export const trackExitIntent = (params: {
  page_type: string
  time_on_page: number
  scroll_depth: number
  engagement_score: number
}) => {
  gtmTrackEvent('exit_intent', {
    ...params,
    event_category: 'User Behavior',
    event_label: `Exit Intent: ${params.page_type}`,
  })
}

/**
 * Track rage clicks (rapid clicks indicating frustration)
 */
export const trackRageClick = (params: {
  element: string
  click_count: number
  time_span: number
  page_location: string
}) => {
  gtmTrackEvent('rage_click', {
    ...params,
    event_category: 'User Behavior',
    event_label: `Rage Click: ${params.element}`,
  })
}

/**
 * Track copy-to-clipboard actions
 */
export const trackCopyAction = (params: {
  content_type: 'phone' | 'email' | 'address' | 'product_code' | 'other'
  location: string
  content_length: number
}) => {
  gtmTrackEvent('copy_action', {
    ...params,
    event_category: 'User Behavior',
    event_label: `Copy: ${params.content_type}`,
  })
}

// ============================================================================
// INITIALIZATION & SESSION MANAGEMENT
// ============================================================================

/**
 * Initialize enhanced analytics on page load
 */
export const initEnhancedAnalytics = () => {
  if (typeof window === 'undefined') return

  // Track session start with device info
  const deviceType = getDeviceType()
  const browserInfo = getBrowserInfo()

  const connectionType = getConnectionType()
  const sessionParams: any = {
    device_type: deviceType,
    browser: browserInfo.name,
    os: navigator.platform,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
  }
  if (browserInfo.version) sessionParams.browser_version = browserInfo.version
  if (connectionType) sessionParams.connection_type = connectionType
  if (document.referrer) sessionParams.referrer = document.referrer

  trackSessionStart(sessionParams)

  // Track traffic source
  const urlParams = new URLSearchParams(window.location.search)
  const source = urlParams.get('utm_source') || getReferrerSource()
  const medium = urlParams.get('utm_medium') || getReferrerMedium()
  const campaign = urlParams.get('utm_campaign')

  const trafficParams: any = {
    source,
    medium,
    landing_page: window.location.pathname,
    device_category: deviceType,
  }
  if (campaign) trafficParams.campaign = campaign

  trackTrafficSource(trafficParams)

  // Set up Core Web Vitals tracking
  setupCoreWebVitalsTracking()

  // Set up scroll depth tracking
  setupScrollTracking()

  // Set up time on page tracking
  setupTimeOnPageTracking()

  // Set up exit intent tracking
  setupExitIntentTracking()

  // Set up rage click detection
  setupRageClickDetection()
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

function getBrowserInfo(): { name: string; version?: string } {
  const ua = navigator.userAgent
  const chromeVersion = ua.match(/Chrome\/(\d+)/)?.[1]
  if (ua.includes('Chrome')) return chromeVersion ? { name: 'Chrome', version: chromeVersion } : { name: 'Chrome' }

  const firefoxVersion = ua.match(/Firefox\/(\d+)/)?.[1]
  if (ua.includes('Firefox')) return firefoxVersion ? { name: 'Firefox', version: firefoxVersion } : { name: 'Firefox' }

  const safariVersion = ua.match(/Version\/(\d+)/)?.[1]
  if (ua.includes('Safari') && !ua.includes('Chrome')) return safariVersion ? { name: 'Safari', version: safariVersion } : { name: 'Safari' }

  const edgeVersion = ua.match(/Edge\/(\d+)/)?.[1]
  if (ua.includes('Edge')) return edgeVersion ? { name: 'Edge', version: edgeVersion } : { name: 'Edge' }

  return { name: 'Unknown' }
}

function getConnectionType(): string | undefined {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  return connection?.effectiveType
}

function getReferrerSource(): string {
  const referrer = document.referrer
  if (!referrer) return 'direct'
  if (referrer.includes('google')) return 'google'
  if (referrer.includes('facebook')) return 'facebook'
  if (referrer.includes('instagram')) return 'instagram'
  if (referrer.includes('twitter') || referrer.includes('t.co')) return 'twitter'
  return 'referral'
}

function getReferrerMedium(): string {
  const referrer = document.referrer
  if (!referrer) return 'none'
  if (referrer.includes('google')) return 'organic'
  if (referrer.includes('facebook') || referrer.includes('instagram') || referrer.includes('twitter')) return 'social'
  return 'referral'
}

// Setup functions for automatic tracking
function setupCoreWebVitalsTracking() {
  // Implementation will use web-vitals library or native Performance API
  // This is a placeholder for the actual implementation
}

function setupScrollTracking() {
  // Track 25%, 50%, 75%, 90%, 100% scroll depth
  let trackedMilestones = new Set<number>()
  const pageType = getPageType()

  const checkScroll = () => {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    const milestones = [25, 50, 75, 90, 100]

    milestones.forEach((milestone) => {
      if (scrollPercentage >= milestone && !trackedMilestones.has(milestone)) {
        trackScrollMilestone({
          milestone: milestone as 25 | 50 | 75 | 90 | 100,
          page_type: pageType,
          time_to_milestone: Date.now() - (window as any).pageLoadTime || 0,
        })
        trackedMilestones.add(milestone)
      }
    })
  }

  window.addEventListener('scroll', checkScroll, { passive: true })
}

function setupTimeOnPageTracking() {
  const pageType = getPageType()
  const milestones = [30, 60, 120, 300] // 30s, 1m, 2m, 5m
  let trackedMilestones = new Set<number>()

  milestones.forEach((milestone) => {
    setTimeout(() => {
      if (!trackedMilestones.has(milestone)) {
        trackTimeOnPage({
          milestone: milestone as 30 | 60 | 120 | 300,
          page_type: pageType,
          engaged: document.visibilityState === 'visible',
        })
        trackedMilestones.add(milestone)
      }
    }, milestone * 1000)
  })
}

function setupExitIntentTracking() {
  const pageType = getPageType()
  const pageLoadTime = Date.now()
  let tracked = false

  const handleMouseLeave = (e: MouseEvent) => {
    if (e.clientY <= 0 && !tracked) {
      const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      const timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000)

      trackExitIntent({
        page_type: pageType,
        time_on_page: timeOnPage,
        scroll_depth: Math.round(scrollDepth),
        engagement_score: calculateEngagementScore(timeOnPage, scrollDepth),
      })
      tracked = true
    }
  }

  document.addEventListener('mouseleave', handleMouseLeave)
}

function setupRageClickDetection() {
  let clickCounts = new Map<string, { count: number; firstClick: number }>()

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const elementId = target.tagName + (target.id ? `#${target.id}` : '') + (target.className ? `.${target.className.split(' ')[0]}` : '')

    const now = Date.now()
    const existing = clickCounts.get(elementId)

    if (existing && now - existing.firstClick < 2000) {
      existing.count++
      if (existing.count >= 3) {
        trackRageClick({
          element: elementId,
          click_count: existing.count,
          time_span: now - existing.firstClick,
          page_location: window.location.pathname,
        })
        clickCounts.delete(elementId)
      }
    } else {
      clickCounts.set(elementId, { count: 1, firstClick: now })
    }
  })
}

function getPageType(): 'homepage' | 'collection' | 'pdp' | 'content' | 'other' {
  const path = window.location.pathname
  if (path === '/') return 'homepage'
  if (path.includes('/collections/')) return 'collection'
  if (path.includes('/products/')) return 'pdp'
  if (path.includes('/blog/') || path.includes('/about') || path.includes('/contact')) return 'content'
  return 'other'
}

function calculateEngagementScore(timeOnPage: number, scrollDepth: number): number {
  // Simple engagement score: 0-100
  const timeScore = Math.min(timeOnPage / 60, 1) * 50 // Max 50 points for time
  const scrollScore = (scrollDepth / 100) * 50 // Max 50 points for scroll
  return Math.round(timeScore + scrollScore)
}
