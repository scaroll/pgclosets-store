'use client';

/**
 * Pull-to-Refresh Component
 * Native-like pull-to-refresh functionality for mobile
 *
 * @module components/mobile/PullToRefresh
 * @agent Agent #15 - Mobile Experience & PWA
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { HapticFeedback } from '@/lib/mobile/gestures';

export interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
  pullThreshold?: number; // Distance to trigger refresh (default: 80)
  maxPull?: number; // Maximum pull distance (default: 150)
  resistance?: number; // Pull resistance factor (default: 2.5)
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
  pullThreshold = 80,
  maxPull = 150,
  resistance = 2.5,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isPulling = useRef(false);

  // Check if we can pull (only when scrolled to top)
  const checkCanPull = useCallback(() => {
    if (containerRef.current) {
      const canPullNow = containerRef.current.scrollTop === 0;
      setCanPull(canPullNow);
      return canPullNow;
    }
    return false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkCanPull);
    return () => container.removeEventListener('scroll', checkCanPull);
  }, [checkCanPull]);

  // Handle touch start
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!checkCanPull() || isRefreshing) return;

      startY.current = e.touches[0].clientY;
      isPulling.current = false;
    },
    [checkCanPull, isRefreshing]
  );

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!canPull || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      if (deltaY > 0) {
        isPulling.current = true;

        // Apply resistance
        const distance = Math.min(deltaY / resistance, maxPull);
        setPullDistance(distance);

        // Trigger haptic at threshold
        if (distance >= pullThreshold && pullDistance < pullThreshold) {
          HapticFeedback.trigger('light');
        }

        // Prevent default scroll
        if (distance > 10) {
          e.preventDefault();
        }
      }
    },
    [canPull, isRefreshing, pullThreshold, maxPull, resistance, pullDistance]
  );

  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current || isRefreshing) {
      setPullDistance(0);
      return;
    }

    isPulling.current = false;

    if (pullDistance >= pullThreshold) {
      // Trigger refresh
      setIsRefreshing(true);
      HapticFeedback.trigger('medium');

      try {
        await onRefresh();
        HapticFeedback.trigger('success');
      } catch (error) {
        console.error('Refresh failed:', error);
        HapticFeedback.trigger('error');
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Not enough pull, animate back
      setPullDistance(0);
    }
  }, [pullDistance, pullThreshold, isRefreshing, onRefresh]);

  // Calculate rotation for spinner
  const spinnerRotation = Math.min((pullDistance / pullThreshold) * 360, 360);
  const isOverThreshold = pullDistance >= pullThreshold;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={cn('relative overflow-auto h-full', className)}
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-10"
        style={{
          height: `${pullDistance}px`,
          transition: isRefreshing || !isPulling.current ? 'height 0.3s ease-out' : 'none',
        }}
      >
        {(pullDistance > 0 || isRefreshing) && (
          <div
            className={cn(
              'flex items-center justify-center w-12 h-12 rounded-full transition-all',
              isOverThreshold || isRefreshing ? 'bg-blue-600' : 'bg-gray-300'
            )}
            style={{
              transform: `scale(${Math.min(pullDistance / pullThreshold, 1)})`,
              transition: 'transform 0.2s ease-out, background-color 0.2s ease-out',
            }}
          >
            {isRefreshing ? (
              // Spinning loader
              <svg
                className="animate-spin"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeOpacity="0.3"
                />
                <path
                  d="M12 2 A10 10 0 0 1 22 12"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              // Arrow that rotates based on pull distance
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isOverThreshold ? 'white' : 'currentColor'}
                strokeWidth="2"
                style={{
                  transform: `rotate(${spinnerRotation}deg)`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <polyline points="12 5 12 19" />
                <polyline points="5 12 12 19 19 12" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          transform: isRefreshing
            ? `translateY(60px)`
            : `translateY(${pullDistance}px)`,
          transition: isRefreshing || !isPulling.current ? 'transform 0.3s ease-out' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
