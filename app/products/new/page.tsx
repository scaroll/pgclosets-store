import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'New Arrivals | Latest Products | PG Closets',
  description: 'Explore the latest additions to our closet and door collection. New styles, finishes, and innovative solutions.',
}

export default function NewArrivalsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-8 w-8 text-pg-accent" />
          <h1 className="text-4xl font-bold">New Arrivals</h1>
        </div>

        <p className="text-xl text-gray-700 mb-12">
          Discover the latest additions to our premium collection of closet systems and doors
        </p>

        <div className="bg-pg-secondary p-12 rounded-lg text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
          <p className="text-lg text-gray-700 mb-8">
            We're constantly updating our collection with the latest trends and innovations.
            Check back soon for new arrivals, or browse our complete catalog.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" variant="default">View All Products</Button>
            </Link>
            <Link href="/request-work">
              <Button size="lg" variant="outline">Get Custom Quote</Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/products/barn-doors" className="group">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-pg-accent">Barn Door Systems</h3>
              <p className="text-gray-600">Modern sliding door solutions</p>
            </div>
          </Link>
          <Link href="/products/closet-systems" className="group">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-pg-accent">Closet Systems</h3>
              <p className="text-gray-600">Custom organization solutions</p>
            </div>
          </Link>
          <Link href="/products/hardware" className="group">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-pg-accent">Hardware & Accessories</h3>
              <p className="text-gray-600">Premium finishing touches</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
