/**
 * Haptic Feedback Utilities
 *
 * Simulates haptic feedback through visual and audio cues
 * Provides tactile-like feedback for web interactions
 */

'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * Haptic feedback types matching iOS patterns
 */
export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

interface HapticConfig {
  scale: number;
  duration: number;
  vibration?: number[];
}

const hapticConfigs: Record<HapticType, HapticConfig> = {
  light: { scale: 0.98, duration: 50, vibration: [10] },
  medium: { scale: 0.96, duration: 75, vibration: [20] },
  heavy: { scale: 0.94, duration: 100, vibration: [30] },
  success: { scale: 0.96, duration: 100, vibration: [10, 50, 10] },
  warning: { scale: 0.96, duration: 100, vibration: [20, 30, 20] },
  error: { scale: 0.94, duration: 150, vibration: [30, 50, 30] },
  selection: { scale: 0.99, duration: 30, vibration: [5] },
};

/**
 * Hook for triggering haptic feedback
 */
export function useHaptic() {
  const trigger = useCallback((type: HapticType = 'light') => {
    const config = hapticConfigs[type];

    // Trigger vibration if supported
    if ('vibrate' in navigator && config.vibration) {
      navigator.vibrate(config.vibration);
    }

    // Optional: Play a subtle sound
    // playHapticSound(type);
  }, []);

  return { trigger };
}

/**
 * HapticButton - Button with haptic feedback on press
 */
interface HapticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hapticType?: HapticType;
  children: React.ReactNode;
}

export function HapticButton({
  hapticType = 'light',
  children,
  onClick,
  className,
  ...props
}: HapticButtonProps) {
  const { trigger } = useHaptic();
  const config = hapticConfigs[hapticType];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trigger(hapticType);
    onClick?.(e);
  };

  return (
    <motion.button
      className={className}
      onClick={handleClick}
      whileTap={{
        scale: config.scale,
        transition: { duration: config.duration / 1000 },
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/**
 * HapticDiv - Div with haptic feedback on interaction
 */
interface HapticDivProps extends React.HTMLAttributes<HTMLDivElement> {
  hapticType?: HapticType;
  triggerOn?: 'click' | 'hover' | 'both';
  children: React.ReactNode;
}

export function HapticDiv({
  hapticType = 'light',
  triggerOn = 'click',
  children,
  onClick,
  onMouseEnter,
  className,
  ...props
}: HapticDivProps) {
  const { trigger } = useHaptic();
  const config = hapticConfigs[hapticType];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (triggerOn === 'click' || triggerOn === 'both') {
      trigger(hapticType);
    }
    onClick?.(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (triggerOn === 'hover' || triggerOn === 'both') {
      trigger(hapticType);
    }
    onMouseEnter?.(e);
  };

  return (
    <motion.div
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      whileTap={{
        scale: config.scale,
        transition: { duration: config.duration / 1000 },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Haptic feedback wrapper for any component
 */
interface HapticWrapperProps {
  hapticType?: HapticType;
  disabled?: boolean;
  children: (props: {
    onInteraction: () => void;
    motionProps: any;
  }) => React.ReactNode;
}

export function HapticWrapper({
  hapticType = 'light',
  disabled = false,
  children,
}: HapticWrapperProps) {
  const { trigger } = useHaptic();
  const config = hapticConfigs[hapticType];

  const handleInteraction = useCallback(() => {
    if (!disabled) {
      trigger(hapticType);
    }
  }, [disabled, hapticType, trigger]);

  const motionProps = {
    whileTap: {
      scale: config.scale,
      transition: { duration: config.duration / 1000 },
    },
  };

  return <>{children({ onInteraction: handleInteraction, motionProps })}</>;
}

/**
 * Utility function to play haptic sound (optional enhancement)
 */
function playHapticSound(type: HapticType) {
  // Implementation for audio feedback
  // Can use Web Audio API or preloaded audio files
  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Configure sound based on haptic type
  const configs = {
    light: { freq: 200, gain: 0.05, duration: 0.02 },
    medium: { freq: 180, gain: 0.08, duration: 0.03 },
    heavy: { freq: 160, gain: 0.12, duration: 0.05 },
    success: { freq: 400, gain: 0.08, duration: 0.1 },
    warning: { freq: 300, gain: 0.1, duration: 0.08 },
    error: { freq: 250, gain: 0.12, duration: 0.12 },
    selection: { freq: 350, gain: 0.04, duration: 0.01 },
  };

  const config = configs[type];
  oscillator.frequency.value = config.freq;
  gainNode.gain.value = config.gain;

  oscillator.start();
  oscillator.stop(audioContext.currentTime + config.duration);
}
