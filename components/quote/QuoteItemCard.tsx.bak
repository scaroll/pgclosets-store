"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2 } from "lucide-react"
import type { QuoteItem } from "@/lib/types/quote"

interface QuoteItemCardProps {
  item: QuoteItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function QuoteItemCard({ item, onUpdateQuantity, onRemove }: QuoteItemCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 relative flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.name}</h3>

            {item.customizations && (
              <div className="text-sm text-gray-600 space-y-0.5 mb-2">
                {item.customizations.width && item.customizations.height && (
                  <p>Size: {item.customizations.width}&quot; × {item.customizations.height}&quot;</p>
                )}
                {item.customizations.hardware && (
                  <p>Hardware: {item.customizations.hardware}</p>
                )}
                {item.customizations.installation && (
                  <p className="text-green-600">Professional Installation Included</p>
                )}
                {item.customizations.notes && (
                  <p className="italic">Notes: {item.customizations.notes}</p>
                )}
              </div>
            )}

            <p className="font-bold text-lg text-gray-900">
              ${item.price.toLocaleString()} CAD
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="h-8 w-8"
              >
                <Minus className="w-4 h-4" />
              </Button>

              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                className="w-16 text-center h-8"
                min="1"
              />

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="h-8 w-8"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
