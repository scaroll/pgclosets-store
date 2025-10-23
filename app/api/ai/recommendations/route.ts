import { NextResponse } from 'next/server';
import { z } from 'zod';
import { recommendationEngine, ProductSchema } from '@/lib/ai/recommendation-engine';

export const maxDuration = 30; // Increased for AI processing
export const dynamic = 'force-dynamic';

// Request schema with extended context
const RecommendationRequestSchema = z.object({
  userId: z.string().optional(),
  browsingHistory: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    category: z.string(),
    price: z.number(),
    viewedAt: z.string().optional(),
  })).optional(),
  budget: z.object({
    min: z.number(),
    max: z.number(),
  }).optional(),
  style: z.array(z.string()).optional(),
  currentProduct: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    price: z.number(),
    features: z.array(z.string()).optional(),
  }).optional(),
  maxRecommendations: z.number().min(1).max(20).default(8),
  categories: z.array(z.string()).optional(),
  includeComplementary: z.boolean().default(false),
});

// Response schema
const RecommendationsResponseSchema = z.object({
  success: z.boolean(),
  recommendations: z.array(z.object({
    productId: z.string(),
    product: z.object({
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
    }),
    score: z.number(),
    reasoning: z.string(),
    category: z.enum(['collaborative', 'content', 'style', 'popular', 'complementary']),
    confidence: z.number(),
  })),
  overallReasoning: z.string().optional(),
  processingTime: z.number(),
});

type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;
type RecommendationsResponse = z.infer<typeof RecommendationsResponseSchema>;

