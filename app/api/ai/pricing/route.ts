import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dynamicPricingEngine, ProductPricingSchema, MarketDataSchema } from '@/lib/ai/dynamic-pricing';

export const maxDuration = 15;

// Request schema
const PricingRequestSchema = z.object({
  product: ProductPricingSchema,
  marketData: MarketDataSchema.optional(),
  businessRules: z.object({
    minMargin: z.number().optional(),
    maxPriceChange: z.number().optional(),
    priceFloor: z.number().optional(),
    priceCeiling: z.number().optional(),
    strategy: z.enum(['aggressive', 'balanced', 'conservative', 'premium']).optional(),
  }).optional(),
  batchMode: z.boolean().default(false),
  products: z.array(ProductPricingSchema).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = PricingRequestSchema.parse(body);

    const { product, marketData, businessRules, batchMode, products } = validatedData;

    // Get market data if not provided
    const finalMarketData = marketData || await fetchMarketData();

    if (batchMode && products) {
      // Batch optimization
      const recommendations = await dynamicPricingEngine.optimizeBatchPricing(
        products,
        finalMarketData,
        businessRules
      );

      // Update pricing history for all products
      products.forEach(p => {
        dynamicPricingEngine.updatePricingHistory(p.productId, p);
      });

      return NextResponse.json({
        success: true,
        recommendations,
        insights: products.map(p => dynamicPricingEngine.getPricingInsights(p.productId)),
        timestamp: new Date().toISOString(),
      });
    } else {
      // Single product optimization
      const recommendation = await dynamicPricingEngine.calculateOptimalPrice(
        product,
        finalMarketData,
        businessRules
      );

      // Update pricing history
      dynamicPricingEngine.updatePricingHistory(product.productId, product);

      // Get additional insights
      const insights = dynamicPricingEngine.getPricingInsights(product.productId);

      return NextResponse.json({
        success: true,
        recommendation,
        insights,
        marketData: finalMarketData,
        timestamp: new Date().toISOString(),
      });
    }

  } catch (error) {
    console.error('Pricing API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate optimal pricing',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * Fetch market data from various sources
 */
async function fetchMarketData(): Promise<any> {
  // In production, this would fetch from multiple APIs:
  // - Competitor pricing APIs
  // - Market trend APIs
  // - Economic indicators
  // - Search trend data

  return {
    competitorPrices: [
      {
        competitor: 'HomeDepot',
        price: 949,
        availability: 'in-stock',
        lastUpdated: new Date(),
      },
      {
        competitor: 'Lowes',
        price: 929,
        availability: 'in-stock',
        lastUpdated: new Date(),
      },
      {
        competitor: 'Wayfair',
        price: 899,
        availability: 'limited',
        lastUpdated: new Date(),
      },
    ],
    marketDemand: 1.1, // 10% above baseline
    seasonIndex: 1.2, // Seasonal demand is 20% higher
    economicIndicators: {
      inflationRate: 0.028,
      consumerConfidence: 122.5,
      housingMarket: 1.15,
    },
    trends: [
      {
        keyword: 'barn doors',
        trend: 0.15,
        volume: 12500,
      },
      {
        keyword: 'closet organization',
        trend: 0.08,
        volume: 8900,
      },
      {
        keyword: 'modern interior doors',
        trend: 0.12,
        volume: 6700,
      },
    ],
  };
}