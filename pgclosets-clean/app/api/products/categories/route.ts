import { NextRequest, NextResponse } from 'next/server';
import { reninProductLoader, ReninProduct } from '@/lib/renin-product-loader';
import {
  CategoriesResponse,
  ProductCategory,
  CategoryHierarchy,
  ResponseMeta
} from '@/lib/types/api';

// Cache for categories
const categoriesCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (categories change less frequently)

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);

  try {
    // Parse parameters
    const includeEmpty = searchParams.get('includeEmpty') === 'true';
    const includeHierarchy = searchParams.get('includeHierarchy') === 'true';
    const includeMetadata = searchParams.get('includeMetadata') === 'true';
    const format = searchParams.get('format') || 'flat'; // 'flat' or 'tree'

    // Generate cache key
    const cacheKey = JSON.stringify({ includeEmpty, includeHierarchy, includeMetadata, format });
    const cached = categoriesCache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      const response: CategoriesResponse = {
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
    const products = await reninProductLoader.loadProducts();

    // Generate categories with metadata
    const categories = await generateCategories(products, {
      includeEmpty,
      includeMetadata
    });

    // Generate hierarchy if requested
    const hierarchy = includeHierarchy ? generateCategoryHierarchy(categories) : undefined;

    // Format categories based on request
    const formattedCategories = format === 'tree'
      ? buildCategoryTree(categories)
      : categories;

    const executionTime = Date.now() - startTime;

    const response: CategoriesResponse = {
      success: true,
      data: formattedCategories,
      hierarchy,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        cached: false,
        executionTime
      }
    };

    // Cache the response
    categoriesCache.set(cacheKey, { data: response, timestamp: Date.now() });

    // Clean old cache entries
    cleanCategoriesCache();

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
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

// Generate categories with counts and metadata
async function generateCategories(
  products: ReninProduct[],
  options: {
    includeEmpty: boolean;
    includeMetadata: boolean;
  }
): Promise<ProductCategory[]> {
  const categoryMap = new Map<string, {
    products: ReninProduct[];
    tags: Set<string>;
    priceRange: { min: number; max: number };
    totalVariants: number;
  }>();

  // Group products by category
  products.forEach(product => {
    const categoryName = product.product_type || 'Uncategorized';

    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, {
        products: [],
        tags: new Set(),
        priceRange: { min: Number.MAX_SAFE_INTEGER, max: 0 },
        totalVariants: 0
      });
    }

    const categoryData = categoryMap.get(categoryName)!;
    categoryData.products.push(product);
    categoryData.totalVariants += product.variants.length;

    // Collect tags
    product.tags.forEach(tag => categoryData.tags.add(tag));

    // Update price range
    const prices = product.variants.map(v => v.price).filter(p => p > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      categoryData.priceRange.min = Math.min(categoryData.priceRange.min, minPrice);
      categoryData.priceRange.max = Math.max(categoryData.priceRange.max, maxPrice);
    }
  });

  // Convert to ProductCategory array
  const categories: ProductCategory[] = [];

  for (const [name, data] of categoryMap.entries()) {
    if (!options.includeEmpty && data.products.length === 0) {
      continue;
    }

    const category: ProductCategory = {
      name,
      count: data.products.length,
      slug: generateSlug(name)
    };

    if (options.includeMetadata) {
      // Add description based on common patterns
      category.description = generateCategoryDescription(name, data);

      // Add representative image (first product image)
      const imageProduct = data.products.find(p => p.images.length > 0);
      if (imageProduct && imageProduct.images.length > 0) {
        category.image = imageProduct.images[0].src;
      }
    }

    categories.push(category);
  }

  // Sort by count (descending) then by name (ascending)
  categories.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.name.localeCompare(b.name);
  });

  return categories;
}

