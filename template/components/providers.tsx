'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { CartProvider } from '@/components/cart/cart-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <CartProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </NextThemesProvider>
  )
}