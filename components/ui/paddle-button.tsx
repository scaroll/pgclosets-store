'use client'

import { Button } from '@/components/ui/button'
import { usePaddle, type PaddleItem, type PaddleCustomer, type PaddleCheckoutOptions } from '@/hooks/use-paddle'
import { useState } from 'react'
import { Loader2, ShoppingCart, CreditCard } from 'lucide-react'

interface PaddleButtonProps {
  item: PaddleItem
  customer?: PaddleCustomer
  settings?: PaddleCheckoutOptions['settings']
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  showIcon?: boolean
  onStart?: () => void
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  onCancel?: () => void
}

export function PaddleButton({
  item,
  customer,
  settings,
  children = 'Buy Now',
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  showIcon = true,
  onStart,
  onSuccess,
  onError,
  onCancel,
  ...props
}: PaddleButtonProps) {
  const { isLoaded, isLoading, error, buyNow } = usePaddle()
  const [localLoading, setLocalLoading] = useState(false)

  const handleClick = async () => {
    if (!isLoaded || isLoading || localLoading) return

    setLocalLoading(true)
    onStart?.()

    try {
      await buyNow(item, customer, {
        ...settings,
        successUrl: settings?.successUrl || `${window.location.origin}/checkout/success`,
        cancelUrl: settings?.cancelUrl || window.location.href,
      })
      onSuccess?.(item)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      onError?.(errorMessage)
    } finally {
      setLocalLoading(false)
    }
  }

  const isButtonDisabled = disabled || !isLoaded || isLoading || localLoading

  return (
    <Button
      onClick={handleClick}
      disabled={isButtonDisabled}
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      {(isLoading || localLoading) ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {showIcon && <CreditCard className="mr-2 h-4 w-4" />}
          {children}
        </>
      )}
    </Button>
  )
}

interface QuickBuyButtonProps extends Omit<PaddleButtonProps, 'item'> {
  productId: string
  price: number
  productName: string
}

export function QuickBuyButton({
  productId,
  price,
  productName,
  customer,
  settings,
  children,
  ...props
}: QuickBuyButtonProps) {
  const item: PaddleItem = {
    priceId: productId,
    quantity: 1
  }

  const defaultSettings = {
    displayMode: 'overlay' as const,
    theme: 'light' as const,
    locale: 'en',
    allowLogout: false,
    ...settings
  }

  return (
    <PaddleButton
      item={item}
      customer={customer}
      settings={defaultSettings}
      {...props}
    >
      {children || `Buy ${productName} - $${price}`}
    </PaddleButton>
  )
}

interface AddToCartButtonProps {
  productId: string
  productName: string
  price: number
  slug?: string
  image?: string
  onAddToCart?: (item: { id: string; name: string; price: number; quantity: number }) => void
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
}

export function AddToCartButton({
  productId,
  productName,
  price,
  slug,
  image,
  onAddToCart,
  className,
  variant = 'outline',
  size = 'default',
  disabled = false,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    
    // Add to cart - this could be enhanced to use a cart context
    const cartItem = {
      id: productId,
      name: productName,
      price,
      quantity: 1
    }
    
    // Call the callback
    onAddToCart?.(cartItem)
    
    setLoading(false)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}

interface ProductActionsProps {
  productId: string
  productName: string
  price: number
  customer?: PaddleCustomer
  className?: string
  showQuickBuy?: boolean
  showAddToCart?: boolean
  onAddToCart?: (item: { id: string; name: string; price: number; quantity: number }) => void
  onQuickBuySuccess?: (data: any) => void
  onQuickBuyError?: (error: string) => void
}

export function ProductActions({
  productId,
  productName,
  price,
  customer,
  className = '',
  showQuickBuy = true,
  showAddToCart = true,
  onAddToCart,
  onQuickBuySuccess,
  onQuickBuyError,
}: ProductActionsProps) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {showAddToCart && (
        <AddToCartButton
          productId={productId}
          productName={productName}
          price={price}
          onAddToCart={onAddToCart}
          className="flex-1"
        />
      )}
      {showQuickBuy && (
        <QuickBuyButton
          productId={productId}
          price={price}
          productName={productName}
          customer={customer}
          onSuccess={onQuickBuySuccess}
          onError={onQuickBuyError}
          className="flex-1"
        >
          Quick Buy
        </QuickBuyButton>
      )}
    </div>
  )
}