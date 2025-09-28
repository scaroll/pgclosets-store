'use client'

"use client"

import React from 'react'

/**
 * Skip Link Component for accessibility
 * Allows keyboard users to skip to main content
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  )
}

/**
 * Screen Reader Only Component
 * Provides additional context for screen readers
 */
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

/**
 * Accessible Button Component
 * Ensures proper ARIA attributes and focus management
 */
interface AccessibleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  className?: string
}

export function AccessibleButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  className = '',
}: AccessibleButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`
        focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </button>
  )
}

/**
 * Accessible Image Component
 * Ensures proper alt text and ARIA attributes
 */
interface AccessibleImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  isDecorative?: boolean
}

export function AccessibleImage({
  src,
  alt,
  width,
  height,
  className = '',
  isDecorative = false,
}: AccessibleImageProps) {
  return (
    <img
      src={src}
      alt={isDecorative ? '' : alt}
      width={width}
      height={height}
      className={className}
      aria-hidden={isDecorative}
      loading="lazy"
    />
  )
}

/**
 * Proper Heading Component
 * Ensures semantic heading hierarchy
 */
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  id?: string
}

export function Heading({ level, children, className = '', id }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  )
}

/**
 * Accessible Form Field Component
 * Ensures proper labeling and error handling
 */
interface FormFieldProps {
  id: string
  label: string
  type?: string
  required?: boolean
  error?: string
  helpText?: string
  children?: React.ReactNode
  className?: string
}

export function FormField({
  id,
  label,
  type = 'text',
  required = false,
  error,
  helpText,
  children,
  className = '',
}: FormFieldProps) {
  const helpId = helpText ? `${id}-help` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`form-field ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-900 mb-2"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {children || (
        <input
          id={id}
          type={type}
          required={required}
          aria-required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
        />
      )}

      {helpText && (
        <p id={helpId} className="text-sm text-gray-600 mt-1">
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-sm text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Live Region Component
 * Announces dynamic content changes to screen readers
 */
interface LiveRegionProps {
  children: React.ReactNode
  politeness?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
  className?: string
}

export function LiveRegion({
  children,
  politeness = 'polite',
  atomic = false,
  className = '',
}: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className={`${className} ${!children ? 'sr-only' : ''}`}
    >
      {children}
    </div>
  )
}

/**
 * Focus Trap Component
 * Traps focus within a modal or dialog
 */
interface FocusTrapProps {
  children: React.ReactNode
  active?: boolean
  className?: string
}

export function FocusTrap({ children, active = true, className = '' }: FocusTrapProps) {
  const trapRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!active || !trapRef.current) return

    const trap = trapRef.current
    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Find close button or first focusable element
        const closeButton = trap.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLElement
        closeButton?.click()
      }
    }

    document.addEventListener('keydown', handleTabKey)
    document.addEventListener('keydown', handleEscapeKey)

    // Focus first element when trap activates
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [active])

  return (
    <div ref={trapRef} className={className}>
      {children}
    </div>
  )
}