import type { ArcatProduct } from "../../lib/enhanced-renin-products"
import { ProductCard } from "./product-card"
import { memo } from "react"

interface ProductGridProps {
  products: ArcatProduct[]
}

export const ProductGrid = memo(function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">No products found</p>
        <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-apple">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
})