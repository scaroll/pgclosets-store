import { z } from 'zod';

// Product schema for recommendations
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.number(),
  description: z.string().optional(),
  features: z.array(z.string()).default([]),
  style: z.array(z.string()).default([]),
  materials: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  rating: z.number().default(0),
  reviewCount: z.number().default(0),
  image: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

interface UserBehavior {
  userId: string;
  viewedProducts: string[];
  stylePreferences?: string[];
  priceRange?: { min: number; max: number };
}

interface Recommendation {
  productId: string;
  score: number;
  reasoning: string;
  category: 'collaborative' | 'content' | 'style' | 'popular' | 'complementary';
  confidence: number;
}

interface RecommendationOptions {
  limit?: number;
  categories?: string[];
  excludeIds?: string[];
  includeComplementary?: boolean | string;
  currentProductId?: string;
}

// In-memory storage for user behavior and product views
const userBehaviorMap = new Map<string, UserBehavior>();
const productViewCounts = new Map<string, number>();

// Sample product catalog for recommendations
const productCatalog: Product[] = [
  {
    id: 'barn-1',
    name: 'Modern Pine Barn Door',
    category: 'Barn Doors',
    price: 899,
    description: 'Contemporary barn door with natural pine finish',
    features: ['Soft-close', 'Pre-drilled', 'Easy installation'],
    style: ['modern', 'rustic', 'contemporary'],
    materials: ['pine', 'metal hardware'],
    colors: ['natural', 'brown'],
    rating: 4.5,
    reviewCount: 127,
  },
  {
    id: 'barn-2',
    name: 'Classic White Barn Door',
    category: 'Barn Doors',
    price: 1299,
    description: 'Timeless white barn door perfect for modern farmhouses',
    features: ['Pre-finished', 'Soft-close', 'Hardware included'],
    style: ['modern', 'farmhouse', 'traditional'],
    materials: ['MDF', 'metal hardware'],
    colors: ['white', 'off-white'],
    rating: 4.8,
    reviewCount: 89,
  },
  {
    id: 'bifold-1',
    name: 'Space-Saving Bifold Doors',
    category: 'Bifold Doors',
    price: 749,
    description: 'Perfect for closets and tight spaces',
    features: ['Space-saving', 'Easy installation', 'Multiple finishes'],
    style: ['modern', 'contemporary', 'minimalist'],
    materials: ['wood composite', 'metal hardware'],
    colors: ['white', 'natural', 'espresso'],
    rating: 4.3,
    reviewCount: 67,
  },
  {
    id: 'hardware-1',
    name: 'Deluxe Barn Door Hardware Kit',
    category: 'Hardware',
    price: 399,
    description: 'Complete hardware kit with track and rollers',
    features: ['6ft track', 'Soft-close', 'Weight capacity 200lbs'],
    style: ['modern', 'industrial'],
    materials: ['steel', 'aluminum'],
    colors: ['black', 'matte black'],
    rating: 4.6,
    reviewCount: 203,
  },
  {
    id: 'closet-system-1',
    name: 'Modular Closet Organizer',
    category: 'Closet Systems',
    price: 1599,
    description: 'Customizable modular closet system',
    features: ['Modular design', 'Adjustable shelves', 'Hanging rods'],
    style: ['modern', 'organized', 'functional'],
    materials: ['melamine', 'metal hardware'],
    colors: ['white', 'gray', 'cherry'],
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: 'mirror-1',
    name: 'Full-Length Wall Mirror',
    category: 'Mirrors',
    price: 299,
    description: 'Elegant full-length mirror with slim frame',
    features: ['Full-length', 'Slim frame', 'Easy mounting'],
    style: ['modern', 'elegant', 'minimalist'],
    materials: ['glass', 'aluminum frame'],
    colors: ['black', 'silver', 'gold'],
    rating: 4.4,
    reviewCount: 92,
  },
];

