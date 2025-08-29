import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Closet Doors Barrhaven | Professional Installation | PG Closets",
  description:
    "Premium closet door installation in Barrhaven. Official Renin dealer serving Stonebridge, Half Moon Bay, Davidson Heights, and surrounding areas. Free consultation and transparent pricing.",
  keywords:
    "closet doors Barrhaven, barn doors Barrhaven, bypass doors Barrhaven, bifold doors Barrhaven, professional installation Barrhaven, Renin dealer Barrhaven",
  openGraph: {
    title: "Closet Doors Barrhaven | Professional Installation | PG Closets",
    description:
      "Premium closet door installation in Barrhaven. Official Renin dealer with lifetime warranty and transparent Canadian pricing.",
    type: "website",
    locale: "en_CA",
  },
}

export default function BarrhavenPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "PG Closets Barrhaven",
            description: "Professional closet door installation in Barrhaven, Ontario",
            url: "https://pgclosets.com/barrhaven",
            telephone: "+1-613-XXX-XXXX",
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
          }),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Premium Closet Doors in Barrhaven</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Serving Stonebridge, Half Moon Bay, Davidson Heights, and all Barrhaven communities with professional
              Renin closet door installation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                href="/request-work"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl"
              >
                Get Free Barrhaven Quote →
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="/products"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Browse Products
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
              Professional closet door installation throughout Barrhaven's thriving neighborhoods
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
              <div key={area.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.name}</h3>
                <p className="text-gray-600 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us for Barrhaven */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Barrhaven Families Choose PG Closets</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17V3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Home Specialists</h3>
              <p className="text-gray-600">
                Expert installation for Barrhaven's contemporary homes and luxury properties
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
              <p className="text-gray-600">High-end finishes and materials perfect for Barrhaven's upscale homes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Upgrade Your Barrhaven Home</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join your Barrhaven neighbors who chose PG Closets for premium home improvements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              href="/request-work"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Free Barrhaven Quote →
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="mailto:spencer@peoplesgrp.com"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Email: spencer@peoplesgrp.com
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
