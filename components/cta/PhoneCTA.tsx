'use client'

import React from 'react'
import { Phone, Clock, HeadphonesIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhoneCTAProps {
  phoneNumber?: string
  variant?: 'button' | 'card' | 'sticky' | 'floating'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showHours?: boolean
  showIcon?: boolean
  animated?: boolean
  className?: string
  onClick?: () => void
}

/**
 * Phone CTA - Direct call-to-action for immediate contact
 * Use for: Mobile users, urgent inquiries, high-intent customers
 */
export const PhoneCTA: React.FC<PhoneCTAProps> = ({
  phoneNumber = '(613) 422-5800',
  variant = 'button',
  size = 'md',
  showHours = true,
  showIcon = true,
  animated = false,
  className,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    // Track conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'phone_call', {
        event_category: 'engagement',
        event_label: phoneNumber
      })
    }
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  if (variant === 'button') {
    return (
      <a
        href={`tel:${phoneNumber.replace(/\D/g, '')}`}
        onClick={handleClick}
        className={cn(
          'group inline-flex items-center justify-center gap-3',
          'bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg',
          'hover:from-green-700 hover:to-green-800',
          'shadow-lg hover:shadow-xl',
          'transition-all duration-300',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2',
          animated && 'hover:scale-105',
          sizeClasses[size],
          className
        )}
      >
        {showIcon && (
          <Phone className={cn(
            'flex-shrink-0',
            animated && 'group-hover:rotate-12 transition-transform duration-300',
            size === 'sm' ? 'h-4 w-4' : size === 'xl' ? 'h-6 w-6' : 'h-5 w-5'
          )} />
        )}
        <span className="font-bold">{phoneNumber}</span>
      </a>
    )
  }

  if (variant === 'card') {
    return (
      <a
        href={`tel:${phoneNumber.replace(/\D/g, '')}`}
        onClick={handleClick}
        className={cn(
          'group block p-6 bg-white border-2 border-gray-200 rounded-xl',
          'hover:border-green-500 hover:shadow-lg',
          'transition-all duration-300',
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Phone className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-600 mb-1">Call Us Now</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{phoneNumber}</div>
            {showHours && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Mon-Fri: 8am-6pm | Sat: 9am-4pm</span>
              </div>
            )}
          </div>
        </div>
      </a>
    )
  }

  if (variant === 'sticky') {
    return (
      <div className={cn('fixed bottom-4 left-1/2 -translate-x-1/2 z-50', className)}>
        <a
          href={`tel:${phoneNumber.replace(/\D/g, '')}`}
          onClick={handleClick}
          className={cn(
            'inline-flex items-center gap-3 px-6 py-4',
            'bg-gradient-to-r from-green-600 to-green-700 text-white',
            'rounded-full shadow-2xl',
            'hover:from-green-700 hover:to-green-800',
            'transition-all duration-300',
            'animate-slide-up'
          )}
        >
          <Phone className="h-5 w-5" />
          <span className="font-bold text-lg">{phoneNumber}</span>
        </a>
      </div>
    )
  }

  // Floating variant - for mobile
  return (
    <a
      href={`tel:${phoneNumber.replace(/\D/g, '')}`}
      onClick={handleClick}
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full',
        'flex items-center justify-center',
        'shadow-2xl hover:shadow-3xl',
        'hover:scale-110 transition-all duration-300',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300',
        className
      )}
      aria-label="Call us"
    >
      <Phone className="h-7 w-7 text-white animate-pulse" />
      {animated && (
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-ping" />
      )}
    </a>
  )
}

/**
 * Compact Phone Link - For inline use
 */
export const PhoneLink: React.FC<{
  phoneNumber?: string
  label?: string
  showIcon?: boolean
  className?: string
}> = ({
  phoneNumber = '(613) 422-5800',
  label,
  showIcon = true,
  className
}) => {
  return (
    <a
      href={`tel:${phoneNumber.replace(/\D/g, '')}`}
      className={cn(
        'inline-flex items-center gap-2 text-gray-900 font-semibold',
        'hover:text-green-600 transition-colors duration-200',
        className
      )}
    >
      {showIcon && <Phone className="h-4 w-4" />}
      <span>{label || phoneNumber}</span>
    </a>
  )
}

/**
 * Call Now Banner - Full-width attention grabber
 */
export const CallNowBanner: React.FC<{
  phoneNumber?: string
  message?: string
  urgent?: boolean
  className?: string
}> = ({
  phoneNumber = '(613) 422-5800',
  message = 'Speak with an expert today',
  urgent = false,
  className
}) => {
  return (
    <div className={cn(
      'w-full py-4 px-6',
      urgent
        ? 'bg-gradient-to-r from-red-600 to-red-700'
        : 'bg-gradient-to-r from-green-600 to-green-700',
      className
    )}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <HeadphonesIcon className="h-6 w-6 flex-shrink-0" />
          <div>
            <div className="text-sm font-medium opacity-90">{message}</div>
            <a
              href={`tel:${phoneNumber.replace(/\D/g, '')}`}
              className="text-2xl font-bold hover:underline"
            >
              {phoneNumber}
            </a>
          </div>
        </div>
        {urgent && (
          <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">
            <Clock className="h-4 w-4" />
            <span>Limited Time Offer</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhoneCTA
