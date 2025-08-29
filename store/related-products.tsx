import type { Product } from "@/lib/renin-products"
import { ProductCard } from "./product-card"

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="section-apple bg-pg-offwhite">
      <div className="container-apple">
        <h2 className="text-h2 mb-8 text-center">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-apple">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
