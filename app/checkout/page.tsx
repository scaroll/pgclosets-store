"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import StandardLayout from "@/components/layout/StandardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/useCart"
import {
  ShoppingCart,
  CreditCard,
  Truck,
  Shield,
  User,
  MapPin,
  Package,
  Check,
  ChevronRight,
  ChevronLeft,
  Lock,
  AlertCircle,
  RefreshCw,
  Gift,
  Smartphone,
  CreditCard as CardIcon,
  Building,
  Home,
  Clock,
  Star,
  HelpCircle
} from "lucide-react"
import { toast } from "sonner"

interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  postalCode: string
  country: string
  phone: string
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: <CardIcon className="w-5 h-5" />,
    description: 'Pay with Visa, Mastercard, or Amex'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: <Building className="w-5 h-5" />,
    description: 'Fast and secure payment'
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    icon: <Smartphone className="w-5 h-5" />,
    description: 'Pay with Apple Pay'
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    icon: <Smartphone className="w-5 h-5" />,
    description: 'Pay with Google Pay'
  }
]

const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    price: 0,
    estimatedDays: '5-7 business days',
    description: 'Free on orders over $100'
  },
  {
    id: 'express',
    name: 'Express Shipping',
    price: 25,
    estimatedDays: '2-3 business days',
    description: 'Track every step'
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    price: 50,
    estimatedDays: 'Next business day',
    description: 'Order before 12pm EST'
  }
]

