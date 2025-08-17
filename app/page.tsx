import { Carousel } from '@/components/carousel'
import { ThreeItemGrid } from '@/components/grid/three-items'
import { StoreFooter } from '@/components/store/store-footer'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import type { Metadata } from "next"

// Enable ISR with 24 hour revalidation for homepage
export const revalidate = 86400

export const metadata: Metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and custom product catalog for PG Closets Ottawa.',
  openGraph: {
    type: 'website'
  }
}

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      
      {/* Custom Image Placeholder Section */}
      <section className="mx-auto max-w-screen-2xl px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Custom Image Gallery</h2>
          <p className="text-gray-600">Showcase your custom images and placeholders</p>
          <div className="mt-2 text-sm text-blue-600 font-medium">
            ✨ TEST 2: UI Change - Should trigger full CI/CD pipeline
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* JPG Placeholder Example */}
          <div className="text-center">
            <ImagePlaceholder
              alt="Custom JPG Placeholder"
              width={300}
              height={200}
              className="mx-auto rounded-lg shadow-md"
            />
            <h3 className="mt-3 text-lg font-semibold">JPG Placeholder</h3>
            <p className="text-sm text-gray-500">Ready for your custom image</p>
          </div>
          
          {/* Example with actual image (when you add one) */}
          <div className="text-center">
            <ImagePlaceholder
              src="/images/placeholders/custom-image.jpg"
              alt="Custom uploaded image"
              width={300}
              height={200}
              className="mx-auto rounded-lg shadow-md"
            />
            <h3 className="mt-3 text-lg font-semibold">Your Custom Image</h3>
            <p className="text-sm text-gray-500">Upload any JPG, PNG, or WebP</p>
          </div>
          
          {/* Another placeholder */}
          <div className="text-center">
            <ImagePlaceholder
              alt="Another placeholder"
              width={300}
              height={200}
              className="mx-auto rounded-lg shadow-md"
            />
            <h3 className="mt-3 text-lg font-semibold">Gallery Item</h3>
            <p className="text-sm text-gray-500">Perfect for showcasing work</p>
          </div>
        </div>
      </section>
      
      <StoreFooter />
    </>
  )
}