// Generate category hierarchy
function generateCategoryHierarchy(categories: ProductCategory[]): CategoryHierarchy {
  const hierarchy: CategoryHierarchy = {};

  categories.forEach(category => {
    const parts = category.name.split(' / '); // Handle hierarchical names like "Doors / Barn Doors"

    if (parts.length === 1) {
      // Top-level category
      hierarchy[category.slug] = {
        children: [],
        level: 0
      };
    } else {
      // Nested category
      const parentName = parts.slice(0, -1).join(' / ');
      const parentSlug = generateSlug(parentName);

      if (!hierarchy[parentSlug]) {
        hierarchy[parentSlug] = {
          children: [],
          level: parts.length - 2
        };
      }

      hierarchy[category.slug] = {
        children: [],
        parent: parentSlug,
        level: parts.length - 1
      };

      hierarchy[parentSlug].children.push(category.slug);
    }
  });

  return hierarchy;
}

// Build category tree structure
function buildCategoryTree(categories: ProductCategory[]): ProductCategory[] {
  const categoryMap = new Map<string, ProductCategory>();
  const rootCategories: ProductCategory[] = [];

  // Create map for quick lookup
  categories.forEach(category => {
    categoryMap.set(category.slug, { ...category, children: [] });
  });

  // Build tree structure
  categories.forEach(category => {
    const parts = category.name.split(' / ');

    if (parts.length === 1) {
      // Root category
      rootCategories.push(categoryMap.get(category.slug)!);
    } else {
      // Find parent
      const parentName = parts.slice(0, -1).join(' / ');
      const parentSlug = generateSlug(parentName);
      const parent = categoryMap.get(parentSlug);

      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(categoryMap.get(category.slug)!);
      } else {
        // Parent not found, treat as root
        rootCategories.push(categoryMap.get(category.slug)!);
      }
    }
  });

  return rootCategories;
}

// Generate category description
function generateCategoryDescription(
  name: string,
  data: {
    products: ReninProduct[];
    tags: Set<string>;
    priceRange: { min: number; max: number };
    totalVariants: number;
  }
): string {
  const commonTags = Array.from(data.tags).slice(0, 5).join(', ');
  const priceRange = data.priceRange.min !== Number.MAX_SAFE_INTEGER
    ? `$${data.priceRange.min} - $${data.priceRange.max}`
    : 'Pricing varies';

  return `${name} collection featuring ${data.products.length} products with ${data.totalVariants} variants. Price range: ${priceRange}. Popular styles: ${commonTags}.`;
}

// Generate URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Clean old cache entries
function cleanCategoriesCache() {
  const now = Date.now();
  for (const [key, { timestamp }] of categoriesCache.entries()) {
    if (now - timestamp > CACHE_DURATION) {
      categoriesCache.delete(key);
    }
  }
}

// POST endpoint for category management
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'clearCache':
        categoriesCache.clear();
        return NextResponse.json({
          success: true,
          message: 'Categories cache cleared'
        });

      case 'getStats':
        const products = await reninProductLoader.loadProducts();
        const stats = await getCategoryStats(products);
        return NextResponse.json({
          success: true,
          data: stats
        });

      case 'rebuild':
        // Force rebuild categories cache
        categoriesCache.clear();
        const rebuildResult = await generateCategories(
          await reninProductLoader.loadProducts(),
          { includeEmpty: false, includeMetadata: true }
        );
        return NextResponse.json({
          success: true,
          data: rebuildResult,
          message: 'Categories rebuilt successfully'
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
    console.error('Error processing categories request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request'
      },
      { status: 500 }
    );
  }
}

// Get category statistics
async function getCategoryStats(products: ReninProduct[]) {
  const categories = await generateCategories(products, {
    includeEmpty: true,
    includeMetadata: false
  });

  const totalProducts = products.length;
  const categorizedProducts = products.filter(p => p.product_type).length;
  const uncategorizedProducts = totalProducts - categorizedProducts;

  return {
    totalCategories: categories.length,
    totalProducts,
    categorizedProducts,
    uncategorizedProducts,
    averageProductsPerCategory: totalProducts / categories.length,
    topCategories: categories.slice(0, 5).map(c => ({
      name: c.name,
      count: c.count,
      percentage: (c.count / totalProducts * 100).toFixed(1)
    }))
  };
}