export default function CheckoutPage() {
  const { items } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isGuest, setIsGuest] = useState(true)

  // Contact Information
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Shipping Address
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Canada",
    phone: ""
  })
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true)
  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Canada",
    phone: ""
  })

  // Shipping Method
  const [selectedShipping, setSelectedShipping] = useState('standard')

  // Payment
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [savePaymentInfo, setSavePaymentInfo] = useState(false)
  const [giftWrapping, setGiftWrapping] = useState(false)
  const [orderNotes, setOrderNotes] = useState("")

  // Calculations
  const subtotal = items.reduce((total, item) => total + (item.price * item.qty), 0)
  const shippingCost = calculateShipping(subtotal, selectedShipping)
  const giftWrappingCost = giftWrapping ? items.length * 5 : 0
  const tax = (subtotal + shippingCost + giftWrappingCost) * 0.13
  const total = subtotal + shippingCost + giftWrappingCost + tax

  function calculateShipping(subtotal: number, shippingId: string): number {
    if (subtotal >= 100 && shippingId === 'standard') return 0
    const option = SHIPPING_OPTIONS.find(opt => opt.id === shippingId)
    return option?.price || 0
  }

  useEffect(() => {
    if (items.length === 0) {
      window.location.href = "/cart"
      return
    }
  }, [items])

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return email !== "" && phone !== ""
      case 2:
        return shippingAddress.firstName !== "" &&
               shippingAddress.lastName !== "" &&
               shippingAddress.address1 !== "" &&
               shippingAddress.city !== "" &&
               shippingAddress.province !== "" &&
               shippingAddress.postalCode !== ""
      case 3:
        return selectedShipping !== ""
      case 4:
        return selectedPayment !== ""
      default:
        return true
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    } else {
      toast.error("Please fill in all required fields")
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handlePlaceOrder = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please complete all required fields")
      return
    }

    setIsLoading(true)
    try {
      // Here you would integrate with your payment processor
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          shippingAddress,
          billingAddress: billingSameAsShipping ? shippingAddress : billingAddress,
          shippingMethod: selectedShipping,
          paymentMethod: selectedPayment,
          giftWrapping,
          orderNotes,
          items,
          total
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const { url, orderId } = await response.json()

      // Redirect to payment page or success page
      if (url) {
        window.location.href = url
      } else {
        window.location.href = `/checkout/success?order=${orderId}`
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Failed to process order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(613) 123-4567"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Guest Checkout</p>
                    <p className="text-sm text-blue-800">
                      You can checkout as a guest or create an account for faster checkout next time.
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600 underline"
                      onClick={() => setIsGuest(!isGuest)}
                    >
                      {isGuest ? 'Create an account' : 'Continue as guest'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <h4 className="font-medium">Account Benefits</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Save multiple shipping addresses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>View order history and tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Quick checkout with saved payment methods</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Exclusive offers and rewards</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={shippingAddress.firstName}
                    onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={shippingAddress.lastName}
                    onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  value={shippingAddress.company}
                  onChange={(e) => setShippingAddress({...shippingAddress, company: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="address1">Address Line 1 *</Label>
                <Input
                  id="address1"
                  value={shippingAddress.address1}
                  onChange={(e) => setShippingAddress({...shippingAddress, address1: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                <Input
                  id="address2"
                  value={shippingAddress.address2}
                  onChange={(e) => setShippingAddress({...shippingAddress, address2: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="province">Province *</Label>
                  <Input
                    id="province"
                    value={shippingAddress.province}
                    onChange={(e) => setShippingAddress({...shippingAddress, province: e.target.value})}
                    placeholder="ON"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                    placeholder="K1A 0B1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                    disabled
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Checkbox
                  id="billingSame"
                  checked={billingSameAsShipping}
                  onCheckedChange={(checked) => setBillingSameAsShipping(checked as boolean)}
                />
                <Label htmlFor="billingSame" className="text-sm">
                  Billing address is the same as shipping address
                </Label>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                {SHIPPING_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedShipping === option.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <div>
                        <p className="font-medium">{option.name}</p>
                        <p className="text-sm text-gray-600">{option.description}</p>
                        <p className="text-sm text-gray-500">{option.estimatedDays}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {option.price === 0 && subtotal >= 100 ? 'FREE' : `$${option.price}`}
                      </p>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900 mb-1">Delivery Time</p>
                    <p className="text-sm text-amber-800">
                      Orders placed before 12pm EST are typically processed the same day.
                      You'll receive tracking information once your order ships.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === method.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex items-center gap-2">
                        {method.icon}
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              {selectedPayment === 'card' && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date *</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card *</Label>
                    <Input
                      id="cardName"
                      placeholder={`${shippingAddress.firstName} ${shippingAddress.lastName}`}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="savePayment"
                    checked={savePaymentInfo}
                    onCheckedChange={(checked) => setSavePaymentInfo(checked as boolean)}
                  />
                  <Label htmlFor="savePayment" className="text-sm">
                    Save payment information for future purchases
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="giftWrap"
                    checked={giftWrapping}
                    onCheckedChange={(checked) => setGiftWrapping(checked as boolean)}
                  />
                  <Label htmlFor="giftWrap" className="text-sm">
                    Add gift wrapping (${(items.length * 5).toFixed(2)})
                  </Label>
                </div>

                <div>
                  <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                  <textarea
                    id="orderNotes"
                    className="w-full p-2 border rounded-md text-sm"
                    rows={3}
                    placeholder="Special instructions for your order..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  if (items.length === 0) {
    return (
      <StandardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-4xl font-extralight tracking-tight text-slate-900 mb-4">Your Cart is Empty</h1>
            <p className="text-slate-600 font-light tracking-wide mb-8">Add some products to get started!</p>
            <Button onClick={() => window.location.href = "/products"} className="bg-slate-900 hover:bg-slate-800 font-light tracking-widest">
              Continue Shopping
            </Button>
          </div>
        </div>
      </StandardLayout>
    )
  }

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-slate-900 mb-8">Secure Checkout</h1>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[
                { step: 1, label: 'Contact', icon: <User className="w-5 h-5" /> },
                { step: 2, label: 'Address', icon: <MapPin className="w-5 h-5" /> },
                { step: 3, label: 'Shipping', icon: <Truck className="w-5 h-5" /> },
                { step: 4, label: 'Payment', icon: <CreditCard className="w-5 h-5" /> }
              ].map((item) => (
                <div key={item.step} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                    currentStep >= item.step
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > item.step ? <Check className="w-5 h-5" /> : item.icon}
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep >= item.step ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {item.label}
                  </span>
                  {item.step < 4 && (
                    <ChevronRight className="w-5 h-5 mx-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {renderStepContent()}

              {/* Order Items Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Items ({items.reduce((sum, item) => sum + item.qty, 0)})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="xl:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  {giftWrapping && (
                    <div className="flex justify-between">
                      <span>Gift Wrapping:</span>
                      <span>${giftWrappingCost.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Tax (13% HST):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)} CAD</span>
                  </div>

                  {/* Trust Badges */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Lock className="w-4 h-4" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <RefreshCw className="w-4 h-4" />
                      <span>30-Day Returns</span>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="space-y-2 pt-4">
                    {currentStep > 1 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handlePrevStep}
                        disabled={isLoading}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}

                    {currentStep < 4 ? (
                      <Button
                        className="w-full"
                        onClick={handleNextStep}
                        disabled={isLoading}
                      >
                        Next Step
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={handlePlaceOrder}
                        disabled={isLoading}
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Place Order • ${total.toFixed(2)}
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    By placing this order, you agree to our Terms of Service and Privacy Policy.
                  </p>

                  {/* Help Section */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">Need help?</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Contact our support team at support@example.com or call 1-800-123-4567
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  )
}