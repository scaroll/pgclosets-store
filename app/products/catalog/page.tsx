import { Metadata } from 'next'
import { ProductGrid } from '@/components/products/ProductGrid'

export const metadata: Metadata = {
  title: 'Product Catalog | PG Closets',
  description: 'Browse our complete collection of premium closet doors, barn doors, and interior door systems.',
}

export default function ProductCatalogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="border-b bg-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Premium Door Collection
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Discover our curated selection of barn doors, bypass systems, bifold doors,
              and glass panels. Each piece designed to elevate your space.
            </p>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="container mx-auto px-4 py-12">
        <ProductGrid
          layout="masonry"
          itemsPerPage={16}
          showFilters={true}
        />
      </section>
    </main>
  )
}
