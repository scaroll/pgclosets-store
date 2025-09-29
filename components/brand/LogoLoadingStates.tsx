'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LogoLoadingStatesProps {
  variant?: 'skeleton' | 'pulse' | 'shimmer' | 'dots' | 'luxury';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withWordmark?: boolean;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

const sizeConfig = {
  sm: { width: 100, height: 20, fontSize: 12 },
  md: { width: 140, height: 28, fontSize: 14 },
  lg: { width: 180, height: 36, fontSize: 16 },
  xl: { width: 240, height: 48, fontSize: 20 }
};

const speedConfig = {
  slow: 2.5,
  normal: 1.5,
  fast: 1
};

/**
 * LogoSkeleton Component
 *
 * A skeleton loader that maintains the visual structure of the PG Closets logo
 */
function LogoSkeleton({ size = 'md', withWordmark = true, speed = 'normal' }: LogoLoadingStatesProps) {
  const { width, height } = sizeConfig[size];
  const duration = speedConfig[speed];

  return (
    <div className="flex items-center space-x-3">
      {/* Logo skeleton */}
      <motion.div
        className="bg-gray-200 rounded-md"
        style={{ width: height, height }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Wordmark skeleton */}
      {withWordmark && (
        <motion.div
          className="bg-gray-200 rounded"
          style={{
            width: width - height - 12,
            height: height * 0.6
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2
          }}
        />
      )}
    </div>
  );
}

/**
 * LogoPulse Component
 *
 * A pulsing placeholder that suggests the logo's presence
 */
