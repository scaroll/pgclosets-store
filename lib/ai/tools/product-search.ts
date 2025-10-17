import { tool } from 'ai';
import { z } from 'zod';

/**
 * Product Search Tool for AI SDK 5
 * Allows AI to search and filter products based on customer requirements
 */

// Mock product database - replace with actual database queries
const PRODUCTS = [
  {
    id: 'renin-barn-1',
    name: 'Renin Modern Barn Door - White Shaker',
    category: 'barn-doors',
    price: 499,
    style: 'modern',
    color: 'white',
    features: ['soft-close', 'hardware-included', 'easy-install'],
    dimensions: { width: 36, height: 84 },
    description: 'Premium white shaker style barn door with soft-close mechanism',
    imageUrl: '/products/barn-door-white.jpg',
    inStock: true,
  },
  {
    id: 'renin-bifold-1',
    name: 'Renin Closet Bifold Door System',
    category: 'bifold-doors',
    price: 299,
    style: 'traditional',
    color: 'wood-grain',
    features: ['smooth-operation', 'space-saving'],
    dimensions: { width: 72, height: 80 },
    description: 'Space-saving bifold door system for closets',
    imageUrl: '/products/bifold-wood.jpg',
    inStock: true,
  },
  {
    id: 'hardware-1',
    name: 'Premium Barn Door Hardware Kit',
    category: 'hardware',
    price: 149,
    style: 'modern',
    color: 'black',
    features: ['heavy-duty', 'smooth-glide', 'complete-kit'],
    description: 'Complete hardware kit for barn door installation',
    imageUrl: '/products/hardware-black.jpg',
    inStock: true,
  },
];

/**
 * Search products tool
 */
export const searchProductsTool = tool({
  description: `Search for closet products in the PG Closets catalog.
    Use this when customers ask about products, pricing, or want recommendations.
    Returns matching products with details like price, features, and availability.`,
  parameters: z.object({
    query: z.string().describe('Search query or product description'),
    category: z.enum([
      'barn-doors',
      'bifold-doors',
      'bypass-doors',
      'pivot-doors',
      'room-dividers',
      'hardware',
      'closet-systems',
      'mirrors',
      'all'
    ]).optional().describe('Filter by product category'),
    maxPrice: z.number().optional().describe('Maximum price in CAD'),
    minPrice: z.number().optional().describe('Minimum price in CAD'),
    style: z.string().optional().describe('Style preference (modern, traditional, rustic)'),
    features: z.array(z.string()).optional().describe('Required features'),
    limit: z.number().default(5).describe('Maximum number of results to return'),
  }),
  execute: async ({ query, category, maxPrice, minPrice, style, features, limit }) => {
    console.log('[Product Search Tool] Executing with params:', {
      query,
      category,
      maxPrice,
      minPrice,
      style,
      features,
      limit
    });

    // Filter products based on criteria
    let results = [...PRODUCTS];

    // Category filter
    if (category && category !== 'all') {
      results = results.filter(p => p.category === category);
    }

    // Price range filter
    if (maxPrice !== undefined) {
      results = results.filter(p => p.price <= maxPrice);
    }
    if (minPrice !== undefined) {
      results = results.filter(p => p.price >= minPrice);
    }

    // Style filter
    if (style) {
      results = results.filter(p =>
        p.style.toLowerCase().includes(style.toLowerCase())
      );
    }

    // Features filter
    if (features && features.length > 0) {
      results = results.filter(p =>
        features.some(f => p.features.includes(f))
      );
    }

    // Text search in name and description
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      results = results.filter(p => {
        const searchText = `${p.name} ${p.description}`.toLowerCase();
        return searchTerms.some(term => searchText.includes(term));
      });
    }

    // Limit results
    results = results.slice(0, limit);

    return {
      products: results,
      count: results.length,
      query,
      filters: { category, maxPrice, minPrice, style, features },
    };
  },
});

/**
 * Get product details tool
 */
export const getProductDetailsTool = tool({
  description: `Get detailed information about a specific product by ID or name.
    Use this when customers want more details about a particular product.`,
  parameters: z.object({
    productId: z.string().optional().describe('Product ID'),
    productName: z.string().optional().describe('Product name'),
  }),
  execute: async ({ productId, productName }) => {
    console.log('[Product Details Tool] Executing with:', { productId, productName });

    let product;

    if (productId) {
      product = PRODUCTS.find(p => p.id === productId);
    } else if (productName) {
      product = PRODUCTS.find(p =>
        p.name.toLowerCase().includes(productName.toLowerCase())
      );
    }

    if (!product) {
      return {
        found: false,
        message: 'Product not found. Please check the ID or name.',
      };
    }

    return {
      found: true,
      product: {
        ...product,
        // Add calculated fields
        formattedPrice: `$${product.price.toLocaleString('en-CA')} CAD`,
        availability: product.inStock ? 'In Stock' : 'Out of Stock',
        estimatedDelivery: product.inStock ? '3-5 business days' : 'Contact for availability',
      },
    };
  },
});

/**
 * Compare products tool
 */
