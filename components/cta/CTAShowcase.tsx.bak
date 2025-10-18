'use client'

/**
 * CTA Component Showcase
 * Use this page to preview all CTA components and their variants
 */

import React from 'react'
import { PrimaryCTA } from './PrimaryCTA'
import { SecondaryCTA } from './SecondaryCTA'
import { UrgencyCTA } from './UrgencyCTA'
import { TrustBadges, CompactTrustBadge, TrustSeal } from './TrustBadges'
import { SocialProof, CustomerCount, LiveActivity, TrustScore } from './SocialProof'
import { QuoteRequestCTA, QuickQuoteButton } from './QuoteRequestCTA'
import { ArrowRight, Phone, Shield } from 'lucide-react'

export const CTAShowcase: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">CTA Component Library</h1>
        <p className="text-lg text-gray-600">
          High-conversion CTAs inspired by Kit and Ace's elegant design
        </p>
      </div>

      {/* Primary CTAs */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Primary CTAs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Filled - Small</h3>
            <PrimaryCTA variant="filled" size="sm">
              Get Started
            </PrimaryCTA>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Filled - Medium</h3>
            <PrimaryCTA variant="filled" size="md">
              Get Free Quote
            </PrimaryCTA>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Filled - Large</h3>
            <PrimaryCTA variant="filled" size="lg">
              Request Consultation
            </PrimaryCTA>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Outline</h3>
            <PrimaryCTA variant="outline" size="md">
              Learn More
            </PrimaryCTA>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Ghost</h3>
            <PrimaryCTA variant="ghost" size="md">
              View Details
            </PrimaryCTA>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">With Custom Icon</h3>
            <PrimaryCTA variant="filled" size="md" icon={<Phone className="h-5 w-5" />} showArrow={false}>
              Call Now
            </PrimaryCTA>
          </div>
        </div>
      </section>

      {/* Secondary CTAs */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Secondary CTAs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Subtle</h3>
            <SecondaryCTA variant="subtle" size="md" icon={<ArrowRight className="h-4 w-4" />}>
              Browse Collection
            </SecondaryCTA>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Minimal</h3>
            <SecondaryCTA variant="minimal" size="md" icon={<ArrowRight className="h-4 w-4" />}>
              View Products
            </SecondaryCTA>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Text Link</h3>
            <SecondaryCTA variant="text" size="md" icon={<ArrowRight className="h-4 w-4" />}>
              Read More
            </SecondaryCTA>
          </div>
        </div>
      </section>

      {/* Urgency CTAs */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Urgency CTAs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Time-Based</h3>
            <UrgencyCTA urgencyType="time" urgencyMessage="Offer ends Friday">
              Book Free Online Quote
            </UrgencyCTA>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Availability</h3>
            <UrgencyCTA urgencyType="availability" urgencyMessage="Only 3 slots left this week">
              Reserve Your Spot
            </UrgencyCTA>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">High Demand</h3>
            <UrgencyCTA urgencyType="demand" urgencyMessage="10 people viewing now">
              Get Quote Now
            </UrgencyCTA>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Without Pulse</h3>
            <UrgencyCTA showPulse={false}>
              Limited Time Offer
            </UrgencyCTA>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Trust Badges</h2>

        <div className="space-y-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Minimal</h3>
            <TrustBadges variant="minimal" />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Inline</h3>
            <TrustBadges variant="inline" />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Stacked</h3>
            <TrustBadges variant="stacked" />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Detailed</h3>
            <TrustBadges variant="detailed" />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Compact Badge</h3>
            <CompactTrustBadge icon={Shield} label="Licensed & Insured" />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Trust Seal</h3>
            <div className="flex gap-4">
              <TrustSeal label="Verified" sublabel="Licensed Contractor" variant="primary" />
              <TrustSeal label="100% Secure" sublabel="Safe & Protected" variant="success" />
              <TrustSeal label="Premium" sublabel="Award Winning" variant="premium" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Social Proof</h2>

        <div className="space-y-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Stats</h3>
            <SocialProof variant="stats" />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Rating</h3>
            <SocialProof variant="rating" />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Live Activity</h3>
            <SocialProof variant="activity" />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Testimonial</h3>
            <SocialProof variant="testimonial" />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Customer Count</h3>
            <CustomerCount count={500} label="satisfied customers" />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Live Activity</h3>
            <LiveActivity action="Sarah M. requested a quote" timeframe="2 minutes ago" />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Trust Score</h3>
            <TrustScore score={9.5} maxScore={10} variant="detailed" />
          </div>
        </div>
      </section>

      {/* Quote Request */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Quote Request CTAs</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">Full Form</h3>
            <QuoteRequestCTA variant="card" showBenefits />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Inline Form</h3>
              <QuoteRequestCTA variant="inline" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Quick Button</h3>
              <QuickQuoteButton />
            </div>
          </div>
        </div>
      </section>

      {/* Combined Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Combined Patterns</h2>

        <div className="p-8 bg-gradient-to-b from-gray-50 to-white border-2 border-gray-200 rounded-xl space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold text-gray-900">Transform Your Space Today</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional closet organization in Ottawa with lifetime warranty
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryCTA variant="filled" size="lg">
              Get Your Free Quote
            </PrimaryCTA>
            <SecondaryCTA variant="minimal" size="lg">
              Email Us
            </SecondaryCTA>
          </div>

          <TrustBadges variant="minimal" className="justify-center" />

          <SocialProof variant="stats" />
        </div>
      </section>
    </div>
  )
}

export default CTAShowcase
