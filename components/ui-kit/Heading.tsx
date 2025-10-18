import React from 'react';
import { cn } from '@/lib/utils';

export interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  balance?: boolean;
}

/**
 * Heading Component - PG Closets Design System
 *
 * Unified heading component with consistent typography scale.
 * Uses light weights and wide tracking for luxury aesthetic.
 */
export const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  className,
  balance = false
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const styles = {
    1: 'text-5xl lg:text-6xl font-light leading-tight tracking-tight text-black',
    2: 'text-4xl lg:text-5xl font-light leading-snug tracking-tight text-black',
    3: 'text-3xl lg:text-4xl font-normal leading-snug tracking-normal text-black',
    4: 'text-2xl lg:text-3xl font-normal leading-normal tracking-normal text-black',
    5: 'text-xl lg:text-2xl font-medium leading-normal tracking-wide text-neutral-800',
    6: 'text-lg lg:text-xl font-semibold leading-normal tracking-wide text-neutral-800 uppercase',
  };

  return (
    <Tag
      className={cn(
        styles[level],
        balance && 'text-balance',
        className
      )}
    >
      {children}
    </Tag>
  );
};
