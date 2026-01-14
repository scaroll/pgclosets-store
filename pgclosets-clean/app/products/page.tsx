import { Suspense } from 'react';
import ProductShowcaseClient from '@/components/products/ProductShowcaseClient';
import { Metadata } from 'next';

// Static metadata for the products page
export const metadata: Metadata = {
  title: 'Premium Closet Doors | PG Closets Ottawa',
  description: 'Browse our complete collection of custom closet doors. Barn doors, bypass doors, bifold doors, and hardware from Canada\'s trusted Renin dealer in Ottawa.',
  keywords: 'closet doors ottawa, custom doors, barn doors, bypass doors, bifold doors, renin dealer',
  openGraph: {
    title: 'Premium Closet Doors | PG Closets Ottawa',
    description: 'Browse our complete collection of custom closet doors from Ottawa\'s trusted Renin dealer.',
    type: 'website',
    locale: 'en_CA',
  },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-pg-offwhite">
        <div className="container-apple section-dense">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-h1 mb-6">
              Custom Closet Doors
              <span className="block text-pg-sky font-light">
                Crafted for Ottawa Homes
              </span>
            </h1>
            <p className="text-body-l text-pg-gray max-w-2xl mx-auto mb-8">
              Discover our complete collection of premium closet doors. From modern barn doors to elegant bypass systems,
              find the perfect solution for your space with Canada's most trusted door manufacturer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-body-s text-pg-gray">75+ Doors Available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-pg-sky rounded-full"></div>
                <span className="text-body-s text-pg-gray">Official Renin Dealer</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-pg-navy rounded-full"></div>
                <span className="text-body-s text-pg-gray">Professional Installation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Showcase */}
      <Suspense
        fallback={
          <div className="container-apple section-apple">
            <div className="space-y-8">
              {/* Loading skeleton for filters */}
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4 space-y-4">
                  <div className="h-8 bg-gray-200 shimmer rounded"></div>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200 shimmer rounded w-3/4"></div>
                    ))}
                  </div>
                </div>
                <div className="lg:w-3/4">
                  <div className="h-12 bg-gray-200 shimmer rounded mb-6"></div>
                  <div className="product-grid">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="card-apple p-4">
                        <div className="aspect-square bg-gray-200 shimmer rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 shimmer rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 shimmer rounded w-2/3 mb-4"></div>
                        <div className="h-6 bg-gray-200 shimmer rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <ProductShowcaseClient />
      </Suspense>

      {/* Trust Section */}
      <section className="bg-pg-offwhite border-t border-pg-border">
        <div className="container-apple section-dense">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-h2 mb-6">Why Choose PG Closets?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-pg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-h3 mb-3">Quality Guarantee</h3>
                <p className="text-body-m text-pg-gray">
                  Every door is backed by Renin's industry-leading warranty and our commitment to excellence.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pg-sky rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-h3 mb-3">Local Ottawa Service</h3>
                <p className="text-body-m text-pg-gray">
                  Family-owned business serving Ottawa and surrounding areas with personalized service since 2010.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-h3 mb-3">Expert Installation</h3>
                <p className="text-body-m text-pg-gray">
                  Professional installation by certified technicians ensures perfect fit and flawless operation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}