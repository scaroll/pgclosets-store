import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'success' | 'warning' | 'error';
  className?: string;
}

/**
 * Badge Component - PG Closets Design System
 *
 * Unified badge component for labels, tags, and status indicators.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    px-3 py-1 text-xs font-semibold tracking-wider uppercase
    border transition-all duration-300
  `;

  const variantStyles = {
    default: `
      bg-white text-black border-black/20
      hover:bg-black hover:text-white hover:border-black
    `,
    premium: `
      bg-black text-white border-black
      shadow-sm
    `,
    success: `
      bg-green-50 text-green-800 border-green-200
      hover:bg-green-100
    `,
    warning: `
      bg-amber-50 text-amber-800 border-amber-200
      hover:bg-amber-100
    `,
    error: `
      bg-red-50 text-red-800 border-red-200
      hover:bg-red-100
    `,
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)}>
      {children}
    </span>
  );
};
