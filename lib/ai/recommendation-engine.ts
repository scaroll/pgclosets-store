/**
 * AI-Powered Product Recommendation Engine
 * Implements collaborative filtering, content-based filtering, and style matching
 */

import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Product schema for AI processing
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
  dimensions: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    depth: z.number().optional(),
  }).optional(),
  popularity: z.number().default(0),
  rating: z.number().default(0),
  reviewCount: z.number().default(0),
  tags: z.array(z.string()).default([]),
});

export type Product = z.infer<typeof ProductSchema>;

// User behavior schema
export const UserBehaviorSchema = z.object({
  userId: z.string(),
  viewedProducts: z.array(z.string()).default([]),
  purchasedProducts: z.array(z.string()).default([]),
  cartProducts: z.array(z.string()).default([]),
  wishlistProducts: z.array(z.string()).default([]),
  searchHistory: z.array(z.string()).default([]),
  categoryPreferences: z.record(z.number()).default({}),
  stylePreferences: z.array(z.string()).default([]),
  priceRange: z.object({
    min: z.number(),
    max: z.number(),
  }).optional(),
  location: z.string().optional(),
  sessionData: z.object({
    duration: z.number().default(0),
    pageViews: z.number().default(0),
    bounceRate: z.number().default(0),
  }).optional(),
});

export type UserBehavior = z.infer<typeof UserBehaviorSchema>;

// Recommendation result schema
export const RecommendationResultSchema = z.object({
  productId: z.string(),
  score: z.number(),
  reasoning: z.string(),
  category: z.enum(['collaborative', 'content', 'style', 'popular', 'complementary']),
  confidence: z.number(),
});

export type RecommendationResult = z.infer<typeof RecommendationResultSchema>;

export class AIRecommendationEngine {
  private products: Product[] = [];
  private userBehaviors: Map<string, UserBehavior> = new Map();
  private productEmbeddings: Map<string, number[]> = new Map();
  private userEmbeddings: Map<string, number[]> = new Map();

  constructor() {
    this.initializeEngine();
  }

  private async initializeEngine() {
    // Load products and generate embeddings
    await this.loadProducts();
    await this.generateProductEmbeddings();
    this.loadUserBehaviors();
  }

