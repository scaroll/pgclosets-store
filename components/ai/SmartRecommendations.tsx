'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Sparkles, TrendingUp, Users, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  features: string[];
  style: string[];
  materials: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  image?: string;
}

interface Recommendation {
  productId: string;
  product: Product;
  score: number;
  reasoning: string;
  category: 'collaborative' | 'content' | 'style' | 'popular' | 'complementary';
  confidence: number;
}

interface SmartRecommendationsProps {
  userId?: string;
  currentProduct?: Product;
  maxRecommendations?: number;
  categories?: string[];
  style?: string[];
  budget?: { min: number; max: number };
  includeComplementary?: boolean;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

const categoryIcons = {
  collaborative: Users,
  content: Palette,
  style: Sparkles,
  popular: TrendingUp,
  complementary: Heart,
};

const categoryColors = {
  collaborative: 'bg-blue-100 text-blue-800 border-blue-200',
  content: 'bg-green-100 text-green-800 border-green-200',
  style: 'bg-purple-100 text-purple-800 border-purple-200',
  popular: 'bg-orange-100 text-orange-800 border-orange-200',
  complementary: 'bg-pink-100 text-pink-800 border-pink-200',
};

const categoryLabels = {
  collaborative: 'Similar Customers',
  content: 'Similar Products',
  style: 'Style Match',
  popular: 'Trending',
  complementary: 'Perfect Match',
};

export default function SmartRecommendations({
  userId = 'anonymous',
  currentProduct,
  maxRecommendations = 8,
  categories,
  style = [],
  budget,
  includeComplementary = false,
  onProductClick,
  onAddToCart,
  className = '',
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [userId, currentProduct?.id, categories, style, budget, includeComplementary]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          currentProduct,
          maxRecommendations,
          categories,
          style,
          budget,
          includeComplementary,
          browsingHistory: [], // This would come from user session
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations);
      } else {
        setError(data.error || 'Failed to load recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    // Track product click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select_item', {
        item_id: product.id,
        item_name: product.name,
        category: product.category,
        value: product.price,
        currency: 'CAD',
      });
    }

    onProductClick?.(product);
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();

    // Track add to cart
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        item_id: product.id,
        item_name: product.name,
        category: product.category,
        value: product.price,
        currency: 'CAD',
      });
    }

    onAddToCart?.(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(price);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Excellent Match';
    if (confidence >= 0.6) return 'Good Match';
    return 'Possible Match';
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">AI is finding perfect recommendations for you...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchRecommendations} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">AI Recommendations For You</h2>
          <Badge variant="secondary" className="text-xs">
            Powered by AI
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Personalized suggestions based on your preferences and browsing history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {recommendations.map((rec, index) => {
            const IconComponent = categoryIcons[rec.category];

            return (
              <motion.div
                key={rec.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onHoverStart={() => setHoveredProduct(rec.productId)}
                onHoverEnd={() => setHoveredProduct(null)}
              >
                <Card
                  className="cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
                  onClick={() => handleProductClick(rec.product)}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {rec.product.image ? (
                      <OptimizedImage
                        src={rec.product.image}
                        alt={rec.product.name}
                        fill
                        className="object-cover transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl text-gray-400">
                            {rec.product.category.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Recommendation Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge
                        className={`text-xs ${categoryColors[rec.category]} border`}
                        variant="secondary"
                      >
                        <IconComponent className="w-3 h-3 mr-1" />
                        {categoryLabels[rec.category]}
                      </Badge>
                    </div>

                    {/* Confidence Score */}
                    <div className="absolute top-2 right-2">
                      <div className="bg-white/90 backdrop-blur rounded-full px-2 py-1 text-xs font-medium">
                        <span className={getConfidenceColor(rec.confidence)}>
                          {Math.round(rec.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.div
                      className="absolute bottom-2 right-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: hoveredProduct === rec.productId ? 1 : 0,
                        scale: hoveredProduct === rec.productId ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={(e) => handleAddToCart(rec.product, e)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                        {rec.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {rec.product.description}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(rec.product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        {rec.product.rating} ({rec.product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(rec.product.price)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {rec.product.category}
                      </span>
                    </div>

                    {/* AI Reasoning */}
                    <div className="border-t pt-2">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {rec.reasoning}
                        </p>
                      </div>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getConfidenceLabel(rec.confidence)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* View More */}
      <div className="mt-6 text-center">
        <Button
          variant="outline"
          onClick={() => window.location.href = '/products'}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          View All Recommendations
        </Button>
      </div>
    </Card>
  );
}