'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/* =============================================================================
   LOADING STATES COMPONENT - WCAG COMPLIANT LOADING INDICATORS
   ============================================================================= */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}

interface PulseLoaderProps {
  className?: string;
  label?: string;
}

/* =============================================================================
   LOADING SPINNER COMPONENT
   ============================================================================= */

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  label = 'Loading content, please wait'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
    xl: 'w-12 h-12 border-4'
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        className
      )}
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      <div
        className={cn(
          'animate-spin rounded-full border-gray-200 border-t-blue-600',
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

/* =============================================================================
   SKELETON LOADER COMPONENT
   ============================================================================= */

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className,
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    card: 'rounded-lg'
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} aria-hidden="true">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 ? 'w-3/4' : 'w-full' // Last line is shorter
            )}
            style={index === 0 ? style : undefined}
          />
        ))}
        <span className="sr-only">Loading content</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
      aria-hidden="true"
    >
      <span className="sr-only">Loading content</span>
    </div>
  );
};

/* =============================================================================
   SKELETON CARD COMPONENT
   ============================================================================= */

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  showActions?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className,
  showImage = true,
  showActions = true
}) => {
  return (
    <div
      className={cn(
        'p-4 border border-gray-200 rounded-lg space-y-4',
        className
      )}
      role="status"
      aria-label="Loading product information"
    >
      {showImage && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="200px"
          className="w-full"
        />
      )}

      <div className="space-y-2">
        <Skeleton variant="text" width="75%" height="20px" />
        <Skeleton variant="text" width="50%" height="16px" />
        <Skeleton variant="text" lines={2} height="14px" />
      </div>

      {showActions && (
        <div className="flex gap-2 pt-2">
          <Skeleton variant="rectangular" width="100px" height="36px" />
          <Skeleton variant="rectangular" width="80px" height="36px" />
        </div>
      )}

      <span className="sr-only">Loading product information, please wait</span>
    </div>
  );
};

/* =============================================================================
   SKELETON LIST COMPONENT
   ============================================================================= */

interface SkeletonListProps {
  items?: number;
  className?: string;
  itemHeight?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  items = 5,
  className,
  itemHeight = '60px'
}) => {
  return (
    <div
      className={cn('space-y-3', className)}
      role="status"
      aria-label={`Loading list of ${items} items`}
    >
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Skeleton variant="circular" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="80%" height="16px" />
            <Skeleton variant="text" width="60%" height="14px" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading list content, please wait</span>
    </div>
  );
};

/* =============================================================================
   PULSE LOADER COMPONENT
   ============================================================================= */

export const PulseLoader: React.FC<PulseLoaderProps> = ({
  className,
  label = 'Processing, please wait'
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center space-x-2',
        className
      )}
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1.4s'
          }}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
};

/* =============================================================================
   PROGRESS BAR COMPONENT
   ============================================================================= */

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  label = 'Progress',
  showPercentage = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
          )}
        </div>
      )}

      <div
        className="w-full bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={`${label}: ${value} of ${max}`}
      >
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

/* =============================================================================
   LOADING OVERLAY COMPONENT
   ============================================================================= */

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
  transparent?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading, please wait',
  className,
  transparent = false
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        transparent ? 'bg-black/30' : 'bg-white/90',
        className
      )}
      role="status"
      aria-label={message}
      aria-live="assertive"
    >
      <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg">
        <LoadingSpinner size="lg" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

/* =============================================================================
   BUTTON LOADING STATE
   ============================================================================= */

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText = 'Loading...',
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors duration-200',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      aria-label={isLoading ? loadingText : undefined}
    >
      {isLoading && (
        <LoadingSpinner
          size="sm"
          className="mr-2"
          label=""
        />
      )}
      <span>{isLoading ? loadingText : children}</span>
    </button>
  );
};

/* =============================================================================
   LOADING STATES CONTAINER
   ============================================================================= */

interface LoadingStatesProps {
  variant: 'spinner' | 'skeleton' | 'pulse' | 'cards' | 'list';
  className?: string;
  label?: string;
  items?: number;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  variant,
  className,
  label,
  items = 3
}) => {
  const components = {
    spinner: <LoadingSpinner label={label} />,
    skeleton: <Skeleton variant="text" lines={3} />,
    pulse: <PulseLoader label={label} />,
    cards: (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: items }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    ),
    list: <SkeletonList items={items} />
  };

  return (
    <div className={cn('w-full', className)}>
      {components[variant]}
    </div>
  );
};

export default LoadingStates;