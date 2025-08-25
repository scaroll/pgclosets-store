import { Suspense } from "react"
import { getProducts, getDefaultRegion } from "@/lib/medusa"
import { MedusaProductGrid } from "@/components/medusa/product-card"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "MedusaJS Store - PG Closets",
  description: "Browse our collection of products powered by MedusaJS",
}

export default async function MedusaStorePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div className="sm:flex sm:items-baseline sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          MedusaJS Products
        </h2>
        <p className="mt-1 text-sm text-gray-600 sm:mt-0">
          Powered by MedusaJS e-commerce engine
        </p>
      </div>

      <Suspense fallback={<MedusaStorePageSkeleton />}>
        <MedusaStoreContent />
      </Suspense>
    </div>
  )
}

async function MedusaStoreContent() {
  const [productsResponse, region] = await Promise.all([
    getProducts({ limit: 20 }),
    getDefaultRegion()
  ])

  if (!productsResponse.products.length) {
    return (
      <div className="mt-8 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Make sure your MedusaJS backend is running and configured properly.
        </p>
        <div className="mt-6">
          <div className="text-sm text-gray-500 space-y-2">
            <p><strong>Backend URL:</strong> {process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <MedusaProductGrid 
        products={productsResponse.products} 
        region={region || undefined}
      />
      
      {productsResponse.count > productsResponse.products.length && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Showing {productsResponse.products.length} of {productsResponse.count} products
          </p>
        </div>
      )}
    </div>
  )
}

function MedusaStorePageSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}