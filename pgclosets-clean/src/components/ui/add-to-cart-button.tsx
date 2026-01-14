'use client'

import { useState } from "react"
import { Button } from "./button"
import type { ArcatProduct } from "../../lib/enhanced-renin-products"

interface AddToCartButtonProps {
  product: ArcatProduct
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)

    // Simulate API call or cart addition
    await new Promise(resolve => setTimeout(resolve, 500))

    // In a real implementation, this would interact with a cart context or API
    console.log('Added to cart:', product.name)

    setIsAdding(false)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding || !product.inStock}
      className={className}
    >
      {isAdding ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
    </Button>
  )
}