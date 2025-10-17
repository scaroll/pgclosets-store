import { getProducts } from '@/lib/actions/commerce';
import type { Product } from '@/types/commerce';
import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import Image from 'next/image';
import StandardLayout from '@/components/layout/StandardLayout';
import type { Metadata } from 'next';

// Format price helper
function formatPrice(price: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

export const metadata: Metadata = {
  title: 'Interior Doors Ottawa | Closet Doors & Room Dividers | PG Closets',
  description: 'Premium Renin interior doors in Ottawa. Bypass, bifold, and pivot closet doors with professional installation. Free measurement and consultation available.',
  keywords: 'interior doors Ottawa, closet doors, bypass doors, bifold doors, pivot doors, Renin doors, custom closet doors Ottawa',
  openGraph: {
    title: 'Premium Interior Doors in Ottawa | PG Closets',
    description: 'Discover our collection of Renin interior and closet doors with expert installation in Ottawa. Bypass, bifold, and pivot door options available.',
    type: 'website',
    locale: 'en_CA',
  },
  alternates: {
    canonical: 'https://pgclosets.com/products/interior-doors',
  },
};

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-white shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
    <Link href={`/products/${product.handle}`} className="block">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.thumbnail || '/placeholder.svg'}
          alt={product.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-2 left-2 bg-slate-900 text-white px-3 py-1 text-xs font-light tracking-widest uppercase">
          Renin
        </div>
        {product.collection && (
          <div className="absolute top-2 right-2 bg-white/90 text-slate-700 px-2 py-1 text-xs font-light">
            {product.collection.title}
          </div>
        )}
      </div>
    </Link>
    <div className="p-6">
      <h3 className="text-xl font-light text-slate-900 mb-2 tracking-wide">{product.title}</h3>
      <p className="text-slate-600 text-sm mb-4 line-clamp-2 font-light">{product.description}</p>
      <div className="text-3xl font-extralight text-slate-900 mb-6 tracking-tight">
        {formatPrice(product.variants[0]?.price || 0)}
      </div>
      <div className="flex gap-2">
        <Link
          href={`/products/${product.handle}`}
          className="flex-1 bg-slate-900 text-white py-3 font-light hover:bg-slate-800 transition-all duration-500 hover:shadow-xl text-sm uppercase tracking-widest text-center"
        >
          View Details
        </Link>
        <Link
          href="/request-work"
          className="px-4 py-3 border border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 text-sm uppercase tracking-widest font-light"
        >
          Get Quote
        </Link>
      </div>
    </div>
  </div>
);

export default async function InteriorDoorsPage() {
  noStore();

  // Get products from multiple interior door categories
  const [bypassDoors, bifoldDoors, pivotDoors] = await Promise.all([
    getProducts({ collection: 'Bypass Doors' }),
    getProducts({ collection: 'Bifold Doors' }),
    getProducts({ collection: 'Pivot Doors' })
  ]);

  const allInteriorDoors = [...bypassDoors, ...bifoldDoors, ...pivotDoors];

  return (
    <StandardLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-extralight tracking-tight text-slate-900 mb-6">
              Interior Doors Ottawa
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed mb-8">
              Elevate your Ottawa home with premium Renin interior doors. Choose from bypass, bifold, and pivot designs
              that maximize space while delivering lasting style and functionality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-work"
                className="bg-slate-900 text-white px-8 py-4 text-lg font-light hover:bg-slate-800 transition-all duration-500 hover:shadow-xl uppercase tracking-widest"
              >
                Get Free Quote
              </Link>
              <Link
                href="/book-measure"
                className="border border-slate-300 text-slate-700 px-8 py-4 text-lg font-light hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 uppercase tracking-widest"
              >
                Book Measurement
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium uppercase tracking-wider rounded-full">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Licensed & Insured
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium uppercase tracking-wider rounded-full">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                2-Week Install
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium uppercase tracking-wider rounded-full">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                Lifetime Warranty
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Door Types Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extralight tracking-tight text-slate-900 mb-4">
              Interior Door Solutions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              Discover the perfect door style for your Ottawa home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ↔️
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Bypass Doors</h3>
              <p className="text-slate-600 font-light mb-4">
                Space-efficient sliding doors that bypass each other, perfect for standard closet openings.
              </p>
              <div className="text-sm text-slate-500">
                {bypassDoors.length} styles available
              </div>
            </div>

            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔄
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Bifold Doors</h3>
              <p className="text-slate-600 font-light mb-4">
                Folding doors that provide up to 95% access to your space with minimal floor clearance.
              </p>
              <div className="text-sm text-slate-500">
                {bifoldDoors.length} styles available
              </div>
            </div>

            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🚪
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Pivot Doors</h3>
              <p className="text-slate-600 font-light mb-4">
                Hinged doors that swing open for maximum access, ideal for wide openings and modern aesthetics.
              </p>
              <div className="text-sm text-slate-500">
                {pivotDoors.length} styles available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                ✨
              </div>
              <h4 className="font-light text-slate-900 mb-2">Premium Materials</h4>
              <p className="text-sm text-slate-600 font-light">Engineered wood frames with scratch-resistant finishes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                🔧
              </div>
              <h4 className="font-light text-slate-900 mb-2">Easy Installation</h4>
              <p className="text-sm text-slate-600 font-light">Pre-assembled systems with professional installation</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                🎨
              </div>
              <h4 className="font-light text-slate-900 mb-2">Design Variety</h4>
              <p className="text-sm text-slate-600 font-light">Multiple finishes and glass options to match your style</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                🛡️
              </div>
              <h4 className="font-light text-slate-900 mb-2">5-Year Warranty</h4>
              <p className="text-sm text-slate-600 font-light">Manufacturer warranty on all Renin door products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 mb-4">
              Complete Interior Door Collection
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide">
              Browse our full selection of premium Renin interior doors for Ottawa homes
            </p>
          </div>

          {allInteriorDoors.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allInteriorDoors.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg font-light">
                Our interior door collection is being updated. Please contact us for current availability.
              </p>
              <Link
                href="/contact"
                className="inline-block mt-4 bg-slate-900 text-white px-6 py-3 font-light hover:bg-slate-800 transition-all duration-300 uppercase tracking-widest"
              >
                Contact for Availability
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-extralight tracking-tight mb-6">
            Transform Your Interior Spaces
          </h2>
          <p className="text-xl font-light mb-8 text-slate-300">
            Professional consultation and installation throughout Ottawa and surrounding areas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-work"
              className="bg-white text-slate-900 px-8 py-4 text-lg font-light hover:bg-gray-100 transition-all duration-300 uppercase tracking-widest"
            >
              Request Free Quote
            </Link>
            <Link
              href="mailto:info@pgclosets.com"
              className="border border-white text-white px-8 py-4 text-lg font-light hover:bg-white hover:text-slate-900 transition-all duration-300 uppercase tracking-widest"
            >
              Email Us
            </Link>
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}