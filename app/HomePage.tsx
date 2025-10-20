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
import { ArrowRight, Check, Shield, Award, Clock } from "lucide-react"
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
                description: "Official Renin dealer offering the finest materials and craftsmanship",
                icon: Award,
                color: "text-apple-blue-500"
              },
              {
                title: "Expert Installation",
                description: "Professional installation by certified specialists",
                icon: Check,
                color: "text-success-500"
              },
              {
                title: "Lifetime Warranty",
                description: "Complete peace of mind with our comprehensive warranty",
                icon: Shield,
                color: "text-woodgrain-500"
              },
              {
                title: "Fast Turnaround",
                description: "Most projects completed within 2-3 weeks",
                icon: Clock,
                color: "text-info-500"
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
                  <div className="flex flex-col items-center gap-3 xs:gap-4 p-4 xs:p-6 border border-gray-300 rounded-apple-lg text-center hover:border-black/30 hover:shadow-apple-md transition-all duration-500 group h-full bg-white">
                    <div className={`${feature.color} mb-2 group-hover:scale-110 transition-transform duration-500`}>
                      <IconComponent className="h-8 w-8 xs:h-10 xs:w-10" />
                    </div>
                    <Heading level={3} className="text-lg xs:text-xl text-black mb-2">{feature.title}</Heading>
                    <Text className="text-sm xs:text-base text-black/70">{feature.description}</Text>
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

      {/* Testimonials Section */}
      <Section variant="light" spacing="xl" className="bg-gradient-bg-light">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-center mb-8 xs:mb-12"
        >
          <Heading level={2} className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl text-black mb-4">
            What Our Clients Say
          </Heading>
          <Text size="lg" className="text-base xs:text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
            Join hundreds of satisfied Ottawa homeowners
          </Text>
        </motion.div>

        <TestimonialsCarousel testimonials={testimonials} />
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

      {/* Final CTA Section - Premium Black */}
      <Section variant="dark" spacing="xl" className="bg-gradient-to-b from-black to-apple-gray-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Heading level={2} className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 xs:mb-6">
            Start Your Project Today
          </Heading>
          <Text size="lg" className="text-base xs:text-lg md:text-xl text-white/80 mb-8 xs:mb-12 max-w-2xl mx-auto">
            Join 500+ satisfied Ottawa homeowners. Free quote, no obligation.
          </Text>
          <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 justify-center">
            <Link href="/instant-estimate" aria-label="Get an instant closet estimate">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-black border-2 border-white hover:bg-transparent hover:text-white min-w-[200px] xs:min-w-[240px] min-h-[44px] xs:min-h-[48px] group text-sm xs:text-base"
                onClick={() => trackCTAClick({ location: 'footer', label: 'Get Instant Estimate' })}
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
                className="bg-transparent text-white border-2 border-white/60 hover:bg-white hover:text-black min-w-[200px] xs:min-w-[240px] min-h-[44px] xs:min-h-[48px] text-sm xs:text-base"
                onClick={() => trackCTAClick({ location: 'footer', label: 'Call Now' })}
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  <span>Call {getPhoneDisplay()}</span>
                </span>
              </Button>
            </a>
          </div>
        </motion.div>
      </Section>

    </StandardLayout>
  )
}
