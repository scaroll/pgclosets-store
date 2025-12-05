"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Percent, Truck, Wrench, Receipt, DollarSign } from "lucide-react"

export interface QuoteSummaryItem {
  productName: string
  quantity: number
  price: number
  total: number
}

export interface QuoteSummaryProps {
  items: QuoteSummaryItem[]
  subtotal: number
  volumeDiscount?: number
  customerDiscount?: number
  installationCost?: number
  deliveryFee?: number
  tax: number
  total: number
  savings?: number
  customerType?: "residential" | "contractor" | "senior"
  className?: string
}

const customerTypeLabels = {
  residential: "Residential",
  contractor: "Contractor",
  senior: "Senior",
}

const customerTypeBadgeColors = {
  residential: "bg-blue-100 text-blue-800 border-blue-200",
  contractor: "bg-purple-100 text-purple-800 border-purple-200",
  senior: "bg-amber-100 text-amber-800 border-amber-200",
}

export function QuoteSummary({
  items,
  subtotal,
  volumeDiscount = 0,
  customerDiscount = 0,
  installationCost = 0,
  deliveryFee = 0,
  tax,
  total,
  savings = 0,
  customerType,
  className,
}: QuoteSummaryProps) {
  const totalDiscounts = volumeDiscount + customerDiscount
  const subtotalWithServices = subtotal - totalDiscounts + installationCost + deliveryFee

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quote Summary</CardTitle>
          {customerType && (
            <Badge className={cn(customerTypeBadgeColors[customerType])}>
              {customerTypeLabels[customerType]}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items List */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium line-clamp-1">{item.productName}</h4>
                <p className="text-muted-foreground text-xs">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <div className="text-sm font-semibold ml-3">
                ${item.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          {volumeDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Percent className="h-3.5 w-3.5" />
                Volume Discount
              </span>
              <span className="font-medium text-green-600">
                -${volumeDiscount.toFixed(2)}
              </span>
            </div>
          )}

          {customerDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Percent className="h-3.5 w-3.5" />
                Customer Discount
              </span>
              <span className="font-medium text-green-600">
                -${customerDiscount.toFixed(2)}
              </span>
            </div>
          )}

          {installationCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Wrench className="h-3.5 w-3.5" />
                Installation
              </span>
              <span className="font-medium">${installationCost.toFixed(2)}</span>
            </div>
          )}

          {deliveryFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Truck className="h-3.5 w-3.5" />
                Delivery
              </span>
              <span className="font-medium">${deliveryFee.toFixed(2)}</span>
            </div>
          )}

          {deliveryFee === 0 && items.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Truck className="h-3.5 w-3.5" />
                Delivery
              </span>
              <span className="font-medium text-green-600">FREE</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Receipt className="h-3.5 w-3.5" />
              Tax (HST)
            </span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
        </div>

        {savings > 0 && (
          <>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1.5 text-green-700 font-medium">
                <DollarSign className="h-3.5 w-3.5" />
                Total Savings
              </span>
              <span className="font-semibold text-green-600">
                ${savings.toFixed(2)}
              </span>
            </div>
          </>
        )}

        <Separator className="my-4" />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {totalDiscounts > 0 && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            You saved ${totalDiscounts.toFixed(2)} with discounts!
          </p>
        )}
      </CardContent>
    </Card>
  )
}
