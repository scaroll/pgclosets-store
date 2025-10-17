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
  title: 'Room Dividers Ottawa | Mirrored & Glass Room Dividers | PG Closets',
  description: 'Transform spaces with premium Renin room dividers in Ottawa. Mirrored closet doors and glass panels that create flexible room divisions. Professional installation.',
  keywords: 'room dividers Ottawa, mirrored room dividers, glass room dividers, space dividers, Renin mirrors, sliding room dividers Ottawa',
  openGraph: {
    title: 'Premium Room Dividers in Ottawa | PG Closets',
    description: 'Create flexible spaces with Renin room dividers and mirrored solutions. Professional installation throughout Ottawa.',
    type: 'website',
    locale: 'en_CA',
  },
  alternates: {
    canonical: 'https://pgclosets.com/products/room-dividers',
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

export default async function RoomDividersPage() {
  noStore();

  // Get mirrors and other products that could work as room dividers
  const [mirrors, pivotDoors, barnDoors] = await Promise.all([
    getProducts({ collection: 'Mirrors' }),
    getProducts({ collection: 'Pivot Doors' }),
    getProducts({ collection: 'Barn Doors' })
  ]);

  // Combine products that can work as room dividers
  const roomDividerProducts = [...mirrors, ...pivotDoors, ...barnDoors];

  return (
    <StandardLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-extralight tracking-tight text-slate-900 mb-6">
              Room Dividers Ottawa
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed mb-8">
              Create flexible, functional spaces in your Ottawa home with premium Renin room dividers. From mirrored panels
              to sliding glass doors, transform open areas into defined spaces without permanent walls.
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

      {/* Room Divider Types Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extralight tracking-tight text-slate-900 mb-4">
              Flexible Space Solutions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              Create, divide, and transform spaces with style and functionality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🪞
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Mirrored Dividers</h3>
              <p className="text-slate-600 font-light mb-4">
                Reflect light and create the illusion of larger spaces while providing functional room division.
              </p>
              <div className="text-sm text-slate-500">
                {mirrors.length} mirror options available
              </div>
            </div>

            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🚪
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Sliding Doors</h3>
              <p className="text-slate-600 font-light mb-4">
                Barn doors and pivot doors that can create temporary or permanent room divisions.
              </p>
              <div className="text-sm text-slate-500">
                Multiple door styles available
              </div>
            </div>

            <div className="text-center bg-gray-50 p-8 rounded-lg">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ✨
              </div>
              <h3 className="text-xl font-light text-slate-900 mb-3">Glass Panels</h3>
              <p className="text-slate-600 font-light mb-4">
                Frosted and clear glass options that maintain sight lines while defining separate areas.
              </p>
              <div className="text-sm text-slate-500">
                Various glass treatments
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extralight tracking-tight text-slate-900 mb-4">
              Why Choose Room Dividers?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                🏠
              </div>
              <h4 className="font-light text-slate-900 mb-2">Flexible Layouts</h4>
              <p className="text-sm text-slate-600 font-light">Adapt your space for different uses throughout the day</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                💰
              </div>
              <h4 className="font-light text-slate-900 mb-2">Cost-Effective</h4>
              <p className="text-sm text-slate-600 font-light">More affordable than building permanent walls</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                🔄
              </div>
              <h4 className="font-light text-slate-900 mb-2">Reversible</h4>
              <p className="text-sm text-slate-600 font-light">Change your mind? Easily modify or remove dividers</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                ☀️
              </div>
              <h4 className="font-light text-slate-900 mb-2">Light Flow</h4>
              <p className="text-sm text-slate-600 font-light">Maintain natural light while creating defined spaces</p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extralight tracking-tight text-slate-900 mb-4">
              Perfect for Ottawa Homes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">1</div>
                <div>
                  <h4 className="font-light text-slate-900 mb-1">Home Offices</h4>
                  <p className="text-slate-600 text-sm font-light">Create a professional workspace in any room</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">2</div>
                <div>
                  <h4 className="font-light text-slate-900 mb-1">Studio Apartments</h4>
                  <p className="text-slate-600 text-sm font-light">Define sleeping, living, and dining areas</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">3</div>
                <div>
                  <h4 className="font-light text-slate-900 mb-1">Large Bedrooms</h4>
                  <p className="text-slate-600 text-sm font-light">Separate dressing areas or reading nooks</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">4</div>
                <div>
                  <h4 className="font-light text-slate-900 mb-1">Open Floor Plans</h4>
                  <p className="text-slate-600 text-sm font-light">Add definition to flowing spaces</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">5</div>
                <div>
                  <h4 className="font-light text-slate-900 mb-1">Shared Spaces</h4>
                  <p className="text-slate-600 text-sm font-light">Create privacy in shared living situations</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm">6</div>
                <div>
                  <h4 className="font-light text-slate-900 mb-1">Basements</h4>
                  <p className="text-slate-600 text-sm font-light">Maximize finished basement functionality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 mb-4">
              Room Divider Collection
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light tracking-wide">
              Versatile solutions for creating functional, beautiful spaces
            </p>
          </div>

          {roomDividerProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {roomDividerProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg font-light">
                Our room divider collection is being updated. Please contact us for current availability.
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
            Design Your Perfect Space
          </h2>
          <p className="text-xl font-light mb-8 text-slate-300">
            Professional consultation and installation throughout Ottawa and surrounding areas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-work"
              className="bg-white text-slate-900 px-8 py-4 text-lg font-light hover:bg-gray-100 transition-all duration-300 uppercase tracking-widest"
            >
              Request Free Online Quote
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