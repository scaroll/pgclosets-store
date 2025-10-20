/**
 * AGENT 9-10: Local SEO Agent - Ottawa Neighborhood Landing Pages
 * Dynamic neighborhood pages for local SEO optimization
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Mail, MapPin, Star, CheckCircle2, ArrowRight, Clock, Award } from 'lucide-react'
import {
  getNeighborhood,
  getNearbyNeighborhoods,
  getNeighborhoodSlugs
} from '@/lib/seo/neighborhoods'
import { BUSINESS_INFO } from '@/lib/business-config'
import { generateNeighborhoodSchema } from '@/lib/seo/schema-generator'

interface Props {
  params: { neighborhood: string }
}

// Temporarily disable static generation to resolve deployment
// Generate static params for all neighborhoods
// // Temporarily disabled - export async function generateStaticParams() {
//   return getNeighborhoodSlugs().map((slug) => ({
//     neighborhood: slug,
//   }))
// }

// Generate metadata for each neighborhood page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const neighborhood = getNeighborhood(params.neighborhood)

  if (!neighborhood) {
    return {
      title: 'Neighborhood Not Found',
    }
  }

  const title = `Custom Closet Doors ${neighborhood.name} | ${BUSINESS_INFO.name}`
  const description = `${neighborhood.description} Professional Renin closet door installation in ${neighborhood.name}. Free online quote, lifetime warranty.`

  return {
    title,
    description,
    keywords: `custom closets ${neighborhood.name}, closet doors ${neighborhood.name}, ${neighborhood.popularAreas?.join(', ')}, renin doors ${neighborhood.name}, storage solutions ${neighborhood.name}`,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_CA',
      url: `${BUSINESS_INFO.urls.main}/areas/${neighborhood.slug}`,
      siteName: BUSINESS_INFO.name,
      images: [
        {
          url: `${BUSINESS_INFO.urls.main}/images/areas/${neighborhood.slug}-hero.jpg`,
          width: 1200,
          height: 630,
          alt: `Custom Closets in ${neighborhood.name}`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BUSINESS_INFO.urls.main}/images/areas/${neighborhood.slug}-hero.jpg`],
    },
    alternates: {
      canonical: `${BUSINESS_INFO.urls.main}/areas/${neighborhood.slug}`,
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
    other: {
      'geo.region': `CA-${BUSINESS_INFO.address.province}`,
      'geo.placename': neighborhood.name,
      'geo.position': `${neighborhood.coordinates.lat};${neighborhood.coordinates.lng}`,
      'ICBM': `${neighborhood.coordinates.lat}, ${neighborhood.coordinates.lng}`,
    },
  }
}

export default function NeighborhoodPage({ params }: Props) {
  const neighborhood = getNeighborhood(params.neighborhood)

  if (!neighborhood) {
    notFound()
  }

  const nearbyAreas = getNearbyNeighborhoods(params.neighborhood, 3)
  const schema = generateNeighborhoodSchema(neighborhood)

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-blue-400" />
                <span className="text-blue-300 font-medium">Serving {neighborhood.name}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Custom Closet Doors & Storage Solutions in {neighborhood.displayName}
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {neighborhood.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  Free Online Quote
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-blue-900 px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                  View Products
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Service Highlights */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why {neighborhood.name} Residents Choose Us
              </h2>
              <p className="text-xl text-gray-600">
                Trusted local experts serving {neighborhood.population} residents
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {neighborhood.serviceHighlights.map((highlight, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <CheckCircle2 className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{highlight}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Areas Served */}
        {neighborhood.popularAreas && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Neighborhoods We Serve in {neighborhood.name}
              </h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                {neighborhood.popularAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Key Features */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Specialized Services for {neighborhood.name} Homes
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {neighborhood.keyFeatures.map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                  <Award className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900">{feature}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        {neighborhood.testimonial && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-8 md:p-12 rounded-2xl shadow-xl">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl mb-6 italic">
                  "{neighborhood.testimonial.text}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">{neighborhood.testimonial.author}</p>
                    <p className="text-blue-300">{neighborhood.testimonial.project}</p>
                  </div>
                  <div className="text-sm text-blue-300">
                    Verified Customer
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact CTA */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your {neighborhood.name} Home?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Schedule your free online quote today. We serve all of {neighborhood.displayName}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="mailto:info@pgclosets.com"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                <Mail className="h-5 w-5" />
                Email Us Today
              </Link>
              <Link
                href="/request-work"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                <Clock className="h-5 w-5" />
                Get Free Quote
              </Link>
            </div>
          </div>
        </section>

        {/* Nearby Areas */}
        {nearbyAreas.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                We Also Serve Nearby Areas
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {nearbyAreas.map((nearby) => (
                  <Link
                    key={nearby.slug}
                    href={`/areas/${nearby.slug}`}
                    className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                      {nearby.displayName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {nearby.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
