/**
 * DESIGN SYSTEM BUTTON COMPONENT
 * Luxury button component with multiple variants and sizes
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const baseClasses = 'ds-btn';

    const variantClasses = {
      primary: 'ds-btn-primary',
      secondary: 'ds-btn-secondary',
      accent: 'ds-btn-accent',
      ghost: 'ds-btn-ghost',
    };

    const sizeClasses = {
      sm: 'ds-btn-sm',
      md: '',
      lg: 'ds-btn-lg',
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
