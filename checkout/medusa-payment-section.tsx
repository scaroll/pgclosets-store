"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
// Using custom cart type since @medusajs/medusa doesn't export Cart type
interface Cart {
  id: string
  subtotal: number
  tax_total: number
  shipping_total: number
  total: number
}

interface MedusaPaymentSectionProps {
  cart: Cart | null
  shippingInfo: any
  paymentSessions: any[]
  total: number
  loading: boolean
  onSuccess: (data: any) => void
  onBack: () => void
}

export function MedusaPaymentSection({
  cart,
  shippingInfo: _shippingInfo,
  paymentSessions,
  total,
  loading,
  onSuccess,
  onBack,
}: MedusaPaymentSectionProps) {
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string>("")
  const [processing, setProcessing] = useState(false)

  const handlePaymentProviderSelect = (providerId: string) => {
    setSelectedPaymentProvider(providerId)
  }

  const handlePayment = async () => {
    if (!cart?.id || !selectedPaymentProvider) return

    try {
      setProcessing(true)

      // In a real implementation, this would integrate with the selected payment provider
      // For now, we&apos;ll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      onSuccess({
        payment_provider: selectedPaymentProvider,
        cart_id: cart.id,
      })
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h2 mb-4">Payment Method</h2>

        {/* Payment Provider Selection */}
        <div className="space-y-3">
          {paymentSessions.map((session) => (
            <button
              key={session.provider_id}
              type="button"
              className={`w-full border rounded-lg p-4 transition-colors text-left ${
                selectedPaymentProvider === session.provider_id
                  ? "border-pg-blue bg-pg-blue/5"
                  : "border-pg-light hover:border-pg-gray"
              }`}
              onClick={() => handlePaymentProviderSelect(session.provider_id)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={selectedPaymentProvider === session.provider_id}
                  onChange={() => handlePaymentProviderSelect(session.provider_id)}
                  className="text-pg-blue"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="font-medium capitalize">{session.provider_id}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Payment Form */}
        {selectedPaymentProvider && (
          <div className="mt-6 p-4 border border-pg-light rounded-lg">
            <h3 className="font-medium mb-4">Payment Details</h3>

            {/* Simulated payment form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-pg-light rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium mb-2">
                    Expiry
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-pg-light rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium mb-2">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-pg-light rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-pg-offwhite p-4 rounded-lg">
        <h3 className="font-medium mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${((cart?.subtotal || 0) / 100).toFixed(2)} CAD</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${((cart?.tax_total || 0) / 100).toFixed(2)} CAD</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>${((cart?.shipping_total || 0) / 100).toFixed(2)} CAD</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>Total:</span>
            <span>${(total / 100).toFixed(2)} CAD</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button variant="secondary" onClick={onBack} disabled={processing}>
          Back to Shipping
        </Button>
        <Button onClick={handlePayment} disabled={!selectedPaymentProvider || processing || loading} className="flex-1">
          {processing ? "Processing..." : `Pay ${(total / 100).toFixed(2)} CAD`}
        </Button>
      </div>
    </div>
  )
}
