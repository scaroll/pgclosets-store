import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Closet Doors Orleans | Professional Installation | PG Closets",
  description:
    "Premium closet door installation in Orleans. Official Renin dealer serving Blackburn Hamlet, Navan, Cumberland, and surrounding areas. Free consultation and transparent pricing.",
  keywords:
    "closet doors Orleans, barn doors Orleans, bypass doors Orleans, bifold doors Orleans, professional installation Orleans, Renin dealer Orleans",
  openGraph: {
    title: "Closet Doors Orleans | Professional Installation | PG Closets",
    description:
      "Premium closet door installation in Orleans. Official Renin dealer with lifetime warranty and transparent Canadian pricing.",
    type: "website",
    locale: "en_CA",
  },
}

export default function OrleansPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "PG Closets Orleans",
            description: "Professional closet door installation in Orleans, Ontario",
            url: "https://pgclosets.com/orleans",
            telephone: "+1-613-XXX-XXXX",
            email: "spencer@peoplesgrp.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Orleans",
              addressRegion: "ON",
              addressCountry: "CA",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "45.4594",
              longitude: "-75.5264",
            },
            areaServed: {
              "@type": "City",
              name: "Orleans",
              sameAs: "https://en.wikipedia.org/wiki/Orl%C3%A9ans,_Ontario",
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Premium Closet Doors in Orleans</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Serving Blackburn Hamlet, Navan, Cumberland, and all Orleans communities with professional Renin closet
              door installation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                href="/request-work"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl"
              >
                Get Free Orleans Quote →
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

      {/* Service Areas in Orleans */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Orleans Communities We Serve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional closet door installation throughout Orleans and eastern Ottawa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Orleans Village", description: "Historic core with mix of housing styles" },
              { name: "Blackburn Hamlet", description: "Established community with mature homes" },
              { name: "Navan", description: "Rural community with country properties" },
              { name: "Cumberland", description: "Historic village with character homes" },
              { name: "Avalon", description: "Newer subdivision with family homes" },
              { name: "Fallingbrook", description: "Growing area with modern construction" },
              { name: "Chapel Hill", description: "Upscale community with executive homes" },
              { name: "Convent Glen", description: "Family-oriented neighborhood" },
              { name: "Trim", description: "Established area near amenities" },
            ].map((area) => (
              <div key={area.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.name}</h3>
                <p className="text-gray-600 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us for Orleans */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Orleans Homeowners Choose PG Closets</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Eastern Ottawa Expertise</h3>
              <p className="text-gray-600">
                Deep knowledge of Orleans area homes, from historic properties to new developments
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">
                Lifetime warranty on all installations with dedicated Orleans area support
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Efficient Service</h3>
              <p className="text-gray-600">Quick response times and professional installation for Orleans residents</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Enhance Your Orleans Home</h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover why Orleans families trust PG Closets for their home improvement projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              href="/request-work"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Free Orleans Quote →
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
