import { ProductCard } from '@/components/products/ProductCard'
import { ProductFilters } from '@/components/products/ProductFilters'
import { SAMPLE_PRODUCTS } from '@/lib/products'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; search?: string }
}) {
  const { category, sort = 'featured', search } = searchParams

  // Use static sample products
  // Filter products in memory
  let filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    // Status check (assume all active for now)
    if (false) return false // No status field in SAMPLE_PRODUCTS

    // Category filter
    if (category && product.category !== category) return false

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      const matchesName = product.name.toLowerCase().includes(searchLower)
      const matchesDesc = product.description.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesDesc) return false
    }

    return true
  })

  // Sort products
  filteredProducts = filteredProducts.sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      // case 'newest': // No createdAt in SAMPLE_PRODUCTS
      //   return 0
      default: // featured
        return 0 // Preserve order
    }
  })

  const products = filteredProducts.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.id,
    description: product.description,
    price: product.price * 100, // Convert dollars to cents
    salePrice: null,
    images: product.images?.map(url => ({ url, alt: product.name })) || [],
    category: product.category,
    featured: true,
    inventory: 10,
  }))

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Products Hero/Header Section */}
      <section className="bg-apple-gray-50 pb-16 pt-32 dark:bg-apple-dark-bg-secondary">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-apple-blue-600">
              Collection
            </p>
            <h1 className="animate-fade-up font-sf-display text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-5xl lg:text-6xl">
              Our Products
            </h1>
            <p className="mt-6 animate-fade-up text-lg text-muted-foreground delay-100">
              Precision-engineered closets and hardware designed for durability and architectural
              elegance.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            <aside className="lg:col-span-1">
              <div className="sticky top-28">
                <ProductFilters />
              </div>
            </aside>

            <main className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}
