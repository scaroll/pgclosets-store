"use client"
import { ShoppingBag } from "@/components/ui/icon-fallback"
import { useMedusaCart } from "@/hooks/use-medusa-cart"
import { Button } from "@/components/ui/button"

export default function CartIcon() {
  const { getTotalItems, cart } = useMedusaCart()
  const itemCount = getTotalItems()

  const toggleCart = () => {
    window.location.href = "/cart"
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleCart}
      className="relative p-2 hover:bg-pg-sky/10"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingBag className="h-5 w-5 text-pg-navy" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-pg-navy text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Button>
  )
}
