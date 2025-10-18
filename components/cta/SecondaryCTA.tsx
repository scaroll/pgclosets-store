'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SecondaryCTAProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'subtle' | 'minimal' | 'text'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  fullWidth?: boolean
  className?: string
  dataTestId?: string
}

/**
 * Secondary CTA - For supporting actions with refined elegance
 * Use for: "Learn More", "View Details", "Browse Collection"
 */
export const SecondaryCTA: React.FC<SecondaryCTAProps> = ({
  children,
  href,
  onClick,
  variant = 'subtle',
  size = 'md',
  icon,
  iconPosition = 'right',
  disabled = false,
  fullWidth = false,
  className,
  dataTestId = 'secondary-cta'
}) => {
  const baseClasses = cn(
    'group relative inline-flex items-center justify-center gap-2',
    'font-medium transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth && 'w-full'
  )

  const variantClasses = {
    subtle: cn(
      'bg-gray-50 text-gray-900 border border-gray-200',
      'hover:bg-gray-100 hover:border-gray-300',
      'focus-visible:ring-gray-300'
    ),
    minimal: cn(
      'bg-transparent text-gray-900 border border-gray-300',
      'hover:border-gray-900 hover:bg-gray-50',
      'focus-visible:ring-gray-300'
    ),
    text: cn(
      'bg-transparent text-gray-700',
      'hover:text-black hover:underline',
      'focus-visible:ring-gray-300'
    )
  }

  const sizeClasses = {
    sm: variant === 'text' ? 'text-sm' : 'px-4 py-2 text-sm',
    md: variant === 'text' ? 'text-base' : 'px-6 py-3 text-base',
    lg: variant === 'text' ? 'text-lg' : 'px-8 py-4 text-lg'
  }

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="flex-shrink-0 transition-transform group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </>
  )

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={buttonClasses}
        data-testid={dataTestId}
        aria-disabled={disabled}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      data-testid={dataTestId}
    >
      {content}
    </button>
  )
}

export default SecondaryCTA
