import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PackageOpen, Award } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductSort } from '@/components/products/product-sort'
import { Pagination } from '@/components/shared/pagination'
import { getCategoryData, isValidCategory, getAllCategorySlugs } from '@/lib/data/categories'

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: {
    sort?: string
    page?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
    limit?: string
  }
}

// ============================================================================
// Metadata Generation
// ============================================================================
export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const categoryData = getCategoryData(params.category)

  if (!categoryData) {
    return {
      title: 'Category Not Found - PG Closets',
      description: 'The requested category could not be found.',
    }
  }

  return {
    title: categoryData.metaTitle,
    description: categoryData.metaDescription,
    keywords: categoryData.keywords,
    openGraph: {
      title: categoryData.metaTitle,
      description: categoryData.metaDescription,
      type: 'website',
      images: [
        {
          url: categoryData.heroImage,
          width: 1200,
          height: 630,
          alt: categoryData.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: categoryData.metaTitle,
      description: categoryData.metaDescription,
      images: [categoryData.heroImage],
    },
  }
}

// ============================================================================
// Static Params Generation (for static site generation)
// ============================================================================
export function generateStaticParams() {
  return getAllCategorySlugs().map(slug => ({
    category: slug,
  }))
}

// ============================================================================
// Data Fetching
// ============================================================================
async function getCategoryProducts(
  categorySlug: string,
  searchParams: CategoryPageProps['searchParams']
) {
  const page = parseInt(searchParams.page || '1')
  const limit = parseInt(searchParams.limit || '24')
  const skip = (page - 1) * limit

  // Build where clause
  const where: Record<string, unknown> = {
    category: {
      slug: categorySlug,
    },
  }

  // Price range filter
  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {}
    if (searchParams.minPrice) {
      ;(where.price as Record<string, number>).gte = parseInt(searchParams.minPrice) * 100
    }
    if (searchParams.maxPrice) {
      ;(where.price as Record<string, number>).lte = parseInt(searchParams.maxPrice) * 100
    }
  }

  // Stock filter
  if (searchParams.inStock === 'true') {
    where.inStock = true
  }

  // Build orderBy clause
  let orderBy: Record<string, string> = { featured: 'desc' }

  switch (searchParams.sort) {
    case 'newest':
      orderBy = { createdAt: 'desc' }
      break
    case 'price-asc':
      orderBy = { price: 'asc' }
      break
    case 'price-desc':
      orderBy = { price: 'desc' }
      break
    case 'name-asc':
      orderBy = { name: 'asc' }
      break
    case 'name-desc':
      orderBy = { name: 'desc' }
      break
  }

  const [products, total, category] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findUnique({
      where: { slug: categorySlug },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ])

  return {
    items: products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.shortDesc || undefined,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      images: product.images,
      inStock: product.inStock,
      featured: product.featured,
      bestseller: product.bestseller,
      category: product.category ? { name: product.category.name } : undefined,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    category,
  }
}

// ============================================================================
// Loading State
// ============================================================================
function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded border border-warm-200 bg-white"
        >
          <div className="aspect-square bg-warm-100" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-1/4 rounded bg-warm-100" />
            <div className="h-6 w-3/4 rounded bg-warm-100" />
            <div className="h-4 w-full rounded bg-warm-100" />
            <div className="h-8 w-1/3 rounded bg-warm-100" />
            <div className="h-10 w-full rounded bg-warm-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Empty State
// ============================================================================
function EmptyState({ categoryName }: { categoryName: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-warm-100">
        <PackageOpen className="h-8 w-8 text-warm-500" />
      </div>
      <h3 className="mb-2 text-2xl font-light text-slate-900">No products found</h3>
      <p className="mb-6 max-w-md text-center text-slate-500">
        We couldn&apos;t find any {categoryName.toLowerCase()} matching your filters. Try adjusting
        your search criteria or browse all products.
      </p>
      <div className="flex gap-4">
        <Link
          href={`/collections/${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
          className="rounded bg-bronze-500 px-6 py-3 font-medium text-white transition-colors hover:bg-bronze-600"
        >
          Clear Filters
        </Link>
        <Link
          href="/products"
          className="rounded border border-warm-300 px-6 py-3 font-medium transition-colors hover:bg-warm-50"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  )
}

// ============================================================================
// Category Hero Component
// ============================================================================
function CategoryHero({
  categoryData,
}: {
  categoryData: NonNullable<ReturnType<typeof getCategoryData>>
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-warm-50 to-warm-100">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={categoryData.heroImage}
          alt={categoryData.name}
          fill
          className="object-cover opacity-10"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4 py-16 lg:py-24">
        {/* Breadcrumbs */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="transition-colors hover:text-bronze-600">
                Home
              </Link>
            </li>
            <li className="text-slate-400">/</li>
            <li>
              <Link href="/collections" className="transition-colors hover:text-bronze-600">
                Collections
              </Link>
            </li>
            <li className="text-slate-400">/</li>
            <li className="font-medium text-slate-900">{categoryData.name}</li>
          </ol>
        </nav>

        {/* Renin Badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded border border-bronze-200 bg-bronze-50 px-2.5 py-1 text-xs font-medium text-bronze-600">
          <Award className="h-3.5 w-3.5" />
          Official Renin Collection
        </div>

        {/* Title and Description */}
        <div className="max-w-2xl">
          <h1 className="mb-4 text-3xl font-light tracking-tight text-slate-900 lg:text-5xl">
            {categoryData.title}
          </h1>
          <p className="text-base leading-relaxed text-slate-600 lg:text-lg">
            {categoryData.description}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Validate category
  if (!isValidCategory(params.category)) {
    notFound()
  }

  const categoryData = getCategoryData(params.category)

  if (!categoryData) {
    notFound()
  }

  // Fetch products
  const data = await getCategoryProducts(params.category, searchParams)

  // If category doesn&apos;t exist in database, show empty state
  if (!data.category) {
    return (
      <main className="min-h-screen bg-warm-white">
        <CategoryHero categoryData={categoryData} />
        <div className="container mx-auto px-4 py-12">
          <EmptyState categoryName={categoryData.name} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-warm-white">
      {/* Category Hero */}
      <CategoryHero categoryData={categoryData} />

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Product Count */}
        <div className="mb-8">
          <p className="text-base text-slate-500">
            {data.total} {data.total === 1 ? 'product' : 'products'} available
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full shrink-0 lg:w-64">
            <ProductFilters />
          </aside>

          {/* Products Grid */}
          <div className="min-w-0 flex-1">
            {/* Sort Controls */}
            <div className="mb-6 flex items-center justify-between border-b border-warm-200 pb-6">
              <ProductSort showViewToggle={false} />
            </div>

            {/* Products */}
            <Suspense fallback={<ProductsLoading />}>
              {data.items.length > 0 ? (
                <>
                  <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {data.items.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={data.page}
                    totalPages={data.totalPages}
                    itemsPerPage={parseInt(searchParams.limit || '24')}
                  />
                </>
              ) : (
                <EmptyState categoryName={categoryData.name} />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}
