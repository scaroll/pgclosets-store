/**
 * Feature Card Component - Feature highlights with Apple design system
 *
 * Features:
 * - Icon display
 * - Title and description
 * - Hover lift effect
 * - Dark mode optimized
 * - Smooth transitions
 *
 * @example
 * <FeatureCard
 *   icon={<Sparkles className="w-8 h-8" />}
 *   title="Premium Materials"
 *   description="Handcrafted with the finest hardwoods and metals"
 * />
 */

import { cn } from '@/lib/utils'
import * as React from 'react'

export interface FeatureCardProps {
  /**
   * Icon element to display
   */
  icon: React.ReactNode
  /**
   * Feature title
   */
  title: string
  /**
   * Feature description
   */
  description: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Feature Card component for highlighting product features
 */
export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group rounded-3xl bg-card p-8 dark:bg-apple-dark-bg-secondary',
        'apple-ease transition-all duration-500',
        'shadow-apple-sm hover:-translate-y-1 hover:shadow-apple-xl',
        'border border-transparent hover:border-primary/20',
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4 text-center">
        {/* Icon */}
        <div
          className={cn(
            'h-16 w-16 rounded-full',
            'bg-primary/10 dark:bg-primary/20',
            'flex items-center justify-center',
            'transition-all duration-300',
            'group-hover:bg-primary/20 dark:group-hover:bg-primary/30',
            'group-hover:scale-110'
          )}
        >
          <div className="h-8 w-8 text-primary">{icon}</div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-sf-display text-2xl font-semibold tracking-[-0.01em] text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground dark:text-apple-dark-text-secondary">{description}</p>
        </div>
      </div>
    </div>
  )
}

FeatureCard.displayName = 'FeatureCard'
