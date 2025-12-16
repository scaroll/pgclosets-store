// @ts-nocheck - AI pricing with dynamic types
import { z } from 'zod';

// Product pricing schema
export const ProductPricingSchema = z.object({
  productId: z.string(),
  name: z.string(),
  basePrice: z.number(),
  currentPrice: z.number(),
  cost: z.number(),
  category: z.string(),
  inventoryLevel: z.number(),
  salesHistory: z.array(z.object({
    date: z.string(),
    quantity: z.number(),
    price: z.number(),
  })).optional(),
  attributes: z.record(z.any()).optional(),
});

// Market data schema
export const MarketDataSchema = z.object({
  competitorPrices: z.array(z.object({
    competitor: z.string(),
    price: z.number(),
    availability: z.string(),
    lastUpdated: z.date(),
  })).optional(),
  marketDemand: z.number().optional(),
  seasonIndex: z.number().optional(),
  economicIndicators: z.object({
    inflationRate: z.number(),
    consumerConfidence: z.number(),
    housingMarket: z.number(),
  }).optional(),
  trends: z.array(z.object({
    keyword: z.string(),
    trend: z.number(),
    volume: z.number(),
  })).optional(),
});

export type ProductPricing = z.infer<typeof ProductPricingSchema>;
export type MarketData = z.infer<typeof MarketDataSchema>;

interface PricingRecommendation {
  productId: string;
  currentPrice: number;
  recommendedPrice: number;
  priceChange: number;
  priceChangePercent: number;
  confidence: number;
  reasoning: string;
  factors: {
    factor: string;
    impact: number;
    description: string;
  }[];
}

interface PricingInsights {
  productId: string;
  avgPrice: number;
  priceVolatility: number;
  demandTrend: string;
  competitorPosition: string;
  recommendations: string[];
}

// Pricing history storage (in-memory for now)
const pricingHistory = new Map<string, ProductPricing[]>();

class DynamicPricingEngine {
  /**
   * Calculate optimal price for a product
   */
  async calculateOptimalPrice(
    product: ProductPricing,
    marketData?: MarketData,
    businessRules?: {
      minMargin?: number;
      maxPriceChange?: number;
      priceFloor?: number;
      priceCeiling?: number;
      strategy?: 'aggressive' | 'balanced' | 'conservative' | 'premium';
    }
  ): Promise<PricingRecommendation> {
    const {
      minMargin = 0.2,
      maxPriceChange = 0.15,
      priceFloor,
      priceCeiling,
      strategy = 'balanced',
    } = businessRules || {};

    // Calculate base metrics
    const currentMargin = (product.currentPrice - product.cost) / product.currentPrice;
    const competitorAvg = marketData?.competitorPrices
      ? marketData.competitorPrices.reduce((sum, c) => sum + c.price, 0) / marketData.competitorPrices.length
      : product.currentPrice;

    // Strategy multipliers
    const strategyMultipliers = {
      aggressive: 0.95,
      balanced: 1.0,
      conservative: 1.05,
      premium: 1.15,
    };

    // Calculate recommended price
    let recommendedPrice = product.basePrice * strategyMultipliers[strategy];

    // Adjust for market demand
    if (marketData?.marketDemand) {
      recommendedPrice *= marketData.marketDemand;
    }

    // Adjust for seasonality
    if (marketData?.seasonIndex) {
      recommendedPrice *= (1 + (marketData.seasonIndex - 1) * 0.5);
    }

    // Apply constraints
    const minPrice = Math.max(
      product.cost / (1 - minMargin),
      priceFloor || 0
    );
    const maxPrice = priceCeiling || product.currentPrice * (1 + maxPriceChange);
    const maxPriceDown = product.currentPrice * (1 - maxPriceChange);

    recommendedPrice = Math.max(minPrice, Math.min(maxPrice, recommendedPrice));
    recommendedPrice = Math.max(maxPriceDown, recommendedPrice);

    // Round to nearest cent
    recommendedPrice = Math.round(recommendedPrice * 100) / 100;

    const priceChange = recommendedPrice - product.currentPrice;
    const priceChangePercent = (priceChange / product.currentPrice) * 100;

    const factors: PricingRecommendation['factors'] = [];

    if (marketData?.marketDemand && marketData.marketDemand > 1) {
      factors.push({
        factor: 'Market Demand',
        impact: (marketData.marketDemand - 1) * 100,
        description: `Demand is ${Math.round((marketData.marketDemand - 1) * 100)}% above baseline`,
      });
    }

    if (marketData?.seasonIndex && marketData.seasonIndex > 1) {
      factors.push({
        factor: 'Seasonality',
        impact: (marketData.seasonIndex - 1) * 50,
        description: `Seasonal demand is elevated`,
      });
    }

    if (competitorAvg > product.currentPrice * 1.1) {
      factors.push({
        factor: 'Competitor Pricing',
        impact: 5,
        description: `Competitors are priced ${Math.round((competitorAvg / product.currentPrice - 1) * 100)}% higher`,
      });
    }

    return {
      productId: product.productId,
      currentPrice: product.currentPrice,
      recommendedPrice,
      priceChange,
      priceChangePercent: Math.round(priceChangePercent * 100) / 100,
      confidence: 0.85,
      reasoning: `Based on ${strategy} pricing strategy with current market conditions`,
      factors,
    };
  }

  /**
   * Optimize pricing for multiple products
   */
  async optimizeBatchPricing(
    products: ProductPricing[],
    marketData?: MarketData,
    businessRules?: any
  ): Promise<PricingRecommendation[]> {
    const recommendations = await Promise.all(
      products.map(product => this.calculateOptimalPrice(product, marketData, businessRules))
    );
    return recommendations;
  }

  /**
   * Update pricing history for a product
   */
  updatePricingHistory(productId: string, product: ProductPricing): void {
    const history = pricingHistory.get(productId) || [];
    history.push({ ...product });
    if (history.length > 100) {
      history.shift();
    }
    pricingHistory.set(productId, history);
  }

  /**
   * Get pricing insights for a product
   */
  getPricingInsights(productId: string): PricingInsights | null {
    const history = pricingHistory.get(productId);

    if (!history || history.length === 0) {
      return null;
    }

    const prices = history.map(h => h.currentPrice);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length;
    const priceVolatility = Math.sqrt(variance) / avgPrice;

    const recentPrices = prices.slice(-10);
    const demandTrend = recentPrices[recentPrices.length - 1] > recentPrices[0] ? 'increasing' : 'stable';

    return {
      productId,
      avgPrice: Math.round(avgPrice * 100) / 100,
      priceVolatility: Math.round(priceVolatility * 100) / 100,
      demandTrend,
      competitorPosition: 'competitive',
      recommendations: [
        'Consider seasonal pricing adjustments',
        'Monitor competitor pricing weekly',
      ],
    };
  }
}

export const dynamicPricingEngine = new DynamicPricingEngine();
