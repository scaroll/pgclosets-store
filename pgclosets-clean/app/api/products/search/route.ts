import { NextRequest, NextResponse } from 'next/server';
import { reninProductLoader, ReninProduct } from '@/lib/renin-product-loader';
import {
  SearchParams,
  SearchResponse,
  SearchFacet,
  FacetValue,
  SortField,
  SortOrder,
  AppliedFilters,
  PaginationMeta,
  ResponseMeta
} from '@/lib/types/api';

// Cache for search results
const searchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);

  try {
    // Parse search parameters
    const params: SearchParams = {
      query: searchParams.get('query') || undefined,
      type: searchParams.get('type') || undefined,
      category: searchParams.get('category') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
      inStock: searchParams.get('inStock') === 'true' ? true : undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      sortBy: (searchParams.get('sortBy') as SortField) || 'relevance',
      sortOrder: (searchParams.get('sortOrder') as SortOrder) || 'desc',
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
      page: parseInt(searchParams.get('page') || '1'),
      fields: searchParams.get('fields')?.split(',').filter(Boolean) || undefined
    };

    // Generate cache key
    const cacheKey = JSON.stringify(params);
    const cached = searchCache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      const response: SearchResponse = {
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

    // Apply search filters
    let filteredProducts = await applySearchFilters(allProducts, params);

    // Apply sorting
    filteredProducts = applySorting(filteredProducts, params.sortBy!, params.sortOrder!);

    // Generate search facets
    const facets = await generateSearchFacets(allProducts, filteredProducts, params);

    // Apply pagination
    const { paginatedProducts, pagination } = applyPagination(filteredProducts, params);

    // Note: field selection would return partial products, so we'll return full products for API consistency
    const finalProducts = paginatedProducts;

    // Generate search suggestions
    const suggestions = await generateSearchSuggestions(params.query, allProducts);

    // Check for query correction
    const correctedQuery = await getQueryCorrection(params.query, allProducts);

    const executionTime = Date.now() - startTime;

    const response: SearchResponse = {
      success: true,
      data: finalProducts,
      pagination,
      facets,
      suggestions,
      correctedQuery: correctedQuery !== params.query ? correctedQuery : undefined,
      searchTime: executionTime,
      filters: generateAppliedFilters(params),
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        cached: false,
        executionTime
      }
    };

    // Cache the response
    searchCache.set(cacheKey, { data: response, timestamp: Date.now() });

    // Clean old cache entries
    cleanCache();

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in product search:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search products',
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

// Apply search filters
async function applySearchFilters(products: ReninProduct[], params: SearchParams): Promise<ReninProduct[]> {
  let filtered = [...products];

  // Text search
  if (params.query) {
    const query = params.query.toLowerCase();
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query)) ||
      product.product_type.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.variants.some(variant =>
        variant.title?.toLowerCase().includes(query) ||
        variant.sku.toLowerCase().includes(query)
      )
    );
  }

  // Product type filter
  if (params.type) {
    filtered = filtered.filter(product =>
      product.product_type.toLowerCase() === params.type!.toLowerCase()
    );
  }

  // Category filter (alias for product type)
  if (params.category) {
    filtered = filtered.filter(product =>
      product.product_type.toLowerCase() === params.category!.toLowerCase()
    );
  }

  // Tags filter
  if (params.tags && params.tags.length > 0) {
    filtered = filtered.filter(product =>
      params.tags!.some(tag =>
        product.tags.some(productTag =>
          productTag.toLowerCase() === tag.toLowerCase()
        )
      )
    );
  }

  // Price range filter
  if (params.priceMin !== undefined || params.priceMax !== undefined) {
    filtered = filtered.filter(product => {
      const prices = product.variants.map(v => v.price).filter(p => p > 0);
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
      product.variants.some(variant =>
        (variant.inventory_quantity || 0) > 0
      )
    );
  }

  // Featured filter
  if (params.featured === true) {
    filtered = filtered.filter(product =>
      product.images.length > 0 &&
      product.variants.some(v => v.price > 0)
    );
  }

  return filtered;
}

// Apply sorting
function applySorting(products: ReninProduct[], sortBy: SortField, sortOrder: SortOrder): ReninProduct[] {
  const sorted = [...products];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;

      case 'price':
        const aPrice = Math.min(...a.variants.map(v => v.price).filter(p => p > 0));
        const bPrice = Math.min(...b.variants.map(v => v.price).filter(p => p > 0));
        comparison = aPrice - bPrice;
        break;

      case 'inventory_quantity':
        const aStock = a.variants.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0);
        const bStock = b.variants.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0);
        comparison = aStock - bStock;
        break;

      case 'popularity':
        // For now, use number of variants as popularity indicator
        comparison = a.variants.length - b.variants.length;
        break;

      case 'relevance':
      default:
        // For relevance, maintain original order (or implement scoring algorithm)
        comparison = 0;
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

