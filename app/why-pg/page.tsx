import type { Metadata } from "next"
import StandardLayout from "@/components/layout/StandardLayout"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/Heading-new"
import Text from "@/components/ui/Text-new"
import Section from "@/components/ui/Section-new"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Why Choose PG Closets | Official Renin Dealer Ottawa",
  description:
    "Discover why PG Closets is Ottawa&apos;s preferred Renin dealer. Local expertise, transparent pricing, professional installation, and comprehensive warranty coverage.",
  keywords:
    "why choose PG Closets, Renin dealer Ottawa, local door company, professional installation Ottawa, transparent pricing, Ottawa closet company",
  openGraph: {
    title: "Why Choose PG Closets | Official Renin Dealer Ottawa",
    description:
      "Discover why PG Closets is Ottawa&apos;s preferred Renin dealer. Local expertise, transparent pricing, and professional service.",
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
    <StandardLayout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <Section variant="light" spacing="xl" className="bg-gradient-to-br from-gray-50 to-white pt-24">
          <div className="text-center">
            <Heading level={1} className="text-4xl md:text-6xl text-pg-dark mb-6">Why Choose PG Closets?</Heading>
            <Text size="lg" className="text-xl text-pg-gray mb-8 max-w-3xl mx-auto">
              As Ottawa&apos;s official Renin dealer, we combine premium products with local expertise and transparent service
              to deliver exceptional results.
            </Text>
          </div>
        </Section>

      {/* Values Section */}
      <Section variant="default" spacing="xl">
        <div className="text-center mb-16">
          <Heading level={2} className="text-3xl md:text-4xl text-pg-dark mb-4">Our Core Values</Heading>
          <Text size="lg" className="text-lg text-pg-gray max-w-2xl mx-auto">
            These principles guide everything we do, from initial consultation to final installation
          </Text>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card-apple p-8 group">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-pg-sky/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-pg-sky/20 transition-colors">
                    <span className="text-2xl">{value.icon}</span>
                  </div>
                  <div>
                    <Heading level={3} className="text-xl text-pg-dark mb-3">{value.title}</Heading>
                    <Text className="text-pg-gray leading-relaxed">{value.description}</Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </Section>

      {/* Metrics Section */}
      <Section variant="light" spacing="xl" className="bg-pg-offwhite">
        <div className="text-center mb-16">
          <Heading level={2} className="text-3xl md:text-4xl text-pg-dark mb-4">Our Track Record</Heading>
          <Text size="lg" className="text-lg text-pg-gray">Numbers that demonstrate our commitment to excellence</Text>
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
      </Section>

      {/* Comparison Section */}
      <Section variant="default" spacing="xl">
        <div className="text-center mb-16">
          <Heading level={2} className="text-3xl md:text-4xl text-pg-dark mb-4">PG Closets vs. Big Box Stores</Heading>
          <Text size="lg" className="text-lg text-pg-gray">See why local expertise makes all the difference</Text>
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
      </Section>

      {/* CTA Section */}
      <Section variant="dark" spacing="xl" className="bg-pg-navy text-white">
        <div className="text-center">
          <Heading level={2} className="text-3xl md:text-4xl mb-6">Experience the PG Closets Difference</Heading>
          <Text size="lg" className="text-xl mb-8 opacity-90">
            Ready to see why Ottawa homeowners choose us for their door and closet needs?
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="bg-white text-pg-navy hover:bg-pg-offwhite px-8 py-4 rounded-full">
                Request Work
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-pg-navy px-8 py-4 rounded-full bg-transparent">
                Get Free Quote
              </Button>
            </Link>
          </div>
        </div>
      </Section>
      </div>
    </StandardLayout>
  )
}
