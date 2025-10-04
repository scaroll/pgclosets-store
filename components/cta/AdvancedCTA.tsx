'use client'

"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Calendar, Phone, MessageCircle, Clock, Shield, Star, CheckCircle, AlertCircle, Users, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AdvancedCTAProps {
  // Core props
  variant?: "primary" | "secondary" | "urgent" | "ghost" | "phone" | "quote" | "premium" | "success" | "warning" | "social"
  size?: "sm" | "md" | "lg" | "xl" | "hero"
  href?: string
  onClick?: () => void
  children?: React.ReactNode
  text?: string
  className?: string
  disabled?: boolean

  // Psychological triggers
  urgency?: {
    enabled: boolean
    timeLeft?: string
    slotsLeft?: number
    type?: "time" | "availability" | "demand"
  }
  socialProof?: {
    enabled: boolean
    count?: number
    recentAction?: string
    testimonial?: string
  }
  valueProposition?: {
    enabled: boolean
    benefit?: string
    guarantee?: string
    freeOffer?: string
  }
  riskReduction?: {
    enabled: boolean
    warranty?: string
    moneyBack?: string
    noCommitment?: boolean
  }
  personalization?: {
    enabled: boolean
    userName?: string
    location?: string
    previousInteraction?: string
  }

  // Visual enhancements
  animation?: "pulse" | "glow" | "shimmer" | "bounce" | "none"
  icon?: "arrow" | "calendar" | "phone" | "message" | "clock" | "shield" | "star" | "check" | "users" | "trending" | "zap"
  badge?: {
    text: string
    color: "red" | "green" | "blue" | "yellow" | "purple"
  }
  microInteractions?: boolean
}

