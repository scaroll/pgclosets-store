'use client';

import { JobberQuoteForm } from '@/components/forms/JobberQuoteForm';

export function HeroWithForm() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-shapes.png')] opacity-10"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Marketing Content */}
          <div className="text-white space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Custom Closets
                <span className="block text-blue-200">Built for Your Life</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                Transform your storage with premium Renin closet systems. 
                Professional installation in Ottawa and surrounding areas.
              </p>
            </div>

            {/* Value Propositions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-200 mb-3">
                Why Choose PG Closets?
              </h3>
              <div className="grid gap-3">
                {[
                  { icon: '📐', text: 'Free Design Consultation & 3D Renderings' },
                  { icon: '⭐', text: 'Premium Renin Products with Lifetime Warranty' },
                  { icon: '🔧', text: 'Professional Installation by Licensed Contractors' },
                  { icon: '💰', text: 'Competitive Pricing with Transparent Quotes' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0 mt-1" role="img" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="text-blue-100 text-lg">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t border-blue-400/30">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-blue-300 border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="ml-3 text-blue-100">200+ Happy Customers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <span className="text-blue-100 ml-2">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Jobber Form */}
          <div className="relative">
            {/* Form Container with decorative elements */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Decorative corner accent */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-500 rounded-full"></div>
              <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-blue-400 rounded-full"></div>
              
              {/* Form Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <span className="text-2xl" role="img" aria-label="Quote">💬</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Get Your Free Design Quote
                </h2>
                <p className="text-gray-600">
                  Start with a free consultation and 3D design mockup
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-center space-x-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>Free Consultation</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>No Obligation</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>Same Day Response</span>
                </div>
              </div>

              {/* Jobber Form */}
              <JobberQuoteForm 
                formTitle=""
                trackingLabel="hero_form"
                lazyLoad={false} // Load immediately for above-fold placement
                className="jobber-hero-form"
              />

              {/* Contact Alternative */}
              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Prefer to speak with someone directly?
                </p>
                <a 
                  href="tel:+16132622604"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  onClick={() => {
                    // Track phone click from hero form
                    if (typeof window !== 'undefined' && window.gtag) {
                      window.gtag('event', 'phone_click', {
                        click_context: 'hero_form_alternative',
                        phone_number: '(613) 262-2604'
                      });
                    }
                  }}
                >
                  <span>📞</span>
                  <span>(613) 262-2604</span>
                </a>
              </div>
            </div>

            {/* Floating elements for visual appeal */}
            <div className="absolute -z-10 top-10 -left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -z-10 bottom-10 -right-10 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
}