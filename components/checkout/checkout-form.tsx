'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { usePaddle, type PaddleCustomer } from '@/hooks/use-paddle'
import { useCart } from '@/components/commerce/cart-context'
import { toast } from 'sonner'
import { Loader2, CreditCard, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface CheckoutFormProps {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  className?: string
}

export function CheckoutForm({ onSuccess, onError, className }: CheckoutFormProps) {
  const { cart } = useCart()
  const items = cart?.lines || []
  const total = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0
  const { isLoaded, isLoading, openCheckout, calculateTax, formatPrice } = usePaddle()
  const [formData, setFormData] = useState<PaddleCustomer>({
    email: '',
    first_name: '',
    last_name: '',
    address: {
      country_code: 'CA',
      postal_code: '',
      region: 'ON',
      city: '',
      first_line: '',
      second_line: ''
    }
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)

  const provinces = [
    { code: 'ON', name: 'Ontario' },
    { code: 'QC', name: 'Quebec' },
    { code: 'BC', name: 'British Columbia' },
    { code: 'AB', name: 'Alberta' },
    { code: 'MB', name: 'Manitoba' },
    { code: 'SK', name: 'Saskatchewan' },
    { code: 'NS', name: 'Nova Scotia' },
    { code: 'NB', name: 'New Brunswick' },
    { code: 'NL', name: 'Newfoundland and Labrador' },
    { code: 'PE', name: 'Prince Edward Island' },
    { code: 'YT', name: 'Yukon' },
    { code: 'NT', name: 'Northwest Territories' },
    { code: 'NU', name: 'Nunavut' }
  ]

  const taxCalculation = calculateTax(total, formData.address?.region || 'ON')

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        } as any
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const validateForm = () => {
    if (!formData.email || !formData.first_name || !formData.last_name) {
      toast.error('Please fill in all required fields')
      return false
    }
    if (!agreeToTerms) {
      toast.error('Please agree to terms and conditions')
      return false
    }
    return true
  }

  const handleCheckout = async () => {
    if (!validateForm() || !isLoaded || isLoading || localLoading || items.length === 0) return

    setLocalLoading(true)

    try {
      const paddleItems = items.map(item => ({
        priceId: item.id,
        quantity: item.quantity
      }))

      await openCheckout({
        items: paddleItems,
        customer: formData,
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'en',
          allowLogout: false,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: window.location.href,
        }
      })

      // clearCart() // TODO: Implement cart clearing in new cart context
      onSuccess?.(paddleItems)
      
      toast.success('Checkout initiated!', {
        description: `Total: ${formatPrice(taxCalculation.total)} • ${items.length} items`
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed'
      onError?.(errorMessage)
      toast.error('Checkout failed', {
        description: errorMessage
      })
    } finally {
      setLocalLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button variant="outline" onClick={() => window.location.href = '/store'}>
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.merchandise.title}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(Number(item.cost.totalAmount.amount))}</p>
            </div>
          ))}
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(taxCalculation.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({(taxCalculation.taxRate * 100).toFixed(1)}%)</span>
              <span>{formatPrice(taxCalculation.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>{formatPrice(taxCalculation.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address_line1">Address Line 1</Label>
            <Input
              id="address_line1"
              value={formData.address?.first_line || ''}
              onChange={(e) => handleInputChange('address.first_line', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
            <Input
              id="address_line2"
              value={formData.address?.second_line || ''}
              onChange={(e) => handleInputChange('address.second_line', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.address?.city || ''}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Select
                value={formData.address?.region || 'ON'}
                onValueChange={(value) => handleInputChange('address.region', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              value={formData.address?.postal_code || ''}
              onChange={(e) => handleInputChange('address.postal_code', e.target.value.toUpperCase())}
              placeholder="K1A 0A6"
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the terms and conditions
              </Label>
              <p className="text-xs text-muted-foreground">
                By proceeding, you agree to PG Closets' terms of service and privacy policy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleCheckout}
            disabled={!isLoaded || isLoading || localLoading || !agreeToTerms}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {(isLoading || localLoading) ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Secure Checkout - {formatPrice(taxCalculation.total)}
              </>
            )}
          </Button>
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="text-xs">
              <ShieldCheck className="w-3 h-3 mr-1" />
              SSL Secure
            </Badge>
            <Badge variant="outline" className="text-xs">
              256-bit Encryption
            </Badge>
            <Badge variant="outline" className="text-xs">
              PCI Compliant
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}