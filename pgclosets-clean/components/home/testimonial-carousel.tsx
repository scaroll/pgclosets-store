'use client'

import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  comment: string
  project_type: string
  image_url?: string
  verified: boolean
  date: string
}

const TestimonialCarousel = () => {
  const [testimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'Sarah Thompson',
      location: 'Kanata, ON',
      rating: 5,
      comment: 'PG Closets transformed our master bedroom with beautiful barn doors. The installation was quick, professional, and the quality exceeded our expectations. Highly recommend!',
      project_type: 'Barn Doors',
      verified: true,
      date: '2024-01-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      location: 'Orleans, ON',
      rating: 5,
      comment: 'Outstanding service from start to finish. The team helped us choose the perfect bifold doors for our small condo. Great quality and the price was very competitive.',
      project_type: 'Bifold Doors',
      verified: true,
      date: '2024-02-03'
    },
    {
      id: '3',
      name: 'Jennifer Martinez',
      location: 'Barrhaven, ON',
      rating: 5,
      comment: 'We needed bypass doors for our walk-in closet and PG Closets delivered exactly what we wanted. Professional installation and beautiful results. Very happy customers!',
      project_type: 'Bypass Doors',
      verified: true,
      date: '2024-02-20'
    },
    {
      id: '4',
      name: 'David Wilson',
      location: 'Nepean, ON',
      rating: 5,
      comment: 'Excellent craftsmanship and attention to detail. The consultation was thorough and the final installation was flawless. Our home looks amazing with the new closet doors.',
      project_type: 'Custom Installation',
      verified: true,
      date: '2024-03-10'
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      location: 'Stittsville, ON',
      rating: 5,
      comment: 'From consultation to completion, PG Closets was professional and reliable. The doors are beautiful and have completely transformed our living space. Worth every penny!',
      project_type: 'Complete Home',
      verified: true,
      date: '2024-03-25'
    },
    {
      id: '6',
      name: 'Robert Johnson',
      location: 'Gloucester, ON',
      rating: 5,
      comment: 'Top-quality service and products. The team was knowledgeable, punctual, and left everything clean. Our new closet doors are exactly what we envisioned.',
      project_type: 'Closet Renovation',
      verified: true,
      date: '2024-04-08'
    }
  ])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 3))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 3))
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(testimonials.length / 3)) % Math.ceil(testimonials.length / 3))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long'
    })
  }

  const visibleTestimonials = testimonials.slice(currentIndex * 3, currentIndex * 3 + 3)

  return (
    <div className="relative">

      {/* Carousel Container */}
      <div
        className="overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="card-apple p-6 h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-pg-sky" />
              </div>

              {/* Comment */}
              <blockquote className="text-pg-gray mb-6 leading-relaxed">
                "{testimonial.comment}"
              </blockquote>

              {/* Author Info */}
              <div className="mt-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-pg-navy">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-pg-gray">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-pg-navy">{testimonial.project_type}</div>
                    <div className="text-xs text-pg-gray">{formatDate(testimonial.date)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center mt-8 space-x-4">

        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="w-10 h-10 bg-white border border-pg-border rounded-full flex items-center justify-center hover:bg-pg-offwhite transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2"
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="w-5 h-5 text-pg-gray" />
        </button>

        {/* Indicators */}
        <div className="flex space-x-2">
          {[...Array(Math.ceil(testimonials.length / 3))].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-pg-navy w-6'
                  : 'bg-pg-border hover:bg-pg-gray'
              }`}
              aria-label={`Go to testimonial group ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="w-10 h-10 bg-white border border-pg-border rounded-full flex items-center justify-center hover:bg-pg-offwhite transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2"
          aria-label="Next testimonials"
        >
          <ChevronRight className="w-5 h-5 text-pg-gray" />
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="text-center mt-8">
        <p className="text-sm text-pg-gray mb-2">
          ⭐ 5.0 average rating from {testimonials.length}+ verified customers
        </p>
        <div className="flex justify-center space-x-6 text-xs text-pg-gray">
          <span>✓ Google Reviews</span>
          <span>✓ Facebook Reviews</span>
          <span>✓ Better Business Bureau</span>
        </div>
      </div>
    </div>
  )
}

export default TestimonialCarousel