// Generate search facets
async function generateSearchFacets(allProducts: ReninProduct[], filteredProducts: ReninProduct[], params: SearchParams): Promise<SearchFacet[]> {
  const facets: SearchFacet[] = [];

  // Product type facet
  const typeCounts = new Map<string, number>();
  filteredProducts.forEach(product => {
    const type = product.product_type;
    typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
  });

  facets.push({
    field: 'product_type',
    label: 'Product Type',
    type: 'list',
    values: Array.from(typeCounts.entries()).map(([value, count]): FacetValue => ({
      value,
      label: value,
      count,
      selected: params.type === value
    })).sort((a, b) => b.count - a.count)
  });

  // Tags facet
  const tagCounts = new Map<string, number>();
  filteredProducts.forEach(product => {
    product.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const topTags = Array.from(tagCounts.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20); // Limit to top 20 tags

  facets.push({
    field: 'tags',
    label: 'Tags',
    type: 'list',
    values: topTags.map(([value, count]): FacetValue => ({
      value,
      label: value,
      count,
      selected: params.tags?.includes(value) || false
    }))
  });

  // Price range facet
  const prices = filteredProducts.flatMap(p =>
    p.variants.map(v => v.price).filter(price => price > 0)
  );

  if (prices.length > 0) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    facets.push({
      field: 'price',
      label: 'Price Range',
      type: 'range',
      values: [
        {
          value: `${minPrice}-${maxPrice}`,
          label: `$${minPrice} - $${maxPrice}`,
          count: prices.length
        }
      ]
    });
  }

  return facets;
}

// Apply pagination
function applyPagination(products: ReninProduct[], params: SearchParams): { paginatedProducts: ReninProduct[]; pagination: PaginationMeta } {
  const limit = Math.min(params.limit || 20, 100); // Max 100 items per page
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

// Apply field selection
function applyFieldSelection(products: ReninProduct[], fields: string[]): Partial<ReninProduct>[] {
  return products.map(product => {
    const filtered: Partial<ReninProduct> = {};
    fields.forEach(field => {
      if (field in product) {
        (filtered as any)[field] = (product as any)[field];
      }
    });
    return filtered;
  });
}

// Generate applied filters summary
function generateAppliedFilters(params: SearchParams): AppliedFilters {
  const filters: AppliedFilters = {};

  if (params.query) filters.query = params.query;
  if (params.category) filters.category = params.category;
  if (params.tags && params.tags.length > 0) filters.tags = params.tags;
  if (params.priceMin !== undefined || params.priceMax !== undefined) {
    filters.priceRange = {
      min: params.priceMin || 0,
      max: params.priceMax || Number.MAX_SAFE_INTEGER
    };
  }
  if (params.inStock !== undefined) filters.inStock = params.inStock;
  if (params.sortBy) filters.sortBy = params.sortBy;
  if (params.sortOrder) filters.sortOrder = params.sortOrder;

  return filters;
}

// Generate search suggestions
async function generateSearchSuggestions(query: string | undefined, products: ReninProduct[]): Promise<string[]> {
  if (!query || query.length < 2) return [];

  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();

  // Extract suggestions from product titles, types, and tags
  products.forEach(product => {
    const words = [
      ...product.title.split(/\s+/),
      product.product_type,
      ...product.tags
    ];

    words.forEach(word => {
      if (word.toLowerCase().includes(queryLower) && word.length > 2) {
        suggestions.add(word);
      }
    });
  });

  return Array.from(suggestions).slice(0, 10);
}

// Get query correction
async function getQueryCorrection(query: string | undefined, products: ReninProduct[]): Promise<string | undefined> {
  if (!query) return undefined;

  // Simple typo correction - in production, you might use a more sophisticated algorithm
  const commonTerms = new Set<string>();
  products.forEach(product => {
    [product.title, product.product_type, ...product.tags].forEach(term => {
      commonTerms.add(term.toLowerCase());
    });
  });

  // For now, just return the original query
  // In production, implement Levenshtein distance or similar algorithm
  return query;
}

// Clean old cache entries
function cleanCache() {
  const now = Date.now();
  for (const [key, { timestamp }] of searchCache.entries()) {
    if (now - timestamp > CACHE_DURATION) {
      searchCache.delete(key);
    }
  }
}

// Clear cache endpoint
export async function DELETE() {
  searchCache.clear();
  return NextResponse.json({
    success: true,
    message: 'Search cache cleared'
  });
}