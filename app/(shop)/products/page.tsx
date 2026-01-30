import Link from 'next/link'

const PLACEHOLDER_PRODUCTS = [
  { id: '1', name: 'Classic Wardrobe', price: 2499, slug: 'classic-wardrobe' },
  { id: '2', name: 'Modern Reach-In', price: 1899, slug: 'modern-reach-in' },
  { id: '3', name: 'Walk-In Closet System', price: 3499, slug: 'walk-in-closet-system' },
  { id: '4', name: 'Corner Unit', price: 1299, slug: 'corner-unit' },
  { id: '5', name: 'Double Hanging Rod', price: 899, slug: 'double-hanging-rod' },
  { id: '6', name: 'Shelving Module', price: 699, slug: 'shelving-module' },
]

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-center text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
            Our Collection
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-neutral-600">
            Premium closet systems designed for modern living. Crafted with precision, built to
            last.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {PLACEHOLDER_PRODUCTS.map(product => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group block overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors hover:border-neutral-400"
              >
                {/* Image Placeholder */}
                <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                  <span className="text-sm text-neutral-400">Product Image</span>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-lg font-medium text-neutral-900 transition-colors group-hover:text-neutral-700">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-semibold text-neutral-900">
                      ${product.price.toLocaleString()}
                    </p>
                    <span className="text-sm text-blue-600 transition-colors group-hover:text-blue-700">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
