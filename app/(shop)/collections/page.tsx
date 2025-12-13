import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { CATEGORY_DATA } from '@/lib/data/categories'

export const metadata: Metadata = {
  title: 'Collections - Browse Our Closet Door Categories | PG Closets',
  description: 'Explore our full collection of closet doors. Shop barn doors, bifold doors, glass doors, bypass doors, and hardware. Premium quality, custom sizes available.',
  keywords: ['closet doors', 'door collections', 'barn doors', 'bifold doors', 'glass doors', 'bypass doors', 'door hardware'],
}

export default function CollectionsPage() {
  const categories = Object.values(CATEGORY_DATA)

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-apple-dark-bg-elevated dark:to-apple-dark-bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="text-sm mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-apple-gray-600 dark:text-apple-dark-text-secondary">
              <li>
                <Link href="/" className="hover:text-apple-blue-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-apple-gray-900 dark:text-apple-dark-text font-medium">
                Collections
              </li>
            </ol>
          </nav>

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
          {categories.map((category, index) => (
            <CollectionCard key={category.slug} category={category} index={index} />
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
function CollectionCard({ category, index: _index }: { category: typeof CATEGORY_DATA[keyof typeof CATEGORY_DATA], index: number }) {
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
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Category Name Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {category.name}
          </h2>
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
