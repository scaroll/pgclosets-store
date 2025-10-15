/**
 * Typography Showcase Page
 * Visual demonstration of the complete typography system
 */

'use client';

import React from 'react';
import {
  Headline,
  HeroHeadline,
  SectionHeadline,
  FeatureCallout,
  Text,
  Lead,
  Caption,
  LinkText,
  ReadingContainer,
  ProductHero,
  FeatureHighlight,
  ProductBenefit,
  TechSpecs,
  FeatureGrid,
  ProductStatement,
  NavLink,
  Breadcrumb,
  FormLabel,
  HelperText,
  BadgeText,
  TabText,
} from '@/components/typography';

export default function TypographyShowcasePage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="container-apple py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="text-xl font-semibold">Typography System</span>
              <div className="hidden md:flex items-center gap-6">
                <NavLink href="#headlines" active>Headlines</NavLink>
                <NavLink href="#body-text">Body Text</NavLink>
                <NavLink href="#product-copy">Product Copy</NavLink>
                <NavLink href="#ui-elements">UI Elements</NavLink>
              </div>
            </div>
            <BadgeText variant="info">v1.0.0</BadgeText>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-apple bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 text-white">
        <div className="container-apple text-center space-y-8">
          <HeroHeadline gradient="none" className="text-white">
            Typography System
          </HeroHeadline>
          <Text size="xl" color="inverse" className="max-w-3xl mx-auto">
            A comprehensive, Apple-inspired typography system with perfect visual clarity,
            accessibility, and performance optimization.
          </Text>
          <div className="flex items-center justify-center gap-4 pt-4">
            <BadgeText variant="success">WCAG AAA</BadgeText>
            <BadgeText variant="info">Performance Optimized</BadgeText>
            <BadgeText>Mobile First</BadgeText>
          </div>
        </div>
      </section>

      {/* Headlines Section */}
      <section id="headlines" className="section-apple">
        <div className="container-apple space-y-16">
          <div className="text-center space-y-4">
            <SectionHeadline>Headline System</SectionHeadline>
            <Text size="lg" color="secondary" className="max-w-2xl mx-auto">
              Massive, impactful headlines with responsive sizing (56-96px) and gradient effects.
            </Text>
          </div>

          {/* Size Examples */}
          <div className="space-y-12">
            <div>
              <Caption className="mb-4">Hero Size (96px desktop, 56px mobile)</Caption>
              <Headline size="hero" weight="light">
                Transform Your Space
              </Headline>
            </div>

            <div>
              <Caption className="mb-4">Large Size (64px desktop, 40px mobile)</Caption>
              <Headline size="large" weight="light">
                Premium Custom Solutions
              </Headline>
            </div>

            <div>
              <Caption className="mb-4">Medium Size (48px desktop, 32px mobile)</Caption>
              <Headline size="medium" weight="medium">
                Designed for Modern Living
              </Headline>
            </div>
          </div>

          {/* Gradient Examples */}
          <div className="space-y-8">
            <SectionHeadline as="h3">Gradient Variants</SectionHeadline>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Caption className="mb-4">Brand Gradient</Caption>
                <Headline size="medium" gradient="brand">
                  Navy to Sky Blue
                </Headline>
              </div>
              <div>
                <Caption className="mb-4">Luxury Gradient</Caption>
                <Headline size="medium" gradient="luxury">
                  Charcoal to Bronze
                </Headline>
              </div>
            </div>
          </div>

          {/* Feature Callout Example */}
          <div>
            <Caption className="mb-4">Feature Callout with Eyebrow</Caption>
            <FeatureCallout eyebrow="New Feature">
              Smart Organization Systems
            </FeatureCallout>
          </div>
        </div>
      </section>

      {/* Body Text Section */}
      <section id="body-text" className="section-apple bg-white">
        <div className="container-apple space-y-16">
          <div className="text-center space-y-4">
            <SectionHeadline>Body Text System</SectionHeadline>
            <Text size="lg" color="secondary" className="max-w-2xl mx-auto">
              Optimized for readability with proper line-height (1.4-1.6) and max-width (680px).
            </Text>
          </div>

          {/* Size Examples */}
          <ReadingContainer width="normal">
            <div className="space-y-8">
              <div>
                <Caption className="mb-2">Lead Paragraph (21px)</Caption>
                <Lead>
                  Our custom closet systems are meticulously designed to transform your living
                  space into an organized sanctuary of style and functionality.
                </Lead>
              </div>

              <div>
                <Caption className="mb-2">Base Text (17px - Optimal)</Caption>
                <Text size="base" color="primary">
                  Every detail is carefully considered, from the premium materials we select to
                  the expert craftsmanship that brings your vision to life. Our team works
                  closely with you to create storage solutions that perfectly complement your
                  lifestyle and aesthetic preferences.
                </Text>
              </div>

              <div>
                <Caption className="mb-2">Small Text (16px)</Caption>
                <Text size="sm" color="secondary">
                  With decades of experience in custom storage design, we understand that
                  organization is personal. That's why we offer endless customization options to
                  ensure your space works exactly the way you need it to.
                </Text>
              </div>

              <div>
                <Caption className="mb-2">Caption Text (14px)</Caption>
                <Caption color="tertiary">
                  All measurements are approximate and may vary based on your specific
                  configuration. Contact our design team for a personalized consultation.
                </Caption>
              </div>
            </div>
          </ReadingContainer>

          {/* Link Examples */}
          <div className="space-y-4">
            <SectionHeadline as="h3">Link Styles</SectionHeadline>
            <div className="flex flex-wrap gap-6">
              <LinkText href="#" underline>
                Internal Link
              </LinkText>
              <LinkText href="#" external underline>
                External Link
              </LinkText>
              <LinkText href="#" underline={false}>
                Link without Underline
              </LinkText>
            </div>
          </div>
        </div>
      </section>

      {/* Product Copy Section */}
      <section id="product-copy" className="section-apple bg-stone-50">
        <div className="container-apple space-y-16">
          <div className="text-center space-y-4">
            <SectionHeadline>Product Copy System</SectionHeadline>
            <Text size="lg" color="secondary" className="max-w-2xl mx-auto">
              Apple-style product descriptions with large feature callouts and organized specs.
            </Text>
          </div>

          {/* Product Hero Example */}
          <ProductHero
            eyebrow="New Collection"
            headline="The Modern Wardrobe"
            subheadline="Designed for the way you live"
            description="Premium materials. Precise craftsmanship. Perfect organization."
          />

          {/* Feature Highlight Example */}
          <FeatureHighlight
            title="Soft-Close Drawers"
            description="Experience the quiet confidence of premium hardware with every close. Our German-engineered mechanisms ensure smooth, silent operation for decades to come."
          />

          {/* Product Benefit Example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProductBenefit
              headline="Maximize Every Inch"
              body="Our design process starts with a detailed analysis of your space, ensuring every cubic inch is utilized efficiently without compromising accessibility."
              emphasis="Average storage increase: 40-60%"
            />
            <ProductBenefit
              headline="Built to Last"
              body="We use only premium, sustainably-sourced materials and time-tested construction techniques to create systems that will serve you for generations."
              emphasis="Lifetime warranty included"
            />
          </div>

          {/* Feature Grid Example */}
          <FeatureGrid
            columns={3}
            features={[
              {
                title: 'Custom Design',
                description: 'Every system is designed specifically for your unique space and needs.',
              },
              {
                title: 'Premium Materials',
                description: 'Only the finest materials from trusted, sustainable suppliers.',
              },
              {
                title: 'Expert Installation',
                description: 'Professional installation by certified master craftsmen.',
              },
            ]}
          />

          {/* Tech Specs Example */}
          <div className="max-w-3xl mx-auto">
            <SectionHeadline as="h3" className="mb-8">
              Technical Specifications
            </SectionHeadline>
            <TechSpecs
              specs={[
                {
                  label: 'Materials',
                  value: 'Premium maple wood with natural finish',
                  description: 'Sustainably sourced from certified North American forests',
                },
                {
                  label: 'Dimensions',
                  value: '96" W × 84" H × 24" D',
                  description: 'Fully customizable to fit your exact space requirements',
                },
                {
                  label: 'Hardware',
                  value: 'German-engineered soft-close mechanisms',
                  description: 'Blum Blumotion technology with lifetime warranty',
                },
                {
                  label: 'Finish Options',
                  value: '12+ premium finish colors',
                  description: 'From natural wood tones to contemporary matte finishes',
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* UI Elements Section */}
      <section id="ui-elements" className="section-apple bg-white">
        <div className="container-apple space-y-16">
          <div className="text-center space-y-4">
            <SectionHeadline>Navigation & UI Text</SectionHeadline>
            <Text size="lg" color="secondary" className="max-w-2xl mx-auto">
              Optimized typography for interactive elements (13-17px).
            </Text>
          </div>

          {/* Breadcrumb Example */}
          <div>
            <Caption className="mb-4">Breadcrumb Navigation</Caption>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'Custom Closets', href: '/products/closets' },
                { label: 'Modern Wardrobe' },
              ]}
            />
          </div>

          {/* Form Elements */}
          <div className="max-w-md space-y-6">
            <Caption className="mb-4">Form Elements</Caption>
            <div>
              <FormLabel htmlFor="email" required>
                Email Address
              </FormLabel>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg"
                placeholder="you@example.com"
              />
              <HelperText>We'll never share your email with anyone else.</HelperText>
            </div>

            <div>
              <FormLabel htmlFor="phone" optional>
                Phone Number
              </FormLabel>
              <input
                type="tel"
                id="phone"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <FormLabel htmlFor="error-input">
                Field with Error
              </FormLabel>
              <input
                type="text"
                id="error-input"
                className="w-full px-4 py-3 border border-error-500 rounded-lg"
              />
              <HelperText error>This field is required</HelperText>
            </div>
          </div>

          {/* Badges */}
          <div>
            <Caption className="mb-4">Status Badges</Caption>
            <div className="flex flex-wrap gap-3">
              <BadgeText variant="default">Default</BadgeText>
              <BadgeText variant="success">In Stock</BadgeText>
              <BadgeText variant="warning">Limited</BadgeText>
              <BadgeText variant="error">Sold Out</BadgeText>
              <BadgeText variant="info">New</BadgeText>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <Caption className="mb-4">Tab Navigation</Caption>
            <div className="flex items-center gap-6 border-b border-stone-200">
              <button className="pb-3 border-b-2 border-charcoal-900">
                <TabText active>Overview</TabText>
              </button>
              <button className="pb-3">
                <TabText>Specifications</TabText>
              </button>
              <button className="pb-3">
                <TabText>Reviews</TabText>
              </button>
              <button className="pb-3" disabled>
                <TabText disabled>Coming Soon</TabText>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="section-apple bg-charcoal-900 text-white">
        <div className="container-apple text-center space-y-8">
          <SectionHeadline className="text-white">
            Built for Everyone
          </SectionHeadline>
          <Text size="xl" color="inverse" className="max-w-3xl mx-auto">
            Every component meets WCAG AAA standards with contrast ratios exceeding 7:1 for
            normal text and 4.5:1 for large text. Semantic HTML, proper heading hierarchy, and
            comprehensive ARIA support ensure accessibility for all users.
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="space-y-2">
              <Text size="lg" weight="semibold" color="inverse">
                16.63:1
              </Text>
              <Caption color="inverse">Primary Text Contrast</Caption>
            </div>
            <div className="space-y-2">
              <Text size="lg" weight="semibold" color="inverse">
                680px
              </Text>
              <Caption color="inverse">Optimal Reading Width</Caption>
            </div>
            <div className="space-y-2">
              <Text size="lg" weight="semibold" color="inverse">
                ~9KB
              </Text>
              <Caption color="inverse">Total System Size (gzipped)</Caption>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-dense bg-stone-100 border-t border-stone-200">
        <div className="container-apple">
          <div className="text-center space-y-4">
            <Text size="sm" color="tertiary">
              Typography System v1.0.0 · Agents 31-40 · December 2024
            </Text>
            <Caption color="muted">
              Built with precision, optimized for performance, designed for everyone.
            </Caption>
          </div>
        </div>
      </footer>
    </div>
  );
}
