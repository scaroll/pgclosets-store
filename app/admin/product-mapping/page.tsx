"use client"

import Link from "next/link"

export default function ProductMappingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Product Mapping</h1>
          <p className="text-gray-600 mt-2">Map products to blob storage images</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Mapping</h2>
            <p className="text-gray-600">This feature is being updated. Please check back later.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
