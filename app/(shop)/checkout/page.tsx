// @ts-nocheck
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Check, CreditCard } from "lucide-react"
import { useCartStore } from "@/lib/stores/cart-store"
import { OrderSummary } from "@/components/checkout/order-summary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STEPS = [
  { id: 1, name: "Contact", title: "Contact Information" },
  { id: 2, name: "Shipping", title: "Shipping Address" },
  { id: 3, name: "Delivery", title: "Delivery Method" },
  { id: 4, name: "Payment", title: "Payment Details" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isProcessing, setIsProcessing] = React.useState(false)

  // Form state
  const [contactInfo, setContactInfo] = React.useState({
    email: "",
    phone: "",
  })

  const [shippingAddress, setShippingAddress] = React.useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  })

  const [deliveryMethod, setDeliveryMethod] = React.useState("standard")

  const [paymentInfo, setPaymentInfo] = React.useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  // Redirect if cart is empty
  React.useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  const handleNextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmitOrder = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Clear cart and redirect to success page
    clearCart()
    router.push("/checkout/success")
  }

  if (items.length === 0) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-8">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      step.id < currentStep
                        ? "bg-green-500 text-white"
                        : step.id === currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      step.id === currentStep
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-16 md:w-24 h-1 mx-2 transition-colors ${
                      step.id < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                <CardDescription>
                  Step {currentStep} of {STEPS.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Step 1: Contact Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={contactInfo.email}
                        onChange={(e) =>
                          setContactInfo({ ...contactInfo, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={contactInfo.phone}
                        onChange={(e) =>
                          setContactInfo({ ...contactInfo, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Shipping Address */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={shippingAddress.firstName}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              firstName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={shippingAddress.lastName}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              lastName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address1">Street Address</Label>
                      <Input
                        id="address1"
                        placeholder="123 Main St"
                        value={shippingAddress.address1}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            address1: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address2">
                        Apartment, suite, etc. (optional)
                      </Label>
                      <Input
                        id="address2"
                        placeholder="Apt 4B"
                        value={shippingAddress.address2}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            address2: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={shippingAddress.city}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              city: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select
                          value={shippingAddress.state}
                          onValueChange={(value) =>
                            setShippingAddress({ ...shippingAddress, state: value })
                          }
                        >
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={shippingAddress.zipCode}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              zipCode: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select
                          value={shippingAddress.country}
                          onValueChange={(value) =>
                            setShippingAddress({ ...shippingAddress, country: value })
                          }
                        >
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Delivery Method */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        deliveryMethod === "standard"
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setDeliveryMethod("standard")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Standard Shipping</h3>
                          <p className="text-sm text-muted-foreground">
                            5-7 business days
                          </p>
                        </div>
                        <div className="font-semibold">
                          {total > 100 ? "FREE" : "$15.00"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        deliveryMethod === "express"
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setDeliveryMethod("express")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Express Shipping</h3>
                          <p className="text-sm text-muted-foreground">
                            2-3 business days
                          </p>
                        </div>
                        <div className="font-semibold">$35.00</div>
                      </div>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        deliveryMethod === "overnight"
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setDeliveryMethod("overnight")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Overnight Shipping</h3>
                          <p className="text-sm text-muted-foreground">
                            Next business day
                          </p>
                        </div>
                        <div className="font-semibold">$50.00</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Demo Mode</p>
                        <p>
                          This is a demonstration checkout. No real payment will be
                          processed. In production, this would integrate with Stripe.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        placeholder="John Doe"
                        value={paymentInfo.cardholderName}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cardholderName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        value={paymentInfo.cardNumber}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cardNumber: e.target.value,
                          })
                        }
                        maxLength={19}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentInfo.expiryDate}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              expiryDate: e.target.value,
                            })
                          }
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentInfo.cvv}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cvv: e.target.value,
                            })
                          }
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  {currentStep < STEPS.length ? (
                    <Button onClick={handleNextStep}>Continue</Button>
                  ) : (
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={isProcessing}
                      size="lg"
                    >
                      {isProcessing ? "Processing..." : "Place Order"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
