'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { PGLogo } from '../ui/pg-logo';

interface AnimatedLogoProps {
  width?: number;
  height?: number;
  className?: string;
  withWordmark?: boolean;
  animation?: 'fade' | 'slide' | 'scale' | 'luxury' | 'none';
  delay?: number;
  duration?: number;
  onAnimationComplete?: () => void;
}

const logoVariants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  },
  slide: {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  },
  luxury: {
    hidden: {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(2px)'
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for luxury feel
        opacity: { duration: 0.8 },
        scale: { duration: 1.0 },
        filter: { duration: 0.6 }
      }
    }
  }
};

const wordmarkVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: 'easeOut'
    }
  }
};

/**
 * AnimatedLogo Component
 *
 * A sophisticated animated version of the PG Closets logo with multiple
 * entrance animation options designed for premium brand presentation.
 *
 * Features:
 * - Multiple animation presets (fade, slide, scale, luxury)
 * - Customizable timing and delays
 * - Separate wordmark animation for enhanced visual hierarchy
 * - Accessibility-compliant with reduced motion support
 * - TypeScript support with comprehensive prop interface
 */
export function AnimatedLogo({
  width = 140,
  height = 28,
  className = '',
  withWordmark = true,
  animation = 'luxury',
  delay = 0,
  duration,
  onAnimationComplete
}: AnimatedLogoProps) {
  // Respect user's motion preferences
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const selectedAnimation = prefersReducedMotion ? 'fade' : animation;
  const variants = logoVariants[selectedAnimation] || logoVariants.luxury;

  // Override duration if provided
  if (duration && variants.visible && typeof variants.visible === 'object') {
    variants.visible.transition = {
      ...variants.visible.transition,
      duration
    };
  }

  return (
    <motion.div
      className={`inline-block ${className}`}
      initial="hidden"
      animate="visible"
      variants={variants}
      style={{
        originX: 0.5,
        originY: 0.5
      }}
      onAnimationComplete={onAnimationComplete}
      transition={{
        delay
      }}
    >
      {animation === 'none' ? (
        <PGLogo
          width={width}
          height={height}
          withWordmark={withWordmark}
        />
      ) : (
        <motion.div
          className="relative"
          variants={withWordmark ? wordmarkVariants : undefined}
        >
          <PGLogo
            width={width}
            height={height}
            withWordmark={withWordmark}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * AnimatedLogoWithBadge Component
 *
 * Enhanced version with optional badges for special occasions or promotions
 */
interface AnimatedLogoWithBadgeProps extends AnimatedLogoProps {
  badge?: {
    text: string;
    color?: 'primary' | 'accent' | 'success';
    position?: 'top-right' | 'bottom-right';
  };
}

export function AnimatedLogoWithBadge({
  badge,
  ...logoProps
}: AnimatedLogoWithBadgeProps) {
  const badgeColors = {
    primary: 'bg-slate-900 text-white',
    accent: 'bg-amber-500 text-slate-900',
    success: 'bg-emerald-600 text-white'
  };

  const badgePositions = {
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2'
  };

  return (
    <div className="relative inline-block">
      <AnimatedLogo {...logoProps} />

      {badge && (
        <motion.div
          className={`absolute ${badgePositions[badge.position || 'top-right']}
                     ${badgeColors[badge.color || 'primary']}
                     px-2 py-1 rounded-full text-xs font-semibold shadow-lg z-10`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: (logoProps.delay || 0) + 0.8,
            duration: 0.4,
            type: 'spring',
            stiffness: 400,
            damping: 20
          }}
        >
          {badge.text}
        </motion.div>
      )}
    </div>
  );
}

// Usage Examples:
/*
// Basic animated logo
<AnimatedLogo />

// Slide animation with custom timing
<AnimatedLogo
  animation="slide"
  delay={0.5}
  duration={0.8}
  onAnimationComplete={() => console.log('Animation complete!')}
/>

// Logo with promotional badge
<AnimatedLogoWithBadge
  animation="luxury"
  badge={{
    text: "New",
    color: "accent",
    position: "top-right"
  }}
/>

// Large header version
<AnimatedLogo
  width={200}
  height={40}
  animation="scale"
  className="mb-6"
/>
*/