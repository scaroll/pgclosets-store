import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import StandardLayout from '@/components/layout/StandardLayout';
import { LocationStats } from '@/components/locations/LocationStats';
import { ServiceMap } from '@/components/locations/ServiceMap';
import { LocalGallery } from '@/components/locations/LocalGallery';
import { getLocation, getAllLocationSlugs, getNearbyLocations } from '@/lib/locations';
import { colors, typography, radius } from '@/lib/design-tokens';
import { Button } from '@/components/ui/button';

interface LocationPageProps {
  params: {
    location: string;
  };
}

// Temporarily disable static generation to resolve deployment
// Generate static params for all locations
// export async function generateStaticParams() {
//   const slugs = getAllLocationSlugs();
//   return slugs.map((slug) => ({
//     location: slug,
//   }));
// }

// Generate metadata for each location
export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { location: locationSlug } = await params;
  const location = getLocation(locationSlug);

  if (!location) {
    return {
      title: 'Location Not Found | PG Closets',
    };
  }

  return {
    title: location.seo.title,
    description: location.seo.description,
    keywords: location.seo.keywords.join(', '),
    openGraph: {
      title: location.seo.title,
      description: location.seo.description,
      type: 'website',
      locale: 'en_CA',
      url: `https://pgclosets.com/${location.slug}`,
      siteName: 'PG Closets',
    },
    alternates: {
      canonical: `/${location.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { location: locationSlug } = await params;
  const location = getLocation(locationSlug);

  if (!location) {
    notFound();
  }

  const nearbyLocations = getNearbyLocations(locationSlug);

  // Local Business Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `PG Closets ${location.name}`,
    description: `Premium closet door installation serving ${location.name}, ${location.region}`,
    url: `https://pgclosets.com/${location.slug}`,
    email: 'spencer@peoplesgrp.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.name,
      addressRegion: 'ON',
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.coordinates.lat.toString(),
      longitude: location.coordinates.lng.toString(),
    },
    areaServed: [
      {
        '@type': 'City',
        name: location.name,
      },
      {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: location.coordinates.lat.toString(),
          longitude: location.coordinates.lng.toString(),
        },
        geoRadius: '25000',
      },
    ],
    serviceType: [
      'Closet Door Installation',
      'Barn Door Installation',
      'Bypass Door Installation',
      'Bifold Door Installation',
      'Custom Closet Solutions',
      'Room Divider Installation',
    ],
    priceRange: '$259-$1115',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'Check'],
    currenciesAccepted: 'CAD',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: location.stats.rating.toString(),
      reviewCount: location.stats.homesServed.toString(),
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://pgclosets.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: location.name,
        item: `https://pgclosets.com/${location.slug}`,
      },
    ],
  };

  return (
    <StandardLayout>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span
              className="font-medium"
              style={{ color: colors.brand.navy }}
            >
              {location.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.brand.navy} 0%, ${colors.brand.charcoal} 100%)`
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-white">
            {/* Location Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">{location.region}</span>
            </div>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6"
              style={{ fontFamily: typography.fonts.display }}
            >
              Premium Closet Doors in {location.name}
            </h1>

            <p
              className="text-xl md:text-2xl font-light text-white/90 mb-4 max-w-3xl mx-auto"
              style={{ fontFamily: typography.fonts.body }}
            >
              {location.description}
            </p>

            <div className="flex items-center justify-center gap-4 mb-12 text-white/80">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <span className="text-sm">{location.population} residents</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/40" />
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm">{location.stats.rating} Rating</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/request-work">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl rounded-lg"
                >
                  Get Free Quote
                </Button>
              </Link>
              <Link href="/book-measure">
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-lg"
                >
                  Book Measurement
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white rounded-full blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <LocationStats
        homesServed={location.stats.homesServed}
        yearsServing={location.stats.yearsServing}
        rating={location.stats.rating}
        responseTime={location.stats.responseTime}
      />

      {/* Service Map */}
      <ServiceMap
        currentLocation={location.name}
        serviceAreas={location.serviceAreas}
        coordinates={location.coordinates}
      />

      {/* Ottawa Showroom Section - Only for Ottawa location */}
      {location.slug === 'ottawa' && (
        <section className="py-16 bg-white border-t">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-light tracking-tight mb-4"
                style={{
                  fontFamily: typography.fonts.display,
                  color: colors.brand.charcoal
                }}
              >
                Visit Our Ottawa Showroom
              </h2>
              <p className="text-lg text-gray-600">
                Experience our products in person at our Ottawa location
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/images/ottawa-showroom-exterior.png"
                  alt="PG Closets Ottawa showroom exterior"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/images/ottawa-showroom-interior.png"
                  alt="PG Closets Ottawa showroom interior"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-light tracking-tight mb-4"
              style={{
                fontFamily: typography.fonts.display,
                color: colors.brand.charcoal
              }}
            >
              What {location.name} Homeowners Say
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by hundreds of satisfied customers in your community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {location.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6"
                style={{ borderRadius: radius.xl }}
              >
                {/* Star Rating */}
                <div className="flex items-center mb-4 text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>

                {/* Author */}
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: colors.brand.charcoal }}
                  >
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Gallery */}
      <LocalGallery projects={location.projects} locationName={location.name} />

      {/* Nearby Locations */}
      {nearbyLocations.length > 0 && (
        <section className="py-16 bg-white border-t">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-light tracking-tight mb-4"
                style={{
                  fontFamily: typography.fonts.display,
                  color: colors.brand.charcoal
                }}
              >
                We Also Serve Nearby
              </h2>
              <p className="text-lg text-gray-600">
                Explore our services in neighboring communities
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nearbyLocations.map((nearby) => (
                <Link
                  key={nearby.slug}
                  href={`/${nearby.slug}`}
                  className="group p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg"
                  style={{ borderRadius: radius.xl }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.brand.navy + '20' }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke={colors.brand.navy}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3
                        className="font-semibold group-hover:text-blue-600 transition-colors"
                        style={{ color: colors.brand.charcoal }}
                      >
                        {nearby.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {nearby.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section
        className="py-16 text-white"
        style={{ backgroundColor: colors.brand.navy }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2
            className="text-3xl md:text-4xl font-light mb-4"
            style={{ fontFamily: typography.fonts.display }}
          >
            Ready to Transform Your {location.name} Home?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join {location.stats.homesServed}+ satisfied homeowners who chose PG Closets
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/request-work">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                Get Free Quote →
              </Button>
            </Link>
            <a href="mailto:spencer@peoplesgrp.com">
              <Button
                variant="secondary"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-lg"
              >
                Email Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}
