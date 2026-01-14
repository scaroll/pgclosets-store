import { NextRequest, NextResponse } from 'next/server';
import { reninProductLoader } from '@/lib/renin-product-loader';
import {
  ProductsResponse,
  SearchParams,
  PaginationMeta,
  ResponseMeta,
  ApiError
} from '@/lib/types/api';

// Response cache for GET requests
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  let searchParams: URLSearchParams;

  try {
    const url = new URL(request.url);
    searchParams = url.searchParams;
  } catch (error) {
    console.error('Invalid URL in request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request URL',
        meta: createResponseMeta(startTime, false)
      } as ProductsResponse,
      { status: 400 }
    );
  }

  try {
    // Parse and validate query parameters
    const params = parseSearchParams(searchParams);

    // Validate parameters
    const validation = validateParams(params);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
          meta: createResponseMeta(startTime, false)
        } as ProductsResponse,
        { status: 400 }
      );
    }

    // Generate cache key
    const cacheKey = generateCacheKey(params);

    // Check cache first
    const cached = responseCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      const response: ProductsResponse = {
        ...cached.data,
        meta: {
          ...cached.data.meta,
          cached: true,
          cacheExpiry: new Date(cached.timestamp + CACHE_DURATION).toISOString()
        }
      };
      return NextResponse.json(response);
    }

    // Fetch products based on parameters
    let products = await fetchProductsByParams(params);

    // Apply server-side filtering if needed
    products = applyAdditionalFilters(products, params);

    // Apply pagination
    const { paginatedProducts, pagination } = applyPagination(products, params);

    // Get stats for response metadata
    const stats = await reninProductLoader.getProductStats();

    // Create response
    const response: ProductsResponse = {
      success: true,
      data: paginatedProducts,
      pagination,
      stats,
      meta: createResponseMeta(startTime, false)
    };

    // Cache the response
    responseCache.set(cacheKey, { data: response, timestamp: Date.now() });

    // Clean old cache entries
    cleanCache();

    // Set cache headers
    const nextResponse = NextResponse.json(response);
    nextResponse.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    nextResponse.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);

    return nextResponse;

  } catch (error) {
    console.error('Error fetching products:', error);

    const apiError: ApiError = {
      name: 'ProductFetchError',
      message: error instanceof Error ? error.message : 'Failed to fetch products',
      code: 'PRODUCT_FETCH_FAILED',
      status: 500
    };

    return NextResponse.json(
      {
        success: false,
        error: apiError.message,
        meta: createResponseMeta(startTime, false)
      } as ProductsResponse,
      { status: apiError.status }
    );
  }
}

// Parse search parameters with validation
function parseSearchParams(searchParams: URLSearchParams): SearchParams {
  return {
    type: searchParams.get('type') || undefined,
    category: searchParams.get('category') || undefined,
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
    search: searchParams.get('search') || undefined,
    query: searchParams.get('query') || searchParams.get('search') || undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
    priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'relevance',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100), // Max 100 items
    offset: Math.max(parseInt(searchParams.get('offset') || '0'), 0),
    page: Math.max(parseInt(searchParams.get('page') || '1'), 1),
    fields: searchParams.get('fields')?.split(',').filter(Boolean) || undefined
  };
}

// Validate parameters
function validateParams(params: SearchParams): { valid: boolean; error?: string } {
  if (params.limit && (params.limit < 1 || params.limit > 100)) {
    return { valid: false, error: 'Limit must be between 1 and 100' };
  }

  if (params.offset && params.offset < 0) {
    return { valid: false, error: 'Offset must be non-negative' };
  }

  if (params.priceMin && params.priceMin < 0) {
    return { valid: false, error: 'Price minimum must be non-negative' };
  }

  if (params.priceMax && params.priceMax < 0) {
    return { valid: false, error: 'Price maximum must be non-negative' };
  }

  if (params.priceMin && params.priceMax && params.priceMin > params.priceMax) {
    return { valid: false, error: 'Price minimum cannot be greater than maximum' };
  }

  return { valid: true };
}

// Generate cache key
function generateCacheKey(params: SearchParams): string {
  return `products_${JSON.stringify(params)}`;
}

// Fetch products based on parameters
async function fetchProductsByParams(params: SearchParams) {
  if (params.featured === true) {
    return await reninProductLoader.getFeaturedProducts(params.limit || 20);
  } else if (params.type) {
    return await reninProductLoader.getProductsByType(params.type);
  } else if (params.category) {
    return await reninProductLoader.getProductsByType(params.category);
  } else if (params.tags && params.tags.length > 0) {
    // For multiple tags, find products that have ANY of the tags
    const allProducts = await reninProductLoader.loadProducts();
    return allProducts.filter(product =>
      params.tags!.some(tag =>
        product.tags.some(productTag =>
          productTag.toLowerCase() === tag.toLowerCase()
        )
      )
    );
  } else if (params.search || params.query) {
    return await reninProductLoader.searchProducts(params.search || params.query!);
  } else {
    return await reninProductLoader.loadProducts();
  }
}

