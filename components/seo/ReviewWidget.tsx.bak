/**
 * AGENT 16: Local SEO Specialist - Review Widget Component
 * Displays Google reviews with schema markup for local SEO
 */

'use client'

import React from 'react'
import { Star, Quote, ExternalLink, ThumbsUp } from 'lucide-react'

export interface Review {
  id: string
  author: string
  authorImage?: string
  rating: number
  date: string
  text: string
  source: 'Google' | 'Yelp' | 'Facebook' | 'Houzz'
  verified?: boolean
  helpful?: number
  response?: {
    text: string
    date: string
  }
}

interface ReviewWidgetProps {
  reviews?: Review[]
  averageRating?: number
  totalReviews?: number
  showSourceLinks?: boolean
  maxReviews?: number
  variant?: 'compact' | 'detailed' | 'carousel'
  location?: string
}

// Sample reviews - replace with actual API data
const DEFAULT_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Sarah M.',
    rating: 5,
    date: '2024-01-15',
    text: 'Excellent service from PG Closets! Professional installation of our Renin barn doors and the quality is outstanding. The team was punctual, clean, and respectful of our home. Highly recommend for anyone in Ottawa looking for custom closet solutions.',
    source: 'Google',
    verified: true,
    helpful: 12
  },
  {
    id: '2',
    author: 'Mike T.',
    rating: 5,
    date: '2024-02-03',
    text: 'Perfect installation in our new build. The team worked seamlessly with our builder\'s schedule. Very professional and the Renin doors look amazing!',
    source: 'Google',
    verified: true,
    helpful: 8,
    response: {
      text: 'Thank you Mike! We appreciate your business and are thrilled you love your new doors. Enjoy your beautiful new home!',
      date: '2024-02-04'
    }
  },
  {
    id: '3',
    author: 'Jennifer L.',
    rating: 5,
    date: '2024-01-28',
    text: 'Our family of five finally has an organized home! The pantry makeover changed our mornings and the mudroom is a game-changer. Worth every penny.',
    source: 'Google',
    verified: true,
    helpful: 15
  },
  {
    id: '4',
    author: 'Marc D.',
    rating: 5,
    date: '2024-02-10',
    text: 'Service bilingue exceptionnel. Installation professionnelle de nos portes de placard Renin. Highly recommended for French-speaking customers in Orleans!',
    source: 'Google',
    verified: true,
    helpful: 6
  },
  {
    id: '5',
    author: 'Robert & Nancy K.',
    rating: 5,
    date: '2024-01-20',
    text: 'Renovated our 40-year-old home with beautiful modern closet systems. The team understood the challenges of working with older construction and delivered excellent results. Craftsmanship is top-notch!',
    source: 'Google',
    verified: true,
    helpful: 10
  }
]

export default function ReviewWidget({
  reviews = DEFAULT_REVIEWS,
  averageRating = 4.9,
  totalReviews = 127,
  showSourceLinks = true,
  maxReviews = 5,
  variant = 'detailed',
  location
}: ReviewWidgetProps) {
  const displayReviews = reviews.slice(0, maxReviews)

  // Generate star display
  const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-4xl font-bold text-gray-900">{averageRating}</span>
              <div>
                <StarRating rating={Math.round(averageRating)} size="md" />
                <p className="text-sm text-gray-600 mt-1">{totalReviews} reviews</p>
              </div>
            </div>
          </div>
          {showSourceLinks && (
            <a
              href="https://www.google.com/search?q=PG+Closets+Ottawa+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View all reviews
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="space-y-3">
          {displayReviews.slice(0, 3).map((review) => (
            <div key={review.id} className="border-l-2 border-gray-200 pl-3">
              <div className="flex items-center justify-between mb-1">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-gray-500">{review.author}</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Detailed variant (default)
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Customer Reviews {location && `- ${location}`}
            </h3>
            <div className="flex items-center gap-3">
              <StarRating rating={Math.round(averageRating)} size="lg" />
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {averageRating} out of 5
                </p>
                <p className="text-sm text-gray-600">
                  Based on {totalReviews} reviews
                </p>
              </div>
            </div>
          </div>
          {showSourceLinks && (
            <div className="flex flex-col gap-2">
              <a
                href="https://www.google.com/search?q=PG+Closets+Ottawa+reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Write a Review
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://www.google.com/search?q=PG+Closets+Ottawa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 text-center"
              >
                View all reviews
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="divide-y divide-gray-200">
        {displayReviews.map((review) => (
          <div key={review.id} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {review.authorImage ? (
                  <img
                    src={review.authorImage}
                    alt={review.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {review.author.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{review.author}</p>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <img
                  src={`/icons/${review.source.toLowerCase()}.png`}
                  alt={review.source}
                  className="w-5 h-5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span className="text-xs text-gray-500">{review.source}</span>
              </div>
            </div>

            <div className="relative">
              <Quote className="absolute -top-2 -left-1 w-8 h-8 text-gray-200" />
              <p className="text-gray-700 leading-relaxed pl-6">{review.text}</p>
            </div>

            {/* Business Response */}
            {review.response && (
              <div className="mt-4 ml-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Response from PG Closets
                </p>
                <p className="text-sm text-gray-700 mb-2">{review.response.text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(review.response.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Helpful button */}
            {review.helpful !== undefined && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      {showSourceLinks && (
        <div className="p-6 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-gray-700 mb-3">
            Had a great experience? Share your story with other Ottawa homeowners!
          </p>
          <a
            href="https://www.google.com/search?q=PG+Closets+Ottawa+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Leave a Review
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      )}

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AggregateRating',
            itemReviewed: {
              '@type': 'LocalBusiness',
              name: 'PG Closets',
              address: location || 'Ottawa, ON'
            },
            ratingValue: averageRating.toString(),
            reviewCount: totalReviews.toString(),
            bestRating: '5',
            worstRating: '1'
          })
        }}
      />
    </div>
  )
}
