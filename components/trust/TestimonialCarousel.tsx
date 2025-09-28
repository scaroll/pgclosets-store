"use client"

import { useState, useEffect } from "react"
import { Star, Quote, ChevronLeft, ChevronRight, MapPin, Calendar, CheckCircle } from "lucide-react"
import Image from "next/image"

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  review: string
  date: string
  image?: string
  verified: boolean
  project: string
  beforeImage?: string
  afterImage?: string
}

interface TestimonialCarouselProps {
  variant?: "standard" | "featured" | "compact" | "video"
  autoPlay?: boolean
  showNavigation?: boolean
  showBeforeAfter?: boolean
  className?: string
}

export default function TestimonialCarousel({
  variant = "standard",
  autoPlay = true,
  showNavigation = true,
  showBeforeAfter = false,
  className = ""
}: TestimonialCarouselProps) {

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  // Enhanced testimonials with more detail
  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Sarah Mitchell",
      location: "Kanata, ON",
      rating: 5,
      review: "Absolutely stunning work! The PG Closets team transformed our master bedroom with beautiful sliding doors. The consultation was thorough, the installation was flawless, and the quality exceeded our expectations. Professional, on-time, and exceptional craftsmanship. Highly recommend!",
      date: "2 weeks ago",
      image: "/testimonials/sarah.jpg",
      verified: true,
      project: "Master Bedroom Closet Doors",
      beforeImage: "/gallery/before-1.jpg",
      afterImage: "/gallery/after-1.jpg"
    },
    {
      id: "2",
      name: "Michael Thompson",
      location: "Nepean, ON",
      rating: 5,
      review: "From consultation to installation, everything was perfect. The doors are gorgeous and the installation was flawless. The team was professional, respectful of our home, and cleaned up perfectly. Worth every penny for the quality and service we received.",
      date: "1 month ago",
      verified: true,
      project: "Living Room Sliding Doors",
      beforeImage: "/gallery/before-2.jpg",
      afterImage: "/gallery/after-2.jpg"
    },
    {
      id: "3",
      name: "Jennifer Lee",
      location: "Orleans, ON",
      rating: 5,
      review: "We couldn't be happier with our new closet doors. The team was professional, clean, and delivered exactly what was promised. The transformation is incredible - our home looks amazing now! The lifetime warranty gives us complete peace of mind.",
      date: "3 weeks ago",
      verified: true,
      project: "Guest Bedroom Makeover",
      beforeImage: "/gallery/before-3.jpg",
      afterImage: "/gallery/after-3.jpg"
    },
    {
      id: "4",
      name: "David Clarke",
      location: "Barrhaven, ON",
      rating: 5,
      review: "Exceptional service from start to finish. The consultation was thorough and the installation was quick and professional. These doors have completely transformed our space. The quality is outstanding and the team's attention to detail is impressive.",
      date: "1 week ago",
      verified: true,
      project: "Home Office Renovation",
      beforeImage: "/gallery/before-4.jpg",
      afterImage: "/gallery/after-4.jpg"
    },
    {
      id: "5",
      name: "Lisa Rodriguez",
      location: "Stittsville, ON",
      rating: 5,
      review: "Amazing experience! The PG Closets team was professional, punctual, and incredibly skilled. Our new closet doors are beautiful and function perfectly. The installation was completed faster than expected with no mess left behind.",
      date: "2 months ago",
      verified: true,
      project: "Master Closet Renovation",
      beforeImage: "/gallery/before-5.jpg",
      afterImage: "/gallery/after-5.jpg"
    },
    {
      id: "6",
      name: "Robert Chen",
      location: "Gloucester, ON",
      rating: 5,
      review: "Outstanding quality and service! The team's expertise shows in every detail. Our new sliding doors are not only beautiful but also incredibly functional. The whole process was smooth and stress-free. Highly recommended for anyone looking for premium closet solutions.",
      date: "3 months ago",
      verified: true,
      project: "Walk-in Closet Upgrade",
      beforeImage: "/gallery/before-6.jpg",
      afterImage: "/gallery/after-6.jpg"
    }
  ]

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isPlaying, testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsPlaying(false)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`relative bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {renderStars(5)}
            <span className="text-lg font-semibold text-slate-900">5.0 Stars</span>
          </div>
          <blockquote className="text-lg text-slate-700 mb-4 italic">
            "{testimonials[currentIndex].review.slice(0, 120)}..."
          </blockquote>
          <div className="flex items-center justify-center gap-2">
            <span className="font-semibold text-slate-900">{testimonials[currentIndex].name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-600">{testimonials[currentIndex].location}</span>
            {testimonials[currentIndex].verified && (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </div>
        </div>

        {showNavigation && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-blue-600" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (variant === "featured") {
    const current = testimonials[currentIndex]
    return (
      <section className={`py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              {renderStars(5)}
              <span className="text-lg font-semibold">5.0 Stars from 500+ Reviews</span>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12">
              <Quote className="w-12 h-12 text-white/40 mb-6" />

              <blockquote className="text-xl md:text-2xl font-light leading-relaxed mb-8">
                "{current.review}"
              </blockquote>

              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold">
                    {current.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-lg">{current.name}</div>
                  <div className="text-white/80 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {current.location}
                  </div>
                  <div className="text-white/60 flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    {current.date}
                    {current.verified && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
                <div className="ml-auto hidden md:block">
                  <div className="text-right">
                    <div className="text-sm text-white/60 mb-1">Project</div>
                    <div className="font-medium">{current.project}</div>
                  </div>
                </div>
              </div>
            </div>

            {showNavigation && (
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Standard variant
  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-2">
            Customer Success Stories
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            {renderStars(5)}
            <span className="text-lg font-semibold text-slate-900">5.0 Stars</span>
            <span className="text-slate-600">• 500+ Reviews</span>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(currentIndex, currentIndex + 3).map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-slate-700">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                  </div>
                  {testimonial.verified && (
                    <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {renderStars(testimonial.rating)}
                  <span className="text-sm text-slate-600">{testimonial.date}</span>
                </div>

                <Quote className="w-6 h-6 text-slate-300 mb-2" />
                <p className="text-slate-700 text-sm leading-relaxed mb-3">
                  {testimonial.review}
                </p>

                {testimonial.project && (
                  <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full inline-block">
                    {testimonial.project}
                  </div>
                )}

                {showBeforeAfter && testimonial.beforeImage && testimonial.afterImage && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Before</div>
                      <div className="aspect-video bg-slate-100 rounded"></div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">After</div>
                      <div className="aspect-video bg-slate-100 rounded"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showNavigation && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * 3)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      Math.floor(currentIndex / 3) === index ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Read All 500+ Reviews →
          </button>
        </div>
      </div>
    </section>
  )
}

export { TestimonialCarousel }