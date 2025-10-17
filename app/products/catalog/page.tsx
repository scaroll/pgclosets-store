import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// Dynamically import ProductGrid with loading state
const ProductGrid = dynamic(
  () => import('@/components/products/ProductGrid').then(mod => ({ default: mod.ProductGrid })),
  {
    loading: () => (
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }
)

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
