"use client"

import { Lock, Shield, Check, CreditCard, Phone, Clock, Award, Users } from "lucide-react"

interface SecurityIndicatorsProps {
  variant?: "checkout" | "footer" | "inline" | "form"
  showPaymentMethods?: boolean
  showGuarantees?: boolean
  className?: string
}

export default function SecurityIndicators({
  variant = "checkout",
  showPaymentMethods = true,
  showGuarantees = true,
  className = ""
}: SecurityIndicatorsProps) {

  const securityFeatures = [
    {
      icon: Lock,
      title: "SSL Encrypted",
      description: "256-bit encryption protects your data"
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "We never share your information"
    },
    {
      icon: Check,
      title: "Secure Payments",
      description: "PCI compliant payment processing"
    }
  ]

  const paymentMethods = [
    { name: "Visa", logo: "/payments/visa.svg" },
    { name: "Mastercard", logo: "/payments/mastercard.svg" },
    { name: "American Express", logo: "/payments/amex.svg" },
    { name: "PayPal", logo: "/payments/paypal.svg" },
    { name: "Apple Pay", logo: "/payments/applepay.svg" },
    { name: "Google Pay", logo: "/payments/googlepay.svg" }
  ]

  const guarantees = [
    {
      icon: Clock,
      title: "24-Hour Response",
      description: "Quick quote turnaround"
    },
    {
      icon: Award,
      title: "Lifetime Warranty",
      description: "Guaranteed workmanship"
    },
    {
      icon: Users,
      title: "500+ Happy Customers",
      description: "Trusted since 2009"
    },
    {
      icon: Phone,
      title: "Local Support",
      description: "Ottawa-based team"
    }
  ]

  if (variant === "checkout") {
    return (
      <div className={`bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 ${className}`}>
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-slate-900">Secure & Protected</h3>
          </div>
          <p className="text-sm text-slate-600">Your information is safe and secure with us</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-sm font-semibold text-slate-900">{feature.title}</div>
                <div className="text-xs text-slate-600">{feature.description}</div>
              </div>
            )
          })}
        </div>

        {showPaymentMethods && (
          <div className="border-t border-slate-200 pt-4">
            <div className="text-center mb-3">
              <div className="text-sm font-semibold text-slate-900 mb-2">Accepted Payment Methods</div>
              <div className="flex items-center justify-center gap-4">
                {paymentMethods.slice(0, 4).map((method, index) => (
                  <div key={index} className="w-10 h-6 bg-white border border-slate-200 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="text-xs text-slate-500">
            ✓ No hidden fees • ✓ Free consultation • ✓ Money-back guarantee
          </div>
        </div>
      </div>
    )
  }

  if (variant === "footer") {
    return (
      <div className={`bg-slate-50 border-t border-slate-200 py-6 ${className}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{feature.title}</div>
                    <div className="text-xs text-slate-600">{feature.description}</div>
                  </div>
                </div>
              )
            })}

            {showGuarantees && guarantees.slice(0, 1).map((guarantee, index) => {
              const Icon = guarantee.icon
              return (
                <div key={`guarantee-${index}`} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{guarantee.title}</div>
                    <div className="text-xs text-slate-600">{guarantee.description}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {showPaymentMethods && (
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <div className="text-sm text-slate-600 mb-3">Secure payments powered by industry-leading providers</div>
              <div className="flex items-center justify-center gap-4">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="w-12 h-8 bg-white border border-slate-200 rounded flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-6 py-4 ${className}`}>
        {securityFeatures.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Icon className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-slate-700 font-medium">{feature.title}</span>
            </div>
          )
        })}

        {showGuarantees && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-slate-700 font-medium">Lifetime Warranty</span>
          </div>
        )}
      </div>
    )
  }

  if (variant === "form") {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-green-600" />
          <span className="text-sm text-slate-600">Your information is secure and protected</span>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <span>✓ SSL Encrypted</span>
          <span>✓ Privacy Protected</span>
          <span>✓ No Spam</span>
        </div>

        {showGuarantees && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                24-Hour Response
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                Free Consultation
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                No Obligation
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default layout
  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-6 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure & Trusted</h3>
        <p className="text-sm text-slate-600">Your privacy and security are our top priorities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Security Features</h4>
          <div className="space-y-2">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{feature.title}</div>
                    <div className="text-xs text-slate-600">{feature.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {showGuarantees && (
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Our Guarantees</h4>
            <div className="space-y-2">
              {guarantees.slice(0, 3).map((guarantee, index) => {
                const Icon = guarantee.icon
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{guarantee.title}</div>
                      <div className="text-xs text-slate-600">{guarantee.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showPaymentMethods && (
        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <div className="text-sm font-semibold text-slate-900 mb-3">Accepted Payment Methods</div>
          <div className="flex items-center justify-center gap-3">
            {paymentMethods.slice(0, 6).map((method, index) => (
              <div key={index} className="w-10 h-6 bg-slate-50 border border-slate-200 rounded flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { SecurityIndicators }