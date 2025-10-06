'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LogoBackgroundPatternsProps {
  pattern?: 'subtle' | 'geometric' | 'scattered' | 'watermark' | 'constellation' | 'luxury';
  opacity?: number;
  scale?: number;
  color?: 'gray' | 'slate' | 'brand' | 'custom';
  customColor?: string;
  animated?: boolean;
  className?: string;
  density?: 'sparse' | 'normal' | 'dense';
}

/**
 * LogoBackgroundPatterns Component
 *
 * Creates sophisticated background patterns using PG Closets logo elements
 * for enhanced brand presence while maintaining content readability.
 *
 * Features:
 * - Multiple pattern styles from subtle to luxury
 * - Customizable opacity and scaling
 * - Color theme options including brand colors
 * - Optional subtle animations
 * - Responsive density controls
 * - Performance-optimized with CSS patterns where possible
 */
export function LogoBackgroundPatterns({
  pattern = 'subtle',
  opacity = 0.03,
  scale = 1,
  color = 'gray',
  customColor,
  animated = false,
  className = '',
  density = 'normal'
}: LogoBackgroundPatternsProps) {
  const baseColor = React.useMemo(() => {
    if (customColor) return customColor;

    const colorMap = {
      gray: 'var(--color-text-muted)',
      slate: '#475569',
      brand: 'var(--color-text-muted)',
      custom: customColor || 'var(--color-text-muted)'
    };

    return colorMap[color];
  }, [color, customColor]);

  const densityConfig = {
    sparse: { spacing: 120, count: 12 },
    normal: { spacing: 80, count: 20 },
    dense: { spacing: 60, count: 32 }
  };

  const config = densityConfig[density];

  const PatternComponent = {
    subtle: SubtlePattern,
    geometric: GeometricPattern,
    scattered: ScatteredPattern,
    watermark: WatermarkPattern,
    constellation: ConstellationPattern,
    luxury: LuxuryPattern
  }[pattern];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <PatternComponent
        opacity={opacity}
        scale={scale}
        color={baseColor}
        animated={animated}
        config={config}
      />
    </div>
  );
}

/**
 * SubtlePattern - Minimal repeating logo elements
 */
function SubtlePattern({ opacity, scale, color, animated, config }: any) {
  const logoSize = 24 * scale;

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
          <svg width="${config.spacing}" height="${config.spacing}" viewBox="0 0 ${config.spacing} ${config.spacing}" xmlns="http://www.w3.org/2000/svg">
            <rect x="${(config.spacing - logoSize) / 2}" y="${(config.spacing - logoSize) / 2}"
                  width="${logoSize}" height="${logoSize}" rx="4"
                  fill="${color}" opacity="${opacity}" />
          </svg>
        `)}")`,
        backgroundSize: `${config.spacing}px ${config.spacing}px`,
        backgroundRepeat: 'repeat'
      }}
    />
  );
}

/**
 * GeometricPattern - Angular geometric interpretation of logo
 */
function GeometricPattern({ opacity, scale, color, animated, config }: any) {
  const size = 40 * scale;
  const halfSize = size / 2;

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
          <svg width="${config.spacing}" height="${config.spacing}" viewBox="0 0 ${config.spacing} ${config.spacing}" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(${(config.spacing - size) / 2}, ${(config.spacing - size) / 2})">
              <polygon points="0,0 ${size},0 ${size * 0.7},${halfSize} ${size},${size} 0,${size} ${size * 0.3},${halfSize}"
                       fill="${color}" opacity="${opacity}" />
            </g>
          </svg>
        `)}")`,
        backgroundSize: `${config.spacing}px ${config.spacing}px`,
        backgroundRepeat: 'repeat'
      }}
    />
  );
}

/**
 * ScatteredPattern - Randomly positioned logo elements
 */
