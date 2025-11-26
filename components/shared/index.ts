/**
 * Shared UI Components - Barrel export file
 *
 * This file exports all shared components for easy importing throughout the application.
 *
 * @example
 * import { SectionHeader, FeatureCard, TestimonialCard } from '@/components/shared';
 */

// Section components
export { SectionHeader } from './section-header';
export type { SectionHeaderProps } from './section-header';

// Feature components
export { FeatureCard } from './feature-card';
export type { FeatureCardProps } from './feature-card';

// Testimonial components
export { TestimonialCard } from './testimonial-card';
export type { TestimonialCardProps } from './testimonial-card';

// Stats components
export { StatsSection } from './stats-section';
export type { StatsSectionProps, Stat } from './stats-section';

// CTA components
export { CTASection } from './cta-section';
export type { CTASectionProps } from './cta-section';

// Loading components
export {
  LoadingSpinner,
  Skeleton,
  SkeletonCard,
  SkeletonText,
  PageLoadingOverlay,
  ButtonLoading,
  LoadingDots,
} from './loading-spinner';
export type {
  LoadingSpinnerProps,
  SkeletonProps,
  PageLoadingOverlayProps,
} from './loading-spinner';
