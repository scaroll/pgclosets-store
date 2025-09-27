import { Metadata } from "next";
import { Button } from "../../../components/ui/button";
import StandardLayout from "@/components/layout/StandardLayout";
import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo } from "../../../lib/business-config";

export const metadata: Metadata = {
  title: "Renin Closet Doors Barrhaven Ottawa | Official Dealer | PG Closets",
  description:
    "Premium Renin closet doors in Barrhaven, Riverside South, and South Ottawa. Official authorized dealer with professional installation, 1-2 day delivery, and lifetime warranty for executive homes.",
  keywords: [
    "Renin doors Barrhaven Ottawa",
    "Renin closet doors Riverside South",
    "Renin barn doors South Ottawa",
    "Renin dealer Barrhaven",
    "executive home closet doors Barrhaven",
    "Renin installation Barrhaven",
    "luxury closet doors Barrhaven",
    "premium home solutions Barrhaven",
    "South Ottawa closet doors"
  ].join(", "),
  openGraph: {
    title: "Renin Closet Doors Barrhaven Ottawa | Official Dealer | PG Closets",
    description:
      "Premium Renin closet doors in Barrhaven with 1-2 day delivery. Official dealer serving Riverside South, Manotick and South Ottawa executive communities.",
    type: "website",
    locale: "en_CA",
    url: `${BUSINESS_INFO.urls.main}/renin/barrhaven`,
    siteName: BUSINESS_INFO.name,
    images: [
      {
        url: `${BUSINESS_INFO.urls.main}/renin-closet-doors-thumbnail.png`,
        width: 1200,
        height: 630,
        alt: "Renin Closet Doors Barrhaven Ottawa by PG Closets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renin Closet Doors Barrhaven Ottawa | Official Dealer",
    description: "Premium Renin closet doors in Barrhaven with 1-2 day delivery.",
    images: [`${BUSINESS_INFO.urls.main}/renin-closet-doors-thumbnail.png`],
  },
  robots: "index, follow, max-image-preview:large",
  alternates: {
    canonical: "/renin/barrhaven",
  },
};

export default function ReninBarrhavenPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${BUSINESS_INFO.urls.main}/renin/barrhaven#business`,
        name: `${BUSINESS_INFO.name} - Renin Dealer Barrhaven`,
        description: "Official Renin dealer serving Barrhaven, Riverside South and South Ottawa with premium closet doors and professional installation",
        url: `${BUSINESS_INFO.urls.main}/renin/barrhaven`,
        email: BUSINESS_INFO.email,
        address: getSchemaAddress(),
        geo: getSchemaGeo(),
        areaServed: [
          {
            "@type": "City",
            name: "Barrhaven",
            sameAs: "https://en.wikipedia.org/wiki/Barrhaven"
          },
          {
            "@type": "Neighborhood",
            name: "Riverside South"
          },
          {
            "@type": "Neighborhood",
            name: "Manotick"
          },
          {
            "@type": "Neighborhood",
            name: "Nepean South"
          },
          {
            "@type": "Neighborhood",
            name: "Half Moon Bay"
          }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Renin Barrhaven Executive Collection",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Renin Executive Closet Doors Barrhaven",
                description: "Premium closet doors for Barrhaven's executive homes"
              },
              availability: "InStock",
              priceRange: "$659-$1115"
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Renin Luxury Barn Doors Barrhaven",
                description: "Sophisticated barn doors for upscale Barrhaven properties"
              },
              availability: "InStock",
              priceRange: "$899-$1395"
            }
          ]
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "52",
          bestRating: "5",
          worstRating: "1"
        },
        offers: {
          "@type": "Offer",
          availability: "InStock",
          priceCurrency: "CAD",
          priceRange: "$459-$1395",
          validFrom: "2024-01-01"
        }
      },
      {
        "@type": "Service",
        name: "Renin Executive Installation Barrhaven",
        provider: {
          "@id": `${BUSINESS_INFO.urls.main}/renin/barrhaven#business`
        },
        areaServed: [
          {
            "@type": "City",
            name: "Barrhaven"
          },
          {
            "@type": "City",
            name: "Riverside South"
          }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Barrhaven Executive Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "1-2 Day Executive Delivery",
                description: "Priority delivery for Barrhaven executive homes"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Luxury Home Integration",
                description: "Premium installation for upscale Barrhaven properties"
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
            name: "Barrhaven",
            item: `${BUSINESS_INFO.urls.main}/renin/barrhaven`
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
      <section className="bg-gradient-to-br from-amber-900 via-orange-800 to-slate-800 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Barrhaven • Executive Service</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extralight tracking-tight mb-6">
              Renin Closet Doors
              <span className="block text-4xl md:text-5xl text-amber-300 mt-2">Barrhaven & South Ottawa</span>
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wide text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed">
              Serving Barrhaven, Riverside South, Manotick, and surrounding South Ottawa communities. Premium Renin closet doors for executive homes and luxury properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                href="/request-work"
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl font-medium tracking-wider uppercase px-8 py-4 text-lg"
              >
                Get Executive Quote →
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="/renin"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg"
              >
                Browse Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Barrhaven Communities We Serve */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">South Ottawa Communities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional Renin installation across Barrhaven's premier neighborhoods
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Barrhaven Centre",
                description: "Heart of South Ottawa's largest suburb",
                homes: "Executive homes, established community",
                specialty: "Luxury installations",
                delivery: "1-2 day delivery"
              },
              {
                name: "Riverside South",
                description: "Prestigious waterfront community",
                homes: "Luxury homes, executive properties",
                specialty: "Premium upgrades",
                delivery: "1-2 day delivery"
              },
              {
                name: "Manotick",
                description: "Historic village charm",
                homes: "Character homes, estate properties",
                specialty: "Heritage-modern blend",
                delivery: "1-2 day delivery"
              },
              {
                name: "Half Moon Bay",
                description: "Exclusive waterfront development",
                homes: "Luxury waterfront, custom builds",
                specialty: "High-end custom solutions",
                delivery: "1-2 day delivery"
              },
              {
                name: "Chapman Mills",
                description: "Family-oriented neighborhood",
                homes: "Executive family homes, modern layouts",
                specialty: "Family luxury solutions",
                delivery: "1-2 day delivery"
              },
              {
                name: "Nepean South",
                description: "Established suburban area",
                homes: "Quality homes, mature community",
                specialty: "Renovation expertise",
                delivery: "1-2 day delivery"
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

      {/* Executive Home Solutions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Executive Barrhaven Home Solutions</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Barrhaven's executive homes deserve closet solutions that match their caliber. Our premium Renin collection offers sophisticated designs, superior materials, and flawless installation for discerning homeowners.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Luxury Materials</h3>
                    <p className="text-gray-600">Premium finishes and high-end materials that complement executive home interiors and maintain value.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Executive Installation</h3>
                    <p className="text-gray-600">White-glove service with meticulous attention to detail, ensuring flawless integration with your home's architecture.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Support</h3>
                    <p className="text-gray-600">Priority customer service and dedicated support for Barrhaven's executive home owners.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <p className="text-gray-600">Executive Home Gallery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Product Collection */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Executive Renin Collection</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Premium products curated for Barrhaven's executive homes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Executive Barn Doors",
                price: "$1,295",
                description: "Sophisticated barn doors with premium hardware and luxury finishes",
                features: ["Premium solid wood", "Executive hardware", "Custom staining"],
                tier: "Luxury",
                color: "amber"
              },
              {
                name: "Master Suite Bypass",
                price: "$899",
                description: "Whisper-quiet sliding doors for executive master bedroom suites",
                features: ["Ultra-quiet operation", "Premium materials", "Soft-close mechanism"],
                tier: "Executive",
                color: "orange"
              },
              {
                name: "Walk-In Closet System",
                price: "$1,595",
                description: "Complete closet organization system for luxury walk-in closets",
                features: ["Custom configuration", "Premium storage", "Integrated lighting"],
                tier: "Ultimate",
                color: "yellow"
              }
            ].map((product, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Product Image</span>
                    </div>
                  </div>
                  <div className={`absolute top-4 left-4 bg-${product.color}-600 text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {product.tier}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="text-2xl font-bold text-green-600 mb-3">{product.price}</div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="primary" className="w-full">
                    Get Executive Quote →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Barrhaven Executive Projects */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Recent Barrhaven Executive Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Showcasing premium installations across South Ottawa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                neighborhood: "Riverside South",
                project: "Luxury Master Suite Renovation",
                product: "Renin Executive Barn Door - Walnut",
                description: "Stunning walnut barn door installation in waterfront executive home, featuring premium hardware and custom finishing.",
                date: "September 2024",
                homeValue: "$950K+ Home"
              },
              {
                neighborhood: "Half Moon Bay",
                project: "Custom Walk-In Closet System",
                product: "Renin Complete Executive Package",
                description: "Full luxury closet system installation in custom waterfront home, coordinated with interior designer.",
                date: "August 2024",
                homeValue: "$1.2M+ Home"
              },
              {
                neighborhood: "Manotick",
                project: "Heritage Home Integration",
                product: "Renin Heritage-Modern Blend",
                description: "Carefully designed integration of modern Renin doors with historic Manotick home character.",
                date: "August 2024",
                homeValue: "$850K+ Home"
              }
            ].map((project, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Executive Project Photo</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-amber-600">{project.neighborhood}</span>
                    <span className="text-sm text-gray-500">{project.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.project}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.product}</p>
                  <p className="text-sm text-orange-600 mb-3">{project.homeValue}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Barrhaven Executive Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Executive Service for Barrhaven</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Premium service tailored for South Ottawa's executive communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
                title: "White-Glove Service",
                description: "Executive-level service with meticulous attention to detail",
                color: "amber"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Priority Scheduling",
                description: "1-2 day delivery with flexible scheduling for executives",
                color: "orange"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                ),
                title: "Investment Protection",
                description: "Premium materials that enhance and protect home value",
                color: "yellow"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Lifetime Guarantee",
                description: "Comprehensive warranty with dedicated executive support",
                color: "green"
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

      {/* Barrhaven Executive Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Executive Client Testimonials</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What Barrhaven's executive homeowners say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Robert & Catherine M.",
                location: "Riverside South, Barrhaven",
                rating: 5,
                review: "Exceptional quality and service! The walnut barn door in our master suite is absolutely stunning. Spencer's team was professional and respectful of our home. Worth every penny.",
                product: "Renin Executive Barn Door - Walnut",
                homeType: "Executive Waterfront",
                date: "September 2024"
              },
              {
                name: "David P.",
                location: "Half Moon Bay, Barrhaven",
                rating: 5,
                review: "Premium service from start to finish. The custom walk-in closet system exceeded our expectations. Perfect coordination with our interior designer. Highly recommend!",
                product: "Renin Complete Executive Package",
                homeType: "Custom Luxury Home",
                date: "August 2024"
              },
              {
                name: "Michael & Sarah K.",
                location: "Manotick, Ottawa",
                rating: 5,
                review: "Perfect integration with our heritage home. PG Closets understood our vision and delivered flawlessly. The quality is outstanding and installation was meticulous.",
                product: "Renin Heritage-Modern Collection",
                homeType: "Heritage Executive",
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
                  <div className="text-sm text-amber-600 mt-1">{testimonial.product}</div>
                  <div className="text-xs text-orange-600 mt-1">{testimonial.homeType}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">Elevate Your Barrhaven Executive Home</h2>
          <p className="text-xl text-amber-100 mb-12 leading-relaxed">
            Join Barrhaven's executive homeowners who chose PG Closets for premium Renin closet doors. White-glove service with priority delivery across South Ottawa.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="primary"
              size="lg"
              href="/request-work"
              className="bg-white text-amber-600 hover:bg-gray-100 shadow-xl font-medium tracking-wider uppercase px-8 py-4 text-lg"
            >
              Get Executive Quote →
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="mailto:spencer@peoplesgrp.com"
              className="border-2 border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 text-lg"
            >
              Email: spencer@peoplesgrp.com
            </Button>
          </div>
          <div className="mt-8 text-amber-200 text-sm">
            Serving Barrhaven & South Ottawa • Executive Service • Premium Quality • Licensed & Insured
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}