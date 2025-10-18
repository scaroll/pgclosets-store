// Conversion Optimization Components
// Export all conversion-focused components for easy importing

export { default as TrustSignals } from './TrustSignals'
export { default as OptimizedCTA, PrimaryCTA, UrgentCTA, PhoneCTA, QuoteCTA, ConversionMessages } from './OptimizedCTA'
export { default as UrgencyBanner, CountdownBanner, LimitedTimeBanner, BookingUrgencyBanner, ConsultationBanner } from './UrgencyBanner'
export { default as SocialProof } from './SocialProof'
export { default as QuoteWidget } from './QuoteWidget'
export { default as ConversionTracking, useConversionTracking, TrackingCTA } from './ConversionTracking'
export { default as OptimizedContactForm } from './OptimizedContactForm'

// Component usage guide:
//
// TrustSignals - Display trust indicators and social proof
// Usage: <TrustSignals variant="hero|footer|inline|compact" />
//
// OptimizedCTA - High-conversion call-to-action buttons
// Usage: <PrimaryCTA text="Get Quote" href="/contact" />
//
// UrgencyBanner - Create urgency and scarcity
// Usage: <UrgencyBanner variant="countdown|limited-time|seasonal|booking|consultation" />
//
// SocialProof - Customer testimonials and reviews
// Usage: <SocialProof variant="testimonials|reviews|stats|badges|gallery" />
//
// QuoteWidget - Interactive quote calculator
// Usage: <QuoteWidget variant="full|compact|floating|inline" />
//
// ConversionTracking - Track user interactions and conversions
// Usage: <ConversionTracking /> in layout, useConversionTracking() in components
//
// OptimizedContactForm - Multi-step conversion-optimized contact form
// Usage: <OptimizedContactForm variant="full|compact|quote|consultation" />