// Apply additional server-side filters
function applyAdditionalFilters(products: any[], params: SearchParams) {
  let filtered = [...products];

  // Price range filter
  if (params.priceMin !== undefined || params.priceMax !== undefined) {
    filtered = filtered.filter(product => {
      const prices = product.variants.map((v: any) => v.price).filter((p: number) => p > 0);
      if (prices.length === 0) return false;

      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (params.priceMin !== undefined && maxPrice < params.priceMin) return false;
      if (params.priceMax !== undefined && minPrice > params.priceMax) return false;

      return true;
    });
  }

  // In stock filter
  if (params.inStock === true) {
    filtered = filtered.filter(product =>
      product.variants.some((variant: any) =>
        (variant.inventory_quantity || 0) > 0
      )
    );
  }

  // Apply sorting
  if (params.sortBy && params.sortBy !== 'relevance') {
    filtered = applySorting(filtered, params.sortBy, params.sortOrder || 'desc');
  }

  return filtered;
}

// Apply sorting
function applySorting(products: any[], sortBy: string, sortOrder: string) {
  const sorted = [...products];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'price':
        const aPrice = Math.min(...a.variants.map((v: any) => v.price).filter((p: number) => p > 0));
        const bPrice = Math.min(...b.variants.map((v: any) => v.price).filter((p: number) => p > 0));
        comparison = aPrice - bPrice;
        break;
      case 'inventory_quantity':
        const aStock = a.variants.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0);
        const bStock = b.variants.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0);
        comparison = aStock - bStock;
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

// Apply pagination
function applyPagination(products: any[], params: SearchParams): { paginatedProducts: any[]; pagination: PaginationMeta } {
  const limit = params.limit || 20;
  const offset = params.offset || 0;
  const page = params.page || Math.floor(offset / limit) + 1;

  const paginatedProducts = products.slice(offset, offset + limit);

  const pagination: PaginationMeta = {
    total: products.length,
    limit,
    offset,
    page,
    totalPages: Math.ceil(products.length / limit),
    hasMore: offset + limit < products.length,
    hasPrevious: offset > 0
  };

  return { paginatedProducts, pagination };
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
function cleanCache() {
  const now = Date.now();
  for (const [key, { timestamp }] of responseCache.entries()) {
    if (now - timestamp > CACHE_DURATION) {
      responseCache.delete(key);
    }
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
          meta: createResponseMeta(startTime, false)
        },
        { status: 400 }
      );
    }

    const { action } = body;

    if (!action || typeof action !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid action parameter',
          meta: createResponseMeta(startTime, false)
        },
        { status: 400 }
      );
    }

    switch (action) {
      case 'clearCache':
        // Clear both product loader cache and response cache
        reninProductLoader.clearCache();
        responseCache.clear();

        return NextResponse.json({
          success: true,
          message: 'All caches cleared successfully',
          data: { cacheCleared: true },
          meta: createResponseMeta(startTime, false)
        });

      case 'getStats':
        const stats = await reninProductLoader.getProductStats();
        return NextResponse.json({
          success: true,
          data: stats,
          meta: createResponseMeta(startTime, false)
        });

      case 'getCategories':
        const categories = await reninProductLoader.getProductCategories();
        return NextResponse.json({
          success: true,
          data: categories,
          meta: createResponseMeta(startTime, false)
        });

      case 'getTags':
        const tags = await reninProductLoader.getProductTags();
        return NextResponse.json({
          success: true,
          data: tags,
          meta: createResponseMeta(startTime, false)
        });

      case 'getCacheInfo':
        const cacheInfo = {
          responseCache: {
            size: responseCache.size,
            keys: Array.from(responseCache.keys())
          },
          productLoaderCache: {
            hasCache: true, // Product loader manages its own cache internally
            duration: CACHE_DURATION
          }
        };

        return NextResponse.json({
          success: true,
          data: cacheInfo,
          meta: createResponseMeta(startTime, false)
        });

      case 'healthCheck':
        // Perform health checks
        const healthCheck = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          checks: {
            productLoader: true,
            cache: responseCache.size >= 0,
            memory: process.memoryUsage()
          }
        };

        try {
          // Test product loading
          await reninProductLoader.loadProducts();
          healthCheck.checks.productLoader = true;
        } catch (error) {
          healthCheck.checks.productLoader = false;
          healthCheck.status = 'unhealthy';
        }

        return NextResponse.json({
          success: true,
          data: healthCheck,
          meta: createResponseMeta(startTime, false)
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Invalid action '${action}'. Valid actions: clearCache, getStats, getCategories, getTags, getCacheInfo, healthCheck`,
            meta: createResponseMeta(startTime, false)
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing POST request:', error);

    const apiError: ApiError = {
      name: 'PostRequestError',
      message: error instanceof Error ? error.message : 'Failed to process request',
      code: 'POST_REQUEST_FAILED',
      status: 500
    };

    return NextResponse.json(
      {
        success: false,
        error: apiError.message,
        meta: createResponseMeta(startTime, false)
      },
      { status: apiError.status }
    );
  }
}