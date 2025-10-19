import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 10;

const SAMPLE_PRODUCTS = [
  {
    id: 'barn-1',
    name: 'Modern Farmhouse Barn Door',
    category: 'barn-doors',
    price: 899,
    style: 'modern',
    color: 'rustic wood',
    features: ['solid wood core', 'pre-drilled', 'reversible', 'lifetime warranty'],
    description: 'Beautiful modern farmhouse style barn door with rustic wood finish',
  },
  {
    id: 'barn-2',
    name: 'Glass Panel Contemporary Barn Door',
    category: 'barn-doors',
    price: 1299,
    style: 'contemporary',
    color: 'frosted glass',
    features: ['tempered glass', 'aluminum frame', 'soft-close', 'modern design'],
    description: 'Sleek contemporary barn door with frosted glass panels',
  },
  {
    id: 'bifold-1',
    name: 'Classic White Bifold Closet Door',
    category: 'bifold-doors',
    price: 349,
    style: 'traditional',
    color: 'white',
    features: ['pre-finished', 'easy installation', 'smooth operation', 'space-saving'],
    description: 'Traditional white bifold door perfect for closets',
  },
  {
    id: 'bifold-2',
    name: 'Louvered Pine Bifold Door',
    category: 'bifold-doors',
    price: 449,
    style: 'traditional',
    color: 'natural pine',
    features: ['natural wood', 'louvered design', 'unfinished', 'ventilation'],
    description: 'Louvered pine bifold door for ventilation and classic style',
  },
  {
    id: 'bypass-1',
    name: 'Mirror Bypass Closet Doors',
    category: 'bypass-doors',
    price: 799,
    style: 'modern',
    color: 'mirror',
    features: ['full-length mirrors', 'smooth gliding', 'space enhancement', 'easy maintenance'],
    description: 'Full-length mirror bypass doors that make your space feel larger',
  },
  {
    id: 'bypass-2',
    name: 'Frosted Glass Bypass Doors',
    category: 'bypass-doors',
    price: 949,
    style: 'contemporary',
    color: 'frosted glass',
    features: ['frosted glass', 'aluminum frame', 'quiet operation', 'modern aesthetic'],
    description: 'Elegant frosted glass bypass doors for privacy with light transmission',
  },
  {
    id: 'hardware-1',
    name: 'Black Barn Door Hardware Kit',
    category: 'hardware',
    price: 199,
    style: 'industrial',
    color: 'black',
    features: ['heavy-duty steel', 'quiet operation', 'complete kit', 'easy installation'],
    description: 'Complete barn door hardware kit in matte black finish',
  },
  {
    id: 'mirror-1',
    name: 'Full Length Wall Mirror',
    category: 'mirrors',
    price: 299,
    style: 'classic',
    color: 'clear',
    features: ['beveled edges', 'shatter-resistant', 'wall-mounted', 'distortion-free'],
    description: 'Elegant full-length wall mirror with beveled edges',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, filters = {}, limit = 5 } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      );
    }

    // AI disabled: always use fallback search
    return fallbackSearch(query, filters, limit);
  } catch (error) {
    console.error('[AI Search] Error:', error);

    // Fallback to simple search on error
    const body = await req.json().catch(() => ({}));
    return fallbackSearch(body.query || '', body.filters || {}, body.limit || 5);
  }
}

/**
 * Fallback search when AI is not available
 */
function fallbackSearch(query: string, filters: any, limit: number) {
  let results = [...SAMPLE_PRODUCTS];

  // Simple text search
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(p => {
      const searchText = `${p.name} ${p.description} ${p.category} ${p.features.join(' ')}`.toLowerCase();
      return searchText.includes(lowerQuery);
    });
  }

  // Apply filters
  if (filters.category) {
    results = results.filter(p => p.category === filters.category);
  }
  if (filters.maxPrice) {
    results = results.filter(p => p.price <= filters.maxPrice);
  }
  if (filters.minPrice) {
    results = results.filter(p => p.price >= filters.minPrice);
  }

  results = results.slice(0, limit);

  return NextResponse.json({
    success: true,
    query,
    interpreted: {
      category: filters.category,
      priceRange: filters.minPrice || filters.maxPrice ? {
        min: filters.minPrice || 0,
        max: filters.maxPrice || 10000,
      } : undefined,
    },
    filters: [],
    products: results,
    count: results.length,
    sortBy: 'relevance',
    fallback: true,
  });
}
