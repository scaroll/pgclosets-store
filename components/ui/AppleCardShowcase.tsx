'use client'

/**
 * AppleCard Component Showcase
 *
 * Demonstrates all variants and features of the AppleCard component system.
 * This file serves as both documentation and testing for the card component.
 */

import { AppleCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './AppleCard'

export function AppleCardShowcase() {
  return (
    <div className="container mx-auto py-12 space-y-12">

      {/* Section 1: Basic Variants */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold mb-8">Basic Card Variants</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default Variant */}
          <AppleCard variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>
                Subtle shadow with clean borders. Perfect for content cards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This is the default card variant with a clean, minimal design.
                Hover to see the subtle lift effect.
              </p>
            </CardContent>
          </AppleCard>

          {/* Elevated Variant */}
          <AppleCard variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>
                More prominent shadow for emphasis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                The elevated variant stands out with a more pronounced shadow,
                perfect for featured content.
              </p>
            </CardContent>
          </AppleCard>

          {/* Glass Variant */}
          <AppleCard variant="glass">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
              <CardDescription>
                Frosted glass effect with backdrop blur.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Glass morphism effect with transparency and blur,
                ideal for modern, layered interfaces.
              </p>
            </CardContent>
          </AppleCard>

          {/* Dark Variant */}
          <AppleCard variant="dark">
            <CardHeader>
              <CardTitle className="text-white">Dark Card</CardTitle>
              <CardDescription className="text-gray-300">
                Dark background for contrast.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-100">
              <p className="text-sm">
                Dark variant with white/light text,
                great for dark sections or themes.
              </p>
            </CardContent>
          </AppleCard>

          {/* Gradient Variant */}
          <AppleCard variant="gradient">
            <CardHeader>
              <CardTitle>Gradient Card</CardTitle>
              <CardDescription className="text-white/80">
                Eye-catching gradient background.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/90">
                Vibrant gradient perfect for CTAs and
                highlighted promotional content.
              </p>
            </CardContent>
          </AppleCard>

          {/* Featured Variant */}
          <AppleCard variant="featured">
            <CardHeader>
              <CardTitle>Featured Card</CardTitle>
              <CardDescription>
                Highlighted with colored border.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Featured variant with accent border and glow,
                perfect for premium or highlighted items.
              </p>
            </CardContent>
          </AppleCard>
        </div>
      </section>

      {/* Section 2: A/B Test Variants */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold mb-8">A/B Test Variants</h2>
        <p className="text-gray-600 mb-6">
          Three different shadow and interaction styles for conversion optimization testing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Variant A: Subtle */}
          <AppleCard variant="default" abVariant="A">
            <CardHeader>
              <CardTitle>Variant A: Subtle</CardTitle>
              <CardDescription>
                Minimal shadow, gentle lift on hover.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Conservative approach with subtle shadows (2px → 8px).
                Best for content-heavy pages where cards shouldn't distract.
              </p>
            </CardContent>
          </AppleCard>

          {/* Variant B: Pronounced */}
          <AppleCard variant="default" abVariant="B">
            <CardHeader>
              <CardTitle>Variant B: Pronounced</CardTitle>
              <CardDescription>
                Strong shadow, dramatic lift + scale.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Attention-grabbing with pronounced shadows (8px → 16px)
                and scale effect. Includes shine overlay on hover.
              </p>
            </CardContent>
          </AppleCard>

          {/* Variant C: Flat */}
          <AppleCard variant="default" abVariant="C">
            <CardHeader>
              <CardTitle>Variant C: Flat</CardTitle>
              <CardDescription>
                No shadow, background change only.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Ultra-minimal flat design with background tint on hover.
                Modern, clean aesthetic for minimalist interfaces.
              </p>
            </CardContent>
          </AppleCard>
        </div>
      </section>

      {/* Section 3: Special Effects */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold mb-8">Special Effects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 3D Tilt Effect */}
          <AppleCard variant="elevated" tilt>
            <CardHeader>
              <CardTitle>3D Tilt Effect</CardTitle>
              <CardDescription>
                Move your mouse over this card to see the 3D tilt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Interactive 3D tilt effect using Framer Motion.
                The card rotates based on mouse position.
              </p>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white text-sm">
                This content appears to float above the card surface
              </div>
            </CardContent>
          </AppleCard>

          {/* Glow Effect */}
          <AppleCard variant="default" glow>
            <CardHeader>
              <CardTitle>Gradient Glow</CardTitle>
              <CardDescription>
                Hover to reveal the gradient border glow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Animated gradient border that appears on hover,
                perfect for premium or featured products.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs">Premium</span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-xs">Featured</span>
              </div>
            </CardContent>
          </AppleCard>

          {/* Combined Effects */}
          <AppleCard variant="featured" tilt glow abVariant="B">
            <CardHeader>
              <CardTitle>All Effects Combined</CardTitle>
              <CardDescription>
                3D tilt + glow + variant B + featured styling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Maximum visual impact combining all special effects.
                Use sparingly for the most important content.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-xs">Effect 1</div>
                <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded text-xs">Effect 2</div>
              </div>
            </CardContent>
            <CardFooter>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Learn More →
              </button>
            </CardFooter>
          </AppleCard>

          {/* Minimal with Link Behavior */}
          <AppleCard variant="minimal" hover>
            <CardHeader>
              <CardTitle>Minimal Interaction</CardTitle>
              <CardDescription>
                Transparent with subtle hover state.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Perfect for lists where you want minimal visual weight
                but still need hover feedback.
              </p>
            </CardContent>
          </AppleCard>
        </div>
      </section>

      {/* Section 4: Product Display Examples */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold mb-8">Product Display Examples</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product Card 1 */}
          <AppleCard variant="elevated" abVariant="B">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg mb-4" />
            <CardHeader>
              <CardTitle className="text-xl">Premium Closet System</CardTitle>
              <CardDescription>
                Custom walk-in organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">$2,499</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional installation included
              </p>
            </CardContent>
            <CardFooter>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Quote
              </button>
            </CardFooter>
          </AppleCard>

          {/* Product Card 2 */}
          <AppleCard variant="featured" glow>
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              Best Seller
            </div>
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg mb-4" />
            <CardHeader>
              <CardTitle className="text-xl">Reach-In Organizer</CardTitle>
              <CardDescription>
                Standard closet upgrade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">$799</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DIY-friendly installation
              </p>
            </CardContent>
            <CardFooter>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add to Cart
              </button>
            </CardFooter>
          </AppleCard>

          {/* Product Card 3 */}
          <AppleCard variant="elevated" tilt abVariant="A">
            <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg mb-4" />
            <CardHeader>
              <CardTitle className="text-xl">Accessory Kit</CardTitle>
              <CardDescription>
                Essential closet accessories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">$199</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ships in 2-3 business days
              </p>
            </CardContent>
            <CardFooter>
              <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                View Details
              </button>
            </CardFooter>
          </AppleCard>
        </div>
      </section>

      {/* Section 5: Link/Clickable Cards */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold mb-8">Interactive Link Cards</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AppleCard
            variant="link"
            onClick={() => alert('Card clicked!')}
            role="button"
            tabIndex={0}
          >
            <CardHeader>
              <CardTitle>Clickable Card</CardTitle>
              <CardDescription>
                Entire card acts as a button with hover effects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Perfect for navigation cards or feature tiles.
                Border changes color on hover to indicate interactivity.
              </p>
            </CardContent>
          </AppleCard>

          <AppleCard
            variant="minimal"
            onClick={() => alert('Minimal card clicked!')}
            role="button"
            tabIndex={0}
          >
            <CardHeader>
              <CardTitle>Minimal Link Card</CardTitle>
              <CardDescription>
                Lightweight design for list items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Clean, minimal design that reveals interaction on hover.
                Great for menu items or navigation lists.
              </p>
            </CardContent>
          </AppleCard>
        </div>
      </section>

      {/* Usage Guide */}
      <section className="space-y-6 bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">Usage Guide</h2>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Component Props:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li><code>variant</code>: 'default' | 'elevated' | 'glass' | 'dark' | 'gradient' | 'featured' | 'minimal' | 'link'</li>
              <li><code>abVariant</code>: 'A' | 'B' | 'C' (for A/B testing different shadow styles)</li>
              <li><code>hover</code>: boolean (enable/disable hover effects, default: true)</li>
              <li><code>tilt</code>: boolean (enable 3D tilt effect, default: false)</li>
              <li><code>glow</code>: boolean (enable gradient glow border, default: false)</li>
              <li><code>glass</code>: boolean (shorthand for glass variant, default: false)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Sub-components:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li><code>CardHeader</code>: Container for title and description</li>
              <li><code>CardTitle</code>: Main heading (h3 by default)</li>
              <li><code>CardDescription</code>: Subtitle/description text</li>
              <li><code>CardContent</code>: Main content area</li>
              <li><code>CardFooter</code>: Footer with top border</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Best Practices:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li>Use 'default' for most content cards</li>
              <li>Use 'elevated' for featured or important content</li>
              <li>Use 'featured' for premium products or highlighted items</li>
              <li>Use 'minimal' in dense lists to reduce visual clutter</li>
              <li>Use 'glass' over images or colorful backgrounds</li>
              <li>Enable 'tilt' sparingly - only for hero sections or featured items</li>
              <li>Use 'glow' for premium products or special offers</li>
              <li>Test A/B variants to optimize conversion rates</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
