"use client"

import { useState } from 'react'
import { Button } from "./button"
import { MessageCircle } from "./icons"
import { LuxuryQuoteForm } from './luxury-quote-form'

interface RequestQuoteButtonProps {
  product?: any
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

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        Request Quote
      </Button>
      <LuxuryQuoteForm
        open={open}
        onClose={() => setOpen(false)}
        product={product}
        selectedOptions={selectedOptions}
      />
    </>
  )
}