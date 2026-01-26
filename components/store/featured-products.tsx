import type { ArcatProduct } from "../../lib/enhanced-renin-products"
import { ProductCard } from "./product-card"

interface FeaturedProductsProps {
  products: ArcatProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="section bg-muted/30">
      <div className="container-default">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-overline text-accent mb-3">Best Sellers</p>
          <h2 className="text-h2 mb-4">Featured Products</h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Our most popular closet door solutions, trusted by hundreds of Ottawa homeowners
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 3}
            />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <a
            href="/store/products"
            className="btn btn-secondary btn-lg"
          >
            View All Products
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
