'use client'

import { Button } from '@/components/ui/button'
import { Loader2, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  productId: string
  variantId?: string
  price: number
}

export function AddToCartButton({ productId, variantId, price }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const addToCart = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          variantId,
          quantity: 1,
        }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          void router.push('/auth/signin')
          return
        }
        throw new Error('Failed to add to cart')
      }

      toast.success('Added to cart')
      router.refresh() // Refresh server components (like cart count in header)
    } catch (_error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={addToCart}
      disabled={loading}
      className="w-full bg-black text-white transition-colors duration-200 hover:bg-gray-800"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      Add to Cart - ${(price / 100).toFixed(2)}
    </Button>
  )
}
