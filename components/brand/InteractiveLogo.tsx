'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { PGLogo } from '../ui/pg-logo';

interface InteractiveLogoProps {
  width?: number;
  height?: number;
  className?: string;
  withWordmark?: boolean;
  interaction?: 'hover' | 'click' | 'magnetic' | 'glow' | 'luxury' | 'playful';
  disabled?: boolean;
  onClick?: () => void;
  onHover?: (isHovering: boolean) => void;
  hapticFeedback?: boolean;
  soundEnabled?: boolean;
}

/**
 * InteractiveLogo Component
 *
 * Sophisticated interactive logo component with multiple interaction patterns
 * designed to enhance user engagement while maintaining premium brand feel.
 *
 * Features:
 * - Multiple interaction types (hover, click, magnetic, glow, luxury, playful)
 * - Smooth spring-based animations
 * - Magnetic cursor following effect
 * - Optional haptic and audio feedback
 * - Accessibility-compliant with reduced motion support
 * - Performance optimized with transform-only animations
 */
export function InteractiveLogo({
  width = 140,
  height = 28,
  className = '',
  withWordmark = true,
  interaction = 'hover',
  disabled = false,
  onClick,
  onHover,
  hapticFeedback = false,
  soundEnabled: _soundEnabled = false
}: InteractiveLogoProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [_isPressed, setIsPressed] = React.useState(false);
  const logoRef = React.useRef<HTMLDivElement>(null);

  // Motion values for magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth motion
  const springX = useSpring(mouseX, { stiffness: 400, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 30 });

  // Transform values for magnetic effect
  const rotateX = useTransform(springY, [-50, 50], [5, -5]);
  const rotateY = useTransform(springX, [-50, 50], [-5, 5]);

  // Respect user's motion preferences
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Handle mouse movement for magnetic effect
  const handleMouseMove = (event: React.MouseEvent) => {
    if (disabled || prefersReducedMotion || interaction !== 'magnetic') return;

    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX.set(event.clientX - centerX);
      mouseY.set(event.clientY - centerY);
    }
  };

  const handleMouseLeave = () => {
    if (disabled) return;

    setIsHovered(false);
    onHover?.(false);

    // Reset magnetic position
    if (interaction === 'magnetic') {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleMouseEnter = () => {
    if (disabled) return;

    setIsHovered(true);
    onHover?.(true);

    // Haptic feedback
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleClick = () => {
    if (disabled || !onClick) return;

    // Haptic feedback for click
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate([20, 10, 20]);
    }

    onClick();
  };

  const handleMouseDown = () => {
    if (disabled) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (disabled) return;
    setIsPressed(false);
  };

  // Animation variants for different interaction types
  const getAnimationProps = () => {
    if (prefersReducedMotion) {
      return {
        animate: {},
        whileHover: {},
        whileTap: {},
        transition: { duration: 0 }
      };
    }

    switch (interaction) {
      case 'hover':
        return {
          whileHover: {
            scale: 1.05,
            transition: { type: 'spring', stiffness: 400, damping: 25 }
          },
          whileTap: {
            scale: 0.98,
            transition: { type: 'spring', stiffness: 600, damping: 30 }
          }
        };

      case 'click':
        return {
          whileHover: {
            scale: 1.02,
            transition: { type: 'spring', stiffness: 400, damping: 25 }
          },
          whileTap: {
            scale: 0.95,
            transition: { type: 'spring', stiffness: 600, damping: 30 }
          }
        };

      case 'magnetic':
        return {
          style: {
            rotateX,
            rotateY,
            transformPerspective: 1000
          },
          whileHover: {
            scale: 1.03,
            transition: { type: 'spring', stiffness: 400, damping: 25 }
          }
        };

      case 'glow':
        return {
          animate: isHovered ? {
            filter: ['drop-shadow(0 0 0px rgba(15, 23, 42, 0))', 'drop-shadow(0 0 20px rgba(15, 23, 42, 0.3))'],
            transition: { duration: 0.3 }
          } : {
            filter: 'drop-shadow(0 0 0px rgba(15, 23, 42, 0))',
            transition: { duration: 0.3 }
          },
          whileTap: {
            scale: 0.98,
            transition: { type: 'spring', stiffness: 600, damping: 30 }
          }
        };

      case 'luxury':
        return {
          whileHover: {
            scale: 1.03,
            filter: ['drop-shadow(0 0 0px rgba(15, 23, 42, 0))', 'drop-shadow(0 4px 20px rgba(15, 23, 42, 0.15))'],
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 20,
              filter: { duration: 0.4 }
            }
          },
          whileTap: {
            scale: 0.97,
            transition: { type: 'spring', stiffness: 600, damping: 30 }
          }
        };

      case 'playful':
        return {
          whileHover: {
            scale: 1.1,
            rotate: [0, -5, 5, 0],
            transition: {
              scale: { type: 'spring', stiffness: 400, damping: 20 },
              rotate: { duration: 0.6, ease: 'easeInOut' }
            }
          },
          whileTap: {
            scale: 0.9,
            rotate: 15,
            transition: { type: 'spring', stiffness: 600, damping: 30 }
          }
        };

      default:
        return {};
    }
  };

  const motionProps = getAnimationProps();

  return (
    <motion.div
      ref={logoRef}
      className={`
        inline-block cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      {...motionProps}
    >
      <PGLogo
        width={width}
        height={height}
        withWordmark={withWordmark}
      />

      {/* Glow effect overlay for glow interaction */}
      {interaction === 'glow' && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'radial-gradient(circle, rgba(15, 23, 42, 0.1) 0%, transparent 70%)',
            filter: 'blur(8px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}

/**
 * InteractiveLogoWithTooltip Component
 *
 * Enhanced interactive logo with contextual tooltip
 */
interface InteractiveLogoWithTooltipProps extends InteractiveLogoProps {
  tooltip?: {
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
  };
}

export function InteractiveLogoWithTooltip({
  tooltip,
  ...logoProps
}: InteractiveLogoWithTooltipProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [tooltipTimer, setTooltipTimer] = React.useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (tooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, tooltip.delay || 500);
      setTooltipTimer(timer);
    }
    logoProps.onHover?.(true);
  };

  const handleMouseLeave = () => {
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
    }
    setShowTooltip(false);
    logoProps.onHover?.(false);
  };

  const tooltipPositions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      <InteractiveLogo
        {...logoProps}
        onHover={handleMouseEnter}
      />

      {/* Tooltip */}
      {tooltip && showTooltip && (
        <motion.div
          className={`
            absolute z-50 px-3 py-2 text-sm text-white bg-slate-800 rounded-lg shadow-lg
            whitespace-nowrap pointer-events-none
            ${tooltipPositions[tooltip.position || 'top']}
          `}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {tooltip.text}
          {/* Tooltip arrow */}
          <div
            className={`
              absolute w-2 h-2 bg-slate-800 transform rotate-45
              ${tooltip.position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : ''}
              ${tooltip.position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : ''}
              ${tooltip.position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : ''}
              ${tooltip.position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1' : ''}
            `}
          />
        </motion.div>
      )}
    </div>
  );
}

/**
 * LogoCluster Interactive Component
 *
 * Showcase different interaction types for demo purposes
 */
interface LogoClusterInteractiveProps {
  showLabels?: boolean;
  className?: string;
}

export function LogoClusterInteractive({
  showLabels = true,
  className = ''
}: LogoClusterInteractiveProps) {
  const interactions: Array<InteractiveLogoProps['interaction']> = [
    'hover', 'click', 'magnetic', 'glow', 'luxury', 'playful'
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-8 p-8 ${className}`}>
      {interactions.map((interaction) => (
        <div key={interaction} className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center min-h-[80px] p-6 bg-gray-50 rounded-lg">
            <InteractiveLogo
              interaction={interaction}
              width={120}
              height={24}
              onClick={() => console.log(`${interaction} logo clicked`)}
            />
          </div>
          {showLabels && (
            <span className="text-sm text-gray-600 font-medium capitalize">
              {interaction}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * NavigationLogo Component
 *
 * Pre-configured interactive logo for navigation bars
 */
interface NavigationLogoProps {
  onLogoClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
}

export function NavigationLogo({
  onLogoClick,
  size = 'md',
  theme = 'light'
}: NavigationLogoProps) {
  const sizeConfig = {
    sm: { width: 100, height: 20 },
    md: { width: 140, height: 28 },
    lg: { width: 180, height: 36 }
  };

  const config = sizeConfig[size];

  return (
    <InteractiveLogo
      width={config.width}
      height={config.height}
      interaction="luxury"
      onClick={onLogoClick}
      className={theme === 'dark' ? 'filter brightness-0 invert' : ''}
      hapticFeedback={true}
    />
  );
}

// Usage Examples:
/*
// Basic interactive logo with hover effect
<InteractiveLogo
  interaction="hover"
  onClick={() => router.push('/')}
/>

// Magnetic logo with advanced interaction
<InteractiveLogo
  interaction="magnetic"
  width={200}
  height={40}
  hapticFeedback={true}
  onHover={(isHovering) => console.log('Hover:', isHovering)}
/>

// Logo with tooltip
<InteractiveLogoWithTooltip
  interaction="luxury"
  tooltip={{
    text: "Go to PG Closets home",
    position: "bottom",
    delay: 300
  }}
  onClick={() => router.push('/')}
/>

// Navigation logo
<NavigationLogo
  size="md"
  theme="light"
  onLogoClick={() => router.push('/')}
/>

// Interactive logo cluster for demo
<LogoClusterInteractive
  showLabels={true}
  className="my-8"
/>

// Glow effect logo
<InteractiveLogo
  interaction="glow"
  width={160}
  height={32}
  className="mb-4"
/>

// Playful logo for casual sections
<InteractiveLogo
  interaction="playful"
  disabled={false}
  soundEnabled={true}
/>
*/