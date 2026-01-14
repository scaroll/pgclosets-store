import type { ArcatProduct } from "../../lib/enhanced-renin-products"
import { ProductCard } from "./product-card"
import { memo } from "react"

interface FeaturedProductsProps {
  products: ArcatProduct[]
}

export const FeaturedProducts = memo(function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="section-apple">
      <div className="container-apple">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extralight tracking-tight mb-4">Featured Products</h2>
          <p className="text-xl font-light text-slate-600 max-w-2xl mx-auto">
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
})