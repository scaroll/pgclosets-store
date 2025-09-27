import { Button } from "../ui/button"

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

interface OrderConfirmationProps {
  orderId: string
  shippingInfo: ShippingInfo
}

export function OrderConfirmation({ orderId, shippingInfo }: OrderConfirmationProps) {
  return (
    <div className="card-apple p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <h2 className="text-h2 mb-4 text-green-700">Order Confirmed!</h2>
      <p className="text-body-l text-pg-gray mb-6">
        Thank you for your order. We&apos;ve received your payment and will begin processing your closet doors immediately.
      </p>

      <div className="bg-pg-offwhite p-6 rounded-lg mb-8 text-left">
        <h3 className="text-h3 mb-4">Order Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Order Number:</span>
            <span className="font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{shippingInfo.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Delivery Address:</span>
            <div className="text-right">
              <div>{shippingInfo.address}</div>
              <div>
                {shippingInfo.city}, {shippingInfo.province} {shippingInfo.postalCode}
              </div>
            </div>
          </div>
          {shippingInfo.installationRequested && (
            <div className="flex justify-between">
              <span className="font-medium">Installation:</span>
              <span className="text-green-700">Professional installation included</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-h3">What&apos;s Next?</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-700 mb-2">1. Order Processing</div>
            <p className="text-blue-600">We&apos;ll prepare your custom closet doors (1-2 business days)</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="font-semibold text-yellow-700 mb-2">2. Manufacturing</div>
            <p className="text-yellow-600">Your doors are crafted by Renin (7-10 business days)</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-700 mb-2">3. Delivery & Install</div>
            <p className="text-green-600">
              {shippingInfo.installationRequested
                ? "Professional installation at your home"
                : "Free delivery to your door"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <p className="text-sm text-pg-gray">
          You&apos;ll receive email updates at each step. Questions? Email us at{" "}
          <a href="mailto:spencer@peoplesgrp.com" className="text-pg-navy font-medium">
            spencer@peoplesgrp.com
          </a>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" href="/store">
            Continue Shopping
          </Button>
          <Button variant="secondary" href="/contact">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}
