'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { LuxuryQuoteForm } from './luxury-quote-form'

interface LuxuryQuoteFormServerProps {
  product: {
    name: string
    price?: number
  }
}

export function LuxuryQuoteFormServer({ product }: LuxuryQuoteFormServerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        className="w-full py-6 text-lg font-semibold tracking-wide"
        onClick={() => setOpen(true)}
      >
        Secure My Design Consultation
      </Button>
      <LuxuryQuoteForm open={open} onClose={() => setOpen(false)} product={product} />
    </>
  )
}
