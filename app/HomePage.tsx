"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/Heading-new"
import Text from "@/components/ui/Text-new"
import Section from "@/components/ui/Section-new"
import StandardLayout from "@/components/layout/StandardLayout"
import { trackCTAClick } from "@/lib/analytics/events"
import { getPhoneDisplay, getPhoneHref } from "@/lib/business-info"
import { CategoryTiles } from "@/components/home/CategoryTiles"
import { WhyPGSection } from "@/components/home/WhyPGSection"
import { FeaturedProjects } from "@/components/home/FeaturedProjects"
import { ConversionCTA } from "@/components/conversion/ConversionCTA"
import { ElevatedHero } from "@/components/home/ElevatedHero"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel"
import { TrustBar } from "@/components/home/TrustBar"
import { ArrowRight, Check, Shield, Award, Clock, Star, Phone, Timer, Gift, Zap } from "lucide-react"
import { generateLocalBusinessSchema } from "@/lib/seo/comprehensive-schema"

// Sample testimonials data
const testimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    location: "Kanata",
    rating: 5,
    text: "PG Closets transformed our master bedroom. The quality is exceptional and the installation was flawless. Worth every penny!",
    date: "October 2024",
    project: "Walk-in Closet"
  },
  {
    id: "2",
    name: "Michael Chen",
    location: "Orleans",
    rating: 5,
    text: "Professional service from start to finish. The team helped us maximize our space and the barn doors are absolutely stunning.",
    date: "September 2024",
    project: "Custom Barn Doors"
  },
  {
    id: "3",
    name: "Jennifer Martinez",
    location: "Barrhaven",
    rating: 5,
    text: "Best investment we made in our home. The attention to detail and craftsmanship is unmatched. Highly recommend!",
    date: "August 2024",
    project: "Pantry Organization"
  }
]

