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

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FeatureCardProps {
  /**
   * Icon element to display
   */
  icon: React.ReactNode;
  /**
   * Feature title
   */
  title: string;
  /**
   * Feature description
   */
  description: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Feature Card component for highlighting product features
 */
export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group bg-card dark:bg-apple-dark-bg-secondary rounded-2xl p-8',
        'transition-all duration-300 ease-out',
        'hover:shadow-xl hover:-translate-y-1',
        'border border-transparent hover:border-primary/20',
        className
      )}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div
          className={cn(
            'w-16 h-16 rounded-full',
            'bg-primary/10 dark:bg-primary/20',
            'flex items-center justify-center',
            'transition-all duration-300',
            'group-hover:bg-primary/20 dark:group-hover:bg-primary/30',
            'group-hover:scale-110'
          )}
        >
          <div className="text-primary w-8 h-8">{icon}</div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">
            {title}
          </h3>
          <p className="text-muted-foreground dark:text-apple-dark-text-secondary">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

FeatureCard.displayName = 'FeatureCard';
