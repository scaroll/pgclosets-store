/**
 * Section Header Component - Section titles with Apple design system
 *
 * Features:
 * - Eyebrow text (small caps)
 * - Main heading (large, responsive)
 * - Description text
 * - Optional CTA link with icon
 * - Centered and left-aligned variants
 * - Dark mode optimized
 *
 * @example
 * <SectionHeader
 *   eyebrow="Custom Closets"
 *   title="Transform Your Space"
 *   description="Premium storage solutions designed for your lifestyle"
 *   ctaText="View Gallery"
 *   ctaHref="/gallery"
 *   align="center"
 * />
 */

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  /**
   * Small eyebrow text displayed above the title
   */
  eyebrow?: string;
  /**
   * Main heading text
   */
  title: string;
  /**
   * Supporting description text
   */
  description?: string;
  /**
   * Optional CTA button text
   */
  ctaText?: string;
  /**
   * Optional CTA link href
   */
  ctaHref?: string;
  /**
   * Text alignment - centered or left-aligned
   */
  align?: 'left' | 'center';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Section Header component for page sections
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  ctaText,
  ctaHref,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-3xl space-y-4',
        align === 'center' ? 'mx-auto text-center' : '',
        className
      )}
    >
      {eyebrow && (
        <p className="text-apple-13 font-semibold text-primary uppercase tracking-wider">
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-lg md:text-xl text-muted-foreground dark:text-apple-dark-text-secondary">
          {description}
        </p>
      )}
      {ctaText && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center mt-6 text-primary font-semibold hover:underline transition-all duration-200 group"
        >
          {ctaText}
          <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

SectionHeader.displayName = 'SectionHeader';
