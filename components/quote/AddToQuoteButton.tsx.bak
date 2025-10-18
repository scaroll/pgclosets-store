"use client"

import { Button } from "@/components/ui/button"
import { useQuote } from "@/hooks/useQuote"
import { useCart } from "@/contexts/CartContext"
import type { CartItem } from "@/lib/types"
import { FileText, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface AddToQuoteButtonProps {
  product?: {
    id: string
    name: string
    image: string
    price: number
  }
  customizations?: CartItem["customizations"]
  quantity?: number
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  convertFromCart?: boolean
  className?: string
}

export function AddToQuoteButton({
  product,
  customizations,
  quantity = 1,
  variant = "outline",
  size = "default",
  convertFromCart = false,
  className,
}: AddToQuoteButtonProps) {
  const { addItem: addToQuote, addFromCart } = useQuote()
  const { items: cartItems, clearCart } = useCart()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToQuote = async () => {
    setIsAdding(true)

    try {
      if (convertFromCart) {
        // Convert entire cart to quote
        addFromCart(cartItems)
        clearCart()
        router.push("/quote")
      } else if (product) {
        // Add single product to quote
        addToQuote({
          id: Date.now().toString(),
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
          customizations,
        })
        router.push("/quote")
      }
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToQuote}
      disabled={isAdding || (convertFromCart && cartItems.length === 0)}
      className={className}
    >
      {convertFromCart ? (
        <>
          <ShoppingCart className="w-4 h-4" />
          {isAdding ? "Converting..." : "Convert Cart to Quote"}
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          {isAdding ? "Adding..." : "Get Free Quote"}
        </>
      )}
    </Button>
  )
}
