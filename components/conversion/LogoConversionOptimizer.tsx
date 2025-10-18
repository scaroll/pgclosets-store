'use client';

import React, { useEffect, useState } from 'react';
import { InteractiveLogo } from '@/components/brand/InteractiveLogo';
import { AnimatedLogo } from '@/components/brand/AnimatedLogo';
import { ResponsiveLogoVariants } from '@/components/brand/ResponsiveLogoVariants';
import { trackLogoConversion, trackLogoVariant, trackBrandEngagement } from '@/lib/analytics/logo-tracking';

interface LogoConversionOptimizerProps {
  placement: 'cta' | 'form' | 'pricing' | 'testimonial' | 'hero' | 'footer';
  variant?: 'trust_signal' | 'cta_enhancement' | 'brand_reminder' | 'social_proof';
  size?: 'sm' | 'md' | 'lg';
  actionText?: string;
  onClick?: () => void;
  className?: string;
  abTestVariant?: string;
}

/**
 * LogoConversionOptimizer Component
 *
 * Strategically places logo elements to improve conversion rates
 * through trust signals, brand reinforcement, and psychological anchoring.
 */
export function LogoConversionOptimizer({
  placement,
  variant = 'trust_signal',
  size = 'md',
  actionText,
  onClick,
  className = '',
  abTestVariant = 'default'
}: LogoConversionOptimizerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleLogoClick = () => {
    setHasInteracted(true);

    // Track conversion-focused logo interaction
    trackLogoConversion({
      event: 'conversion_logo_click',
      logo_placement: `${placement}_${variant}`,
      conversion_type: getConversionType(placement)
    });

    // Track A/B test variant
    if (abTestVariant !== 'default') {
      trackLogoVariant(abTestVariant, placement, 'click');
    }

    // Track brand engagement
    trackBrandEngagement('conversion_interaction', `${placement}_optimization`);

    if (onClick) {
      onClick();
    }
  };

  const getConversionType = (placement: string): 'cta_click' | 'quote_request' | 'product_view' | 'contact_submit' => {
    switch (placement) {
      case 'cta':
      case 'hero':
        return 'cta_click';
      case 'form':
        return 'contact_submit';
      case 'pricing':
        return 'quote_request';
      default:
        return 'product_view';
    }
  };

  const getSizeConfig = (size: string) => {
    const configs = {
      sm: { width: 24, height: 5 },
      md: { width: 32, height: 6 },
      lg: { width: 48, height: 10 }
    };
    return configs[size as keyof typeof configs] || configs.md;
  };

  const { width, height } = getSizeConfig(size);

  // Trust Signal Variant - builds credibility
  if (variant === 'trust_signal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <ResponsiveLogoVariants
            variant="compact"
            width={width}
            height={height}
            className="opacity-70 hover:opacity-100 transition-opacity"
          />
          <span className="text-xs text-slate-600 font-medium">Trusted Brand</span>
        </div>
        {placement === 'testimonial' && (
          <div className="flex items-center gap-1 text-amber-500">
            <span className="text-sm">★★★★★</span>
            <span className="text-xs text-slate-600">500+ Happy Clients</span>
          </div>
        )}
      </div>
    );
  }

  // CTA Enhancement Variant - increases click-through rates
  if (variant === 'cta_enhancement') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <InteractiveLogo
          interaction="hover"
          width={width + 8}
          height={height + 2}
          onClick={handleLogoClick}
          className="cursor-pointer"
        />
        {actionText && (
          <span className="text-sm font-medium text-slate-700">
            {actionText}
          </span>
        )}
      </div>
    );
  }

  // Brand Reminder Variant - maintains brand awareness
  if (variant === 'brand_reminder') {
    return (
      <div className={`text-center ${className}`}>
        {isVisible && (
          <AnimatedLogo
            animation="fade"
            width={width}
            height={height}
            delay={0.5}
            onAnimationComplete={() => {
              trackBrandEngagement('brand_reminder_shown', placement);
            }}
          />
        )}
        <p className="text-xs text-slate-500 mt-2 font-light">
          Elevated Taste Without Pretense
        </p>
      </div>
    );
  }

  // Social Proof Variant - leverages social validation
  if (variant === 'social_proof') {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${className}`}>
        <div className="flex items-center gap-3 mb-2">
          <ResponsiveLogoVariants
            variant="compact"
            width={width}
            height={height}
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-900">PG Closets</div>
            <div className="text-xs text-slate-600">Ottawa's #1 Choice</div>
          </div>
          <div className="text-right">
            <div className="text-amber-500 text-sm">★★★★★</div>
            <div className="text-xs text-slate-600">4.9/5 Rating</div>
          </div>
        </div>
        <div className="text-xs text-slate-600">
          "Exceptional craftsmanship and professional service.
          PG Closets transformed our home with their premium solutions."
        </div>
        <div className="text-xs text-slate-500 mt-1">- Sarah M., Ottawa</div>
      </div>
    );
  }

  return null;
}

/**
 * CTALogoButton Component
 *
 * Call-to-action button enhanced with logo branding for higher conversion rates
 */
interface CTALogoButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLogo?: boolean;
  trackingContext?: string;
}

export function CTALogoButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  showLogo = true,
  trackingContext = 'cta_button'
}: CTALogoButtonProps) {
  const handleClick = () => {
    // Track CTA conversion with logo context
    trackLogoConversion({
      event: 'cta_button_click',
      logo_placement: 'cta_button',
      conversion_type: 'cta_click'
    });

    trackBrandEngagement('cta_interaction', trackingContext);

    if (onClick) {
      onClick();
    } else if (href) {
      window.location.href = href;
    }
  };

  const getButtonStyles = () => {
    const baseStyles = 'inline-flex items-center gap-3 font-medium tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
      primary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-400 shadow-lg hover:shadow-xl',
      secondary: 'border-2 border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white focus:ring-slate-400',
      premium: 'bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-700 hover:to-amber-600 focus:ring-amber-400 shadow-lg hover:shadow-xl'
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };

    return `${baseStyles} ${variants[variant]} ${sizes[size]}`;
  };

  const logoSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <button
      onClick={handleClick}
      className={`${getButtonStyles()} ${className}`}
    >
      {showLogo && (
        <ResponsiveLogoVariants
          variant="compact"
          width={logoSize}
          height={logoSize * 0.2}
          theme={variant === 'secondary' ? 'auto' : 'dark'}
          className="flex-shrink-0"
        />
      )}
      <span>{children}</span>
      <svg
        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </button>
  );
}

/**
 * Usage Examples:
 *
 * // Trust signal in form
 * <LogoConversionOptimizer
 *   placement="form"
 *   variant="trust_signal"
 *   size="sm"
 * />
 *
 * // CTA enhancement
 * <LogoConversionOptimizer
 *   placement="cta"
 *   variant="cta_enhancement"
 *   actionText="Start Your Project"
 *   onClick={handleCTAClick}
 * />
 *
 * // Enhanced CTA button
 * <CTALogoButton
 *   variant="premium"
 *   size="lg"
 *   href="/request-work"
 *   trackingContext="hero_cta"
 * >
 *   Request Free Online Quote
 * </CTALogoButton>
 */