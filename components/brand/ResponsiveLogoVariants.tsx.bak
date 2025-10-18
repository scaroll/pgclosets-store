'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PGLogo } from '../ui/pg-logo';

interface ResponsiveLogoVariantsProps {
  variant?: 'header' | 'footer' | 'mobile' | 'hero' | 'compact' | 'signature' | 'favicon';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  priority?: boolean;
  animated?: boolean;
  onLogoClick?: () => void;
}

const variantConfigs = {
  header: {
    width: 160,
    height: 32,
    withWordmark: true,
    breakpoints: {
      mobile: { width: 120, height: 24 },
      tablet: { width: 140, height: 28 },
      desktop: { width: 160, height: 32 }
    }
  },
  footer: {
    width: 140,
    height: 28,
    withWordmark: true,
    breakpoints: {
      mobile: { width: 120, height: 24 },
      tablet: { width: 130, height: 26 },
      desktop: { width: 140, height: 28 }
    }
  },
  mobile: {
    width: 100,
    height: 20,
    withWordmark: false,
    breakpoints: {
      mobile: { width: 80, height: 16 },
      tablet: { width: 90, height: 18 },
      desktop: { width: 100, height: 20 }
    }
  },
  hero: {
    width: 300,
    height: 60,
    withWordmark: true,
    breakpoints: {
      mobile: { width: 200, height: 40 },
      tablet: { width: 250, height: 50 },
      desktop: { width: 300, height: 60 }
    }
  },
  compact: {
    width: 80,
    height: 16,
    withWordmark: false,
    breakpoints: {
      mobile: { width: 60, height: 12 },
      tablet: { width: 70, height: 14 },
      desktop: { width: 80, height: 16 }
    }
  },
  signature: {
    width: 200,
    height: 40,
    withWordmark: true,
    breakpoints: {
      mobile: { width: 160, height: 32 },
      tablet: { width: 180, height: 36 },
      desktop: { width: 200, height: 40 }
    }
  },
  favicon: {
    width: 32,
    height: 32,
    withWordmark: false,
    breakpoints: {
      mobile: { width: 24, height: 24 },
      tablet: { width: 28, height: 28 },
      desktop: { width: 32, height: 32 }
    }
  }
};

/**
 * ResponsiveLogoVariants Component
 *
 * Adaptive logo component that renders appropriate size and format
 * based on context and screen size. Includes optimal variants for
 * different use cases across the PG Closets website.
 *
 * Features:
 * - Context-specific sizing (header, footer, mobile, hero, etc.)
 * - Responsive breakpoint handling
 * - Light/dark theme support
 * - Optional animations and interactions
 * - Accessibility-compliant implementation
 * - Next.js Image optimization when using external assets
 */