export default function HomePage() {
  // Generate LocalBusiness schema for homepage
  const localBusinessSchema = generateLocalBusinessSchema()

  return (
    <StandardLayout>
      {/* LocalBusiness Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Elevated Hero Section - Apple-inspired design with 3D effects */}
      <ElevatedHero
        videoUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Renin%20Closet%20Doors%20Overview-kpsJMjKcOGc9Rg5Zv39EVupOi0Gv1i.mp4"
        fallbackImage="/images/elegant-barn-door-closet.png"
      />

      {/* Trust Bar - Above the Fold Trust Elements */}
      <TrustBar />

      {/* Urgency Banner - Limited Time Offer */}
      <Section className="bg-gradient-to-r from-red-600 to-orange-600 py-3 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-white animate-pulse" />
              <span className="text-white font-bold text-sm sm:text-base">LIMITED TIME:</span>
            </div>
            <span className="text-white text-sm sm:text-base">Save up to 25% on Premium Closet Collections - Ends Soon!</span>
            <Link href="/instant-estimate">
              <Button
                size="sm"
                className="bg-white text-red-600 hover:bg-gray-100 font-bold text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
                onClick={() => trackCTAClick({ location: 'urgency-banner', label: 'Get Quote' })}
              >
                Get Quote Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </Section>

      {/* As Seen In - Media Mentions */}
      <Section variant="light" className="bg-gray-50 py-8 xs:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 xs:mb-12"
          >
            <Heading level={3} className="text-xl xs:text-2xl text-gray-600 mb-2">AS FEATURED IN</Heading>
            <Text className="text-sm xs:text-base text-gray-500">Trusted by Ottawa's leading publications</Text>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-8 xs:gap-12 opacity-60">
            {[
              { name: "Ottawa Citizen", width: 140 },
              { name: "Home & Design", width: 120 },
              { name: "Renovation Magazine", width: 150 },
              { name: "Ottawa Business Journal", width: 130 },
              { name: "CTV Ottawa", width: 100 }
            ].map((publication, index) => (
              <motion.div
                key={publication.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.6, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                className="transition-all duration-300"
              >
                <div
                  className="bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 font-semibold text-xs xs:text-sm px-4 py-2"
                  style={{ width: `${publication.width}px` }}
                >
                  {publication.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Featured Section - Replacing OnceUI with Tailwind */}
      <Section variant="light" spacing="xl">
        <div className="flex flex-col items-center gap-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Heading level={2} className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl text-black mb-4">
              Crafted for Ottawa
            </Heading>
            <Text size="lg" className="text-base xs:text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
              Premium closet solutions designed to elevate your home
            </Text>
          </motion.div>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 xs:gap-6 w-full">
            {[
              {
                title: "Premium Quality",
                description: "Official Renin dealer with lifetime warranty",
                icon: Award,
                color: "text-purple-600",
                cta: "View Collections",
                href: "/products"
              },
              {
                title: "Expert Installation",
                description: "Professional installation by Ottawa-based specialists",
                icon: Check,
                color: "text-green-600",
                cta: "Book Consultation",
                href: "/book-measure"
              },
              {
                title: "Lifetime Warranty",
                description: "Complete peace of mind with comprehensive coverage",
                icon: Shield,
                color: "text-blue-600",
                cta: "Learn More",
                href: "/warranty"
              },
              {
                title: "Fast Turnaround",
                description: "Most projects completed within 2-3 weeks",
                icon: Clock,
                color: "text-orange-600",
                cta: "Get Timeline",
                href: "/instant-estimate"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-col items-center gap-3 xs:gap-4 p-4 xs:p-6 border border-gray-300 rounded-apple-lg text-center hover:border-black/30 hover:shadow-apple-md transition-all duration-500 group h-full bg-white relative overflow-hidden">
                    {/* Subtle background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className={`${feature.color} mb-2 group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                      <IconComponent className="h-8 w-8 xs:h-10 xs:w-10" />
                    </div>
                    <Heading level={3} className="text-lg xs:text-xl text-black mb-2 relative z-10">{feature.title}</Heading>
                    <Text className="text-sm xs:text-base text-black/70 mb-4 relative z-10">{feature.description}</Text>

                    {/* CTA Button */}
                    <Link
                      href={feature.href}
                      className="relative z-10"
                      onClick={() => trackCTAClick({ location: 'feature-card', label: feature.title })}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 hover:border-purple-600 hover:bg-purple-600 hover:text-white text-gray-700 text-xs xs:text-sm px-3 xs:px-4 py-1 xs:py-2 group-hover:border-purple-600 transition-all duration-300"
                      >
                        {feature.cta}
                        <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Category Tiles - Shop by Door Type */}
      <CategoryTiles />

      {/* Enhanced Testimonials Section */}
      <Section variant="light" spacing="xl" className="bg-gradient-bg-light relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-center mb-8 xs:mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <Heading level={2} className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl text-black mb-4">
              Loved by 500+ Ottawa Homeowners
            </Heading>
            <Text size="lg" className="text-base xs:text-lg md:text-xl text-black/70 max-w-2xl mx-auto mb-6">
              Join hundreds of satisfied Ottawa homeowners who transformed their spaces
            </Text>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-4 xs:gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Verified Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>BBB A+ Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Award Winning</span>
              </div>
            </div>
          </motion.div>

          <TestimonialsCarousel testimonials={testimonials} />

          {/* CTA after testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12 xs:mt-16"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 xs:p-8 max-w-2xl mx-auto border border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="w-6 h-6 text-purple-600" />
                <Text className="text-lg font-semibold text-gray-900">Join Our Satisfied Clients Today!</Text>
              </div>
              <Text className="text-gray-600 mb-6">Get your free, no-obligation consultation and $250 off your first project.</Text>
              <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 justify-center">
                <Link href="/instant-estimate">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 min-w-[200px] xs:min-w-[240px]"
                    onClick={() => trackCTAClick({ location: 'testimonials-cta', label: 'Get Free Quote' })}
                  >
                    Get Free Quote
                  </Button>
                </Link>
                <a href={getPhoneHref()}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 hover:border-purple-600 hover:bg-purple-600 hover:text-white min-w-[200px] xs:min-w-[240px]"
                    onClick={() => trackCTAClick({ location: 'testimonials-cta', label: 'Call Us' })}
                  >
                    <Phone className="mr-2 w-4 h-4" />
                    Call {getPhoneDisplay()}
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Why Choose PG Closets */}
      <WhyPGSection />

      {/* Featured Ottawa Projects */}
      <FeaturedProjects />

      {/* Stats Section - Social Proof */}
      <Section variant="light" spacing="lg" className="bg-apple-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "500+", label: "Happy Clients" },
            { number: "1000+", label: "Projects Completed" },
            { number: "15+", label: "Years Experience" },
            { number: "5★", label: "Average Rating" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl md:text-6xl font-bold text-apple-blue-500 mb-2">
                {stat.number}
              </div>
              <div className="text-apple-gray-600 text-lg">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Full-Width Image Section with Parallax */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/before-after-closet-transformation.png"
            alt="PG Closets Lifestyle"
            fill
            className="object-cover"
            quality={90}
            sizes="100vw"
            priority={false}
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-overlay-dark" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="relative z-10 h-full flex items-center justify-center text-center px-6"
        >
          <div className="max-w-3xl">
            <Heading level={2} className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Designed to Inspire
            </Heading>
            <Text size="lg" className="text-lg md:text-xl text-white/90 mb-8">
              Every detail considered, every space transformed
            </Text>
            <Link href="/products">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-black border-2 border-white hover:bg-transparent hover:text-white group"
                onClick={() => trackCTAClick({ location: 'mid-page-image', label: 'View Our Work' })}
              >
                <span className="relative z-10">View Our Work</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Conversion-Optimized CTA Section */}
      <ConversionCTA />

      {/* Enhanced Final CTA Section - Premium Black with Urgency */}
      <Section variant="dark" spacing="xl" className="bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Urgency badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-full"
            >
              <Zap className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">LIMITED TIME: 25% OFF + FREE INSTALLATION</span>
            </motion.div>

            <Heading level={2} className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 xs:mb-6">
              Transform Your Home Today
            </Heading>
            <Text size="lg" className="text-base xs:text-lg md:text-xl text-white/80 mb-8 xs:mb-12 max-w-3xl mx-auto">
              Join 500+ satisfied Ottawa homeowners who chose premium quality.
              <span className="block text-white font-semibold mt-2">Free consultation • No obligation • Limited time offer</span>
            </Text>

            <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 justify-center mb-8">
              <Link href="/instant-estimate" aria-label="Get an instant closet estimate">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 hover:from-purple-700 hover:to-blue-700 min-w-[200px] xs:min-w-[240px] min-h-[44px] xs:min-h-[48px] group text-sm xs:text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => trackCTAClick({ location: 'footer-cta', label: 'Get Instant Estimate' })}
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    <span className="text-xs xs:text-sm">Get Instant</span>
                    <span className="text-sm xs:text-base font-bold">Estimate</span>
                    <ArrowRight className="h-4 w-4 xs:h-5 xs:w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <a href={getPhoneHref()} aria-label="Call PG Closets for a free consultation">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-transparent text-white border-2 border-white/60 hover:bg-white hover:text-black min-w-[200px] xs:min-w-[240px] min-h-[44px] xs:min-h-[48px] text-sm xs:text-base hover:scale-105 transition-transform duration-300"
                  onClick={() => trackCTAClick({ location: 'footer-cta', label: 'Call Now' })}
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    <Phone className="w-4 h-4 xs:w-5 xs:h-5" />
                    <span>Call {getPhoneDisplay()}</span>
                  </span>
                </Button>
              </a>
            </div>

            {/* Final trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 xs:gap-8 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Lifetime Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-blue-500" />
                <span>2-3 Week Installation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Floating Contact Button - Mobile */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <a
          href={getPhoneHref()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
          onClick={() => trackCTAClick({ location: 'floating-contact', label: 'Call' })}
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>

    </StandardLayout>
  )
}
