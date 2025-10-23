'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Pulse loading animation
export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-primary rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// Dots loading animation
export function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center space-x-1', className)}>
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-current rounded-full"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// Spinning loader
export function SpinningLoader({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <motion.div
      className={cn('border-gray-200 border-t-primary rounded-full', sizeClasses[size], className)}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  )
}

// Skeleton loader
export function SkeletonLoader({
  className,
  lines = 3,
  height = 'h-4'
}: {
  className?: string
  lines?: number
  height?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {[...Array(lines)].map((_, i) => (
        <motion.div
          key={i}
          className={cn('bg-gray-200 rounded', height, i === lines - 1 && 'w-3/4')}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// Card skeleton loader
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 border rounded-lg space-y-4', className)}>
      <div className="flex items-center space-x-4">
        <motion.div
          className="w-12 h-12 bg-gray-200 rounded-full"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <div className="space-y-2 flex-1">
          <motion.div
            className="h-4 bg-gray-200 rounded w-3/4"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.1
            }}
          />
          <motion.div
            className="h-3 bg-gray-200 rounded w-1/2"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2
            }}
          />
        </div>
      </div>
      <SkeletonLoader lines={2} />
    </div>
  )
}

// Progress loader
export function ProgressLoader({
  progress = 0,
  className,
  showPercentage = false
}: {
  progress?: number
  className?: string
  showPercentage?: boolean
}) {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showPercentage && (
        <p className="text-sm text-muted-foreground mt-2 text-center">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  )
}

// Staggered animation loader
export function StaggeredLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 h-8 bg-primary mx-0.5 rounded-full"
          animate={{
            scaleY: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// Morphing loader
export function MorphingLoader({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('w-16 h-16 bg-primary', className)}
      animate={{
        borderRadius: ['20%', '50%', '20%'],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  )
}

// Wave loader
export function WaveLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-end justify-center space-x-1 h-8', className)}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 bg-primary rounded-t-full"
          animate={{
            height: [8, 32, 8],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// Bouncing dots loader
export function BouncingDotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-4 h-4 bg-primary rounded-full"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  )
}

// Grid skeleton loader for product cards
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <motion.div
            className="h-64 bg-gray-200"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut'
            }}
          />
          <div className="p-6 space-y-3">
            <motion.div
              className="h-6 bg-gray-200 rounded w-3/4"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1 + 0.1,
                ease: 'easeInOut'
              }}
            />
            <motion.div
              className="h-4 bg-gray-200 rounded w-1/2"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1 + 0.2,
                ease: 'easeInOut'
              }}
            />
            <motion.div
              className="h-8 bg-gray-200 rounded w-full"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1 + 0.3,
                ease: 'easeInOut'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Loading screen with logo animation
export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <motion.div
        className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        PG
      </motion.div>
      <motion.p
        className="text-gray-600 text-lg"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        {message}
      </motion.p>
      <div className="mt-8">
        <StaggeredLoader />
      </div>
    </div>
  )
}

// Typing indicator loader
export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-2 p-3 bg-gray-100 rounded-lg', className)}>
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500">Typing...</span>
    </div>
  )
}