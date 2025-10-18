/**
 * CONVERSION OPTIMIZATION AGENTS #31-35
 * Agent #35: Product Recommendation Engine
 *
 * Intelligent product recommendations with:
 * - Collaborative filtering
 * - Content-based filtering
 * - Trending products
 * - Recently viewed tracking
 * - Complementary product suggestions
 * - Personalized homepage generation
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  image: string;
  tags?: string[];
  style?: string;
  views: number;
  purchases: number;
  rating?: number;
}

export interface UserInteraction {
  userId: string;
  productId: string;
  type: 'view' | 'cart' | 'purchase' | 'wishlist';
  timestamp: number;
  duration?: number;
}

export interface RecommendationResult {
  product: Product;
  score: number;
  reason: string;
  strategy: RecommendationStrategy;
}

export enum RecommendationStrategy {
  COLLABORATIVE_FILTERING = 'collaborative_filtering',
  CONTENT_BASED = 'content_based',
  TRENDING = 'trending',
  NEW_ARRIVALS = 'new_arrivals',
  SEASONAL = 'seasonal',
  PRICE_RANGE = 'price_range',
  COMPLEMENTARY = 'complementary',
  RECENTLY_VIEWED = 'recently_viewed',
  PERSONALIZED = 'personalized'
}

/**
 * Product Recommendation Engine
 */
export class RecommendationEngine {
  private products: Map<string, Product> = new Map();
  private interactions: UserInteraction[] = [];
  private userProductMatrix: Map<string, Map<string, number>> = new Map();

  constructor(products: Product[] = []) {
    products.forEach(product => this.products.set(product.id, product));
  }

  /**
   * Add product to catalog
   */
  addProduct(product: Product): void {
    this.products.set(product.id, product);
  }

  /**
   * Track user interaction
   */
  trackInteraction(interaction: UserInteraction): void {
    this.interactions.push(interaction);
    this.updateUserProductMatrix(interaction);
  }

  /**
   * Update user-product affinity matrix
   */
  private updateUserProductMatrix(interaction: UserInteraction): void {
    if (!this.userProductMatrix.has(interaction.userId)) {
      this.userProductMatrix.set(interaction.userId, new Map());
    }

    const userProducts = this.userProductMatrix.get(interaction.userId)!;
    const currentScore = userProducts.get(interaction.productId) || 0;

    // Weight interactions differently
    const weights = {
      view: 1,
      cart: 3,
      wishlist: 2,
      purchase: 5
    };

    userProducts.set(
      interaction.productId,
      currentScore + weights[interaction.type]
    );
  }