  /**
   * Generate product embeddings using OpenAI's text embeddings
   */
  private async generateProductEmbeddings() {
    for (const product of this.products) {
      const text = this.createProductText(product);
      try {
        const response = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: text,
        });
        this.productEmbeddings.set(product.id, response.data[0].embedding);
      } catch (error) {
        console.error(`Failed to generate embedding for product ${product.id}:`, error);
        // Fallback to simple feature vector
        this.productEmbeddings.set(product.id, this.createFallbackEmbedding(product));
      }
    }
  }

  /**
   * Create text representation of product for embedding
   */
  private createProductText(product: Product): string {
    return `${product.name} ${product.category} ${product.description} ${product.features.join(' ')} ${product.style.join(' ')} ${product.materials.join(' ')} ${product.tags.join(' ')}`.toLowerCase();
  }

  /**
   * Fallback embedding using manual feature extraction
   */
  private createFallbackEmbedding(product: Product): number[] {
    // Create a simple 384-dimensional embedding
    const embedding = new Array(384).fill(0);

    // Encode product features
    const encodeFeature = (feature: string, position: number) => {
      const hash = this.simpleHash(feature);
      embedding[position % embedding.length] = hash / 1000000;
    };

    product.features.forEach((f, i) => encodeFeature(f, i));
    product.style.forEach((s, i) => encodeFeature(s, i + 20));
    product.materials.forEach((m, i) => encodeFeature(m, i + 40));
    product.tags.forEach((t, i) => encodeFeature(t, i + 60));

    // Add numeric features
    embedding[100] = product.price / 10000;
    embedding[101] = product.rating / 5;
    embedding[102] = product.popularity / 100;
    embedding[103] = product.reviewCount / 1000;

    return embedding;
  }

  /**
   * Simple hash function for fallback embeddings
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Collaborative filtering recommendations
   */
  private async getCollaborativeRecommendations(userId: string, limit: number = 5): Promise<RecommendationResult[]> {
    const userBehavior = this.userBehaviors.get(userId);
    if (!userBehavior) return [];

    const recommendations: RecommendationResult[] = [];
    const userPurchased = new Set(userBehavior.purchasedProducts);
    const userViewed = new Set(userBehavior.viewedProducts);

    // Find similar users based on purchase history
    for (const [otherUserId, otherBehavior] of this.userBehaviors.entries()) {
      if (otherUserId === userId) continue;

      const similarity = this.calculateUserSimilarity(userBehavior, otherBehavior);
      if (similarity < 0.3) continue; // Threshold for similarity

      // Recommend products purchased by similar users
      for (const productId of otherBehavior.purchasedProducts) {
        if (!userPurchased.has(productId) && !userViewed.has(productId)) {
          const product = this.products.find(p => p.id === productId);
          if (!product) continue;

          const score = similarity * 0.8 + (product.rating / 5) * 0.2;

          recommendations.push({
            productId,
            score,
            reasoning: `Customers with similar tastes also loved this ${product.category.toLowerCase()}`,
            category: 'collaborative',
            confidence: similarity,
          });
        }
      }
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Content-based filtering recommendations
   */
  private async getContentRecommendations(userId: string, limit: number = 5): Promise<RecommendationResult[]> {
    const userBehavior = this.userBehaviors.get(userId);
    if (!userBehavior || !userBehavior.viewedProducts.length) return [];

    const userEmbedding = await this.calculateUserEmbedding(userBehavior);
    const recommendations: RecommendationResult[] = [];
    const userPurchased = new Set(userBehavior.purchasedProducts);
    const userViewed = new Set(userBehavior.viewedProducts);

    for (const product of this.products) {
      if (userPurchased.has(product.id) || userViewed.has(product.id)) continue;

      const productEmbedding = this.productEmbeddings.get(product.id);
      if (!productEmbedding) continue;

      const similarity = this.cosineSimilarity(userEmbedding, productEmbedding);
      if (similarity < 0.4) continue; // Threshold for content similarity

      recommendations.push({
        productId: product.id,
        score: similarity,
        reasoning: `Based on your interest in ${product.category.toLowerCase()} with similar features and style`,
        category: 'content',
        confidence: similarity,
      });
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Style-based recommendations
   */
  private async getStyleRecommendations(userId: string, limit: number = 5): Promise<RecommendationResult[]> {
    const userBehavior = this.userBehaviors.get(userId);
    if (!userBehavior) return [];

    const userStyles = new Set(userBehavior.stylePreferences);
    if (userStyles.size === 0) return [];

    const recommendations: RecommendationResult[] = [];
    const userPurchased = new Set(userBehavior.purchasedProducts);
    const userViewed = new Set(userBehavior.viewedProducts);

    for (const product of this.products) {
      if (userPurchased.has(product.id) || userViewed.has(product.id)) continue;

      const productStyles = new Set(product.style);
      const matchingStyles = [...userStyles].filter(style => productStyles.has(style));

      if (matchingStyles.length === 0) continue;

      const styleScore = matchingStyles.length / Math.max(userStyles.size, productStyles.size);
      const ratingScore = product.rating / 5;
      const popularityScore = product.popularity / 100;

      const finalScore = styleScore * 0.6 + ratingScore * 0.3 + popularityScore * 0.1;

      recommendations.push({
        productId: product.id,
        score: finalScore,
        reasoning: `Matches your preferred ${matchingStyles.join(', ')} style`,
        category: 'style',
        confidence: styleScore,
      });
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Popular/trending recommendations
   */
  private async getPopularRecommendations(limit: number = 5): Promise<RecommendationResult[]> {
    const recommendations: RecommendationResult[] = [];

    // Sort products by combined popularity and rating
    const sortedProducts = [...this.products]
      .sort((a, b) => {
        const scoreA = a.popularity * 0.4 + (a.rating * a.reviewCount) * 0.6;
        const scoreB = b.popularity * 0.4 + (b.rating * b.reviewCount) * 0.6;
        return scoreB - scoreA;
      })
      .slice(0, limit * 2); // Get more to filter

    for (const product of sortedProducts.slice(0, limit)) {
      const score = (product.popularity / 100) * 0.4 + (product.rating / 5) * 0.6;

      recommendations.push({
        productId: product.id,
        score,
        reasoning: `Popular ${product.category.toLowerCase()} with excellent reviews (${product.rating}/5)`,
        category: 'popular',
        confidence: score,
      });
    }

    return recommendations;
  }

  /**
   * Complementary product recommendations
   */
  private async getComplementaryRecommendations(productId: string, limit: number = 3): Promise<RecommendationResult[]> {
    const product = this.products.find(p => p.id === productId);
    if (!product) return [];

    const recommendations: RecommendationResult[] = [];
    const productEmbedding = this.productEmbeddings.get(productId);
    if (!productEmbedding) return [];

    for (const otherProduct of this.products) {
      if (otherProduct.id === productId) continue;

      const otherEmbedding = this.productEmbeddings.get(otherProduct.id);
      if (!otherEmbedding) continue;

      // Check for complementary relationships
      const similarity = this.cosineSimilarity(productEmbedding, otherEmbedding);
      const categoryBonus = this.getCategoryBonus(product.category, otherProduct.category);
      const styleBonus = this.getStyleBonus(product.style, otherProduct.style);

      const finalScore = similarity * 0.5 + categoryBonus * 0.3 + styleBonus * 0.2;

      if (finalScore > 0.5) {
        recommendations.push({
          productId: otherProduct.id,
          score: finalScore,
          reasoning: `Perfect complement to your ${product.name} - ${this.getComplementReason(product, otherProduct)}`,
          category: 'complementary',
          confidence: finalScore,
        });
      }
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Main recommendation method that combines all strategies
   */
  async getRecommendations(
    userId: string,
    options: {
      limit?: number;
      categories?: string[];
      excludeIds?: string[];
      includeComplementary?: boolean;
      currentProductId?: string;
    } = {}
  ): Promise<RecommendationResult[]> {
    const {
      limit = 10,
      categories,
      excludeIds = [],
      includeComplementary = false,
      currentProductId,
    } = options;

    const allRecommendations: RecommendationResult[] = [];

    // Get recommendations from different strategies
    const [collaborative, content, style, popular] = await Promise.all([
      this.getCollaborativeRecommendations(userId, Math.ceil(limit * 0.3)),
      this.getContentRecommendations(userId, Math.ceil(limit * 0.3)),
      this.getStyleRecommendations(userId, Math.ceil(limit * 0.2)),
      this.getPopularRecommendations(Math.ceil(limit * 0.2)),
    ]);

    allRecommendations.push(...collaborative, ...content, ...style, ...popular);

    // Add complementary recommendations if requested
    if (includeComplementary && currentProductId) {
      const complementary = await this.getComplementaryRecommendations(currentProductId, 3);
      allRecommendations.push(...complementary);
    }

    // Filter and rank recommendations
    const filteredRecommendations = allRecommendations
      .filter(rec => !excludeIds.includes(rec.productId))
      .filter(rec => {
        if (!categories || categories.length === 0) return true;
        const product = this.products.find(p => p.id === rec.productId);
        return product && categories.includes(product.category);
      });

    // Remove duplicates and sort by score
    const uniqueRecommendations = this.removeDuplicates(filteredRecommendations);
    const finalRecommendations = uniqueRecommendations
      .sort((a, b) => {
        // Weight by category priority
        const categoryWeights = {
          collaborative: 1.0,
          content: 0.9,
          style: 0.8,
          popular: 0.7,
          complementary: 1.1,
        };

        const weightedScoreA = a.score * categoryWeights[a.category];
        const weightedScoreB = b.score * categoryWeights[b.category];

        return weightedScoreB - weightedScoreA;
      })
      .slice(0, limit);

    return finalRecommendations;
  }

  /**
   * Calculate user embedding based on behavior
   */
  private async calculateUserEmbedding(userBehavior: UserBehavior): Promise<number[]> {
    const embedding = new Array(384).fill(0);
    let weightSum = 0;

    // Weight products by interaction type
    for (const productId of userBehavior.purchasedProducts) {
      const productEmbedding = this.productEmbeddings.get(productId);
      if (productEmbedding) {
        this.addWeightedVector(embedding, productEmbedding, 3.0);
        weightSum += 3.0;
      }
    }

    for (const productId of userBehavior.cartProducts) {
      const productEmbedding = this.productEmbeddings.get(productId);
      if (productEmbedding) {
        this.addWeightedVector(embedding, productEmbedding, 2.0);
        weightSum += 2.0;
      }
    }

    for (const productId of userBehavior.wishlistProducts) {
      const productEmbedding = this.productEmbeddings.get(productId);
      if (productEmbedding) {
        this.addWeightedVector(embedding, productEmbedding, 1.5);
        weightSum += 1.5;
      }
    }

    for (const productId of userBehavior.viewedProducts) {
      const productEmbedding = this.productEmbeddings.get(productId);
      if (productEmbedding) {
        this.addWeightedVector(embedding, productEmbedding, 1.0);
        weightSum += 1.0;
      }
    }

    // Normalize the embedding
    if (weightSum > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= weightSum;
      }
    }

    return embedding;
  }

  /**
   * Add weighted vector to embedding
   */
  private addWeightedVector(target: number[], source: number[], weight: number): void {
    for (let i = 0; i < target.length; i++) {
      target[i] += source[i] * weight;
    }
  }

  /**
   * Calculate similarity between users
   */
  private calculateUserSimilarity(user1: UserBehavior, user2: UserBehavior): number {
    const set1 = new Set(user1.purchasedProducts);
    const set2 = new Set(user2.purchasedProducts);

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  /**
   * Get category compatibility bonus
   */
  private getCategoryBonus(category1: string, category2: string): number {
    const compatibilityMatrix: Record<string, Record<string, number>> = {
      'Barn Doors': {
        'Hardware': 0.8,
        'Mirrors': 0.3,
        'Closet Systems': 0.6,
      },
      'Hardware': {
        'Barn Doors': 0.8,
        'Bifold Doors': 0.7,
        'Bypass Doors': 0.7,
      },
      'Closet Systems': {
        'Barn Doors': 0.6,
        'Bifold Doors': 0.6,
        'Bypass Doors': 0.6,
      },
    };

    return compatibilityMatrix[category1]?.[category2] || 0.1;
  }

  /**
   * Get style compatibility bonus
   */
  private getStyleBonus(styles1: string[], styles2: string[]): number {
    const set1 = new Set(styles1.map(s => s.toLowerCase()));
    const set2 = new Set(styles2.map(s => s.toLowerCase()));

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    return intersection.size / Math.max(set1.size, set2.size);
  }

  /**
   * Get complement reason text
   */
  private getComplementReason(product1: Product, product2: Product): string {
    if (product1.category === 'Barn Doors' && product2.category === 'Hardware') {
      return 'matching hardware for perfect installation';
    }
    if (product1.category === 'Hardware' && product2.category === 'Barn Doors') {
      return 'compatible door for this hardware';
    }
    if (product1.style.some(s => product2.style.includes(s))) {
      return 'shares the same style aesthetic';
    }
    return 'works great together';
  }

  /**
   * Remove duplicate recommendations
   */
  private removeDuplicates(recommendations: RecommendationResult[]): RecommendationResult[] {
    const seen = new Set<string>();
    return recommendations.filter(rec => {
      if (seen.has(rec.productId)) return false;
      seen.add(rec.productId);
      return true;
    });
  }

  /**
   * Update user behavior
   */
  updateUserBehavior(userId: string, behavior: Partial<UserBehavior>): void {
    const current = this.userBehaviors.get(userId) || {
      userId,
      viewedProducts: [],
      purchasedProducts: [],
      cartProducts: [],
      wishlistProducts: [],
      searchHistory: [],
      categoryPreferences: {},
      stylePreferences: [],
    };

    this.userBehaviors.set(userId, { ...current, ...behavior });
  }

  /**
   * Track product view
   */
  trackProductView(userId: string, productId: string): void {
    const behavior = this.userBehaviors.get(userId);
    if (behavior) {
      if (!behavior.viewedProducts.includes(productId)) {
        behavior.viewedProducts.push(productId);
      }
    }
  }

  /**
   * Track product purchase
   */
  trackProductPurchase(userId: string, productId: string): void {
    const behavior = this.userBehaviors.get(userId);
    if (behavior) {
      if (!behavior.purchasedProducts.includes(productId)) {
        behavior.purchasedProducts.push(productId);
      }
    }
  }

  /**
   * Load products (mock implementation)
   */
  private async loadProducts(): Promise<void> {
    // This would typically load from your database
    // For now, we'll create a mock dataset
    this.products = [
      {
        id: 'barn-1',
        name: 'Modern Pine Barn Door',
        category: 'Barn Doors',
        price: 899,
        description: 'Contemporary barn door with natural pine finish',
        features: ['Soft-close', 'Pre-drilled', 'Easy installation'],
        style: ['modern', 'rustic', 'contemporary'],
        materials: ['pine', 'metal'],
        colors: ['natural', 'brown'],
        popularity: 85,
        rating: 4.5,
        reviewCount: 127,
        tags: ['sliding', 'space-saving', 'stylish'],
      },
      // Add more products as needed
    ];
  }

  /**
   * Load user behaviors (mock implementation)
   */
  private loadUserBehaviors(): void {
    // This would typically load from your database
    // For now, we'll initialize with empty behaviors
  }
}

// Singleton instance
export const recommendationEngine = new AIRecommendationEngine();