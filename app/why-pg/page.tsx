import type { Metadata } from "next"
import PgHeader from "@/components/PgHeader"
import PgFooter from "@/components/PgFooter"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Why Choose PG Closets | Official Renin Dealer Ottawa",
  description:
    "Discover why PG Closets is Ottawa's preferred Renin dealer. Local expertise, transparent pricing, professional installation, and comprehensive warranty coverage.",
  keywords:
    "why choose PG Closets, Renin dealer Ottawa, local door company, professional installation Ottawa, transparent pricing, Ottawa closet company",
  openGraph: {
    title: "Why Choose PG Closets | Official Renin Dealer Ottawa",
    description:
      "Discover why PG Closets is Ottawa's preferred Renin dealer. Local expertise, transparent pricing, and professional service.",
    images: [{ url: "/og-why-pg.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/why-pg" },
}

export default function WhyPGPage() {
  const values = [
    {
      title: "Local Expertise",
      description: "Ottawa-based team with deep understanding of local building codes and customer preferences",
      icon: "🏠",
    },
    {
      title: "Transparent Pricing",
      description: "Clear, upfront pricing with no hidden fees. See exactly what you're paying for",
      icon: "💰",
    },
    {
      title: "Quality Guarantee",
      description: "Official Renin dealer with access to premium products and manufacturer warranties",
      icon: "⭐",
    },
    {
      title: "Professional Service",
      description: "Certified technicians, timely delivery, and exceptional customer support",
      icon: "🔧",
    },
  ]

  const metrics = [
    { number: "500+", label: "Ottawa Homes Served", description: "Trusted by your neighbors" },
    { number: "98%", label: "Customer Satisfaction", description: "Consistently excellent reviews" },
    { number: "2 Week", label: "Average Delivery", description: "Fast turnaround times" },
    { number: "Lifetime", label: "Product Warranty", description: "Comprehensive coverage" },
  ]

  return (
    <div className="min-h-screen bg-pg-offwhite">
      <PgHeader />

      {/* Hero Section */}
      <section className="section-padding-lg bg-gradient-to-br from-pg-offwhite to-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="headline-large text-4xl md:text-6xl text-pg-dark mb-6">Why Choose PG Closets?</h1>
          <p className="text-xl text-pg-gray mb-8 max-w-3xl mx-auto">
            As Ottawa's official Renin dealer, we combine premium products with local expertise and transparent service
            to deliver exceptional results.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="headline-large text-3xl md:text-4xl text-pg-dark mb-4">Our Core Values</h2>
            <p className="text-lg text-pg-gray max-w-2xl mx-auto">
              These principles guide everything we do, from initial consultation to final installation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card-apple p-8 group">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-pg-sky/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-pg-sky/20 transition-colors">
                    <span className="text-2xl">{value.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-pg-dark mb-3">{value.title}</h3>
                    <p className="text-pg-gray leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="section-padding bg-pg-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="headline-large text-3xl md:text-4xl text-pg-dark mb-4">Our Track Record</h2>
            <p className="text-lg text-pg-gray">Numbers that demonstrate our commitment to excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-pg-navy mb-2">{metric.number}</div>
                <div className="text-lg font-semibold text-pg-dark mb-2">{metric.label}</div>
                <div className="text-sm text-pg-gray">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="headline-large text-3xl md:text-4xl text-pg-dark mb-4">PG Closets vs. Big Box Stores</h2>
            <p className="text-lg text-pg-gray">See why local expertise makes all the difference</p>
          </div>

          <div className="bg-pg-offwhite rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="font-semibold text-pg-dark mb-4">Service</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <div className="font-medium text-pg-navy mb-1">PG Closets</div>
                    <div className="text-sm text-pg-gray">Personal consultation & design</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="font-medium text-gray-600 mb-1">Big Box</div>
                    <div className="text-sm text-gray-500">Generic catalog options</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-pg-dark mb-4">Installation</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <div className="font-medium text-pg-navy mb-1">PG Closets</div>
                    <div className="text-sm text-pg-gray">Certified technicians</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="font-medium text-gray-600 mb-1">Big Box</div>
                    <div className="text-sm text-gray-500">Third-party contractors</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-pg-dark mb-4">Support</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <div className="font-medium text-pg-navy mb-1">PG Closets</div>
                    <div className="text-sm text-pg-gray">Lifetime local support</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="font-medium text-gray-600 mb-1">Big Box</div>
                    <div className="text-sm text-gray-500">Limited warranty period</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-pg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="headline-large text-3xl md:text-4xl mb-6">Experience the PG Closets Difference</h2>
          <p className="text-xl mb-8 opacity-90">
            Ready to see why Ottawa homeowners choose us for their door and closet needs?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-pg-navy hover:bg-pg-offwhite px-8 py-4 text-lg rounded-full font-semibold">
                Request Work
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="border-2 border-white text-white hover:bg-white hover:text-pg-navy px-8 py-4 text-lg rounded-full font-semibold bg-transparent">
                Get Free Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PgFooter />
    </div>
  )
}
