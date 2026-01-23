'use client'

import { QuoteBasketDrawer } from '@/components/quote/quote-basket-drawer'

export function QuoteBasketProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <QuoteBasketDrawer />
    </>
  )
}
