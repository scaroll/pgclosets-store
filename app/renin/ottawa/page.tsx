import type { Metadata } from "next";
import { Button } from "../../../components/ui/button";
import StandardLayout from "@/components/layout/StandardLayout";
import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo } from "../../../lib/business-config";

export const metadata: Metadata = {
  title: "Renin Closet Doors Ottawa Downtown | Official Dealer | PG Closets",
  description:
    "Premium Renin closet doors in downtown Ottawa, Centretown, Byward Market, and Glebe. Official authorized dealer with professional installation, lifetime warranty, and same-day service.",
  keywords: [
    "Renin doors Ottawa downtown",
    "Renin closet doors Centretown",
    "Renin barn doors Byward Market",
    "Renin dealer downtown Ottawa",
    "closet doors Glebe Ottawa",
    "Renin installation Ottawa core",
    "premium closet doors Ottawa",
    "Renin bypass doors downtown",
    "heritage home closet doors Ottawa"
  ].join(", "),
  openGraph: {
    title: "Renin Closet Doors Ottawa Downtown | Official Dealer | PG Closets",
    description:
      "Premium Renin closet doors in downtown Ottawa with same-day service. Official dealer serving Centretown, Byward Market, Glebe and surrounding areas.",
    type: "website",
    locale: "en_CA",
    url: `${BUSINESS_INFO.urls.main}/renin/ottawa`,
    siteName: BUSINESS_INFO.name,
    images: [
      {
        url: `${BUSINESS_INFO.urls.main}/renin-closet-doors-thumbnail.png`,
        width: 1200,
        height: 630,
        alt: "Renin Closet Doors Ottawa Downtown by PG Closets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renin Closet Doors Ottawa Downtown | Official Dealer",
    description: "Premium Renin closet doors in downtown Ottawa with same-day service.",
    images: [`${BUSINESS_INFO.urls.main}/renin-closet-doors-thumbnail.png`],
  },
  robots: "index, follow, max-image-preview:large",
  alternates: {
    canonical: "/renin/ottawa",
  },
};

export default function ReninOttawaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${BUSINESS_INFO.urls.main}/renin/ottawa#business`,
        name: `${BUSINESS_INFO.name} - Renin Dealer Ottawa`,
        description: "Official Renin dealer serving downtown Ottawa with premium closet doors and professional installation",
        url: `${BUSINESS_INFO.urls.main}/renin/ottawa`,
        email: BUSINESS_INFO.email,
        address: getSchemaAddress(),
        geo: getSchemaGeo(),
        areaServed: [
          {
            "@type": "City",
            name: "Ottawa",
            sameAs: "https://en.wikipedia.org/wiki/Ottawa"
          },
          {
            "@type": "Neighborhood",
            name: "Centretown"
          },
          {
            "@type": "Neighborhood",
            name: "Byward Market"
          },
          {
            "@type": "Neighborhood",
            name: "Glebe"
          },
          {
            "@type": "Neighborhood",
            name: "Old Ottawa South"
          }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Renin Ottawa Collection",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Renin Barn Doors Ottawa",
                description: "Premium sliding barn doors for Ottawa heritage and modern homes"
              },
              availability: "InStock",
              priceRange: "$659-$1115"
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Renin Bypass Doors Ottawa",
                description: "Space-saving sliding closet doors perfect for Ottawa condos"
              },
              availability: "InStock",
              priceRange: "$459-$899"
            }
          ]
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "89",
          bestRating: "5",
          worstRating: "1"
        },
        offers: {
          "@type": "Offer",
          availability: "InStock",
          priceCurrency: "CAD",
          priceRange: "$259-$1115",
          validFrom: "2024-01-01"
        }
      },
      {
        "@type": "Service",
        name: "Renin Closet Door Installation Ottawa",
        provider: {
          "@id": `${BUSINESS_INFO.urls.main}/renin/ottawa#business`
        },
        areaServed: {
          "@type": "City",
          name: "Ottawa"
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Ottawa Installation Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Same-Day Quote Service",
                description: "Free online quote and quote within 24 hours in Ottawa"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Heritage Home Installation",
                description: "Specialized installation for Ottawa's historic properties"
              }
            }
          ]
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BUSINESS_INFO.urls.main
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Renin Collection",
            item: `${BUSINESS_INFO.urls.main}/renin`
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Ottawa",
            item: `${BUSINESS_INFO.urls.main}/renin/ottawa`
          }
        ]
      }
    ]
  };

  return (
    <StandardLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Downtown Ottawa • Same-Day Service</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extralight tracking-tight mb-6">
              Renin Closet Doors
              <span className="block text-4xl md:text-5xl text-blue-300 mt-2">Downtown Ottawa</span>
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wide text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed">
              Serving Ottawa's core neighborhoods - Centretown, Byward Market, Glebe, and Old Ottawa South. Premium Renin closet doors with expert installation for heritage and modern homes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                href="/request-work"
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl font-medium tracking-wider uppercase px-8 py-4 text-lg"
              >
                Get Same-Day Quote →
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="/renin"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg"
              >
                Browse Renin Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ottawa Neighborhoods We Serve */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Ottawa Core Neighborhoods</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional Renin installation across Ottawa's most prestigious neighborhoods
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Centretown",
                description: "Heritage charm meets modern living",
                homes: "Century homes, modern condos",
                specialty: "Heritage installation expertise",
                delivery: "Same-day service"
              },
              {
                name: "Byward Market",
                description: "Historic market district vibrancy",
                homes: "Lofts, converted buildings",
                specialty: "Urban space optimization",
                delivery: "Same-day service"
              },
              {
                name: "Glebe",
                description: "Trendy established community",
                homes: "Character homes, townhouses",
                specialty: "Custom heritage solutions",
                delivery: "Same-day service"
              },
              {
                name: "Old Ottawa South",
                description: "Mature tree-lined streets",
                homes: "Family homes, renovated classics",
                specialty: "Period-appropriate styling",
                delivery: "Same-day service"
              },
              {
                name: "Sandy Hill",
                description: "University area diversity",
                homes: "Student housing, family homes",
                specialty: "Multi-unit solutions",
                delivery: "Same-day service"
              },
              {
                name: "New Edinburgh",
                description: "Historic prestige near Rideau Hall",
                homes: "Heritage mansions, character homes",
                specialty: "Premium heritage installation",
                delivery: "Same-day service"
              }
            ].map((area) => (
              <div key={area.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{area.name}</h3>
                <p className="text-gray-600 mb-3">{area.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Properties:</span>
                    <span className="text-gray-700">{area.homes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Specialty:</span>
                    <span className="text-gray-700">{area.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service:</span>
                    <span className="text-green-600 font-medium">{area.delivery}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Home Solutions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Heritage Home Expertise</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Ottawa's rich architectural heritage requires specialized knowledge. Our team understands the unique challenges of installing modern Renin closet doors in century-old homes while preserving their historic character.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Period-Appropriate Design</h3>
                    <p className="text-gray-600">Carefully selected Renin styles that complement heritage architecture while adding modern functionality.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Structural Integrity</h3>
                    <p className="text-gray-600">Expert assessment of heritage home structure to ensure safe, code-compliant installation without compromising building integrity.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Heritage Preservation</h3>
                    <p className="text-gray-600">Specialized techniques to preserve original features like crown molding, heritage trim, and unique architectural details.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-500">Heritage Home Installation Gallery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Ottawa Installations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Recent Ottawa Installations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how we've transformed Ottawa homes with premium Renin closet doors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                neighborhood: "Glebe",
                project: "Century Home Barn Door Installation",
                product: "Renin Barn Door - Heritage Oak",
                description: "Carefully integrated modern barn door into 1920s character home, preserving original crown molding.",
                date: "September 2024",
                image: "/images/ottawa-glebe-installation.jpg"
              },
              {
                neighborhood: "Centretown",
                project: "Condo Bypass Door Upgrade",
                product: "Renin Bypass Doors - Modern White",
                description: "Space-saving solution for downtown condo, maximizing storage in compact bedroom closet.",
                date: "August 2024",
                image: "/images/ottawa-centretown-installation.jpg"
              },
              {
                neighborhood: "Sandy Hill",
                project: "Student Housing Multi-Unit",
                product: "Renin Bifold Doors - Classic Panel",
                description: "Cost-effective solution for multiple units, providing durability and easy maintenance.",
                date: "August 2024",
                image: "/images/ottawa-sandyhill-installation.jpg"
              }
            ].map((project, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Project Photo</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-blue-600">{project.neighborhood}</span>
                    <span className="text-sm text-gray-500">{project.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.project}</h3>
                  <p className="text-sm text-gray-600 mb-3">{project.product}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ottawa Service Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Why Ottawa Chooses PG Closets</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Local expertise meets Renin quality for unmatched results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Same-Day Service",
                description: "Located in Ottawa core for immediate response and same-day quotes",
                color: "blue"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                title: "Heritage Specialists",
                description: "Expert knowledge of Ottawa's heritage homes and building requirements",
                color: "green"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Licensed & Insured",
                description: "Fully licensed and insured for Ottawa residential installations",
                color: "purple"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "2-Week Installation",
                description: "Fast turnaround from quote to completion for Ottawa residents",
                color: "yellow"
              }
            ].map((benefit, idx) => (
              <div key={idx} className="text-center group">
                <div className={`w-16 h-16 bg-${benefit.color}-100 rounded-full flex items-center justify-center mx-auto mb-4 text-${benefit.color}-600 group-hover:scale-110 transition-transform`}>
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Ottawa Customer Reviews</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real feedback from satisfied customers across Ottawa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Emma T.",
                location: "Centretown, Ottawa",
                rating: 5,
                review: "Exceptional service from quote to installation. Spencer understood exactly what we needed for our heritage home in Centretown. The Renin barn door looks perfect!",
                product: "Renin Barn Door - Heritage Oak",
                date: "September 2024"
              },
              {
                name: "David M.",
                location: "Glebe, Ottawa",
                rating: 5,
                review: "Professional, punctual, and perfectly installed. Our bypass doors operate so smoothly and quietly. Highly recommend PG Closets for Renin products in Ottawa.",
                product: "Renin Bypass Doors - Modern White",
                date: "August 2024"
              },
              {
                name: "Lisa R.",
                location: "Sandy Hill, Ottawa",
                rating: 5,
                review: "Great experience from start to finish. Fast quote, competitive pricing, and flawless installation. Our closet has never looked better!",
                product: "Renin Bifold Doors - Classic Panel",
                date: "August 2024"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">{testimonial.date}</span>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.location}</div>
                  <div className="text-sm text-blue-600 mt-1">{testimonial.product}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">Ready for Premium Renin Doors in Ottawa?</h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join Ottawa homeowners who chose PG Closets for their Renin closet door needs. Same-day quotes available for all Ottawa core neighborhoods.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="primary"
              size="lg"
              href="/request-work"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl font-medium tracking-wider uppercase px-8 py-4 text-lg"
            >
              Get Same-Day Quote →
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="mailto:spencer@peoplesgrp.com"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
            >
              Email: spencer@peoplesgrp.com
            </Button>
          </div>
          <div className="mt-8 text-blue-200 text-sm">
            Serving Ottawa Core • Same-Day Service • Heritage Specialists • Licensed & Insured
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}