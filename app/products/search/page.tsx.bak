import { getProducts } from '@/lib/actions/commerce';
import { unstable_noStore as noStore } from 'next/cache';
import StandardLayout from '@/components/layout/StandardLayout';
import { SearchPage } from '@/components/search';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advanced Product Search | PG Closets',
  description: 'Search and filter our complete collection of premium closet doors, barn doors, and interior doors with advanced filtering and instant results.',
  keywords: 'closet door search, barn door filter, door search ottawa, closet door finder',
};

export default async function AdvancedSearchPage() {
  noStore();
  const products = await getProducts();

  return (
    <StandardLayout>
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 mb-4">
              Discover Your Perfect Door
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide">
              Search and filter our complete collection with instant results and advanced filtering
            </p>
          </div>

          {/* Advanced Search System */}
          <SearchPage products={products} itemsPerPage={12} />
        </div>
      </main>
    </StandardLayout>
  );
}
