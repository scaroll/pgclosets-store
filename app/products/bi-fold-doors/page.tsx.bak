import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Bi-Fold Doors | Space-Saving Solutions | PG Closets',
  description: 'Premium bi-fold door systems for closets and room dividers. Maximize space with elegant, functional design.',
}

export default function BiFoldDoorsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-6">Bi-Fold Doors</h1>
        <p className="text-xl text-gray-700 mb-12">
          Space-saving bi-fold door solutions that combine elegance with functionality
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-pg-accent">✓</span>
                <span>Maximizes usable space in narrow openings</span>
              </li>
              <li className="flex gap-3">
                <span className="text-pg-accent">✓</span>
                <span>Smooth-gliding track system</span>
              </li>
              <li className="flex gap-3">
                <span className="text-pg-accent">✓</span>
                <span>Available in various finishes and styles</span>
              </li>
              <li className="flex gap-3">
                <span className="text-pg-accent">✓</span>
                <span>Ideal for closets, laundry rooms, and pantries</span>
              </li>
            </ul>
          </div>

          <div className="bg-pg-secondary p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Perfect For</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Walk-in closets</li>
              <li>• Reach-in closets</li>
              <li>• Laundry rooms</li>
              <li>• Pantries</li>
              <li>• Storage areas</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pg-primary to-pg-accent text-white p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Bi-Fold Options?</h2>
          <p className="text-lg mb-6">Browse our complete product catalog or request a consultation</p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button variant="secondary" size="lg">View All Products</Button>
            </Link>
            <Link href="/request-work">
              <Button variant="outline" size="lg" className="bg-white text-pg-primary hover:bg-gray-100">
                Get Free Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
