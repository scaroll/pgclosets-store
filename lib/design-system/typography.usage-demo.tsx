/**
 * Typography Usage Demo - Copy & Paste Examples
 * 
 * Quick examples you can copy directly into your components
 */

import {
  typographyVariants,
  kitTypography,
  aceTypography,
  typographyToCSS,
  getResponsiveFontSize,
} from './typography';

// ============================================================================
// BASIC USAGE - Copy these into your components
// ============================================================================

// 1. Simple Heading
export const SimpleHeading = () => (
  <h1 style={typographyToCSS(typographyVariants.h1)}>
    Your Heading Here
  </h1>
);

// 2. Responsive Heading (fluid sizing)
export const ResponsiveHeading = () => (
  <h1 style={{ fontSize: getResponsiveFontSize('h1') }}>
    Responsive Heading
  </h1>
);

// 3. Body Text
export const BodyText = () => (
  <p style={typographyToCSS(typographyVariants.body)}>
    Your paragraph text here. This will have optimal line height and spacing.
  </p>
);

// ============================================================================
// KIT PRODUCT CARD - Complete example
// ============================================================================

export const KitProductCard = () => (
  <div className="p-6 border rounded">
    {/* Badge */}
    <span style={typographyToCSS(kitTypography.categoryBadge)}>
      KIT SERIES
    </span>

    {/* Product Name */}
    <h2 style={typographyToCSS(kitTypography.productName)} className="mt-4">
      Premium Walk-In Closet Kit
    </h2>

    {/* Model Number */}
    <div style={typographyToCSS(kitTypography.modelNumber)} className="mt-2">
      Model: KIT-WI-PRE-001
    </div>

    {/* Description */}
    <p style={typographyToCSS(kitTypography.description)} className="mt-4">
      Complete walk-in closet solution with adjustable shelving, double hanging
      rods, and premium finish options. Easy DIY installation included.
    </p>

    {/* Features */}
    <ul className="mt-4 space-y-2">
      <li style={typographyToCSS(kitTypography.feature)}>
        ✓ Adjustable wire shelving system
      </li>
      <li style={typographyToCSS(kitTypography.feature)}>
        ✓ Double hanging rod configuration
      </li>
      <li style={typographyToCSS(kitTypography.feature)}>
        ✓ Available in 5 premium finishes
      </li>
    </ul>

    {/* Specifications */}
    <div style={typographyToCSS(kitTypography.specification)} className="mt-4">
      Dimensions: 96" W × 24" D × 84" H | Weight Capacity: 500 lbs
    </div>

    {/* Price */}
    <div style={typographyToCSS(kitTypography.price)} className="mt-6">
      $899.99
    </div>

    {/* CTA */}
    <button className="btn-primary mt-4">
      Add to Cart
    </button>
  </div>
);

// ============================================================================
// ACE PRODUCT CARD - Complete example
// ============================================================================

export const AceProductCard = () => (
  <div className="p-8 border rounded">
    {/* Badge */}
    <span style={typographyToCSS(aceTypography.seriesBadge)}>
      ACE COLLECTION
    </span>

    {/* Collection Name */}
    <div style={typographyToCSS(aceTypography.collectionName)} className="mt-3">
      Renin Originals
    </div>

    {/* Product Name */}
    <h2 style={typographyToCSS(aceTypography.productName)} className="mt-2">
      Bypass Door System – Shaker White
    </h2>

    {/* Description */}
    <p style={typographyToCSS(aceTypography.description)} className="mt-6">
      Elegant sliding door system featuring clean Shaker-style panels in a
      pristine white finish. Crafted for timeless sophistication and smooth,
      whisper-quiet operation.
    </p>

    {/* Feature Highlight */}
    <div
      style={typographyToCSS(aceTypography.featureHighlight)}
      className="mt-6"
    >
      Premium Soft-Close Technology Included
    </div>

    {/* Technical Details */}
    <div
      style={typographyToCSS(aceTypography.technicalDetail)}
      className="mt-4"
    >
      Features premium aluminum track with smooth-glide rollers. Accommodates
      openings up to 12 feet wide. Professional installation recommended.
    </div>

    {/* Price */}
    <div style={typographyToCSS(aceTypography.price)} className="mt-8">
      $1,299.99
    </div>

    {/* CTA */}
    <button className="btn-primary mt-6">
      Request Quote
    </button>
  </div>
);

// ============================================================================
// PRODUCT LISTING PAGE - Complete example
// ============================================================================

export const ProductListingPage = () => (
  <div className="container-apple section-apple">
    {/* Page Header */}
    <header className="mb-12">
      <h1
        style={{
          ...typographyToCSS(typographyVariants.display),
          fontSize: getResponsiveFontSize('display'),
        }}
      >
        Closet Systems
      </h1>
      <p style={typographyToCSS(typographyVariants.bodyLarge)} className="mt-4">
        Transform your space with our premium closet solutions
      </p>
    </header>

    {/* Kit Section */}
    <section className="mb-16">
      <h2 style={typographyToCSS(typographyVariants.h2)}>Kit Series</h2>
      <p style={typographyToCSS(typographyVariants.body)} className="mt-2">
        Practical, value-focused solutions for every space
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <KitProductCard />
        {/* More Kit products... */}
      </div>
    </section>

    {/* Ace Section */}
    <section>
      <h2 style={typographyToCSS(typographyVariants.h2)}>Ace Collection</h2>
      <p style={typographyToCSS(typographyVariants.body)} className="mt-2">
        Premium, refined designs for discerning homeowners
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <AceProductCard />
        {/* More Ace products... */}
      </div>
    </section>
  </div>
);

