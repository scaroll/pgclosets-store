import { ProductCard } from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import { getAllProducts } from '@/lib/data/products'
import { ArrowRight, CheckCircle, MapPin, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Temporarily use static data to prevent build/runtime errors due to missing DB
  // const featuredProducts = await prisma.product.findMany(...)
  const featuredProducts = getAllProducts()
    .filter(p => p.featured)
    .slice(0, 6)
    .map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price, // Already in cents
      salePrice: product.salePrice || null,
      images: product.images?.map(url => ({ url, alt: product.name })) || [],
      category: product.category,
      featured: true,
      inventory: product.inStock ? 10 : 0,
    }))

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex h-[600px] items-center justify-center overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 z-0 opacity-50">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black to-transparent" />
          <Image
            src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Modern kitchen and closet"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="container relative z-20 px-4 text-center md:flex md:items-center md:justify-between md:text-left">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Premium Custom Closets & Doors
            </h1>
            <p className="text-xl text-gray-200 md:text-2xl">
              Transform your space with elegant Renin doors and custom organization solutions.
              Designed in Ottawa, delivered to you.
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button size="lg" asChild className="px-8 text-lg">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white bg-white/10 px-8 text-lg text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Link href="/book">Book Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-b bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <TrustItem icon={<CheckCircle />} text="Lifetime Warranty" />
            <TrustItem icon={<Star />} text="5-Star Rated Service" />
            <TrustItem icon={<MapPin />} text="Local Ottawa Experts" />
            <TrustItem icon={<CheckCircle />} text="Authorized Renin Dealer" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold">Featured Collection</h2>
            <p className="text-gray-600">Our most popular styles and solutions</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 text-primary hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Service Areas */}
      <section className="bg-gray-900 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-8 text-3xl font-bold">Serving the Greater Ottawa Area</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Ottawa', 'Kanata', 'Barrhaven', 'Nepean', 'Orleans', 'Stittsville', 'Manotick'].map(
              area => (
                <span
                  key={area}
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-sm"
                >
                  {area}
                </span>
              )
            )}
          </div>
          <p className="mt-8 text-gray-400">
            Not sure if we cover your area?{' '}
            <Link href="/contact" className="text-white underline">
              Contact us
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-24 text-center text-primary-foreground">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">Ready to Transform Your Home?</h2>
          <p className="mb-10 text-xl opacity-90">
            Schedule a free in-home consultation with our design experts today.
          </p>
          <Button size="lg" variant="secondary" asChild className="h-auto px-10 py-6 text-lg">
            <Link href="/book">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-full bg-white p-3 text-primary shadow-sm">{icon}</div>
      <span className="font-semibold text-gray-900">{text}</span>
    </div>
  )
}
