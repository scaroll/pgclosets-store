"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import StandardLayout from "@/components/layout/StandardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Home } from "lucide-react"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      window.location.href = "/cart"
      return
    }

    // Verify the session and get order details
    const verifySession = async () => {
      try {
        const response = await fetch(`/api/orders?session_id=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setOrderDetails(data)
        }
      } catch (error) {
        console.error("Error verifying session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    verifySession()
  }, [sessionId])

  if (isLoading) {
    return (
      <StandardLayout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="w-16 h-16 animate-spin rounded-full border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
            <h1 className="text-2xl font-light">Processing your order...</h1>
          </div>
        </div>
      </StandardLayout>
    )
  }

  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-slate-900 mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-lg text-slate-600 font-light tracking-wide mb-12 max-w-2xl mx-auto">
            Your order has been successfully placed and is now being processed. You will receive a confirmation email shortly.
          </p>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-left space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-semibold">#{sessionId?.slice(-8).toUpperCase()}</span>
                </div>
                {orderDetails && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{orderDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold">${orderDetails.total ? (orderDetails.total / 100).toFixed(2) : "N/A"}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">We're preparing your order and will send you updates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Shipping</h3>
              <p className="text-sm text-gray-600">You'll receive tracking information once your order ships</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Delivery</h3>
              <p className="text-sm text-gray-600">Estimated delivery in 5-7 business days</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = "/products"}
              className="bg-slate-900 hover:bg-slate-800"
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/"}
            >
              Return to Home
            </Button>
          </div>

          {/* Support */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:spencer@peoplesgrp.com"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                spencer@peoplesgrp.com
              </a>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Phone: (613) 123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  )
}