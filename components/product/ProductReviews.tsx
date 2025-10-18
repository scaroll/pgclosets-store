'use client';

import { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'John D.',
    rating: 5,
    date: '2024-09-15',
    title: 'Excellent quality and service!',
    content: 'The closet doors exceeded my expectations. Installation was smooth and the team was very professional. Highly recommend PG Closets!',
    helpful: 12,
    verified: true
  },
  {
    id: '2',
    author: 'Sarah M.',
    rating: 4,
    date: '2024-09-10',
    title: 'Great product, minor delivery delay',
    content: 'Beautiful doors that transformed my bedroom. There was a small delay in delivery but the quality made up for it.',
    helpful: 8,
    verified: true
  },
  {
    id: '3',
    author: 'Robert K.',
    rating: 5,
    date: '2024-08-28',
    title: 'Perfect fit for our Ottawa home',
    content: 'Custom measurements were spot on. The barn door style looks amazing in our renovated farmhouse.',
    helpful: 15,
    verified: true
  }
];

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews] = useState<Review[]>(mockReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const handleHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => new Set([...prev, reviewId]));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Rating Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                <div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {reviews.length} reviews
                  </p>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-3">{rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Progress value={percentage} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full"
              >
                Write a Review
              </Button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="space-y-4">
                <h3 className="font-semibold">Write Your Review</h3>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedRating(i + 1)}
                        className="p-1"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            i < selectedRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          } hover:fill-yellow-400 hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-title">Review Title</Label>
                  <Input id="review-title" placeholder="Summarize your experience" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-content">Your Review</Label>
                  <Textarea
                    id="review-content"
                    placeholder="Tell us about your experience with this product"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-name">Your Name</Label>
                  <Input id="review-name" placeholder="John D." />
                </div>
                <Button className="w-full">Submit Review</Button>
              </div>
            )}
          </div>

          {/* Individual Reviews */}
          <div className="mt-8 space-y-4">
            <h3 className="font-semibold text-lg">Customer Reviews</h3>
            {reviews.map(review => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{review.author}</span>
                        </div>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold">{review.title}</h4>
                      <p className="text-sm text-muted-foreground">{review.content}</p>
                      <div className="flex items-center gap-4 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleHelpful(review.id)}
                          disabled={helpfulReviews.has(review.id)}
                          className="text-xs"
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Helpful ({review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)})
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}