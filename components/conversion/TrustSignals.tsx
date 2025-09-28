"use client"

import { Shield, Award, Users, Clock, CheckCircle, Star } from "lucide-react"

interface TrustSignalsProps {
  variant?: "hero" | "footer" | "inline" | "compact"
  className?: string
}

export default function TrustSignals({ variant = "hero", className = "" }: TrustSignalsProps) {
  const trustItems = [
    {
      icon: Shield,
      title: "Licensed & Insured",
      description: "Fully licensed contractor with comprehensive insurance coverage",
      stat: "100%"
    },
    {
      icon: Award,
      title: "15+ Years Experience",
      description: "Award-winning craftsmanship and design excellence",
      stat: "15+"
    },
    {
      icon: Users,
      title: "500+ Happy Customers",
      description: "Trusted by Ottawa homeowners since 2009",
      stat: "500+"
    },
    {
      icon: Clock,
      title: "Lifetime Warranty",
      description: "We stand behind our work with lifetime guarantees",
      stat: "∞"
    },
    {
      icon: CheckCircle,
      title: "100% Satisfaction",
      description: "Not satisfied? We'll make it right or your money back",
      stat: "100%"
    },
    {
      icon: Star,
      title: "5-Star Rated",
      description: "Consistently rated 5 stars by verified customers",
      stat: "★★★★★"
    }
  ]

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 text-sm ${className}`}>
        <div className="flex items-center gap-2 text-slate-600">
          <Shield className="w-4 h-4 text-green-600" />
          <span>Licensed & Insured</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Award className="w-4 h-4 text-blue-600" />
          <span>15+ Years Experience</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Lifetime Warranty</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>5-Star Rated</span>
        </div>
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <div className={`bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-lg p-6 ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustItems.slice(0, 4).map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-lg font-semibold text-slate-900 mb-1">{item.stat}</div>
                <div className="text-xs text-slate-600 font-medium">{item.title}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-2">
            Why Ottawa Homeowners Trust PG Closets
          </h2>
          <p className="text-slate-600 font-light">
            Your peace of mind is our top priority
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-slate-900 mb-1">{item.stat}</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 font-light leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional trust elements */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">24 Hour</div>
              <div className="text-sm font-medium text-slate-900 mb-1">Quote Response</div>
              <div className="text-xs text-slate-600">Get pricing within one business day</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">Free</div>
              <div className="text-sm font-medium text-slate-900 mb-1">In-Home Consultation</div>
              <div className="text-xs text-slate-600">No obligation, professional assessment</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-sm font-medium text-slate-900 mb-1">Satisfaction Guarantee</div>
              <div className="text-xs text-slate-600">Your satisfaction is guaranteed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { TrustSignals }