'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PrimaryCTAProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'filled' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: React.ReactNode
  showArrow?: boolean
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  className?: string
  dataTestId?: string
}

/**
 * Primary CTA Button - Kit and Ace inspired elegant design
 * Use for primary actions like "Get Quote", "Shop Now", "Contact Us"
 */
export const PrimaryCTA: React.FC<PrimaryCTAProps> = ({
  children,
  href,
  onClick,
  variant = 'filled',
  size = 'md',
  icon,
  showArrow = true,
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  dataTestId = 'primary-cta'
}) => {
  const baseClasses = cn(
    'group relative inline-flex items-center justify-center gap-2',
    'font-medium tracking-wide transition-all duration-300',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth && 'w-full'
  )

  const variantClasses = {
    filled: cn(
      'bg-black text-white',
      'hover:bg-gray-900',
      'focus-visible:ring-black',
      'shadow-sm hover:shadow-lg',
      'border border-black'
    ),
    outline: cn(
      'bg-transparent text-black border-2 border-black',
      'hover:bg-black hover:text-white',
      'focus-visible:ring-black'
    ),
    ghost: cn(
      'bg-transparent text-black',
      'hover:bg-gray-50',
      'focus-visible:ring-gray-300'
    )
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  const content = (
    <>
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
          {showArrow && !icon && (
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          )}
        </>
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
      disabled={disabled || loading}
      className={buttonClasses}
      data-testid={dataTestId}
    >
      {content}
    </button>
  )
}

export default PrimaryCTA
