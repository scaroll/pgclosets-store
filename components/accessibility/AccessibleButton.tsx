/**
 * Accessible Button Component
 *
 * WCAG 2.1 AAA compliant button with:
 * - Full keyboard navigation support
 * - Screen reader announcements
 * - ARIA attributes
 * - Loading states
 * - Touch-friendly targets (44px+)
 * - High contrast support
 * - Focus management
 */

"use client"

import React, { forwardRef, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAccessibility } from './AccessibilityProvider'

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  disabled?: boolean
  // Accessibility props
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaPressed?: boolean
  ariaExpanded?: boolean
  ariaControls?: string
  announcement?: string
  // Focus management
  autoFocus?: boolean
  // Visual feedback
  showFocusRing?: boolean
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText = 'Loading...',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled = false,
      ariaLabel,
      ariaDescribedBy,
      ariaPressed,
      ariaExpanded,
      ariaControls,
      announcement,
      autoFocus = false,
      showFocusRing = true,
      onClick,
      onKeyDown,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const { announceToScreenReader, settings } = useAccessibility()
    const internalRef = useRef<HTMLButtonElement>(null)
    const buttonRef = (ref || internalRef) as React.RefObject<HTMLButtonElement>

    // Handle click with announcement
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return

      if (announcement) {
        announceToScreenReader(announcement)
      }

      onClick?.(e)
    }

    // Enhanced keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || loading) return

      // Space and Enter activate the button
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        buttonRef.current?.click()
        announceToScreenReader('Button activated')
      }

      // Arrow keys for custom navigation (if in a toolbar)
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        // Find parent toolbar or group
        const toolbar = buttonRef.current?.closest('[role="toolbar"], [role="menubar"]')
        if (toolbar) {
          const buttons = Array.from(toolbar.querySelectorAll('button, [role="button"]')) as HTMLElement[]
          const currentIndex = buttons.findIndex(btn => btn === buttonRef.current)

          let nextIndex: number
          if (e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % buttons.length
          } else {
            nextIndex = currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1
          }

          if (buttons[nextIndex]) {
            e.preventDefault()
            buttons[nextIndex].focus()
            announceToScreenReader(`Moved to ${buttons[nextIndex].getAttribute('aria-label') || 'button'}`)
          }
        }
      }

      onKeyDown?.(e)
    }

    // Focus management
    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      if (showFocusRing && settings.keyboardNavigation) {
        announceToScreenReader(ariaLabel || e.currentTarget.textContent || 'Button focused')
      }
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      onBlur?.(e)
    }

    // Auto-focus if requested
    useEffect(() => {
      if (autoFocus && buttonRef.current) {
        setTimeout(() => {
          buttonRef.current?.focus()
        }, 100)
      }
    }, [autoFocus])

    // Variant styles with WCAG AAA contrast ratios
    const variantStyles = {
      primary: cn(
        'bg-primary text-primary-foreground',
        'hover:bg-primary/90',
        'focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'disabled:bg-muted disabled:text-muted-foreground',
        settings.highContrast && 'border-2 border-black bg-white text-black hover:bg-gray-100'
      ),
      secondary: cn(
        'bg-secondary text-secondary-foreground',
        'hover:bg-secondary/80',
        'focus:ring-2 focus:ring-secondary focus:ring-offset-2',
        'disabled:bg-muted disabled:text-muted-foreground',
        settings.highContrast && 'border-2 border-black bg-white text-black hover:bg-gray-100'
      ),
      ghost: cn(
        'hover:bg-accent hover:text-accent-foreground',
        'focus:ring-2 focus:ring-accent focus:ring-offset-2',
        'disabled:text-muted-foreground',
        settings.highContrast && 'border-2 border-transparent bg-transparent text-black hover:bg-gray-100 hover:border-black'
      ),
      destructive: cn(
        'bg-destructive text-destructive-foreground',
        'hover:bg-destructive/90',
        'focus:ring-2 focus:ring-destructive focus:ring-offset-2',
        'disabled:bg-muted disabled:text-muted-foreground',
        settings.highContrast && 'border-2 border-red-600 bg-white text-red-600 hover:bg-red-50'
      ),
      outline: cn(
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        'focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:text-muted-foreground',
        settings.highContrast && 'border-2 border-black bg-transparent text-black hover:bg-gray-100'
      )
    }

    // Size styles with touch-friendly targets
    const sizeStyles = {
      sm: cn('h-9 px-3 text-sm', 'min-h-[44px] min-w-[44px]'),
      md: cn('h-10 px-4 py-2', 'min-h-[44px] min-w-[44px]'),
      lg: cn('h-11 px-8', 'min-h-[48px] min-w-[48px]'),
      xl: cn('h-12 px-10 text-lg', 'min-h-[48px] min-w-[48px]')
    }

    // Build ARIA attributes
    const ariaAttributes: Record<string, any> = {}
    if (ariaLabel) ariaAttributes['aria-label'] = ariaLabel
    if (ariaDescribedBy) ariaAttributes['aria-describedby'] = ariaDescribedBy
    if (ariaPressed !== undefined) ariaAttributes['aria-pressed'] = ariaPressed
    if (ariaExpanded !== undefined) ariaAttributes['aria-expanded'] = ariaExpanded
    if (ariaControls) ariaAttributes['aria-controls'] = ariaControls

    // Loading state
    if (loading) {
      ariaAttributes['aria-busy'] = 'true'
      ariaAttributes['aria-disabled'] = 'true'
    }

    return (
      <button
        ref={buttonRef}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'rounded-md font-medium',
          'transition-all duration-200',
          'disabled:pointer-events-none disabled:opacity-50',

          // Focus styles
          'outline-none',
          settings.keyboardNavigation && 'focus:ring-2 focus:ring-offset-2',

          // Variant and size
          variantStyles[variant],
          sizeStyles[size],

          // Full width
          fullWidth && 'w-full',

          // Custom className
          className
        )}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...ariaAttributes}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Icon on the left */}
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Button content */}
        <span className="truncate">
          {loading ? loadingText : children}
        </span>

        {/* Icon on the right */}
        {icon && iconPosition === 'right' && !loading && (
          <span className="ml-2" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Screen reader only status */}
        {loading && (
          <span className="sr-only">
            Loading, please wait
          </span>
        )}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

export default AccessibleButton