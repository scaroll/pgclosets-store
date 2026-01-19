import Link from 'next/link'
import { PackageX } from 'lucide-react'

export default function CategoryNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-apple-dark-bg-tertiary flex items-center justify-center mx-auto mb-6">
          <PackageX className="w-10 h-10 text-gray-400 dark:text-apple-dark-text-tertiary" />
        </div>

        <h1 className="text-4xl font-bold text-apple-gray-900 dark:text-apple-dark-text mb-4">
          Category Not Found
        </h1>

        <p className="text-lg text-apple-gray-600 dark:text-apple-dark-text-secondary mb-8">
          Sorry, we couldn't find the category you're looking for. It may have been moved or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/collections"
            className="px-6 py-3 bg-apple-blue-500 text-white rounded-apple font-semibold hover:bg-apple-blue-600 transition-colors"
          >
            Browse All Collections
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 border border-gray-300 dark:border-apple-dark-border rounded-apple font-semibold hover:bg-gray-50 dark:hover:bg-apple-dark-bg-tertiary transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </main>
  )
}
