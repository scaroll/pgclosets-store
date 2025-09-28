// Advanced CTA Components Export
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

// Utility functions for easy implementation
export const QuickImplementationCTAs = {
  // Hero section CTA with high urgency
  HeroCTA: (props: any) => (
    <UrgentBookingCTA
      size="xl"
      text="Get Free Quote - 3 Slots Left This Week"
      urgency={{ enabled: true, slotsLeft: 3, type: "availability" }}
      socialProof={{ enabled: true, count: 500 }}
      valueProposition={{ enabled: true, freeOffer: "Free measurement" }}
      {...props}
    />
  ),

  // Product page CTA with value focus
  ProductCTA: (props: any) => (
    <QuoteCTA
      text="Get This Door Installed"
      valueProposition={{ enabled: true, benefit: "Professional installation included" }}
      riskReduction={{ enabled: true, warranty: "Lifetime warranty" }}
      {...props}
    />
  ),

  // Mobile-optimized phone CTA
  MobilePhoneCTA: (props: any) => (
    <PhoneCallCTA
      size="lg"
      className="w-full"
      text="Call (613) 422-5800"
      socialProof={{ enabled: true, recentAction: "Average response: 30 seconds" }}
      {...props}
    />
  ),

  // Exit intent CTA
  ExitIntentCTA: (props: any) => (
    <AdvancedCTA
      variant="urgent"
      text="Wait! Get Your Free Quote Before You Go"
      urgency={{ enabled: true, type: "demand" }}
      valueProposition={{ enabled: true, freeOffer: "No obligation consultation" }}
      animation="glow"
      {...props}
    />
  )
}