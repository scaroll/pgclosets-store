import { VideoHero } from '@/components/home/hero'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { Button } from '@/components/ui/button'
import { getAllProducts } from '@/lib/data/products'
import { CheckCircle, MapPin, Star } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const featuredProducts = getAllProducts()
    .filter(p => p.featured)
    .slice(0, 6)
    .map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice || null,
      images: product.images?.map(url => ({ url, alt: product.name })) || [],
      category: product.category,
      featured: true,
      inventory: product.inStock ? 10 : 0,
    }))

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* Hero Section */}
      <VideoHero />

      {/* Trust Indicators - Apple Ribbon Style */}
      <section className="border-b border-apple-gray-200 bg-apple-gray-100 py-16 dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 text-center md:grid-cols-4">
            <TrustItem icon={<CheckCircle className="size-5" />} text="Lifetime Warranty" />
            <TrustItem icon={<Star className="size-5" />} text="5-Star Rated" />
            <TrustItem icon={<MapPin className="size-5" />} text="Ottawa Local" />
            <TrustItem icon={<CheckCircle className="size-5" />} text="Authorized Dealer" />
          </div>
        </div>
      </section>

      {/* Featured Collection - Vertical Rhythm 120px */}
      <section className="py-32 md:py-48">
        <div className="container mx-auto px-6">
          <div className="mb-20 animate-fade-up text-center">
            <h2 className="font-sf-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              The Collection.
            </h2>
            <p className="mt-6 text-xl font-medium text-muted-foreground lg:text-2xl">
              Engineered for elegance. Built for Ottawa.
            </p>
          </div>

          <BentoGrid className="mx-auto max-w-7xl">
            {featuredProducts.map((product, i) => (
              <BentoGridItem
                key={product.id}
                title={product.name}
                description={`${product.description?.substring(0, 80)}...`}
                image={product.images[0]?.url || '/placeholder.jpg'}
                href={`/products/${product.slug}`}
                price={new Intl.NumberFormat('en-CA', {
                  style: 'currency',
                  currency: 'CAD',
                }).format(product.price / 100)}
                className={
                  i === 0 || i === 3 ? 'min-h-[600px] md:col-span-2 md:row-span-2' : 'min-h-[350px]'
                }
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Service Areas - Dark Material */}
      <section className="bg-apple-gray-900 py-32 text-white dark:bg-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-12 animate-fade-up font-sf-display text-3xl font-semibold md:text-4xl lg:text-5xl">
            Serving the Greater Ottawa Area
          </h2>
          <div className="flex animate-fade-up flex-wrap justify-center gap-4 delay-100">
            {['Ottawa', 'Kanata', 'Barrhaven', 'Nepean', 'Orleans', 'Stittsville', 'Manotick'].map(
              area => (
                <span
                  key={area}
                  className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-medium backdrop-blur-xl transition-colors hover:bg-white/10"
                >
                  {area}
                </span>
              )
            )}
          </div>
          <p className="mt-12 animate-fade-up text-apple-gray-400 delay-200">
            Expert design consultation for every neighborhood.{' '}
            <Link
              href="/contact"
              className="text-white underline underline-offset-4 transition-colors hover:text-primary"
            >
              Contact us
            </Link>
          </p>
        </div>
      </section>

      {/* CTA - Final Hook */}
      <section className="relative overflow-hidden py-32 text-center md:py-48">
        <div className="container relative z-10 mx-auto max-w-3xl px-6">
          <h2 className="mb-8 font-sf-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Organization. Elevated.
          </h2>
          <p className="mb-12 text-xl leading-relaxed text-muted-foreground md:text-2xl">
            Schedule a free in-home consultation with our design experts today.
          </p>
          <Button size="lg" asChild className="h-14 px-12 text-lg font-semibold shadow-apple-lg">
            <Link href="/book">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="group flex cursor-default flex-col items-center gap-4">
      <div className="flex items-center justify-center rounded-2xl bg-white p-4 text-primary shadow-apple-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-apple-md dark:bg-apple-dark-bg-secondary">
        {icon}
      </div>
      <span className="text-sm font-semibold tracking-tight text-apple-gray-700 dark:text-apple-gray-300">
        {text}
      </span>
    </div>
  )
}