function ScatteredPattern({ opacity, scale, color, animated, config }: any) {
  const elements = React.useMemo(() => {
    return Array.from({ length: config.count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      size: (0.5 + Math.random() * 0.5) * scale,
      delay: Math.random() * 2
    }));
  }, [config.count, scale]);

  return (
    <div className="absolute inset-0">
      {elements.map((element) => {
        const Component = animated ? motion.div : 'div';
        const animationProps = animated ? {
          animate: {
            rotate: [element.rotation, element.rotation + 360],
            opacity: [opacity * 0.5, opacity, opacity * 0.5]
          },
          transition: {
            duration: 20 + element.delay * 10,
            repeat: Infinity,
            ease: 'linear'
          }
        } : {};

        return (
          <Component
            key={element.id}
            className="absolute"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
              opacity: animated ? undefined : opacity
            }}
            {...animationProps}
          >
            <div
              className="rounded"
              style={{
                width: `${20 * element.size}px`,
                height: `${20 * element.size}px`,
                backgroundColor: color
              }}
            />
          </Component>
        );
      })}
    </div>
  );
}

/**
 * WatermarkPattern - Large, centered watermark
 */
function WatermarkPattern({ opacity, scale, color, animated }: any) {
  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    animate: {
      rotate: [0, 360],
      scale: [0.95, 1.05, 0.95]
    },
    transition: {
      rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
      scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
    }
  } : {};

  return (
    <Component
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity }}
      {...animationProps}
    >
      <svg
        width={400 * scale}
        height={400 * scale}
        viewBox="0 0 400 400"
        className="opacity-20"
      >
        <defs>
          <linearGradient id="watermarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="50%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect
          x="150" y="150" width="100" height="100" rx="20"
          fill="url(#watermarkGrad)"
          stroke={color}
          strokeWidth="2"
          strokeOpacity="0.1"
        />
        <text
          x="200" y="210"
          textAnchor="middle"
          fontSize="36"
          fontWeight="700"
          fill={color}
          fillOpacity="0.15"
          fontFamily="Inter, system-ui, sans-serif"
        >
          PG
        </text>
      </svg>
    </Component>
  );
}

/**
 * ConstellationPattern - Connected logo elements forming a network
 */
