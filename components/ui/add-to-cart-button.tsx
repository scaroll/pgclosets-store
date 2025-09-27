"use client"

import { useState } from "react"
import { useCartStore, type Product as CartProduct } from "@/lib/stores/cart-store"
import { toCartProduct } from "@/lib/renin-products"
import { Button } from "./button"
import { ShoppingCart, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Product } from "@/types/commerce"

interface ProductLike {
  id: string;
  name?: string;
  title?: string;
  price: number;
  inStock?: boolean;
  [key: string]: unknown;
}

interface AddToCartButtonProps {
  product: Product | ProductLike // Accept standard Product type or similar structure
  variant?: "default" | "secondary" | "outline" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  quantity?: number
  selectedVariants?: Record<string, string>
  disabled?: boolean
  showIcon?: boolean
  onSuccess?: () => void
}

export function AddToCartButton({
  product,
  variant = "default",
  size = "default",
  className,
  quantity = 1,
  selectedVariants = {},
  disabled = false,
  showIcon = true,
  onSuccess
}: AddToCartButtonProps) {
  const { addItem, openCart, isInCart } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // Convert any product type to cart-compatible format
  const cartProduct: CartProduct = toCartProduct(product)

  const handleAddToCart = async () => {
    if (disabled || !cartProduct.inStock) return

    setIsAdding(true)

    try {
      const filteredVariants = Object.fromEntries(
        Object.entries(selectedVariants).filter(([, value]) => {
          if (value === undefined || value === null) return false
          return String(value).trim().length > 0
        })
      )

      // Add item to cart
      addItem(cartProduct, quantity, filteredVariants)

      // Show success state
      setJustAdded(true)

      // Call success callback if provided
      onSuccess?.()

      // Auto-open cart after adding item
      setTimeout(() => {
        openCart()
      }, 300)

      // Reset success state after animation
      setTimeout(() => {
        setJustAdded(false)
      }, 2000)

    } catch (error) {
      console.error('Failed to add item to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const isProductInCart = isInCart(cartProduct.id)

  // Determine button text and icon
  const getButtonContent = () => {
    if (justAdded) {
      return (
        <>
          {showIcon && <Check className="w-4 h-4" />}
          <span>Added!</span>
        </>
      )
    }

    if (isAdding) {
      return (
        <>
          {showIcon && <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
          <span>Adding...</span>
        </>
      )
    }

    if (isProductInCart) {
      return (
        <>
          {showIcon && <ShoppingCart className="w-4 h-4" />}
          <span>Add More</span>
        </>
      )
    }

    return (
      <>
        {showIcon && <ShoppingCart className="w-4 h-4" />}
        <span>Add to Cart</span>
      </>
    )
  }

  // Determine button style based on state
  const getButtonVariant = () => {
    if (justAdded) return "default"
    if (isProductInCart) return "secondary"
    return variant
  }

  const isDisabled = disabled || !cartProduct.inStock || isAdding

  return (
    <Button
      variant={getButtonVariant()}
      size={size}
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={cn(
        "transition-all duration-300",
        justAdded && "bg-green-600 hover:bg-green-700 text-white",
        isProductInCart && "border-pg-navy text-pg-navy hover:bg-pg-navy hover:text-white",
        !cartProduct.inStock && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={`Add ${cartProduct.name} to cart`}
    >
      <div className="flex items-center gap-2">
        {getButtonContent()}
      </div>
    </Button>
  )
}

// Variant for inline use with just the icon
export function AddToCartIconButton({
  product,
  className,
  ...props
}: Omit<AddToCartButtonProps, 'showIcon' | 'size'>) {
  return (
    <AddToCartButton
      product={product}
      size="icon"
      showIcon={false}
      className={cn("w-8 h-8 p-0", className)}
      {...props}
    >
      <ShoppingCart className="w-4 h-4" />
    </AddToCartButton>
  )
}
