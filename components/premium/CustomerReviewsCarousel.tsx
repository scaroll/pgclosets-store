"use client"

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Star,
  ThumbsUp,
  MessageCircle,
  Camera,
  Calendar,
  CheckCircle,
  Heart,
  Share2,
  Flag,
  Filter,
  Verified,
  TrendingUp,
  Award,
  Users,
  X
} from 'lucide-react'

interface ReviewPhoto {
  id: string
  url: string
  caption?: string
  verified: boolean
}

interface Review {
  id: string
  customerName: string
  avatar?: string
  rating: number
  title: string
  content: string
  date: Date
  helpful: number
  verified: boolean
  photos: ReviewPhoto[]
  response?: {
    content: string
    date: Date
    author: string
  }
  pros: string[]
  cons: string[]
  wouldRecommend: boolean
  productId: string
  productName: string
}

interface CustomerReviewsCarouselProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  showPhotos?: boolean
  enableFiltering?: boolean
  showStats?: boolean
  onReviewClick?: (review: Review) => void
  onHelpfulClick?: (reviewId: string) => void
  className?: string
}

export const CustomerReviewsCarousel: React.FC<CustomerReviewsCarouselProps> = ({
  reviews,
  averageRating,
  totalReviews,
  showPhotos = true,
  enableFiltering = true,
  showStats = true,
  onReviewClick,
  onHelpfulClick,
  className
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [expandedReview, setExpandedReview] = useState<string | null>(null)
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set())
  const [selectedPhoto, setSelectedPhoto] = useState<ReviewPhoto | null>(null)

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    switch (selectedFilter) {
      case '5star':
        return review.rating === 5
      case '4star':
        return review.rating === 4
      case 'verified':
        return review.verified
      case 'photos':
        return review.photos.length > 0
      case 'recent':
        return review.date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      default:
        return true
    }
  })

  // Handle helpful click
  const handleHelpfulClick = useCallback((reviewId: string) => {
    if (!likedReviews.has(reviewId)) {
      setLikedReviews(prev => new Set([...prev, reviewId]))
      onHelpfulClick?.(reviewId)
    }
  }, [likedReviews, onHelpfulClick])

  // Toggle review expansion
  const toggleReviewExpansion = useCallback((reviewId: string) => {
    setExpandedReview(prev => prev === reviewId ? null : reviewId)
  }, [])

  // Render stars
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const starSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  // Get rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return distribution
  }

  const ratingDistribution = getRatingDistribution()

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* Stats Header */}
      {showStats && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                {renderStars(averageRating, 'lg')}
                <p className="text-muted-foreground mt-2">
                  Based on {totalReviews} reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                <h4 className="font-medium">Rating Distribution</h4>
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-3">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all duration-500"
                        style={{
                          width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {ratingDistribution[rating as keyof typeof ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    {reviews.filter(r => r.verified).length} Verified purchases
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    {reviews.filter(r => r.photos.length > 0).length} Reviews with photos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">
                    {reviews.filter(r => r.wouldRecommend).length} Would recommend
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Controls */}
      {enableFiltering && (
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
            >
              All Reviews ({reviews.length})
            </Button>
            <Button
              variant={selectedFilter === '5star' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('5star')}
            >
              5 Stars ({ratingDistribution[5]})
            </Button>
            <Button
              variant={selectedFilter === '4star' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('4star')}
            >
              4 Stars ({ratingDistribution[4]})
            </Button>
            <Button
              variant={selectedFilter === 'verified' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('verified')}
            >
              <Verified className="h-4 w-4 mr-1" />
              Verified
            </Button>
            {showPhotos && (
              <Button
                variant={selectedFilter === 'photos' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('photos')}
              >
                <Camera className="h-4 w-4 mr-1" />
                With Photos
              </Button>
            )}
            <Button
              variant={selectedFilter === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('recent')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Recent
            </Button>
          </div>
        </div>
      )}

      {/* Reviews Carousel */}
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredReviews.map((review) => (
              <CarouselItem key={review.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      {/* Customer Info */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.avatar} alt={review.customerName} />
                            <AvatarFallback>
                              {review.customerName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">{review.customerName}</h4>
                              {review.verified && (
                                <CheckCircle className="h-3 w-3 text-blue-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {review.date.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {renderStars(review.rating, 'sm')}
                      </div>

                      {/* Review Title */}
                      <h3 className="font-medium mb-2 line-clamp-1">{review.title}</h3>

                      {/* Review Content */}
                      <p className={`text-sm text-muted-foreground mb-4 ${
                        expandedReview === review.id ? '' : 'line-clamp-3'
                      }`}>
                        {review.content}
                      </p>

                      {review.content.length > 150 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReviewExpansion(review.id)}
                          className="text-xs mb-4"
                        >
                          {expandedReview === review.id ? 'Show less' : 'Read more'}
                        </Button>
                      )}

                      {/* Pros and Cons */}
                      {(review.pros.length > 0 || review.cons.length > 0) && (
                        <div className="mb-4 space-y-2">
                          {review.pros.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-green-600 mb-1">Pros:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {review.pros.slice(0, 2).map((pro, index) => (
                                  <li key={index} className="flex items-start gap-1">
                                    <span className="text-green-500">+</span>
                                    <span>{pro}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {review.cons.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-red-600 mb-1">Cons:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {review.cons.slice(0, 2).map((con, index) => (
                                  <li key={index} className="flex items-start gap-1">
                                    <span className="text-red-500">-</span>
                                    <span>{con}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Photos */}
                      {showPhotos && review.photos.length > 0 && (
                        <div className="mb-4">
                          <div className="flex gap-2 overflow-x-auto">
                            {review.photos.slice(0, 3).map(photo => (
                              <div
                                key={photo.id}
                                className="relative flex-shrink-0 cursor-pointer"
                                onClick={() => setSelectedPhoto(photo)}
                              >
                                <img
                                  src={photo.url}
                                  alt={photo.caption || 'Review photo'}
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                                {photo.verified && (
                                  <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                                    <CheckCircle className="h-2 w-2 text-white" />
                                  </div>
                                )}
                              </div>
                            ))}
                            {review.photos.length > 3 && (
                              <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-xs font-medium">
                                +{review.photos.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="mb-4">
                        <Badge variant="outline" className="text-xs">
                          {review.productName}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleHelpfulClick(review.id)}
                            className={`text-xs ${
                              likedReviews.has(review.id) ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Helpful ({review.helpful + (likedReviews.has(review.id) ? 1 : 0)})
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          {review.wouldRecommend && (
                            <Badge variant="secondary" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Response */}
                      {review.response && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs text-primary-foreground font-medium">
                                {review.response.author[0]}
                              </span>
                            </div>
                            <span className="text-xs font-medium">{review.response.author}</span>
                            <span className="text-xs text-muted-foreground">
                              • {review.response.date.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {review.response.content}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Review photo'}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              {selectedPhoto.caption && (
                <p className="text-white text-center mt-4">{selectedPhoto.caption}</p>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="h-6 w-6" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomerReviewsCarousel