import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Closet Doors Kanata | Professional Installation | PG Closets",
  description:
    "Premium closet door installation in Kanata. Official Renin dealer serving Kanata Lakes, Bridlewood, Morgan's Grant, and surrounding areas. Free consultation and transparent pricing.",
  keywords:
    "closet doors Kanata, barn doors Kanata, bypass doors Kanata, bifold doors Kanata, professional installation Kanata, Renin dealer Kanata",
  openGraph: {
    title: "Closet Doors Kanata | Professional Installation | PG Closets",
    description:
      "Premium closet door installation in Kanata. Official Renin dealer with lifetime warranty and transparent Canadian pricing.",
    type: "website",
    locale: "en_CA",
  },
}

export default function KanataPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "PG Closets Kanata",
            description: "Professional closet door installation in Kanata, Ontario",
            url: "https://pgclosets.com/kanata",
            telephone: "+1-613-XXX-XXXX",
            email: "spencer@peoplesgrp.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Kanata",
              addressRegion: "ON",
              addressCountry: "CA",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "45.3017",
              longitude: "-75.9130",
            },
            areaServed: {
              "@type": "City",
              name: "Kanata",
              sameAs: "https://en.wikipedia.org/wiki/Kanata,_Ontario",
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Premium Closet Doors in Kanata</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Serving Kanata Lakes, Bridlewood, Morgan's Grant, and all Kanata neighborhoods with professional Renin
              closet door installation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                href="/request-work"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl"
              >
                Get Free Kanata Quote →
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

      {/* Service Areas in Kanata */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kanata Communities We Serve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional closet door installation throughout Kanata's family-friendly neighborhoods
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Kanata Lakes", description: "Upscale community with executive homes" },
              { name: "Bridlewood", description: "Established neighborhood with mature trees" },
              { name: "Morgan's Grant", description: "Family-oriented community with parks" },
              { name: "Beaverbrook", description: "Newer development with modern homes" },
              { name: "Katimavik", description: "Central Kanata with diverse housing" },
              { name: "Glen Cairn", description: "Quiet residential area with townhomes" },
              { name: "Hazeldean", description: "Growing area with new construction" },
              { name: "Marchwood", description: "Established community near amenities" },
              { name: "South March", description: "Newer area with family homes" },
            ].map((area) => (
              <div key={area.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.name}</h3>
                <p className="text-gray-600 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us for Kanata */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Kanata Families Choose PG Closets</h2>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Family-Focused Service</h3>
              <p className="text-gray-600">
                Understanding Kanata families' needs for functional, safe, and beautiful closet solutions
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Kanata Knowledge</h3>
              <p className="text-gray-600">
                Familiar with Kanata's home styles, from executive homes to family townhouses
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Convenient Scheduling</h3>
              <p className="text-gray-600">Flexible installation times that work with busy Kanata family schedules</p>
            </div>
          </div>
        </div>
      </section>

      {/* Kanata-specific Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Closet Solutions for Kanata Homes</h2>
          </div>

          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-lg leading-relaxed mb-6">
              Kanata's family-oriented communities feature a mix of executive homes, townhouses, and condos, each with
              unique storage needs. From large walk-in closets in Kanata Lakes executive homes to space-saving solutions
              in Bridlewood townhouses, we provide tailored closet door solutions for every Kanata home.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Executive Home Solutions</h3>
                <p>
                  Luxury closet door installations for Kanata's upscale homes, featuring premium finishes and custom
                  sizing to match your home's elegant design.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Family-Friendly Options</h3>
                <p>
                  Durable, safe closet doors perfect for busy Kanata families, with easy-to-clean finishes and
                  child-safe hardware options.
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed">
              Our team understands Kanata's building standards and works efficiently to minimize disruption to your
              family's routine. We're proud to serve this vibrant community with professional installation and ongoing
              support.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Kanata Home?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join your Kanata neighbors who trust PG Closets for their home improvement needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              href="/request-work"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Free Kanata Quote →
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
