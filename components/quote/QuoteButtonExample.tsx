"use client"

/**
 * Example implementation showing how to integrate AddToQuoteButton
 * on product pages alongside Add to Cart functionality
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AddToQuoteButton } from "@/components/quote/AddToQuoteButton"
import { ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  image: string
  price: number
}

interface ProductActionsExampleProps {
  product: Product
}

export function ProductActionsExample({ product }: ProductActionsExampleProps) {
  const [quantity, setQuantity] = useState(1)
  const [customizations, setCustomizations] = useState({
    width: 36,
    height: 84,
    hardware: "Modern Black",
    installation: false,
  })

  const handleAddToCart = () => {
    // Your existing add to cart logic
    console.log("Adding to cart:", { product, quantity, customizations })
  }

  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <h3 className="text-xl font-semibold">{product.name}</h3>
      <p className="text-2xl font-bold">${product.price.toLocaleString()} CAD</p>

      {/* Customization Options (example) */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-20 px-3 py-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Width (inches)</label>
            <input
              type="number"
              value={customizations.width}
              onChange={(e) =>
                setCustomizations((prev) => ({ ...prev, width: parseInt(e.target.value) || 36 }))
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Height (inches)</label>
            <input
              type="number"
              value={customizations.height}
              onChange={(e) =>
                setCustomizations((prev) => ({ ...prev, height: parseInt(e.target.value) || 84 }))
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={customizations.installation}
              onChange={(e) =>
                setCustomizations((prev) => ({ ...prev, installation: e.target.checked }))
              }
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Include Professional Installation</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {/* Primary action: Add to Cart */}
        <Button onClick={handleAddToCart} size="lg" className="w-full">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>

        {/* Secondary action: Request Quote */}
        <AddToQuoteButton
          product={product}
          customizations={customizations}
          quantity={quantity}
          variant="outline"
          size="lg"
          className="w-full"
        />
      </div>

      <p className="text-xs text-gray-500 text-center">
        Not sure what you need? Request a quote and we&apos;ll help you find the perfect solution.
      </p>
    </div>
  )
}

/**
 * Usage Example:
 *
 * import { ProductActionsExample } from "@/components/quote/QuoteButtonExample"
 *
 * <ProductActionsExample
 *   product={{
 *     id: "barn-door-1",
 *     name: "Rustic Barn Door",
 *     image: "/images/barn-door.jpg",
 *     price: 899
 *   }}
 * />
 */
