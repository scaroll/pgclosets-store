'use client'

import { Button } from '@/components/ui/button'
import { usePaddle, type PaddleItem, type PaddleCustomer } from '@/hooks/use-paddle'
import { useCart, type CartItem } from '@/hooks/use-cart'
import { useState } from 'react'
import { Loader2, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

interface CartCheckoutButtonProps {
  customer?: PaddleCustomer
  successUrl?: string
  cancelUrl?: string
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  onCancel?: () => void
  className?: string
  disabled?: boolean
}

export function CartCheckoutButton({
  customer,
  successUrl,
  cancelUrl,
  onSuccess,
  onError,
  onCancel,
  className,
  disabled = false,
}: CartCheckoutButtonProps) {
  const { items, total, clearCart, formatPrice } = useCart()
  const { isLoaded, isLoading, error, openCheckout } = usePaddle()
  const [localLoading, setLocalLoading] = useState(false)

  const formatCartPrice = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount)
  }

  const handleCheckout = async () => {
    if (!isLoaded || isLoading || localLoading || items.length === 0) return

    setLocalLoading(true)

    try {
      // Convert cart items to Paddle items
      const paddleItems: PaddleItem[] = items.map((item: CartItem) => ({
        priceId: item.id, // In a real app, this would be the Paddle price ID
        quantity: item.quantity
      }))

      await openCheckout({
        items: paddleItems,
        customer,
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'en',
          allowLogout: false,
          successUrl: successUrl || `${window.location.origin}/checkout/success`,
          cancelUrl: cancelUrl || window.location.href,
        }
      })

      // Clear cart on successful checkout initiation
      clearCart()
      onSuccess?.(paddleItems)
      
      toast.success("Checkout initiated!", {
        description: `Total: ${formatCartPrice(total)} • ${items.length} items`
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed'
      onError?.(errorMessage)
      toast.error("Checkout failed", {
        description: errorMessage
      })
    } finally {
      setLocalLoading(false)
    }
  }

  const isButtonDisabled = disabled || !isLoaded || isLoading || localLoading || items.length === 0

  if (items.length === 0) {
    return (
      <Button disabled className={className}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Cart is empty
      </Button>
    )
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={isButtonDisabled}
      className={className}
    >
      {(isLoading || localLoading) ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Checkout {formatCartPrice(total)} ({items.length} items)
        </>
      )}
    </Button>
  )
}

interface CartSummaryProps {
  className?: string
}

export function CartSummary({ className }: CartSummaryProps) {
  const { items, total, itemCount } = useCart()

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount)
  }

  if (itemCount === 0) {
    return (
      <div className={`text-center text-muted-foreground ${className}`}>
        Your cart is empty
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span>Items ({itemCount})</span>
        <span>{formatPrice(total)}</span>
      </div>
      <div className="border-t pt-2">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Includes applicable Canadian taxes
        </p>
      </div>
    </div>
  )
}