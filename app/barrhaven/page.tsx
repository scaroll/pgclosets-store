import StandardLayout from "../../../components/layout/StandardLayout"
import { Button } from "../../../components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Closet Doors Barrhaven | Premium Installation | PG Closets",
  description:
    "Premium closet door installation in Barrhaven. Official Renin dealer serving Stonebridge, Half Moon Bay, Davidson Heights, and surrounding areas. Free online quote and transparent pricing.",
  keywords:
    "closet doors Barrhaven, barn doors Barrhaven, bypass doors Barrhaven, bifold doors Barrhaven, professional installation Barrhaven, Renin dealer Barrhaven, custom closet Barrhaven",
  openGraph: {
    title: "Closet Doors Barrhaven | Premium Installation | PG Closets",
    description:
      "Premium closet door installation in Barrhaven. Official Renin dealer with lifetime warranty and transparent Canadian pricing.",
    type: "website",
    locale: "en_CA",
  },
}

export default function BarrhavenPage() {
  return (
    <StandardLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "PG Closets Barrhaven",
            description: "Premium closet door installation serving Barrhaven, Ontario",
            url: "https://pgclosets.com/barrhaven",
            email: "spencer@peoplesgrp.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Barrhaven",
              addressRegion: "ON",
              addressCountry: "CA",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "45.2869",
              longitude: "-75.7081",
            },
            areaServed: {
              "@type": "City",
              name: "Barrhaven",
              sameAs: "https://en.wikipedia.org/wiki/Barrhaven",
            },
            serviceType: [
              "Closet Door Installation",
              "Barn Door Installation",
              "Bypass Door Installation",
              "Bifold Door Installation",
              "Custom Closet Solutions",
            ],
            priceRange: "$259-$1115",
            paymentAccepted: ["Cash", "Credit Card", "Debit Card", "Check"],
            currenciesAccepted: "CAD",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "76",
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extralight tracking-tight mb-8">Premium Closet Doors in Barrhaven</h1>
            <p className="text-xl md:text-2xl font-light tracking-wide text-purple-100 mb-12 max-w-3xl mx-auto">
              Serving Stonebridge, Half Moon Bay, Davidson Heights, and all Barrhaven communities with professional
              Renin closet door installation
            </p>
            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-lg text-purple-50 mb-4 leading-relaxed">
                Barrhaven&apos;s fastest-growing community deserves top-tier home solutions that match your lifestyle. From
                waterfront properties in Half Moon Bay to executive homes in Stonebridge, PG Closets delivers premium
                Renin closet systems with expert installation and complete warranty protection.
              </p>
              <p className="text-base text-purple-100">
                <a href="/gallery" className="underline hover:text-white">
                  View Barrhaven transformations →
                </a>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl font-light tracking-widest uppercase"
              >
                <Link href="/request-work">Get Free Quote</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600"
              >
                <Link href="/book-measure">Book Measurement</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas in Barrhaven */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Barrhaven Communities We Serve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional closet door installation throughout Barrhaven&apos;s thriving neighborhoods
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Stonebridge", description: "Upscale community with executive homes" },
              { name: "Half Moon Bay", description: "Waterfront community with luxury homes" },
              { name: "Davidson Heights", description: "Family-friendly area with parks" },
              { name: "Longfields", description: "Established neighborhood with amenities" },
              { name: "Strandherd", description: "Growing area with new construction" },
              { name: "Jockvale", description: "Mixed residential community" },
              { name: "Cedarhill", description: "Quiet residential area" },
              { name: "Woodroffe", description: "Central location with shopping" },
              { name: "Barrhaven Centre", description: "Commercial and residential hub" },
            ].map((area) => (
              <div key={area.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.name}</h3>
                <p className="text-gray-600 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Barrhaven Homeowners Say</h2>
            <p className="text-lg text-gray-600">Trusted by Barrhaven&apos;s growing community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Our Stonebridge home looks incredible! The barn doors add such character to our master bedroom. PG
                Closets was professional and efficient throughout the process."
              </p>
              <p className="text-gray-900 font-semibold">Christine B.</p>
              <p className="text-gray-500 text-sm">Stonebridge</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Excellent service from start to finish! They helped us choose the perfect closet doors for our Half
                Moon Bay home. Quality products and expert installation."
              </p>
              <p className="text-gray-900 font-semibold">Mark & Kelly D.</p>
              <p className="text-gray-500 text-sm">Half Moon Bay</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Very happy with our new bypass doors in Longfields. The team was punctual, professional, and cleaned
                up perfectly after installation. Highly recommend!"
              </p>
              <p className="text-gray-900 font-semibold">Patricia S.</p>
              <p className="text-gray-500 text-sm">Longfields</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us for Barrhaven */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Barrhaven Families Choose PG Closets</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Home Specialists</h3>
              <p className="text-gray-600">
                Expert installation for Barrhaven&apos;s contemporary homes and luxury properties
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Trusted</h3>
              <p className="text-gray-600">
                Serving Barrhaven families with reliable, professional closet door solutions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">High-end finishes and materials perfect for Barrhaven&apos;s upscale homes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Barrhaven-specific Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Closet Solutions for Barrhaven Homes</h2>
          </div>

          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-lg leading-relaxed mb-6">
              Barrhaven&apos;s rapid growth brings modern homes that demand contemporary storage solutions. From executive
              waterfront properties in Half Moon Bay to family homes in Davidson Heights, we provide premium closet
              door installations tailored to Barrhaven&apos;s distinctive communities.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Luxury Home Solutions</h3>
                <p>
                  Premium closet door systems for Barrhaven&apos;s upscale properties, featuring custom finishes and
                  high-end hardware that complement modern architectural design.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">New Construction Expertise</h3>
                <p>
                  Specialized installation for Barrhaven&apos;s newest developments, working seamlessly with modern building
                  standards and contemporary home layouts.
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed">
              Our team understands Barrhaven&apos;s unique community character and delivers installations that enhance your
              home&apos;s value while providing lasting functionality and style.
            </p>

            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Popular Products in Barrhaven</h3>
              <p className="text-gray-600">
                <a href="/products/barn-doors" className="text-purple-600 hover:underline mr-4">
                  Barn Doors
                </a>
                |
                <a href="/products/bypass-doors" className="text-purple-600 hover:underline ml-4 mr-4">
                  Bypass Doors
                </a>
                |
                <a href="/products/interior-doors" className="text-purple-600 hover:underline ml-4">
                  Interior Doors
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Upgrade Your Barrhaven Home</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join your Barrhaven neighbors who chose PG Closets for premium home improvements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="primary"
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Link href="/request-work">Get Free Barrhaven Quote →</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600"
            >
              <a href="mailto:spencer@peoplesgrp.com">Email: spencer@peoplesgrp.com</a>
            </Button>
          </div>
        </div>
      </section>
    </StandardLayout>
  )
}
