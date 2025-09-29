/**
 * Logo Interaction Analytics Tracking
 *
 * Comprehensive tracking system for logo interactions across the PG Closets site.
 * Tracks user engagement with logos, conversion funnel metrics, and brand interaction data.
 */

interface LogoInteractionEvent {
  event: string;
  logo_type: 'header' | 'hero' | 'footer' | 'product' | 'loading' | 'watermark';
  interaction_type: 'click' | 'hover' | 'view' | 'animation_complete' | 'error';
  page_location: string;
  logo_size?: 'small' | 'medium' | 'large';
  animation_type?: string;
  user_journey_stage?: 'awareness' | 'consideration' | 'conversion' | 'retention';
  conversion_context?: string;
}

interface LogoConversionEvent {
  event: string;
  logo_placement: string;
  conversion_type: 'cta_click' | 'quote_request' | 'product_view' | 'contact_submit';
  value?: number;
  currency?: string;
}

/**
 * Track logo interactions for analytics and conversion optimization
 */
export function trackLogoInteraction(params: LogoInteractionEvent) {
  if (typeof window === 'undefined' || typeof gtag === 'undefined') {
    return;
  }

  // Enhanced tracking for Google Analytics
  gtag('event', params.event, {
    event_category: 'Logo Interaction',
    event_label: `${params.logo_type}_${params.interaction_type}`,
    logo_type: params.logo_type,
    interaction_type: params.interaction_type,
    page_location: params.page_location,
    logo_size: params.logo_size,
    animation_type: params.animation_type,
    user_journey_stage: params.user_journey_stage,
    conversion_context: params.conversion_context,
    custom_parameter_1: 'pg_closets_branding',
    custom_parameter_2: 'elevated_taste_tracking'
  });

  // Track logo interaction sequence for user journey analysis
  const logoSequence = sessionStorage.getItem('logo_interaction_sequence') || '';
  const newSequence = `${logoSequence}${params.logo_type}:${params.interaction_type}:${Date.now()};`;
  sessionStorage.setItem('logo_interaction_sequence', newSequence);
}

/**
 * Track logo-driven conversions for ROI measurement
 */
export function trackLogoConversion(params: LogoConversionEvent) {
  if (typeof window === 'undefined' || typeof gtag === 'undefined') {
    return;
  }

  gtag('event', params.event, {
    event_category: 'Logo Conversion',
    event_label: params.logo_placement,
    value: params.value,
    currency: params.currency || 'CAD',
    logo_placement: params.logo_placement,
    conversion_type: params.conversion_type,
    logo_attribution: 'direct_interaction'
  });

  // Track conversion funnel stage
  gtag('event', 'logo_funnel_conversion', {
    event_category: 'Conversion Funnel',
    funnel_stage: params.conversion_type,
    attribution_source: 'logo_interaction',
    business_impact: 'lead_generation'
  });
}

/**
 * Track logo loading performance for optimization
 */
export function trackLogoPerformance(logoType: string, loadTime: number, success: boolean) {
  if (typeof window === 'undefined' || typeof gtag === 'undefined') {
    return;
  }

  gtag('event', 'logo_performance', {
    event_category: 'Logo Performance',
    event_label: logoType,
    value: loadTime,
    logo_type: logoType,
    load_time_ms: loadTime,
    load_success: success,
    performance_category: loadTime < 500 ? 'excellent' : loadTime < 1000 ? 'good' : 'needs_improvement'
  });
}

/**
 * Track logo brand recognition and recall
 */
export function trackBrandEngagement(engagementType: string, logoContext: string) {
  if (typeof window === 'undefined' || typeof gtag === 'undefined') {
    return;
  }

  gtag('event', 'brand_engagement', {
    event_category: 'Brand Recognition',
    event_label: engagementType,
    logo_context: logoContext,
    engagement_type: engagementType,
    brand_positioning: 'elevated_taste_without_pretense',
    market_segment: 'ottawa_luxury_homes'
  });
}

/**
 * Track logo A/B test variants for optimization
 */
export function trackLogoVariant(variantName: string, logoType: string, userAction: string) {
  if (typeof window === 'undefined' || typeof gtag === 'undefined') {
    return;
  }

  gtag('event', 'logo_ab_test', {
    event_category: 'Logo A/B Testing',
    event_label: variantName,
    variant_name: variantName,
    logo_type: logoType,
    user_action: userAction,
    test_objective: 'conversion_optimization'
  });
}

/**
 * Track mobile logo interactions specifically
 */
export function trackMobileLogoInteraction(interaction: string, screenSize: string) {
  if (typeof window === 'undefined' || typeof gtag === 'undefined') {
    return;
  }

  gtag('event', 'mobile_logo_interaction', {
    event_category: 'Mobile UX',
    event_label: interaction,
    screen_size: screenSize,
    device_type: 'mobile',
    interaction_type: interaction,
    mobile_optimization: 'responsive_logo_system'
  });
}

/**
 * Helper function to determine user journey stage based on page
 */
export function getUserJourneyStage(pathname: string): LogoInteractionEvent['user_journey_stage'] {
  if (pathname === '/' || pathname.includes('/about')) return 'awareness';
  if (pathname.includes('/products') || pathname.includes('/gallery')) return 'consideration';
  if (pathname.includes('/contact') || pathname.includes('/request-work') || pathname.includes('/checkout')) return 'conversion';
  if (pathname.includes('/account') || pathname.includes('/orders')) return 'retention';
  return 'consideration'; // default
}

/**
 * Initialize logo tracking session
 */
export function initializeLogoTracking() {
  if (typeof window === 'undefined') return;

  // Clear old session data
  sessionStorage.removeItem('logo_interaction_sequence');

  // Track session start with logo visibility
  trackLogoInteraction({
    event: 'logo_session_start',
    logo_type: 'header',
    interaction_type: 'view',
    page_location: window.location.pathname,
    user_journey_stage: getUserJourneyStage(window.location.pathname)
  });
}

// Auto-initialize on import
if (typeof window !== 'undefined') {
  // Delay initialization to ensure gtag is loaded
  setTimeout(initializeLogoTracking, 1000);
}