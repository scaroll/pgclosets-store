'use client'

import React from 'react'
import Link from 'next/link'
import { Clock, AlertCircle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UrgencyCTAProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  urgencyType?: 'time' | 'availability' | 'demand'
  urgencyMessage?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showPulse?: boolean
  disabled?: boolean
  fullWidth?: boolean
  className?: string
  dataTestId?: string
}

/**
 * Urgency CTA - Creates FOMO with elegant urgency indicators
 * Use for: Limited offers, booking slots, seasonal promotions
 */
export const UrgencyCTA: React.FC<UrgencyCTAProps> = ({
  children,
  href,
  onClick,
  urgencyType = 'time',
  urgencyMessage,
  size = 'md',
  showPulse = true,
  disabled = false,
  fullWidth = false,
  className,
  dataTestId = 'urgency-cta'
}) => {
  const getUrgencyIcon = () => {
    switch (urgencyType) {
      case 'time':
        return <Clock className="h-4 w-4" />
      case 'availability':
        return <AlertCircle className="h-4 w-4" />
      case 'demand':
        return <Zap className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getDefaultMessage = () => {
    switch (urgencyType) {
      case 'time':
        return 'Limited time offer'
      case 'availability':
        return 'Only 3 slots remaining'
      case 'demand':
        return 'High demand - book now'
      default:
        return 'Act now'
    }
  }

  const baseClasses = cn(
    'group relative inline-flex flex-col items-center justify-center gap-1',
    'overflow-hidden',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth && 'w-full'
  )

  const sizeClasses = {
    sm: 'px-4 py-3 text-sm',
    md: 'px-6 py-4 text-base',
    lg: 'px-8 py-5 text-lg',
    xl: 'px-10 py-6 text-xl'
  }

  const buttonClasses = cn(
    baseClasses,
    sizeClasses[size],
    'bg-gradient-to-r from-red-600 to-red-700',
    'text-white font-semibold',
    'hover:from-red-700 hover:to-red-800',
    'shadow-lg hover:shadow-xl',
    'transform transition-all duration-300',
    'hover:scale-105',
    'focus-visible:ring-red-300',
    className
  )

  const content = (
    <>
      {/* Urgency indicator */}
      <div className="flex items-center gap-2 text-xs font-medium opacity-90">
        {getUrgencyIcon()}
        <span>{urgencyMessage || getDefaultMessage()}</span>
      </div>

      {/* Main CTA text */}
      <div className="flex items-center gap-2 font-bold tracking-wide">
        {showPulse && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        )}
        <span>{children}</span>
      </div>

      {/* Animated background shimmer */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </>
  )

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={buttonClasses}
        data-testid={dataTestId}
        aria-disabled={disabled}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      data-testid={dataTestId}
    >
      {content}
    </button>
  )
}

export default UrgencyCTA
