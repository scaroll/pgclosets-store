// Removed shadcn import - using native HTML
import { ArrowLeft, Truck, Clock, MapPin, Package } from "lucide-react"
import Link from "next/link"

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PG</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">PG Closets</span>
                <p className="text-xs text-gray-500">Premium Home Organization</p>
              </div>
            </Link>

            <Link href="/" className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
          <p className="text-lg text-gray-500">Fast, reliable delivery for your premium closet solutions.</p>
          <span className="inline-block mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            FREE Shipping on ALL Orders!
          </span>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Shipping Areas
            </h2>
            <p className="text-gray-600 mb-4">
              We currently ship to all addresses within Canada and the United States.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Canada</h4>
                <p className="text-sm text-gray-500">All provinces and territories</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">United States</h4>
                <p className="text-sm text-gray-500">All 50 states</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Processing and Delivery Times
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Standard Delivery</p>
                  <p className="text-sm text-gray-500">Most orders</p>
                </div>
                <span className="px-3 py-1 border border-gray-300 rounded-full text-sm">5-7 business days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Express Delivery</p>
                  <p className="text-sm text-gray-500">Available on request</p>
                </div>
                <span className="px-3 py-1 border border-gray-300 rounded-full text-sm">2-3 business days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Custom Orders</p>
                  <p className="text-sm text-gray-500">Made-to-order items</p>
                </div>
                <span className="px-3 py-1 border border-gray-300 rounded-full text-sm">2-4 weeks</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Shipping Methods
            </h2>
            <p className="text-gray-600 mb-4">
              We partner with trusted carriers to ensure your orders arrive safely.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Ground Shipping</h4>
                <p className="text-sm text-gray-500">Standard delivery for most items</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">White Glove</h4>
                <p className="text-sm text-gray-500">Premium delivery with installation</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Express</h4>
                <p className="text-sm text-gray-500">Expedited delivery when needed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              Questions about shipping? Our customer service team is here to help.
            </p>
            <div className="space-y-2 text-gray-600">
              <p>Email: shipping@pgclosets.com</p>
              <p>Phone: 1-800-PG-CLOSET</p>
              <p>Hours: Monday-Friday 9AM-6PM EST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