export const compareProductsTool = tool({
  description: `Compare multiple products side-by-side.
    Use this when customers want to compare different options.`,
  parameters: z.object({
    productIds: z.array(z.string()).describe('Array of product IDs to compare'),
  }),
  execute: async ({ productIds }) => {
    console.log('[Compare Products Tool] Comparing:', productIds);

    const products = productIds
      .map(id => PRODUCTS.find(p => p.id === id))
      .filter((p): p is typeof PRODUCTS[0] => p !== undefined);

    if (products.length === 0) {
      return {
        success: false,
        message: 'No valid products found for comparison',
      };
    }

    // Create comparison matrix
    const comparison = {
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        style: p.style,
        features: p.features,
        inStock: p.inStock,
      })),
      priceRange: {
        lowest: Math.min(...products.map(p => p.price)),
        highest: Math.max(...products.map(p => p.price)),
        difference: Math.max(...products.map(p => p.price)) - Math.min(...products.map(p => p.price)),
      },
      commonFeatures: products[0].features.filter(f =>
        products.every(p => p.features.includes(f))
      ),
      uniqueFeatures: products.map(p => ({
        productId: p.id,
        features: p.features.filter(f =>
          !products.every(prod => prod.features.includes(f))
        ),
      })),
    };

    return {
      success: true,
      comparison,
      recommendation: generateRecommendation(products),
    };
  },
});

/**
 * Helper: Generate product recommendation
 */
function generateRecommendation(products: typeof PRODUCTS) {
  const lowestPrice = products.reduce((min, p) => p.price < min.price ? p : min);
  const mostFeatures = products.reduce((max, p) =>
    p.features.length > max.features.length ? p : max
  );

  return {
    bestValue: lowestPrice.id,
    bestFeatures: mostFeatures.id,
    summary: `${lowestPrice.name} offers the best value at $${lowestPrice.price}. ${mostFeatures.name} has the most features (${mostFeatures.features.length}).`,
  };
}

/**
 * Get product recommendations based on customer needs
 */
export const recommendProductsTool = tool({
  description: `Get personalized product recommendations based on customer requirements.
    Use this when customers need help choosing products or want suggestions.`,
  parameters: z.object({
    projectType: z.string().describe('Type of project (e.g., bedroom closet, pantry, home office)'),
    budget: z.number().optional().describe('Customer budget in CAD'),
    style: z.string().optional().describe('Preferred style'),
    dimensions: z.object({
      width: z.number(),
      height: z.number(),
    }).optional().describe('Space dimensions in inches'),
    priorities: z.array(z.string()).optional().describe('Customer priorities (e.g., budget, quality, speed)'),
  }),
  execute: async ({ projectType, budget, style, dimensions, priorities }) => {
    console.log('[Recommend Products Tool] Parameters:', {
      projectType,
      budget,
      style,
      dimensions,
      priorities
    });

    // Filter by budget
    let recommendations = budget
      ? PRODUCTS.filter(p => p.price <= budget)
      : [...PRODUCTS];

    // Filter by style
    if (style) {
      recommendations = recommendations.filter(p =>
        p.style.toLowerCase().includes(style.toLowerCase())
      );
    }

    // Sort by priorities
    if (priorities?.includes('budget')) {
      recommendations.sort((a, b) => a.price - b.price);
    } else if (priorities?.includes('quality')) {
      recommendations.sort((a, b) => b.price - a.price);
    }

    // Limit to top 3
    const topPicks = recommendations.slice(0, 3);

    return {
      recommendations: topPicks.map((p, index) => ({
        rank: index + 1,
        product: p,
        reasoning: generateReasoningForRecommendation(p, projectType, budget, priorities),
        matchScore: calculateMatchScore(p, { projectType, budget, style, priorities }),
      })),
      totalOptions: recommendations.length,
      estimatedTotal: topPicks.reduce((sum, p) => sum + p.price, 0),
    };
  },
});

/**
 * Helper: Generate reasoning for recommendation
 */
function generateReasoningForRecommendation(
  product: typeof PRODUCTS[0],
  projectType: string,
  budget?: number,
  priorities?: string[]
): string {
  const reasons: string[] = [];

  if (budget && product.price <= budget) {
    reasons.push(`Fits within your $${budget} budget`);
  }

  if (priorities?.includes('quality')) {
    reasons.push('High-quality construction and materials');
  }

  if (product.features.length > 2) {
    reasons.push(`Includes ${product.features.length} premium features`);
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
  product: typeof PRODUCTS[0],
  criteria: {
    projectType: string;
    budget?: number;
    style?: string;
    priorities?: string[];
  }
): number {
  let score = 0.5; // Base score

  // Budget match
  if (criteria.budget && product.price <= criteria.budget) {
    score += 0.2;
  }

  // Style match
  if (criteria.style && product.style.toLowerCase().includes(criteria.style.toLowerCase())) {
    score += 0.15;
  }

  // In stock
  if (product.inStock) {
    score += 0.1;
  }

  // Features count
  score += Math.min(product.features.length * 0.05, 0.15);

  return Math.min(score, 1);
}
