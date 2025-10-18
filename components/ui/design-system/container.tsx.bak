/**
 * DESIGN SYSTEM CONTAINER & GRID COMPONENTS
 * Responsive layout system with luxury spacing
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

// Container Component
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('ds-container', className)} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

// Grid Component
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns = 3, children, ...props }, ref) => {
    const gridClasses = {
      2: 'ds-grid ds-grid-2',
      3: 'ds-grid ds-grid-3',
      4: 'ds-grid ds-grid-4',
    };

    return (
      <div ref={ref} className={cn(gridClasses[columns], className)} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

// Section Component
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  as?: React.ElementType;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, size = 'md', as: Component = 'section', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'ds-section-sm',
      md: 'ds-section',
      lg: 'ds-section-lg',
    };

    return (
      <Component ref={ref} className={cn(sizeClasses[size], className)} {...props}>
        {children}
      </Component>
    );
  }
);

Section.displayName = 'Section';
