'use client'

import { cn } from '@/lib/utils'
import { Award } from 'lucide-react'

interface ReninDealerBadgeProps {
  variant?: 'default' | 'minimal' | 'full'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showIcon?: boolean
}

/**
 * Official Renin Dealer Badge
 * Displays PG Closets' authorized dealer status with Renin
 * Use throughout the site for trust and credibility
 */
export function ReninDealerBadge({
  variant = 'default',
  size = 'md',
  className,
  showIcon = true,
}: ReninDealerBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  if (variant === 'minimal') {
    return (
      <span
        className={cn(
          'inline-flex items-center font-medium text-bronze-600',
          sizeClasses[size],
          className
        )}
      >
        {showIcon && <Award className={cn(iconSizes[size], 'text-bronze-500')} />}
        Official Renin Dealer
      </span>
    )
  }

  if (variant === 'full') {
    return (
      <div
        className={cn(
          'inline-flex flex-col items-center rounded border border-bronze-200 bg-bronze-50 p-4 text-center',
          className
        )}
      >
        {showIcon && <Award className="mb-2 h-8 w-8 text-bronze-500" />}
        <span className="text-sm font-medium tracking-wide text-bronze-700">
          OFFICIAL RENIN DEALER
        </span>
        <span className="mt-1 text-xs text-bronze-600">Authorized Sales &amp; Installation</span>
      </div>
    )
  }

  // Default variant
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border border-bronze-200 bg-bronze-50 font-medium text-bronze-700',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Award className={cn(iconSizes[size], 'text-bronze-500')} />}
      Official Renin Dealer
    </span>
  )
}

/**
 * Renin Brand Section
 * For use in About page or footer to explain the Renin partnership
 */
export function ReninPartnerSection({ className }: { className?: string }) {
  return (
    <section className={cn('py-12', className)}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <Award className="h-12 w-12 text-bronze-500" />
          </div>
          <h2 className="mb-4 text-2xl font-light tracking-tight text-slate-900">
            Official Renin Dealer
          </h2>
          <p className="text-base leading-relaxed text-slate-600">
            PG Closets is proud to be an authorized Renin dealer in Ottawa. Renin is a leading North
            American manufacturer of premium closet doors, known for exceptional quality, innovative
            designs, and lasting durability. As an official dealer, we offer the complete Renin
            catalog with professional installation and dedicated customer support.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-bronze-400" />
              Full Product Warranty
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-bronze-400" />
              Certified Installation
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-bronze-400" />
              Direct Factory Support
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
