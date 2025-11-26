'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  initialQuantity?: number
  min?: number
  max?: number
  onQuantityChange?: (quantity: number) => void
  className?: string
}

export function QuantitySelector({
  initialQuantity = 1,
  min = 1,
  max = 99,
  onQuantityChange,
  className,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity)

  const handleDecrease = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onQuantityChange?.(newQuantity)
    }
  }

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      onQuantityChange?.(newQuantity)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= min && value <= max) {
      setQuantity(value)
      onQuantityChange?.(value)
    }
  }

  return (
    <div className={cn("inline-flex items-center", className)}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className={cn(
          "w-10 h-10 rounded-l-lg border border-r-0 border-border bg-background",
          "flex items-center justify-center transition-colors",
          "hover:bg-muted active:bg-muted/80",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background"
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className={cn(
          "w-16 h-10 border-y border-border bg-background",
          "text-center font-medium tabular-nums",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:z-10",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        aria-label="Quantity"
      />

      <button
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className={cn(
          "w-10 h-10 rounded-r-lg border border-l-0 border-border bg-background",
          "flex items-center justify-center transition-colors",
          "hover:bg-muted active:bg-muted/80",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background"
        )}
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
