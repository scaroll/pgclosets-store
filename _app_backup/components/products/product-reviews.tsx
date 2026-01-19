'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Star, ThumbsUp, VerifiedIcon } from 'lucide-react'

interface Review {
  id: string
  userId: string
  user: {
    name?: string | null
    image?: string | null
  }
  rating: number
  title?: string | null
  comment?: string | null
  verified: boolean
  helpful: number
  createdAt: Date | string
}

interface ProductReviewsProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export function ProductReviews({ reviews, averageRating, totalReviews }: ProductReviewsProps) {
  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
        <div className="text-center">
          <div className="mb-2 text-5xl font-bold">{averageRating.toFixed(1)}</div>
          <StarRating rating={averageRating} size="lg" />
          <div className="mt-2 text-sm text-muted-foreground">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = reviews.filter(r => r.rating === stars).length
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

            return (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex w-20 items-center gap-1">
                  <span className="text-sm font-medium">{stars}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm text-muted-foreground">{count}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p className="mb-2 text-lg">No reviews yet</p>
            <p className="text-sm">Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map(review => <ReviewCard key={review.id} review={review} />)
        )}
      </div>

      {/* Write Review Button */}
      <div className="flex justify-center border-t pt-6">
        <Button size="lg" variant="outline">
          Write a Review
        </Button>
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt)
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="border-b border-border pb-6 last:border-0">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <StarRating rating={review.rating} />
            {review.verified && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <VerifiedIcon className="h-4 w-4" />
                <span>Verified Purchase</span>
              </div>
            )}
          </div>
          {review.title && <h4 className="mb-1 text-lg font-semibold">{review.title}</h4>}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{review.user.name || 'Anonymous'}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {review.comment && (
        <p className="mb-4 leading-relaxed text-muted-foreground">{review.comment}</p>
      )}

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ThumbsUp className="h-4 w-4" />
          <span>Helpful ({review.helpful})</span>
        </button>
      </div>
    </div>
  )
}

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  className?: string
}

export function StarRating({
  rating,
  size = 'md',
  showNumber = false,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const starSize = sizeClasses[size]

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map(star => {
        const filled = star <= Math.floor(rating)
        const partial = star === Math.ceil(rating) && rating % 1 !== 0
        const percentage = partial ? (rating % 1) * 100 : 0

        return (
          <div key={star} className="relative">
            {partial ? (
              <>
                <Star className={cn(starSize, 'text-gray-300')} />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${percentage}%` }}
                >
                  <Star className={cn(starSize, 'fill-yellow-400 text-yellow-400')} />
                </div>
              </>
            ) : (
              <Star
                className={cn(
                  starSize,
                  filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                )}
              />
            )}
          </div>
        )
      })}
      {showNumber && (
        <span className="ml-1 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
      )}
    </div>
  )
}
