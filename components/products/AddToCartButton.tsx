'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  productId: string
  variantId?: string
  className?: string
}

export function AddToCartButton({ productId, variantId, className }: AddToCartButtonProps) {
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
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={addToCart}
      disabled={loading}
      className={cn(
        'apple-ease relative h-11 flex-1 rounded-full bg-foreground text-background transition-all active:scale-95 hover:bg-foreground/90',
        className
      )}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      <span className="hidden sm:inline">Add to Cart</span>
      <span className="sm:hidden">Add</span>
    </Button>
  )
}
