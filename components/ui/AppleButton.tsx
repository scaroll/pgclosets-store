'use client'

import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { forwardRef, isValidElement, cloneElement } from 'react'
import { cn } from '@/lib/utils'
import type { MotionProps } from 'framer-motion';
import { motion } from 'framer-motion'
import { EASING } from '@/lib/animations'
import AppleSpinner from '@/components/ui/AppleSpinner'
import { Check, AlertCircle } from 'lucide-react'
// We avoid Radix Slot here for asChild to prevent multi-children issues in SSR

interface AppleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline' | 'link' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  children?: React.ReactNode
  loading?: boolean
  success?: boolean
  error?: boolean
  asChild?: boolean
  // A/B Test Variants
  abVariant?: 'A' | 'B' | 'C'
}

const AppleButton = forwardRef<HTMLButtonElement, AppleButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    children,
    loading = false,
    success = false,
    error = false,
    asChild = false,
    abVariant = 'A',
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading
    const Comp = motion.button

    // A/B Test Variants
    const abVariants = {
      // Variant A: Subtle shadows (Apple default)
      A: {
        shadow: 'shadow-sm',
        hoverShadow: 'hover:shadow-md',
        activeShadow: 'active:shadow-sm'
      },
      // Variant B: Pronounced 3D effects
      B: {
        shadow: 'shadow-lg shadow-black/10',
        hoverShadow: 'hover:shadow-xl hover:shadow-black/20',
        activeShadow: 'active:shadow-md'
      },
      // Variant C: Flat minimal design
      C: {
        shadow: '',
        hoverShadow: '',
        activeShadow: ''
      }
    }

    const currentABVariant = abVariants[abVariant]

    // Apple-style button variants with exact color specifications
    const variants = {
      // Primary: Blue gradient with white text
      primary: cn(
        'bg-gradient-to-b from-[#0a84ff] to-[#06c]',
        'text-white',
        'hover:from-[#409cff] hover:to-[#0a84ff]',
        'active:from-[#06c] active:to-[#0055cc]',
        currentABVariant.shadow,
        currentABVariant.hoverShadow,
        currentABVariant.activeShadow,
        'dark:from-[#0a84ff] dark:to-[#06c]',
        'dark:text-black',
        success && 'from-green-500 to-green-600 hover:from-green-400 hover:to-green-500',
        error && 'from-red-500 to-red-600 hover:from-red-400 hover:to-red-500'
      ),
      // Secondary: Glass morphism with subtle border
      secondary: cn(
        'bg-white/80 dark:bg-black/30',
        'backdrop-blur-xl',
        'text-black dark:text-white',
        'border border-black/[0.08] dark:border-white/[0.15]',
        'hover:bg-white/90 dark:hover:bg-black/40',
        'hover:border-black/[0.12] dark:hover:border-white/[0.25]',
        'active:bg-white dark:active:bg-black/50',
        currentABVariant.shadow,
        currentABVariant.hoverShadow,
        success && 'bg-green-50/90 dark:bg-green-900/30 border-green-200 dark:border-green-700',
        error && 'bg-red-50/90 dark:bg-red-900/30 border-red-200 dark:border-red-700'
      ),
      // Tertiary: Text-only with underline on hover
      tertiary: cn(
        'bg-transparent',
        'text-[#06c] dark:text-[#0a84ff]',
        'hover:bg-black/5 dark:hover:bg-white/5',
        'active:bg-black/10 dark:active:bg-white/10',
        'relative',
        success && 'text-green-600 dark:text-green-400',
        error && 'text-red-600 dark:text-red-400'
      ),
      // Ghost: Transparent with hover
      ghost: cn(
        'bg-transparent',
        'text-black dark:text-white',
        'hover:bg-black/5 dark:hover:bg-white/5',
        'active:bg-black/10 dark:active:bg-white/10'
      ),
      // Outline: Bordered
      outline: cn(
        'bg-transparent',
        'border-2 border-black/10 dark:border-white/10',
        'text-black dark:text-white',
        'hover:border-black/20 dark:hover:border-white/20',
        'hover:bg-black/5 dark:hover:bg-white/5',
        'active:bg-black/10 dark:active:bg-white/10',
        success && 'border-green-600 dark:border-green-400 text-green-600 dark:text-green-400',
        error && 'border-red-600 dark:border-red-400 text-red-600 dark:text-red-400'
      ),
      // Link: Text-only with underline
      link: cn(
        'bg-transparent',
        'text-[#06c] dark:text-[#0a84ff]',
        'underline-offset-4 hover:underline',
        success && 'text-green-600 dark:text-green-400',
        error && 'text-red-600 dark:text-red-400'
      ),
      // Destructive: Red gradient
      destructive: cn(
        'bg-gradient-to-b from-red-500 to-red-600',
        'text-white',
        'hover:from-red-400 hover:to-red-500',
        'active:from-red-600 active:to-red-700',
        currentABVariant.shadow,
        currentABVariant.hoverShadow,
        'dark:from-red-500 dark:to-red-600'
      )
    }

    // Apple standard touch targets - 44px minimum
    const sizes = {
      sm: 'h-8 px-4 text-sm',      // 32px - compact
      md: 'h-11 px-6 text-[15px]', // 44px - standard touch target
      lg: 'h-14 px-8 text-base'    // 56px - prominent CTA
    }

    // Apple spring animation with physics
    const appleSpringAnimation = {
      whileHover: { scale: abVariant === 'C' ? 1 : 1.02 },
      whileTap: { scale: 0.98 },
      transition: EASING.applePhysics
    }

    const baseClasses = cn(
      // Base Apple button styles
      'rounded-full',
      'font-medium',
      'inline-flex items-center justify-center gap-2',
      'tracking-tight',
      'transition-all duration-200',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      'focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-[#06c] dark:focus-visible:ring-[#0a84ff]',
      'focus-visible:ring-offset-2',
      'relative overflow-hidden',
      'select-none whitespace-nowrap',
      variants[variant],
      sizes[size],
      className
    )

    const content = (
      <>
        <span
          className={cn(
            'inline-flex items-center gap-2',
            'transition-opacity duration-200',
            loading ? 'opacity-0' : 'opacity-100'
          )}
        >
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {success && !loading && (
            <Check className="w-4 h-4 flex-shrink-0" />
          )}
          {error && !loading && (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
        </span>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <AppleSpinner
              size={size === 'lg' ? 'md' : 'sm'}
              color={variant === 'primary' || variant === 'destructive' ? 'white' : 'blue'}
            />
          </div>
        )}
        {variant === 'tertiary' && !loading && (
          <span className="absolute bottom-1 left-6 right-6 h-[1px] bg-current scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        )}
        {abVariant === 'B' && (variant === 'primary' || variant === 'destructive') && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        )}
      </>
    )

    // asChild: clone the only child element (e.g., Link) and inject our classes/content
    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<any>
      return cloneElement(
        child,
        {
          className: cn(child.props?.className, baseClasses),
          // preserve existing child props while merging ours
          ...props,
        },
        content
      )
    }

    // Default: render as motion.button
    return (
      <Comp
        {...(!isDisabled && appleSpringAnimation)}
        // @ts-ignore - motion ref compatibility
        ref={ref}
        disabled={isDisabled}
        className={baseClasses}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)

AppleButton.displayName = 'AppleButton'

export { AppleButton }
export type { AppleButtonProps }
