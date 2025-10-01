import type { Metadata } from "next";
import { Button } from "../../../components/ui/button";
import StandardLayout from "@/components/layout/StandardLayout";
import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo } from "../../../lib/business-config";

export const metadata: Metadata = {
  title: "Renin Closet Doors Kanata | Official Dealer | PG Closets Ottawa",
  description:
    "Premium Renin closet doors in Kanata, Stittsville, and South March. Official authorized dealer with professional installation, 1-2 day delivery, and lifetime warranty for West Ottawa.",
  keywords: [
    "Renin doors Kanata",
    "Renin closet doors Stittsville",
    "Renin barn doors South March",
    "Renin dealer Kanata Ottawa",
    "closet doors West Ottawa",
    "Renin installation Kanata",
    "premium closet doors Kanata",
    "modern home closet doors Kanata",
    "new construction closet doors"
  ].join(", "),
  openGraph: {
    title: "Renin Closet Doors Kanata | Official Dealer | PG Closets",
    description:
      "Premium Renin closet doors in Kanata with 1-2 day delivery. Official dealer serving Stittsville, South March and West Ottawa communities.",
    type: "website",
    locale: "en_CA",
    url: `${BUSINESS_INFO.urls.main}/renin/kanata`,
    siteName: BUSINESS_INFO.name,
    images: [
      {
        url: `${BUSINESS_INFO.urls.main}/renin-closet-doors-thumbnail.png`,
        width: 1200,
        height: 630,
        alt: "Renin Closet Doors Kanata by PG Closets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renin Closet Doors Kanata | Official Dealer",
    description: "Premium Renin closet doors in Kanata with 1-2 day delivery.",
    images: [`${BUSINESS_INFO.urls.main}/renin-closet-doors-thumbnail.png`],
  },
  robots: "index, follow, max-image-preview:large",
  alternates: {
    canonical: "/renin/kanata",
  },
};

export default function ReninKanataPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${BUSINESS_INFO.urls.main}/renin/kanata#business`,
        name: `${BUSINESS_INFO.name} - Renin Dealer Kanata`,
        description: "Official Renin dealer serving Kanata, Stittsville and West Ottawa with premium closet doors and professional installation",
        url: `${BUSINESS_INFO.urls.main}/renin/kanata`,
        email: BUSINESS_INFO.email,
        address: getSchemaAddress(),
        geo: getSchemaGeo(),
        areaServed: [
          {
            "@type": "City",
            name: "Kanata",
            sameAs: "https://en.wikipedia.org/wiki/Kanata,_Ontario"
          },
          {
            "@type": "Neighborhood",
            name: "Stittsville"
          },
          {
            "@type": "Neighborhood",
            name: "South March"
          },
          {
            "@type": "Neighborhood",
            name: "Bridlewood"
          },
          {
            "@type": "Neighborhood",
            name: "Morgan's Grant"
          }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Renin Kanata Collection",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Renin Modern Closet Doors Kanata",
                description: "Contemporary closet doors perfect for new Kanata homes"
              },
              availability: "InStock",
              priceRange: "$459-$1115"
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Renin Barn Doors Kanata",
                description: "Stylish barn doors for modern Kanata family homes"
              },
              availability: "InStock",
              priceRange: "$659-$1115"
            }
          ]
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "43",
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
        name: "Renin Closet Door Installation Kanata",
        provider: {
          "@id": `${BUSINESS_INFO.urls.main}/renin/kanata#business`
        },
        areaServed: [
          {
            "@type": "City",
            name: "Kanata"
          },
          {
            "@type": "City",
            name: "Stittsville"
          }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Kanata Installation Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "1-2 Day Delivery Kanata",
                description: "Fast delivery and installation for Kanata residents"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "New Construction Installation",
                description: "Specialized service for new Kanata home builds"
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
            name: "Kanata",
            item: `${BUSINESS_INFO.urls.main}/renin/kanata`
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
      <section className="bg-gradient-to-br from-emerald-900 via-teal-800 to-slate-800 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Kanata • 1-2 Day Delivery</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extralight tracking-tight mb-6">
              Renin Closet Doors
              <span className="block text-4xl md:text-5xl text-emerald-300 mt-2">Kanata & West Ottawa</span>
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wide text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed">
              Serving Kanata, Stittsville, South March, and surrounding West Ottawa communities. Premium Renin closet doors perfectly suited for modern family homes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                href="/request-work"
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl font-medium tracking-wider uppercase px-8 py-4 text-lg"
              >
                Get Fast Quote →
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

      {/* Kanata Communities We Serve */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">West Ottawa Communities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional Renin installation across Kanata's vibrant family-friendly neighborhoods
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Kanata South",
                description: "Established family neighborhoods",
                homes: "Executive homes, townhouses",
                specialty: "Family-focused solutions",
                delivery: "1-2 day delivery"
              },
              {
                name: "Kanata North",
                description: "Growing tech hub community",
                homes: "Modern homes, new developments",
                specialty: "Contemporary design",
                delivery: "1-2 day delivery"
              },
              {
                name: "Stittsville",
                description: "Charming suburban community",
                homes: "Single-family homes, estates",
                specialty: "Custom installations",
                delivery: "1-2 day delivery"
              },
              {
                name: "South March",
                description: "Newer development area",
                homes: "New construction, modern layouts",
                specialty: "New home integration",
                delivery: "1-2 day delivery"
              },
              {
                name: "Bridlewood",
                description: "Established Kanata neighborhood",
                homes: "Family homes, mature community",
                specialty: "Renovation expertise",
                delivery: "1-2 day delivery"
              },
              {
                name: "Morgan's Grant",
                description: "Premium Kanata community",
                homes: "Executive homes, luxury features",
                specialty: "High-end installations",
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

      {/* Modern Family Home Solutions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Perfect for Modern Kanata Families</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Kanata's modern family homes deserve closet solutions that match their contemporary lifestyle. Our Renin collection offers the perfect blend of style, functionality, and durability for busy families.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Family-Friendly Design</h3>
                    <p className="text-gray-600">Durable materials and smooth operation perfect for daily family use, from kids' rooms to master suites.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Installation</h3>
                    <p className="text-gray-600">Minimal disruption to your family routine with professional installation completed in just a few hours.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Aesthetics</h3>
                    <p className="text-gray-600">Contemporary designs that complement modern Kanata home architecture and current interior trends.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-100 to-teal-200 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                  </svg>
                </div>
                <p className="text-gray-600">Modern Family Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products for Kanata */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Popular Renin Products in Kanata</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Top choices for modern Kanata family homes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Modern Bypass Doors",
                price: "$659",
                description: "Clean, contemporary sliding doors perfect for modern homes",
                features: ["Whisper-quiet operation", "Space-saving design", "Multiple finishes"],
                popularity: "Most Popular",
                color: "blue"
              },
              {
                name: "Rustic Barn Doors",
                price: "$899",
                description: "Stylish statement pieces that add character to any room",
                features: ["Premium hardware included", "Easy maintenance", "Durable construction"],
                popularity: "Family Favorite",
                color: "green"
              },
              {
                name: "Space-Saving Bifolds",
                price: "$459",
                description: "Compact solution ideal for children's rooms and tight spaces",
                features: ["Compact folding design", "Kid-safe operation", "Quick installation"],
                popularity: "Great Value",
                color: "purple"
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
                    {product.popularity}
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
                    Get Quote →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Kanata Installations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Recent Kanata Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how we've transformed homes across West Ottawa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                neighborhood: "Kanata South",
                project: "Master Suite Barn Door",
                product: "Renin Barn Door - Modern Charcoal",
                description: "Stunning barn door installation in executive home master suite, adding both privacy and style.",
                date: "September 2024",
                homeType: "Executive Home"
              },
              {
                neighborhood: "Stittsville",
                project: "Family Home Bypass System",
                product: "Renin Bypass Doors - White Oak",
                description: "Complete closet door upgrade for growing family, featuring quiet operation for kids' bedrooms.",
                date: "August 2024",
                homeType: "Family Home"
              },
              {
                neighborhood: "South March",
                project: "New Construction Integration",
                product: "Renin Complete Package",
                description: "Full Renin closet door package for new home build, coordinated with construction timeline.",
                date: "August 2024",
                homeType: "New Construction"
              }
            ].map((project, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Project Photo</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-emerald-600">{project.neighborhood}</span>
                    <span className="text-sm text-gray-500">{project.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.project}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.product}</p>
                  <p className="text-sm text-blue-600 mb-3">{project.homeType}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kanata Service Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Why Kanata Families Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored service for West Ottawa's vibrant communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Fast Kanata Delivery",
                description: "1-2 day delivery and installation for all Kanata area residents",
                color: "emerald"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                  </svg>
                ),
                title: "Family-Focused",
                description: "Solutions designed with busy families and modern lifestyles in mind",
                color: "blue"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                title: "New Construction",
                description: "Specialized coordination with builders for new Kanata developments",
                color: "purple"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Lifetime Warranty",
                description: "Full warranty coverage with local Kanata support and service",
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

      {/* Kanata Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Kanata Family Reviews</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What Kanata families say about their Renin closet doors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Michelle & Tom K.",
                location: "Kanata South",
                rating: 5,
                review: "Perfect for our busy family! The bypass doors are so quiet - even when the kids are playing. Installation was quick and professional. Highly recommend!",
                product: "Renin Bypass Doors - White Oak",
                date: "September 2024"
              },
              {
                name: "Jennifer S.",
                location: "Stittsville",
                rating: 5,
                review: "Love our new barn door! It's become the focal point of our master bedroom. Quality is outstanding and Spencer's team was fantastic to work with.",
                product: "Renin Barn Door - Modern Charcoal",
                date: "August 2024"
              },
              {
                name: "Mike & Sarah L.",
                location: "South March",
                rating: 5,
                review: "PG Closets coordinated perfectly with our builder. All doors were installed on schedule and look amazing in our new home. Great service!",
                product: "Renin Complete Package",
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
                  <div className="text-sm text-emerald-600 mt-1">{testimonial.product}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">Transform Your Kanata Home Today</h2>
          <p className="text-xl text-emerald-100 mb-12 leading-relaxed">
            Join Kanata families who chose PG Closets for their Renin closet door needs. Fast delivery and professional installation across West Ottawa.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="primary"
              size="lg"
              href="/request-work"
              className="bg-white text-emerald-600 hover:bg-gray-100 shadow-xl font-medium tracking-wider uppercase px-8 py-4 text-lg"
            >
              Get Fast Quote →
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="mailto:spencer@peoplesgrp.com"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg"
            >
              Email: spencer@peoplesgrp.com
            </Button>
          </div>
          <div className="mt-8 text-emerald-200 text-sm">
            Serving Kanata & West Ottawa • 1-2 Day Delivery • Family-Focused • Licensed & Insured
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}