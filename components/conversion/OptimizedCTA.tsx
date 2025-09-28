'use client'

"use client"

import { ArrowRight, Calendar, Phone, MessageCircle, Clock } from "lucide-react"
import Link from "next/link"

interface OptimizedCTAProps {
  variant?: "primary" | "secondary" | "urgent" | "ghost" | "phone" | "quote"
  size?: "sm" | "md" | "lg" | "xl"
  href?: string
  onClick?: () => void
  children?: React.ReactNode
  text?: string
  subtext?: string
  urgency?: boolean
  icon?: "arrow" | "calendar" | "phone" | "message" | "clock"
  className?: string
  disabled?: boolean
}

export default function OptimizedCTA({
  variant = "primary",
  size = "md",
  href,
  onClick,
  children,
  text,
  subtext,
  urgency = false,
  icon,
  className = "",
  disabled = false
}: OptimizedCTAProps) {

  const getIcon = () => {
    switch (icon) {
      case "arrow": return <ArrowRight className="w-5 h-5" />
      case "calendar": return <Calendar className="w-5 h-5" />
      case "phone": return <Phone className="w-5 h-5" />
      case "message": return <MessageCircle className="w-5 h-5" />
      case "clock": return <Clock className="w-5 h-5" />
      default: return null
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm": return "px-4 py-2 text-sm"
      case "md": return "px-6 py-3 text-base"
      case "lg": return "px-8 py-4 text-lg"
      case "xl": return "px-12 py-6 text-xl"
      default: return "px-6 py-3 text-base"
    }
  }

  const getVariantClasses = () => {
    const baseClasses = "font-semibold tracking-wide transition-all duration-300 focus:outline-none focus:ring-4"

    switch (variant) {
      case "primary":
        return `${baseClasses} bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 focus:ring-blue-300`
      case "secondary":
        return `${baseClasses} bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black hover:shadow-xl hover:scale-105 focus:ring-slate-300`
      case "urgent":
        return `${baseClasses} bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:scale-105 focus:ring-red-300 animate-pulse`
      case "ghost":
        return `${baseClasses} border-2 border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white focus:ring-slate-300`
      case "phone":
        return `${baseClasses} bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:scale-105 focus:ring-green-300`
      case "quote":
        return `${baseClasses} bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 hover:shadow-xl hover:scale-105 focus:ring-amber-300`
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300`
    }
  }

  const buttonContent = (
    <div className="flex items-center justify-center gap-3">
      {urgency && (
        <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
      )}
      <span className="text-center">
        {text || children}
        {subtext && (
          <div className="text-xs opacity-90 font-normal">{subtext}</div>
        )}
      </span>
      {getIcon() && (
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          {getIcon()}
        </span>
      )}
    </div>
  )

  const buttonClasses = `
    group relative overflow-hidden
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `

  if (href && !disabled) {
    return (
      <Link href={href} className={buttonClasses}>
        {urgency && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        )}
        {buttonContent}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {urgency && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      )}
      {buttonContent}
    </button>
  )
}

// Pre-configured CTA variants for common use cases
export const PrimaryCTA = ({ children, ...props }: Omit<OptimizedCTAProps, 'variant'>) => (
  <OptimizedCTA variant="primary" icon="arrow" {...props}>{children}</OptimizedCTA>
)

export const UrgentCTA = ({ children, ...props }: Omit<OptimizedCTAProps, 'variant' | 'urgency'>) => (
  <OptimizedCTA variant="urgent" urgency={true} icon="clock" {...props}>{children}</OptimizedCTA>
)

export const PhoneCTA = ({ children, ...props }: Omit<OptimizedCTAProps, 'variant'>) => (
  <OptimizedCTA variant="phone" icon="phone" {...props}>{children}</OptimizedCTA>
)

export const QuoteCTA = ({ children, ...props }: Omit<OptimizedCTAProps, 'variant'>) => (
  <OptimizedCTA variant="quote" icon="calendar" {...props}>{children}</OptimizedCTA>
)

// High-conversion CTA messages
export const ConversionMessages = {
  primary: {
    text: "Get Your Free Quote in 24 Hours",
    subtext: "No obligation • Professional consultation"
  },
  urgent: {
    text: "Book Today - Limited Slots Available",
    subtext: "Only 3 consultation slots left this week"
  },
  phone: {
    text: "Call Now for Instant Quote",
    subtext: "(613) 422-5800 • Speak with an expert"
  },
  secondary: {
    text: "View Our Premium Collection",
    subtext: "Browse 100+ luxury door designs"
  }
}