import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Breadcrumbs } from '@/components/seo'
import enhancedProducts from '@/data/enhanced-products.json'

export const metadata: Metadata = {
  title: 'Collections - Browse Our Closet Door Categories | PG Closets',
  description: 'Explore our full collection of closet doors. Shop barn doors, bifold doors, glass doors, bypass doors, and hardware. Premium quality, custom sizes available.',
  keywords: ['closet doors', 'door collections', 'barn doors', 'bifold doors', 'glass doors', 'bypass doors', 'door hardware'],
}

interface Product {
  id: string
  slug: string
  title: string
  description: string
  price: number
  image: string
  category: string
}

interface CategoryData {
  name: string
  slug: string
  count: number
  heroImage: string
  description: string
}

// Extract categories from products and create category data
function getCategoriesFromProducts(): CategoryData[] {
  const products = enhancedProducts as Product[]

  // Group products by category
  const categoryMap = new Map<string, { products: Product[], count: number }>()

  products.forEach((product) => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, { products: [], count: 0 })
    }
    const categoryData = categoryMap.get(product.category)
    if (categoryData) {
      categoryData.products.push(product)
      categoryData.count++
    }
  })

  // Category descriptions mapping
  const categoryDescriptions: Record<string, string> = {
    'Renin Barn Doors': 'Transform your space with our stunning collection of barn doors. Perfect for closets, pantries, and room dividers, combining rustic charm with modern functionality.',
    'Renin Bifold Doors': 'Maximize space efficiency with our premium bifold closet doors. Designed for smooth operation and long-lasting durability, perfect for closets and tight spaces.',
    'Renin Bypass Doors': 'Discover our versatile collection of bypass sliding closet doors. Classic space-savers with smooth-rolling mechanisms in various materials and finishes.',
    'Renin Pivot Doors': 'Elegant pivot doors for walk-in closets and wardrobes. Modern designs with premium hardware and smooth operation.',
    'Renin Room Dividers': 'Create flexible spaces with our stylish room dividers. Perfect for open-concept homes and multi-functional rooms.',
    'Renin Closet Doors': 'Complete closet door solutions for every style and space. Quality craftsmanship meets contemporary design.',
    'Hardware': 'Premium hardware and accessories for your closet doors. Tracks, handles, hinges, and installation components.',
    'Mirrors': 'Stylish mirrors to complement your closet doors and enhance your space with light and depth.'
  }

  // Convert to array and sort
  const categories: CategoryData[] = Array.from(categoryMap.entries()).map(([name, data]) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    return {
      name,
      slug,
      count: data.count,
      heroImage: data.products[0]?.image || '/images/placeholder.jpg',
      description: categoryDescriptions[name] || `Explore our ${name.toLowerCase()} collection with premium quality products.`
    }
  }).sort((a, b) => a.name.localeCompare(b.name))

  return categories
}

export default function CollectionsPage() {
  const categories = getCategoriesFromProducts()

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-apple-dark-bg-elevated dark:to-apple-dark-bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { name: 'Collections', url: '/collections' }
              ]}
            />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-apple-gray-900 dark:text-apple-dark-text mb-4">
            Our Collections
          </h1>
          <p className="text-xl text-apple-gray-600 dark:text-apple-dark-text-secondary max-w-3xl">
            Discover our premium range of closet doors and hardware. Each collection is carefully curated to bring style, functionality, and quality to your space.
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <CollectionCard key={category.slug} category={category} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-apple-blue-500 to-apple-blue-600 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our experts are here to help you find the perfect closet doors for your space. Get personalized recommendations and professional installation services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-apple-blue-600 rounded-apple font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 border-2 border-white text-white rounded-apple font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

// Collection Card Component
function CollectionCard({ category }: { category: CategoryData }) {
  return (
    <Link
      href={`/collections/${category.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-apple-dark-bg-secondary border border-gray-200 dark:border-apple-dark-border hover:border-gray-300 dark:hover:border-apple-dark-border-heavy transition-all duration-300 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-80 overflow-hidden">
        <Image
          src={category.heroImage}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Category Name Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {category.name}
          </h2>
          <p className="text-white/90 text-sm font-medium">
            {category.count} {category.count === 1 ? 'Product' : 'Products'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-apple-gray-600 dark:text-apple-dark-text-secondary line-clamp-3 mb-4">
          {category.description}
        </p>

        <div className="flex items-center text-apple-blue-500 font-semibold group-hover:gap-3 gap-2 transition-all">
          <span>Explore Collection</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
