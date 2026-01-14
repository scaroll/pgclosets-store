import { ReninProduct } from './renin-product-loader';

export interface SearchFilters {
  categories: string[];
  tags: string[];
  priceRange: {
    min: number;
    max: number;
  };
  inStock: boolean;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

export type SortOption = 'relevance' | 'price' | 'name' | 'newest' | 'popularity';

export interface SearchResult {
  product: ReninProduct;
  score: number;
  matchedFields: string[];
  exactMatches: string[];
}

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'tag' | 'brand';
  count?: number;
}

export interface FilterStats {
  categories: Array<{ name: string; count: number; }>;
  tags: Array<{ name: string; count: number; }>;
  priceRange: { min: number; max: number; };
  totalProducts: number;
  inStockCount: number;
}

// Fuzzy search implementation
export class FuzzySearch {
  private static levenshteinDistance(a: string, b: string): number {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= b.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // insertion
          matrix[j - 1][i] + 1, // deletion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[b.length][a.length];
  }

  static similarity(a: string, b: string): number {
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    const distance = this.levenshteinDistance(a.toLowerCase(), b.toLowerCase());
    return (maxLen - distance) / maxLen;
  }

  static isMatch(query: string, text: string, threshold: number = 0.6): boolean {
    return this.similarity(query, text) >= threshold;
  }
}

// Search scoring and ranking
export class SearchScorer {
  private static readonly WEIGHTS = {
    EXACT_TITLE: 10,
    EXACT_TAG: 8,
    EXACT_CATEGORY: 7,
    EXACT_DESCRIPTION: 6,
    PARTIAL_TITLE: 5,
    PARTIAL_TAG: 4,
    PARTIAL_CATEGORY: 3,
    PARTIAL_DESCRIPTION: 2,
    FUZZY_MATCH: 1,
  };

  static scoreProduct(product: ReninProduct, query: string): SearchResult {
    const queryLower = query.toLowerCase();
    let score = 0;
    const matchedFields: string[] = [];
    const exactMatches: string[] = [];

    // Title matches
    const titleLower = product.title.toLowerCase();
    if (titleLower === queryLower) {
      score += this.WEIGHTS.EXACT_TITLE;
      exactMatches.push('title');
      matchedFields.push('title');
    } else if (titleLower.includes(queryLower)) {
      score += this.WEIGHTS.PARTIAL_TITLE;
      matchedFields.push('title');
    } else if (FuzzySearch.isMatch(query, product.title, 0.7)) {
      score += this.WEIGHTS.FUZZY_MATCH;
      matchedFields.push('title');
    }

    // Category matches
    const categoryLower = product.product_type.toLowerCase();
    if (categoryLower === queryLower) {
      score += this.WEIGHTS.EXACT_CATEGORY;
      exactMatches.push('category');
      matchedFields.push('category');
    } else if (categoryLower.includes(queryLower)) {
      score += this.WEIGHTS.PARTIAL_CATEGORY;
      matchedFields.push('category');
    }

    // Tag matches
    for (const tag of product.tags) {
      const tagLower = tag.toLowerCase();
      if (tagLower === queryLower) {
        score += this.WEIGHTS.EXACT_TAG;
        exactMatches.push('tag');
        matchedFields.push('tag');
      } else if (tagLower.includes(queryLower)) {
        score += this.WEIGHTS.PARTIAL_TAG;
        matchedFields.push('tag');
      }
    }

    // Description matches
    const descriptionLower = product.description.toLowerCase();
    if (descriptionLower.includes(queryLower)) {
      const words = queryLower.split(' ');
      const matchCount = words.filter(word => descriptionLower.includes(word)).length;
      if (matchCount === words.length) {
        score += this.WEIGHTS.EXACT_DESCRIPTION;
        exactMatches.push('description');
      } else {
        score += this.WEIGHTS.PARTIAL_DESCRIPTION * (matchCount / words.length);
      }
      matchedFields.push('description');
    }

    // Boost score for products with better availability
    const inStockVariants = product.variants.filter(v => v.inventory_quantity > 0);
    if (inStockVariants.length > 0) {
      score *= 1.2;
    }

    // Boost score for products with images
    if (product.images.length > 0) {
      score *= 1.1;
    }

    return {
      product,
      score,
      matchedFields: Array.from(new Set(matchedFields)),
      exactMatches: Array.from(new Set(exactMatches)),
    };
  }
}

