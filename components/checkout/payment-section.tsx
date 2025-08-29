"use client"

import { Button } from "@/components/ui/button"
import { CartCheckoutButton } from "@/components/ui/cart-checkout-button"
import { formatPrice } from "@/lib/renin-products"

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  installationRequested: boolean
  specialInstructions: string
}

interface PaymentSectionProps {
  shippingInfo: ShippingInfo
  total: number
  onSuccess: (data: any) => void
  onBack: () => void
}

export function PaymentSection({ shippingInfo, total, onSuccess, onBack }: PaymentSectionProps) {
  return (
    <div className="card-apple p-8">
      <h2 className="text-h2 mb-6">Payment</h2>

      <div className="mb-8">
        <h3 className="text-h3 mb-4">Shipping Address</h3>
        <div className="bg-pg-offwhite p-4 rounded-lg text-sm">
          <p className="font-medium">
            {shippingInfo.firstName} {shippingInfo.lastName}
          </p>
          <p>{shippingInfo.address}</p>
          <p>
            {shippingInfo.city}, {shippingInfo.province} {shippingInfo.postalCode}
          </p>
          <p className="mt-2">
            <span className="font-medium">Email:</span> {shippingInfo.email}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {shippingInfo.phone}
          </p>
          {shippingInfo.installationRequested && (
            <p className="mt-2 text-green-700 font-medium">✓ Professional installation requested</p>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={onBack} className="mt-3">
          Edit Shipping Info
        </Button>
      </div>

      <div className="mb-8">
        <h3 className="text-h3 mb-4">Secure Payment</h3>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-blue-700 text-sm mb-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Secure SSL Encryption</span>
          </div>
          <p className="text-xs text-blue-600">
            Your payment information is encrypted and secure. We accept all major credit cards.
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Total: {formatPrice(total)}</p>
          <CartCheckoutButton onSuccess={onSuccess} className="w-full max-w-md mx-auto" />
        </div>
      </div>

      <div className="text-center text-sm text-pg-gray">
        <p>By completing your purchase, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  )
}
