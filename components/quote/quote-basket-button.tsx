'use client'

import { Button } from '@/components/ui/button'
import { useQuoteBasketStore } from '@/lib/stores/quote-basket-store'
import { FileText } from 'lucide-react'
import Link from 'next/link'

export function QuoteBasketButton() {
  const { items, isOpen, openBasket, totalItems } = useQuoteBasketStore()
  const itemCount = totalItems()

  return (
    <Link href="/quote-basket">
      <Button
        variant="ghost"
        size="sm"
        className="relative gap-2"
        onClick={(e) => {
          // If we're already on quote-basket page, let link work normally
          // Otherwise, we could open drawer
          if (window.location.pathname === '/quote-basket') {
            e.preventDefault()
          }
        }}
      >
        <FileText className="h-5 w-5" />
        <span className="hidden sm:inline">Quote Basket</span>
        {itemCount > 0 && (
          <span className="ml-1 rounded-full bg-apple-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  )
}
