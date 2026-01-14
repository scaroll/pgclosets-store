// Removed shadcn import - using native HTML
import { CreditCard, Plus, Edit, Trash2, ArrowLeft, Shield, Calendar } from "lucide-react"
import Link from "next/link"

export default function PaymentMethodsPage() {
  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/26",
      name: "John Smith",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8888",
      expiry: "08/25",
      name: "John Smith",
      isDefault: false,
    },
  ]

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

            <Link href="/account" className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Methods</h1>
            <p className="text-gray-500">Manage your saved payment methods</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </button>
        </div>

        <div className="space-y-6">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-semibold text-gray-900">
                        {method.type} •••• {method.last4}
                      </p>
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{method.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Expires {method.expiry}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  {!method.isDefault && (
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {!method.isDefault && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    Set as Default Payment Method
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add New Payment Method Card */}
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Add Payment Method</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add a new credit card or payment method to your account
            </p>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </button>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Security & Privacy
          </h2>
          <p className="text-gray-500 text-sm mb-4">Your payment information is secure</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Secure Processing</h4>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>- All payments are processed securely with SSL encryption</li>
                <li>- We never store your full credit card number</li>
                <li>- PCI DSS compliant payment processing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Accepted Payment Methods</h4>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>- Visa, Mastercard, American Express</li>
                <li>- PayPal and Apple Pay</li>
                <li>- Financing options available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
