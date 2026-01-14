"use client"

import { useState } from 'react'
import type { Product } from "@/lib/renin-products"
import { QuoteModal } from './quote-modal'

// Simple message icon
const MessageCircle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
)

interface RequestQuoteButtonProps {
  product: Product
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
  selectedOptions?: Record<string, string>
}

export function RequestQuoteButton({
  product,
  variant = "outline",
  size = "md",
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

  // Compute button classes based on variant and size
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 bg-white hover:bg-gray-50"
  }

  return (
    <>
      <button
        onClick={handleRequestQuote}
        className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        Request Quote
      </button>
      <QuoteModal open={open} onClose={() => setOpen(false)} product={product} selectedOptions={selectedOptions} />
    </>
  )
}
