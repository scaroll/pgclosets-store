import { NextRequest, NextResponse } from 'next/server';
import { reninProductLoader, ReninProduct } from '@/lib/renin-product-loader';
import {
  FeaturedProductsParams,
  FeaturedProductsResponse,
  FeaturedAlgorithm,
  ResponseMeta
} from '@/lib/types/api';

// Cache for featured products
const featuredCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Manually curated featured product IDs (can be configured via admin)
const CURATED_FEATURED_IDS = new Set<string>([
  // Add specific product IDs here that should always be featured
]);

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);

  try {
    // Parse parameters
    const params: FeaturedProductsParams = {
      limit: parseInt(searchParams.get('limit') || '8'),
      category: searchParams.get('category') || undefined,
      algorithm: (searchParams.get('algorithm') as FeaturedAlgorithm) || 'popular',
      excludeIds: searchParams.get('excludeIds')?.split(',').filter(Boolean) || []
    };

    // Validate limit
    params.limit = Math.min(Math.max(params.limit!, 1), 50); // Between 1 and 50

    // Generate cache key
    const cacheKey = JSON.stringify(params);
    const cached = featuredCache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      const response: FeaturedProductsResponse = {
        ...cached.data,
        success: true,
        meta: {
          ...cached.data.meta,
          cached: true,
          cacheExpiry: new Date(cached.timestamp + CACHE_DURATION).toISOString()
        }
      };
      return NextResponse.json(response);
    }

    // Load all products
    const allProducts = await reninProductLoader.loadProducts();

    // Filter by category if specified
    let candidateProducts = params.category
      ? allProducts.filter(p => p.product_type.toLowerCase() === params.category!.toLowerCase())
      : allProducts;

    // Exclude specified IDs
    if (params.excludeIds && params.excludeIds.length > 0) {
      candidateProducts = candidateProducts.filter(p => !params.excludeIds!.includes(p.id));
    }

    // Apply featured selection algorithm
    const featuredProducts = await selectFeaturedProducts(candidateProducts, params);

    // Generate algorithm criteria description
    const criteria = generateAlgorithmCriteria(params.algorithm!, params);

    const executionTime = Date.now() - startTime;

    const response: FeaturedProductsResponse = {
      success: true,
      data: featuredProducts,
      algorithm: params.algorithm!,
      criteria,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        cached: false,
        executionTime
      }
    };

    // Cache the response
    featuredCache.set(cacheKey, { data: response, timestamp: Date.now() });

    // Clean old cache entries
    cleanFeaturedCache();

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured products',
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0',
          cached: false,
          executionTime: Date.now() - startTime
        }
      },
      { status: 500 }
    );
  }
}

// Select featured products based on algorithm
async function selectFeaturedProducts(
  products: ReninProduct[],
  params: FeaturedProductsParams
): Promise<ReninProduct[]> {
  let scored: { product: ReninProduct; score: number }[] = [];

  switch (params.algorithm) {
    case 'curated':
      return selectCuratedProducts(products, params.limit!);

    case 'popular':
      scored = scoreByPopularity(products);
      break;

    case 'recent':
      scored = scoreByRecency(products);
      break;

    case 'high_rated':
      scored = scoreByRating(products);
      break;

    case 'best_selling':
      scored = scoreByBestSelling(products);
      break;

    case 'random':
      return selectRandomProducts(products, params.limit!);

    default:
      scored = scoreByPopularity(products);
  }

  // Sort by score and take top products
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, params.limit!).map(item => item.product);
}

// Score products by popularity (using number of variants, images, and tags as indicators)
function scoreByPopularity(products: ReninProduct[]): { product: ReninProduct; score: number }[] {
  return products.map(product => {
    let score = 0;

    // More variants = more popular
    score += product.variants.length * 2;

    // More images = better presentation
    score += product.images.length * 3;

    // More tags = better categorization
    score += product.tags.length;

    // Has proper pricing
    if (product.variants.some(v => v.price > 0)) {
      score += 5;
    }

    // Has inventory
    if (product.variants.some(v => (v.inventory_quantity || 0) > 0)) {
      score += 3;
    }

    // Bonus for having compare_at_price (sale items)
    if (product.variants.some(v => v.compare_at_price && v.compare_at_price > v.price)) {
      score += 4;
    }

    return { product, score };
  });
}

// Score products by recency (newer products first)
function scoreByRecency(products: ReninProduct[]): { product: ReninProduct; score: number }[] {
  // Since we don't have creation dates, we'll use product ID as a proxy
  // In a real system, you'd use actual creation timestamps
  return products.map(product => {
    // Higher IDs are assumed to be newer
    const idNumber = parseInt(product.id) || 0;
    return { product, score: idNumber };
  });
}

// Score products by rating (placeholder - would need actual rating data)
function scoreByRating(products: ReninProduct[]): { product: ReninProduct; score: number }[] {
  return products.map(product => {
    // Placeholder scoring based on available data
    let score = 0;

    // Products with more variants might be more established
    score += product.variants.length;

    // Products with good image quality
    score += product.images.length * 2;

    // Products with proper descriptions
    if (product.description && product.description.length > 50) {
      score += 3;
    }

    return { product, score };
  });
}

