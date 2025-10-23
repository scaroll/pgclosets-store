/**
 * Progress Indicators
 *
 * Apple-quality progress indicators with smooth animations
 * Linear, circular, and determinate/indeterminate variants
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * LinearProgress - Horizontal progress bar
 */
interface LinearProgressProps {
  value?: number; // 0-100 for determinate, undefined for indeterminate
  className?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function LinearProgress({
  value,
  className,
  color = 'primary',
  size = 'md',
  showLabel = false,
}: LinearProgressProps) {
  const isDeterminate = value !== undefined;

  const colors = {
    primary: 'bg-black',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden', sizes[size])}>
        {isDeterminate ? (
          <motion.div
            className={cn('h-full rounded-full', colors[color])}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1],
            }}
          />
        ) : (
          <motion.div
            className={cn('h-full rounded-full', colors[color])}
            style={{ width: '40%' }}
            animate={{
              x: ['-100%', '250%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: [0.4, 0.0, 0.2, 1],
            }}
          />
        )}
      </div>
      {showLabel && isDeterminate && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {Math.round(value)}%
        </div>
      )}
    </div>
  );
}

/**
 * CircularProgress - Circular progress indicator
 */
interface CircularProgressProps {
  value?: number; // 0-100 for determinate, undefined for indeterminate
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
}

export function CircularProgress({
  value,
  size = 40,
  strokeWidth = 4,
  className,
  color = 'primary',
  showLabel = false,
}: CircularProgressProps) {
  const isDeterminate = value !== undefined;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = isDeterminate
    ? circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference
    : 0;

  const colors = {
    primary: 'stroke-black',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    error: 'stroke-red-500',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={colors[color]}
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={
            isDeterminate
              ? { strokeDashoffset: offset }
              : {
                  strokeDashoffset: [circumference, 0],
                  rotate: [0, 360],
                }
          }
          transition={
            isDeterminate
              ? { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
              : { duration: 1.5, repeat: Infinity, ease: 'linear' }
          }
          style={{ strokeDasharray: circumference }}
        />
      </svg>

      {showLabel && isDeterminate && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">{Math.round(value)}%</span>
        </div>
      )}
    </div>
  );
}

/**
 * StepProgress - Multi-step progress indicator
 */
interface Step {
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

export function StepProgress({
  steps,
  currentStep,
  className,
  variant = 'horizontal',
}: StepProgressProps) {
  return (
    <div
      className={cn(
        'flex',
        variant === 'horizontal' ? 'flex-row items-center' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div
            key={index}
            className={cn(
              'flex items-center',
              variant === 'horizontal' && index < steps.length - 1 && 'flex-1'
            )}
          >
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <motion.div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-medium',
                  'transition-colors',
                  isCompleted && 'bg-black text-white',
                  isCurrent && 'bg-black text-white ring-4 ring-black/10',
                  isUpcoming && 'bg-gray-100 text-gray-400'
                )}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>

              {/* Label */}
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    'text-sm font-medium',
                    isCurrent && 'text-black',
                    !isCurrent && 'text-gray-500'
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-400 mt-0.5">{step.description}</div>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  variant === 'horizontal' ? 'flex-1 h-0.5 mx-4' : 'w-0.5 h-8 my-2 ml-5',
                  'bg-gray-100 relative overflow-hidden'
                )}
              >
                <motion.div
                  className="absolute inset-0 bg-black"
                  initial={{ [variant === 'horizontal' ? 'width' : 'height']: 0 }}
                  animate={{
                    [variant === 'horizontal' ? 'width' : 'height']:
                      index < currentStep ? '100%' : 0,
                  }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Skeleton loader with shimmer effect
 */
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  width?: number | string;
  height?: number | string;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  animation = 'wave',
  width,
  height,
}: SkeletonProps) {
  const variants = {
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-&lsqb;shimmer_2s_infinite&rsqb; before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
    none: '',
  };

  return (
    <div
      className={cn('bg-gray-200', variants[variant], animations[animation], className)}
      style={{ width, height }}
    />
  );
}

/**
 * Dots loader - Three animated dots
 */
interface DotsLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function DotsLoader({ size = 'md', color = 'bg-black', className }: DotsLoaderProps) {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn('rounded-full', sizes[size], color)}
          animate={{
            y: ['0%', '-50%', '0%'],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        />
      ))}
    </div>
  );
}
