import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProduct, getAllProducts, formatPrice } from '@/lib/products'
import { Button } from '@/components/ui/button'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: product.name,
    description: product.story,
    openGraph: {
      title: `${product.name} | PG Closets`,
      description: product.tagline,
      images: [product.images.hero],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <main className="pt-20">
      {/* Hero Image */}
      <section className="relative h-[70vh] w-full">
        <Image
          src={product.images.hero}
          alt={product.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          style={{ viewTransitionName: `product-${product.slug}` }}
        />
      </section>

      {/* Product Info */}
      <section className="section-padding bg-white">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Left: Title and Story */}
            <div>
              <h1 className="text-display text-[var(--color-primary)]">
                {product.name}
              </h1>
              <p className="mt-4 text-xl text-[var(--color-secondary)]">
                {product.tagline}
              </p>
              <p className="mt-8 text-lg leading-relaxed text-[var(--color-secondary)]">
                {product.story}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <span className="text-2xl font-medium text-[var(--color-primary)]">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-[var(--color-accent)]">
                  Starting price
                </span>
              </div>

              <div className="mt-12">
                <Button size="lg">Configure Yours</Button>
              </div>
            </div>

            {/* Right: Specifications */}
            <div className="rounded-lg bg-[var(--color-surface)] p-12">
              <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
                Specifications
              </h2>

              <dl className="mt-8 space-y-6">
                <div>
                  <dt className="text-sm text-[var(--color-secondary)]">
                    Dimensions
                  </dt>
                  <dd className="mt-1 text-[var(--color-primary)]">
                    {product.specs.dimensions}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-[var(--color-secondary)]">
                    Materials
                  </dt>
                  <dd className="mt-1 text-[var(--color-primary)]">
                    {product.specs.materials.join(', ')}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-[var(--color-secondary)]">
                    Finishes
                  </dt>
                  <dd className="mt-1 text-[var(--color-primary)]">
                    {product.specs.finishes.join(', ')}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-[var(--color-secondary)]">
                    Weight
                  </dt>
                  <dd className="mt-1 text-[var(--color-primary)]">
                    {product.specs.weight}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-[var(--color-secondary)]">
                    Craft Time
                  </dt>
                  <dd className="mt-1 text-[var(--color-primary)]">
                    {product.craftHours} hours per door
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Collection */}
      <section className="py-12 bg-[var(--color-surface)]">
        <div className="container-content text-center">
          <Link
            href="/collection"
            className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
          >
            ← Back to Collection
          </Link>
        </div>
      </section>
    </main>
  )
}
