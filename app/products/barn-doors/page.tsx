import { getProducts } from '@/lib/actions/commerce';
import { Product } from '@/types/commerce';
import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import StandardLayout from '@/components/layout/StandardLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Barn Doors Ottawa | Renin Sliding Barn Doors | PG Closets',
  description: 'Transform your Ottawa home with premium Renin barn doors. Professional installation, free measurement, and custom sliding barn door solutions. Contact PG Closets today.',
  keywords: 'barn doors Ottawa, sliding barn doors, Renin barn doors, interior barn doors, custom barn doors, barn door installation Ottawa',
  openGraph: {
    title: 'Premium Barn Doors in Ottawa | PG Closets',
    description: 'Discover our collection of Renin barn doors with professional installation in Ottawa. Free measurement and consultation available.',
    type: 'website',
    locale: 'en_CA',
  },
  alternates: {
    canonical: 'https://pgclosets.com/products/barn-doors',
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

export default async function BarnDoorsPage() {
  noStore();
  const products = await getProducts({ collection: 'Barn Doors' });

  return (
    <StandardLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-extralight tracking-tight text-slate-900 mb-6">
              Barn Doors Ottawa
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed mb-8">
              Transform your Ottawa home with premium Renin sliding barn doors. Modern style meets functional design
              with our collection of interior barn doors featuring quality hardware and professional installation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-work"
                className="bg-slate-900 text-white px-8 py-4 text-lg font-light hover:bg-slate-800 transition-all duration-500 hover:shadow-xl uppercase tracking-widest"
              >
                Free Measurement in Ottawa
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

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🚪
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Space-Saving Design</h3>
              <p className="text-slate-600 font-light">
                Sliding barn doors eliminate the need for swing clearance, maximizing your Ottawa home's space efficiency.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🎨
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Modern Style</h3>
              <p className="text-slate-600 font-light">
                Contemporary designs that complement any interior style, from farmhouse to modern minimalist.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔧
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Professional Installation</h3>
              <p className="text-slate-600 font-light">
                Expert installation by certified professionals throughout Ottawa and surrounding areas.
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
              Premium Barn Door Collection
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide">
              Discover our curated selection of Renin barn doors, designed for style and built for durability
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
                Our barn door collection is being updated. Please contact us for current availability.
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
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl font-light mb-8 text-slate-300">
            Get a free consultation and measurement for your barn door project in Ottawa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-work"
              className="bg-white text-slate-900 px-8 py-4 text-lg font-light hover:bg-gray-100 transition-all duration-300 uppercase tracking-widest"
            >
              Request Free Quote
            </Link>
            <Link
              href="tel:+1613EXAMPLE"
              className="border border-white text-white px-8 py-4 text-lg font-light hover:bg-white hover:text-slate-900 transition-all duration-300 uppercase tracking-widest"
            >
              Call Now
            </Link>
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}