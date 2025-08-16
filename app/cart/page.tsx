'use client'

export const dynamic = 'force-dynamic'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/components/commerce/cart-context'
import { usePaddle } from '@/hooks/use-paddle'
import { CartCheckoutButton } from '@/components/ui/cart-checkout-button'
import { StoreHeader } from '@/components/store/store-header'
import { StoreFooter } from '@/components/store/store-footer'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function CartPage() {
  const { cart, updateCartItem } = useCart()
  const { formatPrice, calculateTax } = usePaddle()

  const total = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0
  const taxInfo = calculateTax(total)

  const handleQuantityChange = (merchandiseId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change
    if (newQuantity <= 0) {
      updateCartItem(merchandiseId, 'delete')
      toast.success('Item removed from cart')
    } else if (change > 0) {
      updateCartItem(merchandiseId, 'plus')
    } else {
      updateCartItem(merchandiseId, 'minus')
    }
  }

  const handleRemoveItem = (merchandiseId: string, name: string) => {
    updateCartItem(merchandiseId, 'delete')
    toast.success(`Removed ${name} from cart`)
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild size="lg">
              <Link href="/store">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </main>
        
        <StoreFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/store">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.lines.map((item) => (
                <Card key={item.id || item.merchandise.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.merchandise.product.featuredImage.url}
                          alt={item.merchandise.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{item.merchandise.product.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(parseFloat(item.cost.totalAmount.amount) / item.quantity)} each
                            </p>
                            {item.merchandise.selectedOptions.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {item.merchandise.selectedOptions.map(option => `${option.name}: ${option.value}`).join(', ')}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.merchandise.id, item.merchandise.product.title)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.merchandise.id, item.quantity, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 border rounded min-w-[3rem] text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.merchandise.id, item.quantity, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              {formatPrice(parseFloat(item.cost.totalAmount.amount))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({cart.totalQuantity} items)</span>
                      <span>{formatPrice(parseFloat(cart.cost.subtotalAmount.amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({(taxInfo.taxRate * 100).toFixed(1)}%)</span>
                      <span>{formatPrice(parseFloat(cart.cost.totalTaxAmount.amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        <Badge variant="secondary" className="text-xs">FREE</Badge>
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-xl font-bold">{formatPrice(parseFloat(cart.cost.totalAmount.amount))}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Final price includes all applicable taxes
                    </p>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <CartCheckoutButton
                      className="w-full"
                      onSuccess={(data) => {
                        toast.success('Checkout completed successfully!')
                      }}
                      onError={(error) => {
                        toast.error('Checkout failed', { description: error })
                      }}
                    />
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/checkout">
                        Advanced Checkout
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        SSL Secure
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        PCI Compliant
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <StoreFooter />
    </div>
  )
}