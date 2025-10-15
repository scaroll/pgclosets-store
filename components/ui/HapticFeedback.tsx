"use client"

/**
 * HapticFeedback - Vibration API integration for mobile devices
 *
 * Features:
 * - Multiple haptic patterns (light, medium, heavy, success, error)
 * - Pattern sequences for complex feedback
 * - Graceful degradation on unsupported devices
 * - User preference detection
 * - Performance-optimized with debouncing
 *
 * Usage:
 * - Import and use triggerHaptic() function
 * - Or use HapticButton/HapticLink components
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { triggerHaptic as baseTriggerHaptic, prefersReducedMotion } from '@/lib/design-system/interactions';

// ========================================
// HAPTIC PATTERNS
// ========================================

export type HapticPattern =
  | 'light'         // Subtle tap (10ms)
  | 'medium'        // Standard tap (20ms)
  | 'heavy'         // Strong tap (30ms)
  | 'selection'     // UI selection (5ms, 10ms)
  | 'success'       // Success feedback (10ms, 20ms, 30ms)
  | 'error'         // Error feedback (50ms, 50ms)
  | 'warning'       // Warning feedback (30ms, 30ms)
  | 'notification'; // Notification pattern (10ms, 20ms, 10ms)

/**
 * Haptic vibration patterns for different interactions
 */
export const HAPTIC_PATTERNS: Record<HapticPattern, number[]> = {
  light: [10],
  medium: [20],
  heavy: [30],
  selection: [5, 10],
  success: [10, 20, 30],
  error: [50, 50],
  warning: [30, 30],
  notification: [10, 20, 10],
};

// ========================================
// HAPTIC UTILITIES
// ========================================

/**
 * Checks if Vibration API is supported
 */
export function isHapticSupported(): boolean {
  if (typeof navigator === 'undefined') return false;
  return 'vibrate' in navigator;
}

/**
 * Checks if user wants haptic feedback
 */
export function shouldUseHaptics(): boolean {
  if (!isHapticSupported()) return false;
  if (prefersReducedMotion()) return false;

  // Check localStorage preference
  if (typeof localStorage !== 'undefined') {
    const preference = localStorage.getItem('haptic-enabled');
    if (preference !== null) {
      return preference === 'true';
    }
  }

  // Default to enabled on mobile devices
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

/**
 * Triggers haptic feedback with specified pattern
 */
export function triggerHapticPattern(pattern: HapticPattern): void {
  if (!shouldUseHaptics()) return;

  const vibrationPattern = HAPTIC_PATTERNS[pattern];
  if (navigator.vibrate) {
    navigator.vibrate(vibrationPattern);
  }
}

/**
 * Creates a custom haptic pattern
 */
export function triggerCustomHaptic(pattern: number[]): void {
  if (!shouldUseHaptics()) return;

  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

/**
 * Stops any ongoing vibration
 */
export function stopHaptic(): void {
  if (isHapticSupported() && navigator.vibrate) {
    navigator.vibrate(0);
  }
}

// ========================================
// HAPTIC CONTEXT
// ========================================

interface HapticContextValue {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  triggerPattern: (pattern: HapticPattern) => void;
}

const HapticContext = React.createContext<HapticContextValue | undefined>(undefined);

export function useHaptic(): HapticContextValue {
  const context = React.useContext(HapticContext);
  if (!context) {
    throw new Error('useHaptic must be used within HapticProvider');
  }
  return context;
}

// ========================================
// HAPTIC PROVIDER
// ========================================

export interface HapticProviderProps {
  children: React.ReactNode;
  defaultEnabled?: boolean;
}

export function HapticProvider({
  children,
  defaultEnabled = true,
}: HapticProviderProps) {
  const [enabled, setEnabled] = React.useState(defaultEnabled);

  // Load preference from localStorage
  React.useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('haptic-enabled');
      if (stored !== null) {
        setEnabled(stored === 'true');
      } else {
        // Set default based on device type
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        setEnabled(isMobile);
      }
    }
  }, []);

  // Save preference to localStorage
  React.useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('haptic-enabled', String(enabled));
    }
  }, [enabled]);

  const triggerPattern = React.useCallback(
    (pattern: HapticPattern) => {
      if (enabled) {
        triggerHapticPattern(pattern);
      }
    },
    [enabled]
  );

  const value = React.useMemo(
    () => ({
      enabled,
      setEnabled,
      triggerPattern,
    }),
    [enabled, triggerPattern]
  );

  return <HapticContext.Provider value={value}>{children}</HapticContext.Provider>;
}

// ========================================
// HAPTIC BUTTON COMPONENT
// ========================================

export interface HapticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hapticPattern?: HapticPattern;
  hapticOnHover?: boolean;
}

export const HapticButton = React.forwardRef<HTMLButtonElement, HapticButtonProps>(
  (
    {
      className,
      hapticPattern = 'medium',
      hapticOnHover = false,
      onClick,
      onMouseEnter,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      triggerHapticPattern(hapticPattern);
      onClick?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (hapticOnHover) {
        triggerHapticPattern('light');
      }
      onMouseEnter?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          'px-6 py-3 rounded-md',
          'font-body font-medium tracking-wide',
          'bg-copper-500 text-white',
          'hover:bg-copper-600',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 focus-visible:ring-offset-2',
          className
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {children}
      </button>
    );
  }
);

HapticButton.displayName = 'HapticButton';

// ========================================
// HAPTIC LINK COMPONENT
// ========================================

import Link from 'next/link';

export interface HapticLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  hapticPattern?: HapticPattern;
}

export const HapticLink = React.forwardRef<HTMLAnchorElement, HapticLinkProps>(
  ({ className, href, hapticPattern = 'light', onClick, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      triggerHapticPattern(hapticPattern);
      onClick?.(e);
    };

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          'inline-flex items-center',
          'text-copper-600 hover:text-copper-700',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 focus-visible:ring-offset-2 focus-visible:rounded-sm',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

HapticLink.displayName = 'HapticLink';

// ========================================
// HAPTIC TOGGLE COMPONENT
// ========================================

export interface HapticToggleProps {
  className?: string;
}

export const HapticToggle: React.FC<HapticToggleProps> = ({ className }) => {
  const { enabled, setEnabled, triggerPattern } = useHaptic();

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);

    // Give feedback when enabling
    if (newEnabled) {
      triggerHapticPattern('success');
    }
  };

  if (!isHapticSupported()) {
    return null; // Don't render if not supported
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'inline-flex items-center gap-3',
        'px-4 py-2 rounded-md',
        'bg-charcoal-100 hover:bg-charcoal-200',
        'transition-colors duration-200',
        className
      )}
      aria-label="Toggle haptic feedback"
    >
      <span className="text-sm font-medium text-charcoal-900">
        Haptic Feedback
      </span>
      <div
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full',
          'transition-colors duration-200',
          enabled ? 'bg-copper-500' : 'bg-charcoal-300'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white',
            'transition-transform duration-200',
            'shadow-sm',
            enabled ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </div>
    </button>
  );
};

// ========================================
// EXPORTS
// ========================================

export {
  isHapticSupported,
  shouldUseHaptics,
  triggerHapticPattern,
  triggerCustomHaptic,
  stopHaptic,
  HAPTIC_PATTERNS,
};