function ConstellationPattern({ opacity, scale, color, animated, config }: any) {
  const points = React.useMemo(() => {
    return Array.from({ length: config.count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: (0.3 + Math.random() * 0.4) * scale
    }));
  }, [config.count, scale]);

  const connections = React.useMemo(() => {
    const connections = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const distance = Math.sqrt(
          Math.pow(points[i].x - points[j].x, 2) +
          Math.pow(points[i].y - points[j].y, 2)
        );
        if (distance < 30) {
          connections.push({ from: points[i], to: points[j] });
        }
      }
    }
    return connections;
  }, [points]);

  return (
    <div className="absolute inset-0">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="constellationGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity={opacity * 0.5} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Connection lines */}
        {connections.map((connection, index) => (
          <motion.line
            key={index}
            x1={`${connection.from.x}%`}
            y1={`${connection.from.y}%`}
            x2={`${connection.to.x}%`}
            y2={`${connection.to.y}%`}
            stroke="url(#constellationGrad)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={animated ? { pathLength: 1 } : {}}
            transition={{
              duration: 2,
              delay: index * 0.1,
              repeat: animated ? Infinity : 0,
              repeatType: 'reverse'
            }}
          />
        ))}

        {/* Logo points */}
        {points.map((point) => (
          <motion.circle
            key={point.id}
            cx={`${point.x}%`}
            cy={`${point.y}%`}
            r={point.size * 2}
            fill={color}
            opacity={opacity}
            animate={animated ? {
              opacity: [opacity * 0.5, opacity, opacity * 0.5],
              scale: [0.8, 1.2, 0.8]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: point.id * 0.2
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * LuxuryPattern - Premium pattern with sophisticated elements
 */
function LuxuryPattern({ opacity, scale, color, animated }: any) {
  return (
    <div className="absolute inset-0">
      {/* Primary luxury elements */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="luxGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="${color}" stop-opacity="${opacity * 0.8}" />
                  <stop offset="70%" stop-color="${color}" stop-opacity="${opacity * 0.3}" />
                  <stop offset="100%" stop-color="${color}" stop-opacity="0" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="30" fill="url(#luxGrad)" />
              <rect x="85" y="85" width="30" height="30" rx="6"
                    fill="${color}" opacity="${opacity * 0.4}"
                    stroke="${color}" stroke-width="1" stroke-opacity="${opacity * 0.2}" />
            </svg>
          `)}")`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Secondary accent pattern */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <rect x="190" y="190" width="20" height="20" rx="3"
                    fill="${color}" opacity="${opacity * 0.6}" />
              <rect x="185" y="185" width="30" height="30" rx="5"
                    fill="none" stroke="${color}" stroke-width="1" opacity="${opacity * 0.3}" />
            </svg>
          `)}")`,
          backgroundSize: '400px 400px',
          backgroundRepeat: 'repeat'
        }}
        animate={animated ? {
          backgroundPosition: ['0px 0px', '400px 400px']
        } : {}}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Ambient glow overlay */}
      <div
        className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-transparent"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}${Math.round(opacity * 5).toString(16)} 0%, transparent 70%)`
        }}
      />
    </div>
  );
}

/**
 * LogoPatternSection Component
 *
 * Pre-configured section wrapper with logo pattern background
 */
interface LogoPatternSectionProps extends LogoBackgroundPatternsProps {
  children: React.ReactNode;
  containerClassName?: string;
  contentClassName?: string;
}

export function LogoPatternSection({
  children,
  containerClassName = '',
  contentClassName = '',
  ...patternProps
}: LogoPatternSectionProps) {
  return (
    <section className={`relative ${containerClassName}`}>
      <LogoBackgroundPatterns {...patternProps} />
      <div className={`relative z-10 ${contentClassName}`}>
        {children}
      </div>
    </section>
  );
}

/**
 * LogoPatternCard Component
 *
 * Card component with subtle logo pattern background
 */
interface LogoPatternCardProps extends LogoBackgroundPatternsProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  border?: boolean;
  shadow?: boolean;
}

export function LogoPatternCard({
  children,
  padding = 'md',
  rounded = true,
  border = true,
  shadow = true,
  ...patternProps
}: LogoPatternCardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={`
        relative overflow-hidden bg-white
        ${paddingClasses[padding]}
        ${rounded ? 'rounded-lg' : ''}
        ${border ? 'border border-gray-200' : ''}
        ${shadow ? 'shadow-sm' : ''}
      `}
    >
      <LogoBackgroundPatterns
        {...patternProps}
        opacity={patternProps.opacity || 0.02}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Usage Examples:
/*
// Subtle background pattern for sections
<LogoPatternSection
  pattern="subtle"
  opacity={0.03}
  color="slate"
  containerClassName="py-16"
  contentClassName="container mx-auto px-4"
>
  <h2>Your Content Here</h2>
</LogoPatternSection>

// Luxury pattern for hero sections
<LogoBackgroundPatterns
  pattern="luxury"
  opacity={0.05}
  color="brand"
  animated={true}
  density="sparse"
/>

// Constellation pattern for feature sections
<LogoBackgroundPatterns
  pattern="constellation"
  opacity={0.04}
  color="gray"
  animated={false}
  density="normal"
/>

// Card with subtle pattern
<LogoPatternCard
  pattern="geometric"
  opacity={0.02}
  color="slate"
  padding="lg"
  shadow={true}
>
  <h3>Card Content</h3>
</LogoPatternCard>

// Watermark for full-page backgrounds
<LogoBackgroundPatterns
  pattern="watermark"
  opacity={0.02}
  scale={1.5}
  color="brand"
  animated={true}
/>
*/