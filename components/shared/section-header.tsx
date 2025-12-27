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

import Link from 'next/link'
// import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  /**
   * Small eyebrow text displayed above the title
   */
  eyebrow?: string
  /**
   * Main heading text
   */
  title: string
  /**
   * Supporting description text
   */
  description?: string
  /**
   * Optional CTA button text
   */
  ctaText?: string
  /**
   * Optional CTA link href
   */
  ctaHref?: string
  /**
   * Text alignment - centered or left-aligned
   */
  align?: 'left' | 'center'
  /**
   * Additional CSS classes
   */
  className?: string
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
        <p className="text-apple-13 font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{title}</h2>
      {description && (
        <p className="text-lg text-muted-foreground dark:text-apple-dark-text-secondary md:text-xl">
          {description}
        </p>
      )}
      {ctaText && ctaHref && (
        <Link
          href={ctaHref}
          className="group mt-6 inline-flex items-center font-semibold text-primary transition-all duration-200 hover:underline"
        >
          {ctaText}
          <svg
            className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      )}
    </div>
  )
}

SectionHeader.displayName = 'SectionHeader'
