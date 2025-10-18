/**
 * Product Filtering Utilities
 *
 * Provides filtering logic for product catalogs based on various criteria:
 * - Price range
 * - Finish/color options
 * - Size dimensions (width/height)
 * - Features and addons
 */

import type { FilterValues } from '@/components/products/ProductFilters';

// Product interface matching simple-products.json structure
export interface SimpleProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  configurator_data: {
    opening_min_width: number;
    opening_max_width: number;
    opening_min_height: number;
    opening_max_height: number;
    panel_options: number[];
    finish_options: Array<{
      id: string;
      name: string;
      color: string;
      price_modifier: number;
    }>;
    base_price_cad: number;
    installed_price_from_cad: number;
    price_per_panel: number;
    lead_time_weeks: number;
    includes: string[];
    addons: Array<{
      id: string;
      name: string;
      description: string;
      price_cad: number;
      category: string;
    }>;
  };
}

/**
 * Extract unique finishes from products
 */
export function extractAvailableFinishes(products: SimpleProduct[]): Array<{ id: string; name: string; color: string }> {
  const finishMap = new Map<string, { id: string; name: string; color: string }>();

  products.forEach(product => {
    product.configurator_data.finish_options.forEach(finish => {
      if (!finishMap.has(finish.id)) {
        finishMap.set(finish.id, {
          id: finish.id,
          name: finish.name,
          color: finish.color,
        });
      }
    });
  });

  return Array.from(finishMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Extract unique features from products
 */
export function extractAvailableFeatures(products: SimpleProduct[]): string[] {
  const featureSet = new Set<string>();

  products.forEach(product => {
    product.configurator_data.addons.forEach(addon => {
      if (addon.category === 'hardware') {
        featureSet.add(addon.name);
      }
    });
  });

  return Array.from(featureSet).sort();
}

/**
 * Get price range from products
 */
export function getPriceRange(products: SimpleProduct[]): [number, number] {
  if (products.length === 0) return [0, 100000];

  const prices = products.map(p => p.price);
  return [Math.min(...prices), Math.max(...prices)];
}

/**
 * Get width range from products
 */
export function getWidthRange(products: SimpleProduct[]): [number, number] {
  if (products.length === 0) return [24, 96];

  const minWidths = products.map(p => p.configurator_data.opening_min_width);
  const maxWidths = products.map(p => p.configurator_data.opening_max_width);

  return [Math.min(...minWidths), Math.max(...maxWidths)];
}

/**
 * Get height range from products
 */
export function getHeightRange(products: SimpleProduct[]): [number, number] {
  if (products.length === 0) return [60, 120];

  const minHeights = products.map(p => p.configurator_data.opening_min_height);
  const maxHeights = products.map(p => p.configurator_data.opening_max_height);

  return [Math.min(...minHeights), Math.max(...maxHeights)];
}

/**
 * Apply filters to products
 */
export function applyFilters(products: SimpleProduct[], filters: FilterValues): SimpleProduct[] {
  return products.filter(product => {
    // Price filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Finish filter
    if (filters.finishes.length > 0) {
      const productFinishIds = product.configurator_data.finish_options.map(f => f.id);
      const hasMatchingFinish = filters.finishes.some(finishId =>
        productFinishIds.includes(finishId)
      );
      if (!hasMatchingFinish) {
        return false;
      }
    }

    // Width filter
    const productMinWidth = product.configurator_data.opening_min_width;
    const productMaxWidth = product.configurator_data.opening_max_width;

    // Check if product's width range overlaps with filter range
    if (productMaxWidth < filters.widthRange[0] || productMinWidth > filters.widthRange[1]) {
      return false;
    }

    // Height filter
    const productMinHeight = product.configurator_data.opening_min_height;
    const productMaxHeight = product.configurator_data.opening_max_height;

    // Check if product's height range overlaps with filter range
    if (productMaxHeight < filters.heightRange[0] || productMinHeight > filters.heightRange[1]) {
      return false;
    }

    // Features filter
    if (filters.features.length > 0) {
      const productFeatures = product.configurator_data.addons
        .filter(addon => addon.category === 'hardware')
        .map(addon => addon.name);

      const hasMatchingFeature = filters.features.some(feature =>
        productFeatures.includes(feature)
      );

      if (!hasMatchingFeature) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get filter metadata (counts, ranges, etc.)
 */
export function getFilterMetadata(products: SimpleProduct[], filters: FilterValues) {
  const filteredProducts = applyFilters(products, filters);

  return {
    totalProducts: products.length,
    filteredCount: filteredProducts.length,
    availableFinishes: extractAvailableFinishes(filteredProducts),
    availableFeatures: extractAvailableFeatures(filteredProducts),
    priceRange: getPriceRange(filteredProducts),
    widthRange: getWidthRange(filteredProducts),
    heightRange: getHeightRange(filteredProducts),
  };
}

/**
 * Initialize default filters for a product set
 */
export function initializeFilters(products: SimpleProduct[]): FilterValues {
  return {
    priceRange: getPriceRange(products),
    finishes: [],
    widthRange: getWidthRange(products),
    heightRange: getHeightRange(products),
    features: [],
  };
}

/**
 * Check if any filters are active (different from defaults)
 */
export function hasActiveFilters(filters: FilterValues, defaults: FilterValues): boolean {
  if (filters.priceRange[0] !== defaults.priceRange[0] ||
      filters.priceRange[1] !== defaults.priceRange[1]) {
    return true;
  }

  if (filters.widthRange[0] !== defaults.widthRange[0] ||
      filters.widthRange[1] !== defaults.widthRange[1]) {
    return true;
  }

  if (filters.heightRange[0] !== defaults.heightRange[0] ||
      filters.heightRange[1] !== defaults.heightRange[1]) {
    return true;
  }

  if (filters.finishes.length > 0 || filters.features.length > 0) {
    return true;
  }

  return false;
}
