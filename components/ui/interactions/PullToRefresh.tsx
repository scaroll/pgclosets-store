/**
 * Pull to Refresh Component
 *
 * iOS-style pull-to-refresh interaction with smooth animations
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { PanInfo } from 'framer-motion';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * PullToRefresh - iOS-style pull-to-refresh interaction
 *
 * @example
 * <PullToRefresh onRefresh={async () => { await fetchData(); }}>
 *   <div>Your scrollable content</div>
 * </PullToRefresh>
 */
export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  disabled = false,
  className,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  // Transform values for animations
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const rotate = useTransform(y, [0, threshold], [0, 360]);
  const scale = useTransform(y, [0, threshold], [0.5, 1]);

  // Check if at top of container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsAtTop(container.scrollTop <= 0);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDragEnd = useCallback(
    async (_: any, info: PanInfo) => {
      if (disabled || !isAtTop) return;

      const offset = info.offset.y;

      if (offset > threshold && !isRefreshing) {
        setIsRefreshing(true);
        y.set(threshold);

        try {
          await onRefresh();
        } finally {
          y.set(0);
          setIsRefreshing(false);
        }
      } else {
        y.set(0);
      }
    },
    [disabled, isAtTop, threshold, isRefreshing, onRefresh, y]
  );

  return (
    <motion.div
      ref={containerRef}
      className={cn('relative overflow-auto h-full', className)}
      drag={!disabled && isAtTop ? 'y' : false}
      dragConstraints={{ top: 0, bottom: threshold }}
      dragElastic={{ top: 0.5, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ y }}
    >
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center"
        style={{
          height: threshold,
          opacity,
          marginTop: -threshold,
        }}
      >
        <motion.div style={{ scale, rotate }}>
          <RefreshCw
            className={cn(
              'w-6 h-6 text-gray-400',
              isRefreshing && 'animate-spin'
            )}
          />
        </motion.div>
      </motion.div>

      {children}
    </motion.div>
  );
}
