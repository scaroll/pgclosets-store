import { Metadata } from "next";
import { Button } from "../../components/ui/button";
import StandardLayout from "@/components/layout/StandardLayout";
import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo } from "../../lib/business-config";

export const metadata: Metadata = {
  title: "Renin Closet Doors Ottawa | Official Authorized Dealer | PG Closets",
  description:
    "Official Renin dealer in Ottawa offering premium closet doors, barn doors, and storage solutions. 15+ years experience, 500+ homes served, 5.0 star rating. Professional installation with lifetime warranty.",
  keywords: [
    "Renin doors Ottawa",
    "Renin closet doors",
    "Renin barn doors Ottawa",
    "official Renin dealer Ottawa",
    "Renin authorized dealer",
    "premium closet doors Ottawa",
    "Renin bypass doors",
    "Renin bifold doors",
    "custom closet doors Ottawa",
    "Renin installation Ottawa"
  ].join(", "),
  openGraph: {
    title: "Renin Closet Doors Ottawa | Official Authorized Dealer | PG Closets",
    description:
      "Ottawa's #1 Renin dealer. Premium closet doors with professional installation. 15+ years experience, 500+ homes served, 5.0 rating.",
    type: "website",
    locale: "en_CA",
    url: `${BUSINESS_INFO.urls.main}/renin`,
    siteName: BUSINESS_INFO.name,
    images: [
      {
        url: `${BUSINESS_INFO.urls.main}/renin-closet-doors-thumbnail.png`,
        width: 1200,
        height: 630,
        alt: "Renin Closet Doors by PG Closets Ottawa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renin Closet Doors Ottawa | Official Authorized Dealer",
    description: "Ottawa's #1 Renin dealer. Premium closet doors with professional installation.",
    images: [`${BUSINESS_INFO.urls.main}/renin-closet-doors-thumbnail.png`],
  },
  robots: "index, follow, max-image-preview:large",
  alternates: {
    canonical: "/renin",
  },
};

export default function ReninPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${BUSINESS_INFO.urls.main}/renin#business`,
        name: `${BUSINESS_INFO.name} - Official Renin Dealer`,
        description: "Official Renin dealer in Ottawa offering premium closet doors and storage solutions",
        url: `${BUSINESS_INFO.urls.main}/renin`,
        telephone: BUSINESS_INFO.email,
        email: BUSINESS_INFO.email,
        address: getSchemaAddress(),
        geo: getSchemaGeo(),
        areaServed: BUSINESS_INFO.serviceAreas.map(area => ({
          "@type": "City",
          name: area,
        })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Renin Closet Door Collection",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Renin Barn Doors",
                description: "Premium sliding barn doors for closets and room dividers"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Renin Bypass Doors",
                description: "Space-saving sliding closet doors"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Renin Bifold Doors",
                description: "Compact folding closet doors"
              }
            }
          ]
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "127",
          bestRating: "5",
          worstRating: "1"
        },
        priceRange: "$259-$1115",
        paymentAccepted: ["Cash", "Credit Card", "Debit Card", "Check"],
        currenciesAccepted: "CAD"
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
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${BUSINESS_INFO.urls.main}/renin#webpage`,
        url: `${BUSINESS_INFO.urls.main}/renin`,
        name: "Renin Closet Doors Ottawa | Official Authorized Dealer",
        description: "Official Renin dealer in Ottawa offering premium closet doors and storage solutions",
        inLanguage: "en-CA",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${BUSINESS_INFO.urls.main}#website`
        }
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
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Official Renin Authorized Dealer</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extralight tracking-tight mb-6">
              Renin Closet Doors
              <span className="block text-4xl md:text-5xl text-blue-300 mt-2">Ottawa's Premier Collection</span>
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wide text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience the finest in Canadian-made closet doors. As Ottawa's official Renin dealer, we bring you premium quality, expert installation, and unmatched style for your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                href="/request-work"
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl font-medium tracking-wider uppercase px-8 py-4 text-lg"
              >
                Get Free Quote →
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="#products"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg"
              >
                Browse Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-4xl font-bold text-blue-600">15+</div>
              <div className="text-lg font-semibold text-gray-900">Years Experience</div>
              <div className="text-sm text-gray-600">Serving Ottawa homeowners since 2008</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-green-600">500+</div>
              <div className="text-lg font-semibold text-gray-900">Homes Transformed</div>
              <div className="text-sm text-gray-600">Trusted by Ottawa families</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-1">
                <div className="text-4xl font-bold text-yellow-500">5.0</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-900">Perfect Rating</div>
              <div className="text-sm text-gray-600">127 verified reviews</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-purple-600">2 Week</div>
              <div className="text-lg font-semibold text-gray-900">Delivery</div>
              <div className="text-sm text-gray-600">Fast installation across Ottawa</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">Renin Product Collections</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our complete range of Renin closet doors and storage solutions, each designed to elevate your Ottawa home.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Barn Doors",
                description: "Stylish sliding barn doors that make a statement while saving space",
                image: "/images/renin-barn-doors.jpg",
                features: ["Space-saving design", "Premium hardware included", "Multiple finishes available"],
                href: "/products/barn-doors"
              },
              {
                title: "Bypass Doors",
                description: "Smooth-sliding doors perfect for closets and room dividers",
                image: "/images/renin-bypass-doors.jpg",
                features: ["Ultra-quiet operation", "Self-closing mechanism", "Adjustable installation"],
                href: "/products/closet-doors"
              },
              {
                title: "Bifold Doors",
                description: "Compact folding doors ideal for smaller spaces and tight corners",
                image: "/images/renin-bifold-doors.jpg",
                features: ["Space-efficient", "Easy operation", "Durable hinges"],
                href: "/products/closet-doors"
              },
              {
                title: "Interior Doors",
                description: "Premium interior doors to complement your home's aesthetic",
                image: "/images/renin-interior-doors.jpg",
                features: ["Solid construction", "Multiple styles", "Professional finishing"],
                href: "/products/interior-doors"
              },
              {
                title: "Hardware & Accessories",
                description: "Premium hardware and accessories to complete your installation",
                image: "/images/renin-hardware.jpg",
                features: ["Commercial-grade quality", "Lifetime warranty", "Easy maintenance"],
                href: "/products/hardware"
              },
              {
                title: "Storage Systems",
                description: "Complete closet organization solutions for maximum efficiency",
                image: "/images/renin-storage.jpg",
                features: ["Custom configurations", "Expandable design", "Premium materials"],
                href: "/products/closet-systems"
              }
            ].map((category) => (
              <div key={category.title} className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Product Image</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>
                    <ul className="space-y-1 mb-6">
                      {category.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-500 flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="secondary"
                      href={category.href}
                      className="w-full"
                    >
                      Explore {category.title} →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ottawa Service Area Map */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Serving Ottawa & Surrounding Areas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional Renin installation and service across the National Capital Region
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Primary Service Areas</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Ottawa", delivery: "Same day service", href: "/renin/ottawa" },
                  { name: "Kanata", delivery: "1-2 day delivery", href: "/renin/kanata" },
                  { name: "Orleans", delivery: "1-2 day delivery", href: "/renin/orleans" },
                  { name: "Barrhaven", delivery: "1-2 day delivery", href: "/renin/barrhaven" },
                  { name: "Nepean", delivery: "Same day service", href: "/nepean" },
                  { name: "Gloucester", delivery: "1-2 day delivery", href: "/ottawa" },
                ].map((area) => (
                  <a
                    key={area.name}
                    href={area.href}
                    className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300"
                  >
                    <div className="font-semibold text-gray-900">{area.name}</div>
                    <div className="text-sm text-blue-600">{area.delivery}</div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Service Facts</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Free quotes within 24 hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Professional installation in 2 weeks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Lifetime warranty on all installations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Licensed and insured team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Featured Renin Products</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Handpicked selections from our most popular Renin collections
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                name: "Barn Door - Rustic Oak",
                price: "$899",
                originalPrice: "$1,099",
                image: "/images/renin-rustic-oak-barn.jpg",
                features: ["Premium oak finish", "Soft-close hardware", "Easy installation"],
                badge: "Best Seller"
              },
              {
                name: "Bypass Door - Modern White",
                price: "$659",
                originalPrice: "$799",
                image: "/images/renin-modern-white-bypass.jpg",
                features: ["Clean modern design", "Whisper-quiet operation", "Adjustable width"],
                badge: "Customer Favorite"
              },
              {
                name: "Bifold Door - Classic Panel",
                price: "$459",
                originalPrice: "$549",
                image: "/images/renin-classic-bifold.jpg",
                features: ["Traditional styling", "Space-saving design", "Premium hinges"],
                badge: "Great Value"
              }
            ].map((product) => (
              <div key={product.name} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                    <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Product Image</span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.badge}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-green-600">{product.price}</span>
                    <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center">
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

      {/* Customer Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">What Ottawa Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real reviews from satisfied customers across Ottawa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                location: "Kanata, ON",
                rating: 5,
                review: "Absolutely love our new Renin barn doors! PG Closets was professional from quote to installation. The quality is outstanding and the installation was flawless.",
                product: "Renin Barn Doors"
              },
              {
                name: "Mike R.",
                location: "Orleans, ON",
                rating: 5,
                review: "Best decision we made for our home renovation. The bypass doors are whisper quiet and the installation team was incredibly professional. Highly recommend!",
                product: "Renin Bypass Doors"
              },
              {
                name: "Jennifer L.",
                location: "Barrhaven, ON",
                rating: 5,
                review: "Spencer and his team exceeded our expectations. From the initial consultation to final installation, everything was perfect. Our closet looks amazing!",
                product: "Renin Closet System"
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
          <h2 className="text-4xl md:text-5xl font-light mb-6">Ready to Transform Your Ottawa Home?</h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join hundreds of satisfied Ottawa homeowners who chose PG Closets for their Renin closet door solutions.
            Get your free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="primary"
              size="lg"
              href="/request-work"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl font-medium tracking-wider uppercase px-8 py-4 text-lg"
            >
              Get Free Quote →
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
            Licensed & Insured • Lifetime Warranty • 15+ Years Experience
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}