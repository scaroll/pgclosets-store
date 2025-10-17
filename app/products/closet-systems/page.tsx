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
  title: 'Closet Systems Ottawa | Complete Renin Closet Solutions | PG Closets',
  description: 'Transform your Ottawa closets with complete Renin closet systems. Custom organization, premium doors, and professional installation. Free online quote available.',
  keywords: 'closet systems Ottawa, custom closets, closet organization, Renin closets, walk-in closets, reach-in closets, closet design Ottawa',
  openGraph: {
    title: 'Complete Closet Systems in Ottawa | PG Closets',
    description: 'Custom Renin closet systems with professional design and installation throughout Ottawa. Maximize storage and style.',
    type: 'website',
    locale: 'en_CA',
  },
  alternates: {
    canonical: 'https://pgclosets.com/products/closet-systems',
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
          Quote
        </Link>
      </div>
    </div>
  </div>
);

export default async function ClosetSystemsPage() {
  noStore();

  // Get all door types for complete closet systems
  const [bypassDoors, bifoldDoors, pivotDoors, barnDoors, mirrors, hardware] = await Promise.all([
    getProducts({ collection: 'Bypass Doors' }),
    getProducts({ collection: 'Bifold Doors' }),
    getProducts({ collection: 'Pivot Doors' }),
    getProducts({ collection: 'Barn Doors' }),
    getProducts({ collection: 'Mirrors' }),
    getProducts({ collection: 'Hardware' })
  ]);

  const allClosetProducts = [...bypassDoors, ...bifoldDoors, ...pivotDoors, ...barnDoors, ...mirrors, ...hardware];

  return (
    <StandardLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-extralight tracking-tight text-slate-900 mb-6">
              Closet Systems Ottawa
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed mb-8">
              Transform your Ottawa home with complete Renin closet systems. From custom organization solutions to premium
              doors and hardware, we create closets that maximize storage while delivering lasting style and functionality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-work"
                className="bg-slate-900 text-white px-8 py-4 text-lg font-light hover:bg-slate-800 transition-all duration-500 hover:shadow-xl uppercase tracking-widest"
              >
                Free Design Consultation
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

      {/* System Types Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extralight tracking-tight text-slate-900 mb-4">
              Complete Closet Solutions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              Every component designed to work together seamlessly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🚪
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Reach-In Closets</h3>
              <p className="text-slate-600 font-light mb-4">
                Maximize smaller spaces with efficient organization systems and bypass or bifold doors.
              </p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• Double-hang capabilities</li>
                <li>• Adjustable shelving</li>
                <li>• Space-saving doors</li>
              </ul>
            </div>

            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🏠
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Walk-In Closets</h3>
              <p className="text-slate-600 font-light mb-4">
                Luxury organization with custom layouts, premium doors, and sophisticated storage solutions.
              </p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• Custom island options</li>
                <li>• LED lighting integration</li>
                <li>• Premium door systems</li>
              </ul>
            </div>

            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                👔
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Wardrobe Systems</h3>
              <p className="text-slate-600 font-light mb-4">
                Standalone solutions perfect for bedrooms without built-in storage or rental properties.
              </p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• Modular components</li>
                <li>• Easy reconfiguration</li>
                <li>• Multiple door options</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Components Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extralight tracking-tight text-slate-900 mb-4">
              System Components
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              Every element designed for maximum functionality and style
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                🚪
              </div>
              <h4 className="font-light text-slate-900 mb-2">Door Systems</h4>
              <p className="text-sm text-slate-600 font-light">Bypass, bifold, pivot, and barn door options</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                📐
              </div>
              <h4 className="font-light text-slate-900 mb-2">Organization</h4>
              <p className="text-sm text-slate-600 font-light">Shelving, hanging rods, and specialty storage</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                🔧
              </div>
              <h4 className="font-light text-slate-900 mb-2">Hardware</h4>
              <p className="text-sm text-slate-600 font-light">Premium tracks, handles, and accessories</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                💡
              </div>
              <h4 className="font-light text-slate-900 mb-2">Lighting</h4>
              <p className="text-sm text-slate-600 font-light">LED integration for optimal visibility</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extralight tracking-tight text-slate-900 mb-4">
              Our Design Process
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              From consultation to completion, we handle every detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-light">
                1
              </div>
              <h3 className="text-lg font-light text-slate-900 mb-3">Consultation</h3>
              <p className="text-slate-600 font-light text-sm">
                In-home assessment of your space, storage needs, and style preferences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-light">
                2
              </div>
              <h3 className="text-lg font-light text-slate-900 mb-3">Design</h3>
              <p className="text-slate-600 font-light text-sm">
                Custom design proposal with 3D renderings and detailed specifications.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-light">
                3
              </div>
              <h3 className="text-lg font-light text-slate-900 mb-3">Manufacturing</h3>
              <p className="text-slate-600 font-light text-sm">
                Precision manufacturing of your custom components using premium materials.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-light">
                4
              </div>
              <h3 className="text-lg font-light text-slate-900 mb-3">Installation</h3>
              <p className="text-slate-600 font-light text-sm">
                Professional installation by certified technicians with quality assurance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 mb-4">
              Closet System Components
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide">
              Browse our complete collection of doors, hardware, and accessories
            </p>
          </div>

          {/* Component Categories */}
          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            <span className="bg-slate-900 text-white px-4 py-2 text-sm font-light uppercase tracking-widest">
              {bypassDoors.length} Bypass Doors
            </span>
            <span className="bg-slate-700 text-white px-4 py-2 text-sm font-light uppercase tracking-widest">
              {bifoldDoors.length} Bifold Doors
            </span>
            <span className="bg-slate-600 text-white px-4 py-2 text-sm font-light uppercase tracking-widest">
              {pivotDoors.length} Pivot Doors
            </span>
            <span className="bg-slate-500 text-white px-4 py-2 text-sm font-light uppercase tracking-widest">
              {barnDoors.length} Barn Doors
            </span>
            <span className="bg-slate-400 text-white px-4 py-2 text-sm font-light uppercase tracking-widest">
              {mirrors.length} Mirror Options
            </span>
            <span className="bg-slate-300 text-slate-900 px-4 py-2 text-sm font-light uppercase tracking-widest">
              {hardware.length} Hardware Items
            </span>
          </div>

          {allClosetProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allClosetProducts.slice(0, 12).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg font-light">
                Our closet systems collection is being updated. Please contact us for current availability.
              </p>
              <Link
                href="/contact"
                className="inline-block mt-4 bg-slate-900 text-white px-6 py-3 font-light hover:bg-slate-800 transition-all duration-300 uppercase tracking-widest"
              >
                Contact for Availability
              </Link>
            </div>
          )}

          {allClosetProducts.length > 12 && (
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-block bg-slate-900 text-white px-8 py-3 font-light hover:bg-slate-800 transition-all duration-300 uppercase tracking-widest"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-extralight tracking-tight text-slate-900 mb-6">
                Why Choose Renin Closet Systems?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-light">✓</div>
                  <div>
                    <h4 className="font-light text-slate-900 mb-1">Premium Materials</h4>
                    <p className="text-slate-600 text-sm font-light">Engineered wood construction with scratch-resistant finishes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-light">✓</div>
                  <div>
                    <h4 className="font-light text-slate-900 mb-1">Custom Fit</h4>
                    <p className="text-slate-600 text-sm font-light">Precisely measured and manufactured for your specific space</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-light">✓</div>
                  <div>
                    <h4 className="font-light text-slate-900 mb-1">5-Year Warranty</h4>
                    <p className="text-slate-600 text-sm font-light">Manufacturer warranty on all system components</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-light">✓</div>
                  <div>
                    <h4 className="font-light text-slate-900 mb-1">Professional Installation</h4>
                    <p className="text-slate-600 text-sm font-light">Certified installers throughout Ottawa and surrounding areas</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-light text-slate-900 mb-6 text-center">
                Ready to Transform Your Closets?
              </h3>
              <div className="space-y-4">
                <Link
                  href="/request-work"
                  className="block w-full bg-slate-900 text-white py-4 text-center font-light hover:bg-slate-800 transition-all duration-300 uppercase tracking-widest"
                >
                  Schedule Free Online Quote
                </Link>
                <Link
                  href="mailto:info@pgclosets.com"
                  className="block w-full border border-slate-300 text-slate-700 py-4 text-center font-light hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 uppercase tracking-widest"
                >
                  Email Us
                </Link>
                <p className="text-center text-sm text-slate-600 font-light">
                  Serving Ottawa, Kanata, Nepean, Orleans, and surrounding areas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-extralight tracking-tight mb-6">
            Create Your Dream Closet
          </h2>
          <p className="text-xl font-light mb-8 text-slate-300">
            Professional design consultation and installation throughout Ottawa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-work"
              className="bg-white text-slate-900 px-8 py-4 text-lg font-light hover:bg-gray-100 transition-all duration-300 uppercase tracking-widest"
            >
              Request Free Design
            </Link>
            <Link
              href="/contact"
              className="border border-white text-white px-8 py-4 text-lg font-light hover:bg-white hover:text-slate-900 transition-all duration-300 uppercase tracking-widest"
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}