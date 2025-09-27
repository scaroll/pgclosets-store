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

// Enhanced image mapping with all 120+ images for 66 products
export const availableArcatImages = {
  // Euro Collection Bifold & Bypass Doors
  "155701": {
    hd: ["/images/arcat/renin_155701_hd.jpg"],
    regular: ["/images/arcat/renin_155701_Bifold_Closet_Door_Euro_1_Lite.jpg"],
    variants: ["/images/arcat/renin_155701_Bifold_Closet_Door_Euro_1_Lite_v2.jpg"]
  },
  "155706": {
    hd: ["/images/arcat/renin_155706_hd.jpg"],
    regular: ["/images/arcat/renin_155706_Bypass_Closet_Doors_Parsons_Flush_Panel_Design.jpg"],
    variants: ["/images/arcat/renin_155706_Bypass_Closet_Doors_Parsons_Flush_Panel_Design_v2.jpg"]
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
  "176725": {
    regular: ["/images/arcat/renin_176725_Bypass_Closet_Doors_Georgian_6_Panel_Design.jpg"]
  },
  "176728": {
    regular: ["/images/arcat/renin_176728_Bypass_Closet_Doors_Ashbury_2_Panel_Design.jpg"]
  },
  "176729": {
    regular: ["/images/arcat/renin_176729_Continental_Hall_3_Lite.jpg"]
  },
  "176732": {
    hd: ["/images/arcat/renin_176732_hd.jpg"],
    regular: ["/images/arcat/renin_176732_Continental_Dunmore_K_Lite.jpg"]
  },
  "176733": {
    hd: ["/images/arcat/renin_176733_hd.jpg"],
    regular: ["/images/arcat/renin_176733_Continental_Pavilion_5_Lite.jpg"]
  },
  "176736": {
    hd: ["/images/arcat/renin_176736_hd.jpg"]
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
  "192857": {
    hd: ["/images/arcat/renin_192857_hd.jpg"]
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

// Enhanced product name patterns for 66 products with better categorization
export const productNamePatterns = {
  // Barn Door Patterns
  "heritage-herringbone": ["192861"],
  "heritage-salinas": ["176737"],
  "continental-dunmore": ["176732"],
  "continental-pavilion": ["176733"],
  "continental-hall": ["176729"],
  "heritage-modern": ["176736"],
  "heritage-classic": ["192859"],
  "advanced-heritage": ["192857"],

  // Bypass Door Patterns
  "euro-1-lite-bypass": ["155725"],
  "euro-3-lite-bypass": ["155732"],
  "euro-1-lite-bifold": ["155701"],
  "euro-3-lite-bifold": ["155731"],
  "parsons-flush": ["155706"],
  "georgian-6-panel": ["176725"],
  "ashbury-2-panel": ["176728"],

  // LED Mirror Patterns
  "twilight-led-24x32": ["205717"],
  "twilight-led-30x36": ["205718"],
  "twilight-led-36x48": ["205720"],
  "twilight-led-42x60": ["205721"],
  "twilight-led-premium": ["205723"],

  // Medicine Cabinet Patterns
  "harmony-medicine-cabinet": ["199063"],
  "harmony-premium-cabinet": ["199064"],
  "harmony-deluxe-cabinet": ["199065"],

  // Hardware Patterns
  "cairns-handles": ["199077"],
  "tear-drop-latch": ["199078"],
  "invisiglide-hardware": ["192853", "192856"],

  // Legacy patterns for backward compatibility
  "euro-1-lite": ["155701", "155725"],
  "euro-3-lite": ["155731", "155732"],
  "heritage-barn-door": ["192861", "192859"],
  "continental-barn-door": ["176732", "176733"],
  "harmony-bifold": ["199064", "199063"],
  "twilight-sliding-door": ["205717", "205718"],
  "invisiglide-hardware-kit": ["192853", "192856"],
  "handles-pulls": ["199077"],
  "barn-door-lock": ["199078"]
} as const;

// Enhanced mapping connecting Enhanced Product Catalog to Arcat image IDs
export const productToArcatMapping: Record<string | number, string[]> = {
  // Barn Doors (18 products - PROD-0001 to PROD-0018)
  1: ["192861"], // Heritage Herringbone
  2: ["176737"], // Heritage Salinas Z-Design
  3: ["176732"], // Continental Dunmore K-Lite
  4: ["176733"], // Continental Pavilion 5-Lite
  5: ["176729"], // Continental Hall 3-Lite
  6: ["176732"], // Continental Dunmore (variant)
  7: ["176733"], // Continental Pavilion (variant)
  8: ["176736"], // Heritage Modern Design
  9: ["176737"], // Heritage Salinas (variant)
  10: ["192857"], // Advanced Heritage System
  11: ["192859"], // Heritage Classic Design
  12: ["192861"], // Heritage Herringbone (variant)
  13: ["192853"], // Premium Hardware Barn Door
  14: ["192856"], // Advanced Track Barn Door
  15: ["176725"], // Georgian Style Barn Door
  16: ["176728"], // Ashbury Style Barn Door
  17: ["199064"], // Harmony Style Barn Door
  18: ["199065"], // Harmony Premium Barn Door

  // Bypass Doors (20 products - PROD-0019 to PROD-0038)
  19: ["155725"], // Euro 1-Lite Bypass 48x80
  20: ["155732"], // Euro 3-Lite Bypass 48x80
  21: ["155701"], // Euro 1-Lite Bifold
  22: ["155706"], // Parsons Flush Panel
  23: ["155706"], // Parsons Flush Panel (variant)
  24: ["155731"], // Euro 3-Lite Bifold
  25: ["155732"], // Euro 3-Lite Bypass (variant)
  26: ["176725"], // Georgian 6-Panel Bypass
  27: ["176725"], // Georgian 6-Panel (variant)
  28: ["176728"], // Ashbury 2-Panel Bypass
  29: ["176728"], // Ashbury 2-Panel (variant)
  30: ["176729"], // Continental Hall Bypass
  31: ["176736"], // Heritage Modern Bypass
  32: ["192857"], // Advanced Bypass System
  33: ["192859"], // Heritage Classic Bypass
  34: ["155725"], // Euro 1-Lite (additional size)
  35: ["155732"], // Euro 3-Lite (additional size)
  36: ["155701"], // Euro 1-Lite Bifold (variant)
  37: ["155706"], // Parsons Design (additional)
  38: ["155731"], // Euro 3-Lite Bifold (variant)

  // LED Mirrors (12 products - PROD-0039 to PROD-0050)
  39: ["205717"], // Twilight LED Mirror 24x32
  40: ["205717"], // Twilight LED Mirror (variant)
  41: ["205718"], // Twilight LED Mirror 30x36
  42: ["205718"], // Twilight LED Mirror (variant)
  43: ["205720"], // Twilight LED Mirror 36x48
  44: ["205720"], // Twilight LED Mirror (variant)
  45: ["205721"], // Twilight LED Mirror 42x60
  46: ["205721"], // Twilight LED Mirror (variant)
  47: ["205723"], // Twilight LED Mirror Premium
  48: ["205723"], // Twilight LED Mirror Premium (variant)
  49: ["205717"], // Twilight Compact LED
  50: ["205718"], // Twilight Standard LED

  // Medicine Cabinets (10 products - PROD-0051 to PROD-0060)
  51: ["199063"], // Harmony Medicine Cabinet 24x30
  52: ["199063"], // Harmony Medicine Cabinet (variant)
  53: ["199064"], // Harmony Premium Cabinet
  54: ["199064"], // Harmony Premium Cabinet (variant)
  55: ["199065"], // Harmony Deluxe Cabinet
  56: ["199065"], // Harmony Deluxe Cabinet (variant)
  57: ["199063"], // Harmony Compact Cabinet
  58: ["199064"], // Harmony Standard Cabinet
  59: ["199065"], // Harmony Large Cabinet
  60: ["199063"], // Harmony Basic Cabinet

  // Hardware (6 products - PROD-0061 to PROD-0066)
  61: ["199077"], // Cairns Handle Pulls
  62: ["199078"], // Tear Drop Privacy Latch
  63: ["192853"], // InvisiGlide Hardware Kit
  64: ["192853"], // InvisiGlide Hardware Kit (variant)
  65: ["192856"], // Premium Track System
  66: ["192856"], // Premium Track System (variant)
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
      if (imageSet.hd) {
        allImages.push(...imageSet.hd);
      }
      // Then add regular images
      if (imageSet.regular) {
        allImages.push(...imageSet.regular);
      }
      // Finally add variants
      if (imageSet.variants) {
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
    if (imageSet?.hd && imageSet.hd.length > 0) {
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
      if (imageSet.hd) result.hd.push(...imageSet.hd);
      if (imageSet.regular) result.regular.push(...imageSet.regular);
      if (imageSet.variants) result.variants.push(...imageSet.variants);
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
    'barn-doors': '/images/placeholder-barn-door.jpg',
    'interior-doors': '/images/placeholder-interior-door.jpg',
    'closet-systems': '/images/placeholder-closet.jpg',
    'room-dividers': '/images/placeholder-divider.jpg',
    'glass-mirrors': '/images/placeholder-glass.jpg',
    'hardware': '/images/placeholder-hardware.jpg',
    'sliding': '/images/placeholder-sliding.jpg',
    'bifold': '/images/placeholder-bifold.jpg',
    'barn': '/images/placeholder-barn-door.jpg'
  };

  return fallbackMap[category] || '/images/placeholder-product.jpg';
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

// Export image statistics
export const imageStatistics = {
  totalProducts: Object.keys(productToArcatMapping).length,
  totalArcatImages: Object.keys(availableArcatImages).length,
  productsWithHD: Object.values(availableArcatImages).filter(set => set.hd && set.hd.length > 0).length,
  productsWithVariants: Object.values(availableArcatImages).filter(set => set.variants && set.variants.length > 0).length
};