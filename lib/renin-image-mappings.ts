/**
 * Renin Product Image Mappings
 * Maps Renin product IDs to their corresponding extracted image files
 * with HD prioritization and fallback handling
 */

export interface ImageMapping {
  productId: string | number
  productName: string
  images: {
    hd?: string[]
    regular?: string[]
    variants?: string[]
  }
  primaryImage: string
  allImages: string[]
}

// Extract product ID from Arcat filename
export function extractProductIdFromFilename(filename: string): string | null {
  const match = filename.match(/renin_(\d+)_/);
  return match ? match[1] : null;
}

// Corrected image mapping for 13 actual products with 21 ARCAT image IDs
export const availableArcatImages = {
  // Euro Collection Bifold & Bypass Doors
  "155701": {
    hd: ["/images/arcat/renin_155701_hd.jpg"],
    regular: ["/images/arcat/renin_155701_Bifold_Closet_Door_Euro_1_Lite.jpg"],
    variants: ["/images/arcat/renin_155701_Bifold_Closet_Door_Euro_1_Lite_v2.jpg"]
  },
  "155725": {
    hd: ["/images/arcat/renin_155725_hd.jpg"],
    regular: ["/images/arcat/renin_155725_Bypass_Closet_Doors_Euro_1_Lite.jpg"],
    variants: ["/images/arcat/renin_155725_Bypass_Closet_Doors_Euro_1_Lite_v2.jpg"]
  },
  "155731": {
    hd: ["/images/arcat/renin_155731_hd.jpg"],
    regular: ["/images/arcat/renin_155731_Bifold_Closet_Door_Euro_3_Lite.jpg"],
    variants: ["/images/arcat/renin_155731_Bifold_Closet_Door_Euro_3_Lite_v2.jpg"]
  },
  "155732": {
    hd: ["/images/arcat/renin_155732_hd.jpg"],
    regular: ["/images/arcat/renin_155732_Bypass_Closet_Doors_Euro_3_Lite.jpg"],
    variants: ["/images/arcat/renin_155732_Bypass_Closet_Doors_Euro_3_Lite_v2.jpg"]
  },

  // Continental Collection Doors
  "176732": {
    hd: ["/images/arcat/renin_176732_hd.jpg"],
    regular: ["/images/arcat/renin_176732_Continental_Dunmore_K_Lite.jpg"]
  },
  "176733": {
    hd: ["/images/arcat/renin_176733_hd.jpg"],
    regular: ["/images/arcat/renin_176733_Continental_Pavilion_5_Lite.jpg"]
  },
  "176737": {
    hd: ["/images/arcat/renin_176737_hd.jpg"],
    regular: ["/images/arcat/renin_176737_Heritage_Salinas_Z_Design.jpg"]
  },

  // Heritage & Premium Collections
  "192853": {
    hd: ["/images/arcat/renin_192853_hd.jpg"]
  },
  "192856": {
    hd: ["/images/arcat/renin_192856_hd.jpg"]
  },
  "192859": {
    hd: ["/images/arcat/renin_192859_hd.jpg"]
  },
  "192861": {
    hd: ["/images/arcat/renin_192861_hd.jpg"],
    regular: ["/images/arcat/renin_192861_Heritage_Herringbone_Chevron_Design.jpg"]
  },

  // Harmony Medicine Cabinets
  "199063": {
    hd: ["/images/arcat/renin_199063_hd.jpg"]
  },
  "199064": {
    hd: ["/images/arcat/renin_199064_hd.jpg"]
  },
  "199065": {
    hd: ["/images/arcat/renin_199065_hd.jpg"]
  },

  // Hardware Collection
  "199077": {
    regular: ["/images/arcat/renin_199077_Handles_Pulls_Cairns.jpg"]
  },
  "199078": {
    regular: ["/images/arcat/renin_199078_Barn_Door_Lock_Tear_Drop_Privacy_Latch.jpg"]
  },

  // Twilight LED Mirror Collection
  "205717": {
    hd: ["/images/arcat/renin_205717_hd.jpg"]
  },
  "205718": {
    hd: ["/images/arcat/renin_205718_hd.jpg"]
  },
  "205720": {
    hd: ["/images/arcat/renin_205720_hd.jpg"]
  },
  "205721": {
    hd: ["/images/arcat/renin_205721_hd.jpg"]
  },
  "205723": {
    hd: ["/images/arcat/renin_205723_hd.jpg"]
  }
} as const;

