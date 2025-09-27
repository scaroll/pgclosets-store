import { Metadata } from "next";
import { Button } from "../../../components/ui/button";
import StandardLayout from "@/components/layout/StandardLayout";
import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo } from "../../../lib/business-config";

export const metadata: Metadata = {
  title: "Renin Closet Doors Orleans Ottawa | Official Dealer | PG Closets",
  description:
    "Premium Renin closet doors in Orleans, Cumberland, and East Ottawa. Official authorized dealer with professional installation, 1-2 day delivery, and lifetime warranty for growing families.",
  keywords: [
    "Renin doors Orleans Ottawa",
    "Renin closet doors Cumberland",
    "Renin barn doors East Ottawa",
    "Renin dealer Orleans",
    "closet doors Orleans Ottawa",
    "Renin installation Orleans",
    "family home closet doors Orleans",
    "growing community closet solutions",
    "new development closet doors"
  ].join(", "),
  openGraph: {
    title: "Renin Closet Doors Orleans Ottawa | Official Dealer | PG Closets",
    description:
      "Premium Renin closet doors in Orleans with 1-2 day delivery. Official dealer serving Cumberland, Avalon, and East Ottawa growing communities.",
    type: "website",
    locale: "en_CA",
    url: `${BUSINESS_INFO.urls.main}/renin/orleans`,
    siteName: BUSINESS_INFO.name,
    images: [
      {
        url: `${BUSINESS_INFO.urls.main}/renin-closet-doors-thumbnail.png`,
        width: 1200,
        height: 630,
        alt: "Renin Closet Doors Orleans Ottawa by PG Closets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renin Closet Doors Orleans Ottawa | Official Dealer",
    description: "Premium Renin closet doors in Orleans with 1-2 day delivery.",
    images: [`${BUSINESS_INFO.urls.main}/renin-closet-doors-thumbnail.png`],
  },
  robots: "index, follow, max-image-preview:large",
  alternates: {
    canonical: "/renin/orleans",
  },
};

export default function ReninOrleansPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${BUSINESS_INFO.urls.main}/renin/orleans#business`,
        name: `${BUSINESS_INFO.name} - Renin Dealer Orleans`,
        description: "Official Renin dealer serving Orleans, Cumberland and East Ottawa with premium closet doors and professional installation",
        url: `${BUSINESS_INFO.urls.main}/renin/orleans`,
        email: BUSINESS_INFO.email,
        address: getSchemaAddress(),
        geo: getSchemaGeo(),
        areaServed: [
          {
            "@type": "City",
            name: "Orleans",
            sameAs: "https://en.wikipedia.org/wiki/Orl%C3%A9ans,_Ontario"
          },
          {
            "@type": "Neighborhood",
            name: "Cumberland"
          },
          {
            "@type": "Neighborhood",
            name: "Avalon"
          },
          {
            "@type": "Neighborhood",
            name: "Chapel Hill"
          },
          {
            "@type": "Neighborhood",
            name: "Blackburn Hamlet"
          }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Renin Orleans Collection",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Renin Family Closet Doors Orleans",
                description: "Durable closet doors perfect for growing Orleans families"
              },
              availability: "InStock",
              priceRange: "$459-$1115"
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Renin Kids Room Doors Orleans",
                description: "Safe and stylish closet doors for children's bedrooms"
              },
              availability: "InStock",
              priceRange: "$359-$659"
            }
          ]
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "38",
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
        name: "Renin Closet Door Installation Orleans",
        provider: {
          "@id": `${BUSINESS_INFO.urls.main}/renin/orleans#business`
        },
        areaServed: [
          {
            "@type": "City",
            name: "Orleans"
          },
          {
            "@type": "City",
            name: "Cumberland"
          }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Orleans Installation Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "1-2 Day Delivery Orleans",
                description: "Fast delivery and installation for Orleans families"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Growing Family Solutions",
                description: "Closet solutions that adapt as families grow"
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
            name: "Orleans",
            item: `${BUSINESS_INFO.urls.main}/renin/orleans`
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
      <section className="bg-gradient-to-br from-violet-900 via-purple-800 to-slate-800 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Orleans • Growing Communities</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extralight tracking-tight mb-6">
              Renin Closet Doors
              <span className="block text-4xl md:text-5xl text-violet-300 mt-2">Orleans & East Ottawa</span>
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wide text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed">
              Serving Orleans, Cumberland, Avalon, and surrounding East Ottawa communities. Premium Renin closet doors designed for growing families and evolving lifestyles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                href="/request-work"
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl font-medium tracking-wider uppercase px-8 py-4 text-lg"
              >
                Get Family Quote →
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

      {/* Orleans Communities We Serve */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">East Ottawa Communities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional Renin installation across Orleans' thriving family neighborhoods
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Orleans Core",
                description: "Established community heart",
                homes: "Family homes, established neighborhoods",
                specialty: "Family-focused installations",
                delivery: "1-2 day delivery"
              },
              {
                name: "Cumberland",
                description: "Historic village charm",
                homes: "Character homes, rural properties",
                specialty: "Custom heritage solutions",
                delivery: "1-2 day delivery"
              },
              {
                name: "Avalon",
                description: "Modern family development",
                homes: "New builds, contemporary layouts",
                specialty: "New construction coordination",
                delivery: "1-2 day delivery"
              },
              {
                name: "Chapel Hill",
                description: "Growing residential area",
                homes: "Family estates, larger lots",
                specialty: "Executive installations",
                delivery: "1-2 day delivery"
              },
              {
                name: "Blackburn Hamlet",
                description: "Quiet family enclave",
                homes: "Established homes, mature community",
                specialty: "Renovation expertise",
                delivery: "1-2 day delivery"
              },
              {
                name: "Trim Road Area",
                description: "Expanding neighborhood",
                homes: "New developments, young families",
                specialty: "Growing family solutions",
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

      {/* Growing Family Solutions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Solutions for Growing Orleans Families</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Orleans is home to many growing families, and our Renin closet doors adapt to changing needs. From nurseries to teen rooms, we provide durable, safe, and stylish solutions that evolve with your family.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Child-Safe Design</h3>
                    <p className="text-gray-600">Smooth operation and finger-safe edges perfect for children's bedrooms and family spaces.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptable Storage</h3>
                    <p className="text-gray-600">Flexible closet solutions that can be reconfigured as children grow and storage needs change.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Long-Term Value</h3>
                    <p className="text-gray-600">Durable construction and timeless designs that maintain value as your Orleans home appreciates.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-100 to-purple-200 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">Growing Family Gallery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Family-Focused Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Family-Focused Renin Collection</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specially selected products perfect for Orleans families
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Kids Room Safe Doors",
                price: "$359",
                description: "Designed specifically for children's bedrooms with safety features",
                features: ["Finger-safe edges", "Smooth operation", "Durable finish"],
                ageGroup: "Ages 3-12",
                color: "violet"
              },
              {
                name: "Teen Privacy Doors",
                price: "$559",
                description: "Stylish doors that provide privacy for growing teenagers",
                features: ["Sound dampening", "Modern aesthetics", "Easy maintenance"],
                ageGroup: "Ages 13+",
                color: "blue"
              },
              {
                name: "Master Suite Elegance",
                price: "$899",
                description: "Sophisticated doors for parent retreats and master closets",
                features: ["Premium materials", "Whisper-quiet", "Luxury finishes"],
                ageGroup: "Adults",
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
                    {product.ageGroup}
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
                    Get Family Quote →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Orleans Family Projects */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Recent Orleans Family Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real homes, real families, real transformations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                neighborhood: "Avalon",
                project: "Growing Family Home Upgrade",
                product: "Renin Complete Family Package",
                description: "Full home closet door upgrade for family with three children, including kid-safe doors and master suite privacy.",
                date: "September 2024",
                familySize: "Family of 5"
              },
              {
                neighborhood: "Cumberland",
                project: "Teen Room Privacy Solution",
                product: "Renin Bypass Doors - Sound Dampening",
                description: "Upgraded teenage daughter's room with privacy-focused doors and built-in sound dampening features.",
                date: "August 2024",
                familySize: "Family of 4"
              },
              {
                neighborhood: "Chapel Hill",
                project: "New Baby Nursery Prep",
                product: "Renin Bifold Doors - Whisper Quiet",
                description: "Ultra-quiet doors installed for new baby's nursery, ensuring peaceful sleep for the whole family.",
                date: "August 2024",
                familySize: "Growing Family"
              }
            ].map((project, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  <div className="w-full h-48 bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Family Project Photo</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-violet-600">{project.neighborhood}</span>
                    <span className="text-sm text-gray-500">{project.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.project}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.product}</p>
                  <p className="text-sm text-blue-600 mb-3">{project.familySize}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Orleans Family Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Why Orleans Families Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized service for East Ottawa's growing family communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Family-First Design",
                description: "Every product selection considers safety and practicality for families",
                color: "violet"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Fast Orleans Service",
                description: "1-2 day delivery to accommodate busy family schedules",
                color: "blue"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                ),
                title: "Budget-Friendly",
                description: "Competitive pricing with payment plans for growing families",
                color: "green"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Long-Term Support",
                description: "Lifetime warranty with local support as your family grows",
                color: "purple"
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

      {/* Orleans Family Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Orleans Family Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from Orleans families about their Renin closet door experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "The Johnson Family",
                location: "Avalon, Orleans",
                rating: 5,
                review: "Perfect for our growing family! The kid-safe doors give us peace of mind, and they're holding up beautifully with three active children. Spencer was fantastic to work with.",
                product: "Renin Family Package",
                familySize: "Family of 5",
                date: "September 2024"
              },
              {
                name: "Amanda & Steve",
                location: "Cumberland, Orleans",
                rating: 5,
                review: "Our teenage daughter loves her new privacy doors. The sound dampening really works! Installation was quick and didn't disrupt our busy family schedule.",
                product: "Renin Privacy Doors",
                familySize: "Family of 4",
                date: "August 2024"
              },
              {
                name: "The Martinez Family",
                location: "Chapel Hill, Orleans",
                rating: 5,
                review: "The whisper-quiet doors for our baby's nursery are amazing. We can get clothes out without waking her up. Highly recommend for new parents!",
                product: "Renin Whisper Quiet Bifolds",
                familySize: "Growing Family",
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
                  <div className="text-sm text-violet-600 mt-1">{testimonial.product}</div>
                  <div className="text-xs text-blue-600 mt-1">{testimonial.familySize}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">Perfect Doors for Your Growing Orleans Family</h2>
          <p className="text-xl text-violet-100 mb-12 leading-relaxed">
            Join Orleans families who chose PG Closets for safe, stylish, and durable Renin closet doors. Family-focused solutions with fast delivery across East Ottawa.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="primary"
              size="lg"
              href="/request-work"
              className="bg-white text-violet-600 hover:bg-gray-100 shadow-xl font-medium tracking-wider uppercase px-8 py-4 text-lg"
            >
              Get Family Quote →
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="mailto:spencer@peoplesgrp.com"
              className="border-2 border-white text-white hover:bg-white hover:text-violet-600 px-8 py-4 text-lg"
            >
              Email: spencer@peoplesgrp.com
            </Button>
          </div>
          <div className="mt-8 text-violet-200 text-sm">
            Serving Orleans & East Ottawa • Family-Focused • Safe & Durable • Licensed & Insured
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}