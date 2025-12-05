import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader } from '@/components/shared/section-header'
import { FeatureCard } from '@/components/shared/feature-card'
import { CTASection } from '@/components/shared/cta-section'
import { BentoGrid, BentoGridItem } from '@/components/shared/bento-grid'

export const metadata: Metadata = {
  title: 'Commercial & Contractor Solutions - PG Closets',
  description:
    'Premium closet solutions for contractors, builders, and commercial projects. Volume pricing, dedicated support, and professional-grade products.',
}

export default function CommercialPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-storage-600 via-storage-700 to-storage-800 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 text-white">
            <div className="inline-block rounded-full bg-white/10 backdrop-blur-sm px-6 py-2 text-sm font-semibold uppercase tracking-wider border border-white/20">
              Commercial Solutions
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Partner with PG Closets
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Premium closet solutions designed for contractors, builders, and commercial projects.
              Volume pricing, dedicated support, and professional-grade products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="#bulk-order-form"
                className="px-8 py-4 rounded-full bg-white text-storage-800 font-semibold text-lg hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                Request a Quote
              </a>
              <a
                href="#volume-pricing"
                className="px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-semibold text-lg hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Contractors Section */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Why Partner With Us"
            title="Benefits for Contractors"
            description="Streamlined processes, dedicated support, and premium products to help you deliver exceptional results"
          />
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              title="Volume Pricing"
              description="Competitive wholesale pricing on bulk orders. The more you order, the more you save."
            />
            <FeatureCard
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              title="Fast Turnaround"
              description="Priority processing and expedited shipping to keep your projects on schedule."
            />
            <FeatureCard
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              }
              title="Dedicated Account Manager"
              description="Personal support from a dedicated team member who understands your business needs."
            />
            <FeatureCard
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              title="Net Terms Available"
              description="Flexible payment terms for qualified contractors and established businesses."
            />
            <FeatureCard
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              }
              title="Bulk Inventory"
              description="Large inventory ready to ship. We stock what you need when you need it."
            />
            <FeatureCard
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
              title="Lifetime Warranty"
              description="Industry-leading lifetime warranty on all products for your clients' peace of mind."
            />
          </div>
        </div>
      </section>

      {/* Volume Pricing Section */}
      <section id="volume-pricing" className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Pricing"
            title="Volume Pricing Tiers"
            description="Competitive wholesale pricing that scales with your business"
            className="mb-16"
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {/* Tier 1 */}
            <div className="relative bg-card dark:bg-apple-dark-bg-secondary rounded-2xl p-8 border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Starter</h3>
                  <p className="text-muted-foreground">Perfect for small projects</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="text-4xl font-bold mb-2">10-25</div>
                  <p className="text-sm text-muted-foreground">Units per order</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-success mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">15% off retail pricing</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-success mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Standard shipping</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-success mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Email support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-success mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Net 15 payment terms</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tier 2 - Featured */}
            <div className="relative bg-primary text-primary-foreground rounded-2xl p-8 border-2 border-primary shadow-xl scale-105 md:scale-110 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-woodgrain-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Professional</h3>
                  <p className="text-primary-foreground/80">For growing contractors</p>
                </div>
                <div className="pt-4 border-t border-primary-foreground/20">
                  <div className="text-4xl font-bold mb-2">26-100</div>
                  <p className="text-sm text-primary-foreground/80">Units per order</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">25% off retail pricing</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Free expedited shipping</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Net 30 payment terms</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Priority order processing</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="relative bg-card dark:bg-apple-dark-bg-secondary rounded-2xl p-8 border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <p className="text-muted-foreground">For large-scale projects</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="text-4xl font-bold mb-2">100+</div>
                  <p className="text-sm text-muted-foreground">Units per order</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-success mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">35% off retail pricing</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-success mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Free white-glove delivery</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-success mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">24/7 priority support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-success mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Net 60 payment terms</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-success mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">Custom pricing available</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              All pricing tiers include our lifetime warranty and professional-grade products.
            </p>
          </div>
        </div>
      </section>

      {/* Project Portfolio Section */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Portfolio"
            title="Featured Commercial Projects"
            description="See how contractors have transformed spaces with our premium closet solutions"
            className="mb-12"
          />
          <BentoGrid className="mx-auto max-w-6xl">
            <BentoGridItem
              title="Luxury Condominiums"
              description="300+ units outfitted with custom closet systems in downtown Ottawa"
              href="/commercial#portfolio"
              image="/optimized-images/elegant-barn-door-closet.webp"
              className="min-h-[400px] md:col-span-2 md:row-span-2"
            />
            <BentoGridItem
              title="Hotel Renovation"
              description="Complete closet transformation for 150-room boutique hotel"
              href="/commercial#portfolio"
              image="/optimized-images/elegant-barn-door-closet.webp"
              className="min-h-[200px] md:col-span-1 md:row-span-1"
            />
            <BentoGridItem
              title="Multi-Family Housing"
              description="Barn doors and bifolds for 80-unit residential complex"
              href="/commercial#portfolio"
              image="/optimized-images/elegant-barn-door-closet.webp"
              className="min-h-[200px] md:col-span-1 md:row-span-1"
            />
            <BentoGridItem
              title="Student Housing"
              description="Durable solutions for 200+ student residences"
              href="/commercial#portfolio"
              image="/optimized-images/elegant-barn-door-closet.webp"
              className="min-h-[200px] md:col-span-3 md:row-span-1"
            />
          </BentoGrid>
          <div className="mt-12 text-center">
            <Link
              href="/request-quote"
              className="apple-transition inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
            >
              Start Your Project
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Bulk Order Form Section */}
      <section id="bulk-order-form" className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              eyebrow="Get Started"
              title="Request a Commercial Quote"
              description="Fill out the form below and our commercial team will contact you within 24 hours"
              className="mb-12"
            />

            <form className="bg-card dark:bg-apple-dark-bg-secondary rounded-2xl p-8 md:p-12 shadow-lg space-y-6">
              {/* Company Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Company Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company-name" className="block text-sm font-semibold mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company-name"
                      name="company-name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Your Company Inc."
                    />
                  </div>

                  <div>
                    <label htmlFor="business-type" className="block text-sm font-semibold mb-2">
                      Business Type *
                    </label>
                    <select
                      id="business-type"
                      name="business-type"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Select type</option>
                      <option value="contractor">General Contractor</option>
                      <option value="builder">Home Builder</option>
                      <option value="developer">Property Developer</option>
                      <option value="designer">Interior Designer</option>
                      <option value="property-manager">Property Manager</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6 pt-6 border-t border-border">
                <h3 className="text-2xl font-bold">Contact Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-semibold mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      name="first-name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label htmlFor="last-name" className="block text-sm font-semibold mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      name="last-name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="(613) 555-1234"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-6 pt-6 border-t border-border">
                <h3 className="text-2xl font-bold">Project Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="project-type" className="block text-sm font-semibold mb-2">
                      Project Type *
                    </label>
                    <select
                      id="project-type"
                      name="project-type"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Select type</option>
                      <option value="new-construction">New Construction</option>
                      <option value="renovation">Renovation</option>
                      <option value="multi-unit">Multi-Unit Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="estimated-quantity" className="block text-sm font-semibold mb-2">
                      Estimated Quantity *
                    </label>
                    <select
                      id="estimated-quantity"
                      name="estimated-quantity"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Select range</option>
                      <option value="10-25">10-25 units</option>
                      <option value="26-50">26-50 units</option>
                      <option value="51-100">51-100 units</option>
                      <option value="100+">100+ units</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-semibold mb-2">
                      Project Timeline *
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Select timeline</option>
                      <option value="immediate">Immediate (1-2 weeks)</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="1-3-months">1-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="6-months+">6+ months</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-semibold mb-2">
                      Estimated Budget
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Select range</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k+">$100,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="project-details" className="block text-sm font-semibold mb-2">
                    Project Details & Requirements
                  </label>
                  <textarea
                    id="project-details"
                    name="project-details"
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Please describe your project, specific product needs, delivery requirements, and any other relevant details..."
                  />
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-4 pt-6 border-t border-border">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="installation-service"
                    className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm">
                    I&apos;m interested in installation services
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="samples"
                    className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm">
                    I&apos;d like to receive product samples
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="newsletter"
                    className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm">
                    Subscribe to receive commercial updates and exclusive offers
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                >
                  Submit Quote Request
                </button>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Our commercial team will review your request and contact you within 24 business hours
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Get In Touch"
            title="Commercial Support"
            description="Multiple ways to connect with our dedicated commercial team"
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Phone */}
            <div className="text-center space-y-4 p-8 bg-card dark:bg-apple-dark-bg-secondary rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Phone</h3>
                <p className="text-muted-foreground mb-4">Monday - Friday, 8am - 6pm EST</p>
                <a href="tel:+16135551234" className="text-primary font-semibold hover:underline">
                  (613) 555-1234
                </a>
                <p className="text-sm text-muted-foreground mt-2">Commercial Hotline</p>
              </div>
            </div>

            {/* Email */}
            <div className="text-center space-y-4 p-8 bg-card dark:bg-apple-dark-bg-secondary rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-muted-foreground mb-4">We respond within 24 hours</p>
                <a href="mailto:commercial@pgclosets.com" className="text-primary font-semibold hover:underline">
                  commercial@pgclosets.com
                </a>
                <p className="text-sm text-muted-foreground mt-2">Commercial Inquiries</p>
              </div>
            </div>

            {/* Visit Showroom */}
            <div className="text-center space-y-4 p-8 bg-card dark:bg-apple-dark-bg-secondary rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                <p className="text-muted-foreground mb-4">By appointment only</p>
                <p className="font-semibold">123 Commercial Drive</p>
                <p className="text-muted-foreground">Ottawa, ON K1A 0A1</p>
                <Link href="/book-measure" className="inline-block mt-3 text-primary font-semibold hover:underline">
                  Schedule Visit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection
        title="Ready to Partner with PG Closets?"
        description="Join hundreds of contractors who trust us for their commercial projects"
        ctaText="Request a Quote"
        ctaHref="#bulk-order-form"
        secondaryCtaText="View Products"
        secondaryCtaHref="/products"
        gradient="premium"
      />
    </main>
  )
}
