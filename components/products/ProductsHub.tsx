"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Calendar } from 'lucide-react';
import { DOOR_TYPES, formatPrice } from '@/lib/door-types';

export function ProductsHub() {
  // JSON-LD structured data for CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Shop Closet & Sliding Doors",
    "description": "Pick a door type to configure size, panels, and finish. Get an instant installed estimate. Barn doors, bypass doors, bifold doors, and more.",
    "url": "https://www.pgclosets.com/products",
    "publisher": {
      "@type": "Organization",
      "name": "PG Closets",
      "url": "https://www.pgclosets.com"
    },
    "hasPart": DOOR_TYPES.map(doorType => ({
      "@type": "Product",
      "name": doorType.name,
      "description": doorType.description,
      "url": `https://www.pgclosets.com/collections/${doorType.slug}`,
      "image": doorType.image,
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "CAD",
        "lowPrice": doorType.fromPrice / 100,
        "highPrice": (doorType.fromPrice / 100) * 3, // Estimate range
        "availability": "https://schema.org/InStock"
      }
    }))
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight font-bold">
              Shop Closet & Sliding Doors
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              Pick a door type to configure size, panels, and finish. Get an instant installed estimate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/instant-estimate">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Calculator className="w-5 h-5 mr-2" />
                  Get Instant Estimate
                </Button>
              </Link>
              <Link href="/book-measure">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book In-Home Measure
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tiles Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {DOOR_TYPES.map((doorType) => (
              <Link
                key={doorType.slug}
                href={`/collections/${doorType.slug}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                    <Image
                      src={doorType.image}
                      alt={doorType.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-teal-700 transition-colors">
                      {doorType.name}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {doorType.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        From {formatPrice(doorType.fromPrice, true)}
                      </span>
                      <span className="text-teal-700 font-medium group-hover:underline">
                        Shop Now →
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Helper Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Not sure what you need?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're here to help you find the perfect solution for your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/instant-estimate">
              <Button size="lg" variant="outline" className="border-2">
                Take the Rooms Quiz
              </Button>
            </Link>
            <Link href="/book-measure">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Book a Free Measure
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6">Premium Closet Doors & Sliding Door Systems</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              As Ottawa's official Renin dealer, PG Closets offers the complete collection of premium closet doors
              and sliding door systems. Our instant configurator lets you customize size, panels, finish, and
              hardware—then see your installed price immediately.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-xl font-bold mb-3">Door Types We Install</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Barn doors for single openings</li>
                  <li>• Bypass doors for closet systems</li>
                  <li>• Bifold doors for compact spaces</li>
                  <li>• Pivot doors for walk-in closets</li>
                  <li>• Room dividers for open concepts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Why Choose PG Closets</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Official Renin dealer in Ottawa</li>
                  <li>• Instant online estimates</li>
                  <li>• 2-3 week installation timeline</li>
                  <li>• Lifetime warranty included</li>
                  <li>• Free measure within 30km</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
