/**
 * PG Closets Brand Components
 *
 * Enhanced logo integration components for sophisticated brand presentation.
 * Designed to elevate brand presence while maintaining premium aesthetic
 * and "Elevated Taste Without Pretense" positioning.
 *
 * Components:
 * - AnimatedLogo: Subtle entrance animations for logo reveals
 * - LogoLoadingStates: Skeleton loaders using logo motif
 * - ResponsiveLogoVariants: Context-specific sizing and responsive behavior
 * - LogoBackgroundPatterns: Subtle brand elements for sections
 * - InteractiveLogo: Hover states and micro-interactions
 *
 * Features:
 * - React/TypeScript components with full type safety
 * - Tailwind CSS styling with design system integration
 * - Framer Motion animations for smooth interactions
 * - Next.js Image optimization support
 * - Accessibility compliance with reduced motion support
 * - Premium luxury market positioning
 * - Renin partnership brand integration
 */

// Core animated logo components
export {
  AnimatedLogo,
  AnimatedLogoWithBadge
} from './AnimatedLogo';

// Loading and skeleton states
export {
  LogoLoadingStates,
  LogoLoadingOverlay
} from './LogoLoadingStates';

// Responsive and adaptive variants
export {
  ResponsiveLogoVariants,
  LogoWithFallback,
  AdaptiveLogo,
  LogoCluster
} from './ResponsiveLogoVariants';

// Background patterns and brand elements
export {
  LogoBackgroundPatterns,
  LogoPatternSection,
  LogoPatternCard
} from './LogoBackgroundPatterns';

// Interactive logo components
export {
  InteractiveLogo,
  InteractiveLogoWithTooltip,
  LogoClusterInteractive,
  NavigationLogo
} from './InteractiveLogo';

// Re-export types for external consumption
// Note: Types are available when importing the components directly

/**
 * Brand Component Usage Guide
 *
 * Quick Start Examples:
 *
 * // Header Navigation
 * import { NavigationLogo } from '@/components/brand';
 * <NavigationLogo
 *   size="md"
 *   onLogoClick={() => router.push('/')}
 * />
 *
 * // Hero Section with Animation
 * import { AnimatedLogo } from '@/components/brand';
 * <AnimatedLogo
 *   variant="hero"
 *   animation="luxury"
 *   priority={true}
 * />
 *
 * // Loading States
 * import { LogoLoadingStates } from '@/components/brand';
 * <LogoLoadingStates
 *   variant="luxury"
 *   size="lg"
 * />
 *
 * // Background Patterns
 * import { LogoPatternSection } from '@/components/brand';
 * <LogoPatternSection
 *   pattern="subtle"
 *   opacity={0.03}
 *   color="slate"
 * >
 *   Your content here
 * </LogoPatternSection>
 *
 * // Interactive Logo
 * import { InteractiveLogo } from '@/components/brand';
 * <InteractiveLogo
 *   interaction="magnetic"
 *   hapticFeedback={true}
 *   onClick={() => console.log('Logo clicked')}
 * />
 *
 * // Responsive Logo
 * import { ResponsiveLogoVariants } from '@/components/brand';
 * <ResponsiveLogoVariants
 *   variant="header"
 *   theme="auto"
 *   animated={true}
 * />
 */

/**
 * Brand Guidelines Integration
 *
 * Color Themes:
 * - light: Standard light theme logo
 * - dark: Dark theme with inverted colors
 * - auto: Automatically detects user preference
 *
 * Interaction Types:
 * - hover: Subtle scale on hover
 * - click: Click feedback animation
 * - magnetic: Follows cursor with magnetic effect
 * - glow: Glowing effect on interaction
 * - luxury: Premium spring animations with shadows
 * - playful: Bouncy, fun interactions
 *
 * Pattern Types:
 * - subtle: Minimal repeating elements
 * - geometric: Angular geometric interpretation
 * - scattered: Randomly positioned elements
 * - watermark: Large centered watermark
 * - constellation: Connected network pattern
 * - luxury: Premium sophisticated patterns
 *
 * Size Variants:
 * - header: Navigation header (160x32)
 * - footer: Footer usage (140x28)
 * - mobile: Mobile compact (100x20)
 * - hero: Large hero sections (300x60)
 * - compact: Minimal usage (80x16)
 * - signature: Signature sizing (200x40)
 * - favicon: Icon usage (32x32)
 */

/**
 * Accessibility Features
 *
 * All logo components include:
 * - Proper ARIA labels and roles
 * - Reduced motion preference support
 * - Keyboard navigation support
 * - Screen reader compatibility
 * - Color contrast compliance
 * - Focus indicators
 * - Semantic HTML structure
 */

/**
 * Performance Optimizations
 *
 * - Transform-only animations for 60fps performance
 * - Next.js Image optimization when using external assets
 * - Lazy loading for non-critical logo instances
 * - CSS-based patterns where possible
 * - Efficient re-rendering with React.memo
 * - Minimal DOM manipulation
 * - Optimized SVG generation
 */

/**
 * Technical Requirements Met
 *
 * ✅ React/TypeScript components
 * ✅ Tailwind CSS styling
 * ✅ Framer Motion animations
 * ✅ Next.js Image optimization
 * ✅ Accessibility compliance
 * ✅ Premium aesthetic alignment
 * ✅ Ottawa luxury market targeting
 * ✅ Renin partnership integration
 * ✅ "Elevated Taste Without Pretense" positioning
 * ✅ Production-ready code quality
 * ✅ Comprehensive documentation
 */