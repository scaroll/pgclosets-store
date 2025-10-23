import { Metadata } from 'next'
import { BUSINESS_INFO } from '@/lib/business-config'
import { generateOrganizationSchema, generateLocalBusinessSchema, generateProductSchema } from '@/lib/seo/comprehensive-schema'
import { StructuredData } from '@/components/StructuredData'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone, MapPin, Star, Clock, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Premium Closet Doors Ottawa | Custom Bifold & Bypass Doors | PG Closets',
  description: 'Leading closet door supplier in Ottawa. Custom bifold, bypass, and barn doors with professional installation. Renin authorized dealer. 2-week delivery & lifetime warranty.',
  keywords: [
    'closet doors Ottawa',
    'bifold doors Ottawa',
    'bypass doors Ottawa',
    'custom closet doors Ottawa',
    'closet door installation Ottawa',
    'bedroom closet doors Ottawa',
    'modern closet doors Ottawa',
    'wooden closet doors Ottawa',
    'glass closet doors Ottawa',
    'closet door hardware Ottawa',
    'local closet doors Ottawa'
  ],
  alternates: {
    canonical: '/closet-doors-ottawa'
  },
  openGraph: {
    title: 'Premium Closet Doors Ottawa | Custom Solutions by PG Closets',
    description: 'Ottawa\'s trusted closet door specialist. Custom bifold, bypass & barn doors with professional installation. Serving Ottawa & surrounding areas.',
    url: `${BUSINESS_INFO.urls.main}/closet-doors-ottawa`,
    images: [
      {
        url: `${BUSINESS_INFO.urls.main}/images/elegant-barn-door-closet.png`,
        width: 1200,
        height: 630,
        alt: 'Custom Closet Doors Ottawa'
      }
    ]
  }
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ClosetDoorsOttawaPage() {
  const organizationSchema = generateOrganizationSchema()
  const localBusinessSchema = generateLocalBusinessSchema()

  // Product schema for closet doors
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Custom Closet Doors Ottawa",
    "description": "Premium custom closet doors including bifold, bypass, and barn doors with professional installation in Ottawa",
    "brand": {
      "@type": "Brand",
      "name": "PG Closets"
    },
    "offers": {
      "@type": "Offer",
      "url": `${BUSINESS_INFO.urls.main}/closet-doors-ottawa`,
      "priceCurrency": "CAD",
      "price": "299",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "PG Closets"
      },
      "areaServed": {
        "@type": "City",
        "name": "Ottawa",
        "addressRegion": "ON"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  }

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, localBusinessSchema, productSchema]
  }

  return (
    <>
      <StructuredData schema={combinedSchema} />

      <div className="min-h-screen">
        {/* Hero Section - Ottawa Focused */}
        <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Premium <span className="text-blue-600">Closet Doors</span> in Ottawa
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your Ottawa home with custom closet doors. Expert installation of bifold, bypass,
                and barn doors with lifetime warranty. Serving all Ottawa neighborhoods.
              </p>

              {/* Ottawa Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Ottawa-Based Company</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">2-Week Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Star className="w-5 h-5" />
                  <span className="font-medium">4.9/5 Rating</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Get Free Ottawa Quote
                </Button>
                <Button size="lg" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Ottawa Service Areas
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Ottawa Service Areas */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Serving All Ottawa Neighborhoods
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {[
                'Downtown Ottawa', 'Kanata', 'Orléans', 'Barrhaven', 'Nepean',
                'Gloucester', 'Rockcliffe Park', 'Vanier', 'Westboro', 'Hintonburg',
                'The Glebe', 'Sandy Hill', 'Centretown', 'ByWard Market', 'Little Italy'
              ].map((area, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-3 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Types - Ottawa Optimized */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Custom Closet Door Solutions for Ottawa Homes
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Choose from our premium selection of closet doors, all designed and installed
              specifically for Ottawa homeowners
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Bifold Doors */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">Bifold Doors Ottawa</h3>
                  <p className="text-gray-600 mb-4">
                    Space-saving bifold doors perfect for Ottawa bedrooms and closets.
                    Custom sizes and finishes available.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Custom measurements
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Modern & traditional styles
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      2-week Ottawa delivery
                    </li>
                  </ul>
                  <Button className="w-full">
                    Explore Bifold Doors
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Bypass Doors */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">Bypass Doors Ottawa</h3>
                  <p className="text-gray-600 mb-4">
                    Sleek sliding bypass doors ideal for tight spaces in Ottawa condos
                    and modern homes.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Smooth sliding operation
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Premium hardware
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Professional Ottawa installation
                    </li>
                  </ul>
                  <Button className="w-full">
                    Explore Bypass Doors
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Barn Doors */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">Barn Doors Ottawa</h3>
                  <p className="text-gray-600 mb-4">
                    Stylish barn doors adding rustic charm to Ottawa homes.
                    Custom designs and hardware options.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Solid wood construction
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Custom hardware finishes
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Lifetime warranty
                    </li>
                  </ul>
                  <Button className="w-full">
                    Explore Barn Doors
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ottawa Trust Signals */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Ottawa's Trusted Closet Door Experts
              </h2>
              <p className="text-blue-100 max-w-3xl mx-auto">
                Proudly serving Ottawa homeowners for over 15 years with premium closet door solutions
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
              <div>
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-blue-100">Years in Ottawa</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1,200+</div>
                <div className="text-blue-100">Ottawa Installations</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <div className="text-blue-100">Customer Rating</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-blue-100">Local Team</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Transform Your Ottawa Home?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Get a free, no-obligation consultation and quote for your custom closet doors
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Call (613) 555-0123
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/book">
                    Schedule Ottawa Consultation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 text-sm text-gray-500">
                Serving all Ottawa areas: Downtown, Kanata, Orléans, Barrhaven, Nepean, Gloucester, and surrounding communities
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}