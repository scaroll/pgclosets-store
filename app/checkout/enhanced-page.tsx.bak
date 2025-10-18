"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js"
import {
  ChevronRight,
  ChevronLeft,
  Lock,
  CreditCard,
  Truck,
  Package,
  CheckCircle,
  User,
  MapPin,
  Calendar,
  Shield,
  Info
} from "lucide-react"
import StandardLayout from "@/components/layout/StandardLayout"
import { useEnhancedCart, type Address } from "@/hooks/use-enhanced-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Initialize Stripe - use test key for development
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51QlHzCGvHyWCBmCf3GXBu0hfBb7sD20zGIzE4EeKWXEuPSH5c1aEyYHKcCz98qjCqz3bXqBOBHdQLCnJPhRgHrUR00rXgySm5h")

// Checkout steps
const CHECKOUT_STEPS = [
  { id: 1, label: "Contact & Shipping", icon: User },
  { id: 2, label: "Delivery Options", icon: Truck },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Review & Confirm", icon: CheckCircle }
]

// Progress indicator
const CheckoutProgress = ({ currentStep }: { currentStep: number }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between max-w-3xl mx-auto">
      {CHECKOUT_STEPS.map((step, index) => {
        const Icon = step.icon
        const isActive = step.id === currentStep
        const isCompleted = step.id < currentStep

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isActive && "bg-blue-600 text-white",
                  isCompleted && "bg-green-600 text-white",
                  !isActive && !isCompleted && "bg-gray-200 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3 hidden sm:block">
                <p
                  className={cn(
                    "text-sm font-medium",
                    (isActive || isCompleted) && "text-gray-900",
                    !isActive && !isCompleted && "text-gray-500"
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>
            {index < CHECKOUT_STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4",
                  isCompleted ? "bg-green-600" : "bg-gray-200"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  </div>
)

// Step 1: Contact & Shipping
const ContactShippingStep = ({ onNext }: { onNext: () => void }) => {
  const { shippingAddress, setShippingAddress, setBillingAddress, setSameAsShipping } = useEnhancedCart()
  const [formData, setFormData] = useState<Address>(
    shippingAddress || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      province: "ON",
      postalCode: "",
      country: "Canada"
    }
  )
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.phone) newErrors.phone = "Phone is required"
    if (!formData.addressLine1) newErrors.addressLine1 = "Address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.postalCode) newErrors.postalCode = "Postal code is required"

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }

    // Postal code validation (Canadian format)
    if (formData.postalCode && !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(formData.postalCode)) {
      newErrors.postalCode = "Invalid postal code format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setShippingAddress(formData)
      setSameAsShipping(sameAsBilling)
      if (sameAsBilling) {
        setBillingAddress(null)
      }
      onNext()
    }
  }

  const handleChange = (field: keyof Address, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-medium mb-6">Contact Information</h2>

      <div className="space-y-6">
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={cn(errors.firstName && "border-red-500")}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={cn(errors.lastName && "border-red-500")}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={cn(errors.email && "border-red-500")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={cn(errors.phone && "border-red-500")}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
          />
        </div>

        <Separator />

        {/* Shipping Address */}
        <h3 className="text-lg font-medium">Shipping Address</h3>

        <div>
          <Label htmlFor="addressLine1">Address *</Label>
          <Input
            id="addressLine1"
            value={formData.addressLine1}
            onChange={(e) => handleChange("addressLine1", e.target.value)}
            placeholder="123 Main Street"
            className={cn(errors.addressLine1 && "border-red-500")}
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>
          )}
        </div>

        <div>
          <Label htmlFor="addressLine2">Apartment, suite, etc. (Optional)</Label>
          <Input
            id="addressLine2"
            value={formData.addressLine2}
            onChange={(e) => handleChange("addressLine2", e.target.value)}
            placeholder="Apt 4B"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-2 md:col-span-1">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className={cn(errors.city && "border-red-500")}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <Label htmlFor="province">Province *</Label>
            <select
              id="province"
              value={formData.province}
              onChange={(e) => handleChange("province", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-300"
            >
              <option value="ON">Ontario</option>
              <option value="QC">Quebec</option>
              <option value="BC">British Columbia</option>
              <option value="AB">Alberta</option>
            </select>
          </div>

          <div>
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value.toUpperCase())}
              placeholder="K1A 0B1"
              className={cn(errors.postalCode && "border-red-500")}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="sameAsBilling"
            checked={sameAsBilling}
            onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
          />
          <Label htmlFor="sameAsBilling" className="cursor-pointer">
            Billing address same as shipping
          </Label>
        </div>

        <Button onClick={handleSubmit} size="lg" className="w-full gap-2">
          Continue to Delivery Options
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// Step 2: Delivery Options
const DeliveryOptionsStep = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const {
    setInstallationDate,
    setSpecialInstructions,
    installationDate,
    specialInstructions,
    items
  } = useEnhancedCart()

  const [deliveryMethod, setDeliveryMethod] = useState("standard")
  const [includeInstallation, setIncludeInstallation] = useState(false)
  const [selectedDate, setSelectedDate] = useState(installationDate || "")
  const [instructions, setInstructions] = useState(specialInstructions || "")

  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 14; i < 45; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split("T")[0])
      }
    }
    return dates.slice(0, 10)
  }

  const handleSubmit = () => {
    if (includeInstallation && selectedDate) {
      setInstallationDate(selectedDate)
    }
    if (instructions) {
      setSpecialInstructions(instructions)
    }
    onNext()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-medium mb-6">Delivery Options</h2>

      <div className="space-y-6">
        {/* Delivery Method */}
        <div>
          <Label className="text-base mb-3 block">Select Delivery Method</Label>
          <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
            <Card className="mb-3">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="standard" id="standard" />
                  <div className="flex-1">
                    <Label htmlFor="standard" className="cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Standard Delivery</p>
                          <p className="text-sm text-gray-600 mt-1">
                            7-14 business days
                          </p>
                        </div>
                        <span className="font-semibold">$99.00</span>
                      </div>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-3">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="express" id="express" />
                  <div className="flex-1">
                    <Label htmlFor="express" className="cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Express Delivery</p>
                          <p className="text-sm text-gray-600 mt-1">
                            3-5 business days
                          </p>
                        </div>
                        <span className="font-semibold">$199.00</span>
                      </div>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>

        {/* Installation Options */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-gray-600" />
            <Label className="text-base">Professional Installation</Label>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="installation"
                  checked={includeInstallation}
                  onCheckedChange={(checked) => setIncludeInstallation(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="installation" className="cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Add Professional Installation</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Expert installation by certified professionals
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                          <li>• Removal of old doors</li>
                          <li>• Professional installation</li>
                          <li>• Cleanup and disposal</li>
                          <li>• 1-year warranty on installation</li>
                        </ul>
                      </div>
                      <span className="font-semibold">From $299</span>
                    </div>
                  </Label>
                </div>
              </div>

              {includeInstallation && (
                <div className="mt-4 pt-4 border-t">
                  <Label htmlFor="installationDate">Select Installation Date</Label>
                  <select
                    id="installationDate"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full mt-2 h-10 px-3 rounded-md border border-gray-300"
                  >
                    <option value="">Choose a date</option>
                    {getAvailableDates().map((date) => {
                      const dateObj = date ? new Date(date) : new Date();
                      return (
                        <option key={date} value={date}>
                          {dateObj.toLocaleDateString("en-CA", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Special Instructions */}
        <div>
          <Label htmlFor="instructions">Special Instructions (Optional)</Label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Any special delivery or installation instructions..."
            className="w-full mt-2 p-3 rounded-md border border-gray-300 min-h-[100px]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" size="lg" className="flex-1 gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            size="lg"
            className="flex-1 gap-2"
            disabled={includeInstallation && !selectedDate}
          >
            Continue to Payment
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Step 3: Payment (Stripe integration)
const PaymentStep = ({ onNext, onBack }: { onNext: (paymentIntent: any) => void; onBack: () => void }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { getTotal } = useEnhancedCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const total = getTotal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsProcessing(true)

    try {
      // Create payment intent
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convert to cents
          currency: "cad"
        })
      })

      const { clientSecret } = await response.json()

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!
        }
      })

      if (result.error) {
        toast.error(result.error.message || "Payment failed")
      } else if (result.paymentIntent?.status === "succeeded") {
        onNext(result.paymentIntent)
      }
    } catch (error) {
      toast.error("Payment processing failed")
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-medium mb-6">Payment Information</h2>

      {/* Payment Method Selection */}
      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-6">
        <Card className="mb-3">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="card" id="card-payment" />
              <Label htmlFor="card-payment" className="cursor-pointer flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Credit or Debit Card
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-3">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="apple-pay" id="apple-pay" disabled />
              <Label htmlFor="apple-pay" className="cursor-pointer opacity-50">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.08-.54-2.07-.56-3.22 0-1.44.71-2.19.63-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.75 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.58 1.53-1.33 3.04-2.53 4.13M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25"
                    />
                  </svg>
                  Apple Pay (Coming Soon)
                </div>
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-3">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="google-pay" id="google-pay" disabled />
              <Label htmlFor="google-pay" className="cursor-pointer opacity-50">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.25 12.03c0-.69-.06-1.35-.17-2H12v3.88h5.19c-.22 1.2-.89 2.21-1.89 2.89v2.4h3.06c1.79-1.65 2.89-4.08 2.89-7.17z"
                    />
                  </svg>
                  Google Pay (Coming Soon)
                </div>
              </Label>
            </div>
          </CardContent>
        </Card>
      </RadioGroup>

      {paymentMethod === "card" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <Label>Card Details</Label>
                <div className="mt-2 p-3 border rounded-md">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4"
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
                <Shield className="w-4 h-4" />
                <span>Your payment info is encrypted and secure</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              size="lg"
              className="flex-1 gap-2"
              disabled={isProcessing}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              type="submit"
              size="lg"
              className="flex-1 gap-2"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  Pay ${total.toFixed(2)}
                  <Lock className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

// Step 4: Review & Confirm
const ReviewConfirmStep = ({
  paymentIntent,
  onConfirm,
  onBack
}: {
  paymentIntent: any
  onConfirm: () => void
  onBack: () => void
}) => {
  const {
    items,
    shippingAddress,
    installationDate,
    getSubtotal,
    getInstallationTotal,
    getDiscountAmount,
    getShippingCost,
    getTax,
    getTotal
  } = useEnhancedCart()

  const subtotal = getSubtotal()
  const installation = getInstallationTotal()
  const discount = getDiscountAmount()
  const shipping = getShippingCost()
  const tax = getTax()
  const total = getTotal()

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-medium mb-6">Review Your Order</h2>

      <div className="space-y-6">
        {/* Order Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Payment Successful!</p>
              <p className="text-sm text-green-700 mt-1">
                Your payment has been processed. Please review your order details below.
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`}
                  className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Delivery Details</h3>
            {shippingAddress && (
              <div className="space-y-2 text-sm">
                <p>
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                <p>{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                <p>
                  {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}
                </p>
                <p>{shippingAddress.phone}</p>
                <p>{shippingAddress.email}</p>
              </div>
            )}
            {installationDate && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm">
                  <span className="font-medium">Installation Date:</span>{" "}
                  {new Date(installationDate).toLocaleDateString("en-CA", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {installation > 0 && (
                <div className="flex justify-between">
                  <span>Installation</span>
                  <span>${installation.toFixed(2)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (HST)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Total Paid</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Transaction ID: {paymentIntent.id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Button onClick={onConfirm} size="lg" className="w-full gap-2">
          Complete Order
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// Main checkout page
export default function EnhancedCheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useEnhancedCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentIntent, setPaymentIntent] = useState(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && currentStep === 1) {
      router.push("/cart")
    }
  }, [items, currentStep, router])

  const handleComplete = async () => {
    // Create order in database
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          paymentIntentId: paymentIntent?.id,
          // Add other order details
        })
      })

      const { orderId } = await response.json()

      // Clear cart
      clearCart()

      // Redirect to order confirmation
      router.push(`/orders/${orderId}`)
    } catch (error) {
      toast.error("Failed to create order")
      console.error(error)
    }
  }

  return (
    <StandardLayout>
      <Elements stripe={stripePromise}>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-light text-center mb-8">Checkout</h1>

          <CheckoutProgress currentStep={currentStep} />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <ContactShippingStep onNext={() => setCurrentStep(2)} />
              )}
              {currentStep === 2 && (
                <DeliveryOptionsStep
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              )}
              {currentStep === 3 && (
                <PaymentStep
                  onNext={(intent) => {
                    setPaymentIntent(intent)
                    setCurrentStep(4)
                  }}
                  onBack={() => setCurrentStep(2)}
                />
              )}
              {currentStep === 4 && paymentIntent && (
                <ReviewConfirmStep
                  paymentIntent={paymentIntent}
                  onConfirm={handleComplete}
                  onBack={() => setCurrentStep(3)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Elements>
    </StandardLayout>
  )
}