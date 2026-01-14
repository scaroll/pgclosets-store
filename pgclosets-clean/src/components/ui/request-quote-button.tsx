"use client"

import { Button } from "./button"

interface RequestQuoteButtonProps {
  className?: string
  productName?: string
}

export function RequestQuoteButton({ className, productName }: RequestQuoteButtonProps) {
  const handleRequestQuote = () => {
    // Navigate to contact page or open quote modal
    window.location.href = '/contact'
  }

  return (
    <Button
      onClick={handleRequestQuote}
      variant="outline"
      className={className}
      aria-label={productName ? `Request quote for ${productName}` : "Request quote"}
    >
      Request Quote
    </Button>
  )
}