// ============================================================================
// HERO SECTION - Homepage example
// ============================================================================

export const HeroSection = () => (
  <section className="section-apple text-center">
    {/* Hero Heading - Fluid responsive */}
    <h1
      style={{
        fontSize: getResponsiveFontSize('display'),
        fontWeight: 300,
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
      }}
    >
      Transform Your Space
    </h1>

    {/* Subheading */}
    <p
      style={typographyToCSS(typographyVariants.bodyLarge)}
      className="mt-6 max-w-2xl mx-auto"
    >
      Premium closet solutions designed and manufactured in Canada.
      Expert installation and lifetime warranty included.
    </p>

    {/* CTA Buttons */}
    <div className="flex gap-4 justify-center mt-8">
      <button className="btn-primary">Shop Now</button>
      <button className="btn-secondary">View Catalog</button>
    </div>
  </section>
);

// ============================================================================
// NAVIGATION - Header example
// ============================================================================

export const Navigation = () => (
  <nav className="flex items-center gap-8">
    {/* Logo */}
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display"',
        fontSize: '1.5rem',
        fontWeight: 600,
        letterSpacing: '-0.02em',
      }}
    >
      PG Closets
    </div>

    {/* Nav Links */}
    <a
      href="/products"
      style={{
        fontSize: '1rem',
        fontWeight: 500,
        letterSpacing: '-0.011em',
      }}
    >
      Products
    </a>
    <a
      href="/collections"
      style={{
        fontSize: '1rem',
        fontWeight: 500,
        letterSpacing: '-0.011em',
      }}
    >
      Collections
    </a>
  </nav>
);

// ============================================================================
// FORM - Contact/Checkout example
// ============================================================================

export const ContactForm = () => (
  <form className="space-y-6">
    {/* Form Field */}
    <div>
      <label style={typographyToCSS(typographyVariants.label)}>
        EMAIL ADDRESS
      </label>
      <input
        type="email"
        placeholder="Enter your email"
        className="mt-2 w-full"
        style={{
          fontSize: '1rem',
          fontFamily: '-apple-system, BlinkMacSystemFont',
        }}
      />
      <p style={typographyToCSS(typographyVariants.caption)} className="mt-2">
        We'll never share your email with anyone else
      </p>
    </div>

    {/* Submit Button */}
    <button type="submit" className="btn-primary">
      Send Message
    </button>
  </form>
);

// ============================================================================
// PRICING TABLE - Comparison example
// ============================================================================

export const PricingTable = () => (
  <div className="grid grid-cols-3 gap-8">
    {/* Kit Plan */}
    <div className="p-6 border rounded">
      <div style={typographyToCSS(typographyVariants.overline)}>
        KIT SERIES
      </div>
      <div style={typographyToCSS(kitTypography.price)} className="mt-4">
        $899
      </div>
      <div style={typographyToCSS(typographyVariants.caption)}>
        Starting price
      </div>
      <ul className="mt-6 space-y-2">
        <li style={typographyToCSS(typographyVariants.bodySmall)}>
          ✓ Adjustable shelving
        </li>
        <li style={typographyToCSS(typographyVariants.bodySmall)}>
          ✓ DIY installation
        </li>
        <li style={typographyToCSS(typographyVariants.bodySmall)}>
          ✓ 5-year warranty
        </li>
      </ul>
    </div>

    {/* Ace Plan */}
    <div className="p-6 border rounded">
      <div style={typographyToCSS(typographyVariants.overline)}>
        ACE COLLECTION
      </div>
      <div style={typographyToCSS(aceTypography.price)} className="mt-4">
        $1,299
      </div>
      <div style={typographyToCSS(typographyVariants.caption)}>
        Starting price
      </div>
      <ul className="mt-6 space-y-2">
        <li style={typographyToCSS(typographyVariants.bodySmall)}>
          ✓ Premium materials
        </li>
        <li style={typographyToCSS(typographyVariants.bodySmall)}>
          ✓ Professional install
        </li>
        <li style={typographyToCSS(typographyVariants.bodySmall)}>
          ✓ Lifetime warranty
        </li>
      </ul>
    </div>
  </div>
);

// ============================================================================
// EXPORT ALL DEMOS
// ============================================================================

export const TypographyUsageDemos = {
  SimpleHeading,
  ResponsiveHeading,
  BodyText,
  KitProductCard,
  AceProductCard,
  ProductListingPage,
  HeroSection,
  Navigation,
  ContactForm,
  PricingTable,
};
