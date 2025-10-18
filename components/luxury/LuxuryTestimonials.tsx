'use client'

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { TestimonialCard } from "@/components/ui/luxury-card"

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  text: string
  image?: string
  project?: string
  date?: string
}

interface LuxuryTestimonialsProps {
  testimonials?: Testimonial[]
  title?: string
  subtitle?: string
  className?: string
  autoRotate?: boolean
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    location: "Kanata, Ottawa",
    rating: 5,
    text: "The transformation of our master closet exceeded every expectation. The attention to detail and craftsmanship is absolutely exceptional. PG Closets turned our vision into reality with such professionalism.",
    project: "Master Bedroom Renovation",
    date: "September 2024"
  },
  {
    id: "2",
    name: "Michael Chen",
    location: "Westboro, Ottawa",
    rating: 5,
    text: "From consultation to installation, the entire experience was seamless. The quality of materials and precision of work truly reflects their commitment to excellence. Highly recommended.",
    project: "Home Office Closet",
    date: "August 2024"
  },
  {
    id: "3",
    name: "Jennifer Walsh",
    location: "Nepean, Ottawa",
    rating: 5,
    text: "Working with PG Closets was a pleasure from start to finish. Their design expertise and installation quality is unmatched. Our new closet doors are absolutely stunning.",
    project: "Walk-in Closet Design",
    date: "July 2024"
  },
  {
    id: "4",
    name: "Robert Thompson",
    location: "Orleans, Ottawa",
    rating: 5,
    text: "The team's professionalism and attention to detail is remarkable. They delivered exactly what they promised, on time and within budget. Could not be happier with the results.",
    project: "Guest Room Makeover",
    date: "June 2024"
  }
]

export function LuxuryTestimonials({
  testimonials = defaultTestimonials,
  title = "What Our Clients Say",
  subtitle = "Discover why Ottawa homeowners trust us with their most important spaces",
  className,
  autoRotate = true
}: LuxuryTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (!autoRotate) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [testimonials.length, autoRotate])

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <section className={`py-20 luxury-cta-section text-white relative overflow-hidden ${className || ''}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="luxury-divider w-24 mx-auto mb-8 bg-amber-400" />
          <h2 className={`heading-luxury-premium text-white mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {title}
          </h2>
          <p className={`text-luxury-lead text-slate-300 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {subtitle}
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="mb-12">
          <div className="relative h-96 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentIndex
                    ? 'opacity-100 translate-x-0'
                    : index < currentIndex
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-0 translate-x-full'
                }`}
              >
                <TestimonialCard className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
                  <div className="text-center">
                    {/* Quote */}
                    <div className="mb-8">
                      <p className="text-luxury-quote text-white mb-6 italic">
                        "{testimonial.text}"
                      </p>
                      <div className="flex justify-center mb-4">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center justify-center space-x-4">
                      {testimonial.image && (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="text-left">
                        <div className="font-medium text-white text-lg">{testimonial.name}</div>
                        <div className="text-slate-300 text-sm">{testimonial.location}</div>
                        {testimonial.project && (
                          <div className="text-amber-400 text-xs uppercase tracking-wide">
                            {testimonial.project}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TestimonialCard>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-amber-400 scale-110'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="luxury-fade-in">
            <div className="text-4xl font-light text-amber-400 mb-2">500+</div>
            <div className="text-luxury-caps text-slate-300">Happy Clients</div>
          </div>
          <div className="luxury-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="text-4xl font-light text-amber-400 mb-2">4.9★</div>
            <div className="text-luxury-caps text-slate-300">Average Rating</div>
          </div>
          <div className="luxury-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="text-4xl font-light text-amber-400 mb-2">15+</div>
            <div className="text-luxury-caps text-slate-300">Years Experience</div>
          </div>
          <div className="luxury-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="text-4xl font-light text-amber-400 mb-2">100%</div>
            <div className="text-luxury-caps text-slate-300">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Compact testimonial component for sidebars or smaller spaces
export function CompactTestimonial({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-amber-100">
      <div className="flex items-start space-x-4">
        {testimonial.image && (
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex mb-2">
            {Array.from({ length: testimonial.rating }, (_, i) => (
              <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-slate-600 mb-3 italic">"{testimonial.text}"</p>
          <div className="text-sm">
            <div className="font-medium text-slate-900">{testimonial.name}</div>
            <div className="text-slate-500">{testimonial.location}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LuxuryTestimonials