import { Metadata } from 'next'
import { motion } from 'motion/react'
import { ProductCard } from '@/components/ui/product-card'
import { getAllProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Collection',
  description: 'Explore our collection of handcrafted closet doors.',
}

export default function CollectionPage() {
  const products = getAllProducts()

  return (
    <main className="pt-20">
      {/* Header */}
      <section className="section-padding bg-white">
        <div className="container-content text-center">
          <h1 className="text-display text-[var(--color-primary)]">
            The Collection
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--color-secondary)]">
            Four designs. Each one a statement of quiet confidence.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="section-padding bg-[var(--color-surface)]">
        <div className="container-content">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
