"use client"

import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { useMedusaCart } from "@/hooks/use-medusa-cart"
import type { Product } from "@medusajs/medusa"

interface MedusaProductCardProps {
  product: Product
  className?: string
}

export function MedusaProductCard({ product, className = "" }: MedusaProductCardProps) {
  const { addToCart, loading } = useMedusaCart()

  const handleAddToCart = async () => {
    if (!product.variants?.[0]?.id) return

    try {
      await addToCart(product.variants[0].id, 1)
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const price = product.variants?.[0]?.prices?.[0]?.amount || 0
  const formattedPrice = (price / 100).toFixed(2)

  return (
    <div className={`card-apple group hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="aspect-square bg-pg-offwhite rounded-lg mb-4 overflow-hidden">
        {product.thumbnail ? (
          <OptimizedImage
            src={product.thumbnail}
            alt={`${product.title} - Premium closet door - PG Closets`}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-pg-light rounded-lg" />
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-h4 mb-2 group-hover:text-pg-sky transition-colors">{product.title}</h3>
        <p className="text-body-s text-pg-gray mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-h4 text-pg-navy">${formattedPrice} CAD</span>
          <Button variant="primary" size="sm" onClick={handleAddToCart} disabled={loading} className="min-w-[100px]">
            {loading ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  )
}
