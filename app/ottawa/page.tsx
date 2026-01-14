// Removed shadcn import - using native HTML
import Link from "next/link"

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
              <Link
                href="/request-work"
                className="inline-block bg-white text-blue-600 hover:bg-gray-100 shadow-xl px-6 py-3 rounded-lg font-semibold text-center"
              >
                Get Free Ottawa Quote
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

      {/* Service Areas in Ottawa */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ottawa Neighborhoods We Serve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional closet door installation throughout Ottawa&apos;s diverse neighborhoods
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

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Ottawa Home?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of satisfied Ottawa homeowners who chose PG Closets for their closet door needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-work"
              className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold text-center"
            >
              Get Free Ottawa Quote
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
