/**
 * Dynamic Pricing Optimization System
 * Implements ML-based pricing strategies with demand forecasting and competitor analysis
 */

import { z } from 'zod';

// Product pricing schema
export const ProductPricingSchema = z.object({
  productId: z.string(),
  basePrice: z.number(),
  currentPrice: z.number(),
  cost: z.number(),
  category: z.string(),
  brand: z.string(),
  sku: z.string(),
  inventory: z.number(),
  demand: z.number(),
  conversionRate: z.number(),
  viewCount: z.number(),
  cartAdditions: z.number(),
  salesVelocity: z.number(),
  daysInStock: z.number(),
  seasonality: z.number().optional(),
  elasticity: z.number().optional(),
});

// Market data schema
export const MarketDataSchema = z.object({
  competitorPrices: z.array(z.object({
    competitor: z.string(),
    price: z.number(),
    availability: z.string(),
    lastUpdated: z.date(),
  })),
  marketDemand: z.number(),
  seasonIndex: z.number(),
  economicIndicators: z.object({
    inflationRate: z.number(),
    consumerConfidence: z.number(),
    housingMarket: z.number(),
  }),
  trends: z.array(z.object({
    keyword: z.string(),
    trend: z.number(),
    volume: z.number(),
  })),
});

// Pricing factors schema
export const PricingFactorsSchema = z.object({
  inventory: z.object({
    level: z.enum(['low', 'medium', 'high']),
    urgency: z.number().min(0).max(1),
    turnoverRate: z.number(),
  }),
  demand: z.object({
    current: z.number(),
    forecast: z.number(),
    trend: z.enum(['increasing', 'stable', 'decreasing']),
    elasticity: z.number(),
  }),
  competition: z.object({
    avgPrice: z.number(),
    lowestPrice: z.number(),
    highestPrice: z.number(),
    priceGap: z.number(),
    competitiveness: z.number().min(0).max(1),
  }),
  timing: z.object({
    daysInStock: z.number(),
    seasonMultiplier: z.number(),
    promotionActive: z.boolean(),
    weekend: z.boolean(),
    holiday: z.boolean(),
  }),
  customer: z.object({
    conversionRate: z.number(),
    avgOrderValue: z.number(),
    priceSensitivity: z.number(),
    loyaltySegment: z.enum(['new', 'occasional', 'regular', 'vip']),
  }),
});

export type ProductPricing = z.infer<typeof ProductPricingSchema>;
export type MarketData = z.infer<typeof MarketDataSchema>;
export type PricingFactors = z.infer<typeof PricingFactorsSchema>;