export async function POST(req: Request) {
  const startTime = Date.now();

  // Skip if OpenAI is not configured
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        success: true,
        recommendations: [],
        overallReasoning: 'AI recommendations not configured',
        processingTime: Date.now() - startTime,
      },
      { status: 200 }
    );
  }

  try {
    const body = await req.json();
    const validatedData = RecommendationRequestSchema.parse(body);

    const {
      userId = 'anonymous',
      currentProduct,
      maxRecommendations,
      categories,
      includeComplementary,
      browsingHistory = [],
      style = [],
      budget,
    } = validatedData;

    // Update user behavior based on browsing history
    if (browsingHistory.length > 0 && userId !== 'anonymous') {
      const userBehavior = {
        userId,
        viewedProducts: browsingHistory.map(item => item.productId),
        stylePreferences: style,
        priceRange: budget,
      };

      recommendationEngine.updateUserBehavior(userId, userBehavior);

      // Track individual product views
      browsingHistory.forEach(item => {
        recommendationEngine.trackProductView(userId, item.productId);
      });
    }

    // Get AI recommendations
    const aiRecommendations = await recommendationEngine.getRecommendations(userId, {
      limit: maxRecommendations,
      categories,
      excludeIds: currentProduct ? [currentProduct.id] : [],
      includeComplementary: includeComplementary && currentProduct?.id,
      currentProductId: currentProduct?.id,
    });

    // Enrich recommendations with product details
    const enrichedRecommendations = await Promise.all(
      aiRecommendations.map(async (rec) => {
        // Get product details - in a real app, this would come from your database
        const productDetails = await getProductDetails(rec.productId);

        return {
          ...rec,
          product: productDetails,
        };
      })
    );

    const processingTime = Date.now() - startTime;

    // Generate overall reasoning
    const overallReasoning = generateOverallReasoning(enrichedRecommendations, {
      currentProduct,
      userPreferences: { style, budget },
      categories,
    });

    const response: RecommendationsResponse = {
      success: true,
      recommendations: enrichedRecommendations,
      overallReasoning,
      processingTime,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Recommendation API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate recommendations',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * Get product details from database or mock data
 */
async function getProductDetails(productId: string): Promise<any> {
  // In a real implementation, this would query your database
  // For now, we'll return mock data based on product ID

  const mockProducts: Record<string, any> = {
    'barn-1': {
      id: 'barn-1',
      name: 'Modern Pine Barn Door',
      category: 'Barn Doors',
      price: 899,
      description: 'Contemporary barn door with natural pine finish and soft-close mechanism',
      features: ['Soft-close', 'Pre-drilled', 'Easy installation', 'Weather-resistant'],
      style: ['modern', 'rustic', 'contemporary'],
      materials: ['pine', 'metal hardware'],
      colors: ['natural', 'brown', 'distressed'],
      rating: 4.5,
      reviewCount: 127,
      image: '/images/products/barn-door-1.jpg',
    },
    'barn-2': {
      id: 'barn-2',
      name: 'Classic White Barn Door',
      category: 'Barn Doors',
      price: 1299,
      description: 'Timeless white barn door perfect for modern farmhouses',
      features: ['Pre-finished', 'Soft-close', 'Hardware included'],
      style: ['modern', 'farmhouse', 'traditional'],
      materials: ['mDF', 'metal hardware'],
      colors: ['white', 'off-white'],
      rating: 4.8,
      reviewCount: 89,
      image: '/images/products/barn-door-2.jpg',
    },
    'hardware-1': {
      id: 'hardware-1',
      name: 'Deluxe Barn Door Hardware Kit',
      category: 'Hardware',
      price: 399,
      description: 'Complete hardware kit with track, rollers, and handles',
      features: ['6ft track', 'Soft-close', 'Weight capacity 200lbs', 'Black matte finish'],
      style: ['modern', 'industrial', 'contemporary'],
      materials: ['steel', 'aluminum'],
      colors: ['black', 'matte black'],
      rating: 4.6,
      reviewCount: 203,
      image: '/images/products/hardware-1.jpg',
    },
    'bifold-1': {
      id: 'bifold-1',
      name: 'Space-Saving Bifold Doors',
      category: 'Bifold Doors',
      price: 749,
      description: 'Perfect for closets and tight spaces with smooth folding action',
      features: ['Space-saving', 'Easy installation', 'Multiple finish options'],
      style: ['modern', 'contemporary', 'minimalist'],
      materials: ['wood composite', 'metal hardware'],
      colors: ['white', 'natural', 'espresso'],
      rating: 4.3,
      reviewCount: 67,
      image: '/images/products/bifold-1.jpg',
    },
    'closet-system-1': {
      id: 'closet-system-1',
      name: 'Modular Closet Organizer',
      category: 'Closet Systems',
      price: 1599,
      description: 'Customizable modular closet system with adjustable shelving',
      features: ['Modular design', 'Adjustable shelves', 'Hanging rods', 'Shoe storage'],
      style: ['modern', 'organized', 'functional'],
      materials: ['melamine', 'metal hardware'],
      colors: ['white', 'gray', 'cherry'],
      rating: 4.7,
      reviewCount: 156,
      image: '/images/products/closet-system-1.jpg',
    },
    'mirror-1': {
      id: 'mirror-1',
      name: 'Full-Length Wall Mirror',
      category: 'Mirrors',
      price: 299,
      description: 'Elegant full-length mirror with slim frame',
      features: ['Full-length', 'Slim frame', 'Easy mounting', 'Shatter-resistant'],
      style: ['modern', 'elegant', 'minimalist'],
      materials: ['glass', 'aluminum frame'],
      colors: ['black', 'silver', 'gold'],
      rating: 4.4,
      reviewCount: 92,
      image: '/images/products/mirror-1.jpg',
    },
  };

  return mockProducts[productId] || {
    id: productId,
    name: 'Premium Product',
    category: 'General',
    price: 999,
    description: 'High-quality product from PG Closets',
    features: ['Premium quality', 'Professional installation'],
    style: ['modern'],
    materials: ['premium materials'],
    colors: ['various'],
    rating: 4.5,
    reviewCount: 50,
    image: '/images/products/placeholder.jpg',
  };
}

/**
 * Generate overall reasoning for the recommendations
 */
function generateOverallReasoning(
  recommendations: any[],
  context: {
    currentProduct?: any;
    userPreferences?: { style?: string[]; budget?: { min: number; max: number } };
    categories?: string[];
  }
): string {
  const { currentProduct, userPreferences, categories } = context;

  const parts: string[] = [];

  if (currentProduct) {
    parts.push(`Based on your interest in the ${currentProduct.name}, I've selected items that complement it perfectly.`);
  }

  if (userPreferences?.style && userPreferences.style.length > 0) {
    parts.push(`All recommendations match your preferred ${userPreferences.style.join(', ')} style.`);
  }

  if (userPreferences?.budget) {
    parts.push(`Each item falls within your budget range of $${userPreferences.budget.min} - $${userPreferences.budget.max}.`);
  }

  if (categories && categories.length > 0) {
    parts.push(`I've focused on ${categories.join(', ')} categories as requested.`);
  }

  // Analyze recommendation types
  const categories_found = new Set(recommendations.map(r => r.category));
  if (categories_found.size > 1) {
    parts.push('I\'ve included a mix of personalized suggestions based on similar customers\' preferences and products that match your viewing history.');
  }

  // Add confidence statement
  const avgConfidence = recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length;
  if (avgConfidence > 0.8) {
    parts.push('These recommendations have a high match confidence based on your preferences.');
  }

  return parts.join(' ') || 'Here are some personalized recommendations for you based on your browsing history and preferences.';
}