function LogoPulse({ size = 'md', withWordmark = true, speed = 'normal' }: LogoLoadingStatesProps) {
  const { width, height } = sizeConfig[size];
  const duration = speedConfig[speed];

  return (
    <motion.div
      className="flex items-center space-x-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-2"
      style={{ width: width + 16, height: height + 8 }}
      animate={{
        scale: [1, 1.02, 1],
        opacity: [0.6, 0.9, 0.6]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      <div
        className="bg-gray-300 rounded"
        style={{ width: height, height: height }}
      />
      {withWordmark && (
        <div
          className="bg-gray-300 rounded"
          style={{
            width: width - height - 12,
            height: height * 0.7
          }}
        />
      )}
    </motion.div>
  );
}

/**
 * LogoShimmer Component
 *
 * A sophisticated shimmer effect for premium loading experience
 */
function LogoShimmer({ size = 'md', withWordmark = true, speed = 'normal' }: LogoLoadingStatesProps) {
  const { width, height } = sizeConfig[size];
  const duration = speedConfig[speed] * 2;

  return (
    <div className="relative overflow-hidden">
      <div className="flex items-center space-x-3">
        <div
          className="bg-gray-200 rounded-md relative overflow-hidden"
          style={{ width: height, height }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
            animate={{
              x: [-height, height * 2]
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>

        {withWordmark && (
          <div
            className="bg-gray-200 rounded relative overflow-hidden"
            style={{
              width: width - height - 12,
              height: height * 0.6
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
              animate={{
                x: [-(width - height - 12), (width - height - 12) * 2]
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
                delay: 0.1
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * LogoDots Component
 *
 * A playful dots loading animation inspired by the PG initials
 */
function LogoDots({ size = 'md', speed = 'normal' }: LogoLoadingStatesProps) {
  const { height } = sizeConfig[size];
  const duration = speedConfig[speed];
  const dotSize = Math.max(height * 0.15, 4);

  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="bg-slate-400 rounded-full"
          style={{
            width: dotSize,
            height: dotSize
          }}
          animate={{
            y: [0, -height * 0.3, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.15
          }}
        />
      ))}
    </div>
  );
}

/**
 * LogoLuxury Component
 *
 * Premium loading animation with sophisticated transitions
 */
function LogoLuxury({ size = 'md', withWordmark = true, speed = 'normal' }: LogoLoadingStatesProps) {
  const { width, height } = sizeConfig[size];
  const duration = speedConfig[speed] * 1.5;

  return (
    <div className="relative">
      <motion.div
        className="flex items-center space-x-3"
        animate={{
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {/* Luxury logo placeholder with gradient */}
        <motion.div
          className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-md relative overflow-hidden"
          style={{ width: height, height }}
          animate={{
            boxShadow: [
              '0 0 0 rgba(15, 23, 42, 0)',
              '0 0 20px rgba(15, 23, 42, 0.1)',
              '0 0 0 rgba(15, 23, 42, 0)'
            ]
          }}
          transition={{
            duration: duration * 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* Inner glow effect */}
          <motion.div
            className="absolute inset-2 bg-gradient-to-br from-white/50 to-transparent rounded"
            animate={{
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3
            }}
          />
        </motion.div>

        {/* Luxury wordmark */}
        {withWordmark && (
          <motion.div
            className="space-y-1"
            animate={{
              opacity: [0.4, 0.9, 0.4]
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2
            }}
          >
            <div
              className="bg-gradient-to-r from-slate-200 to-slate-300 rounded"
              style={{
                width: (width - height - 12) * 0.7,
                height: height * 0.4
              }}
            />
            <div
              className="bg-gradient-to-r from-slate-200 to-slate-300 rounded"
              style={{
                width: (width - height - 12) * 0.5,
                height: height * 0.25
              }}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Ambient background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-slate-100/50 to-transparent -z-10 rounded-lg"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0, 0.5, 0]
        }}
        transition={{
          duration: duration * 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
}

/**
 * LogoLoadingStates Component
 *
 * Main component that renders different loading states for the PG Closets logo.
 * Designed to maintain brand consistency while content loads.
 *
 * Features:
 * - Multiple loading animation variants
 * - Responsive sizing options
 * - Speed controls for different use cases
 * - Accessibility-compliant with motion preferences
 * - Premium luxury variant for enhanced brand experience
 */
export function LogoLoadingStates({
  variant = 'luxury',
  size = 'md',
  withWordmark = true,
  className = '',
  speed = 'normal'
}: LogoLoadingStatesProps) {
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Use skeleton variant for reduced motion preference
  const activeVariant = prefersReducedMotion ? 'skeleton' : variant;

  const LoadingComponent = {
    skeleton: LogoSkeleton,
    pulse: LogoPulse,
    shimmer: LogoShimmer,
    dots: LogoDots,
    luxury: LogoLuxury
  }[activeVariant];

  return (
    <div
      className={`inline-flex items-center ${className}`}
      role="status"
      aria-label="Loading PG Closets content"
    >
      <LoadingComponent
        variant={activeVariant}
        size={size}
        withWordmark={withWordmark}
        speed={speed}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * LogoLoadingOverlay Component
 *
 * Full-screen loading overlay with centered logo animation
 */
interface LogoLoadingOverlayProps extends LogoLoadingStatesProps {
  message?: string;
  onTimeout?: () => void;
  timeout?: number;
}

export function LogoLoadingOverlay({
  message = 'Loading your custom closet experience...',
  timeout = 10000,
  onTimeout,
  ...loadingProps
}: LogoLoadingOverlayProps) {
  React.useEffect(() => {
    if (timeout && onTimeout) {
      const timer = setTimeout(onTimeout, timeout);
      return () => clearTimeout(timer);
    }
  }, [timeout, onTimeout]);

  return (
    <motion.div
      className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <LogoLoadingStates
        {...loadingProps}
        size="xl"
        className="mb-6"
      />

      <motion.p
        className="text-slate-600 text-center max-w-md px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
}

// Usage Examples:
/*
// Basic skeleton loader
<LogoLoadingStates variant="skeleton" />

// Luxury loading animation
<LogoLoadingStates
  variant="luxury"
  size="lg"
  speed="slow"
/>

// Full-screen loading overlay
<LogoLoadingOverlay
  variant="luxury"
  message="Preparing your personalized closet design..."
  timeout={15000}
  onTimeout={() => setShowFallback(true)}
/>

// Fast shimmer for quick transitions
<LogoLoadingStates
  variant="shimmer"
  size="sm"
  speed="fast"
  withWordmark={false}
/>
*/