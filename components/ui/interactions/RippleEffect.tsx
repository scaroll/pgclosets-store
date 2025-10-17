/**
 * Ripple Effect Component
 *
 * Material Design-inspired ripple effect for interactive elements
 * Apple-quality refinement with smooth, subtle animations
 */

'use client';

import type { MouseEvent } from 'react';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Ripple {
  x: number;
  y: number;
  id: number;
}

interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
  duration?: number;
  disabled?: boolean;
}

/**
 * RippleEffect - Adds a subtle ripple animation on click
 *
 * @example
 * <RippleEffect>
 *   <button>Click me</button>
 * </RippleEffect>
 */
export function RippleEffect({
  children,
  className,
  rippleColor = 'rgba(0, 0, 0, 0.1)',
  duration = 600,
  disabled = false,
}: RippleEffectProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);

      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, duration);
    },
    [disabled, duration]
  );

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseDown={addRipple}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: rippleColor,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * RippleButton - Pre-configured button with ripple effect
 */
interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function RippleButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: RippleButtonProps) {
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <RippleEffect
      disabled={disabled}
      rippleColor={variant === 'primary' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)'}
    >
      <button
        className={cn(
          'rounded-lg font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    </RippleEffect>
  );
}