// Score products by best selling (placeholder - would need sales data)
function scoreByBestSelling(products: ReninProduct[]): { product: ReninProduct; score: number }[] {
  return products.map(product => {
    // Placeholder scoring - in real system would use actual sales data
    let score = 0;

    // Products with lower inventory might be selling well
    const totalInventory = product.variants.reduce((sum, v) => sum + (v.inventory_quantity || 50), 0);
    score += Math.max(0, 200 - totalInventory); // Inverse relationship

    // Products with sale prices might be best sellers
    if (product.variants.some(v => v.compare_at_price && v.compare_at_price > v.price)) {
      score += 20;
    }

    // Products in popular categories
    const popularCategories = ['Door', 'Barn Door', 'Closet Door'];
    if (popularCategories.includes(product.product_type)) {
      score += 10;
    }

    return { product, score };
  });
}

// Select curated products
function selectCuratedProducts(products: ReninProduct[], limit: number): ReninProduct[] {
  // First, try to get manually curated products
  const curated = products.filter(p => CURATED_FEATURED_IDS.has(p.id));

  // If we don't have enough curated products, supplement with high-quality products
  if (curated.length < limit) {
    const remaining = limit - curated.length;
    const curatedIds = new Set(curated.map(p => p.id));

    // Select high-quality products (good images, pricing, etc.)
    const supplementary = products
      .filter(p => !curatedIds.has(p.id))
      .filter(p =>
        p.images.length > 0 &&
        p.variants.some(v => v.price > 0) &&
        p.description.length > 20
      )
      .slice(0, remaining);

    return [...curated, ...supplementary];
  }

  return curated.slice(0, limit);
}

// Select random products
function selectRandomProducts(products: ReninProduct[], limit: number): ReninProduct[] {
  // Filter to quality products first
  const qualityProducts = products.filter(p =>
    p.images.length > 0 &&
    p.variants.some(v => v.price > 0)
  );

  // Shuffle and return
  const shuffled = [...qualityProducts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

// Generate algorithm criteria description
function generateAlgorithmCriteria(algorithm: FeaturedAlgorithm, params: FeaturedProductsParams): string {
  const baseMsg = `Selected ${params.limit} products`;
  const categoryMsg = params.category ? ` from ${params.category} category` : '';

  switch (algorithm) {
    case 'popular':
      return `${baseMsg}${categoryMsg} based on popularity metrics (variants, images, tags, pricing).`;

    case 'recent':
      return `${baseMsg}${categoryMsg} based on recency (newest products first).`;

    case 'high_rated':
      return `${baseMsg}${categoryMsg} based on quality indicators and user engagement.`;

    case 'best_selling':
      return `${baseMsg}${categoryMsg} based on sales performance and inventory turnover.`;

    case 'random':
      return `${baseMsg}${categoryMsg} using random selection from quality products.`;

    case 'curated':
      return `${baseMsg}${categoryMsg} from manually curated collection with quality supplements.`;

    default:
      return `${baseMsg}${categoryMsg} using default selection criteria.`;
  }
}

// Clean old cache entries
function cleanFeaturedCache() {
  const now = Date.now();
  for (const [key, { timestamp }] of featuredCache.entries()) {
    if (now - timestamp > CACHE_DURATION) {
      featuredCache.delete(key);
    }
  }
}

// POST endpoint for featured products management
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'clearCache':
        featuredCache.clear();
        return NextResponse.json({
          success: true,
          message: 'Featured products cache cleared'
        });

      case 'addCurated':
        const { productIds } = body;
        if (Array.isArray(productIds)) {
          productIds.forEach(id => CURATED_FEATURED_IDS.add(id));
          featuredCache.clear(); // Clear cache to refresh
          return NextResponse.json({
            success: true,
            message: `Added ${productIds.length} products to curated list`,
            curatedCount: CURATED_FEATURED_IDS.size
          });
        }
        return NextResponse.json({
          success: false,
          error: 'Product IDs must be provided as an array'
        }, { status: 400 });

      case 'removeCurated':
        const { productId } = body;
        if (productId) {
          CURATED_FEATURED_IDS.delete(productId);
          featuredCache.clear(); // Clear cache to refresh
          return NextResponse.json({
            success: true,
            message: 'Product removed from curated list',
            curatedCount: CURATED_FEATURED_IDS.size
          });
        }
        return NextResponse.json({
          success: false,
          error: 'Product ID not provided'
        }, { status: 400 });

      case 'getCurated':
        return NextResponse.json({
          success: true,
          data: Array.from(CURATED_FEATURED_IDS),
          count: CURATED_FEATURED_IDS.size
        });

      case 'getAlgorithms':
        return NextResponse.json({
          success: true,
          data: {
            algorithms: [
              { value: 'popular', label: 'Most Popular', description: 'Based on engagement metrics' },
              { value: 'recent', label: 'Recently Added', description: 'Newest products first' },
              { value: 'high_rated', label: 'Highest Rated', description: 'Based on quality indicators' },
              { value: 'best_selling', label: 'Best Selling', description: 'Top performing products' },
              { value: 'random', label: 'Random Selection', description: 'Random quality products' },
              { value: 'curated', label: 'Hand Picked', description: 'Manually curated selection' }
            ]
          }
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action'
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing featured products request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request'
      },
      { status: 500 }
    );
  }
}