export default function AdvancedCTA({
  variant = "primary",
  size = "md",
  href,
  onClick,
  children,
  text,
  className = "",
  disabled = false,
  urgency = { enabled: false },
  socialProof = { enabled: false },
  valueProposition = { enabled: false },
  riskReduction = { enabled: false },
  personalization = { enabled: false },
  animation = "none",
  icon,
  badge,
  microInteractions = true
}: AdvancedCTAProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (microInteractions && clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 2000)
      return () => clearTimeout(timer)
    }
  }, [clickCount, microInteractions])

  const getIcon = () => {
    const iconMap = {
      arrow: ArrowRight,
      calendar: Calendar,
      phone: Phone,
      message: MessageCircle,
      clock: Clock,
      shield: Shield,
      star: Star,
      check: CheckCircle,
      users: Users,
      trending: TrendingUp,
      zap: Zap
    }
    const IconComponent = icon ? iconMap[icon] : null
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null
  }

  const getSizeClasses = () => {
    const sizeMap = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
      xl: "px-10 py-5 text-xl",
      hero: "px-12 py-6 text-2xl"
    }
    return sizeMap[size]
  }

  const getVariantClasses = () => {
    const baseClasses = "font-semibold tracking-wide transition-all duration-300 focus:outline-none focus:ring-4 rounded-lg relative overflow-hidden"

    const variantMap = {
      primary: `${baseClasses} bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 focus:ring-blue-300`,
      secondary: `${baseClasses} bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black hover:shadow-xl hover:scale-105 focus:ring-slate-300`,
      urgent: `${baseClasses} bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:scale-105 focus:ring-red-300`,
      ghost: `${baseClasses} border-2 border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white focus:ring-slate-300`,
      phone: `${baseClasses} bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:scale-105 focus:ring-green-300`,
      quote: `${baseClasses} bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 hover:shadow-xl hover:scale-105 focus:ring-amber-300`,
      premium: `${baseClasses} bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:shadow-xl hover:scale-105 focus:ring-purple-300`,
      success: `${baseClasses} bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl hover:scale-105 focus:ring-emerald-300`,
      warning: `${baseClasses} bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 hover:shadow-xl hover:scale-105 focus:ring-orange-300`,
      social: `${baseClasses} bg-gradient-to-r from-pink-600 to-pink-700 text-white hover:from-pink-700 hover:to-pink-800 hover:shadow-xl hover:scale-105 focus:ring-pink-300`
    }

    return variantMap[variant]
  }

  const getAnimationClasses = () => {
    const animationMap = {
      pulse: "animate-pulse",
      glow: "animate-pulse shadow-lg",
      shimmer: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000",
      bounce: "hover:animate-bounce",
      none: ""
    }
    return animationMap[animation]
  }

  const handleClick = () => {
    if (microInteractions) {
      setClickCount(prev => prev + 1)
    }
    onClick?.()
  }

  const renderPsychologicalTriggers = () => (
    <div className="space-y-2">
      {/* Urgency indicators */}
      {urgency.enabled && (
        <div className="flex items-center gap-2 text-sm">
          {urgency.type === "time" && urgency.timeLeft && (
            <div className="flex items-center gap-1 text-red-400">
              <Clock className="w-4 h-4" />
              <span>Ends in {urgency.timeLeft}</span>
            </div>
          )}
          {urgency.type === "availability" && urgency.slotsLeft && (
            <div className="flex items-center gap-1 text-orange-400">
              <AlertCircle className="w-4 h-4" />
              <span>Only {urgency.slotsLeft} slots left</span>
            </div>
          )}
          {urgency.type === "demand" && (
            <div className="flex items-center gap-1 text-yellow-400">
              <TrendingUp className="w-4 h-4" />
              <span>High demand - Book now</span>
            </div>
          )}
        </div>
      )}

      {/* Social proof */}
      {socialProof.enabled && (
        <div className="text-sm text-white">
          {socialProof.count && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{socialProof.count}+ customers this month</span>
            </div>
          )}
          {socialProof.recentAction && (
            <div className="text-xs opacity-75">
              {socialProof.recentAction}
            </div>
          )}
        </div>
      )}

      {/* Value proposition */}
      {valueProposition.enabled && (
        <div className="text-sm text-white">
          {valueProposition.benefit && (
            <div className="font-medium">{valueProposition.benefit}</div>
          )}
          {valueProposition.freeOffer && (
            <div className="text-xs opacity-75">+ {valueProposition.freeOffer}</div>
          )}
        </div>
      )}

      {/* Risk reduction */}
      {riskReduction.enabled && (
        <div className="text-xs text-slate-200 flex items-center gap-3">
          {riskReduction.warranty && (
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {riskReduction.warranty}
            </span>
          )}
          {riskReduction.moneyBack && (
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {riskReduction.moneyBack}
            </span>
          )}
          {riskReduction.noCommitment && (
            <span>No commitment required</span>
          )}
        </div>
      )}
    </div>
  )

  const buttonContent = (
    <div className="relative z-10">
      {/* Badge */}
      {badge && (
        <div className={cn(
          "absolute -top-2 -right-2 px-2 py-1 text-xs font-bold rounded-full",
          {
            "bg-red-500 text-white": badge.color === "red",
            "bg-green-500 text-white": badge.color === "green",
            "bg-blue-500 text-white": badge.color === "blue",
            "bg-yellow-500 text-black": badge.color === "yellow",
            "bg-purple-500 text-white": badge.color === "purple"
          }
        )}>
          {badge.text}
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        {/* Main content */}
        <div className="text-center">
          {text || children}
          {(urgency.enabled || socialProof.enabled || valueProposition.enabled || riskReduction.enabled) && (
            <div className="mt-2">
              {renderPsychologicalTriggers()}
            </div>
          )}
        </div>

        {/* Icon */}
        {getIcon() && (
          <span className={cn(
            "transition-transform duration-300",
            isHovered && "translate-x-1",
            microInteractions && clickCount > 0 && "animate-bounce"
          )}>
            {getIcon()}
          </span>
        )}
      </div>

      {/* Click feedback */}
      {microInteractions && clickCount > 0 && (
        <div className="absolute inset-0 bg-white/20 rounded-lg animate-ping" />
      )}
    </div>
  )

  const buttonClasses = cn(
    "group relative cursor-pointer select-none",
    getSizeClasses(),
    getVariantClasses(),
    getAnimationClasses(),
    disabled && "opacity-50 cursor-not-allowed",
    microInteractions && "transform-gpu",
    className
  )

  const element = href && !disabled ? (
    <Link
      href={href}
      className={buttonClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {buttonContent}
    </Link>
  ) : (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={buttonClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {buttonContent}
    </button>
  )

  return (
    <div className="relative">
      {element}

      {/* Tooltip for additional info */}
      {showTooltip && socialProof.testimonial && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap max-w-xs">
          {socialProof.testimonial}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  )
}

// Pre-configured high-conversion CTAs
export const UrgentBookingCTA = (props: Partial<AdvancedCTAProps>) => (
  <AdvancedCTA
    variant="urgent"
    size="lg"
    icon="calendar"
    text="Book Free Consultation - 3 Slots Left This Week"
    urgency={{
      enabled: true,
      slotsLeft: 3,
      type: "availability"
    }}
    socialProof={{
      enabled: true,
      count: 127,
      recentAction: "Sarah from Kanata booked 2 hours ago"
    }}
    valueProposition={{
      enabled: true,
      freeOffer: "Free measurement & quote"
    }}
    riskReduction={{
      enabled: true,
      noCommitment: true
    }}
    animation="glow"
    microInteractions={true}
    {...props}
  />
)

export const PhoneCallCTA = (props: Partial<AdvancedCTAProps>) => (
  <AdvancedCTA
    variant="phone"
    size="md"
    icon="phone"
    text="Call (613) 422-5800 - Speak Now"
    socialProof={{
      enabled: true,
      recentAction: "Average response time: 30 seconds"
    }}
    urgency={{
      enabled: true,
      type: "demand"
    }}
    animation="pulse"
    {...props}
  />
)

export const QuoteCTA = (props: Partial<AdvancedCTAProps>) => (
  <AdvancedCTA
    variant="quote"
    size="lg"
    icon="calculator"
    text="Get Instant Quote in 24 Hours"
    valueProposition={{
      enabled: true,
      benefit: "Professional consultation included",
      freeOffer: "Free measurement"
    }}
    socialProof={{
      enabled: true,
      count: 500,
      testimonial: "Perfect installation, exceeded expectations! - Michael R."
    }}
    riskReduction={{
      enabled: true,
      warranty: "Lifetime warranty",
      moneyBack: "100% satisfaction"
    }}
    badge={{
      text: "POPULAR",
      color: "green"
    }}
    animation="shimmer"
    {...props}
  />
)

export const PremiumCTA = (props: Partial<AdvancedCTAProps>) => (
  <AdvancedCTA
    variant="premium"
    size="xl"
    icon="star"
    text="Explore Premium Collection"
    valueProposition={{
      enabled: true,
      benefit: "Exclusive luxury designs"
    }}
    socialProof={{
      enabled: true,
      count: 15,
      recentAction: "Years of premium craftsmanship"
    }}
    animation="glow"
    {...props}
  />
)

// Context-aware CTA selector
export function getContextualCTA(context: {
  pageType: "home" | "product" | "cart" | "checkout" | "contact"
  userBehavior?: "first_visit" | "returning" | "abandoned_cart" | "high_intent"
  timeOnPage?: number
  scrollDepth?: number
}) {
  const { pageType, userBehavior, timeOnPage = 0, scrollDepth = 0 } = context

  // High intent indicators
  const isHighIntent = timeOnPage > 60 || scrollDepth > 75 || userBehavior === "high_intent"

  // Urgency for cart abandonment
  const showUrgency = userBehavior === "abandoned_cart"

  // Social proof for first-time visitors
  const emphasizeSocialProof = userBehavior === "first_visit"

  if (pageType === "home") {
    return isHighIntent ? UrgentBookingCTA : QuoteCTA
  }

  if (pageType === "product") {
    return showUrgency ? UrgentBookingCTA : QuoteCTA
  }

  if (pageType === "cart") {
    return UrgentBookingCTA
  }

  if (pageType === "contact") {
    return PhoneCallCTA
  }

  return QuoteCTA
}