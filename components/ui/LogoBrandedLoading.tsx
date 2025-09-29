'use client';

import React from 'react';
import { LogoLoadingStates } from '@/components/brand/LogoLoadingStates';
import { ResponsiveLogoVariants } from '@/components/brand/ResponsiveLogoVariants';
import { trackLogoInteraction, trackLogoPerformance } from '@/lib/analytics/logo-tracking';

interface LogoBrandedLoadingProps {
  variant?: 'page' | 'section' | 'component' | 'overlay';
  loadingType?: 'luxury' | 'skeleton' | 'pulse' | 'shimmer' | 'dots';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  timeout?: number;
  onTimeout?: () => void;
  className?: string;
  showProgress?: boolean;
  progress?: number;
}

/**
 * LogoBrandedLoading Component
 *
 * Comprehensive loading component that integrates PG Closets branding
 * with various loading states and analytics tracking.
 */
export function LogoBrandedLoading({
  variant = 'component',
  loadingType = 'luxury',
  message = 'Loading your personalized experience...',
  size = 'md',
  timeout = 15000,
  onTimeout,
  className = '',
  showProgress = false,
  progress = 0
}: LogoBrandedLoadingProps) {
  const [startTime] = React.useState(Date.now());
  const [hasTimedOut, setHasTimedOut] = React.useState(false);

  React.useEffect(() => {
    // Track loading start
    trackLogoInteraction({
      event: 'loading_start',
      logo_type: 'loading',
      interaction_type: 'view',
      page_location: typeof window !== 'undefined' ? window.location.pathname : '/',
      user_journey_stage: 'consideration',
      conversion_context: `${variant}_loading`
    });

    // Set up timeout
    const timeoutId = setTimeout(() => {
      const loadTime = Date.now() - startTime;

      setHasTimedOut(true);

      // Track loading performance
      trackLogoPerformance('loading_timeout', loadTime, false);

      if (onTimeout) {
        onTimeout();
      }
    }, timeout);

    return () => {
      clearTimeout(timeoutId);

      // Track successful loading completion
      if (!hasTimedOut) {
        const loadTime = Date.now() - startTime;
        trackLogoPerformance('loading_complete', loadTime, true);
      }
    };
  }, [startTime, timeout, onTimeout, hasTimedOut, variant]);

  // Page-level loading overlay
  if (variant === 'page' || variant === 'overlay') {
    return (
      <div className={`fixed inset-0 z-50 bg-white/95 backdrop-blur-sm ${className}`}>
        <div className="min-h-screen flex flex-col items-center justify-center">
          {/* Logo loading animation */}
          <div className="mb-8">
            <LogoLoadingStates
              variant={loadingType}
              size={size}
              timeout={timeout}
              onTimeout={onTimeout}
            />
          </div>

          {/* Loading message */}
          <div className="text-center max-w-md mx-auto px-4">
            <h2 className="text-xl font-light text-slate-900 mb-4 tracking-wide">
              {hasTimedOut ? 'Taking longer than expected...' : message}
            </h2>

            {showProgress && (
              <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-slate-900 to-slate-700 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            )}

            <p className="text-sm text-slate-600 font-light">
              {hasTimedOut
                ? 'Please check your connection and try again'
                : 'Preparing your premium closet experience'
              }
            </p>
          </div>

          {/* Subtle brand pattern */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
            <div className="absolute inset-0 bg-repeat" style={{
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" opacity="0.1"><circle cx="20" cy="20" r="2"/></g></svg>')}")`,
              backgroundSize: '40px 40px'
            }} />
          </div>
        </div>
      </div>
    );
  }

  // Section-level loading
  if (variant === 'section') {
    return (
      <div className={`relative py-20 bg-gray-50 ${className}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <LogoLoadingStates
              variant={loadingType}
              size={size}
              timeout={timeout}
              onTimeout={onTimeout}
            />
          </div>
          <p className="text-slate-600 font-light">
            {hasTimedOut ? 'Loading timeout' : message}
          </p>
        </div>
      </div>
    );
  }

  // Component-level loading
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="mb-4">
        <LogoLoadingStates
          variant={loadingType}
          size={size}
          timeout={timeout}
          onTimeout={onTimeout}
        />
      </div>
      <p className="text-sm text-slate-600 font-light text-center">
        {hasTimedOut ? 'Loading timeout' : message}
      </p>
    </div>
  );
}

/**
 * Logo Skeleton Component
 *
 * Branded skeleton loader for product cards and content areas
 */
interface LogoSkeletonProps {
  type?: 'card' | 'list' | 'grid' | 'text';
  count?: number;
  className?: string;
}

export function LogoSkeleton({
  type = 'card',
  count = 1,
  className = ''
}: LogoSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {/* Image skeleton with logo watermark */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
              <div className="absolute bottom-2 right-2 opacity-20">
                <ResponsiveLogoVariants
                  variant="compact"
                  width={32}
                  height={6}
                  className="filter blur-[0.5px]"
                />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
              <div className="flex gap-2 pt-2">
                <div className="flex-1 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                <div className="w-20 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/5 animate-pulse" />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {type === 'grid' ? renderSkeleton() : (
        <>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className={i > 0 ? 'mt-4' : ''}>
              {renderSkeleton()}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/**
 * Usage Examples:
 *
 * // Full-page loading
 * <LogoBrandedLoading variant="page" loadingType="luxury" />
 *
 * // Section loading
 * <LogoBrandedLoading
 *   variant="section"
 *   message="Loading products..."
 *   showProgress={true}
 *   progress={65}
 * />
 *
 * // Product card skeletons
 * <LogoSkeleton type="card" count={4} />
 *
 * // List skeletons
 * <LogoSkeleton type="list" count={5} />
 */