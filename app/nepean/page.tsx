// Removed shadcn import - using native HTML
import Link from "next/link"

export const metadata = {
  title: "Closet Doors Nepean | Professional Installation | PG Closets",
  description:
    "Premium closet door installation in Nepean. Official Renin dealer serving Barrhaven, Manotick, Riverside South, and surrounding areas. Free consultation and transparent pricing.",
  keywords:
    "closet doors Nepean, barn doors Nepean, bypass doors Nepean, bifold doors Nepean, professional installation Nepean, Renin dealer Nepean",
  openGraph: {
    title: "Closet Doors Nepean | Professional Installation | PG Closets",
    description:
      "Premium closet door installation in Nepean. Official Renin dealer with lifetime warranty and transparent Canadian pricing.",
    type: "website",
    locale: "en_CA",
  },
}

export default function NepeanPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "PG Closets Nepean",
            description: "Professional closet door installation in Nepean, Ontario",
            url: "https://pgclosets.com/nepean",
            telephone: "+1-613-XXX-XXXX",
            email: "spencer@peoplesgrp.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Nepean",
              addressRegion: "ON",
              addressCountry: "CA",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "45.3467",
              longitude: "-75.7269",
            },
            areaServed: {
              "@type": "City",
              name: "Nepean",
              sameAs: "https://en.wikipedia.org/wiki/Nepean,_Ontario",
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Premium Closet Doors in Nepean</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Serving Barrhaven, Manotick, Riverside South, and all Nepean communities with professional Renin closet
              door installation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-work"
                className="inline-block bg-white text-blue-600 hover:bg-gray-100 shadow-xl px-6 py-3 rounded-lg font-semibold text-center"
              >
                Get Free Nepean Quote
              </Link>
              <Link
                href="/products"
                className="inline-block border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold text-center"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas in Nepean */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nepean Communities We Serve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional closet door installation throughout Nepean&apos;s diverse neighborhoods
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Barrhaven", description: "Large suburban community with family homes" },
              { name: "Manotick", description: "Historic village with character properties" },
              { name: "Riverside South", description: "Newer development with modern homes" },
              { name: "Bells Corners", description: "Established area with mature neighborhoods" },
              { name: "Centrepointe", description: "Mixed residential and commercial area" },
              { name: "Craig Henry", description: "Family-friendly community with parks" },
              { name: "Fallowfield", description: "Rural-suburban mix with larger lots" },
              { name: "Greenbank", description: "Growing area with new construction" },
              { name: "Merivale", description: "Central location with diverse housing" },
            ].map((area) => (
              <div key={area.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.name}</h3>
                <p className="text-gray-600 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Transform Your Nepean Home Today</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied Nepean homeowners who chose PG Closets
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-work"
              className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold text-center"
            >
              Get Free Nepean Quote
            </Link>
            <a
              href="mailto:spencer@peoplesgrp.com"
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold text-center"
            >
              Email: spencer@peoplesgrp.com
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
