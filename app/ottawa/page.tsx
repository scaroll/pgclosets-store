import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Closet Doors Ottawa | Professional Installation | PG Closets",
  description:
    "Premium closet door installation in Ottawa. Official Renin dealer serving downtown Ottawa, Centretown, Byward Market, and surrounding areas. Free consultation and transparent pricing.",
  keywords:
    "closet doors Ottawa, barn doors Ottawa, bypass doors Ottawa, bifold doors Ottawa, professional installation Ottawa, Renin dealer Ottawa",
  openGraph: {
    title: "Closet Doors Ottawa | Professional Installation | PG Closets",
    description:
      "Premium closet door installation in Ottawa. Official Renin dealer with lifetime warranty and transparent Canadian pricing.",
    type: "website",
    locale: "en_CA",
  },
}

export default function OttawaPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "PG Closets Ottawa",
            description: "Professional closet door installation in Ottawa, Ontario",
            url: "https://pgclosets.com/ottawa",
            telephone: "+1-613-XXX-XXXX",
            email: "spencer@peoplesgrp.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Ottawa",
              addressRegion: "ON",
              addressCountry: "CA",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "45.4215",
              longitude: "-75.6972",
            },
            areaServed: {
              "@type": "City",
              name: "Ottawa",
              sameAs: "https://en.wikipedia.org/wiki/Ottawa",
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Premium Closet Doors in Ottawa</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Serving downtown Ottawa, Centretown, Byward Market, and surrounding neighborhoods with professional Renin
              closet door installation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                href="/request-work"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl"
              >
                Get Free Ottawa Quote →
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

      {/* Service Areas in Ottawa */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ottawa Neighborhoods We Serve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional closet door installation throughout Ottawa's diverse neighborhoods
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Downtown Ottawa", description: "Core business district and residential areas" },
              { name: "Centretown", description: "Historic neighborhood with heritage homes" },
              { name: "Byward Market", description: "Vibrant market area with condos and lofts" },
              { name: "Glebe", description: "Trendy neighborhood with character homes" },
              { name: "Westboro", description: "Upscale area with modern and traditional homes" },
              { name: "Old Ottawa South", description: "Established community with mature homes" },
              { name: "New Edinburgh", description: "Historic area near Rideau Hall" },
              { name: "Sandy Hill", description: "University area with diverse housing" },
              { name: "Hintonburg", description: "Growing neighborhood with young families" },
            ].map((area) => (
              <div key={area.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.name}</h3>
                <p className="text-gray-600 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us for Ottawa */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Ottawa Homeowners Choose PG Closets</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Ottawa Team</h3>
              <p className="text-gray-600">Licensed and insured installers who know Ottawa homes and building codes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Ottawa Service</h3>
              <p className="text-gray-600">Same-day quotes and 2-week installation timeline for Ottawa residents</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ottawa Warranty</h3>
              <p className="text-gray-600">Lifetime warranty on all installations with local Ottawa support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ottawa-specific Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Closet Solutions for Ottawa Homes</h2>
          </div>

          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-lg leading-relaxed mb-6">
              Ottawa's diverse housing stock, from heritage homes in the Glebe to modern condos downtown, requires
              specialized closet door solutions. Our team understands the unique challenges of Ottawa homes, including
              older construction, varying ceiling heights, and the need for energy-efficient solutions during our cold
              winters.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Heritage Home Solutions</h3>
                <p>
                  Specialized installation techniques for Ottawa's historic homes in neighborhoods like New Edinburgh
                  and Sandy Hill, respecting original architecture while adding modern functionality.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Modern Condo Installations</h3>
                <p>
                  Space-saving solutions perfect for downtown Ottawa condos and apartments, maximizing storage in
                  compact living spaces.
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed">
              Whether you're renovating a century home in Centretown or updating a modern townhouse in Westboro, PG
              Closets has the expertise to deliver beautiful, functional closet door solutions that complement your
              Ottawa home's unique character.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Ottawa Home?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of satisfied Ottawa homeowners who chose PG Closets for their closet door needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              href="/request-work"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Free Ottawa Quote →
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
