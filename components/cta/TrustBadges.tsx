'use client'

import React from 'react'
import { Shield, Award, CheckCircle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrustBadge {
  icon: React.ElementType
  label: string
  description?: string
}

interface TrustBadgesProps {
  variant?: 'inline' | 'stacked' | 'minimal' | 'detailed'
  badges?: TrustBadge[]
  className?: string
  animated?: boolean
}

const DEFAULT_BADGES: TrustBadge[] = [
  {
    icon: Shield,
    label: 'Licensed & Insured',
    description: 'Fully licensed contractor'
  },
  {
    icon: Award,
    label: '15+ Years Experience',
    description: 'Award-winning craftsmanship'
  },
  {
    icon: Star,
    label: '5-Star Rated',
    description: 'Rated by verified customers'
  },
  {
    icon: CheckCircle,
    label: 'Lifetime Warranty',
    description: 'We stand behind our work'
  }
]

/**
 * Trust Badges - Build credibility with elegant trust indicators
 * Use for: Building trust, reducing purchase anxiety
 */
export const TrustBadges: React.FC<TrustBadgesProps> = ({
  variant = 'inline',
  badges = DEFAULT_BADGES,
  className,
  animated = false
}) => {
  if (variant === 'minimal') {
    return (
      <div className={cn('flex flex-wrap items-center gap-4', className)}>
        {badges.map((badge, index) => {
          const Icon = badge.icon
          return (
            <div
              key={index}
              className={cn(
                'flex items-center gap-2 text-sm text-gray-600',
                animated && 'animate-fade-in',
                animated && `animation-delay-${index * 100}`
              )}
            >
              <Icon className="h-4 w-4 text-gray-900" />
              <span className="font-medium">{badge.label}</span>
            </div>
          )
        })}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-wrap items-center justify-center gap-6', className)}>
        {badges.map((badge, index) => {
          const Icon = badge.icon
          return (
            <div
              key={index}
              className={cn(
                'flex items-center gap-2',
                animated && 'animate-fade-in',
                animated && `animation-delay-${index * 100}`
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Icon className="h-5 w-5 text-gray-900" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{badge.label}</div>
                {badge.description && (
                  <div className="text-xs text-gray-600">{badge.description}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (variant === 'stacked') {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
        {badges.map((badge, index) => {
          const Icon = badge.icon
          return (
            <div
              key={index}
              className={cn(
                'flex flex-col items-center text-center p-4 rounded-lg border border-gray-200 bg-white',
                'hover:border-gray-300 hover:shadow-sm transition-all duration-200',
                animated && 'animate-scale-in',
                animated && `animation-delay-${index * 100}`
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-2">
                <Icon className="h-6 w-6 text-gray-900" />
              </div>
              <div className="text-sm font-semibold text-gray-900">{badge.label}</div>
            </div>
          )
        })}
      </div>
    )
  }

  // Detailed variant
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6', className)}>
      {badges.map((badge, index) => {
        const Icon = badge.icon
        return (
          <div
            key={index}
            className={cn(
              'flex items-start gap-4 p-6 rounded-lg border border-gray-200 bg-white',
              'hover:border-gray-300 hover:shadow-md transition-all duration-300',
              animated && 'animate-slide-up',
              animated && `animation-delay-${index * 100}`
            )}
          >
            <div className="flex-shrink-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-800">
                <Icon className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{badge.label}</h3>
              {badge.description && (
                <p className="text-sm text-gray-600 leading-relaxed">{badge.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Compact Trust Indicator - For tight spaces
 */
export const CompactTrustBadge: React.FC<{
  icon: React.ElementType
  label: string
  className?: string
}> = ({ icon: Icon, label, className }) => {
  return (
    <div className={cn('inline-flex items-center gap-1.5 text-xs text-gray-600', className)}>
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium">{label}</span>
    </div>
  )
}

/**
 * Trust Seal - Single prominent trust indicator
 */
export const TrustSeal: React.FC<{
  label: string
  sublabel?: string
  icon?: React.ElementType
  variant?: 'primary' | 'success' | 'premium'
  className?: string
}> = ({ label, sublabel, icon: Icon = Shield, variant = 'primary', className }) => {
  const variantClasses = {
    primary: 'from-gray-900 to-gray-800',
    success: 'from-green-600 to-green-700',
    premium: 'from-amber-600 to-amber-700'
  }

  return (
    <div
      className={cn(
        'inline-flex flex-col items-center gap-2 px-6 py-4 rounded-xl',
        'bg-gradient-to-br text-white shadow-lg',
        variantClasses[variant],
        className
      )}
    >
      <Icon className="h-8 w-8" />
      <div className="text-center">
        <div className="text-sm font-bold tracking-wide">{label}</div>
        {sublabel && <div className="text-xs opacity-90">{sublabel}</div>}
      </div>
    </div>
  )
}

export default TrustBadges