// Pricing recommendation schema
export const PricingRecommendationSchema = z.object({
  productId: z.string(),
  recommendedPrice: z.number(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  expectedImpact: z.object({
    revenueChange: z.number(),
    volumeChange: z.number(),
    marginChange: z.number(),
    competitivenessChange: z.number(),
  }),
  strategy: z.enum(['aggressive', 'balanced', 'conservative', 'premium']),
  urgency: z.enum(['immediate', 'within-week', 'within-month', 'monitor']),
  constraints: z.array(z.string()).optional(),
});

export type PricingRecommendation = z.infer<typeof PricingRecommendationSchema>;

export class DynamicPricingEngine {
  private pricingHistory: Map<string, ProductPricing[]> = new Map();
  private marketDataCache: Map<string, MarketData> = new Map();
  private pricingModels: Map<string, any> = new Map();
  private elasticityModels: Map<string, number> = new Map();

  constructor() {
    this.initializeModels();
  }

  private async initializeModels() {
    // Initialize pricing models for different product categories
    const categories = ['Barn Doors', 'Hardware', 'Closet Systems', 'Bifold Doors', 'Mirrors'];

    for (const category of categories) {
      this.pricingModels.set(category, await this.buildPricingModel(category));
    }
  }

  /**
   * Calculate optimal pricing for a product
   */
  async calculateOptimalPrice(
    productPricing: ProductPricing,
    marketData: MarketData,
    businessRules: {
      minMargin?: number;
      maxPriceChange?: number;
      priceFloor?: number;
      priceCeiling?: number;
      strategy?: 'aggressive' | 'balanced' | 'conservative' | 'premium';
    } = {}
  ): Promise<PricingRecommendation> {

    const pricingFactors = await this.analyzePricingFactors(productPricing, marketData);
    const strategy = businessRules.strategy || this.determineOptimalStrategy(pricingFactors);

    let recommendedPrice = productPricing.basePrice;
    const adjustments: { factor: string; value: number; weight: number }[] = [];

    // 1. Demand-based adjustment
    const demandAdjustment = this.calculateDemandAdjustment(pricingFactors.demand, strategy);
    adjustments.push({ factor: 'Demand', value: demandAdjustment, weight: 0.25 });

    // 2. Inventory-based adjustment
    const inventoryAdjustment = this.calculateInventoryAdjustment(pricingFactors.inventory, strategy);
    adjustments.push({ factor: 'Inventory', value: inventoryAdjustment, weight: 0.20 });

    // 3. Competition-based adjustment
    const competitionAdjustment = this.calculateCompetitionAdjustment(pricingFactors.competition, strategy);
    adjustments.push({ factor: 'Competition', value: competitionAdjustment, weight: 0.20 });

    // 4. Timing/seasonality adjustment
    const timingAdjustment = this.calculateTimingAdjustment(pricingFactors.timing);
    adjustments.push({ factor: 'Timing', value: timingAdjustment, weight: 0.15 });

    // 5. Customer behavior adjustment
    const customerAdjustment = this.calculateCustomerAdjustment(pricingFactors.customer, strategy);
    adjustments.push({ factor: 'Customer', value: customerAdjustment, weight: 0.20 });

    // Apply weighted adjustments
    let totalAdjustment = 0;
    for (const adj of adjustments) {
      totalAdjustment += adj.value * adj.weight;
    }

    recommendedPrice *= (1 + totalAdjustment);

    // Apply business constraints
    recommendedPrice = this.applyBusinessConstraints(recommendedPrice, productPricing, businessRules);

    // Calculate expected impact
    const expectedImpact = this.calculateExpectedImpact(
      productPricing,
      recommendedPrice,
      pricingFactors
    );

    // Generate reasoning
    const reasoning = this.generatePricingReasoning(adjustments, pricingFactors, strategy);

    // Calculate confidence
    const confidence = this.calculatePricingConfidence(pricingFactors, marketData);

    return {
      productId: productPricing.productId,
      recommendedPrice: Math.round(recommendedPrice * 100) / 100,
      confidence,
      reasoning,
      expectedImpact,
      strategy,
      urgency: this.determinePricingUrgency(pricingFactors),
      constraints: this.identifyConstraints(productPricing, recommendedPrice, businessRules),
    };
  }

  /**
   * Analyze pricing factors for a product
   */
  private async analyzePricingFactors(
    productPricing: ProductPricing,
    marketData: MarketData
  ): Promise<PricingFactors> {

    // Inventory analysis
    const inventory = {
      level: this.getInventoryLevel(productPricing.inventory),
      urgency: this.calculateInventoryUrgency(productPricing),
      turnoverRate: this.calculateTurnoverRate(productPricing),
    };

    // Demand analysis
    const demand = {
      current: productPricing.demand,
      forecast: this.forecastDemand(productPricing, marketData),
      trend: this.analyzeDemandTrend(productPricing),
      elasticity: await this.estimatePriceElasticity(productPricing),
    };

    // Competition analysis
    const competition = this.analyzeCompetition(productPricing, marketData);

    // Timing analysis
    const timing = {
      daysInStock: productPricing.daysInStock,
      seasonMultiplier: this.getSeasonMultiplier(productPricing.category, marketData),
      promotionActive: this.isPromotionActive(productPricing.productId),
      weekend: this.isWeekend(),
      holiday: this.isHoliday(),
    };

    // Customer analysis
    const customer = await this.analyzeCustomerBehavior(productPricing);

    return {
      inventory,
      demand,
      competition,
      timing,
      customer,
    };
  }

  /**
   * Calculate demand-based price adjustment
   */
  private calculateDemandAdjustment(
    demand: PricingFactors['demand'],
    strategy: string
  ): number {
    const { current, forecast, trend, elasticity } = demand;

    let adjustment = 0;

    // Trend-based adjustment
    if (trend === 'increasing') {
      adjustment += 0.05;
    } else if (trend === 'decreasing') {
      adjustment -= 0.05;
    }

    // Forecast vs current demand
    const demandGap = (forecast - current) / current;
    if (Math.abs(demandGap) > 0.1) {
      adjustment += demandGap * elasticity * 0.5;
    }

    // Strategy-based modifiers
    if (strategy === 'aggressive' && trend === 'increasing') {
      adjustment += 0.03;
    } else if (strategy === 'conservative' && trend === 'decreasing') {
      adjustment *= 0.5; // Reduce price cuts for conservative strategy
    }

    return Math.max(-0.20, Math.min(0.20, adjustment));
  }

  /**
   * Calculate inventory-based price adjustment
   */
  private calculateInventoryAdjustment(
    inventory: PricingFactors['inventory'],
    strategy: string
  ): number {
    const { level, urgency, turnoverRate } = inventory;

    let adjustment = 0;

    // Inventory level adjustment
    if (level === 'low') {
      adjustment += 0.05; // Premium pricing for low inventory
    } else if (level === 'high') {
      adjustment -= 0.03; // Discount for high inventory
    }

    // Urgency adjustment
    adjustment += urgency * 0.05;

    // Turnover rate adjustment
    if (turnoverRate < 0.5) { // Slow-moving
      adjustment -= 0.04;
    } else if (turnoverRate > 2) { // Fast-moving
      adjustment += 0.02;
    }

    // Strategy modifiers
    if (strategy === 'aggressive' && level === 'high') {
      adjustment -= 0.02; // More aggressive discounting
    }

    return Math.max(-0.15, Math.min(0.15, adjustment));
  }

  /**
   * Calculate competition-based price adjustment
   */
  private calculateCompetitionAdjustment(
    competition: PricingFactors['competition'],
    strategy: string
  ): number {
    const { avgPrice, lowestPrice, priceGap, competitiveness } = competition;

    let adjustment = 0;

    // Position relative to competition
    if (priceGap > 0.1) { // Priced significantly above average
      if (competitiveness < 0.7) { // Not competitive enough
        adjustment -= 0.05;
      }
    } else if (priceGap < -0.1) { // Priced significantly below average
      if (competitiveness > 0.8) { // Very competitive
        adjustment += 0.03; // Can increase price
      }
    }

    // Lowest price consideration
    if (lowestPrice < avgPrice * 0.8) {
      // Competitor with very low price exists
      if (strategy === 'aggressive') {
        adjustment -= 0.02; // Match or beat lowest price
      }
    }

    return Math.max(-0.10, Math.min(0.10, adjustment));
  }

  /**
   * Calculate timing-based price adjustment
   */
  private calculateTimingAdjustment(timing: PricingFactors['timing']): number {
    const { daysInStock, seasonMultiplier, promotionActive, weekend, holiday } = timing;

    let adjustment = 0;

    // Seasonality adjustment
    adjustment += (seasonMultiplier - 1) * 0.05;

    // Promotion adjustment
    if (promotionActive) {
      adjustment += 0.02; // Slight increase during promotions
    }

    // Weekend/holiday adjustment
    if (weekend || holiday) {
      adjustment += 0.01;
    }

    // Days in stock adjustment
    if (daysInStock > 180) { // Over 6 months
      adjustment -= 0.02; // Discount aging inventory
    } else if (daysInStock < 30) { // New product
      adjustment += 0.01; // Slight premium for new arrivals
    }

    return Math.max(-0.05, Math.min(0.05, adjustment));
  }

  /**
   * Calculate customer behavior-based price adjustment
   */
  private calculateCustomerAdjustment(
    customer: PricingFactors['customer'],
    strategy: string
  ): number {
    const { conversionRate, avgOrderValue, priceSensitivity, loyaltySegment } = customer;

    let adjustment = 0;

    // Conversion rate adjustment
    if (conversionRate > 0.05) { // High conversion
      adjustment += 0.02; // Can increase price
    } else if (conversionRate < 0.02) { // Low conversion
      adjustment -= 0.03; // May need price reduction
    }

    // Price sensitivity adjustment
    adjustment -= priceSensitivity * 0.05;

    // Loyalty segment adjustment
    if (loyaltySegment === 'vip' || loyaltySegment === 'regular') {
      adjustment += 0.01; // Less price-sensitive customers
    } else if (loyaltySegment === 'new') {
      adjustment -= 0.01; // More attractive pricing for new customers
    }

    // Average order value consideration
    if (avgOrderValue > 2000) { // High AOV
      adjustment += 0.01; // Can tolerate higher prices
    }

    return Math.max(-0.08, Math.min(0.08, adjustment));
  }

  /**
   * Apply business constraints to pricing
   */
  private applyBusinessConstraints(
    price: number,
    productPricing: ProductPricing,
    businessRules: any
  ): number {
    let constrainedPrice = price;

    // Minimum margin constraint
    if (businessRules.minMargin) {
      const minPrice = productPricing.cost * (1 + businessRules.minMargin);
      constrainedPrice = Math.max(constrainedPrice, minPrice);
    }

    // Price floor constraint
    if (businessRules.priceFloor) {
      constrainedPrice = Math.max(constrainedPrice, businessRules.priceFloor);
    }

    // Price ceiling constraint
    if (businessRules.priceCeiling) {
      constrainedPrice = Math.min(constrainedPrice, businessRules.priceCeiling);
    }

    // Maximum price change constraint
    if (businessRules.maxPriceChange) {
      const maxChange = productPricing.currentPrice * businessRules.maxPriceChange;
      const minPrice = productPricing.currentPrice - maxChange;
      const maxPrice = productPricing.currentPrice + maxChange;
      constrainedPrice = Math.max(minPrice, Math.min(maxPrice, constrainedPrice));
    }

    return constrainedPrice;
  }

  /**
   * Determine optimal pricing strategy
   */
  private determineOptimalStrategy(factors: PricingFactors): string {
    let score = { aggressive: 0, balanced: 0, conservative: 0, premium: 0 };

    // Inventory scoring
    if (factors.inventory.level === 'high') {
      score.aggressive += 2;
      score.balanced += 1;
    } else if (factors.inventory.level === 'low') {
      score.premium += 2;
      score.conservative += 1;
    }

    // Demand scoring
    if (factors.demand.trend === 'increasing') {
      score.premium += 2;
      score.aggressive += 1;
    } else if (factors.demand.trend === 'decreasing') {
      score.aggressive += 2;
      score.balanced += 1;
    }

    // Competition scoring
    if (factors.competition.competitiveness > 0.8) {
      score.premium += 1;
      score.conservative += 1;
    } else if (factors.competition.competitiveness < 0.5) {
      score.aggressive += 2;
      score.balanced += 1;
    }

    // Customer scoring
    if (factors.customer.priceSensitivity < 0.3) {
      score.premium += 2;
    } else if (factors.customer.priceSensitivity > 0.7) {
      score.aggressive += 2;
    }

    // Find best strategy
    let bestStrategy = 'balanced';
    let bestScore = score.balanced;

    for (const [strategy, s] of Object.entries(score)) {
      if (s > bestScore) {
        bestScore = s;
        bestStrategy = strategy;
      }
    }

    return bestStrategy;
  }

  /**
   * Generate pricing reasoning
   */
  private generatePricingReasoning(
    adjustments: any[],
    factors: PricingFactors,
    strategy: string
  ): string {
    const significantAdjustments = adjustments.filter(adj => Math.abs(adj.value) > 0.02);
    const reasons: string[] = [];

    for (const adj of significantAdjustments) {
      if (adj.factor === 'Demand' && adj.value > 0) {
        reasons.push('increasing demand allows for price increase');
      } else if (adj.factor === 'Demand' && adj.value < 0) {
        reasons.push('decreasing demand suggests price reduction');
      } else if (adj.factor === 'Inventory' && adj.value > 0) {
        reasons.push('low inventory levels support premium pricing');
      } else if (adj.factor === 'Inventory' && adj.value < 0) {
        reasons.push('high inventory requires competitive pricing');
      } else if (adj.factor === 'Competition' && adj.value > 0) {
        reasons.push('strong competitive position allows price increase');
      } else if (adj.factor === 'Competition' && adj.value < 0) {
        reasons.push('competitive pressure requires price adjustment');
      } else if (adj.factor === 'Timing' && adj.value > 0) {
        reasons.push('optimal timing for higher pricing');
      } else if (adj.factor === 'Customer' && adj.value > 0) {
        reasons.push('customer behavior supports price increase');
      } else if (adj.factor === 'Customer' && adj.value < 0) {
        reasons.push('customer price sensitivity suggests reduction');
      }
    }

    let reasoning = `Based on ${strategy} strategy, `;

    if (reasons.length > 0) {
      reasoning += reasons.join(', ') + '.';
    } else {
      reasoning += 'current market conditions support maintaining current price levels.';
    }

    return reasoning;
  }

  /**
   * Calculate pricing confidence
   */
  private calculatePricingConfidence(
    factors: PricingFactors,
    marketData: MarketData
  ): number {
    let confidence = 0.7; // Base confidence

    // Data quality factors
    if (factors.demand.forecast > 0) confidence += 0.1;
    if (factors.competition.competitiveness > 0.5) confidence += 0.05;
    if (marketData.competitorPrices.length > 3) confidence += 0.05;
    if (factors.customer.conversionRate > 0.01) confidence += 0.05;

    // Model confidence
    if (factors.demand.elasticity > 0) confidence += 0.05;

    return Math.min(0.95, confidence);
  }

  /**
   * Helper methods
   */
  private getInventoryLevel(inventory: number): 'low' | 'medium' | 'high' {
    if (inventory < 10) return 'low';
    if (inventory < 50) return 'medium';
    return 'high';
  }

  private calculateInventoryUrgency(productPricing: ProductPricing): number {
    const daysInStock = productPricing.daysInStock;
    if (daysInStock > 180) return 0.8;
    if (daysInStock > 90) return 0.5;
    if (daysInStock > 30) return 0.2;
    return 0;
  }

  private calculateTurnoverRate(productPricing: ProductPricing): number {
    return productPricing.salesVelocity / Math.max(productPricing.inventory, 1);
  }

  private async forecastDemand(
    productPricing: ProductPricing,
    marketData: MarketData
  ): number {
    // Simple linear forecasting - in production, use more sophisticated models
    const trend = marketData.marketDemand;
    const seasonality = marketData.seasonIndex;
    return productPricing.demand * trend * seasonality;
  }

  private analyzeDemandTrend(productPricing: ProductPricing): 'increasing' | 'stable' | 'decreasing' {
    // In production, analyze historical demand data
    if (productPricing.salesVelocity > 1) return 'increasing';
    if (productPricing.salesVelocity < 0.5) return 'decreasing';
    return 'stable';
  }

  private async estimatePriceElasticity(productPricing: ProductPricing): Promise<number> {
    // Return cached elasticity or calculate/estimate it
    return this.elasticityModels.get(productPricing.productId) || -1.5; // Default elasticity
  }

  private analyzeCompetition(
    productPricing: ProductPricing,
    marketData: MarketData
  ): PricingFactors['competition'] {
    const competitorPrices = marketData.competitorPrices.map(cp => cp.price);
    const avgPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
    const lowestPrice = Math.min(...competitorPrices);
    const highestPrice = Math.max(...competitorPrices);

    const priceGap = (productPricing.currentPrice - avgPrice) / avgPrice;
    const competitiveness = Math.max(0, 1 - Math.abs(priceGap));

    return {
      avgPrice,
      lowestPrice,
      highestPrice,
      priceGap,
      competitiveness,
    };
  }

  private getSeasonMultiplier(category: string, marketData: MarketData): number {
    // Category-specific seasonality
    const baseMultiplier = marketData.seasonIndex;

    // Adjust for category-specific patterns
    if (category === 'Barn Doors') {
      return baseMultiplier * 1.1; // Higher demand in certain seasons
    }

    return baseMultiplier;
  }

  private isPromotionActive(productId: string): boolean {
    // Check if product is currently in promotion
    return false; // Placeholder
  }

  private isWeekend(): boolean {
    const now = new Date();
    return now.getDay() === 0 || now.getDay() === 6;
  }

  private isHoliday(): boolean {
    // Check if current date is a holiday
    return false; // Placeholder
  }

  private async analyzeCustomerBehavior(productPricing: ProductPricing): Promise<PricingFactors['customer']> {
    // In production, this would analyze actual customer data
    return {
      conversionRate: productPricing.conversionRate,
      avgOrderValue: 1500, // Placeholder
      priceSensitivity: 0.5, // Placeholder
      loyaltySegment: 'occasional', // Placeholder
    };
  }

  private calculateExpectedImpact(
    productPricing: ProductPricing,
    newPrice: number,
    factors: PricingFactors
  ) {
    const priceChange = (newPrice - productPricing.currentPrice) / productPricing.currentPrice;
    const elasticity = factors.demand.elasticity || -1.5;

    const volumeChange = priceChange * elasticity;
    const revenueChange = (1 + priceChange) * (1 + volumeChange) - 1;
    const marginChange = ((newPrice - productPricing.cost) / newPrice) -
                         ((productPricing.currentPrice - productPricing.cost) / productPricing.currentPrice);

    return {
      revenueChange,
      volumeChange,
      marginChange,
      competitivenessChange: priceChange,
    };
  }

  private determinePricingUrgency(factors: PricingFactors): 'immediate' | 'within-week' | 'within-month' | 'monitor' {
    if (factors.inventory.urgency > 0.7) return 'immediate';
    if (factors.demand.trend === 'decreasing' && factors.demand.forecast < factors.demand.current * 0.8) return 'within-week';
    if (factors.competition.competitiveness < 0.5) return 'within-week';
    if (factors.timing.seasonMultiplier > 1.2 || factors.timing.seasonMultiplier < 0.8) return 'within-month';
    return 'monitor';
  }

  private identifyConstraints(
    productPricing: ProductPricing,
    recommendedPrice: number,
    businessRules: any
  ): string[] {
    const constraints: string[] = [];

    const marginChange = ((recommendedPrice - productPricing.cost) / recommendedPrice) -
                       ((productPricing.currentPrice - productPricing.cost) / productPricing.currentPrice);

    if (businessRules.minMargin && marginChange < 0) {
      constraints.push('Minimum margin requirement');
    }

    if (Math.abs(recommendedPrice - productPricing.currentPrice) / productPricing.currentPrice > 0.15) {
      constraints.push('Large price change requires management approval');
    }

    return constraints;
  }

  private async buildPricingModel(category: string): Promise<any> {
    // In production, this would build ML models for each category
    return {
      category,
      modelType: 'linear_regression',
      accuracy: 0.85,
    };
  }

  /**
   * Batch pricing optimization for multiple products
   */
  async optimizeBatchPricing(
    products: ProductPricing[],
    marketData: MarketData,
    businessRules: any = {}
  ): Promise<PricingRecommendation[]> {
    const recommendations: PricingRecommendation[] = [];

    for (const product of products) {
      const recommendation = await this.calculateOptimalPrice(product, marketData, businessRules);
      recommendations.push(recommendation);
    }

    return recommendations;
  }

  /**
   * Update pricing history
   */
  updatePricingHistory(productId: string, pricingData: ProductPricing): void {
    const history = this.pricingHistory.get(productId) || [];
    history.push(pricingData);

    // Keep only last 90 days of history
    if (history.length > 90) {
      history.splice(0, history.length - 90);
    }

    this.pricingHistory.set(productId, history);
  }

  /**
   * Get pricing insights
   */
  getPricingInsights(productId: string): any {
    const history = this.pricingHistory.get(productId) || [];

    if (history.length < 2) {
      return { error: 'Insufficient data for insights' };
    }

    const latest = history[history.length - 1];
    const previous = history[history.length - 2];

    return {
      priceTrend: latest.currentPrice > previous.currentPrice ? 'increasing' : 'decreasing',
      priceChange: ((latest.currentPrice - previous.currentPrice) / previous.currentPrice) * 100,
      demandTrend: latest.demand > previous.demand ? 'increasing' : 'decreasing',
      inventoryTurnover: latest.salesVelocity / latest.inventory,
      daysInStock: latest.daysInStock,
    };
  }
}

// Singleton instance
export const dynamicPricingEngine = new DynamicPricingEngine();