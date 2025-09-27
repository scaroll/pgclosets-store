import { getProducts } from '@/lib/actions/commerce';
import { Product } from '@/types/commerce';
import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import StandardLayout from '@/components/layout/StandardLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Door Hardware Ottawa | Renin Closet & Barn Door Hardware | PG Closets',
  description: 'Premium Renin door hardware in Ottawa. Handles, locks, tracks, and accessories for closet doors and barn doors. Professional installation available.',
  keywords: 'door hardware Ottawa, barn door hardware, closet door hardware, Renin hardware, door handles, door locks, sliding tracks Ottawa',
  openGraph: {
    title: 'Premium Door Hardware in Ottawa | PG Closets',
    description: 'Complete selection of Renin door hardware with professional installation in Ottawa. Quality handles, locks, and track systems.',
    type: 'website',
    locale: 'en_CA',
  },
  alternates: {
    canonical: 'https://pgclosets.com/products/hardware',
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
          Quote
        </Link>
      </div>
    </div>
  </div>
);

export default async function HardwarePage() {
  noStore();
  const products = await getProducts({ collection: 'Hardware' });

  return (
    <StandardLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-extralight tracking-tight text-slate-900 mb-6">
              Door Hardware Ottawa
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed mb-8">
              Complete your Ottawa door installation with premium Renin hardware. From handles and locks to sliding tracks
              and accessories, we provide the quality components that ensure smooth operation and lasting durability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-work"
                className="bg-slate-900 text-white px-8 py-4 text-lg font-light hover:bg-slate-800 transition-all duration-500 hover:shadow-xl uppercase tracking-widest"
              >
                Free Consultation in Ottawa
              </Link>
              <Link
                href="/contact"
                className="border border-slate-300 text-slate-700 px-8 py-4 text-lg font-light hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 uppercase tracking-widest"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Categories Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extralight tracking-tight text-slate-900 mb-4">
              Complete Hardware Solutions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              Everything you need for professional door installation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🚪
              </div>
              <h3 className="text-lg font-light text-slate-900 mb-3">Handles & Pulls</h3>
              <p className="text-slate-600 font-light text-sm">
                Ergonomic designs in multiple finishes to complement any door style.
              </p>
            </div>

            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔒
              </div>
              <h3 className="text-lg font-light text-slate-900 mb-3">Locks & Latches</h3>
              <p className="text-slate-600 font-light text-sm">
                Privacy and security solutions for barn doors and interior doors.
              </p>
            </div>

            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🛤️
              </div>
              <h3 className="text-lg font-light text-slate-900 mb-3">Track Systems</h3>
              <p className="text-slate-600 font-light text-sm">
                Smooth-operating tracks for bypass and barn door installations.
              </p>
            </div>

            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ⚙️
              </div>
              <h3 className="text-lg font-light text-slate-900 mb-3">Accessories</h3>
              <p className="text-slate-600 font-light text-sm">
                Guides, stops, and mounting hardware for complete installations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                💎
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Premium Finishes</h3>
              <p className="text-slate-600 font-light">
                Matte Black, Satin Nickel, and other designer finishes that resist tarnishing and wear.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔧
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Easy Installation</h3>
              <p className="text-slate-600 font-light">
                Pre-drilled mounting holes and included hardware for straightforward professional installation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Smooth Operation</h3>
              <p className="text-slate-600 font-light">
                Engineered for years of reliable operation with minimal maintenance required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 mb-4">
              Premium Hardware Collection
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide">
              Professional-grade hardware components for lasting performance
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg font-light">
                Our hardware collection is being updated. Please contact us for current availability.
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

      {/* Installation Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-extralight tracking-tight mb-6">
                Professional Hardware Installation
              </h2>
              <p className="text-xl font-light mb-6 text-slate-300 leading-relaxed">
                Our certified installers ensure your Renin hardware is properly mounted and adjusted for optimal
                performance throughout Ottawa and surrounding areas.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Precision mounting and alignment
                </li>
                <li className="flex items-center text-slate-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Quality assurance testing
                </li>
                <li className="flex items-center text-slate-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Hardware warranty support
                </li>
                <li className="flex items-center text-slate-300">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Post-installation adjustments
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-white/10 p-8 rounded-lg">
                <h3 className="text-2xl font-light mb-4">Ready to Upgrade?</h3>
                <p className="text-slate-300 mb-6 font-light">
                  Get professional hardware consultation and installation
                </p>
                <div className="space-y-3">
                  <Link
                    href="/request-work"
                    className="block w-full bg-white text-slate-900 py-3 font-light hover:bg-gray-100 transition-all duration-300 uppercase tracking-widest"
                  >
                    Request Free Quote
                  </Link>
                  <Link
                    href="tel:+1613EXAMPLE"
                    className="block w-full border border-white text-white py-3 font-light hover:bg-white hover:text-slate-900 transition-all duration-300 uppercase tracking-widest"
                  >
                    Call Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}