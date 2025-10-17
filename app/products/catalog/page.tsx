'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

// Dynamically import ProductCatalog with loading state
const ProductCatalog = dynamic(
  () => import('@/components/products/ProductCatalog'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4" />
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
            {/* Grid Skeleton */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
);

export default function ProductCatalogPage() {
  // Set document metadata on client side
  useEffect(() => {
    document.title = 'Product Catalog | Premium Closet Doors & Hardware | PG Closets';

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore our complete collection of premium closet doors, barn doors, sliding doors, and hardware. Find the perfect solution for your space with instant pricing and AI-powered search.');
    }
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Product Catalog',
            description: 'Complete collection of premium closet doors and hardware',
            url: 'https://www.pgclosets.com/products/catalog',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: 20,
              itemListElement: [
                {
                  '@type': 'Product',
                  position: 1,
                  name: 'Barn Doors',
                  category: 'Closet Doors',
                  offers: {
                    '@type': 'AggregateOffer',
                    priceCurrency: 'CAD',
                    lowPrice: 599,
                    highPrice: 1899
                  }
                },
                {
                  '@type': 'Product',
                  position: 2,
                  name: 'Bifold Doors',
                  category: 'Closet Doors',
                  offers: {
                    '@type': 'AggregateOffer',
                    priceCurrency: 'CAD',
                    lowPrice: 299,
                    highPrice: 899
                  }
                }
              ]
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://www.pgclosets.com'
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Products',
                  item: 'https://www.pgclosets.com/products'
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Catalog',
                  item: 'https://www.pgclosets.com/products/catalog'
                }
              ]
            }
          }),
        }}
      />
      <ProductCatalog />
    </>
  );
}