// Product name patterns for 13 actual products with corrected categorization
export const productNamePatterns = {
  // Barn Door Patterns
  "heritage-barn-door": ["192861", "192859"],
  "continental-barn-door": ["176732", "176733", "176737"],

  // Sliding Door Patterns
  "euro-1-lite": ["155701", "155725"],
  "euro-3-lite": ["155731", "155732"],
  "euro-5-lite-sliding": ["176733", "176737"],
  "twilight-sliding-door": ["205717", "205718"],

  // Bifold Door Patterns
  "harmony-bifold": ["199063", "199064"],
  "steel-frame-bifold": ["199065", "199064"],

  // Pivot Door Patterns
  "provincial-pivot-door": ["205720", "205721"],
  "crochet-pivot-door": ["205721", "205723"],

  // Hardware Patterns
  "invisiglide-hardware-kit": ["192853", "192856"],
  "industrial-barn-hardware": ["199077", "199078"],

  // Mirror Patterns
  "vienna-mirror": ["199064", "199065"]
} as const;

// Corrected mapping connecting 13 actual products to their Arcat image IDs
export const productToArcatMapping: Record<string | number, string[]> = {
  // Product 1: Euro 1-Lite (sliding)
  1: ["155725", "155701"],

  // Product 2: Euro 3-Lite (sliding)
  2: ["155732", "155731"],

  // Product 3: Heritage Barn Door (barn)
  3: ["192861", "192859"],

  // Product 4: Continental Barn Door (barn)
  4: ["176732", "176733"],

  // Product 5: Harmony Bifold (bifold)
  5: ["199064", "199063"],

  // Product 6: Twilight Sliding Door (sliding)
  6: ["205717", "205718"],

  // Product 7: InvisiGlide Hardware Kit (hardware)
  7: ["192853", "192856"],

  // Product 8: Vienna Mirror 30x42 (mirrors)
  8: ["199064", "199065"],

  // Product 9: Steel Frame Bifold (bifold)
  9: ["199065", "199064"],

  // Product 10: Provincial Pivot Door (pivot)
  10: ["205720", "205721"],

  // Product 11: Crochet Pivot Door (pivot)
  11: ["205721", "205723"],

  // Product 12: Euro 5-Lite Sliding (sliding)
  12: ["176733", "176737"],

  // Product 13: Industrial Barn Hardware (hardware)
  13: ["199077", "199078"]
};

/**
 * Get images for a product with HD prioritization
 */
export function getImagesForProduct(productId: string | number): string[] {
  const arcatIds = productToArcatMapping[productId];
  if (!arcatIds || arcatIds.length === 0) {
    return [];
  }

  const allImages: string[] = [];

  for (const arcatId of arcatIds) {
    const imageSet = availableArcatImages[arcatId as keyof typeof availableArcatImages];
    if (imageSet) {
      // Prioritize HD images first
      if ('hd' in imageSet && imageSet.hd) {
        allImages.push(...imageSet.hd);
      }
      // Then add regular images
      if ('regular' in imageSet && imageSet.regular) {
        allImages.push(...imageSet.regular);
      }
      // Finally add variants
      if ('variants' in imageSet && imageSet.variants) {
        allImages.push(...imageSet.variants);
      }
    }
  }

  return allImages;
}

/**
 * Get primary image for a product (best quality available)
 */
export function getPrimaryImageForProduct(productId: string | number): string {
  const images = getImagesForProduct(productId);
  return images[0] || '/images/placeholder-product.jpg';
}

/**
 * Get HD image if available, otherwise return best available
 */
export function getHDImageForProduct(productId: string | number): string {
  const arcatIds = productToArcatMapping[productId];
  if (!arcatIds || arcatIds.length === 0) {
    return '/images/placeholder-product.jpg';
  }

  // Look for HD version first
  for (const arcatId of arcatIds) {
    const imageSet = availableArcatImages[arcatId as keyof typeof availableArcatImages];
    if (imageSet && 'hd' in imageSet && imageSet.hd && imageSet.hd.length > 0) {
      return imageSet.hd[0];
    }
  }

  // Fallback to primary image
  return getPrimaryImageForProduct(productId);
}

/**
 * Get all available image variants for a product
 */
