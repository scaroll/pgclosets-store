"use client";

import { ReninQuoteForm } from "@/components/quote/renin-quote-form";

export default function ReninQuotePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900">Ottawa Renin Quote Request</h1>
            <p className="mt-2 text-lg text-gray-600">
              Get a personalized quote for premium Renin closet doors and systems with Ottawa-specific pricing
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ottawa-Specific Pricing</h3>
              <p className="text-gray-600">
                Accurate pricing with 35% reseller markup, local delivery zones, and 13% HST included
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Installation</h3>
              <p className="text-gray-600">
                Expert installation available with pricing based on door type and complexity
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Discounts</h3>
              <p className="text-gray-600">
                Senior discounts (10% off) and contractor pricing (15% off) available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Form */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReninQuoteForm />
        </div>
      </div>

      {/* Ottawa Service Areas */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Ottawa Service Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Downtown Ottawa</h3>
              <p className="text-sm text-gray-600 mb-2">
                K1A, K1B, K1G, K1H, K1J, K1K, K1L, K1M, K1N, K1P, K1R, K1S, K1T, K1V, K1W, K1X, K1Y, K1Z
              </p>
              <p className="text-sm font-medium text-green-600">
                $75 delivery • Free over $2,000
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Kanata/Stittsville</h3>
              <p className="text-sm text-gray-600 mb-2">
                K2K, K2M, K2S, K2T, K2V, K2W
              </p>
              <p className="text-sm font-medium text-green-600">
                $100 delivery • Free over $2,500
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Orleans/Cumberland</h3>
              <p className="text-sm text-gray-600 mb-2">
                K1C, K1E, K1W, K4A, K4K, K4M
              </p>
              <p className="text-sm font-medium text-green-600">
                $125 delivery • Free over $2,500
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Nepean/Barrhaven</h3>
              <p className="text-sm text-gray-600 mb-2">
                K2A, K2B, K2C, K2E, K2G, K2H, K2J, K2L
              </p>
              <p className="text-sm font-medium text-green-600">
                $100 delivery • Free over $2,000
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Outer Ottawa/Rural</h3>
              <p className="text-sm text-gray-600 mb-2">
                K0A, K0G, K4B, K4C, K4P, K4R
              </p>
              <p className="text-sm font-medium text-green-600">
                $175 delivery • Free over $3,000
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financing Information */}
      <div className="py-12 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Financing Available
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            0% APR financing available for qualified customers on orders over $1,000
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">6 months</div>
              <div className="text-sm text-gray-600">0% APR</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">12 months</div>
              <div className="text-sm text-gray-600">0% APR</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">24 months</div>
              <div className="text-sm text-gray-600">5.99% APR</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">36 months</div>
              <div className="text-sm text-gray-600">8.99% APR</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            * Subject to credit approval. Terms and conditions apply.
          </p>
        </div>
      </div>
    </div>
  );
}