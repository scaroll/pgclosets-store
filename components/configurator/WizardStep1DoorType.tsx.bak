"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { DOOR_TYPES, formatPrice, getConfigurableDoorTypes } from "@/lib/door-types"
import { getDefaultConfiguratorData } from "@/lib/estimator-defaults"
import type { ProductConfiguratorData } from "@/types/configurator"
import { ConfiguratorDataAdapter } from "@/lib/configurator-adapter"
import enhancedProducts from "@/data/enhanced-products.json"

interface WizardStep1DoorTypeProps {
  selectedProduct?: {
    id: string
    title: string
    configuratorData: ProductConfiguratorData
  } | null
  onSelectProduct: (product: {
    id: string
    title: string
    configuratorData: ProductConfiguratorData
  }) => void
}

export function WizardStep1DoorType({ selectedProduct, onSelectProduct }: WizardStep1DoorTypeProps) {
  const configurableDoorTypes = getConfigurableDoorTypes()

  const handleSelectDoorType = (doorSlug: string) => {
    // Try to find enhanced product for this door type
    const enhancedProduct = enhancedProducts.find(
      (p: any) => p.category.toLowerCase().includes(doorSlug.replace('renin-', '').replace('-doors', ''))
    )

    let configuratorData: ProductConfiguratorData

    if (enhancedProduct?.configurator_data) {
      // Use adapter to normalize enhanced product data
      const normalized = ConfiguratorDataAdapter.safeNormalize(enhancedProduct.configurator_data)
      if (normalized) {
        configuratorData = normalized
      } else {
        // Fallback to defaults
        configuratorData = getDefaultConfiguratorData(doorSlug)
      }
    } else {
      // Use defaults for this door type
      configuratorData = getDefaultConfiguratorData(doorSlug)
    }

    const doorType = DOOR_TYPES.find(dt => dt.slug === doorSlug)!

    onSelectProduct({
      id: doorSlug,
      title: doorType.name,
      configuratorData
    })
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Choose Your Door Type</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Select the style that best fits your space
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {configurableDoorTypes.map((doorType) => {
          const isSelected = selectedProduct?.id === doorType.slug

          return (
            <Card
              key={doorType.slug}
              className={`cursor-pointer transition-all hover:border-black ${
                isSelected ? 'border-black border-2 shadow-lg' : ''
              }`}
              onClick={() => handleSelectDoorType(doorType.slug)}
            >
              <CardContent className="p-4">
                <div className="relative aspect-[4/3] mb-3 overflow-hidden rounded-lg">
                  <Image
                    src={doorType.image}
                    alt={doorType.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-black text-white rounded-full p-1">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <h4 className="font-semibold text-base mb-1">{doorType.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {doorType.description}
                </p>
                <p className="text-sm font-bold">
                  From {formatPrice(doorType.fromPrice, true)}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedProduct && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>Selected:</strong> {selectedProduct.title}
          </p>
        </div>
      )}
    </div>
  )
}
