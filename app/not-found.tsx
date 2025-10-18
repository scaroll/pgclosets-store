import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - PG Closets & Custom Cabinets',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="container-max text-center">
        <div className="max-w-2xl mx-auto">
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="text-[150px] font-bold leading-none text-gray-200">
              404
            </h1>
          </div>

          {/* Error Message */}
          <h2 className="heading-2 text-gray-900 mb-4">Page Not Found</h2>
          <p className="body-large text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved,
            deleted, or you may have typed the URL incorrectly.
          </p>

          {/* Helpful Links */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
            <Link
              href="/products"
              className="card-flat hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold mb-2">Browse Products</h3>
              <p className="text-sm text-gray-600">
                Explore our range of custom closets and cabinets
              </p>
            </Link>
            <Link
              href="/quote"
              className="card-flat hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold mb-2">Get a Quote</h3>
              <p className="text-sm text-gray-600">
                Start your custom project with a free consultation
              </p>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary"
            >
              Go to Home
            </Link>
            <Link
              href="/contact"
              className="btn-secondary"
            >
              Contact Us
            </Link>
          </div>

          {/* Search Suggestion */}
          <div className="mt-12 pt-12 border-t border-gray-200">
            <p className="text-gray-600 mb-4">Looking for something specific?</p>
            <form action="/search" method="GET" className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="q"
                  placeholder="Search products..."
                  className="input flex-1"
                />
                <button type="submit" className="btn-primary">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}