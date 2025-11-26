'use client'

import { useState } from 'react'
import { ShoppingCart, Check, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  price: number | string
  image?: string
}

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  variantId?: string
  disabled?: boolean
  className?: string
}

export function AddToCartButton({
  product,
  quantity = 1,
  variantId,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)

    try {
      // TODO: Implement actual cart functionality
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          variantId,
          quantity,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }

      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      // TODO: Show error toast
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleWishlist = async () => {
    try {
      // TODO: Implement actual wishlist functionality
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle wishlist')
      }

      setIsWishlisted(!isWishlisted)
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      // TODO: Show error toast
    }
  }

  return (
    <div className={cn("flex gap-3", className)}>
      <Button
        onClick={handleAddToCart}
        disabled={disabled || isAdding || isAdded}
        size="lg"
        className="flex-1 h-14 text-base font-semibold"
      >
        {isAdded ? (
          <>
            <Check className="w-5 h-5" />
            Added to Cart
          </>
        ) : isAdding ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </Button>

      <Button
        onClick={handleToggleWishlist}
        size="lg"
        variant="outline"
        className={cn(
          "h-14 px-4",
          isWishlisted && "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700"
        )}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn(
            "w-5 h-5",
            isWishlisted && "fill-current"
          )}
        />
      </Button>
    </div>
  )
}
