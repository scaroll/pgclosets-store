// Removed shadcn import - using native HTML
import Link from "next/link"

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
              <Link
                href="/request-work"
                className="inline-block bg-white text-blue-600 hover:bg-gray-100 shadow-xl px-6 py-3 rounded-lg font-semibold text-center"
              >
                Get Free Orleans Quote
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

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Enhance Your Orleans Home</h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover why Orleans families trust PG Closets for their home improvement projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-work"
              className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold text-center"
            >
              Get Free Orleans Quote
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
