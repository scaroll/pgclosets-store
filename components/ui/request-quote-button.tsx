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

  const handleOpen = () => {
    setOpen(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  const handleClose = () => {
    setOpen(false)
    // Restore body scroll
    document.body.style.overflow = 'unset'
  }

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      handleClose()
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        className={`inline-flex items-center gap-2 touch-target min-h-[44px] transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
        aria-label="Get a free quote for your closet project"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <MessageCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span className="font-medium">Get Free Quote</span>
      </Button>
      <LuxuryQuoteForm
        open={open}
        onClose={handleClose}
        product={product}
        selectedOptions={selectedOptions}
      />
    </>
  )
}