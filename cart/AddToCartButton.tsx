"use client"
import { MessageCircle } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

interface AddToCartButtonProps {
  product: Product
  customizations?: {
    width?: number
    height?: number
    hardware?: string
    installation?: boolean
  }
  price?: number
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "secondary"
}

export default function AddToCartButton({
  product,
  customizations,
  price,
  className,
  size = "default",
  variant = "default",
}: AddToCartButtonProps) {
  const handleRequestQuote = () => {
    const productDetails = encodeURIComponent(
      `Product: ${product.name}\nPrice: ${price ? `$${price}` : "Contact for pricing"}\nCustomizations: ${JSON.stringify(customizations || {})}`,
    )

    const emailUrl = `mailto:spencer@peoplesgrp.com?subject=Quote Request&body=${productDetails}`

    window.open(emailUrl, "_blank")
  }

  return (
    <Button size={size} variant={variant} onClick={handleRequestQuote} className={className}>
      <MessageCircle className="w-4 h-4 mr-2" />
      Request Quote
    </Button>
  )
}
