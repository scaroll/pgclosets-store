import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * Button Component - PG Closets Design System
 *
 * Unified button component following the luxury black/white aesthetic.
 * Eliminates inconsistencies from legacy button styles.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium tracking-wide uppercase
      border-2 transition-all duration-300
      focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-black focus-visible:ring-offset-3
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
      relative overflow-hidden
    `;

    const variantStyles = {
      primary: `
        bg-black text-white border-black
        hover:bg-white hover:text-black hover:shadow-lg hover:-translate-y-1
        active:translate-y-0
      `,
      secondary: `
        bg-white text-black border-black
        hover:bg-black hover:text-white hover:shadow-lg hover:-translate-y-1
        active:translate-y-0
      `,
      ghost: `
        bg-transparent text-black border-transparent
        hover:bg-neutral-50 hover:border-neutral-200
      `,
    };

    const sizeStyles = {
      sm: 'h-8 px-4 text-xs min-w-16',
      md: 'h-10 px-6 text-sm min-w-24',
      lg: 'h-12 px-8 text-base min-w-32',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
