"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "@/components/ui/icons"
import type { Product } from "@/lib/renin-products"

interface RequestQuoteButtonProps {
  product: Product
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function RequestQuoteButton({
  product,
  variant = "outline",
  size = "md",
  className = "",
}: RequestQuoteButtonProps) {
  const handleRequestQuote = () => {
    const jobberUrl = new URL(
      "https://clienthub.getjobber.com/client_hubs/f8b5c2d1-4e3a-4b2c-8f1e-9d6c7a8b9e0f/public/request_form",
    )

    // Add product information as URL parameters
    jobberUrl.searchParams.set("product_name", product.name)
    jobberUrl.searchParams.set("product_category", product.category)
    jobberUrl.searchParams.set("product_price", product.price.toString())
    jobberUrl.searchParams.set(
      "message",
      `I'm interested in getting a quote for the ${product.name}. Please provide pricing and installation details.`,
    )

    // Open in new tab
    window.open(jobberUrl.toString(), "_blank", "noopener,noreferrer")
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRequestQuote}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
      Request Quote
    </Button>
  )
}
