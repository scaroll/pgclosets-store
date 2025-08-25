'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, ThumbsUp, Calendar } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  productFeatures?: string[];
}

interface ReviewsData {
  average: number;
  count: number;
  distribution: Record<number, number>;
  items: Review[];
}

// Mock hook for reviews data
function useReviews(productId: string): ReviewsData {
  return {
    average: 4.8,
    count: 127,
    distribution: {
      5: 78,
      4: 15,
      3: 4,
      2: 2,
      1: 1
    },
    items: [
      {
        id: '1',
        author: 'Sarah M.',
        rating: 5,
        title: 'Absolutely beautiful doors, perfect fit!',
        content: 'The quality exceeded my expectations. The installation team was professional and the doors fit perfectly. The oak finish matches our home perfectly.',
        date: '2024-08-15',
        verified: true,
        helpful: 23,
        productFeatures: ['Quality', 'Installation', 'Finish']
      },
      {
        id: '2',
        author: 'Mike R.',
        rating: 5,
        title: 'Great value and service',
        content: 'From quote to installation, everything was smooth. The price was competitive and the result looks amazing. Highly recommend PG Closets.',
        date: '2024-08-10',
        verified: true,
        helpful: 18,
        productFeatures: ['Value', 'Service']
      },
      {
        id: '3',
        author: 'Jennifer K.',
        rating: 4,
        title: 'Very pleased with the outcome',
        content: 'The doors look great and the installation was done well. Only minor issue was delivery took slightly longer than expected, but worth the wait.',
        date: '2024-08-05',
        verified: true,
        helpful: 12,
        productFeatures: ['Quality', 'Installation']
      }
    ]
  };
}

function StarRating({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star 
          key={star}
          className={`${sizeClasses[size]} ${
            star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const isLongContent = review.content.length > 200;

  return (
    <div className="review-card bg-white rounded-lg p-6 border border-gray-100 hover:border-sky-200 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-navy-600">{review.author}</span>
            {review.verified && (
              <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Verified Purchase
              </span>
            )}
          </div>
          <StarRating value={review.rating} size="sm" />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          {new Date(review.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      <h4 className="font-medium text-navy-700 mb-2">{review.title}</h4>
      
      <p className="text-gray-700 text-sm leading-relaxed mb-3">
        {isLongContent && !showFullContent 
          ? `${review.content.substring(0, 200)}...`
          : review.content
        }
        {isLongContent && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-sky-500 hover:text-sky-600 ml-1 font-medium"
          >
            {showFullContent ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>
      
      {review.productFeatures && (
        <div className="flex flex-wrap gap-2 mb-3">
          {review.productFeatures.map(feature => (
            <span 
              key={feature}
              className="text-xs bg-sky-50 text-sky-700 px-2 py-1 rounded-full border border-sky-200"
            >
              {feature}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-navy-600 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          Helpful ({review.helpful})
        </button>
        <span className="text-xs text-gray-500">
          Was this review helpful?
        </span>
      </div>
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const reviews = useReviews(productId);
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'helpful'>('newest');

  return (
    <section className="reviews-section bg-gray-50 rounded-lg p-8 mt-12">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AggregateRating",
            "ratingValue": reviews.average,
            "reviewCount": reviews.count,
            "bestRating": "5",
            "worstRating": "1"
          })
        }}
      />
      
      <div className="reviews-summary mb-8">
        <h2 className="text-2xl font-light text-navy-700 mb-6">
          What Our Customers Say
        </h2>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="rating-summary bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
            <div className="text-4xl font-light text-navy-600 mb-2">
              {reviews.average}
            </div>
            <StarRating value={reviews.average} />
            <p className="text-sm text-gray-600 mt-2">
              Based on {reviews.count} verified reviews
            </p>
          </div>
          
          <div className="rating-distribution flex-1 w-full">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-600 w-3">{rating}</span>
                <Star className="w-4 h-4 text-sky-500" />
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-400 to-sky-500"
                    style={{ width: `${reviews.distribution[rating]}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-10 text-right">
                  {reviews.distribution[rating]}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="reviews-controls mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-navy-600">Sort by:</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
            <option value="newest">Most Recent</option>
            <option value="rating">Highest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>
      
      <div className="reviews-list space-y-6">
        {reviews.items.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      
      <div className="text-center mt-8">
        <button className="px-6 py-3 bg-white text-navy-600 border-2 border-sky-500 rounded-lg hover:bg-sky-50 transition-colors font-medium">
          Load More Reviews
        </button>
      </div>
    </section>
  );
}