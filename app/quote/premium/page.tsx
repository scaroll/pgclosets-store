import PremiumQuoteWizard from "@/components/quote/PremiumQuoteWizard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Free Quote | PG Closets Ottawa",
  description: "Get a personalized quote for your closet project in Ottawa. Free consultation, professional installation, and 24-hour response time.",
  openGraph: {
    title: "Get a Free Quote | PG Closets Ottawa",
    description: "Transform your space with custom closet solutions. Free quote, expert design, professional installation.",
    type: "website",
  },
};

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
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Installation</h3>
              <p className="text-gray-600">
                Professional installation within 2 weeks of approval. Quick,
                clean, and hassle-free service.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                High-quality materials and craftsmanship backed by our
                satisfaction guarantee and warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p className="text-gray-700 mb-4">
                "Absolutely love my new closet doors! The team was professional,
                on time, and the installation was perfect."
              </p>
              <p className="font-semibold">- Sarah M., Ottawa</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p className="text-gray-700 mb-4">
                "Great service from start to finish. The quote process was easy,
                and the final result exceeded our expectations."
              </p>
              <p className="font-semibold">- Mike T., Kanata</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-xl">★★★★★</div>
              </div>
              <p className="text-gray-700 mb-4">
                "Highly recommend PG Closets! They helped us design a custom
                solution that fits perfectly in our space."
              </p>
              <p className="font-semibold">- Jennifer L., Orleans</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                How long does it take to get a quote?
              </h3>
              <p className="text-gray-600">
                You'll receive a detailed quote within 24 hours of submitting
                your request. Our team reviews your information and prepares a
                personalized quote tailored to your needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Is the quote really free?
              </h3>
              <p className="text-gray-600">
                Yes! We provide free, no-obligation quotes. There's no cost to
                explore your options and see what we can do for your space.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Do you serve all of Ottawa?
              </h3>
              <p className="text-gray-600">
                Yes, we serve Ottawa and surrounding areas including Kanata,
                Orleans, Nepean, Barrhaven, and more. We'll confirm coverage when
                we review your quote request.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                What if I don't have measurements?
              </h3>
              <p className="text-gray-600">
                No problem! We'll measure your space precisely during the free
                consultation. Just provide approximate dimensions in the form, or
                leave them blank.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                How long does installation take?
              </h3>
              <p className="text-gray-600">
                Most projects are completed within 1-2 days. We'll provide a
                specific timeline when we send your quote, and we work efficiently
                to minimize disruption to your home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get your free quote today and take the first step toward the closet of your dreams.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}
