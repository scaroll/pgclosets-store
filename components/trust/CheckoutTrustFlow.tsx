'use client'

"use client"

import { Shield, Check, Clock, Phone, Award, CreditCard, Lock, Users, Star, ChevronRight } from "lucide-react"

interface CheckoutTrustFlowProps {
  step?: "consultation" | "quote" | "payment" | "completion"
  showProgress?: boolean
  className?: string
}

export default function CheckoutTrustFlow({
  step = "consultation",
  showProgress = true,
  className = ""
}: CheckoutTrustFlowProps) {

  const steps = [
    { id: "consultation", label: "Free Online Quote", icon: Phone },
    { id: "quote", label: "Custom Quote", icon: Award },
    { id: "payment", label: "Secure Payment", icon: CreditCard },
    { id: "completion", label: "Installation", icon: Check }
  ]

  const getCurrentStepIndex = () => {
    return steps.findIndex(s => s.id === step)
  }

  const trustElements = {
    consultation: {
      headline: "Free Online Quote",
      subheadline: "No obligation • Professional assessment • Instant pricing",
      features: [
        {
          icon: Phone,
          title: "Expert Consultation",
          description: "Licensed professional will assess your space",
          guarantee: "100% Free"
        },
        {
          icon: Clock,
          title: "24-Hour Response",
          description: "Quick response to all consultation requests",
          guarantee: "Guaranteed"
        },
        {
          icon: Users,
          title: "500+ Happy Customers",
          description: "Trusted by Ottawa homeowners since 2009",
          guarantee: "Proven Track Record"
        }
      ],
      testimonial: "Professional, thorough, and no pressure. They took time to understand exactly what we wanted.",
      author: "Sarah Mitchell, Kanata"
    },
    quote: {
      headline: "Transparent Custom Pricing",
      subheadline: "No hidden fees • Detailed breakdown • Lifetime warranty included",
      features: [
        {
          icon: Award,
          title: "Accurate Pricing",
          description: "Custom quotes based on exact measurements",
          guarantee: "No Surprises"
        },
        {
          icon: Shield,
          title: "Lifetime Warranty",
          description: "Comprehensive coverage on all workmanship",
          guarantee: "Guaranteed"
        },
        {
          icon: Clock,
          title: "Quick Turnaround",
          description: "Detailed quotes delivered within 24 hours",
          guarantee: "Fast Service"
        }
      ],
      testimonial: "The quote was detailed and fair. No hidden costs and they stood by their pricing throughout.",
      author: "Michael Thompson, Nepean"
    },
    payment: {
      headline: "Secure & Protected Payment",
      subheadline: "SSL encrypted • Multiple payment options • Satisfaction guaranteed",
      features: [
        {
          icon: Lock,
          title: "SSL Encrypted",
          description: "Bank-level security protects your information",
          guarantee: "256-bit Encryption"
        },
        {
          icon: CreditCard,
          title: "Flexible Payment",
          description: "Multiple secure payment options available",
          guarantee: "PCI Compliant"
        },
        {
          icon: Shield,
          title: "Money-Back Guarantee",
          description: "Not satisfied? Full refund within 30 days",
          guarantee: "100% Guaranteed"
        }
      ],
      testimonial: "Easy payment process and felt completely secure. Great to have the satisfaction guarantee too.",
      author: "Jennifer Lee, Orleans"
    },
    completion: {
      headline: "Professional Installation",
      subheadline: "Licensed team • Clean installation • Final walkthrough",
      features: [
        {
          icon: Check,
          title: "Licensed Professionals",
          description: "Fully licensed and insured installation team",
          guarantee: "Certified Team"
        },
        {
          icon: Shield,
          title: "Quality Guarantee",
          description: "Perfect installation or we make it right",
          guarantee: "Satisfaction Promise"
        },
        {
          icon: Award,
          title: "Lifetime Support",
          description: "Ongoing support for all our installations",
          guarantee: "Always Available"
        }
      ],
      testimonial: "Installation was flawless. The team was professional and cleaned up perfectly. Love our new doors!",
      author: "David Clarke, Barrhaven"
    }
  }

  const currentTrust = trustElements[step]
  const currentStepIndex = getCurrentStepIndex()

  return (
    <div className={`bg-gradient-to-br from-slate-50 to-blue-50 ${className}`}>
      {/* Progress Indicator */}
      {showProgress && (
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => {
                const StepIcon = stepItem.icon
                const isActive = index <= currentStepIndex
                const isCurrent = index === currentStepIndex

                return (
                  <div key={stepItem.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isActive
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-300 text-slate-400"
                      }`}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div className={`text-xs mt-2 font-medium ${
                        isCurrent ? "text-blue-600" : isActive ? "text-slate-700" : "text-slate-400"
                      }`}>
                        {stepItem.label}
                      </div>
                    </div>

                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-4 transition-colors ${
                        index < currentStepIndex ? "bg-blue-600" : "bg-slate-300"
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Trust Content */}
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-2">
              {currentTrust.headline}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {currentTrust.subheadline}
            </p>
          </div>

          {/* Trust Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {currentTrust.features.map((feature, index) => {
              const FeatureIcon = feature.icon
              return (
                <div key={index} className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FeatureIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{feature.description}</p>
                  <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {feature.guarantee}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Customer Testimonial */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-slate-700">
                  {currentTrust.author.split(' ')[0][0]}{currentTrust.author.split(' ')[1]?.[0] || ''}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-slate-700 italic mb-2">
                  "{currentTrust.testimonial}"
                </blockquote>
                <cite className="text-sm text-slate-600 font-medium">
                  — {currentTrust.author}
                </cite>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          {step === "payment" && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-slate-700">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Privacy Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-slate-700">PCI Compliant</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 mb-4">Accepted Payment Methods</div>
              <div className="flex items-center justify-center gap-3">
                {["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Google Pay"].map((method) => (
                  <div key={method} className="w-10 h-6 bg-slate-100 border border-slate-200 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">15+</div>
              <div className="text-xs text-slate-600 uppercase tracking-wide">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">500+</div>
              <div className="text-xs text-slate-600 uppercase tracking-wide">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">★★★★★</div>
              <div className="text-xs text-slate-600 uppercase tracking-wide">5-Star Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">100%</div>
              <div className="text-xs text-slate-600 uppercase tracking-wide">Satisfaction</div>
            </div>
          </div>

          {/* Next Step Indicator */}
          {currentStepIndex < steps.length - 1 && (
            <div className="text-center mt-8 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <span>Next: {steps[currentStepIndex + 1]?.label}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { CheckoutTrustFlow }