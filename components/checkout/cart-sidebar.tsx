'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/components/commerce/cart-context'
import { usePaddle } from '@/hooks/use-paddle'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface CartSidebarProps {
  children?: React.ReactNode
}

export function CartSidebar({ children }: CartSidebarProps) {
  const { cart, updateCartItem } = useCart()
  const items = cart?.lines || []
  const total = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0
  const itemCount = cart?.totalQuantity || 0
  const { formatPrice } = usePaddle()
  const [open, setOpen] = useState(false)

  const handleQuantityChange = (merchandiseId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change
    if (newQuantity <= 0) {
      updateCartItem(merchandiseId, 'delete')
    } else if (change > 0) {
      updateCartItem(merchandiseId, 'plus')
    } else {
      updateCartItem(merchandiseId, 'minus')
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {itemCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-6">Add some products to get started</p>
              <Button onClick={() => setOpen(false)} asChild>
                <Link href="/store">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    {(item as any).image && (
                      <img
                        src={(item as any).image}
                        alt={item.merchandise.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.merchandise.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(Number(item.cost.totalAmount.amount) / item.quantity)} each
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.merchandise.id, item.quantity, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 py-1 border rounded text-sm min-w-[3rem] text-center">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => updateCartItem(item.merchandise.id, 'delete')}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(Number(item.cost.totalAmount.amount))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold">{formatPrice(total)}</span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setOpen(false)}
                    asChild
                  >
                    <Link href="/checkout">
                      Proceed to Checkout
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setOpen(false)}
                    asChild
                  >
                    <Link href="/store">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}