export function getAllImageVariantsForProduct(productId: string | number): {
  hd: string[]
  regular: string[]
  variants: string[]
  all: string[]
} {
  const arcatIds = productToArcatMapping[productId];
  const result = {
    hd: [] as string[],
    regular: [] as string[],
    variants: [] as string[],
    all: [] as string[]
  };

  if (!arcatIds || arcatIds.length === 0) {
    return result;
  }

  for (const arcatId of arcatIds) {
    const imageSet = availableArcatImages[arcatId as keyof typeof availableArcatImages];
    if (imageSet) {
      if ('hd' in imageSet && imageSet.hd) result.hd.push(...imageSet.hd);
      if ('regular' in imageSet && imageSet.regular) result.regular.push(...imageSet.regular);
      if ('variants' in imageSet && imageSet.variants) result.variants.push(...imageSet.variants);
    }
  }

  result.all = [...result.hd, ...result.regular, ...result.variants];
  return result;
}

/**
 * Check if a product has HD images available
 */
export function hasHDImages(productId: string | number): boolean {
  const variants = getAllImageVariantsForProduct(productId);
  return variants.hd.length > 0;
}

/**
 * Get fallback image for a category if no product images are available
 */
export function getCategoryFallbackImage(category: string): string {
  const fallbackMap: Record<string, string> = {
    // Use actual product images as category fallbacks
    'barn': '/images/arcat/renin_192861_Heritage_Herringbone_Chevron_Design.jpg',
    'sliding': '/images/arcat/renin_176733_Continental_Pavilion_5_Lite.jpg',
    'bifold': '/images/arcat/renin_199064_hd.jpg',
    'pivot': '/images/arcat/renin_205720_hd.jpg',
    'hardware': '/images/arcat/renin_199077_Handles_Pulls_Cairns.jpg',
    'mirrors': '/images/arcat/renin_199064_hd.jpg',
    // Legacy fallbacks
    'barn-doors': '/images/arcat/renin_192861_Heritage_Herringbone_Chevron_Design.jpg',
    'interior-doors': '/images/arcat/renin_176733_Continental_Pavilion_5_Lite.jpg',
    'closet-systems': '/images/arcat/renin_199064_hd.jpg',
    'room-dividers': '/images/arcat/renin_205720_hd.jpg',
    'glass-mirrors': '/images/arcat/renin_199064_hd.jpg'
  };

  return fallbackMap[category] || '/images/arcat/renin_176733_Continental_Pavilion_5_Lite.jpg';
}

/**
 * Enhanced function to get product images with intelligent mapping
 */
export function getEnhancedProductImages(product: any): string[] {
  const productId = product.id;

  // First try to get images from our mapping system
  const mappedImages = getImagesForProduct(productId);
  if (mappedImages.length > 0) {
    return mappedImages;
  }

  // Fallback to existing arcatImages if available
  if (product.arcatImages && product.arcatImages.length > 0) {
    return product.arcatImages;
  }

  // Fallback to Home Depot image
  if (product.homeDepotImage) {
    return [product.homeDepotImage];
  }

  // Final fallback to category-specific placeholder
  return [getCategoryFallbackImage(product.category)];
}

/**
 * Debug function to see mapping for a product
 */
export function debugProductImageMapping(productId: string | number): {
  productId: string | number
  arcatIds: string[]
  images: ReturnType<typeof getAllImageVariantsForProduct>
  primaryImage: string
  hasHD: boolean
} {
  return {
    productId,
    arcatIds: productToArcatMapping[productId] || [],
    images: getAllImageVariantsForProduct(productId),
    primaryImage: getPrimaryImageForProduct(productId),
    hasHD: hasHDImages(productId)
  };
}

// Export all available Arcat image IDs for reference
export const allArcatImageIds = Object.keys(availableArcatImages);

// Export image statistics for the corrected dataset
export const imageStatistics = {
  totalProducts: Object.keys(productToArcatMapping).length, // 13 actual products
  totalArcatImages: Object.keys(availableArcatImages).length, // 21 ARCAT image IDs
  productsWithHD: Object.values(availableArcatImages).filter(set => 'hd' in set && set.hd && set.hd.length > 0).length,
  productsWithVariants: Object.values(availableArcatImages).filter(set => 'variants' in set && set.variants && set.variants.length > 0).length,
  phantomProductsRemoved: 53 // 66 - 13 = 53 phantom products removed
};