// @ts-nocheck
/**
 * Stats Section Component - Statistics display with Apple design system
 *
 * Features:
 * - Animated counting numbers
 * - Label and optional icon
 * - Grid layout support
 * - Scroll-triggered animations
 * - Dark mode optimized
 *
 * @example
 * <StatsSection
 *   stats={[
 *     { value: 10000, label: "Happy Customers", suffix: "+" },
 *     { value: 25, label: "Years Experience" },
 *     { value: 98, label: "Satisfaction Rate", suffix: "%" }
 *   ]}
 * />
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface Stat {
  /**
   * The numeric value to display
   */
  value: number;
  /**
   * Label describing the stat
   */
  label: string;
  /**
   * Optional icon element
   */
  icon?: React.ReactNode;
  /**
   * Optional prefix (e.g., "$")
   */
  prefix?: string;
  /**
   * Optional suffix (e.g., "+", "%")
   */
  suffix?: string;
}

export interface StatsSectionProps {
  /**
   * Array of statistics to display
   */
  stats: Stat[];
  /**
   * Grid columns layout
   */
  columns?: 2 | 3 | 4;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Counter component with animation
 */
function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const counterRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  React.useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={counterRef} className="text-5xl md:text-6xl font-bold tracking-tight">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

/**
 * Stats Section component for displaying statistics
 */
export function StatsSection({
  stats,
  columns = 3,
  className,
}: StatsSectionProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('grid gap-8 md:gap-12', gridCols[columns])}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              'text-center p-6 rounded-2xl',
              'bg-card dark:bg-apple-dark-bg-secondary',
              'transition-all duration-300',
              'hover:shadow-lg hover:-translate-y-1'
            )}
          >
            {stat.icon && (
              <div className="flex justify-center mb-4 text-primary">
                {stat.icon}
              </div>
            )}
            <AnimatedCounter
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
            <p className="mt-3 text-lg font-medium text-muted-foreground dark:text-apple-dark-text-secondary">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

StatsSection.displayName = 'StatsSection';
