import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getProductByHandle, getDefaultRegion, getRelatedProducts } from "@/lib/medusa"
import { MedusaProductDetail } from "@/components/medusa/product-detail"
import { MedusaProductGrid } from "@/components/medusa/product-card"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  
  if (!product) {
    return {
      title: "Product Not Found - PG Closets",
    }
  }

  return {
    title: `${product.title} - PG Closets`,
    description: product.description || `View details for ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || undefined,
      images: product.images?.map(img => ({
        url: img.url,
        alt: product.title,
      })) || [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  
  if (!product) {
    notFound()
  }

  return (
    <div className="bg-white min-h-screen">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductContent product={product} />
      </Suspense>
      
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProductsSection productId={product.id} />
      </Suspense>
    </div>
  )
}

async function ProductContent({ product }: { product: any }) {
  const region = await getDefaultRegion()
  
  return (
    <MedusaProductDetail 
      product={product} 
      region={region || undefined} 
    />
  )
}

async function RelatedProductsSection({ productId }: { productId: string }) {
  const [relatedProducts, region] = await Promise.all([
    getRelatedProducts(productId, 4),
    getDefaultRegion()
  ])

  if (!relatedProducts.length) {
    return null
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
        Related Products
      </h2>
      <MedusaProductGrid 
        products={relatedProducts} 
        region={region || undefined}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      />
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image skeleton */}
        <div className="flex flex-col-reverse">
          <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
            <div className="grid grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-md" />
              ))}
            </div>
          </div>
          <Skeleton className="w-full aspect-square rounded-lg" />
        </div>

        {/* Product info skeleton */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-8 w-1/4 mb-6" />
          <div className="space-y-3 mb-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}

function RelatedProductsSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
    </div>
  )
}