import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { ProductRecommendationSchema } from '@/lib/ai/schemas';
import { NextResponse } from 'next/server';

// Allow up to 15 seconds for AI generation
export const maxDuration = 15;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  maxRecommendations: z.number().min(1).max(10).default(5),
});

// Response schema
const RecommendationsResponseSchema = z.object({
  recommendations: z.array(ProductRecommendationSchema),
  reasoning: z.string().describe('Overall recommendation strategy explanation'),
});

type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;
type RecommendationsResponse = z.infer<typeof RecommendationsResponseSchema>;

/**
 * Calculate similarity score between two products based on features
 */
function calculateSimilarityScore(
  product1Features: string[],
  product2Features: string[]
): number {
  if (!product1Features.length || !product2Features.length) return 0;

  const set1 = new Set(product1Features.map(f => f.toLowerCase()));
  const set2 = new Set(product2Features.map(f => f.toLowerCase()));

  const intersection = [...set1].filter(f => set2.has(f)).length;
  const union = new Set([...set1, ...set2]).size;

  return intersection / union;
}

/**
 * Build context prompt from request data
 */
function buildContextPrompt(request: RecommendationRequest): string {
  const parts: string[] = [
    'You are an expert product recommendation system for PG Closets, specializing in premium closet doors and storage solutions.',
    '',
  ];

  // Current product context
  if (request.currentProduct) {
    parts.push('Customer is currently viewing:');
    parts.push(`- ${request.currentProduct.name} ($${request.currentProduct.price.toFixed(2)})`);
    parts.push(`- Category: ${request.currentProduct.category}`);
    if (request.currentProduct.features?.length) {
      parts.push(`- Features: ${request.currentProduct.features.join(', ')}`);
    }
    parts.push('');
  }

  // Browsing history context
  if (request.browsingHistory?.length) {
    parts.push('Recent browsing history:');
    request.browsingHistory.slice(0, 5).forEach((item) => {
      parts.push(`- ${item.name} (${item.category}) - $${item.price.toFixed(2)}`);
    });
    parts.push('');
  }

  // Budget constraints
  if (request.budget) {
    parts.push(`Budget range: $${request.budget.min.toFixed(2)} - $${request.budget.max.toFixed(2)}`);
    parts.push('');
  }

  // Style preferences
  if (request.style?.length) {
    parts.push(`Style preferences: ${request.style.join(', ')}`);
    parts.push('');
  }

  // Product catalog context
  parts.push('Available product categories:');
  parts.push('- Barn Doors (modern, rustic, contemporary styles)');
  parts.push('- Bifold Doors (space-saving, versatile)');
  parts.push('- Bypass Doors (classic sliding, efficient)');
  parts.push('- Pivot Doors (statement pieces, luxury)');
  parts.push('- Room Dividers (functional, decorative)');
  parts.push('- Hardware (tracks, handles, soft-close)');
  parts.push('- Closet Systems (Renin modular, custom)');
  parts.push('- Mirrors (full-length, decorative)');
  parts.push('');

  parts.push('Provide recommendations that:');
  parts.push('1. Match the customer\'s budget (if specified)');
  parts.push('2. Complement their browsing history and style preferences');
  parts.push('3. Include complementary products (e.g., hardware with doors)');
  parts.push('4. Offer variety in price points and styles');
  parts.push('5. Have clear reasoning for each recommendation');

  return parts.join('\n');
}

export async function POST(req: Request) {
  try {
    // Parse and validate request
    const body = await req.json();
    const validatedRequest = RecommendationRequestSchema.parse(body);

    // Build context prompt
    const systemPrompt = buildContextPrompt(validatedRequest);

    // Generate structured recommendations using AI
    const { object } = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: RecommendationsResponseSchema,
      prompt: `Generate ${validatedRequest.maxRecommendations} product recommendations based on the context provided. Each recommendation should include a realistic product from PG Closets' catalog with appropriate pricing ($200-$3000 range for doors, $50-$500 for hardware).`,
      system: systemPrompt,
    });

    // Post-process recommendations with similarity scoring
    const processedRecommendations = object.recommendations.map((rec) => {
      let adjustedScore = rec.matchScore;

      // Adjust score based on browsing history similarity
      if (validatedRequest.browsingHistory?.length) {
        const historyCategories = validatedRequest.browsingHistory.map(h => h.category);
        if (historyCategories.includes(rec.category)) {
          adjustedScore = Math.min(1, adjustedScore + 0.1);
        }
      }

      // Adjust score based on current product similarity
      if (validatedRequest.currentProduct?.features && rec.features) {
        const similarity = calculateSimilarityScore(
          validatedRequest.currentProduct.features,
          rec.features
        );
        adjustedScore = Math.min(1, adjustedScore + similarity * 0.15);
      }

      // Budget fit adjustment
      if (validatedRequest.budget) {
        const { min, max } = validatedRequest.budget;
        if (rec.price < min || rec.price > max) {
          adjustedScore = Math.max(0, adjustedScore - 0.2);
        }
      }

      return {
        ...rec,
        matchScore: Math.round(adjustedScore * 100) / 100, // Round to 2 decimals
      };
    });

    // Sort by match score descending
    processedRecommendations.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      recommendations: processedRecommendations,
      reasoning: object.reasoning,
      metadata: {
        requestId: crypto.randomUUID(),
        generatedAt: new Date().toISOString(),
        count: processedRecommendations.length,
      },
    });

  } catch (error) {
    console.error('AI recommendations error:', error);

    // Validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // AI generation errors
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate recommendations',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
