/**
 * CTA Section Component - Call to action blocks with Apple design system
 *
 * Features:
 * - Background image or gradient support
 * - Headline and description
 * - Primary and secondary buttons
 * - Full-width and contained variants
 * - Dark mode optimized
 *
 * @example
 * <CTASection
 *   title="Ready to Transform Your Space?"
 *   description="Schedule a free consultation with our design experts"
 *   ctaText="Get Started"
 *   ctaHref="/contact"
 *   secondaryCtaText="View Portfolio"
 *   secondaryCtaHref="/gallery"
 *   variant="contained"
 *   gradient="premium"
 * />
 */

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface CTASectionProps {
  /**
   * Main headline text
   */
  title: string;
  /**
   * Supporting description text
   */
  description?: string;
  /**
   * Primary CTA button text
   */
  ctaText: string;
  /**
   * Primary CTA link href
   */
  ctaHref: string;
  /**
   * Optional secondary CTA text
   */
  secondaryCtaText?: string;
  /**
   * Optional secondary CTA href
   */
  secondaryCtaHref?: string;
  /**
   * Optional background image URL
   */
  backgroundImage?: string;
  /**
   * Optional gradient variant
   */
  gradient?: 'premium' | 'blue' | 'purple' | 'none';
  /**
   * Layout variant
   */
  variant?: 'full-width' | 'contained';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * CTA Section component for call-to-action blocks
 */
export function CTASection({
  title,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  backgroundImage,
  gradient = 'none',
  variant = 'full-width',
  className,
}: CTASectionProps) {
  const gradients = {
    premium: 'bg-gradient-to-r from-woodgrain-600 to-metal-700',
    blue: 'bg-gradient-to-r from-blue-600 to-blue-800',
    purple: 'bg-gradient-to-r from-purple-600 to-pink-600',
    none: '',
  };

  const hasBackground = backgroundImage || gradient !== 'none';

  return (
    <section
      className={cn(
        'relative py-20 md:py-32 overflow-hidden',
        variant === 'contained' && 'container mx-auto px-4',
        className
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Gradient Background */}
      {!backgroundImage && gradient !== 'none' && (
        <div className={cn('absolute inset-0 z-0', gradients[gradient])} />
      )}

      {/* Content */}
      <div className={cn('relative z-10', variant === 'full-width' && 'container mx-auto px-4')}>
        <div
          className={cn(
            'max-w-3xl mx-auto text-center space-y-6',
            variant === 'contained' && 'rounded-3xl p-12 md:p-16',
            variant === 'contained' && !hasBackground && 'bg-card dark:bg-apple-dark-bg-secondary'
          )}
        >
          <h2
            className={cn(
              'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
              hasBackground ? 'text-white' : 'text-foreground dark:text-apple-dark-text'
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                'text-xl md:text-2xl',
                hasBackground
                  ? 'text-white/90'
                  : 'text-muted-foreground dark:text-apple-dark-text-secondary'
              )}
            >
              {description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href={ctaHref}
              className={cn(
                'px-8 py-4 rounded-full font-semibold text-lg',
                'transition-all duration-200',
                'hover:scale-105 active:scale-95',
                hasBackground
                  ? 'bg-white text-black hover:bg-white/90 shadow-lg'
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              )}
            >
              {ctaText}
            </Link>
            {secondaryCtaText && secondaryCtaHref && (
              <Link
                href={secondaryCtaHref}
                className={cn(
                  'px-8 py-4 rounded-full font-semibold text-lg',
                  'transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  hasBackground
                    ? 'bg-transparent border-2 border-white text-white hover:bg-white/10'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {secondaryCtaText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

CTASection.displayName = 'CTASection';
