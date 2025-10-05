/**
 * PG Closets CTA Component Library
 * High-conversion CTAs inspired by Kit and Ace's elegant design
 *
 * @see /components/cta/CTABestPractices.md for usage guidelines
 */

// Core CTA Components
export { PrimaryCTA } from './PrimaryCTA'
export { SecondaryCTA } from './SecondaryCTA'
export { UrgencyCTA } from './UrgencyCTA'

// Trust & Social Proof
export { TrustBadges, CompactTrustBadge, TrustSeal } from './TrustBadges'
export { SocialProof, CustomerCount, LiveActivity, TrustScore } from './SocialProof'

// Lead Generation
export { QuoteRequestCTA, QuickQuoteButton } from './QuoteRequestCTA'

// Phone CTAs
export { PhoneCTA, PhoneLink, CallNowBanner } from './PhoneCTA'

// Showcase & Documentation
export { CTAShowcase } from './CTAShowcase'

// Legacy components (kept for backwards compatibility)
export { default as AdvancedCTA } from './AdvancedCTA'
export {
  UrgentBookingCTA,
  PhoneCallCTA,
  QuoteCTA,
  PremiumCTA,
  getContextualCTA
} from './AdvancedCTA'

export { default as CTATestingFramework } from './CTATestingFramework'
export {
  CTATestPresets,
  CTATestDashboard,
  trackCTAConversion
} from './CTATestingFramework'

export { default as ContextAwareCTA } from './ContextAwareCTA'
export {
  DefaultContextRules,
  PageContextRules,
  createContextAwareCTA
} from './ContextAwareCTA'

// Type exports
export type { AdvancedCTAProps } from './AdvancedCTA'
export type { CTAVariant, CTATestConfig } from './CTATestingFramework'
export type { UserContext, ContextRule } from './ContextAwareCTA'