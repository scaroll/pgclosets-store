'use client'

import React from 'react'
import { Users, Star, CheckCircle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialProofProps {
  variant?: 'testimonial' | 'stats' | 'activity' | 'rating'
  className?: string
  animated?: boolean
}

/**
 * Social Proof - Build trust through customer validation
 * Use for: Customer testimonials, stats, recent activity
 */
export const SocialProof: React.FC<SocialProofProps> = ({
  variant = 'stats',
  className,
  animated = true
}) => {
  if (variant === 'stats') {
    return (
      <div className={cn('flex flex-wrap items-center justify-center gap-8', className)}>
        <div
          className={cn(
            'text-center',
            animated && 'animate-fade-in animation-delay-100'
          )}
        >
          <div className="text-4xl font-bold text-gray-900">500+</div>
          <div className="text-sm text-gray-600 font-medium">Happy Customers</div>
        </div>
        <div className="h-12 w-px bg-gray-200" />
        <div
          className={cn(
            'text-center',
            animated && 'animate-fade-in animation-delay-200'
          )}
        >
          <div className="text-4xl font-bold text-gray-900">15+</div>
          <div className="text-sm text-gray-600 font-medium">Years Experience</div>
        </div>
        <div className="h-12 w-px bg-gray-200" />
        <div
          className={cn(
            'text-center',
            animated && 'animate-fade-in animation-delay-300'
          )}
        >
          <div className="flex items-center justify-center gap-1 text-4xl font-bold text-gray-900">
            5.0 <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
          </div>
          <div className="text-sm text-gray-600 font-medium">Average Rating</div>
        </div>
      </div>
    )
  }

  if (variant === 'rating') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm',
          className
        )}
      >
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="h-5 w-5 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
        <div className="text-sm">
          <div className="font-semibold text-gray-900">5.0 out of 5</div>
          <div className="text-gray-600">Based on 500+ reviews</div>
        </div>
      </div>
    )
  }

  if (variant === 'activity') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg',
          animated && 'animate-slide-up',
          className
        )}
      >
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </div>
        <div className="text-sm">
          <span className="font-semibold text-green-900">12 people</span>
          <span className="text-green-700"> requested quotes in the last 24 hours</span>
        </div>
      </div>
    )
  }

  // Testimonial variant
  return (
    <div
      className={cn(
        'flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md',
        className
      )}
    >
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="h-4 w-4 fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>
      <blockquote className="text-gray-700 leading-relaxed">
        "Exceptional service from start to finish. The team was professional,
        on-time, and the quality exceeded our expectations. Highly recommend!"
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-600">JD</span>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-gray-900">Jennifer D.</div>
          <div className="text-gray-600">Ottawa, ON</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Compact Customer Count - For inline use
 */
export const CustomerCount: React.FC<{
  count: number
  label?: string
  showIcon?: boolean
  className?: string
}> = ({ count, label = 'satisfied customers', showIcon = true, className }) => {
  return (
    <div className={cn('inline-flex items-center gap-2 text-sm text-gray-600', className)}>
      {showIcon && <Users className="h-4 w-4" />}
      <span>
        <span className="font-semibold text-gray-900">{count.toLocaleString()}+</span>
        {` ${label}`}
      </span>
    </div>
  )
}

/**
 * Live Activity Indicator - Show recent customer actions
 */
export const LiveActivity: React.FC<{
  action: string
  timeframe?: string
  className?: string
}> = ({ action, timeframe = 'just now', className }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md',
        'animate-slide-up',
        className
      )}
    >
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
      </div>
      <div className="text-xs">
        <span className="font-semibold text-blue-900">{action}</span>
        <span className="text-blue-700"> • {timeframe}</span>
      </div>
    </div>
  )
}

/**
 * Trust Score - Overall credibility indicator
 */
export const TrustScore: React.FC<{
  score: number
  maxScore?: number
  label?: string
  variant?: 'compact' | 'detailed'
  className?: string
}> = ({ score, maxScore = 10, label = 'Trust Score', variant = 'compact', className }) => {
  const percentage = (score / maxScore) * 100

  if (variant === 'compact') {
    return (
      <div className={cn('inline-flex items-center gap-2 text-sm', className)}>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span>
          <span className="font-bold text-gray-900">{score}/{maxScore}</span>
          <span className="text-gray-600"> {label}</span>
        </span>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded-lg', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">{label}</span>
        <span className="text-2xl font-bold text-gray-900">{score}/{maxScore}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <TrendingUp className="h-3 w-3" />
        <span>Excellent trustworthiness</span>
      </div>
    </div>
  )
}

export default SocialProof
