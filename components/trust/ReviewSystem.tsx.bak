'use client'

"use client"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown, Filter, CheckCircle, MapPin, Calendar } from "lucide-react"

interface Review {
  id: string
  name: string
  location: string
  rating: number
  title: string
  review: string
  date: string
  verified: boolean
  helpful: number
  project: string
  images?: string[]
  response?: {
    text: string
    date: string
    author: string
  }
}

interface ReviewSystemProps {
  productSlug?: string
  showFilters?: boolean
  showWriteReview?: boolean
  showImages?: boolean
  className?: string
}

export default function ReviewSystem({
  productSlug,
  showFilters = true,
  showWriteReview = true,
  showImages = true,
  className = ""
}: ReviewSystemProps) {

  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showWriteForm, setShowWriteForm] = useState(false)

  // Sample reviews data - in production this would come from API
  const reviews: Review[] = [
    {
      id: "1",
      name: "Sarah Mitchell",
      location: "Kanata, ON",
      rating: 5,
      title: "Absolutely stunning transformation!",
      review: "The PG Closets team exceeded all our expectations. From the initial consultation to the final installation, everything was professional and seamless. The quality of the doors is exceptional and they've completely transformed our master bedroom. The sliding mechanism is smooth and quiet, and the finish is perfect. Highly recommend for anyone looking for premium closet solutions.",
      date: "2024-01-15",
      verified: true,
      helpful: 12,
      project: "Master Bedroom Closet Doors",
      images: ["/reviews/sarah-1.jpg", "/reviews/sarah-2.jpg"],
      response: {
        text: "Thank you so much for the wonderful review, Sarah! We're thrilled that you love your new closet doors. Your satisfaction is our top priority and we appreciate you taking the time to share your experience.",
        date: "2024-01-16",
        author: "PG Closets Team"
      }
    },
    {
      id: "2",
      name: "Michael Thompson",
      location: "Nepean, ON",
      rating: 5,
      title: "Professional service from start to finish",
      review: "Outstanding experience with PG Closets. The consultation was thorough, the quote was fair, and the installation was flawless. The team was respectful of our home and cleaned up perfectly. The doors function beautifully and look amazing. Worth every penny for the quality and service.",
      date: "2024-01-10",
      verified: true,
      helpful: 8,
      project: "Living Room Sliding Doors",
      images: ["/reviews/michael-1.jpg"]
    },
    {
      id: "3",
      name: "Jennifer Lee",
      location: "Orleans, ON",
      rating: 5,
      title: "Love our new closet doors!",
      review: "We couldn't be happier with our new closet doors. The team was professional, clean, and delivered exactly what was promised. The transformation is incredible - our guest bedroom looks so much more elegant now. The lifetime warranty gives us complete peace of mind.",
      date: "2024-01-05",
      verified: true,
      helpful: 6,
      project: "Guest Bedroom Makeover"
    },
    {
      id: "4",
      name: "David Clarke",
      location: "Barrhaven, ON",
      rating: 5,
      title: "Exceptional quality and service",
      review: "From consultation to installation, everything was perfect. The doors are gorgeous and the installation was completed faster than expected. The team's attention to detail is impressive and the final result exceeded our expectations. Highly recommend PG Closets!",
      date: "2024-01-02",
      verified: true,
      helpful: 4,
      project: "Home Office Renovation"
    },
    {
      id: "5",
      name: "Lisa Rodriguez",
      location: "Stittsville, ON",
      rating: 4,
      title: "Great experience overall",
      review: "Very pleased with our new closet doors. The installation was professional and the quality is excellent. The only minor issue was a slight delay in scheduling, but the team communicated well and the final result was worth the wait. Would definitely use PG Closets again.",
      date: "2023-12-28",
      verified: true,
      helpful: 3,
      project: "Master Closet Renovation"
    }
  ]

  const ratingDistribution = {
    5: 85,
    4: 12,
    3: 2,
    2: 1,
    1: 0
  }

  const averageRating = 4.8
  const totalReviews = reviews.length

  const filteredReviews = reviews.filter(review => {
    if (filter === "all") return true
    if (filter === "5") return review.rating === 5
    if (filter === "4") return review.rating === 4
    if (filter === "3") return review.rating === 3
    if (filter === "verified") return review.verified
    if (filter === "images") return review.images && review.images.length > 0
    return true
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime()
    if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime()
    if (sortBy === "highest") return b.rating - a.rating
    if (sortBy === "lowest") return a.rating - b.rating
    if (sortBy === "helpful") return b.helpful - a.helpful
    return 0
  })

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5"
    }

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <section className={`py-12 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4">

        {/* Rating Summary */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Overall Rating */}
            <div className="flex-1">
              <div className="text-center md:text-left">
                <div className="text-5xl font-light text-slate-900 mb-2">{averageRating}</div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  {renderStars(Math.round(averageRating), "lg")}
                </div>
                <div className="text-slate-600">Based on {totalReviews} verified reviews</div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="flex-2">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Rating Breakdown</h3>
              {Object.entries(ratingDistribution)
                .reverse()
                .map(([rating, percentage]) => (
                  <div key={rating} className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-12">{percentage}%</span>
                  </div>
                ))}
            </div>

            {/* Write Review Button */}
            {showWriteReview && (
              <div className="flex-1">
                <button
                  onClick={() => setShowWriteForm(true)}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Write a Review
                </button>
                <div className="text-center mt-2">
                  <span className="text-xs text-slate-500">Share your experience</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filter:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Reviews" },
                { key: "5", label: "5 Stars" },
                { key: "4", label: "4 Stars" },
                { key: "verified", label: "Verified" },
                { key: "images", label: "With Photos" }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filter === option.key
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-slate-300 rounded px-2 py-1"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedReviews.map((review) => (
            <div key={review.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-slate-700">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{review.name}</span>
                      {review.verified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {review.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{review.title}</h4>
                <p className="text-slate-700 leading-relaxed">{review.review}</p>
              </div>

              {/* Project Tag */}
              {review.project && (
                <div className="mb-4">
                  <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {review.project}
                  </span>
                </div>
              )}

              {/* Review Images */}
              {showImages && review.images && review.images.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {review.images.map((image, index) => (
                      <div key={index} className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                          Photo {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Response */}
              {review.response && (
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">PG</span>
                    </div>
                    <span className="font-semibold text-slate-900">{review.response.author}</span>
                    <span className="text-sm text-slate-500">
                      • {new Date(review.response.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm">{review.response.text}</p>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpful})
                </button>
                <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                  Not Helpful
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors">
            Load More Reviews
          </button>
        </div>

        {/* Write Review Modal */}
        {showWriteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900">Write a Review</h3>
                  <button
                    onClick={() => setShowWriteForm(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Overall Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="p-1"
                        >
                          <Star className="w-6 h-6 text-gray-300 hover:text-yellow-400 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Review Title
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      placeholder="Summarize your experience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 h-32"
                      placeholder="Share your experience with PG Closets..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="First and last name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="City, Province"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <div className="text-xs text-slate-500">
                      By submitting, you agree to our review guidelines
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowWriteForm(false)}
                        className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export { ReviewSystem }