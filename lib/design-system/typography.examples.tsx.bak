/**
 * PG Closets Typography Usage Examples
 *
 * Comprehensive examples demonstrating how to use the typography system
 * across different scenarios and components.
 */

import {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  typographyVariants,
  kitTypography,
  aceTypography,
  typographyToCSS,
  getResponsiveFontSize,
  generateFluidTypography,
} from './typography';

/**
 * Example 1: Basic Typography Usage in React Components
 */
export function BasicTypographyExample() {
  return (
    <div>
      {/* Display heading */}
      <h1 style={typographyToCSS(typographyVariants.display)}>
        Welcome to PG Closets
      </h1>

      {/* Page heading */}
      <h2 style={typographyToCSS(typographyVariants.h1)}>
        Premium Closet Solutions
      </h2>

      {/* Section heading */}
      <h3 style={typographyToCSS(typographyVariants.h2)}>
        Our Products
      </h3>

      {/* Body text */}
      <p style={typographyToCSS(typographyVariants.body)}>
        Discover our extensive collection of premium closet systems,
        designed and manufactured to the highest standards.
      </p>

      {/* Caption */}
      <span style={typographyToCSS(typographyVariants.caption)}>
        Made in Canada since 1987
      </span>
    </div>
  );
}

/**
 * Example 2: Kit Product Typography
 */
export function KitProductCardExample() {
  return (
    <div className="product-card">
      {/* Category badge */}
      <div style={typographyToCSS(kitTypography.categoryBadge)}>
        Kit Series
      </div>

      {/* Product name */}
      <h2 style={typographyToCSS(kitTypography.productName)}>
        Premium Walk-In Kit
      </h2>

      {/* Model number */}
      <div style={typographyToCSS(kitTypography.modelNumber)}>
        Model: KIT-WI-001
      </div>

      {/* Description */}
      <p style={typographyToCSS(kitTypography.description)}>
        Complete walk-in closet solution with adjustable shelving,
        double hanging rods, and premium finish options.
      </p>

      {/* Features */}
      <ul>
        <li style={typographyToCSS(kitTypography.feature)}>
          Adjustable wire shelving
        </li>
        <li style={typographyToCSS(kitTypography.feature)}>
          Double hanging rods
        </li>
        <li style={typographyToCSS(kitTypography.feature)}>
          Easy installation
        </li>
      </ul>

      {/* Specifications */}
      <div style={typographyToCSS(kitTypography.specification)}>
        Dimensions: 96" W × 24" D × 84" H
      </div>

      {/* Price */}
      <div style={typographyToCSS(kitTypography.price)}>
        $899.99
      </div>
    </div>
  );
}

/**
 * Example 3: Ace Product Typography
 */
export function AceProductCardExample() {
  return (
    <div className="product-card ace-product">
      {/* Series badge */}
      <div style={typographyToCSS(aceTypography.seriesBadge)}>
        Ace Collection
      </div>

      {/* Collection name */}
      <div style={typographyToCSS(aceTypography.collectionName)}>
        Renin Originals
      </div>

      {/* Product name */}
      <h2 style={typographyToCSS(aceTypography.productName)}>
        Bypass Door System – Shaker White
      </h2>

      {/* Description */}
      <p style={typographyToCSS(aceTypography.description)}>
        Elegant sliding door system featuring clean Shaker-style panels
        in a pristine white finish. Crafted for timeless sophistication.
      </p>

      {/* Feature highlight */}
      <div style={typographyToCSS(aceTypography.featureHighlight)}>
        Soft-Close Technology Included
      </div>

      {/* Technical details */}
      <div style={typographyToCSS(aceTypography.technicalDetail)}>
        Premium aluminum track with smooth-glide rollers.
        Accommodates openings up to 12 feet wide.
      </div>

      {/* Price */}
      <div style={typographyToCSS(aceTypography.price)}>
        $1,299.99
      </div>
    </div>
  );
}

/**
 * Example 4: Responsive Typography
 */
