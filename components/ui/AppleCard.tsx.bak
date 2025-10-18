'use client'

import type { HTMLAttributes} from 'react';
import { forwardRef, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { MotionProps} from 'framer-motion';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { DURATION, EASING } from '@/lib/animations/constants'

// Card animation preset for hover effects
export const cardAnimationPreset = {
  whileHover: { y: -4 },
  transition: {
    duration: DURATION.fast,
    ease: EASING.standard
  }
}

interface AppleCardProps extends Omit<HTMLAttributes<HTMLDivElement>, keyof MotionProps> {
  hover?: boolean
  glass?: boolean
  variant?: 'default' | 'elevated' | 'glass' | 'dark' | 'gradient' | 'featured' | 'minimal' | 'link'
  tilt?: boolean // Enable 3D tilt effect
  glow?: boolean // Enable border glow
  abVariant?: 'A' | 'B' | 'C' // A/B test variants
  children?: React.ReactNode
}

const AppleCard = forwardRef<HTMLDivElement, AppleCardProps>(
  ({
    className,
    hover = true,
    glass = false,
    variant = 'default',
    tilt = false,
    glow = false,
    abVariant = 'A',
    children,
    ...props
  }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    // 3D Tilt effect using Framer Motion
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg'])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg'])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tilt || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const xPct = mouseX / width - 0.5
      const yPct = mouseY / height - 0.5

      x.set(xPct)
      y.set(yPct)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      x.set(0)
      y.set(0)
    }

    // A/B Test Variants
    const abVariants = {
      // Variant A: Subtle shadows
      A: {
        shadow: 'shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
        hoverShadow: 'hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
        transform: 'hover:-translate-y-1'
      },
      // Variant B: Pronounced 3D effects
      B: {
        shadow: 'shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
        hoverShadow: 'hover:shadow-[0_16px_48px_rgba(0,0,0,0.20)]',
        transform: 'hover:-translate-y-2 hover:scale-[1.02]'
      },
      // Variant C: Flat minimal
      C: {
        shadow: '',
        hoverShadow: '',
        transform: 'hover:bg-black/5 dark:hover:bg-white/5'
      }
    }

    const currentABVariant = abVariants[abVariant]

    // Variant styles
    const variantStyles = {
      default: cn(
        'bg-white dark:bg-neutral-900',
        'border border-black/[0.08] dark:border-white/[0.15]',
        currentABVariant.shadow,
        hover && currentABVariant.hoverShadow,
        hover && currentABVariant.transform
      ),
      elevated: cn(
        'bg-white dark:bg-neutral-900',
        'shadow-[0_4px_24px_rgba(0,0,0,0.08)]',
        hover && 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)]',
        hover && currentABVariant.transform
      ),
      glass: cn(
        'bg-white/80 dark:bg-neutral-900/80',
        'backdrop-blur-xl',
        'border border-white/20 dark:border-white/10',
        'shadow-[0_4px_24px_rgba(0,0,0,0.08)]',
        hover && 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)]',
        hover && 'hover:bg-white/90 dark:hover:bg-neutral-900/90',
        hover && currentABVariant.transform
      ),
      dark: cn(
        'bg-neutral-900 dark:bg-neutral-950',
        'border border-white/5',
        'shadow-[0_2px_16px_rgba(0,0,0,0.24)]',
        hover && 'hover:shadow-[0_8px_32px_rgba(0,0,0,0.32)]',
        hover && 'hover:border-white/10',
        hover && currentABVariant.transform
      ),
      gradient: cn(
        'bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500',
        'text-white',
        'shadow-[0_4px_24px_rgba(0,102,204,0.3)]',
        hover && 'hover:shadow-[0_12px_40px_rgba(0,102,204,0.4)]',
        hover && currentABVariant.transform
      ),
      featured: cn(
        'bg-white dark:bg-neutral-900',
        'border-2 border-blue-600 dark:border-blue-400',
        'shadow-[0_0_0_4px_rgba(0,102,204,0.1)]',
        hover && 'hover:shadow-[0_0_0_6px_rgba(0,102,204,0.2),0_8px_32px_rgba(0,102,204,0.2)]',
        hover && currentABVariant.transform
      ),
      minimal: cn(
        'bg-transparent',
        hover && 'hover:bg-black/5 dark:hover:bg-white/5'
      ),
      link: cn(
        'bg-white dark:bg-neutral-900',
        'border border-black/[0.08] dark:border-white/[0.15]',
        currentABVariant.shadow,
        'cursor-pointer',
        hover && currentABVariant.hoverShadow,
        hover && currentABVariant.transform,
        hover && 'hover:border-blue-600 dark:hover:border-blue-400'
      )
    }

    // Glow effect
    const glowStyles = glow && cn(
      'before:absolute before:inset-0 before:rounded-[20px] before:p-[1px]',
      'before:bg-gradient-to-br before:from-blue-600 before:via-purple-500 before:to-pink-500',
      'before:opacity-0 before:transition-opacity before:duration-300',
      'hover:before:opacity-100',
      'before:-z-10'
    )

    const cardContent = (
      <motion.div
        // @ts-ignore - ref types conflict
        ref={ref || cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={tilt ? {
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        } : undefined}
        className={cn(
          // Base styles
          'rounded-[20px] md:rounded-[24px]',
          'p-6 md:p-8',
          'transition-all duration-[400ms] cubic-bezier(0.16,1,0.3,1)',
          'relative',
          variantStyles[variant],
          glowStyles,
          className
        )}
        {...(hover && !tilt ? cardAnimationPreset : {})}
        {...props}
      >
        {/* Content with subtle depth for 3D tilt */}
        <div
          style={tilt ? {
            transform: 'translateZ(20px)',
            transformStyle: 'preserve-3d'
          } : undefined}
        >
          {children}
        </div>

        {/* Shine overlay for Variant B */}
        {abVariant === 'B' && isHovered && (
          <motion.div
            className="absolute inset-0 rounded-[20px] md:rounded-[24px] bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    )

    return cardContent
  }
)

AppleCard.displayName = 'AppleCard'

// Sub-components
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-6', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold',
        'text-foreground',
        'leading-tight tracking-tight',
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-gray-600 dark:text-gray-400',
        'text-base leading-relaxed',
        'mt-2',
        className
      )}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-foreground', className)}
      {...props}
    />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mt-6 pt-6',
        'border-t border-black/[0.08] dark:border-white/[0.15]',
        'flex items-center gap-3',
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { AppleCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export type { AppleCardProps }
