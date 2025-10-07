'use client'

"use client"

import { useState, useEffect } from "react"
import { Clock, AlertCircle, Calendar, Phone, X } from "lucide-react"

interface UrgencyBannerProps {
  variant?: "countdown" | "limited-time" | "seasonal" | "booking" | "consultation"
  position?: "top" | "bottom" | "inline"
  dismissible?: boolean
  className?: string
}

export default function UrgencyBanner({
  variant = "limited-time",
  position = "top",
  dismissible = true,
  className = ""
}: UrgencyBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Countdown timer effect
  useEffect(() => {
    if (variant === "countdown") {
      const endTime = new Date()
      endTime.setDate(endTime.getDate() + 1) // 24 hours from now
      endTime.setHours(23, 59, 59) // End of day

      const timer = setInterval(() => {
        const now = new Date().getTime()
        const distance = endTime.getTime() - now

        if (distance > 0) {
          setTimeLeft({
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          })
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [variant])

  if (!isVisible) return null

  const getVariantContent = () => {
    switch (variant) {
      case "countdown":
        return {
          icon: <Clock className="w-5 h-5" />,
          message: "Limited Time Offer Ends In:",
          countdown: `${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`,
          cta: "Book Your Free Online Quote Now",
          bgColor: "bg-gradient-to-r from-red-600 to-red-700"
        }

      case "limited-time":
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          message: "🔥 FREE Installation Promotion - Save $500",
          detail: "Limited time offer for new customers in Ottawa",
          cta: "Claim Your Discount",
          bgColor: "bg-gradient-to-r from-orange-500 to-red-600"
        }

      case "seasonal":
        return {
          icon: <Calendar className="w-5 h-5" />,
          message: "🍂 Fall Special: 25% Off Premium Doors",
          detail: "Valid until October 31st • Professional installation included",
          cta: "Get Quote Now",
          bgColor: "bg-gradient-to-r from-amber-600 to-orange-600"
        }

      case "booking":
        return {
          icon: <Calendar className="w-5 h-5" />,
          message: "⚡ Only 3 Consultation Slots Left This Week",
          detail: "Book now to secure your preferred time",
          cta: "Reserve Your Slot",
          bgColor: "bg-gradient-to-r from-blue-600 to-purple-600"
        }

      case "consultation":
        return {
          icon: <Phone className="w-5 h-5" />,
          message: "🎯 Free Online Quote Available",
          detail: "Professional assessment • No obligation • Same-day booking",
          cta: "Schedule Today",
          bgColor: "bg-gradient-to-r from-green-600 to-blue-600"
        }

      default:
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          message: "Special Offer Available",
          cta: "Learn More",
          bgColor: "bg-gradient-to-r from-blue-600 to-purple-600"
        }
    }
  }

  const content = getVariantContent()

  const positionClasses = {
    top: "fixed top-0 left-0 right-0 z-50",
    bottom: "fixed bottom-0 left-0 right-0 z-50",
    inline: "relative"
  }

  return (
    <div className={`${positionClasses[position]} ${content.bgColor} text-white shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0 animate-pulse">
              {content.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-semibold text-sm sm:text-base">
                  {content.message}
                </span>

                {content.countdown && (
                  <div className="bg-white/20 px-3 py-1 rounded-full font-mono text-sm font-bold">
                    {content.countdown}
                  </div>
                )}

                {content.detail && (
                  <span className="text-xs sm:text-sm opacity-90">
                    {content.detail}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap">
                {content.cta}
              </button>

              {dismissible && (
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animated progress bar for urgency */}
      {variant === "countdown" && (
        <div className="h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-1000 ease-out"
            style={{ width: `${(timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds) / 864}%` }}
          />
        </div>
      )}
    </div>
  )
}

// Pre-configured urgency variants
export const CountdownBanner = (props: Omit<UrgencyBannerProps, 'variant'>) => (
  <UrgencyBanner variant="countdown" {...props} />
)

export const LimitedTimeBanner = (props: Omit<UrgencyBannerProps, 'variant'>) => (
  <UrgencyBanner variant="limited-time" {...props} />
)

export const BookingUrgencyBanner = (props: Omit<UrgencyBannerProps, 'variant'>) => (
  <UrgencyBanner variant="booking" {...props} />
)

export const ConsultationBanner = (props: Omit<UrgencyBannerProps, 'variant'>) => (
  <UrgencyBanner variant="consultation" {...props} />
)