'use client'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/stores/cart-store'
import { cn } from '@/lib/utils'
import { Check, Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

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

  const { addItem, openCart } = useCartStore()

  const handleAddToCart = async () => {
    setIsAdding(true)

    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      addItem({
        productId: product.id,
        variantId,
        name: product.name,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        image: product.image,
        quantity,
      })

      setIsAdded(true)

      // Auto open cart after adding
      setTimeout(() => {
        openCart()
      }, 500)

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
    <div className={cn('flex gap-3', className)}>
      <Button
        onClick={handleAddToCart}
        disabled={disabled || isAdding || isAdded}
        size="lg"
        className="h-14 flex-1 text-base font-semibold"
      >
        {isAdded ? (
          <>
            <Check className="h-5 w-5" />
            Configuration Reserved
          </>
        ) : isAdding ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Reserve Configuration
          </>
        )}
      </Button>

      <Button
        onClick={handleToggleWishlist}
        size="lg"
        variant="outline"
        className={cn(
          'h-14 px-4',
          isWishlisted &&
            'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
        )}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={cn('h-5 w-5', isWishlisted && 'fill-current')} />
      </Button>
    </div>
  )
}
