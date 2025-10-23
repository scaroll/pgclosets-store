/**
 * Fancy UI Animation Components
 *
 * Simple animation components for PG Closets Apple-inspired design system
 */

'use client';

import React from 'react';

// Simple CSS-based Float animation component
type FloatProps = {
  children: React.ReactNode;
  className?: string;
};

export const Float: React.FC<FloatProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`animate-float ${className || ''}`}
      style={{
        animation: 'float 4s ease-in-out infinite',
      }}
    >
      {children}
    </div>
  );
};

// Simple CSS-based Breathing text component
type BreathingTextProps = {
  children: React.ReactNode;
  className?: string;
};

export const BreathingText: React.FC<BreathingTextProps> = ({
  children,
  className,
}) => {
  return (
    <span
      className={`animate-breathe inline-block ${className || ''}`}
      style={{
        animation: 'breathe 2s ease-in-out infinite',
      }}
    >
      {children}
    </span>
  );
};

// Configuration for Apple-style animations
export const ANIMATION_CONFIG = {
  // Subtle floating animations for product cards
  PRODUCT_FLOAT: {
    className: 'will-change-transform'
  },

  // Hero text breathing animation
  HERO_BREATHING: {
    className: ''
  },

  // Call-to-action text animation
  CTA_BREATHING: {
    className: ''
  }
};

// Helper component for floating product cards
export const FloatingProductCard = ({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => (
  <Float
    {...ANIMATION_CONFIG.PRODUCT_FLOAT}
    className={`transition-transform duration-300 hover:scale-105 ${className}`}
    {...props}
  >
    {children}
  </Float>
);

// Helper component for animated hero text
export const AnimatedHeroText = ({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => (
  <BreathingText
    {...ANIMATION_CONFIG.HERO_BREATHING}
    className={`font-display ${className}`}
    {...props}
  >
    {children}
  </BreathingText>
);

// Helper component for animated CTA text
export const AnimatedCTAText = ({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => (
  <BreathingText
    {...ANIMATION_CONFIG.CTA_BREATHING}
    className={`font-semibold ${className}`}
    {...props}
  >
    {children}
  </BreathingText>
  );

// TypeScript type exports
export type { FloatProps, BreathingTextProps };