// Removed shadcn import - using native HTML
import { CheckCircle, Home, Download, Phone, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ConfirmationPage() {
  const orderNumber = "PG-2025-001234"
  const estimatedDelivery = "February 15-22, 2025"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center relative">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 font-serif">PG Closets</span>
                <p className="text-xs text-gray-500">Order Confirmation</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-gray-500">
            Order #{orderNumber} - Estimated delivery: {estimatedDelivery}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-2">Order Details</h2>
            <p className="text-gray-500 text-sm mb-6">Your premium closet solutions are on their way</p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Premium Barn Door System</p>
                    <p className="text-sm text-gray-500">Quantity: 1</p>
                  </div>
                </div>
                <p className="font-medium">$899</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Luxury Walk-In System</p>
                    <p className="text-sm text-gray-500">Quantity: 1</p>
                  </div>
                </div>
                <p className="font-medium">$2,499</p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>$3,398</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax (HST)</span>
                <span>$441.74</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>$3,839.74</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">What Happens Next?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-gray-500">
                      We'll prepare your custom closet systems (1-2 business days)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Design Consultation</p>
                    <p className="text-sm text-gray-500">
                      Our team will contact you to schedule your consultation
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Manufacturing & Delivery</p>
                    <p className="text-sm text-gray-500">Custom manufacturing and delivery (2-3 weeks)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">(416) 555-CLOSET</p>
                    <p className="text-sm text-gray-500">Mon-Sat 9AM-7PM</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">orders@pgclosets.com</p>
                    <p className="text-sm text-gray-500">24/7 Support</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download Order Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/products">
            <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Continue Shopping
            </button>
          </Link>
          <Link href="/">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              Back to Home
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
