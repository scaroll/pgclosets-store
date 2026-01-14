import { NextRequest, NextResponse } from 'next/server';
import { reninProductLoader, ReninProduct } from '@/lib/renin-product-loader';
import {
  ProductResponse,
  ResponseMeta,
  ApiError
} from '@/lib/types/api';

// Cache for individual product responses
const productCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    // Validate params object
    if (!params || typeof params !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request parameters',
          meta: createResponseMeta(startTime, false)
        } as ProductResponse,
        { status: 400 }
      );
    }

    const { id } = params;

    // Validate ID parameter
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required and must be a non-empty string',
          meta: createResponseMeta(startTime, false)
        } as ProductResponse,
        { status: 400 }
      );
    }

    const cleanId = decodeURIComponent(id.trim());

    // Check cache first
    const cached = productCache.get(cleanId);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      const response: ProductResponse = {
        ...cached.data,
        meta: {
          ...cached.data.meta,
          cached: true,
          cacheExpiry: new Date(cached.timestamp + CACHE_DURATION).toISOString()
        }
      };
      return NextResponse.json(response);
    }

    // Try to get product by ID first, then by handle, then by SKU
    let product = await reninProductLoader.getProductById(cleanId);

    if (!product) {
      product = await reninProductLoader.getProductByHandle(cleanId);
    }

    if (!product) {
      product = await reninProductLoader.getProductsBySku(cleanId);
    }

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: `Product not found with identifier: ${cleanId}`,
          meta: createResponseMeta(startTime, false)
        } as ProductResponse,
        { status: 404 }
      );
    }

    // Get related products (same category, excluding current product)
    const relatedProducts = await getRelatedProducts(product);

    const response: ProductResponse = {
      success: true,
      data: product,
      relatedProducts,
      meta: createResponseMeta(startTime, false)
    };

    // Cache the response
    productCache.set(cleanId, { data: response, timestamp: Date.now() });

    // Clean old cache entries
    cleanProductCache();

    // Set cache headers
    const nextResponse = NextResponse.json(response);
    nextResponse.headers.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=1200');
    nextResponse.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);

    return nextResponse;

  } catch (error) {
    console.error('Error fetching product:', error);

    const apiError: ApiError = {
      name: 'ProductFetchError',
      message: error instanceof Error ? error.message : 'Failed to fetch product',
      code: 'PRODUCT_FETCH_FAILED',
      status: 500
    };

    return NextResponse.json(
      {
        success: false,
        error: apiError.message,
        meta: createResponseMeta(startTime, false)
      } as ProductResponse,
      { status: apiError.status }
    );
  }
}

// Get related products
async function getRelatedProducts(product: ReninProduct, limit: number = 4): Promise<ReninProduct[]> {
  try {
    // Get products from the same category
    const sameTypeProducts = await reninProductLoader.getProductsByType(product.product_type);

    // Filter out the current product and get products with similar tags
    const relatedCandidates = sameTypeProducts
      .filter(p => p.id !== product.id)
      .filter(p => p.images.length > 0 && p.variants.some(v => v.price > 0)); // Quality filter

    // Score products by tag similarity
    const scoredProducts = relatedCandidates.map(candidate => {
      let score = 0;

      // Score based on shared tags
      const sharedTags = candidate.tags.filter(tag =>
        product.tags.some(pTag => pTag.toLowerCase() === tag.toLowerCase())
      );
      score += sharedTags.length * 2;

      // Bonus for having similar price range
      const productPrices = product.variants.map(v => v.price).filter(p => p > 0);
      const candidatePrices = candidate.variants.map(v => v.price).filter(p => p > 0);

      if (productPrices.length > 0 && candidatePrices.length > 0) {
        const productAvgPrice = productPrices.reduce((sum, p) => sum + p, 0) / productPrices.length;
        const candidateAvgPrice = candidatePrices.reduce((sum, p) => sum + p, 0) / candidatePrices.length;

        const priceDiffPercent = Math.abs(productAvgPrice - candidateAvgPrice) / productAvgPrice;
        if (priceDiffPercent < 0.3) { // Within 30% price range
          score += 1;
        }
      }

      return { product: candidate, score };
    });

    // Sort by score and return top products
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);

  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Create response metadata
function createResponseMeta(startTime: number, cached: boolean): ResponseMeta {
  return {
    timestamp: new Date().toISOString(),
    version: '1.0',
    cached,
    executionTime: Date.now() - startTime
  };
}

// Clean old cache entries
function cleanProductCache() {
  const now = Date.now();
  for (const [key, { timestamp }] of productCache.entries()) {
    if (now - timestamp > CACHE_DURATION) {
      productCache.delete(key);
    }
  }
}

// Disable static generation for API route
export const dynamic = 'force-dynamic';