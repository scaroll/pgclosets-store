import { Metadata } from 'next'
import { Ruler, Palette, CheckSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Design Process | PG Closets',
  description: 'Our custom design process for closets and doors - from concept to installation.',
}

export default function ProcessDesignPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Design Phase</h1>

        <div className="space-y-8">
          <div className="flex gap-6">
            <Ruler className="h-12 w-12 text-pg-accent flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold mb-3">Precise Measurements</h2>
              <p className="text-gray-700">
                Our team takes detailed measurements of your space, accounting for structural elements,
                electrical outlets, and architectural features to ensure perfect fit.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <Palette className="h-12 w-12 text-pg-accent flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold mb-3">Material Selection</h2>
              <p className="text-gray-700">
                Choose from our premium selection of finishes, hardware, and door styles that complement
                your home's aesthetic and meet your functional requirements.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <CheckSquare className="h-12 w-12 text-pg-accent flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold mb-3">3D Visualization</h2>
              <p className="text-gray-700">
                Review detailed 3D renderings of your custom design, allowing you to visualize the final result
                and make adjustments before production begins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
