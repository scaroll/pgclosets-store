// Removed shadcn import - using native HTML
import { ArrowLeft, RotateCcw, Shield, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center relative">
                <span className="text-white font-bold text-sm">PG</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 font-serif">PG Closets</span>
                <p className="text-xs text-gray-500">Premium Home Organization</p>
              </div>
            </Link>

            <Link href="/">
              <button className="flex items-center text-gray-600 hover:text-gray-900 px-4 py-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <RotateCcw className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Return & Refund Policy</h1>
          <p className="text-lg text-gray-600">
            Your satisfaction is our priority. Easy returns and hassle-free refunds.
          </p>
          <span className="inline-block mt-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">30-Day Return Window</span>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Our Return Promise
            </h2>
            <p className="text-gray-600">
              We stand behind the quality of our products. If you're not completely satisfied with your purchase, you
              can return most items within 30 days of delivery for a full refund or exchange.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
              Eligible Returns
            </h2>
            <p className="text-gray-600 mb-4">Items eligible for return must meet the following conditions:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Returned within 30 days of delivery
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                In original, unused condition
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                In original packaging with all accessories
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Include original receipt or order confirmation
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
              Non-Returnable Items
            </h2>
            <p className="text-gray-600 mb-4">The following items cannot be returned:</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Custom-made or personalized items
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Items that have been installed or modified
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Items damaged by misuse or normal wear
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                Final sale or clearance items
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Our Returns Team</h2>
            <p className="text-gray-600 mb-4">
              Need help with a return? Our customer service team is here to assist you.
            </p>
            <div className="space-y-2 text-gray-600">
              <p>Email: returns@pgclosets.com</p>
              <p>Phone: 1-800-PG-CLOSET</p>
              <p>Hours: Monday-Friday 9AM-6PM EST</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Start a Return</button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
