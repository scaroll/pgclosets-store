'use client'

import PremiumQuoteWizard from "@/components/quote/PremiumQuoteWizard";

// Client components cannot export metadata - handle SEO in layout.tsx or use next/head

export default function PremiumQuotePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Transform Your Space Today
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-blue-100">
            Get a personalized quote in minutes. No obligation, free consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                ✓
              </div>
              <span>24-Hour Response</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                ✓
              </div>
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                ✓
              </div>
              <span>Expert Installation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                ✓
              </div>
              <span>Local Ottawa Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">4.9★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Satisfaction Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <PremiumQuoteWizard />
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose PG Closets?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Design</h3>
              <p className="text-gray-600">
                Our design team helps you maximize your space with beautiful,
                functional solutions tailored to your needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Installation</h3>
              <p className="text-gray-600">
                Professional installation by experienced craftsmen ensures your
                closet works perfectly for years to come.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Satisfaction Guarantee</h3>
              <p className="text-gray-600">
                We stand behind our work with a 100% satisfaction guarantee.
                Your happiness is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
