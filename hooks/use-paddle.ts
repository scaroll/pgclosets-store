'use client'

import { useState, useEffect, useCallback } from 'react'

// Paddle SDK types
declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (env: 'sandbox' | 'production') => void
      }
      Setup: (options: { vendor: number; eventCallback?: (data: any) => void }) => void
      Checkout: {
        open: (options: PaddleCheckoutOptions) => void
      }
      on?: (event: string, callback: (data: any) => void) => void
    }
  }
}

export interface PaddleItem {
  priceId: string
  quantity?: number
}

export interface PaddleCustomer {
  email?: string
  first_name?: string
  last_name?: string
  address?: {
    country_code: string
    postal_code?: string
    region?: string
    city?: string
    first_line?: string
    second_line?: string
  }
}

export interface PaddleCheckoutOptions {
  items: PaddleItem[]
  customer?: PaddleCustomer
  customData?: Record<string, any>
  settings?: {
    displayMode?: 'inline' | 'overlay'
    theme?: 'light' | 'dark'
    locale?: string
    allowLogout?: boolean
    successUrl?: string
    cancelUrl?: string
  }
}

export interface UsePaddleReturn {
  isLoaded: boolean
  isLoading: boolean
  error: string | null
  openCheckout: (options: PaddleCheckoutOptions) => Promise<void>
  buyNow: (item: PaddleItem, customer?: PaddleCustomer, settings?: PaddleCheckoutOptions['settings']) => Promise<void>
  formatPrice: (amount: number, currency?: string) => string
  calculateTax: (amount: number, province?: string) => { subtotal: number; tax: number; total: number; taxRate: number }
}

const PADDLE_VENDOR_ID = process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || '12345'
const PADDLE_ENVIRONMENT = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'

// Canadian tax rates by province
const CANADIAN_TAX_RATES: Record<string, { hst?: number; gst?: number; pst?: number }> = {
  ON: { hst: 0.13 }, // Ontario - 13% HST
  QC: { gst: 0.05, pst: 0.09975 }, // Quebec - 5% GST + 9.975% PST
  BC: { gst: 0.05, pst: 0.07 }, // British Columbia - 5% GST + 7% PST
  AB: { gst: 0.05 }, // Alberta - 5% GST only
  SK: { gst: 0.05, pst: 0.06 }, // Saskatchewan - 5% GST + 6% PST
  MB: { gst: 0.05, pst: 0.07 }, // Manitoba - 5% GST + 7% PST
  NB: { hst: 0.15 }, // New Brunswick - 15% HST
  NS: { hst: 0.15 }, // Nova Scotia - 15% HST
  PE: { hst: 0.15 }, // Prince Edward Island - 15% HST
  NL: { hst: 0.15 }, // Newfoundland and Labrador - 15% HST
  YT: { gst: 0.05 }, // Yukon - 5% GST only
  NT: { gst: 0.05 }, // Northwest Territories - 5% GST only
  NU: { gst: 0.05 }, // Nunavut - 5% GST only
}

export function usePaddle(): UsePaddleReturn {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Paddle SDK
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if Paddle is already loaded
    if (window.Paddle) {
      setIsLoaded(true)
      return
    }

    // Load Paddle SDK
    const script = document.createElement('script')
    script.src = 'https://cdn.paddle.com/paddle/paddle.js'
    script.async = true
    
    script.onload = () => {
      if (window.Paddle) {
        try {
          // Set environment
          window.Paddle.Environment.set(PADDLE_ENVIRONMENT)
          
          // Setup Paddle
          window.Paddle.Setup({
            vendor: parseInt(PADDLE_VENDOR_ID),
            eventCallback: (data) => {
              console.log('Paddle event:', data)
              
              if (data.event === 'Checkout.Complete') {
                console.log('Payment completed successfully:', data)
              } else if (data.event === 'Checkout.Error') {
                console.error('Payment error:', data)
                setError(`Payment failed: ${data.error?.message || 'Unknown error'}`)
              } else if (data.event === 'Checkout.Cancel') {
                console.log('Payment cancelled by user')
              }
            }
          })
          
          setIsLoaded(true)
        } catch (err) {
          console.error('Error setting up Paddle:', err)
          setError('Failed to initialize payment system')
        }
      }
    }

    script.onerror = () => {
      setError('Failed to load payment system')
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://cdn.paddle.com/paddle/paddle.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  const openCheckout = useCallback(async (options: PaddleCheckoutOptions): Promise<void> => {
    if (!isLoaded || !window.Paddle) {
      throw new Error('Paddle not loaded')
    }

    setIsLoading(true)
    setError(null)

    try {
      window.Paddle.Checkout.open(options)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open checkout'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [isLoaded])

  const buyNow = useCallback(async (
    item: PaddleItem, 
    customer?: PaddleCustomer,
    settings?: PaddleCheckoutOptions['settings']
  ): Promise<void> => {
    return openCheckout({
      items: [item],
      customer,
      settings: {
        displayMode: 'overlay',
        theme: 'light',
        locale: 'en',
        allowLogout: false,
        ...settings
      }
    })
  }, [openCheckout])

  const formatPrice = useCallback((amount: number, currency: string = 'CAD'): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency,
    }).format(amount)
  }, [])

  const calculateTax = useCallback((amount: number, province: string = 'ON') => {
    const rates = CANADIAN_TAX_RATES[province.toUpperCase()] || CANADIAN_TAX_RATES.ON
    
    let totalTaxRate = 0
    if (rates.hst) {
      totalTaxRate = rates.hst
    } else {
      totalTaxRate = (rates.gst || 0) + (rates.pst || 0)
    }

    const subtotal = amount
    const tax = subtotal * totalTaxRate
    const total = subtotal + tax

    return {
      subtotal,
      tax,
      total,
      taxRate: totalTaxRate
    }
  }, [])

  return {
    isLoaded,
    isLoading,
    error,
    openCheckout,
    buyNow,
    formatPrice,
    calculateTax
  }
}