"use client";
import StandardLayout from "@/components/layout/StandardLayout";
import TrustBadges from "@/components/trust/TrustBadges";
// import QuoteRequestWizard from "@/components/quote/QuoteRequestWizard"; // Temporarily disabled due to build issue

export default function RequestWorkClient() {
  return (
    <StandardLayout>
      <main className="bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Request Your Free Consultation
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-6 leading-relaxed">
              Transform your Ottawa home with premium Renin closet doors
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-sm md:text-base mb-6">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Free Ottawa Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Lifetime Warranty</span>
              </div>
            </div>

            {/* Additional trust badges */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs text-blue-100 px-2">
              <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span>⭐⭐⭐⭐⭐</span>
                <span>5.0 Star Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span>🏆</span>
                <span>BBB A+ Rated</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span>👥</span>
                <span>500+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span>📅</span>
                <span>15+ Years Experience</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tell Us About Your Project
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Fill out the form below and we&apos;ll provide you with a
                detailed quote within 24 hours. Our Ottawa team will handle
                everything from design to installation.
              </p>
            </div>

            {/* Quote Request Form */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Your Free Quote</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" defaultValue="Ottawa" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
                  <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={4} placeholder="Tell us about your closet project..."></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Request Free Quote
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Enhanced Trust Signals */}
        <section className="bg-gray-50 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why Choose PG Closets Ottawa?
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your peace of mind is our priority. We maintain the highest standards of professionalism and quality.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Official Renin Dealer
                </h4>
                <p className="text-gray-600 mb-4">
                  Authorized dealer with access to the complete Renin product
                  line and warranty support.
                </p>
                <div className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full inline-block">
                  Certified Partner
                </div>
              </div>

              <div className="text-center bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Licensed & Insured
                </h4>
                <p className="text-gray-600 mb-4">
                  Licensed and insured installers serving Ottawa, Kanata,
                  Nepean, Orleans, and Barrhaven.
                </p>
                <div className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full inline-block">
                  $2M Insurance
                </div>
              </div>

              <div className="text-center bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Lifetime Warranty
                </h4>
                <p className="text-gray-600 mb-4">
                  Professional installation within 2 weeks of order confirmation
                  with comprehensive lifetime warranty.
                </p>
                <div className="text-xs bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full inline-block">
                  Guaranteed
                </div>
              </div>
            </div>

            {/* Professional trust badges */}
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <TrustBadges variant="professional" layout="inline" className="mb-6" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">BBB</div>
                  <div className="text-xs text-gray-600">A+ Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">⭐⭐⭐⭐⭐</div>
                  <div className="text-xs text-gray-600">Google Reviews</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">500+</div>
                  <div className="text-xs text-gray-600">Satisfied Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">15+</div>
                  <div className="text-xs text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Serving the Greater Ottawa Area
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {["Ottawa", "Kanata", "Nepean", "Orleans", "Barrhaven"].map(
                (city) => (
                  <div
                    key={city}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                  >
                    <div className="text-lg font-semibold text-gray-900">
                      {city}
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="mt-8 text-gray-600">
              Free consultation within 30km of Ottawa • Same-day quotes
              available
            </div>
          </div>
        </section>
      </main>
    </StandardLayout>
  );
}
