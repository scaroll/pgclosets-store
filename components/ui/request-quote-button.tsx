"use client"

import { useState } from 'react'
import { Button } from "./button"
import { MessageCircle } from "./icons"
import type { Product as CoreProduct } from "@/lib/renin-products"
import type { ArcatProduct } from "@/lib/enhanced-renin-products"
import { QuoteModal } from './quote-modal'

interface RequestQuoteButtonProps {
  product: CoreProduct | ArcatProduct
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary" | "brand-primary" | "brand-secondary" | "brand-outline" | "brand-ghost"
  size?: "sm" | "default" | "lg" | "xl" | "icon" | "icon-sm" | "icon-lg" | "icon-xl"
  className?: string
  selectedOptions?: Record<string, string>
}

export function RequestQuoteButton({
  product,
  variant = "brand-outline",
  size = "default",
  className = "",
  selectedOptions,
}: RequestQuoteButtonProps) {
  const [open, setOpen] = useState(false)

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

    // Open in new tab for continuity, and also show inline form for faster capture
    window.open(jobberUrl.toString(), "_blank", "noopener,noreferrer")
    setOpen(true)
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleRequestQuote}
        className={`inline-flex items-center gap-2 ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        Request Quote
      </Button>
      <QuoteModal open={open} onClose={() => setOpen(false)} product={product} selectedOptions={selectedOptions} />
    </>
  )
}
