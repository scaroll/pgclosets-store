"use client"

import { useEffect, useState } from "react"
import { calculateTax } from "@/lib/renin-products"

interface PaddleInstance {
  Setup: (config: { vendor: number; eventCallback?: (data: unknown) => void }) => void;
  Checkout: {
    open: (options: PaddleCheckoutOptions) => void;
  };
}

declare global {
  interface Window {
    Paddle: PaddleInstance;
  }
}

interface PaddleConfig {
  vendorId: string
  environment: "sandbox" | "production"
}

interface PaddleCheckoutOptions {
  product: string
  prices: string[]
  title?: string
  message?: string
  coupon?: string
  email?: string
  country?: string
  postcode?: string
  allowQuantity?: boolean
  disableLogout?: boolean
  frameTarget?: string
  frameInitialHeight?: number
  frameStyle?: string
  successCallback?: (data: unknown) => void
  closeCallback?: () => void
}

export function usePaddle() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const config: PaddleConfig = {
    vendorId: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || "sandbox-vendor-id",
    environment: (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production") || "sandbox",
  }

  useEffect(() => {
    // Load Paddle.js script
    const script = document.createElement("script")
    script.src = "https://cdn.paddle.com/paddle/paddle.js"
    script.async = true
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Setup({
          vendor: Number.parseInt(config.vendorId),
          eventCallback: (data: unknown) => {
            console.log("[v0] Paddle event:", data)
          },
        })
        setIsLoaded(true)
        setIsLoading(false)
      }
    }
    script.onerror = () => {
      console.error("[v0] Failed to load Paddle.js")
      setIsLoading(false)
    }

    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [config.vendorId])

  const openCheckout = (options: PaddleCheckoutOptions) => {
    if (!isLoaded || !window.Paddle) {
      console.error("[v0] Paddle not loaded")
      return
    }

    window.Paddle.Checkout.open(options)
  }

  const formatPriceForPaddle = (price: number, province = "ON"): string => {
    // HST rate for Ontario is 13%
    const taxRate = province === "ON" ? 0.13 : 0.13; // Default to ON rate
    const tax = calculateTax(price, taxRate)
    const totalPrice = price + tax
    return totalPrice.toFixed(2)
  }

  const createCheckoutUrl = (productId: string, price: number, province = "ON"): string => {
    const formattedPrice = formatPriceForPaddle(price, province)
    return `https://checkout.paddle.com/checkout?vendor=${config.vendorId}&product=${productId}&price=${formattedPrice}`
  }

  return {
    isLoaded,
    isLoading,
    openCheckout,
    formatPriceForPaddle,
    createCheckoutUrl,
    config,
  }
}
