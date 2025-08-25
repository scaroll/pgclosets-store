'use client';

import { JobberQuoteForm } from '@/components/forms/JobberQuoteForm';
import { HeroTrustSignals } from '@/components/trust/trust-badges';
import { Shield, Star, Home, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export function EnhancedHeroWithTrust() {
  return (
    <section className="hero relative min-h-screen bg-gradient-to-br from-navy-600 via-navy-700 to-navy-800 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-shapes.png')] opacity-5"></div>
      <div className="hero__background-accent"></div>
      
      <div className="hero__content container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          
          {/* Left Column - Marketing Content with PG Branding */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-200 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-sky-400/30">
                <Star className="w-4 h-4" />
                Ottawa's #1 Rated Closet Door Experts
              </div>
              
              <h1 className="hero__title text-5xl lg:text-7xl font-light leading-tight">
                Custom Closet Doors
                <strong className="block text-sky-300 font-medium">Built for Your Life</strong>
              </h1>
              
              <p className="hero__subtitle text-xl lg:text-2xl text-sky-100 leading-relaxed max-w-2xl">
                Transform your storage with premium <strong>Renin closet systems</strong>. 
                Professional installation with lifetime warranty in Ottawa and surrounding areas.
              </p>
            </div>

            {/* Key Value Propositions */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-sky-200 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Why Choose PG Closets?
              </h3>
              
              <div className="grid gap-4">
                {[
                  { 
                    icon: '📐', 
                    title: 'Free Design Consultation', 
                    subtitle: '3D renderings & expert planning' 
                  },
                  { 
                    icon: '⭐', 
                    title: 'Premium Renin Products', 
                    subtitle: 'Lifetime warranty on all doors' 
                  },
                  { 
                    icon: '🔧', 
                    title: 'Licensed Professional Installation', 
                    subtitle: '10+ years experience, perfect fit guaranteed' 
                  },
                  { 
                    icon: '💰', 
                    title: 'Transparent Competitive Pricing', 
                    subtitle: 'No hidden fees, free quotes' 
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-sky-400/20 hover:bg-white/10 transition-all">
                    <span className="text-3xl flex-shrink-0 mt-1" role="img" aria-hidden="true">
                      {item.icon}
                    </span>
                    <div>
                      <span className="text-sky-100 text-lg font-medium block">{item.title}</span>
                      <span className="text-sky-200/80 text-sm">{item.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hero__cta-group flex flex-col sm:flex-row gap-4">
              <button className="btn btn-primary bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 text-lg font-medium border-2 border-sky-500 hover:border-sky-600 shadow-lg hover:shadow-sky-500/30 transition-all duration-300 group">
                Get Free Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn btn-secondary bg-white/10 hover:bg-white/20 text-white px-8 py-4 text-lg font-medium border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300">
                View Gallery
              </button>
            </div>

            {/* Trust Signals */}
            <HeroTrustSignals />

            {/* Social Proof */}
            <div className="pt-8 border-t border-sky-400/20">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="flex items-center">
                  <div className="flex -space-x-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 border-3 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm">
                        {String.fromCharCode(65 + i - 1)}
                      </div>
                    ))}
                  </div>
                  <span className="ml-4 text-sky-100 font-medium">500+ Happy Customers in Ottawa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sky-100 ml-2 font-medium">4.9/5 Average Rating</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="text-sky-100">
                  <div className="text-2xl font-bold">10+</div>
                  <div className="text-sm opacity-80">Years Experience</div>
                </div>
                <div className="text-sky-100">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm opacity-80">Doors Installed</div>
                </div>
                <div className="text-sky-100">
                  <div className="text-2xl font-bold">2 Week</div>
                  <div className="text-sm opacity-80">Delivery Time</div>
                </div>
                <div className="text-sky-100">
                  <div className="text-2xl font-bold">Lifetime</div>
                  <div className="text-sm opacity-80">Warranty</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Quote Form */}
          <div className="relative">
            {/* Form Container with PG branding */}
            <div className="relative bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20">
              {/* Premium corner accents */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-sky-500 rounded-full shadow-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-navy-600 rounded-full shadow-lg"></div>
              
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full mb-6 shadow-lg">
                  <span className="text-3xl" role="img" aria-label="Quote">💬</span>
                </div>
                <h2 className="text-3xl font-light text-navy-700 mb-3">
                  Get Your <strong className="font-semibold text-sky-600">Free Design Quote</strong>
                </h2>
                <p className="text-gray-600 text-lg">
                  Start with a complimentary consultation and 3D design mockup
                </p>
              </div>

              {/* Premium Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mb-8 pb-6 border-b border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Free</span>
                  </div>
                  <span className="text-xs text-gray-600">Consultation</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">No Risk</span>
                  </div>
                  <span className="text-xs text-gray-600">No Obligation</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sky-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Fast</span>
                  </div>
                  <span className="text-xs text-gray-600">Same Day Response</span>
                </div>
              </div>

              {/* Enhanced Jobber Form */}
              <div className="mb-6">
                <JobberQuoteForm 
                  formTitle=""
                  trackingLabel="hero_form_enhanced"
                  lazyLoad={false}
                  className="jobber-hero-form-enhanced"
                />
              </div>

              {/* Contact Alternative with PG branding */}
              <div className="text-center pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-4">
                  Prefer to speak with someone directly?
                </p>
                <div className="space-y-2">
                  <a 
                    href="tel:+16132622604"
                    className="inline-flex items-center space-x-3 text-navy-600 hover:text-navy-700 font-semibold transition-colors bg-sky-50 hover:bg-sky-100 px-6 py-3 rounded-lg border border-sky-200"
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.gtag) {
                        window.gtag('event', 'phone_click', {
                          click_context: 'hero_form_enhanced',
                          phone_number: '(613) 262-2604'
                        });
                      }
                    }}
                  >
                    <span className="text-2xl">📞</span>
                    <span className="text-lg">(613) 262-2604</span>
                  </a>
                  <p className="text-xs text-gray-500">Available Mon-Fri 9am-6pm EST</p>
                </div>
              </div>
            </div>

            {/* Floating trust elements */}
            <div className="absolute -z-10 top-12 -left-12 w-24 h-24 bg-sky-300/20 rounded-full animate-float opacity-60"></div>
            <div className="absolute -z-10 bottom-12 -right-12 w-20 h-20 bg-navy-400/20 rounded-full animate-float opacity-60" style={{animationDelay: '1s'}}></div>
            
            {/* Testimonial snippet */}
            <div className="absolute -bottom-6 left-6 right-6 bg-white rounded-lg shadow-xl p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  S
                </div>
                <div className="flex-1">
                  <div className="flex text-yellow-400 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 font-medium">"Perfect doors, flawless installation!"</p>
                  <p className="text-xs text-gray-500">Sarah M., Kanata</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}