/**
 * DESIGN SYSTEM CARD COMPONENT
 * Luxury card component with hover effects and variants
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantClasses = {
      default: 'ds-card',
      elevated: 'ds-card ds-card-elevated',
    };

    return (
      <div
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardImage = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('ds-card-image', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardImage.displayName = 'CardImage';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' }>(
  ({ className, size = 'md', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'ds-card-content-sm',
      md: 'ds-card-content',
      lg: 'ds-card-content-lg',
    };

    return (
      <div
        ref={ref}
        className={cn(sizeClasses[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export { Card, CardImage, CardContent };