class RecommendationEngine {
  /**
   * Update user behavior data
   */
  updateUserBehavior(userId: string, behavior: UserBehavior): void {
    const existing = userBehaviorMap.get(userId);
    if (existing) {
      existing.viewedProducts = [...new Set([...existing.viewedProducts, ...behavior.viewedProducts])];
      if (behavior.stylePreferences) {
        existing.stylePreferences = behavior.stylePreferences;
      }
      if (behavior.priceRange) {
        existing.priceRange = behavior.priceRange;
      }
      userBehaviorMap.set(userId, existing);
    } else {
      userBehaviorMap.set(userId, behavior);
    }
  }

  /**
   * Track product view
   */
  trackProductView(userId: string, productId: string): void {
    const count = productViewCounts.get(productId) || 0;
    productViewCounts.set(productId, count + 1);

    const behavior = userBehaviorMap.get(userId);
    if (behavior) {
      if (!behavior.viewedProducts.includes(productId)) {
        behavior.viewedProducts.push(productId);
        userBehaviorMap.set(userId, behavior);
      }
    }
  }

  /**
   * Get personalized recommendations
   */
  getRecommendations(
    userId: string,
    options: RecommendationOptions = {}
  ): Recommendation[] {
    const {
      limit = 8,
      categories,
      excludeIds = [],
      includeComplementary = false,
      currentProductId,
    } = options;

    const userBehavior = userBehaviorMap.get(userId);
    const recommendations: Recommendation[] = [];

    // Filter products
    let availableProducts = productCatalog.filter(p => !excludeIds.includes(p.id));

    if (categories && categories.length > 0) {
      availableProducts = availableProducts.filter(p => categories.includes(p.category));
    }

    // Content-based recommendations (based on user's viewed products)
    if (userBehavior && userBehavior.viewedProducts.length > 0) {
      const viewedStyles = new Set<string>();
      userBehavior.viewedProducts.forEach(productId => {
        const product = productCatalog.find(p => p.id === productId);
        if (product) {
          product.style.forEach(s => viewedStyles.add(s));
        }
      });

      availableProducts.forEach(product => {
        const styleMatch = product.style.filter(s => viewedStyles.has(s)).length;
        if (styleMatch > 0) {
          recommendations.push({
            productId: product.id,
            score: styleMatch / product.style.length,
            reasoning: `Matches your preferred ${[...viewedStyles].slice(0, 2).join(', ')} style`,
            category: 'style',
            confidence: 0.7 + (styleMatch * 0.1),
          });
        }
      });
    }

    // Popularity-based recommendations
    const sortedByPopularity = [...availableProducts].sort((a, b) => {
      const aViews = productViewCounts.get(a.id) || 0;
      const bViews = productViewCounts.get(b.id) || 0;
      return bViews - aViews;
    });

    sortedByPopularity.slice(0, 4).forEach(product => {
      if (!recommendations.find(r => r.productId === product.id)) {
        recommendations.push({
          productId: product.id,
          score: 0.6 + (product.rating / 10),
          reasoning: `Popular choice with ${product.reviewCount} reviews`,
          category: 'popular',
          confidence: 0.75,
        });
      }
    });

    // Complementary products
    if (includeComplementary && currentProductId) {
      const currentProduct = productCatalog.find(p => p.id === currentProductId);
      if (currentProduct) {
        // Find complementary categories
        const complementaryCategories: Record<string, string[]> = {
          'Barn Doors': ['Hardware', 'Mirrors'],
          'Bifold Doors': ['Hardware', 'Closet Systems'],
          'Closet Systems': ['Mirrors', 'Hardware'],
          'Hardware': ['Barn Doors', 'Bifold Doors'],
          'Mirrors': ['Closet Systems'],
        };

        const relatedCategories = complementaryCategories[currentProduct.category] || [];
        availableProducts
          .filter(p => relatedCategories.includes(p.category))
          .slice(0, 2)
          .forEach(product => {
            if (!recommendations.find(r => r.productId === product.id)) {
              recommendations.push({
                productId: product.id,
                score: 0.8,
                reasoning: `Complements your ${currentProduct.name}`,
                category: 'complementary',
                confidence: 0.85,
              });
            }
          });
      }
    }

    // Sort by score and limit
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

export const recommendationEngine = new RecommendationEngine();
