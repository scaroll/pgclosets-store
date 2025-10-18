/**
 * Loading Spinners
 *
 * Collection of Apple-quality loading spinners and animations
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * AppleSpinner - iOS-style circular spinner
 */
interface AppleSpinnerProps {
  size?: number;
  className?: string;
  color?: string;
}

export function AppleSpinner({ size = 20, className, color = 'text-black' }: AppleSpinnerProps) {
  return (
    <svg
      className={cn('animate-spin', color, className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
  );
}

/**
 * RingSpinner - Smooth rotating ring
 */
interface RingSpinnerProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
}

export function RingSpinner({
  size = 40,
  strokeWidth = 4,
  className,
  color = 'stroke-black',
}: RingSpinnerProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      className={cn('animate-spin', className)}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={color}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: circumference * 0.75,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </svg>
  );
}

/**
 * PulseSpinner - Pulsing circle
 */
interface PulseSpinnerProps {
  size?: number;
  className?: string;
  color?: string;
}

export function PulseSpinner({ size = 40, className, color = 'bg-black' }: PulseSpinnerProps) {
  return (
    <motion.div
      className={cn('rounded-full', color, className)}
      style={{ width: size, height: size }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: [0.4, 0.0, 0.2, 1],
      }}
    />
  );
}

/**
 * BarsSpinner - Vertical bars animation
 */
interface BarsSpinnerProps {
  barCount?: number;
  size?: number;
  className?: string;
  color?: string;
}

export function BarsSpinner({
  barCount = 5,
  size = 40,
  className,
  color = 'bg-black',
}: BarsSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-1', className)} style={{ height: size }}>
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          className={cn('w-1 rounded-full', color)}
          style={{ height: size }}
          animate={{
            scaleY: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        />
      ))}
    </div>
  );
}

/**
 * OrbitSpinner - Orbiting dots
 */
interface OrbitSpinnerProps {
  size?: number;
  dotSize?: number;
  className?: string;
  color?: string;
}

export function OrbitSpinner({
  size = 40,
  dotSize = 8,
  className,
  color = 'bg-black',
}: OrbitSpinnerProps) {
  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn('absolute rounded-full', color)}
          style={{
            width: dotSize,
            height: dotSize,
            top: '50%',
            left: '50%',
          }}
          animate={{
            x: [0, size / 2 - dotSize / 2, 0, -(size / 2 - dotSize / 2), 0],
            y: [-(size / 2 - dotSize / 2), 0, size / 2 - dotSize / 2, 0, -(size / 2 - dotSize / 2)],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.4,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/**
 * SquareSpinner - Rotating square
 */
interface SquareSpinnerProps {
  size?: number;
  className?: string;
  color?: string;
}

export function SquareSpinner({ size = 40, className, color = 'border-black' }: SquareSpinnerProps) {
  return (
    <motion.div
      className={cn('border-4', color, className)}
      style={{ width: size, height: size }}
      animate={{
        rotate: 360,
        borderRadius: ['0%', '50%', '0%'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: [0.4, 0.0, 0.2, 1],
      }}
    />
  );
}

/**
 * WaveSpinner - Sine wave animation
 */
interface WaveSpinnerProps {
  barCount?: number;
  size?: number;
  className?: string;
  color?: string;
}

export function WaveSpinner({
  barCount = 8,
  size = 40,
  className,
  color = 'bg-black',
}: WaveSpinnerProps) {
  return (
    <div className={cn('flex items-end justify-center gap-0.5', className)} style={{ height: size }}>
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          className={cn('w-1 rounded-full', color)}
          animate={{
            height: [`${size * 0.2}px`, `${size}px`, `${size * 0.2}px`],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/**
 * LoadingScreen - Full-page loading overlay
 */
interface LoadingScreenProps {
  message?: string;
  spinner?: 'apple' | 'ring' | 'pulse' | 'bars';
  className?: string;
}

export function LoadingScreen({ message, spinner = 'apple', className }: LoadingScreenProps) {
  const spinners = {
    apple: <AppleSpinner size={40} />,
    ring: <RingSpinner size={40} />,
    pulse: <PulseSpinner size={40} />,
    bars: <BarsSpinner size={40} />,
  };

  return (
    <motion.div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-white/95 backdrop-blur-sm',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center gap-4">
        {spinners[spinner]}
        {message && (
          <motion.p
            className="text-sm text-gray-600 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

/**
 * ButtonSpinner - Inline button loading state
 */
interface ButtonSpinnerProps {
  size?: number;
  className?: string;
  variant?: 'light' | 'dark';
}

export function ButtonSpinner({ size = 16, className, variant = 'dark' }: ButtonSpinnerProps) {
  return (
    <AppleSpinner
      size={size}
      className={cn(variant === 'light' ? 'text-white' : 'text-black', className)}
    />
  );
}
