import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card Component - PG Closets Design System
 *
 * Unified card component with consistent styling.
 * Features subtle borders, elegant hover states, and luxury aesthetic.
 */
export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = true,
  padding = 'md'
}) => {
  const baseStyles = `
    bg-white border border-black/10
    transition-all duration-700
    relative overflow-hidden
  `;

  const hoverStyles = hover ? `
    hover:-translate-y-1 hover:shadow-2xl hover:border-black/20
    before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5
    before:bg-black before:-translate-x-full before:transition-transform before:duration-700
    hover:before:translate-x-0
  ` : '';

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        baseStyles,
        hoverStyles,
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardImage: React.FC<{
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
}> = ({ src, alt, aspectRatio = '4/3', className }) => {
  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{ aspectRatio }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
      />
    </div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <h3 className={cn('text-xl font-light tracking-wide text-black', className)}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <p className={cn('text-sm text-neutral-600 leading-relaxed', className)}>
      {children}
    </p>
  );
};
