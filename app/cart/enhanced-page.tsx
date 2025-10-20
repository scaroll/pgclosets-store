"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  Package,
  Truck,
  Shield,
  Tag,
  X
} from "lucide-react"
import StandardLayout from "@/components/layout/StandardLayout"
import { useEnhancedCart } from "@/hooks/use-enhanced-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
// import { cn } from "@/lib/utils"
// import { colors, shadows, radius, spacing } from "@/lib/design-tokens"

// Trust badges component
const TrustBadges = () => (
  <div className="flex items-center justify-center gap-6 py-4 border-y border-gray-100">
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Truck className="w-4 h-4" />
      <span>Free Shipping over $500</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Shield className="w-4 h-4" />
      <span>Secure Checkout</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Package className="w-4 h-4" />
      <span>Professional Installation</span>
    </div>
  </div>
)

// Empty cart state
const EmptyCart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-20"
  >
    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
      <ShoppingCart className="w-12 h-12 text-gray-400" />
    </div>
    <h2 className="text-2xl font-light mb-4">Your cart is empty</h2>
    <p className="text-gray-600 mb-8 max-w-md mx-auto">
      Browse our premium collection of closet doors and organizational systems
    </p>
    <div className="flex gap-4 justify-center">
      <Link href="/products">
        <Button size="lg" className="gap-2">
          Continue Shopping
          <ChevronRight className="w-4 h-4" />
        </Button>
      </Link>
      <Link href="/collections/renin-closet-doors">
        <Button size="lg" variant="outline">
          View Bestsellers
        </Button>
      </Link>
    </div>
  </motion.div>
)

// Cart item component
const CartItem = ({ item }: { item: any }) => {
  const { updateQuantity, removeItem, toggleInstallation } = useEnhancedCart()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    removeItem(item.productId, item.selectedOptions)
    toast.success("Item removed from cart")
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(item.productId, newQuantity, item.selectedOptions)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isRemoving ? 0 : 1, x: isRemoving ? -100 : 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex gap-6">
          {/* Product Image */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover rounded-lg"
              sizes="128px"
            />
            {item.category && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 text-xs"
              >
                {item.category}
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium mb-2">{item.name}</h3>

            {/* Selected Options */}
            {Object.entries(item.selectedOptions || {}).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(item.selectedOptions).map(([key, value]) => (
                  <Badge key={key} variant="outline" className="text-xs">
                    {key}: {String(value)}
                  </Badge>
                ))}
              </div>
            )}

            {/* Price and SKU */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="text-xl font-semibold text-gray-900">
                ${item.price.toFixed(2)}
              </span>
              {item.sku && <span>SKU: {item.sku}</span>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">
                  {item.quantity}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Installation Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.installationIncluded}
                  onChange={(e) =>
                    toggleInstallation(
                      item.productId,
                      e.target.checked,
                      item.selectedOptions
                    )
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">
                  Include Installation
                </span>
              </label>

              {/* Remove Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Line Total */}
          <div className="text-right">
            <div className="text-2xl font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            {item.installationIncluded && (
              <div className="text-sm text-green-600 mt-1">
                + Installation
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Promo code component
const PromoCodeSection = () => {
  const { promoCode, applyPromoCode, removePromoCode } = useEnhancedCart()
  const [code, setCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return

    setIsApplying(true)
    const success = await applyPromoCode(code)
    setIsApplying(false)

    if (success) {
      toast.success("Promo code applied successfully!")
      setCode("")
    } else {
      toast.error("Invalid or expired promo code")
    }
  }

  if (promoCode) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-900">
              Code {promoCode.code} applied
            </span>
          </div>
          <button
            onClick={removePromoCode}
            className="text-green-600 hover:text-green-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter promo code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === "Enter" && handleApply()}
        className="flex-1"
      />
      <Button
        variant="outline"
        onClick={handleApply}
        disabled={!code.trim() || isApplying}
      >
        {isApplying ? "Applying..." : "Apply"}
      </Button>
    </div>
  )
}

// AI Recommendations
const AIRecommendations = () => {
  const { addItem, getUpsellProducts } = useEnhancedCart()
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    getUpsellProducts().then(setRecommendations)
  }, [])

  if (recommendations.length === 0) return null

  return (
    <div className="mt-12">
      <h3 className="text-lg font-medium mb-4">Complete Your Order</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-gray-600">{product.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold">${product.price}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addItem({
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      selectedOptions: {},
                      installationIncluded: false
                    })
                  }
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main cart page component
export default function EnhancedCartPage() {
  const router = useRouter()
  const {
    items,
    getSubtotal,
    getInstallationTotal,
    getDiscountAmount,
    getShippingCost,
    getTax,
    getTotal,
    getTotalItems,
    estimateDelivery
  } = useEnhancedCart()

  const delivery = estimateDelivery()
  const subtotal = getSubtotal()
  const installation = getInstallationTotal()
  const discount = getDiscountAmount()
  const shipping = getShippingCost()
  const tax = getTax()
  const total = getTotal()
  const itemCount = getTotalItems()

  if (items.length === 0) {
    return (
      <StandardLayout>
        <div className="container mx-auto px-4 py-12">
          <EmptyCart />
        </div>
      </StandardLayout>
    )
  }

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <TrustBadges />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <CartItem key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`} item={item} />
              ))}
            </AnimatePresence>

            <AIRecommendations />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <PromoCodeSection />
                </div>

                <Separator className="mb-4" />

                {/* Pricing Details */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {installation > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Installation</span>
                      <span className="font-medium">${installation.toFixed(2)}</span>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (HST)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-xl font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Estimate */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Estimated Delivery
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    {delivery.min.toLocaleDateString("en-CA", {
                      month: "short",
                      day: "numeric"
                    })} - {delivery.max.toLocaleDateString("en-CA", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <Button
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => router.push("/checkout")}
                  >
                    Proceed to Checkout
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Link href="/products" className="block">
                    <Button size="lg" variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Security Note */}
                <div className="mt-6 flex items-start gap-2 text-xs text-gray-600">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <p>
                    Your payment information is encrypted and secure. We accept
                    all major credit cards, Apple Pay, and Google Pay.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StandardLayout>
  )
}