export function ResponsiveTypographyExample() {
  return (
    <div>
      {/* Fluid display heading */}
      <h1 style={{ fontSize: getResponsiveFontSize('display') }}>
        Responsive Hero Heading
      </h1>

      {/* Fluid H1 */}
      <h2 style={{ fontSize: getResponsiveFontSize('h1') }}>
        Responsive Page Heading
      </h2>

      {/* Fluid body text */}
      <p style={{ fontSize: getResponsiveFontSize('body') }}>
        This text scales smoothly between mobile and desktop sizes.
      </p>

      {/* Custom fluid typography */}
      <div style={{ fontSize: generateFluidTypography(14, 20, 320, 1200) }}>
        Custom fluid text scaling from 14px to 20px
      </div>
    </div>
  );
}

/**
 * Example 5: Typography with Tailwind Classes
 */
export function TailwindTypographyExample() {
  return (
    <div>
      {/* Using custom CSS classes */}
      <h1 className="text-h1">
        Heading with Tailwind
      </h1>

      <p className="text-body-l">
        Large body text
      </p>

      <span className="text-label">
        Label text
      </span>
    </div>
  );
}

/**
 * Example 6: Button Typography
 */
export function ButtonTypographyExample() {
  return (
    <div className="space-y-4">
      {/* Primary button */}
      <button
        className="btn-primary"
        style={typographyToCSS(typographyVariants.button)}
      >
        Add to Cart
      </button>

      {/* Secondary button */}
      <button
        className="btn-secondary"
        style={typographyToCSS(typographyVariants.button)}
      >
        View Details
      </button>

      {/* Text link */}
      <a
        href="#"
        style={typographyToCSS(typographyVariants.link)}
      >
        Learn More
      </a>
    </div>
  );
}

/**
 * Example 7: Form Typography
 */
export function FormTypographyExample() {
  return (
    <form className="space-y-4">
      {/* Form label */}
      <div>
        <label style={typographyToCSS(typographyVariants.label)}>
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          style={{
            fontFamily: fontFamilies.body,
            fontSize: fontSizes.base,
          }}
        />
      </div>

      {/* Helper text */}
      <p style={typographyToCSS(typographyVariants.caption)}>
        We'll never share your email with anyone else.
      </p>

      {/* Error message */}
      <p
        style={{
          ...typographyToCSS(typographyVariants.bodySmall),
          color: 'var(--pg-error)',
        }}
      >
        Please enter a valid email address
      </p>
    </form>
  );
}

/**
 * Example 8: Card Typography Hierarchy
 */
export function CardTypographyExample() {
  return (
    <div className="card-modern p-6">
      {/* Overline */}
      <div style={typographyToCSS(typographyVariants.overline)}>
        New Arrival
      </div>

      {/* Card heading */}
      <h3 style={typographyToCSS(typographyVariants.h3)}>
        Modern Closet System
      </h3>

      {/* Card body */}
      <p style={typographyToCSS(typographyVariants.body)}>
        Transform your space with our latest modular closet system,
        featuring customizable components and premium materials.
      </p>

      {/* Metadata */}
      <div style={typographyToCSS(typographyVariants.caption)}>
        Available in 5 finishes
      </div>
    </div>
  );
}

/**
 * Example 9: Accessible Typography with ARIA
 */
export function AccessibleTypographyExample() {
  return (
    <article>
      {/* Main heading with proper hierarchy */}
      <h1 style={typographyToCSS(typographyVariants.h1)}>
        Accessibility in Typography
      </h1>

      {/* Visually hidden text for screen readers */}
      <span className="sr-only">
        This page contains information about typography accessibility
      </span>

      {/* High contrast text */}
      <p
        style={{
          ...typographyToCSS(typographyVariants.body),
          color: 'var(--pg-text-primary)', // WCAG AA compliant
        }}
      >
        All typography is designed to meet WCAG AA contrast ratios.
      </p>

      {/* Focus-visible styles */}
      <a
        href="#content"
        style={typographyToCSS(typographyVariants.link)}
        className="focus:outline-offset-2"
      >
        Skip to content
      </a>
    </article>
  );
}

/**
 * Example 10: Mixed Typography Styles
 */
