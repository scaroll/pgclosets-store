"use client"

import { useCartStore } from "@/lib/stores/cart-store"
import { ShoppingBag } from "lucide-react"

interface CartIconProps {
  className?: string
}

export function CartIcon({ className = "" }: CartIconProps) {
  const { totalItems, openCart } = useCartStore()
  const itemCount = totalItems()

  return (
    <button
      onClick={openCart}
      className={`relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 ${className}`}
      aria-label={`Open cart with ${itemCount} items`}
    >
      <ShoppingBag className="w-6 h-6 text-charcoal hover:text-navy transition-colors duration-300" />

      {/* Cart count badge */}
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-forest text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px] min-h-[20px] leading-none">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}