'use client'

import { usePaddle } from '@/hooks/use-paddle'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calculator, Truck, Shield } from 'lucide-react'

interface PaddlePriceDisplayProps {
  basePrice: number
  province?: string
  showBreakdown?: boolean
  showShipping?: boolean
  className?: string
}

export function PaddlePriceDisplay({ 
  basePrice, 
  province = 'ON', 
  showBreakdown = false,
  showShipping = false,
  className 
}: PaddlePriceDisplayProps) {
  const { calculateTax, formatPrice } = usePaddle()
  
  const taxInfo = calculateTax(basePrice, province)
  const shippingCost = 0 // Free shipping for closet systems
  const finalTotal = taxInfo.total + shippingCost

  if (!showBreakdown) {
    return (
      <div className={`space-y-1 ${className}`}>
        <div className="text-2xl font-bold">{formatPrice(finalTotal)}</div>
        <div className="text-xs text-muted-foreground">
          Includes {(taxInfo.taxRate * 100).toFixed(1)}% tax
        </div>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="h-4 w-4" />
          <span className="font-medium">Price Breakdown</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Product Price</span>
            <span>{formatPrice(taxInfo.subtotal)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Tax ({(taxInfo.taxRate * 100).toFixed(1)}%)</span>
            <span>{formatPrice(taxInfo.tax)}</span>
          </div>
          
          {showShipping && (
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <Truck className="h-3 w-3" />
                Shipping
              </span>
              <span>
                {shippingCost === 0 ? (
                  <Badge variant="secondary" className="text-xs">FREE</Badge>
                ) : (
                  formatPrice(shippingCost)
                )}
              </span>
            </div>
          )}
          
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            Secure checkout with 256-bit SSL encryption
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PriceComparisonProps {
  originalPrice: number
  salePrice?: number
  province?: string
  className?: string
}

export function PriceComparison({ 
  originalPrice, 
  salePrice, 
  province = 'ON', 
  className 
}: PriceComparisonProps) {
  const { calculateTax, formatPrice } = usePaddle()
  
  const currentPrice = salePrice || originalPrice
  const taxInfo = calculateTax(currentPrice, province)
  const savings = salePrice ? originalPrice - salePrice : 0
  const savingsPercent = salePrice ? ((savings / originalPrice) * 100).toFixed(0) : 0

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        {salePrice ? (
          <>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(taxInfo.total)}
            </div>
            <div className="text-lg text-muted-foreground line-through">
              {formatPrice(calculateTax(originalPrice, province).total)}
            </div>
            <Badge variant="destructive" className="text-xs">
              Save {savingsPercent}%
            </Badge>
          </>
        ) : (
          <div className="text-2xl font-bold">{formatPrice(taxInfo.total)}</div>
        )}
      </div>
      
      {salePrice && (
        <div className="text-sm text-green-600 font-medium">
          You save {formatPrice(calculateTax(savings, province).total)} including tax
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        Includes {(taxInfo.taxRate * 100).toFixed(1)}% tax • Final price at checkout
      </div>
    </div>
  )
}