import { NextResponse } from 'next/server';
// import { z } from 'zod';
// import { ProductRecommendationSchema } from '@/lib/ai/schemas';

export const maxDuration = 1;

// Request schema with extended context
// const RecommendationRequestSchema = z.object({
//   userId: z.string().optional(),
//   browsingHistory: z.array(z.object({
//     productId: z.string(),
//     name: z.string(),
//     category: z.string(),
//     price: z.number(),
//     viewedAt: z.string().optional(),
//   })).optional(),
//   budget: z.object({
//     min: z.number(),
//     max: z.number(),
//   }).optional(),
//   style: z.array(z.string()).optional(),
//   currentProduct: z.object({
//     id: z.string(),
//     name: z.string(),
//     category: z.string(),
//     price: z.number(),
//     features: z.array(z.string()).optional(),
//   }).optional(),
//   maxRecommendations: z.number().min(1).max(10).default(5),
// });

// Response schema
// const RecommendationsResponseSchema = z.object({
//   recommendations: z.array(ProductRecommendationSchema),
//   reasoning: z.string().describe('Overall recommendation strategy explanation'),
// });

// type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;
// type RecommendationsResponse = z.infer<typeof RecommendationsResponseSchema>;

/**
 * Calculate similarity score between two products based on features
 */
// function calculateSimilarityScore(
//   product1Features: string[],
//   product2Features: string[]
// ): number {
//   if (!product1Features.length || !product2Features.length) return 0;

//   const set1 = new Set(product1Features.map(f => f.toLowerCase()));
//   const set2 = new Set(product2Features.map(f => f.toLowerCase()));

//   const intersection = [...set1].filter(f => set2.has(f)).length;
//   const union = new Set([...set1, ...set2]).size;

//   return intersection / union;
// }

/**
 * Build context prompt from request data
 */
// function buildContextPrompt(request: RecommendationRequest): string {
//   const parts: string[] = [
//     'You are an expert product recommendation system for PG Closets, specializing in premium closet doors and storage solutions.',
//     '',
//   ];

//   // Current product context
//   if (request.currentProduct) {
//     parts.push('Customer is currently viewing:');
//     parts.push(`- ${request.currentProduct.name} ($${request.currentProduct.price.toFixed(2)})`);
//     parts.push(`- Category: ${request.currentProduct.category}`);
//     if (request.currentProduct.features?.length) {
//       parts.push(`- Features: ${request.currentProduct.features.join(', ')}`);
//     }
//     parts.push('');
//   }

//   // Browsing history context
//   if (request.browsingHistory?.length) {
//     parts.push('Recent browsing history:');
//     request.browsingHistory.slice(0, 5).forEach((item) => {
//       parts.push(`- ${item.name} (${item.category}) - $${item.price.toFixed(2)}`);
//     });
//     parts.push('');
//   }

//   // Budget constraints
//   if (request.budget) {
//     parts.push(`Budget range: $${request.budget.min.toFixed(2)} - $${request.budget.max.toFixed(2)}`);
//     parts.push('');
//   }

//   // Style preferences
//   if (request.style?.length) {
//     parts.push(`Style preferences: ${request.style.join(', ')}`);
//     parts.push('');
//   }

//   // Product catalog context
//   parts.push('Available product categories:');
//   parts.push('- Barn Doors (modern, rustic, contemporary styles)');
//   parts.push('- Bifold Doors (space-saving, versatile)');
//   parts.push('- Bypass Doors (classic sliding, efficient)');
//   parts.push('- Pivot Doors (statement pieces, luxury)');
//   parts.push('- Room Dividers (functional, decorative)');
//   parts.push('- Hardware (tracks, handles, soft-close)');
//   parts.push('- Closet Systems (Renin modular, custom)');
//   parts.push('- Mirrors (full-length, decorative)');
//   parts.push('');

//   parts.push('Provide recommendations that:');
//   parts.push('1. Match the customer\'s budget (if specified)');
//   parts.push('2. Complement their browsing history and style preferences');
//   parts.push('3. Include complementary products (e.g., hardware with doors)');
//   parts.push('4. Offer variety in price points and styles');
//   parts.push('5. Have clear reasoning for each recommendation');

//   return parts.join('\n');
// }

export async function POST(_req: Request) {
  return NextResponse.json(
    {
      success: false,
      error: 'AI recommendations are temporarily disabled',
    },
    { status: 503 },
  )
}
