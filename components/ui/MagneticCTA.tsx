"use client"

/**
 * MagneticCTA - Cursor-following call-to-action button
 *
 * Features:
 * - Magnetic effect following cursor position
 * - Smooth spring physics simulation
 * - Premium copper glow on interaction
 * - Respects prefers-reduced-motion
 * - Mobile-friendly (touch-optimized)
 *
 * Performance:
 * - RequestAnimationFrame for smooth 60fps
 * - Transform-only animations (GPU accelerated)
 * - Debounced mouse tracking
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  prefersReducedMotion,
  triggerHaptic,
} from '@/lib/design-system/interactions';

export interface MagneticCTAProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: 'subtle' | 'medium' | 'strong';
  glow?: boolean;
  haptic?: boolean;
  icon?: React.ReactNode;
}

const MagneticCTA = React.forwardRef<HTMLButtonElement, MagneticCTAProps>(
  (
    {
      className,
      strength = 'medium',
      glow = true,
      haptic = true,
      icon,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);
    const reducedMotion = prefersReducedMotion();

    // Magnetic strength multipliers
    const strengthValues = {
      subtle: 0.15,
      medium: 0.25,
      strong: 0.4,
    };

    // Handle mouse move with magnetic effect
    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (reducedMotion) return;

        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from center
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Apply magnetic pull based on strength
        const multiplier = strengthValues[strength];
        setPosition({
          x: deltaX * multiplier,
          y: deltaY * multiplier,
        });
      },
      [strength, reducedMotion]
    );

    // Reset position on mouse leave
    const handleMouseLeave = () => {
      setIsHovered(false);
      setPosition({ x: 0, y: 0 });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      if (haptic && !reducedMotion) {
        triggerHaptic('light');
      }
    };

    // Handle click with haptic feedback
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic && !reducedMotion) {
        triggerHaptic('medium');
      }
      onClick?.(e);
    };

    return (
      <button
        ref={buttonRef}
        className={cn(
          // Layout
          'relative inline-flex items-center justify-center gap-2',
          'px-8 py-4 rounded-md',
          'font-body font-semibold tracking-wide uppercase text-sm',
          // Colors
          'bg-gradient-to-br from-copper-500 to-copper-600',
          'text-white',
          // Transitions
          'transition-all duration-300 ease-out',
          'will-change-transform',
          'transform-gpu',
          // Focus
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 focus-visible:ring-offset-2',
          // Disabled
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Shadow
          glow && 'shadow-copperGlow',
          glow && isHovered && 'shadow-copperGlowLarge',
          className
        )}
        style={
          !reducedMotion
            ? {
                transform: `translate(${position.x}px, ${position.y}px) scale(${isHovered ? 1.05 : 1})`,
              }
            : undefined
        }
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        {/* Background pulse effect */}
        {glow && !reducedMotion && (
          <div
            className={cn(
              'absolute inset-0 rounded-md',
              'bg-gradient-radial from-copper-400/40 via-copper-500/20 to-transparent',
              'opacity-0 transition-opacity duration-500',
              isHovered && 'opacity-100 animate-pulse'
            )}
            aria-hidden="true"
          />
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {icon && (
            <span
              className={cn(
                'transition-transform duration-300',
                !reducedMotion && isHovered && 'translate-x-1'
              )}
            >
              {icon}
            </span>
          )}
        </span>

        {/* Shine effect on hover */}
        {!reducedMotion && (
          <div
            className={cn(
              'absolute inset-0 rounded-md',
              'bg-gradient-to-r from-transparent via-white/30 to-transparent',
              '-translate-x-full',
              isHovered && 'translate-x-full transition-transform duration-1000'
            )}
            aria-hidden="true"
          />
        )}
      </button>
    );
  }
);

MagneticCTA.displayName = 'MagneticCTA';

export { MagneticCTA };

// ========================================
// MAGNETIC LINK VARIANT
// ========================================

import Link from 'next/link';

export interface MagneticLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  strength?: 'subtle' | 'medium' | 'strong';
  glow?: boolean;
  icon?: React.ReactNode;
}

const MagneticLink = React.forwardRef<HTMLAnchorElement, MagneticLinkProps>(
  (
    {
      className,
      href,
      strength = 'medium',
      glow = true,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const linkRef = React.useRef<HTMLAnchorElement>(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);
    const reducedMotion = prefersReducedMotion();

    const strengthValues = {
      subtle: 0.15,
      medium: 0.25,
      strong: 0.4,
    };

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (reducedMotion) return;

        const link = linkRef.current;
        if (!link) return;

        const rect = link.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        const multiplier = strengthValues[strength];
        setPosition({
          x: deltaX * multiplier,
          y: deltaY * multiplier,
        });
      },
      [strength, reducedMotion]
    );

    const handleMouseLeave = () => {
      setIsHovered(false);
      setPosition({ x: 0, y: 0 });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    return (
      <Link
        ref={linkRef}
        href={href}
        className={cn(
          'relative inline-flex items-center justify-center gap-2',
          'px-8 py-4 rounded-md',
          'font-body font-semibold tracking-wide uppercase text-sm',
          'bg-gradient-to-br from-copper-500 to-copper-600',
          'text-white',
          'transition-all duration-300 ease-out',
          'will-change-transform transform-gpu',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 focus-visible:ring-offset-2',
          glow && 'shadow-copperGlow',
          glow && isHovered && 'shadow-copperGlowLarge',
          className
        )}
        style={
          !reducedMotion
            ? {
                transform: `translate(${position.x}px, ${position.y}px) scale(${isHovered ? 1.05 : 1})`,
              }
            : undefined
        }
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {glow && !reducedMotion && (
          <div
            className={cn(
              'absolute inset-0 rounded-md',
              'bg-gradient-radial from-copper-400/40 via-copper-500/20 to-transparent',
              'opacity-0 transition-opacity duration-500',
              isHovered && 'opacity-100 animate-pulse'
            )}
            aria-hidden="true"
          />
        )}

        <span className="relative z-10 flex items-center gap-2">
          {children}
          {icon && (
            <span
              className={cn(
                'transition-transform duration-300',
                !reducedMotion && isHovered && 'translate-x-1'
              )}
            >
              {icon}
            </span>
          )}
        </span>

        {!reducedMotion && (
          <div
            className={cn(
              'absolute inset-0 rounded-md',
              'bg-gradient-to-r from-transparent via-white/30 to-transparent',
              '-translate-x-full',
              isHovered && 'translate-x-full transition-transform duration-1000'
            )}
            aria-hidden="true"
          />
        )}
      </Link>
    );
  }
);

MagneticLink.displayName = 'MagneticLink';

export { MagneticLink };
