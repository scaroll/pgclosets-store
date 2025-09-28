'use client'

"use client"

import { Shield, Check, Star, Award, Lock, Clock, Phone, MapPin } from "lucide-react"
import Image from "next/image"

interface TrustBadgesProps {
  variant?: "security" | "business" | "satisfaction" | "professional" | "complete"
  layout?: "grid" | "inline" | "compact" | "detailed"
  showLogos?: boolean
  className?: string
}

export default function TrustBadges({
  variant = "complete",
  layout = "grid",
  showLogos = true,
  className = ""
}: TrustBadgesProps) {

  const securityBadges = [
    {
      icon: Shield,
      title: "SSL Encrypted",
      description: "Your data is protected with 256-bit SSL encryption",
      status: "Active",
      color: "green",
      logo: "/trust/ssl.svg"
    },
    {
      icon: Lock,
      title: "Privacy Protected",
      description: "We never share your personal information",
      status: "Guaranteed",
      color: "blue",
      logo: "/trust/privacy.svg"
    },
    {
      icon: Check,
      title: "Secure Payments",
      description: "All payments processed through secure channels",
      status: "Verified",
      color: "green",
      logo: "/trust/payment.svg"
    }
  ]

  const businessBadges = [
    {
      icon: Award,
      title: "Licensed Contractor",
      description: "Fully licensed and regulated professional services",
      status: "License #HC-12345",
      color: "purple",
      logo: "/trust/license.svg"
    },
    {
      icon: Shield,
      title: "Insured Professional",
      description: "$2M liability insurance for your protection",
      status: "Policy Active",
      color: "blue",
      logo: "/trust/insurance.svg"
    },
    {
      icon: Check,
      title: "Better Business Bureau",
      description: "Accredited business with A+ rating",
      status: "A+ Rating",
      color: "green",
      logo: "/trust/bbb.svg"
    }
  ]

  const satisfactionBadges = [
    {
      icon: Star,
      title: "5-Star Rated",
      description: "Consistently rated 5 stars by verified customers",
      status: "★★★★★",
      color: "yellow",
      logo: "/trust/google.svg"
    },
    {
      icon: Check,
      title: "100% Satisfaction",
      description: "Money-back guarantee if you're not satisfied",
      status: "Guaranteed",
      color: "green",
      logo: "/trust/satisfaction.svg"
    },
    {
      icon: Clock,
      title: "15+ Years Experience",
      description: "Trusted by Ottawa homeowners since 2009",
      status: "Established 2009",
      color: "blue",
      logo: "/trust/experience.svg"
    }
  ]

  const professionalBadges = [
    {
      icon: Award,
      title: "Renin Authorized Dealer",
      description: "Official authorized dealer and installer",
      status: "Certified",
      color: "purple",
      logo: "/trust/renin.svg"
    },
    {
      icon: Check,
      title: "Professional Installation",
      description: "Trained and certified installation team",
      status: "Certified Team",
      color: "green",
      logo: "/trust/installation.svg"
    },
    {
      icon: Shield,
      title: "Lifetime Warranty",
      description: "Comprehensive warranty on all workmanship",
      status: "Lifetime",
      color: "blue",
      logo: "/trust/warranty.svg"
    }
  ]

  const getBadges = () => {
    switch (variant) {
      case "security":
        return securityBadges
      case "business":
        return businessBadges
      case "satisfaction":
        return satisfactionBadges
      case "professional":
        return professionalBadges
      case "complete":
      default:
        return [...businessBadges, ...satisfactionBadges].slice(0, 6)
    }
  }

  const badges = getBadges()

  const getColorClasses = (color: string) => {
    const colors = {
      green: "text-green-600 bg-green-50 border-green-200",
      blue: "text-blue-600 bg-blue-50 border-blue-200",
      purple: "text-purple-600 bg-purple-50 border-purple-200",
      yellow: "text-yellow-600 bg-yellow-50 border-yellow-200"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  if (layout === "compact") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
        {badges.slice(0, 4).map((badge, index) => {
          const Icon = badge.icon
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClasses(badge.color)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-slate-700 font-medium">{badge.title}</span>
            </div>
          )
        })}
      </div>
    )
  }

  if (layout === "inline") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-6 py-4 ${className}`}>
        {badges.map((badge, index) => {
          const Icon = badge.icon
          return (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(badge.color)}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">{badge.title}</div>
                <div className={`text-xs font-medium ${badge.color === 'green' ? 'text-green-600' :
                  badge.color === 'blue' ? 'text-blue-600' :
                  badge.color === 'purple' ? 'text-purple-600' : 'text-yellow-600'}`}>
                  {badge.status}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (layout === "detailed") {
    return (
      <section className={`py-12 bg-slate-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-2">
              Trust & Security Guarantees
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Your peace of mind is our priority. We maintain the highest standards of professionalism and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, index) => {
              const Icon = badge.icon
              return (
                <div key={index} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(badge.color)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{badge.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{badge.description}</p>
                      <div className={`text-xs font-medium inline-block px-2 py-1 rounded-full ${getColorClasses(badge.color)}`}>
                        {badge.status}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Contact trust indicators */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4 p-6 bg-white rounded-lg border border-slate-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Direct Contact</h4>
                  <p className="text-sm text-slate-600">Speak directly with our team</p>
                  <p className="text-sm font-medium text-green-600">(613) 555-0123</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-white rounded-lg border border-slate-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Local Business</h4>
                  <p className="text-sm text-slate-600">Serving Ottawa since 2009</p>
                  <p className="text-sm font-medium text-blue-600">Ottawa, ON</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Default grid layout
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      {badges.map((badge, index) => {
        const Icon = badge.icon
        return (
          <div key={index} className="text-center p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${getColorClasses(badge.color)}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-900 mb-1">{badge.title}</div>
            <div className={`text-xs font-medium ${badge.color === 'green' ? 'text-green-600' :
              badge.color === 'blue' ? 'text-blue-600' :
              badge.color === 'purple' ? 'text-purple-600' : 'text-yellow-600'}`}>
              {badge.status}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { TrustBadges }