/**
 * Loading Spinner Component - Loading states with Apple design system
 *
 * Features:
 * - Apple-style spinner animation
 * - Skeleton loaders for content
 * - Page loading overlay
 * - Multiple size variants
 * - Dark mode optimized
 *
 * @example
 * // Spinner
 * <LoadingSpinner size="lg" />
 *
 * // Skeleton
 * <Skeleton className="w-full h-32" />
 *
 * // Page overlay
 * <PageLoadingOverlay />
 */

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Apple-style loading spinner
 */
export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      <Loader2
        className={cn(
          'animate-spin text-primary',
          sizes[size]
        )}
      />
    </div>
  );
}

LoadingSpinner.displayName = 'LoadingSpinner';

export interface SkeletonProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Animation variant
   */
  variant?: 'pulse' | 'wave';
}

/**
 * Skeleton loader for content placeholders
 */
export function Skeleton({ className, variant = 'pulse' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-muted dark:bg-apple-dark-bg-tertiary',
        variant === 'pulse' && 'animate-pulse',
        variant === 'wave' && 'animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:400%_100%]',
        className
      )}
    />
  );
}

Skeleton.displayName = 'Skeleton';

/**
 * Card skeleton for loading card layouts
 */
export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-card dark:bg-apple-dark-bg-secondary p-8 space-y-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

SkeletonCard.displayName = 'SkeletonCard';

/**
 * Text skeleton for loading text content
 */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-2/3' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

SkeletonText.displayName = 'SkeletonText';

export interface PageLoadingOverlayProps {
  /**
   * Message to display
   */
  message?: string;
}

/**
 * Full-page loading overlay
 */
export function PageLoadingOverlay({ message }: PageLoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card dark:bg-apple-dark-bg-secondary p-8 shadow-2xl">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-lg font-medium text-muted-foreground dark:text-apple-dark-text-secondary">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

PageLoadingOverlay.displayName = 'PageLoadingOverlay';

/**
 * Button loading state
 */
export function ButtonLoading({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      {children}
    </span>
  );
}

ButtonLoading.displayName = 'ButtonLoading';

/**
 * Loading dots animation (Apple style)
 */
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-primary animate-pulse"
          style={{
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

LoadingDots.displayName = 'LoadingDots';