export function ResponsiveLogoVariants({
  variant = 'header',
  theme = 'auto',
  className = '',
  priority = false,
  animated = false,
  onLogoClick
}: ResponsiveLogoVariantsProps) {
  const config = variantConfigs[variant];
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark'>('light');

  // Auto-detect theme preference
  React.useEffect(() => {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(prefersDark ? 'dark' : 'light');

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setCurrentTheme(theme);
    }
  }, [theme]);

  const logoProps = {
    width: config.width,
    height: config.height,
    withWordmark: config.withWordmark,
    className: `${currentTheme === 'dark' ? 'filter brightness-0 invert' : ''} ${className}`
  };

  const LogoWrapper = animated ? motion.div : 'div';
  const animationProps = animated ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  } : {};

  const handleClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <LogoWrapper
      className={`inline-block ${onLogoClick ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
      {...animationProps}
    >
      <div className="relative">
        {/* Responsive logo with breakpoint-specific sizing */}
        <div className="block">
          {/* Mobile */}
          <div className="block sm:hidden">
            <PGLogo
              width={config.breakpoints.mobile.width}
              height={config.breakpoints.mobile.height}
              withWordmark={variant === 'hero' || variant === 'signature' ? true : config.withWordmark}
              className={logoProps.className}
            />
          </div>

          {/* Tablet */}
          <div className="hidden sm:block lg:hidden">
            <PGLogo
              width={config.breakpoints.tablet.width}
              height={config.breakpoints.tablet.height}
              withWordmark={config.withWordmark}
              className={logoProps.className}
            />
          </div>

          {/* Desktop */}
          <div className="hidden lg:block">
            <PGLogo
              width={config.breakpoints.desktop.width}
              height={config.breakpoints.desktop.height}
              withWordmark={config.withWordmark}
              className={logoProps.className}
            />
          </div>
        </div>

        {/* Optional brand asset overlay for premium contexts */}
        {(variant === 'hero' || variant === 'signature') && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -inset-4 bg-gradient-radial from-slate-50/20 to-transparent opacity-50" />
          </div>
        )}
      </div>
    </LogoWrapper>
  );
}

/**
 * LogoWithFallback Component
 *
 * Enhanced logo component with fallback to SVG if brand image fails to load
 */
interface LogoWithFallbackProps extends ResponsiveLogoVariantsProps {
  brandImagePath?: string;
  alt?: string;
}

export function LogoWithFallback({
  brandImagePath = '/brand/pg-logo.png',
  alt = 'PG Closets - Premium Custom Closets',
  variant = 'header',
  theme = 'auto',
  className = '',
  priority = false,
  ...props
}: LogoWithFallbackProps) {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const config = variantConfigs[variant];

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (imageError || !brandImagePath) {
    return (
      <ResponsiveLogoVariants
        variant={variant}
        theme={theme}
        className={className}
        priority={priority}
        {...props}
      />
    );
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div
          className="animate-pulse bg-gray-200 rounded"
          style={{
            width: config.width,
            height: config.height
          }}
        />
      )}

      {/* Brand image with responsive sizing */}
      <Image
        src={brandImagePath}
        alt={alt}
        width={config.width}
        height={config.height}
        priority={priority}
        className={`${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 object-contain`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        sizes={`
          (max-width: 640px) ${config.breakpoints.mobile.width}px,
          (max-width: 1024px) ${config.breakpoints.tablet.width}px,
          ${config.breakpoints.desktop.width}px
        `}
      />
    </div>
  );
}

/**
 * AdaptiveLogo Component
 *
 * Intelligent logo that adapts based on container size using ResizeObserver
 */
interface AdaptiveLogoProps extends ResponsiveLogoVariantsProps {
  minWidth?: number;
  maxWidth?: number;
  autoScale?: boolean;
}

export function AdaptiveLogo({
  minWidth = 80,
  maxWidth = 300,
  autoScale = true,
  variant = 'header',
  ...props
}: AdaptiveLogoProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const [logoScale, setLogoScale] = React.useState<number>(1);

  React.useEffect(() => {
    if (!containerRef.current || !autoScale) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setContainerWidth(width);

        // Calculate optimal scale based on container width
        const baseWidth = variantConfigs[variant].width;
        const targetWidth = Math.max(minWidth, Math.min(maxWidth, width * 0.3));
        const scale = targetWidth / baseWidth;
        setLogoScale(scale);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [autoScale, variant, minWidth, maxWidth]);

  return (
    <div ref={containerRef} className="flex items-center">
      <div style={{ transform: `scale(${logoScale})`, transformOrigin: 'left center' }}>
        <ResponsiveLogoVariants
          variant={variant}
          {...props}
        />
      </div>
    </div>
  );
}

/**
 * LogoCluster Component
 *
 * Displays multiple logo variants for brand guidelines or testing
 */
interface LogoClusterProps {
  variants?: Array<keyof typeof variantConfigs>;
  theme?: 'light' | 'dark' | 'auto';
  showLabels?: boolean;
  className?: string;
}

export function LogoCluster({
  variants = ['header', 'footer', 'mobile', 'compact'],
  theme = 'light',
  showLabels = true,
  className = ''
}: LogoClusterProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 p-8 ${className}`}>
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col items-center space-y-3">
          <div className="flex items-center justify-center min-h-[60px] p-4 bg-gray-50 rounded-lg">
            <ResponsiveLogoVariants
              variant={variant}
              theme={theme}
              animated={true}
            />
          </div>
          {showLabels && (
            <span className="text-sm text-gray-600 font-medium capitalize">
              {variant}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// Usage Examples:
/*
// Header logo with auto theme detection
<ResponsiveLogoVariants
  variant="header"
  theme="auto"
  animated={true}
  onLogoClick={() => router.push('/')}
/>

// Hero logo for landing pages
<ResponsiveLogoVariants
  variant="hero"
  theme="light"
  priority={true}
  className="mb-8"
/>

// Compact mobile navigation logo
<ResponsiveLogoVariants
  variant="mobile"
  animated={true}
  className="md:hidden"
/>

// Fallback logo with brand image
<LogoWithFallback
  variant="signature"
  brandImagePath="/brand/pg-logo-premium.png"
  priority={true}
/>

// Adaptive logo that scales with container
<AdaptiveLogo
  variant="header"
  minWidth={60}
  maxWidth={200}
  autoScale={true}
/>

// Logo cluster for brand guidelines
<LogoCluster
  variants={['header', 'footer', 'mobile', 'hero', 'compact']}
  theme="light"
  showLabels={true}
/>
*/