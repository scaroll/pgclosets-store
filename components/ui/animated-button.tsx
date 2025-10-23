'use client'

import React, { forwardRef } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glow' | 'slide' | 'flip' | 'magnetic'
  animation?: 'bounce' | 'pulse' | 'shake' | 'slide' | 'flip' | 'glow' | 'magnetic' | 'ripple'
  children: React.ReactNode
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = 'default', animation = 'bounce', children, ...props }, ref) => {
    const getAnimationVariants = () => {
      switch (animation) {
        case 'bounce':
          return {
            initial: { scale: 1 },
            hover: { scale: 1.05 },
            tap: { scale: 0.95 },
          }
        case 'pulse':
          return {
            initial: { scale: 1 },
            hover: { scale: [1, 1.05, 1] },
            tap: { scale: 0.95 },
          }
        case 'shake':
          return {
            initial: { x: 0 },
            hover: { x: [0, -2, 2, -2, 2, 0] },
            tap: { scale: 0.95 },
          }
        case 'slide':
          return {
            initial: { x: 0 },
            hover: { x: 5 },
            tap: { x: 2 },
          }
        case 'flip':
          return {
            initial: { rotateY: 0 },
            hover: { rotateY: 180 },
            tap: { scale: 0.95 },
          }
        case 'glow':
          return {
            initial: { boxShadow: '0 0 0 rgba(59, 130, 246, 0)' },
            hover: { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
            tap: { scale: 0.95 },
          }
        case 'magnetic':
          return {
            initial: { scale: 1 },
            hover: { scale: 1.1 },
            tap: { scale: 0.9 },
          }
        case 'ripple':
          return {
            initial: { scale: 1 },
            hover: { scale: 1.02 },
            tap: { scale: 0.98 },
          }
        default:
          return {
            initial: { scale: 1 },
            hover: { scale: 1.05 },
            tap: { scale: 0.95 },
          }
      }
    }

    const getVariantStyles = () => {
      switch (variant) {
        case 'glow':
          return 'relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300'
        case 'slide':
          return 'relative overflow-hidden group'
        case 'flip':
          return 'preserve-3d'
        case 'magnetic':
          return 'relative'
        default:
          return ''
      }
    }

    return (
      <motion.div
        variants={getAnimationVariants()}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="inline-block"
      >
        <Button
          ref={ref}
          className={cn(
            getVariantStyles(),
            variant === 'slide' && 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-full',
            variant === 'glow' && 'relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'

// Special animated button components
export const GlowButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-block"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
      <Button
        ref={ref}
        className={cn(
          'relative bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 transition-all duration-300',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
)

GlowButton.displayName = 'GlowButton'

export const SlideButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative inline-block overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.5 }}
      />
      <Button
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
)

SlideButton.displayName = 'SlideButton'

export const RippleButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative inline-block"
      >
        <Button
          ref={ref}
          className={cn(
            'relative overflow-hidden transition-all duration-300 hover:shadow-md',
            className
          )}
          {...props}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%', y: '-100%' }}
            whileTap={{ x: '100%', y: '100%' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <span className="relative z-10">{children}</span>
        </Button>
      </motion.div>
    )
  }
)

RippleButton.displayName = 'RippleButton'

export const MagneticButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative inline-block"
      >
        <Button
          ref={ref}
          className={cn(
            'relative transition-all duration-300 hover:shadow-lg',
            className
          )}
          {...props}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-md"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10">{children}</span>
        </Button>
      </motion.div>
    )
  }
)

MagneticButton.displayName = 'MagneticButton'

export default AnimatedButton