export function MixedTypographyExample() {
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section>
        <h1
          style={{
            ...typographyToCSS(typographyVariants.display),
            fontSize: getResponsiveFontSize('display'),
          }}
        >
          Transform Your Space
        </h1>
        <p style={typographyToCSS(typographyVariants.bodyLarge)}>
          Premium closet solutions designed for modern living
        </p>
      </section>

      {/* Feature section */}
      <section>
        <h2 style={typographyToCSS(typographyVariants.h2)}>
          Why Choose PG Closets?
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            'Quality Craftsmanship',
            'Custom Solutions',
            'Expert Installation',
          ].map((feature) => (
            <div key={feature}>
              <h3 style={typographyToCSS(typographyVariants.h4)}>
                {feature}
              </h3>
              <p style={typographyToCSS(typographyVariants.body)}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Example 11: Custom Font Combinations
 */
export function CustomFontCombinationsExample() {
  return (
    <div>
      {/* Display + Light weight */}
      <h1
        style={{
          fontFamily: fontFamilies.display,
          fontSize: fontSizes['5xl'],
          fontWeight: fontWeights.light,
          lineHeight: lineHeights.tight,
          letterSpacing: letterSpacing.tighter,
        }}
      >
        Elegant Display Heading
      </h1>

      {/* Body + Medium weight */}
      <p
        style={{
          fontFamily: fontFamilies.body,
          fontSize: fontSizes.lg,
          fontWeight: fontWeights.medium,
          lineHeight: lineHeights.relaxed,
          letterSpacing: letterSpacing.normal,
        }}
      >
        Emphasized body text for important content
      </p>

      {/* Mono + Small size */}
      <code
        style={{
          fontFamily: fontFamilies.mono,
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.regular,
          lineHeight: lineHeights.relaxed,
        }}
      >
        {`const closetConfig = { width: 96, depth: 24 };`}
      </code>
    </div>
  );
}

/**
 * Example 12: Typography in Navigation
 */
export function NavigationTypographyExample() {
  return (
    <nav>
      {/* Nav link */}
      <a
        href="/products"
        style={{
          fontFamily: fontFamilies.body,
          fontSize: fontSizes.base,
          fontWeight: fontWeights.medium,
          letterSpacing: letterSpacing.normal,
        }}
      >
        Products
      </a>

      {/* Mobile menu heading */}
      <h2
        style={{
          fontFamily: fontFamilies.display,
          fontSize: fontSizes.xl,
          fontWeight: fontWeights.semibold,
          letterSpacing: letterSpacing.tight,
        }}
      >
        Browse
      </h2>

      {/* Dropdown category */}
      <div
        style={{
          fontFamily: fontFamilies.body,
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.semibold,
          letterSpacing: letterSpacing.wider,
          textTransform: 'uppercase',
        }}
      >
        Categories
      </div>
    </nav>
  );
}

/**
 * Example 13: E-commerce Typography
 */
export function EcommerceTypographyExample() {
  return (
    <div className="product-listing">
      {/* Product name */}
      <h2
        style={{
          fontFamily: fontFamilies.display,
          fontSize: fontSizes['2xl'],
          fontWeight: fontWeights.medium,
          lineHeight: lineHeights.snug,
        }}
      >
        Deluxe Closet Organizer
      </h2>

      {/* Price - large and prominent */}
      <div
        style={{
          fontFamily: fontFamilies.display,
          fontSize: fontSizes['3xl'],
          fontWeight: fontWeights.semibold,
          letterSpacing: letterSpacing.tight,
        }}
      >
        $1,499.99
      </div>

      {/* Original price - strikethrough */}
      <div
        style={{
          fontFamily: fontFamilies.body,
          fontSize: fontSizes.lg,
          fontWeight: fontWeights.regular,
          textDecoration: 'line-through',
          color: 'var(--pg-text-muted)',
        }}
      >
        $1,899.99
      </div>

      {/* Savings badge */}
      <span
        style={{
          fontFamily: fontFamilies.body,
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.bold,
          letterSpacing: letterSpacing.wide,
          textTransform: 'uppercase',
          color: 'var(--pg-success)',
        }}
      >
        Save 21%
      </span>

      {/* Stock status */}
      <p
        style={{
          fontFamily: fontFamilies.body,
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.medium,
          color: 'var(--pg-warning)',
        }}
      >
        Only 3 left in stock
      </p>
    </div>
  );
}

/**
 * Example 14: Typography Spacing Utility
 */
export function TypographySpacingExample() {
  return (
    <div className="space-y-6">
      <h1
        style={{
          ...typographyToCSS(typographyVariants.h1),
          marginBottom: '1.5rem',
        }}
      >
        Proper Typography Spacing
      </h1>

      <p
        style={{
          ...typographyToCSS(typographyVariants.body),
          marginBottom: '1rem',
        }}
      >
        First paragraph with proper spacing below.
      </p>

      <p style={typographyToCSS(typographyVariants.body)}>
        Second paragraph maintains consistent rhythm.
      </p>

      <h2
        style={{
          ...typographyToCSS(typographyVariants.h2),
          marginTop: '2rem',
          marginBottom: '1rem',
        }}
      >
        Subheading with Balanced Spacing
      </h2>

      <p style={typographyToCSS(typographyVariants.body)}>
        Content continues with harmonious vertical rhythm.
      </p>
    </div>
  );
}

/**
 * Example 15: Complete Component Implementation
 */
export function ProductDetailPageExample() {
  return (
    <div className="container-apple section-apple">
      {/* Breadcrumbs */}
      <nav style={typographyToCSS(typographyVariants.caption)}>
        Home / Products / Closet Systems
      </nav>

      {/* Product header */}
      <header className="mt-8">
        <div style={typographyToCSS(kitTypography.categoryBadge)}>
          Premium Kit
        </div>

        <h1
          className="mt-4"
          style={{
            ...typographyToCSS(kitTypography.productName),
            fontSize: getResponsiveFontSize('h1'),
          }}
        >
          Ultimate Walk-In Closet System
        </h1>

        <div
          className="mt-2"
          style={typographyToCSS(kitTypography.modelNumber)}
        >
          Model: KIT-ULT-2024
        </div>
      </header>

      {/* Product details */}
      <section className="mt-8">
        <p style={typographyToCSS(kitTypography.description)}>
          Our most comprehensive closet solution, featuring premium materials,
          modular design, and professional installation support.
        </p>

        <div className="mt-6">
          <h2 style={typographyToCSS(typographyVariants.h3)}>
            Key Features
          </h2>

          <ul className="mt-4 space-y-2">
            {[
              'Premium wood construction',
              'Soft-close drawers',
              'LED lighting ready',
              'Lifetime warranty',
            ].map((feature) => (
              <li key={feature} style={typographyToCSS(kitTypography.feature)}>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h2 style={typographyToCSS(typographyVariants.h3)}>
            Specifications
          </h2>

          <dl className="mt-4 space-y-2">
            {[
              { term: 'Dimensions', definition: '120" W × 24" D × 96" H' },
              { term: 'Weight Capacity', definition: '500 lbs per shelf' },
              { term: 'Finish Options', definition: '12 premium finishes' },
            ].map(({ term, definition }) => (
              <div key={term}>
                <dt style={typographyToCSS(typographyVariants.bodySmall)}>
                  {term}
                </dt>
                <dd style={typographyToCSS(kitTypography.specification)}>
                  {definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Purchase section */}
      <section className="mt-8">
        <div style={typographyToCSS(kitTypography.price)}>
          $2,499.99
        </div>

        <button
          className="btn-primary mt-4"
          style={typographyToCSS(typographyVariants.button)}
        >
          Add to Cart
        </button>
      </section>
    </div>
  );
}

/**
 * Export all examples
 */
export const TypographyExamples = {
  BasicTypographyExample,
  KitProductCardExample,
  AceProductCardExample,
  ResponsiveTypographyExample,
  TailwindTypographyExample,
  ButtonTypographyExample,
  FormTypographyExample,
  CardTypographyExample,
  AccessibleTypographyExample,
  MixedTypographyExample,
  CustomFontCombinationsExample,
  NavigationTypographyExample,
  EcommerceTypographyExample,
  TypographySpacingExample,
  ProductDetailPageExample,
};

export default TypographyExamples;
