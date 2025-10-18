/**
 * AppleButton Component Usage Examples
 *
 * This file demonstrates all variants and features of the AppleButton component
 */

'use client'

import { AppleButton } from '@/components/ui/AppleButton'
import { Download, ArrowRight, Star } from 'lucide-react'

export function AppleButtonShowcase() {
  return (
    <div className="space-y-12 p-8">

      {/* Basic Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <AppleButton variant="primary">Primary Button</AppleButton>
          <AppleButton variant="secondary">Secondary Button</AppleButton>
          <AppleButton variant="tertiary">Tertiary Button</AppleButton>
          <AppleButton variant="ghost">Ghost Button</AppleButton>
          <AppleButton variant="outline">Outline Button</AppleButton>
          <AppleButton variant="link">Link Button</AppleButton>
          <AppleButton variant="destructive">Destructive Button</AppleButton>
        </div>
      </section>

      {/* Button Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Button Sizes</h2>
        <div className="flex items-center flex-wrap gap-4">
          <AppleButton size="sm">Small Button</AppleButton>
          <AppleButton size="md">Medium Button</AppleButton>
          <AppleButton size="lg">Large Button</AppleButton>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-4">
          <AppleButton icon={<Download />} iconPosition="left">
            Download
          </AppleButton>
          <AppleButton
            variant="secondary"
            icon={<ArrowRight />}
            iconPosition="right"
          >
            Continue
          </AppleButton>
          <AppleButton
            variant="outline"
            icon={<Star />}
            iconPosition="left"
          >
            Favorite
          </AppleButton>
        </div>
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Loading States</h2>
        <div className="flex flex-wrap gap-4">
          <AppleButton loading variant="primary">
            Processing...
          </AppleButton>
          <AppleButton loading variant="secondary">
            Loading...
          </AppleButton>
          <AppleButton loading variant="destructive">
            Deleting...
          </AppleButton>
        </div>
      </section>

      {/* Success/Error States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Success & Error States</h2>
        <div className="flex flex-wrap gap-4">
          <AppleButton success variant="primary">
            Saved Successfully
          </AppleButton>
          <AppleButton error variant="destructive">
            Error Occurred
          </AppleButton>
          <AppleButton success variant="outline">
            Completed
          </AppleButton>
        </div>
      </section>

      {/* A/B Test Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">A/B Test Variants</h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Variant A - Subtle shadows (Default)</p>
          <AppleButton abVariant="A" variant="primary">
            Get Started
          </AppleButton>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Variant B - Pronounced 3D with shimmer</p>
          <AppleButton abVariant="B" variant="primary">
            Get Started
          </AppleButton>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Variant C - Flat minimal</p>
          <AppleButton abVariant="C" variant="primary">
            Get Started
          </AppleButton>
        </div>
      </section>

      {/* Disabled States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Disabled States</h2>
        <div className="flex flex-wrap gap-4">
          <AppleButton disabled variant="primary">
            Disabled Primary
          </AppleButton>
          <AppleButton disabled variant="secondary">
            Disabled Secondary
          </AppleButton>
          <AppleButton disabled variant="outline">
            Disabled Outline
          </AppleButton>
        </div>
      </section>

      {/* Real-World Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Real-World Examples</h2>

        {/* CTA Section */}
        <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">
            Transform Your Space Today
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get a free consultation and see how we can help organize your home.
          </p>
          <div className="flex flex-wrap gap-4">
            <AppleButton
              size="lg"
              icon={<ArrowRight />}
              iconPosition="right"
            >
              Book Free Consultation
            </AppleButton>
            <AppleButton
              size="lg"
              variant="secondary"
            >
              View Portfolio
            </AppleButton>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">
            Contact Form Actions
          </h3>
          <div className="flex flex-wrap gap-4">
            <AppleButton variant="primary">
              Submit
            </AppleButton>
            <AppleButton variant="ghost">
              Cancel
            </AppleButton>
          </div>
        </div>

        {/* Product Actions */}
        <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">
            Product Page Actions
          </h3>
          <div className="flex flex-wrap gap-4">
            <AppleButton
              size="lg"
              variant="primary"
              icon={<Download />}
              iconPosition="left"
            >
              Add to Cart
            </AppleButton>
            <AppleButton
              size="lg"
              variant="outline"
              icon={<Star />}
              iconPosition="left"
            >
              Add to Wishlist
            </AppleButton>
          </div>
        </div>
      </section>

    </div>
  )
}

// Usage in your components:
/*

// Basic usage
<AppleButton onClick={handleClick}>
  Click me
</AppleButton>

// With loading state
<AppleButton loading={isLoading} onClick={handleSubmit}>
  {isLoading ? 'Saving...' : 'Save Changes'}
</AppleButton>

// With success feedback
<AppleButton success={isSaved} variant="primary">
  {isSaved ? 'Saved!' : 'Save'}
</AppleButton>

// With icon
<AppleButton
  icon={<Download />}
  iconPosition="left"
  onClick={handleDownload}
>
  Download Report
</AppleButton>

// A/B testing variant
<AppleButton
  abVariant={experimentVariant} // 'A', 'B', or 'C'
  variant="primary"
>
  Get Started
</AppleButton>

*/
