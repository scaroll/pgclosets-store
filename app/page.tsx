import { TrustBadges } from '@/components/trust/trust-badges'
import { FeaturedProducts } from '@/components/store/featured-products'
import { HeroSection } from '@/components/store/hero-section'
import type { Metadata } from "next"

// Enable ISR with 24 hour revalidation for homepage
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Premium Closet Doors Ottawa | Official Renin Dealer | Custom Installation | PG Closets',
  description: 'Transform your Ottawa home with premium Renin closet doors. Expert installation of barn doors, bypass doors, bifold doors & pivot doors. Free consultation, lifetime warranty, 2-week delivery. Serving Ottawa, Kanata, Nepean, Orleans, Barrhaven.',
  keywords: 'closet doors Ottawa, barn doors Ottawa, Renin dealer, bypass doors, bifold doors, pivot doors, custom closet installation, professional installation Ottawa, home renovation, interior design, space optimization, premium doors Canada, closet solutions Ottawa',
  openGraph: {
    title: 'Premium Closet Doors Ottawa | Official Renin Dealer | PG Closets',
    description: 'Transform your Ottawa home with premium Renin closet doors. Expert installation, lifetime warranty, transparent Canadian pricing.',
    locale: 'en_CA',
    images: [
      {
        url: 'https://www.pgclosets.ca/products/bypass-harmony-1-lite-hero.png',
        width: 1200,
        height: 630,
        alt: 'PG Closets - Premium Renin Closet Doors Ottawa'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@pgclosets',
    title: 'PG Closets | Custom Closets & Storage Solutions in Ottawa',
    description: 'Custom closets, pantries, and storage solutions in Ottawa and the NCR. Professional design, installation, and service by local experts.',
    images: ['https://www.pgclosets.ca/og-image.jpg']
  },
  alternates: {
    canonical: 'https://pgclosets.com'
  },
}

export default function HomePage() {
  return (
    <>
      {/* Claude Code Connection Test - Remove after verification */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              🤖 <strong>Claude Code Connected</strong> - Test deployment successful! 
              <span className="text-xs block mt-1">Deployment time: {new Date().toISOString()}</span>
            </p>
          </div>
        </div>
      </div>
      
      <HeroSection />
      
      {/* Trust Signals Section */}
      <section className="py-12 bg-gray-50" itemScope itemType="https://schema.org/Organization">
        <div className="max-w-7xl mx-auto px-4">
          <TrustBadges />
        </div>
      </section>
      
      {/* Featured Products */}
      <FeaturedProducts />
      
      {/* Service Area Section */}
      <section className="py-16 bg-gradient-to-br from-pg-off-white to-white" itemScope itemType="https://schema.org/ServiceArea">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-pg-navy mb-4" itemProp="headline">
              Serving Ottawa & Surrounding Areas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" itemProp="description">
              Professional closet door installation across the National Capital Region
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {[
              { name: 'Ottawa', population: '1M+' },
              { name: 'Kanata', population: '90K+' },
              { name: 'Nepean', population: '180K+' },
              { name: 'Orleans', population: '110K+' },
              { name: 'Barrhaven', population: '95K+' }
            ].map((city) => (
              <div 
                key={city.name}
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 group"
                itemScope 
                itemType="https://schema.org/City"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pg-navy to-pg-sky rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h3 className="text-pg-navy font-semibold text-lg mb-1" itemProp="name">
                  {city.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {city.population} residents
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full text-sm font-medium border border-green-200 shadow-sm">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span>Free consultation within 30km of Ottawa • Same-day quotes available</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-16 bg-white" itemScope itemType="https://schema.org/PriceSpecification">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-pg-navy mb-4" itemProp="headline">
              Transparent Canadian Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" itemProp="description">
              No hidden fees, no surprises. Choose the perfect solution for your budget and style preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Value Package */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300" itemScope itemType="https://schema.org/Offer">
              <h3 className="text-xl font-semibold text-pg-navy mb-2" itemProp="name">Value</h3>
              <div className="text-3xl font-bold text-pg-navy mb-1" itemProp="priceRange">$259-$449</div>
              <p className="text-gray-600 mb-6">Quality doors, professional install</p>
              
              <div className="space-y-3 text-left mb-8">
                {['Basic styles', 'Standard colors', '1-year warranty'].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <a href="/contact" className="block w-full bg-gray-100 hover:bg-pg-navy hover:text-white text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Get Quote
              </a>
            </div>
            
            {/* Designer Package - Most Popular */}
            <div className="bg-white rounded-lg border-2 border-pg-sky p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 relative" itemScope itemType="https://schema.org/Offer">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-pg-sky text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              
              <h3 className="text-xl font-semibold text-pg-navy mb-2" itemProp="name">Designer</h3>
              <div className="text-3xl font-bold text-pg-navy mb-1" itemProp="priceRange">$459-$649</div>
              <p className="text-gray-600 mb-6">Premium materials and finishes</p>
              
              <div className="space-y-3 text-left mb-8">
                {['Premium styles', 'Custom colors', '3-year warranty'].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <a href="/contact" className="block w-full bg-pg-navy hover:bg-pg-navy/90 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                Get Quote
              </a>
            </div>
            
            {/* Premium Package */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300" itemScope itemType="https://schema.org/Offer">
              <h3 className="text-xl font-semibold text-pg-navy mb-2" itemProp="name">Premium</h3>
              <div className="text-3xl font-bold text-pg-navy mb-1" itemProp="priceRange">$679-$1,115</div>
              <p className="text-gray-600 mb-6">Luxury barn doors and custom solutions</p>
              
              <div className="space-y-3 text-left mb-8">
                {['Luxury styles', 'Full customization', 'Lifetime warranty'].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <a href="/contact" className="block w-full bg-gray-100 hover:bg-pg-navy hover:text-white text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Get Quote
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}