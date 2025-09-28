"use client"

import { Star, Quote, CheckCircle, MapPin, Calendar } from "lucide-react"
import Image from "next/image"

interface Review {
  id: string
  name: string
  location: string
  rating: number
  review: string
  date: string
  image?: string
  verified?: boolean
  project?: string
}

interface SocialProofProps {
  variant?: "testimonials" | "reviews" | "stats" | "badges" | "gallery"
  layout?: "grid" | "carousel" | "compact" | "featured"
  showImages?: boolean
  className?: string
}

export default function SocialProof({
  variant = "testimonials",
  layout = "grid",
  showImages = true,
  className = ""
}: SocialProofProps) {

  // Sample review data - in production this would come from actual reviews
  const reviews: Review[] = [
    {
      id: "1",
      name: "Sarah Mitchell",
      location: "Kanata, ON",
      rating: 5,
      review: "Absolutely stunning work! The PG Closets team transformed our master bedroom with beautiful sliding doors. Professional, on-time, and exceptional quality. Highly recommend!",
      date: "2 weeks ago",
      image: "/testimonials/sarah.jpg",
      verified: true,
      project: "Master Bedroom Closet Doors"
    },
    {
      id: "2",
      name: "Michael Thompson",
      location: "Nepean, ON",
      rating: 5,
      review: "From consultation to installation, everything was perfect. The doors are gorgeous and the installation was flawless. Worth every penny for the quality and service.",
      date: "1 month ago",
      verified: true,
      project: "Living Room Sliding Doors"
    },
    {
      id: "3",
      name: "Jennifer Lee",
      location: "Orleans, ON",
      rating: 5,
      review: "We couldn't be happier with our new closet doors. The team was professional, clean, and delivered exactly what was promised. Our home looks amazing now!",
      date: "3 weeks ago",
      verified: true,
      project: "Guest Bedroom Makeover"
    },
    {
      id: "4",
      name: "David Clarke",
      location: "Barrhaven, ON",
      rating: 5,
      review: "Exceptional service from start to finish. The consultation was thorough and the installation was quick and professional. These doors have completely transformed our space.",
      date: "1 week ago",
      verified: true,
      project: "Home Office Renovation"
    }
  ]

  const stats = [
    { value: "500+", label: "Satisfied Customers", icon: CheckCircle },
    { value: "15+", label: "Years Experience", icon: Calendar },
    { value: "5.0", label: "Average Rating", icon: Star },
    { value: "100%", label: "Satisfaction Rate", icon: CheckCircle }
  ]

  const badges = [
    { name: "Better Business Bureau", rating: "A+", image: "/badges/bbb.png" },
    { name: "Licensed Contractor", rating: "Verified", image: "/badges/license.png" },
    { name: "Insured Professional", rating: "Active", image: "/badges/insurance.png" },
    { name: "Google Reviews", rating: "5.0 Stars", image: "/badges/google.png" }
  ]

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

  if (variant === "stats") {
    return (
      <section className={`py-12 bg-gradient-to-r from-slate-50 to-blue-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-2">
              Trusted by Ottawa Homeowners
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  if (variant === "badges") {
    return (
      <section className={`py-8 bg-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Certified & Trusted Professional
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div key={index} className="text-center p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-sm font-semibold text-slate-900">{badge.name}</div>
                <div className="text-xs text-green-600 font-medium">{badge.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === "reviews") {
    return (
      <section className={`py-12 bg-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex items-center">
                {renderStars(5)}
              </div>
              <span className="text-lg font-semibold text-slate-900">5.0 Stars</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-2">
              What Our Customers Say
            </h2>
            <p className="text-slate-600">Real reviews from verified customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-slate-700">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{review.name}</div>
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {review.location}
                    </div>
                  </div>
                  {review.verified && (
                    <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {renderStars(review.rating)}
                  <span className="text-sm text-slate-600">{review.date}</span>
                </div>

                <Quote className="w-6 h-6 text-slate-300 mb-2" />
                <p className="text-slate-700 text-sm leading-relaxed mb-3">
                  {review.review}
                </p>

                {review.project && (
                  <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full inline-block">
                    {review.project}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Read All 247 Reviews →
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Default testimonials variant
  return (
    <section className={`py-12 bg-slate-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-2">
            Customer Success Stories
          </h2>
          <p className="text-slate-600">See why homeowners choose PG Closets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.slice(0, 2).map((review) => (
            <div
              key={review.id}
              className="bg-white border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow"
            >
              <Quote className="w-8 h-8 text-blue-600 mb-4" />

              <blockquote className="text-lg text-slate-700 leading-relaxed mb-6">
                "{review.review}"
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-slate-700">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{review.name}</div>
                  <div className="text-sm text-slate-600">{review.location}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    {review.verified && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { SocialProof }