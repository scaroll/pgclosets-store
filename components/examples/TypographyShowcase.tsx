/**
 * Typography Showcase Component
 * Demonstrates the complete luxury typography system
 * Use this for reference and testing
 */

import React from 'react';
import {
  Display,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Body,
  Lead,
  Caption,
  Overline,
  Blockquote,
  Pullquote,
  Code,
  Pre,
  ReadingContainer,
} from '../ui/Typography';

export function TypographyShowcase() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-24">
      {/* Display Typography */}
      <section>
        <Overline className="mb-4">Display Typography</Overline>
        <div className="space-y-8">
          <div>
            <Caption className="mb-2">Display XL</Caption>
            <Display size="xl">
              Luxury Closet Solutions
            </Display>
          </div>
          <div>
            <Caption className="mb-2">Display LG</Caption>
            <Display size="lg">
              Transform Your Space
            </Display>
          </div>
          <div>
            <Caption className="mb-2">Display MD</Caption>
            <Display size="md">
              Elegant Organization
            </Display>
          </div>
        </div>
      </section>

      {/* Heading Hierarchy */}
      <section>
        <Overline className="mb-4">Heading Hierarchy</Overline>
        <div className="space-y-6">
          <div>
            <Caption className="mb-2">H1 - Page Title</Caption>
            <H1>Custom Closets & Storage Solutions</H1>
          </div>
          <div>
            <Caption className="mb-2">H2 - Section Heading</Caption>
            <H2>Our Services</H2>
          </div>
          <div>
            <Caption className="mb-2">H3 - Subsection Heading</Caption>
            <H3>Premium Closet Systems</H3>
          </div>
          <div>
            <Caption className="mb-2">H4 - Group Heading</Caption>
            <H4>Walk-in Closets</H4>
          </div>
          <div>
            <Caption className="mb-2">H5 - Item Heading</Caption>
            <H5>Custom Shelving</H5>
          </div>
          <div>
            <Caption className="mb-2">H6 - Label Heading</Caption>
            <H6>Product Details</H6>
          </div>
        </div>
      </section>

      {/* Body Text */}
      <section>
        <Overline className="mb-4">Body Typography</Overline>
        <ReadingContainer>
          <div className="space-y-6">
            <div>
              <Caption className="mb-2">Lead Paragraph (XL)</Caption>
              <Lead>
                Experience the perfect blend of functionality and elegance with our
                custom closet solutions. Each design is thoughtfully crafted to enhance
                your daily routine while adding timeless beauty to your home.
              </Lead>
            </div>
            <div>
              <Caption className="mb-2">Body Large</Caption>
              <Body size="lg">
                Our design philosophy centers on creating spaces that not only organize
                your belongings but also inspire you every day. We believe that luxury
                is in the details—from the smooth glide of drawers to the perfect
                placement of lighting.
              </Body>
            </div>
            <div>
              <Caption className="mb-2">Body Base (Default)</Caption>
              <Body>
                Transform your closet into a personal sanctuary with custom features
                tailored to your lifestyle. Choose from premium materials, innovative
                storage solutions, and elegant finishes that reflect your unique style.
                Our expert designers work closely with you to create a space that
                maximizes functionality without compromising on aesthetics.
              </Body>
            </div>
            <div>
              <Caption className="mb-2">Body Small</Caption>
              <Body size="sm">
                Available in multiple finish options including natural wood, painted
                surfaces, and specialty materials. All installations include lifetime
                warranty on hardware and five-year warranty on materials.
              </Body>
            </div>
            <div>
              <Caption className="mb-2">Body XS</Caption>
              <Body size="xs">
                Proudly serving Ottawa and surrounding areas since 2010.
              </Body>
            </div>
          </div>
        </ReadingContainer>
      </section>

      {/* Special Typography */}
      <section>
        <Overline className="mb-4">Special Elements</Overline>
        <div className="space-y-8">
          <div>
            <Caption className="mb-2">Blockquote</Caption>
            <Blockquote
              author="Sarah M."
              cite="Ottawa, ON"
            >
              The team at PG Closets transformed our master bedroom closet into a
              stunning, organized space. The attention to detail and quality of
              craftsmanship exceeded our expectations.
            </Blockquote>
          </div>

          <div>
            <Caption className="mb-2">Pullquote</Caption>
            <Pullquote>
              Every closet tells a story. We design yours to be one of elegance,
              organization, and lasting beauty.
            </Pullquote>
          </div>

          <div>
            <Caption className="mb-2">Inline Code</Caption>
            <Body>
              Use the <Code>font-display</Code> class to apply the Cormorant Garamond
              font family to any element.
            </Body>
          </div>

          <div>
            <Caption className="mb-2">Code Block</Caption>
            <Pre language="css">
{`/* Apply luxury typography */
.heading {
  font-family: var(--font-display);
  font-size: var(--font-size-h1);
  letter-spacing: var(--letter-spacing-tight);
}`}
            </Pre>
          </div>
        </div>
      </section>

      {/* Font Features */}
      <section>
        <Overline className="mb-4">OpenType Features</Overline>
        <div className="space-y-6">
          <div>
            <Caption className="mb-2">Tabular Numbers</Caption>
            <Body className="font-feature-numbers">
              1234567890 • $1,234.56 • 10:30 AM
            </Body>
          </div>
          <div>
            <Caption className="mb-2">Oldstyle Numbers</Caption>
            <Body className="font-feature-oldstyle">
              1234567890 • $1,234.56 • 10:30 AM
            </Body>
          </div>
          <div>
            <Caption className="mb-2">Small Caps</Caption>
            <Body className="font-small-caps">
              Premium Quality Materials
            </Body>
          </div>
          <div>
            <Caption className="mb-2">Ligatures</Caption>
            <Body className="font-ligatures">
              Office • Efficient • Affluent •ffle
            </Body>
          </div>
        </div>
      </section>

      {/* Text Utilities */}
      <section>
        <Overline className="mb-4">Text Utilities</Overline>
        <div className="space-y-4">
          <div>
            <Caption className="mb-2">Font Weights</Caption>
            <div className="space-y-2">
              <Body className="font-light">Light (300)</Body>
              <Body className="font-normal">Normal (400)</Body>
              <Body className="font-medium">Medium (500)</Body>
              <Body className="font-semibold">Semibold (600)</Body>
              <Body className="font-bold">Bold (700)</Body>
            </div>
          </div>

          <div>
            <Caption className="mb-2">Font Styles</Caption>
            <div className="space-y-2">
              <Body className="not-italic">Normal text</Body>
              <Body className="italic">Italic text</Body>
            </div>
          </div>

          <div>
            <Caption className="mb-2">Text Transform</Caption>
            <div className="space-y-2">
              <Body className="uppercase">Uppercase text</Body>
              <Body className="lowercase">Lowercase text</Body>
              <Body className="capitalize">Capitalized text</Body>
            </div>
          </div>

          <div>
            <Caption className="mb-2">Text Decoration</Caption>
            <div className="space-y-2">
              <Body className="underline">Underlined text</Body>
              <Body className="line-through">Strikethrough text</Body>
              <Body className="no-underline">No underline</Body>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Typography */}
      <section>
        <Overline className="mb-4">Responsive Behavior</Overline>
        <ReadingContainer>
          <Body>
            All typography scales fluidly between mobile and desktop sizes using CSS
            <Code>clamp()</Code> function. This ensures optimal readability across all
            devices without requiring media query breakpoints. Resize your browser to
            see the smooth scaling in action.
          </Body>
        </ReadingContainer>
      </section>

      {/* Color & Contrast */}
      <section>
        <Overline className="mb-4">Color & Contrast</Overline>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border">
            <Body className="text-pg-text-primary mb-2">
              Primary Text (WCAG AAA) - 16.63:1 contrast ratio
            </Body>
            <Body className="text-pg-text-secondary mb-2">
              Secondary Text (WCAG AA) - 7.42:1 contrast ratio
            </Body>
            <Caption className="text-pg-text-tertiary">
              Tertiary Text (WCAG AA) - 4.76:1 contrast ratio
            </Caption>
          </div>
        </div>
      </section>

      {/* Reading Experience */}
      <section>
        <Overline className="mb-4">Optimal Reading Experience</Overline>
        <ReadingContainer>
          <H3 className="mb-4">The Art of Custom Closets</H3>
          <Lead className="mb-6">
            Creating the perfect closet is an art form that requires careful attention
            to proportion, materials, and the unique needs of each client.
          </Lead>
          <Body className="mb-4">
            Our approach begins with understanding how you live. We consider your daily
            routines, wardrobe requirements, and personal style preferences. This
            foundation allows us to design spaces that feel intuitive and effortless to use.
          </Body>
          <Body className="mb-4">
            Premium materials are the cornerstone of our designs. We source sustainable
            hardwoods, durable hardware, and eco-friendly finishes that stand the test
            of time. Each component is selected not only for its beauty but for its
            performance and longevity.
          </Body>
          <Blockquote author="Design Philosophy">
            A well-designed closet should feel like a natural extension of your home—
            elegant, functional, and uniquely yours.
          </Blockquote>
          <Body className="mb-4">
            Lighting plays a crucial role in the overall ambiance. We incorporate LED
            systems that provide even, natural illumination while remaining energy-efficient.
            The result is a space that's both practical and inviting at any time of day.
          </Body>
          <Body>
            From initial consultation to final installation, we're with you every step
            of the way. Our team ensures that your vision becomes reality, delivered
            with the precision and care you deserve.
          </Body>
        </ReadingContainer>
      </section>

      {/* Performance Notes */}
      <section className="bg-pearl p-8 rounded-lg">
        <Overline className="mb-4">Performance Characteristics</Overline>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <H5 className="mb-2">Font Loading</H5>
            <Body size="sm">
              • Variable font support for reduced file size<br />
              • font-display: swap for instant text rendering<br />
              • Preloaded critical fonts in layout<br />
              • Sub-100ms font load time target
            </Body>
          </div>
          <div>
            <H5 className="mb-2">Rendering Quality</H5>
            <Body size="sm">
              • -webkit-font-smoothing: antialiased<br />
              • -moz-osx-font-smoothing: grayscale<br />
              • text-rendering: optimizeLegibility<br />
              • OpenType feature support (liga, kern)
            </Body>
          </div>
          <div>
            <H5 className="mb-2">Accessibility</H5>
            <Body size="sm">
              • WCAG AA contrast ratios minimum<br />
              • Semantic HTML structure<br />
              • Reduced motion support<br />
              • High contrast mode optimization
            </Body>
          </div>
          <div>
            <H5 className="mb-2">Responsive Design</H5>
            <Body size="sm">
              • Fluid typography with clamp()<br />
              • No media query overhead<br />
              • Optimal reading width (65ch)<br />
              • text-wrap: balance & pretty
            </Body>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TypographyShowcase;
