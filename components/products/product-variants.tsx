'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Variant {
  id: string
  name: string
  sku?: string | null
  price: number
  image?: string | null
  inStock: boolean
  attributes?: any
}

interface ProductVariantsProps {
  variants: Variant[]
  onVariantChange?: (variant: Variant) => void
}

export function ProductVariants({ variants, onVariantChange }: ProductVariantsProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    variants.find(v => v.inStock)?.id || null
  )

  // Extract unique attribute types
  const attributeTypes = new Set<string>()
  const attributesByType: Record<string, Set<string>> = {}

  variants.forEach(variant => {
    if (variant.attributes && typeof variant.attributes === 'object') {
      Object.keys(variant.attributes).forEach(key => {
        attributeTypes.add(key)
        if (!attributesByType[key]) {
          attributesByType[key] = new Set()
        }
        attributesByType[key].add(variant.attributes[key])
      })
    }
  })

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId)
    const variant = variants.find(v => v.id === variantId)
    if (variant && onVariantChange) {
      onVariantChange(variant)
    }
  }

  // If no attributes, show as simple list
  if (attributeTypes.size === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Options
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => handleVariantSelect(variant.id)}
              disabled={!variant.inStock}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all text-left",
                selectedVariant === variant.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground",
                !variant.inStock && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="font-medium">{variant.name}</div>
              {variant.sku && (
                <div className="text-xs text-muted-foreground mt-1">
                  SKU: {variant.sku}
                </div>
              )}
              {!variant.inStock && (
                <div className="text-xs text-red-500 mt-1">Out of Stock</div>
              )}
              {selectedVariant === variant.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Render attribute-based selection
  return (
    <div className="space-y-6">
      {Array.from(attributeTypes).map((attrType) => {
        const values = Array.from(attributesByType[attrType])
        const isColorAttribute = attrType.toLowerCase().includes('color') || attrType.toLowerCase().includes('colour')

        return (
          <div key={attrType} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {attrType}
            </h3>
            <div className={cn(
              "flex flex-wrap gap-3",
              isColorAttribute ? "gap-2" : "gap-3"
            )}>
              {values.map((value) => {
                // Find variant with this attribute value
                const variant = variants.find(
                  v => v.attributes?.[attrType] === value
                )
                if (!variant) return null

                const isSelected = selectedVariant === variant.id
                const isAvailable = variant.inStock

                if (isColorAttribute) {
                  // Color swatch
                  return (
                    <button
                      key={value}
                      onClick={() => handleVariantSelect(variant.id)}
                      disabled={!isAvailable}
                      className={cn(
                        "relative group",
                        !isAvailable && "opacity-50 cursor-not-allowed"
                      )}
                      title={value}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full border-2 transition-all",
                          isSelected
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-muted-foreground"
                        )}
                        style={{
                          backgroundColor: getColorValue(value),
                        }}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white drop-shadow-lg" />
                          </div>
                        )}
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-red-500 rotate-45" />
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap bg-black text-white px-2 py-1 rounded">
                        {value}
                      </div>
                    </button>
                  )
                } else {
                  // Text button
                  return (
                    <button
                      key={value}
                      onClick={() => handleVariantSelect(variant.id)}
                      disabled={!isAvailable}
                      className={cn(
                        "relative px-6 py-3 rounded-lg border-2 transition-all font-medium min-w-[100px]",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-muted-foreground",
                        !isAvailable && "opacity-50 cursor-not-allowed line-through"
                      )}
                    >
                      {value}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  )
                }
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Helper function to convert color names to hex values
function getColorValue(colorName: string): string {
  const colorMap: Record<string, string> = {
    white: '#FFFFFF',
    black: '#000000',
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    purple: '#A855F7',
    pink: '#EC4899',
    gray: '#6B7280',
    grey: '#6B7280',
    brown: '#92400E',
    beige: '#D4C5B9',
    navy: '#1E3A8A',
    teal: '#14B8A6',
    orange: '#F97316',
    wood: '#92400E',
    oak: '#A0826D',
    walnut: '#5D4E37',
    cherry: '#722F37',
    maple: '#C9A86A',
    espresso: '#31261D',
    mahogany: '#420C09',
  }

  return colorMap[colorName.toLowerCase()] || '#9CA3AF'
}
