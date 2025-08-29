import type { ArcatProduct } from "../../lib/enhanced-renin-products"
import { ProductCard } from "./product-card"

interface FeaturedProductsProps {
  products: ArcatProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="section-apple">
      <div className="container-apple">
        <div className="text-center mb-16">
          <h2 className="text-h2 mb-4">Featured Products</h2>
          <p className="text-body-l text-pg-gray max-w-2xl mx-auto">
            Our most popular closet door solutions, trusted by hundreds of Ottawa homeowners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-apple">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 3} // Priority loading for first 3 products (above-the-fold)
            />
          ))}
        </div>
      </div>
    </section>
  )
}