  /**
   * Get recommendations for user
   */
  getRecommendationsForUser(
    userId: string,
    limit: number = 6,
    excludeProducts: string[] = []
  ): RecommendationResult[] {
    const recommendations: RecommendationResult[] = [];

    // Get user's interaction history
    const userInteractions = this.getUserInteractions(userId);

    if (userInteractions.length === 0) {
      // New user - show trending products
      return this.getTrendingProducts(limit);
    }

    // Collaborative filtering
    const collaborative = this.getCollaborativeRecommendations(userId, limit);
    recommendations.push(...collaborative);

    // Content-based filtering
    const contentBased = this.getContentBasedRecommendations(userInteractions, limit);
    recommendations.push(...contentBased);

    // Remove duplicates and excluded products
    const seen = new Set<string>(excludeProducts);
    const unique = recommendations.filter(rec => {
      if (seen.has(rec.product.id)) return false;
      seen.add(rec.product.id);
      return true;
    });

    // Sort by score and return top N
    return unique
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Collaborative filtering recommendations
   * "Users who liked this also liked..."
   */
  getCollaborativeRecommendations(
    userId: string,
    limit: number = 6
  ): RecommendationResult[] {
    const userProducts = this.userProductMatrix.get(userId);
    if (!userProducts) return [];

    // Find similar users (users who interacted with same products)
    const similarUsers = this.findSimilarUsers(userId);

    // Get products similar users liked
    const productScores = new Map<string, number>();

    similarUsers.forEach(({ userId: similarUserId, similarity }) => {
      const similarUserProducts = this.userProductMatrix.get(similarUserId);
      if (!similarUserProducts) return;

      similarUserProducts.forEach((score, productId) => {
        // Skip products user already interacted with
        if (userProducts.has(productId)) return;

        const currentScore = productScores.get(productId) || 0;
        productScores.set(productId, currentScore + score * similarity);
      });
    });

    // Convert to recommendations
    return Array.from(productScores.entries())
      .map(([productId, score]) => ({
        product: this.products.get(productId)!,
        score,
        reason: 'Customers who liked your favorites also liked this',
        strategy: RecommendationStrategy.COLLABORATIVE_FILTERING
      }))
      .filter(rec => rec.product)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Find users with similar tastes
   */
  private findSimilarUsers(userId: string): { userId: string; similarity: number }[] {
    const userProducts = this.userProductMatrix.get(userId);
    if (!userProducts) return [];

    const similarities: { userId: string; similarity: number }[] = [];

    this.userProductMatrix.forEach((otherUserProducts, otherUserId) => {
      if (otherUserId === userId) return;

      // Calculate cosine similarity
      const similarity = this.calculateCosineSimilarity(
        Array.from(userProducts.entries()),
        Array.from(otherUserProducts.entries())
      );

      if (similarity > 0.1) {
        similarities.push({ userId: otherUserId, similarity });
      }
    });

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
  }

  /**
   * Calculate cosine similarity between two users
   */
  private calculateCosineSimilarity(
    user1: [string, number][],
    user2: [string, number][]
  ): number {
    const user1Map = new Map(user1);
    const user2Map = new Map(user2);

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    // Find common products
    user1Map.forEach((score1, productId) => {
      const score2 = user2Map.get(productId);
      if (score2) {
        dotProduct += score1 * score2;
      }
      magnitude1 += score1 * score1;
    });

    user2Map.forEach((score2) => {
      magnitude2 += score2 * score2;
    });

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  }

  /**
   * Content-based recommendations
   * Based on product attributes (category, style, price, etc.)
   */
  getContentBasedRecommendations(
    userInteractions: UserInteraction[],
    limit: number = 6
  ): RecommendationResult[] {
    // Get user's favorite products
    const viewedProducts = userInteractions
      .map(interaction => this.products.get(interaction.productId))
      .filter((p): p is Product => p !== undefined);

    if (viewedProducts.length === 0) return [];

    // Extract user preferences
    const preferences = this.extractUserPreferences(viewedProducts);

    // Find similar products
    const recommendations: RecommendationResult[] = [];

    this.products.forEach(product => {
      // Skip already viewed products
      if (viewedProducts.some(p => p.id === product.id)) return;

      const score = this.calculateContentSimilarity(product, preferences);

      if (score > 0) {
        recommendations.push({
          product,
          score,
          reason: `Similar to ${viewedProducts[0].name}`,
          strategy: RecommendationStrategy.CONTENT_BASED
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Extract user preferences from interaction history
   */
  private extractUserPreferences(products: Product[]): {
    categories: Map<string, number>;
    priceRange: { min: number; max: number; avg: number };
    styles: Map<string, number>;
    tags: Map<string, number>;
  } {
    const categories = new Map<string, number>();
    const styles = new Map<string, number>();
    const tags = new Map<string, number>();
    let totalPrice = 0;
    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach(product => {
      // Category preferences
      categories.set(product.category, (categories.get(product.category) || 0) + 1);

      // Style preferences
      if (product.style) {
        styles.set(product.style, (styles.get(product.style) || 0) + 1);
      }

      // Tag preferences
      product.tags?.forEach(tag => {
        tags.set(tag, (tags.get(tag) || 0) + 1);
      });

      // Price range
      totalPrice += product.price;
      minPrice = Math.min(minPrice, product.price);
      maxPrice = Math.max(maxPrice, product.price);
    });

    return {
      categories,
      priceRange: {
        min: minPrice,
        max: maxPrice,
        avg: totalPrice / products.length
      },
      styles,
      tags
    };
  }

  /**
   * Calculate content similarity score
   */
  private calculateContentSimilarity(
    product: Product,
    preferences: ReturnType<typeof this.extractUserPreferences>
  ): number {
    let score = 0;

    // Category match (weight: 0.4)
    if (preferences.categories.has(product.category)) {
      score += 0.4;
    }

    // Style match (weight: 0.3)
    if (product.style && preferences.styles.has(product.style)) {
      score += 0.3;
    }

    // Price range match (weight: 0.2)
    const priceScore = this.calculatePriceScore(product.price, preferences.priceRange);
    score += priceScore * 0.2;

    // Tag overlap (weight: 0.1)
    const tagScore = this.calculateTagScore(product.tags || [], preferences.tags);
    score += tagScore * 0.1;

    return score;
  }

  /**
   * Calculate price similarity score
   */
  private calculatePriceScore(
    price: number,
    priceRange: { min: number; max: number; avg: number }
  ): number {
    // Product within user's price range
    if (price >= priceRange.min && price <= priceRange.max) {
      return 1.0;
    }

    // Calculate distance from average
    const distance = Math.abs(price - priceRange.avg);
    const maxDistance = Math.max(priceRange.avg - priceRange.min, priceRange.max - priceRange.avg);

    return Math.max(0, 1 - (distance / maxDistance));
  }

  /**
   * Calculate tag overlap score
   */
  private calculateTagScore(productTags: string[], userTags: Map<string, number>): number {
    if (productTags.length === 0 || userTags.size === 0) return 0;

    const matchCount = productTags.filter(tag => userTags.has(tag)).length;
    return matchCount / productTags.length;
  }

  /**
   * Get similar products based on attributes
   */
  getSimilarProducts(productId: string, limit: number = 4): RecommendationResult[] {
    const product = this.products.get(productId);
    if (!product) return [];

    const similar: RecommendationResult[] = [];

    this.products.forEach(p => {
      if (p.id === productId) return;

      let score = 0;

      // Same category
      if (p.category === product.category) score += 0.5;

      // Same style
      if (p.style && p.style === product.style) score += 0.3;

      // Similar price
      const priceDiff = Math.abs(p.price - product.price);
      const priceScore = Math.max(0, 1 - (priceDiff / product.price));
      score += priceScore * 0.2;

      if (score > 0) {
        similar.push({
          product: p,
          score,
          reason: 'Similar style and category',
          strategy: RecommendationStrategy.CONTENT_BASED
        });
      }
    });

    return similar
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get trending products
   */
  getTrendingProducts(limit: number = 6): RecommendationResult[] {
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);

    // Get recent interactions
    const recentInteractions = this.interactions.filter(i => i.timestamp > dayAgo);

    // Count views and purchases per product
    const productStats = new Map<string, { views: number; purchases: number }>();

    recentInteractions.forEach(interaction => {
      if (!productStats.has(interaction.productId)) {
        productStats.set(interaction.productId, { views: 0, purchases: 0 });
      }

      const stats = productStats.get(interaction.productId)!;

      if (interaction.type === 'view') stats.views++;
      if (interaction.type === 'purchase') stats.purchases++;
    });

    // Calculate trending score
    const trending = Array.from(productStats.entries())
      .map(([productId, stats]) => {
        const product = this.products.get(productId);
        if (!product) return null;

        // Score: purchases * 5 + views
        const score = stats.purchases * 5 + stats.views;

        return {
          product,
          score,
          reason: 'Trending now',
          strategy: RecommendationStrategy.TRENDING
        };
      })
      .filter((item): item is RecommendationResult => item !== null);

    return trending
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get complementary products
   * Products that are frequently bought together
   */
  getComplementaryProducts(productId: string, limit: number = 4): RecommendationResult[] {
    // Find purchases that included this product
    const purchases = this.interactions.filter(
      i => i.type === 'purchase' && i.productId === productId
    );

    // Find other products purchased by same users
    const userIds = new Set(purchases.map(p => p.userId));
    const complementary = new Map<string, number>();

    userIds.forEach(userId => {
      const userPurchases = this.interactions.filter(
        i => i.type === 'purchase' && i.userId === userId && i.productId !== productId
      );

      userPurchases.forEach(purchase => {
        complementary.set(
          purchase.productId,
          (complementary.get(purchase.productId) || 0) + 1
        );
      });
    });

    return Array.from(complementary.entries())
      .map(([id, count]) => ({
        product: this.products.get(id)!,
        score: count,
        reason: 'Frequently bought together',
        strategy: RecommendationStrategy.COMPLEMENTARY
      }))
      .filter(rec => rec.product)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get user's interaction history
   */
  private getUserInteractions(userId: string): UserInteraction[] {
    return this.interactions
      .filter(i => i.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get recently viewed products
   */
  getRecentlyViewed(userId: string, limit: number = 10): Product[] {
    return this.getUserInteractions(userId)
      .filter(i => i.type === 'view')
      .slice(0, limit)
      .map(i => this.products.get(i.productId))
      .filter((p): p is Product => p !== undefined);
  }
}

/**
 * Recently Viewed Product Tracker
 */
export class RecentlyViewedTracker {
  private storageKey = 'recently_viewed_products';
  private maxProducts = 10;

  /**
   * Add product to recently viewed
   */
  addProduct(product: Product): void {
    const viewed = this.getProducts();

    // Add to front, remove duplicates
    const updated = [
      product,
      ...viewed.filter(p => p.id !== product.id)
    ].slice(0, this.maxProducts);

    this.saveProducts(updated);
  }

  /**
   * Get recently viewed products
   */
  getProducts(): Product[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load recently viewed:', error);
      return [];
    }
  }

  /**
   * Save products to localStorage
   */
  private saveProducts(products: Product[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save recently viewed:', error);
    }
  }

  /**
   * Clear recently viewed
   */
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
  }
}

// Singleton instances
let engine: RecommendationEngine | null = null;
let tracker: RecentlyViewedTracker | null = null;

export function getRecommendationEngine(products?: Product[]): RecommendationEngine {
  if (!engine) {
    engine = new RecommendationEngine(products);
  }
  return engine;
}

export function getRecentlyViewedTracker(): RecentlyViewedTracker {
  if (!tracker) {
    tracker = new RecentlyViewedTracker();
  }
  return tracker;
}

/**
 * React Hook for Recommendations
 */
export function useRecommendations(userId: string, currentProductId?: string) {
  const engine = getRecommendationEngine();
  const tracker = getRecentlyViewedTracker();

  return {
    getRecommendations: (limit?: number) =>
      engine.getRecommendationsForUser(
        userId,
        limit,
        currentProductId ? [currentProductId] : []
      ),
    getSimilarProducts: (productId: string, limit?: number) =>
      engine.getSimilarProducts(productId, limit),
    getTrending: (limit?: number) =>
      engine.getTrendingProducts(limit),
    getComplementary: (productId: string, limit?: number) =>
      engine.getComplementaryProducts(productId, limit),
    getRecentlyViewed: () =>
      tracker.getProducts(),
    trackView: (product: Product) => {
      tracker.addProduct(product);
      engine.trackInteraction({
        userId,
        productId: product.id,
        type: 'view',
        timestamp: Date.now()
      });
    },
    trackPurchase: (productId: string) =>
      engine.trackInteraction({
        userId,
        productId,
        type: 'purchase',
        timestamp: Date.now()
      })
  };
}
