'use client'

import React from 'react'
import { WifiOff, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NetworkErrorProps {
  className?: string
  onRetry?: () => void
  title?: string
  message?: string
  showRetry?: boolean
}

/**
 * NetworkError - Network connectivity error state
 *
 * Displays user-friendly message for offline/network errors.
 * Includes automatic retry and manual retry options.
 *
 * @example
 * ```tsx
 * <NetworkError
 *   onRetry={() => refetchData()}
 *   title="No internet connection"
 *   message="Please check your network and try again."
 * />
 * ```
 */
export function NetworkError({
  className,
  onRetry,
  title = "Connection Lost",
  message = "We're having trouble connecting to our servers. Please check your internet connection and try again.",
  showRetry = true
}: NetworkErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="mb-6">
        <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
          <WifiOff className="h-10 w-10 text-red-600" strokeWidth={1.5} />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-charcoal-900 mb-3">
        {title}
      </h2>

      {/* Message */}
      <p className="text-gray-600 max-w-md mb-8">
        {message}
      </p>

      {/* Retry Button */}
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal-900 text-white rounded-lg font-medium hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-2 focus:ring-charcoal-900 focus:ring-offset-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </button>
      )}

      {/* Status Check */}
      <p className="mt-6 text-sm text-gray-500">
        Check your connection status or{' '}
        <a
          href="/"
          className="text-copper-600 hover:text-copper-700 font-medium underline"
        >
          return to homepage
        </a>
      </p>
    </div>
  )
}

/**
 * OfflineIndicator - Subtle offline status indicator
 *
 * Persistent indicator shown when user is offline.
 * Can be placed in header or as toast notification.
 *
 * @example
 * ```tsx
 * {!isOnline && <OfflineIndicator />}
 * ```
 */
export function OfflineIndicator({
  className,
  position = 'top'
}: {
  className?: string
  position?: 'top' | 'bottom'
}) {
  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0'
  }

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 text-center animate-slide-down",
        positionClasses[position],
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm font-medium">
          You're offline. Some features may be unavailable.
        </span>
      </div>
    </div>
  )
}