// Search suggestions generator
export class SearchSuggestions {
  static generateSuggestions(products: ReninProduct[], query: string, limit: number = 8): SearchSuggestion[] {
    const queryLower = query.toLowerCase();
    const suggestions: SearchSuggestion[] = [];

    if (query.length < 2) return suggestions;

    // Product name suggestions
    const productSuggestions = products
      .filter(p => p.title.toLowerCase().includes(queryLower))
      .slice(0, 4)
      .map(p => ({
        text: p.title,
        type: 'product' as const,
      }));

    // Category suggestions
    const categories = Array.from(new Set(products.map(p => p.product_type)))
      .filter(cat => cat.toLowerCase().includes(queryLower))
      .slice(0, 2)
      .map(cat => ({
        text: cat,
        type: 'category' as const,
        count: products.filter(p => p.product_type === cat).length,
      }));

    // Tag suggestions
    const allTags = products.flatMap(p => p.tags);
    const tagCounts = new Map<string, number>();
    allTags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });

    const tagSuggestions = Array.from(tagCounts.entries())
      .filter(([tag]) => tag.toLowerCase().includes(queryLower))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([tag, count]) => ({
        text: tag,
        type: 'tag' as const,
        count,
      }));

    suggestions.push(...productSuggestions, ...categories, ...tagSuggestions);

    return suggestions.slice(0, limit);
  }
}

// Main search engine
export class ProductSearchEngine {
  static search(
    products: ReninProduct[],
    query: string,
    filters: Partial<SearchFilters> = {}
  ): SearchResult[] {
    let filteredProducts = this.applyFilters(products, filters);

    if (!query || query.trim().length === 0) {
      return filteredProducts.map(product => ({
        product,
        score: 1,
        matchedFields: [],
        exactMatches: [],
      }));
    }

    // Score and rank products
    const searchResults = filteredProducts
      .map(product => SearchScorer.scoreProduct(product, query))
      .filter(result => result.score > 0)
      .sort((a, b) => {
        // Sort by score first
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // Then by exact matches
        if (b.exactMatches.length !== a.exactMatches.length) {
          return b.exactMatches.length - a.exactMatches.length;
        }
        // Then alphabetically
        return a.product.title.localeCompare(b.product.title);
      });

    return this.applySorting(searchResults, filters.sortBy, filters.sortOrder);
  }

  private static applyFilters(products: ReninProduct[], filters: Partial<SearchFilters>): ReninProduct[] {
    let filtered = [...products];

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(p =>
        filters.categories!.includes(p.product_type)
      );
    }

    // Tag filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(p =>
        filters.tags!.some(tag => p.tags.includes(tag))
      );
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(p => {
        const prices = p.variants.map(v => v.price).filter(price => price > 0);
        if (prices.length === 0) return false;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return maxPrice >= filters.priceRange!.min && minPrice <= filters.priceRange!.max;
      });
    }

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p =>
        p.variants.some(v => v.inventory_quantity > 0)
      );
    }

    return filtered;
  }

  private static applySorting(
    results: SearchResult[],
    sortBy: SortOption = 'relevance',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): SearchResult[] {
    const sorted = [...results];

    switch (sortBy) {
      case 'price':
        sorted.sort((a, b) => {
          const aPrice = Math.min(...a.product.variants.map(v => v.price).filter(p => p > 0));
          const bPrice = Math.min(...b.product.variants.map(v => v.price).filter(p => p > 0));
          return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
        });
        break;
      case 'name':
        sorted.sort((a, b) => {
          const comparison = a.product.title.localeCompare(b.product.title);
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        break;
      case 'newest':
        // Assuming products with higher IDs are newer
        sorted.sort((a, b) => {
          const comparison = a.product.id.localeCompare(b.product.id);
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        break;
      case 'popularity':
        // Sort by number of variants (proxy for popularity)
        sorted.sort((a, b) => {
          const aPopularity = a.product.variants.length;
          const bPopularity = b.product.variants.length;
          return sortOrder === 'asc' ? aPopularity - bPopularity : bPopularity - aPopularity;
        });
        break;
      case 'relevance':
      default:
        // Already sorted by relevance score
        if (sortOrder === 'asc') {
          sorted.reverse();
        }
        break;
    }

    return sorted;
  }

  static generateFilterStats(products: ReninProduct[]): FilterStats {
    const categoryMap = new Map<string, number>();
    const tagMap = new Map<string, number>();
    const prices: number[] = [];
    let inStockCount = 0;

    products.forEach(product => {
      // Categories
      categoryMap.set(product.product_type, (categoryMap.get(product.product_type) || 0) + 1);

      // Tags
      product.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });

      // Prices
      const productPrices = product.variants.map(v => v.price).filter(p => p > 0);
      prices.push(...productPrices);

      // Stock status
      if (product.variants.some(v => v.inventory_quantity > 0)) {
        inStockCount++;
      }
    });

    return {
      categories: Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      tags: Array.from(tagMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 1000,
      },
      totalProducts: products.length,
      inStockCount,
    };
  }
}

// Utility functions
export const searchUtils = {
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  highlightText(text: string, query: string): string {
    if (!query || query.trim().length === 0) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(price);
  },

  getProductPriceRange(product: ReninProduct): { min: number; max: number } {
    const prices = product.variants.map(v => v.price).filter(p => p > 0);
    return {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0,
    };
  },

  isProductInStock(product: ReninProduct): boolean {
    return product.variants.some(v => v.inventory_quantity > 0);
  },
};