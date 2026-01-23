import { HeroSection } from '@/components/home/hero-section'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { Button } from '@/components/ui/button'
import { getAllProducts } from '@/lib/data/products'
import { CheckCircle, MapPin, Star } from 'lucide-react'
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
      <HeroSection />

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

      {/* Featured Products - Bento Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">The Collection.</h2>
          <p className="mt-4 text-xl font-medium text-gray-500">Engineered for elegance.</p>
        </div>

        <BentoGrid className="mx-auto max-w-7xl">
          {featuredProducts.map((product, i) => (
            <BentoGridItem
              key={product.id}
              title={product.name}
              description={`${product.description?.substring(0, 60)}...`}
              image={product.images[0]?.url || '/placeholder.jpg'}
              href={`/products/${product.slug}`}
              price={new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
                product.price / 100
              )}
              className={
                i === 0 || i === 3 ? 'min-h-[500px] md:col-span-2 md:row-span-2' : 'min-h-[300px]'
              }
            />
          ))}
        </BentoGrid>
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
