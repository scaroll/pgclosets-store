import { tool } from 'ai';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import {
  sanitizeProductId,
  sanitizeSearchQuery,
  sanitizeText,
  validatePositiveNumber,
  validateArraySize,
} from '@/lib/input-validation';

/**
 * Product Search Tool for AI SDK 5
 * Integrated with Prisma database and proper input validation
 */

// Product category enum matching database schema
const ProductCategoryEnum = z.enum([
  'barn-doors',
  'bifold-doors',
  'bypass-doors',
  'pivot-doors',
  'room-dividers',
  'hardware',
  'closet-systems',
  'mirrors',
  'all'
]);

type ProductCategory = z.infer<typeof ProductCategoryEnum>;

/**
 * Search products tool with database integration
 */
export const searchProductsTool = tool({
  description: `Search for closet products in the PG Closets catalog from our database.
    Use this when customers ask about products, pricing, or want recommendations.
    Returns matching products with details like price, features, and availability.`,
  parameters: z.object({
    query: z.string().min(1).max(200).describe('Search query or product description'),
    category: ProductCategoryEnum.optional().describe('Filter by product category'),
    maxPrice: z.number().positive().optional().describe('Maximum price in cents'),
    minPrice: z.number().nonnegative().optional().describe('Minimum price in cents'),
    style: z.string().max(50).optional().describe('Style preference (modern, traditional, rustic)'),
    features: z.array(z.string().max(100)).max(10).optional().describe('Required features'),
    limit: z.number().int().positive().max(50).default(5).describe('Maximum number of results'),
  }),
  execute: async (params) => {
    const { query, category, maxPrice, minPrice, style, features, limit } = params;

    try {
      // Sanitize inputs
      const sanitizedQuery = sanitizeSearchQuery(query);

      console.log('[Product Search Tool] Executing with params:', {
        query: sanitizedQuery,
        category,
        maxPrice,
        minPrice,
        style,
        limit
      });

      // Build where clause for Prisma
      const whereClause: any = {};

      // Category filter
      if (category && category !== 'all') {
        whereClause.category = category;
      }

      // Style filter
      if (style) {
        whereClause.style = {
          contains: sanitizeText(style, 50),
          mode: 'insensitive'
        };
      }

      // In stock filter
      whereClause.inStock = true;

      // Features filter (product must have ALL specified features)
      if (features && features.length > 0) {
        validateArraySize(features, 10, 'features');
        whereClause.features = {
          hasEvery: features.map(f => sanitizeText(f, 100))
        };
      }

      // Text search in title and description
      if (sanitizedQuery) {
        whereClause.OR = [
          { title: { contains: sanitizedQuery, mode: 'insensitive' } },
          { description: { contains: sanitizedQuery, mode: 'insensitive' } },
        ];
      }

      // Execute database query
      let products = await prisma.product.findMany({
        where: whereClause,
        include: {
          variants: {
            take: 1,
            orderBy: { price: 'asc' }
          },
          images: {
            take: 1
          }
        },
        take: limit,
        orderBy: [
          { inStock: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      // Price range filter (applied after query since price is in variants)
      if (maxPrice !== undefined || minPrice !== undefined) {
        products = products.filter(p => {
          const price = p.variants[0]?.price ? Number(p.variants[0].price) * 100 : 0; // Convert to cents
          if (maxPrice !== undefined && price > maxPrice) return false;
          if (minPrice !== undefined && price < minPrice) return false;
          return true;
        });
      }

      // Limit results again after price filtering
      products = products.slice(0, limit);

      // Transform to expected format
      const results = products.map(p => ({
        id: p.id,
        name: p.title,
        category: p.category || 'closet-systems',
        price: p.variants[0]?.price ? Number(p.variants[0].price) * 100 : 0, // Price in cents
        style: p.style || 'modern',
        color: p.color || '',
        features: p.features || [],
        dimensions: { width: 0, height: 0 }, // TODO: Add dimensions to schema
        description: p.description,
        imageUrl: p.images[0]?.url || p.thumbnail || '',
        inStock: p.inStock,
      }));

      return {
        success: true,
        products: results,
        count: results.length,
        query: sanitizedQuery,
        filters: { category, maxPrice, minPrice, style, features },
      };

    } catch (error) {
      console.error('[Product Search Tool] Error:', error);
      return {
        success: false,
        error: 'Failed to search products',
        products: [],
        count: 0,
      };
    }
  },
});

/**
 * Get product details tool with database integration
 */
export const getProductDetailsTool = tool({
  description: `Get detailed information about a specific product by ID or name from our database.
    Use this when customers want more details about a particular product.`,
  parameters: z.object({
    productId: z.string().max(100).optional().describe('Product ID'),
    productName: z.string().max(200).optional().describe('Product name'),
  }).refine(
    data => data.productId || data.productName,
    { message: 'Either productId or productName must be provided' }
  ),
  execute: async (params) => {
    const { productId, productName } = params;

    try {
      console.log('[Product Details Tool] Executing with:', { productId, productName });

      let whereClause: any = {};

      if (productId) {
        whereClause.id = sanitizeProductId(productId);
      } else if (productName) {
        whereClause.title = {
          contains: sanitizeSearchQuery(productName),
          mode: 'insensitive'
        };
      }

      const product = await prisma.product.findFirst({
        where: whereClause,
        include: {
          variants: true,
          images: true,
          options: true,
        }
      });

      if (!product) {
        return {
          found: false,
          message: 'Product not found. Please check the ID or name.',
        };
      }

      // Get price from first variant (in cents)
      const price = product.variants[0]?.price ? Number(product.variants[0].price) * 100 : 0;

      return {
        found: true,
        product: {
          id: product.id,
          name: product.title,
          category: product.category || 'closet-systems',
          price,
          style: product.style || 'modern',
          color: product.color || '',
          features: product.features || [],
          description: product.description,
          imageUrl: product.images[0]?.url || product.thumbnail || '',
          images: product.images.map(img => ({
            url: img.url,
            altText: img.altText || product.title
          })),
          variants: product.variants.map(v => ({
            id: v.id,
            title: v.title,
            sku: v.sku,
            price: Number(v.price) * 100, // Convert to cents
            inStock: v.inventoryQuantity > 0
          })),
          inStock: product.inStock,
          formattedPrice: `$${(price / 100).toFixed(2)} CAD`,
          availability: product.inStock ? 'In Stock' : 'Out of Stock',
          estimatedDelivery: product.inStock ? '3-5 business days' : 'Contact for availability',
        },
      };

    } catch (error) {
      console.error('[Product Details Tool] Error:', error);
      return {
        found: false,
        error: 'Failed to fetch product details',
        message: 'An error occurred while fetching product information.',
      };
    }
  },
});

/**
 * Compare products tool with database integration
 */
export const compareProductsTool = tool({
  description: `Compare multiple products side-by-side from our database.
    Use this when customers want to compare different options.`,
  parameters: z.object({
    productIds: z.array(z.string().max(100)).min(2).max(5).describe('Array of product IDs to compare (2-5 products)'),
  }),
  execute: async (params) => {
    const { productIds } = params;

    try {
      console.log('[Compare Products Tool] Comparing:', productIds);

      // Validate array size
      validateArraySize(productIds, 5, 'products');

      // Sanitize product IDs
      const sanitizedIds = productIds.map(id => sanitizeProductId(id));

      // Fetch products from database
      const products = await prisma.product.findMany({
        where: {
          id: {
            in: sanitizedIds
          }
        },
        include: {
          variants: {
            take: 1,
            orderBy: { price: 'asc' }
          },
          images: {
            take: 1
          }
        }
      });

      if (products.length === 0) {
        return {
          success: false,
          message: 'No valid products found for comparison',
        };
      }

      // Transform products
      const transformedProducts = products.map(p => ({
        id: p.id,
        name: p.title,
        price: p.variants[0]?.price ? Number(p.variants[0].price) * 100 : 0, // cents
        category: p.category || 'closet-systems',
        style: p.style || 'modern',
        features: p.features || [],
        inStock: p.inStock,
        imageUrl: p.images[0]?.url || p.thumbnail || '',
      }));

      // Create comparison matrix
      const prices = transformedProducts.map(p => p.price);

      const comparison = {
        products: transformedProducts.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          style: p.style,
          features: p.features,
          inStock: p.inStock,
        })),
        priceRange: {
          lowest: Math.min(...prices),
          highest: Math.max(...prices),
          difference: Math.max(...prices) - Math.min(...prices),
        },
        commonFeatures: transformedProducts[0].features.filter(f =>
          transformedProducts.every(p => p.features.includes(f))
        ),
        uniqueFeatures: transformedProducts.map(p => ({
          productId: p.id,
          features: p.features.filter(f =>
            !transformedProducts.every(prod => prod.features.includes(f))
          ),
        })),
      };

      return {
        success: true,
        comparison,
        recommendation: generateRecommendation(transformedProducts),
      };

    } catch (error) {
      console.error('[Compare Products Tool] Error:', error);
      return {
        success: false,
        error: 'Failed to compare products',
        message: 'An error occurred while comparing products.',
      };
    }
  },
});

/**
 * Helper: Generate product recommendation
 */
function generateRecommendation(products: Array<{
  id: string;
  name: string;
  price: number;
  features: string[];
}>) {
  const lowestPrice = products.reduce((min, p) => p.price < min.price ? p : min);
  const mostFeatures = products.reduce((max, p) =>
    p.features.length > max.features.length ? p : max
  );

  return {
    bestValue: lowestPrice.id,
    bestFeatures: mostFeatures.id,
    summary: `${lowestPrice.name} offers the best value at $${(lowestPrice.price / 100).toFixed(2)}. ${mostFeatures.name} has the most features (${mostFeatures.features.length}).`,
  };
}

/**
 * Get product recommendations based on customer needs with database integration
 */
export const recommendProductsTool = tool({
  description: `Get personalized product recommendations from our database based on customer requirements.
    Use this when customers need help choosing products or want suggestions.`,
  parameters: z.object({
    projectType: z.string().max(200).describe('Type of project (e.g., bedroom closet, pantry, home office)'),
    budget: z.number().positive().optional().describe('Customer budget in cents'),
    style: z.string().max(50).optional().describe('Preferred style'),
    dimensions: z.object({
      width: z.number().positive(),
      height: z.number().positive(),
    }).optional().describe('Space dimensions in inches'),
    priorities: z.array(z.string().max(50)).max(5).optional().describe('Customer priorities (e.g., budget, quality, speed)'),
  }),
  execute: async (params) => {
    const { projectType, budget, style, dimensions, priorities } = params;

    try {
      console.log('[Recommend Products Tool] Parameters:', {
        projectType: sanitizeText(projectType, 200),
        budget,
        style,
        dimensions,
        priorities
      });

      // Build where clause
      const whereClause: any = {
        inStock: true
      };

      // Filter by style
      if (style) {
        whereClause.style = {
          contains: sanitizeText(style, 50),
          mode: 'insensitive'
        };
      }

      // Fetch products from database
      let products = await prisma.product.findMany({
        where: whereClause,
        include: {
          variants: {
            take: 1,
            orderBy: { price: 'asc' }
          },
          images: {
            take: 1
          }
        },
        take: 20 // Fetch more for better filtering
      });

      // Filter by budget (price in cents)
      if (budget && validatePositiveNumber(budget)) {
        products = products.filter(p => {
          const price = p.variants[0]?.price ? Number(p.variants[0].price) * 100 : 0;
          return price <= budget;
        });
      }

      // Sort by priorities
      if (priorities?.includes('budget')) {
        products.sort((a, b) => {
          const priceA = a.variants[0]?.price ? Number(a.variants[0].price) : 0;
          const priceB = b.variants[0]?.price ? Number(b.variants[0].price) : 0;
          return priceA - priceB;
        });
      } else if (priorities?.includes('quality')) {
        products.sort((a, b) => {
          const priceA = a.variants[0]?.price ? Number(a.variants[0].price) : 0;
          const priceB = b.variants[0]?.price ? Number(b.variants[0].price) : 0;
          return priceB - priceA;
        });
      }

      // Limit to top 3
      const topPicks = products.slice(0, 3);

      // Transform products
      const recommendations = topPicks.map((p, index) => {
        const price = p.variants[0]?.price ? Number(p.variants[0].price) * 100 : 0;
        return {
          rank: index + 1,
          product: {
            id: p.id,
            name: p.title,
            category: p.category || 'closet-systems',
            price,
            style: p.style || 'modern',
            color: p.color || '',
            features: p.features || [],
            description: p.description,
            imageUrl: p.images[0]?.url || p.thumbnail || '',
            inStock: p.inStock,
          },
          reasoning: generateReasoningForRecommendation(p, projectType, budget, priorities),
          matchScore: calculateMatchScore(p, { projectType, budget, style, priorities }),
        };
      });

      const totalPrice = recommendations.reduce((sum, r) => sum + r.product.price, 0);

      return {
        success: true,
        recommendations,
        totalOptions: products.length,
        estimatedTotal: totalPrice,
        formattedTotal: `$${(totalPrice / 100).toFixed(2)} CAD`,
      };

    } catch (error) {
      console.error('[Recommend Products Tool] Error:', error);
      return {
        success: false,
        error: 'Failed to generate recommendations',
        recommendations: [],
        totalOptions: 0,
        estimatedTotal: 0,
      };
    }
  },
});

/**
 * Helper: Generate reasoning for recommendation
 */
function generateReasoningForRecommendation(
  product: any,
  projectType: string,
  budget?: number,
  priorities?: string[]
): string {
  const reasons: string[] = [];

  const price = product.variants[0]?.price ? Number(product.variants[0].price) * 100 : 0;

  if (budget && price <= budget) {
    reasons.push(`Fits within your $${(budget / 100).toFixed(2)} budget`);
  }

  if (priorities?.includes('quality')) {
    reasons.push('High-quality construction and materials');
  }

  const features = product.features || [];
  if (features.length > 2) {
    reasons.push(`Includes ${features.length} premium features`);
  }

  if (product.inStock) {
    reasons.push('Available for immediate delivery');
  }

  return reasons.join('. ') + '.';
}

/**
 * Helper: Calculate match score
 */
function calculateMatchScore(
  product: any,
  criteria: {
    projectType: string;
    budget?: number;
    style?: string;
    priorities?: string[];
  }
): number {
  let score = 0.5; // Base score

  const price = product.variants[0]?.price ? Number(product.variants[0].price) * 100 : 0;

  // Budget match
  if (criteria.budget && price <= criteria.budget) {
    score += 0.2;
  }

  // Style match
  if (criteria.style && product.style) {
    const styleMatch = product.style.toLowerCase().includes(criteria.style.toLowerCase());
    if (styleMatch) score += 0.15;
  }

  // In stock
  if (product.inStock) {
    score += 0.1;
  }

  // Features count
  const features = product.features || [];
  score += Math.min(features.length * 0.05, 0.15);

  return Math.min(score, 1);
}
