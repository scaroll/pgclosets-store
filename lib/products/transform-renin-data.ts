/**
 * Transform Renin Product Data to Normalized Schema
 *
 * Converts legacy Renin product data to the optimized normalized format
 * for maximum performance and searchability.
 */

import type {
  NormalizedProduct,
  ProductCategory,
  ProductCollection,
  NormalizedVariant,
  MediaAsset,
  SKUConfig,
} from './product-data';
import { generateSKU } from './product-data';

// ============================================================================
// LEGACY DATA TYPES
// ============================================================================

interface LegacyReninProduct {
  id: number | string;
  name: string;
  slug: string;
  category: string;
  price: number;
  homeDepotImage?: string;
  arcatImages?: string[];
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  installationTime?: string;
  inStock?: boolean;
}

// ============================================================================
// CATEGORY TAXONOMY
// ============================================================================

/**
 * Renin category taxonomy with hierarchical structure
 */
export const RENIN_CATEGORY_TAXONOMY: Record<string, {
  id: string;
  name: string;
  handle: string;
  description: string;
  parentId?: string;
  level: number;
  displayOrder: number;
}> = {
  // Level 0 - Root categories
  'doors': {
    id: 'doors',
    name: 'Doors',
    handle: 'doors',
    description: 'Premium door solutions for residential and commercial spaces',
    level: 0,
    displayOrder: 1,
  },
  'hardware': {
    id: 'hardware',
    name: 'Hardware & Accessories',
    handle: 'hardware',
    description: 'Quality hardware and accessories for door installations',
    level: 0,
    displayOrder: 2,
  },
  'mirrors': {
    id: 'mirrors',
    name: 'Mirrors',
    handle: 'mirrors',
    description: 'High-quality mirrors for closet doors and walls',
    level: 0,
    displayOrder: 3,
  },

  // Level 1 - Door types
  'barn-doors': {
    id: 'barn-doors',
    name: 'Barn Doors',
    handle: 'barn-doors',
    description: 'Rustic and modern barn door systems with premium sliding hardware',
    parentId: 'doors',
    level: 1,
    displayOrder: 1,
  },
  'bypass-doors': {
    id: 'bypass-doors',
    name: 'Bypass Doors',
    handle: 'bypass-doors',
    description: 'Space-saving bypass closet door systems',
    parentId: 'doors',
    level: 1,
    displayOrder: 2,
  },
  'bifold-doors': {
    id: 'bifold-doors',
    name: 'Bifold Doors',
    handle: 'bifold-doors',
    description: 'Compact bifold door solutions for closets and small spaces',
    parentId: 'doors',
    level: 1,
    displayOrder: 3,
  },
  'pivot-doors': {
    id: 'pivot-doors',
    name: 'Pivot Doors',
    handle: 'pivot-doors',
    description: 'Elegant pivot door systems with smooth operation',
    parentId: 'doors',
    level: 1,
    displayOrder: 4,
  },
  'sliding-doors': {
    id: 'sliding-doors',
    name: 'Sliding Doors',
    handle: 'sliding-doors',
    description: 'Premium sliding closet doors with smooth operation',
    parentId: 'doors',
    level: 1,
    displayOrder: 5,
  },

  // Level 1 - Hardware types
  'barn-hardware': {
    id: 'barn-hardware',
    name: 'Barn Door Hardware',
    handle: 'barn-hardware',
    description: 'Complete barn door hardware kits and accessories',
    parentId: 'hardware',
    level: 1,
    displayOrder: 1,
  },
  'handles-pulls': {
    id: 'handles-pulls',
    name: 'Handles & Pulls',
    handle: 'handles-pulls',
    description: 'Door handles, pulls, and latches',
    parentId: 'hardware',
    level: 1,
    displayOrder: 2,
  },
  'track-systems': {
    id: 'track-systems',
    name: 'Track Systems',
    handle: 'track-systems',
    description: 'Sliding track systems and components',
    parentId: 'hardware',
    level: 1,
    displayOrder: 3,
  },

  // Level 1 - Mirror types
  'backlit-mirrors': {
    id: 'backlit-mirrors',
    name: 'Backlit Mirrors',
    handle: 'backlit-mirrors',
    description: 'LED backlit mirrors for modern bathrooms',
    parentId: 'mirrors',
    level: 1,
    displayOrder: 1,
  },
  'closet-mirrors': {
    id: 'closet-mirrors',
    name: 'Closet Mirrors',
    handle: 'closet-mirrors',
    description: 'Mirrors designed for closet door installation',
    parentId: 'mirrors',
    level: 1,
    displayOrder: 2,
  },
};

/**
 * Map legacy categories to new taxonomy
 */
const CATEGORY_MAP: Record<string, string> = {
  'barn': 'barn-doors',
  'barn-door': 'barn-doors',
  'barn-doors': 'barn-doors',
  'sliding': 'sliding-doors',
  'bypass': 'bypass-doors',
  'bypass-doors': 'bypass-doors',
  'bifold': 'bifold-doors',
  'bifold-doors': 'bifold-doors',
  'pivot': 'pivot-doors',
  'pivot-doors': 'pivot-doors',
  'hardware': 'barn-hardware',
  'mirrors': 'closet-mirrors',
};

// ============================================================================
// TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transform legacy Renin product to normalized format
 */
export function transformReninProduct(
  legacyProduct: LegacyReninProduct,
  sequenceNumber: number,
  skuConfig: SKUConfig,
  mediaMap: Map<string, MediaAsset>
): {
  product: NormalizedProduct;
  variants: NormalizedVariant[];
  media: MediaAsset[];
} {
  const productId = `prod_${legacyProduct.id}`;
  const categoryId = mapLegacyCategory(legacyProduct.category);
  const category = RENIN_CATEGORY_TAXONOMY[categoryId];

  // Generate SKU
  const sku = generateSKU(
    skuConfig,
    sequenceNumber,
    categoryId.split('-')[0].toUpperCase()
  );

  // Process media
  const { thumbnailId, imageIds, mediaAssets } = processProductMedia(
    productId,
    legacyProduct,
    mediaMap
  );

  // Extract features and specifications
  const features = legacyProduct.features || extractFeatures(legacyProduct);
  const specifications = legacyProduct.specifications || {};

  // Generate variants (different sizes)
  const variants = generateProductVariants(
    productId,
    sku,
    legacyProduct.price,
    specifications
  );

  // Determine collections
  const collectionIds = determineCollections(legacyProduct);

  // Extract tags
  const tags = extractTags(legacyProduct);

  // Create normalized product
  const product: NormalizedProduct = {
    // Core identifiers
    id: productId,
    sku,
    handle: legacyProduct.slug,

    // Basic info
    title: legacyProduct.name,
    description: legacyProduct.description || generateDescription(legacyProduct, category),
    shortDescription: generateShortDescription(legacyProduct),

    // Taxonomy
    categoryId,
    subcategoryId: category.parentId,
    collectionIds,

    // Pricing (convert to cents)
    basePrice: Math.round(legacyProduct.price * 100),
    msrp: Math.round(legacyProduct.price * 1.3 * 100), // MSRP typically 30% higher

    // Media
    thumbnailId,
    imageIds,

    // Product attributes
    brand: 'Renin',
    manufacturer: 'Renin Corp.',

    // Inventory
    inventory: {
      tracked: true,
      quantity: legacyProduct.inStock !== false ? 50 : 0,
      lowStockThreshold: 10,
      allowBackorder: true,
    },

    // Variants
    variantIds: variants.map(v => v.id),
    optionIds: [], // Will be set when generating options

    // Metadata
    tags,
    features,
    specifications,

    // SEO
    seo: {
      title: `${legacyProduct.name} - Renin Door Systems | Ottawa Installation`,
      description: generateSEODescription(legacyProduct, category),
      keywords: generateSEOKeywords(legacyProduct, category),
    },

    // Status
    status: 'active',
    featured: isFeaturedProduct(legacyProduct),

    // Timestamps
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),

    // Performance metrics
    viewCount: 0,
    salesCount: 0,
    averageRating: 0,
    reviewCount: 0,
  };

  return {
    product,
    variants,
    media: mediaAssets,
  };
}

/**
 * Map legacy category to new taxonomy
 */
function mapLegacyCategory(legacyCategory: string): string {
  const normalized = legacyCategory.toLowerCase().trim();
  return CATEGORY_MAP[normalized] || 'sliding-doors';
}

/**
 * Process product media and create assets
 */
function processProductMedia(
  productId: string,
  legacyProduct: LegacyReninProduct,
  mediaMap: Map<string, MediaAsset>
): {
  thumbnailId: string;
  imageIds: string[];
  mediaAssets: MediaAsset[];
} {
  const mediaAssets: MediaAsset[] = [];
  const imageIds: string[] = [];

  // Collect all image URLs
  const imageUrls: string[] = [];
  if (legacyProduct.homeDepotImage) {
    imageUrls.push(legacyProduct.homeDepotImage);
  }
  if (legacyProduct.arcatImages) {
    imageUrls.push(...legacyProduct.arcatImages);
  }

  // Create media assets
  imageUrls.forEach((url, index) => {
    const mediaId = `media_${productId}_${index}`;

    // Check if already exists
    if (mediaMap.has(url)) {
      const existing = mediaMap.get(url)!;
      imageIds.push(existing.id);
      return;
    }

    // Determine image type
    const isHD = url.includes('_hd.') || url.includes('_HD.');
    const isArcat = url.includes('/arcat/');
    const isHomeDepot = url.includes('homedepot.ca');

    const media: MediaAsset = {
      id: mediaId,
      url,
      altText: `${legacyProduct.name} - ${index === 0 ? 'Primary' : 'View ' + index}`,

      // Estimate dimensions (will need actual measurement)
      width: isHD ? 2048 : 1024,
      height: isHD ? 2048 : 1024,
      aspectRatio: 1,

      // Optimization formats (to be generated)
      formats: {
        thumbnail: url, // Placeholder
        medium: url,
        large: url,
        webp: undefined,
        avif: undefined,
      },

      // Metadata
      size: 0, // Unknown
      mimeType: 'image/jpeg',
      blurhash: undefined,

      createdAt: new Date().toISOString(),
    };

    mediaAssets.push(media);
    imageIds.push(mediaId);
    mediaMap.set(url, media);
  });

  return {
    thumbnailId: imageIds[0] || 'media_placeholder',
    imageIds,
    mediaAssets,
  };
}

/**
 * Generate product variants based on size options
 */
function generateProductVariants(
  productId: string,
  baseSKU: string,
  basePrice: number,
  specifications: Record<string, string>
): NormalizedVariant[] {
  // Extract width from specifications
  const widthSpec = specifications.width || specifications.Width || '';
  const hasWidthRange = widthSpec.includes('-');

  // Common door sizes for Renin products
  const commonSizes = [
    { width: '24"', modifier: 0.85 },
    { width: '30"', modifier: 0.95 },
    { width: '32"', modifier: 1.0 },
    { width: '36"', modifier: 1.1 },
    { width: '42"', modifier: 1.2 },
    { width: '48"', modifier: 1.3 },
    { width: '60"', modifier: 1.5 },
    { width: '72"', modifier: 1.7 },
  ];

  return commonSizes.map((size, index) => {
    const variantId = `var_${productId}_${index}`;
    const variantSKU = `${baseSKU}-${size.width.replace('"', '')}`;
    const variantPrice = Math.round(basePrice * 100 * size.modifier);

    return {
      id: variantId,
      productId,
      sku: variantSKU,

      price: variantPrice,
      compareAtPrice: Math.round(variantPrice * 1.3),

      options: {
        'Width': size.width,
      },

      inventory: {
        quantity: 25,
        tracked: true,
        allowBackorder: true,
      },

      imageId: undefined,

      weight: 50 + (index * 10), // Estimate weight based on size
      dimensions: {
        width: parseInt(size.width),
        height: 80,
        depth: 1.5,
        unit: 'inches',
      },

      active: true,
    };
  });
}

/**
 * Extract features from product data
 */
function extractFeatures(product: LegacyReninProduct): string[] {
  const features: string[] = [];

  // Add category-specific features
  const category = product.category.toLowerCase();

  if (category.includes('barn')) {
    features.push('Premium sliding track hardware');
    features.push('Easy installation with included mounting kit');
    features.push('Smooth gliding operation');
  }

  if (category.includes('glass') || category.includes('lite')) {
    features.push('Tempered glass for safety');
    features.push('Enhanced light transmission');
    features.push('Privacy with style');
  }

  features.push('Professional installation available');
  features.push('Manufacturer warranty included');
  features.push('Ottawa local delivery');

  return features;
}

/**
 * Determine which collections a product belongs to
 */
function determineCollections(product: LegacyReninProduct): string[] {
  const collections: string[] = [];

  // Featured products
  if (product.price > 600) {
    collections.push('coll_premium');
  }

  // Best sellers (barn doors are popular)
  if (product.category.toLowerCase().includes('barn')) {
    collections.push('coll_bestsellers');
  }

  // New arrivals (placeholder logic)
  collections.push('coll_new');

  return collections;
}

/**
 * Extract searchable tags
 */
function extractTags(product: LegacyReninProduct): string[] {
  const tags: string[] = [];

  // Category tags
  tags.push(product.category.toLowerCase());

  // Style tags from name
  const nameLower = product.name.toLowerCase();
  if (nameLower.includes('euro')) tags.push('european', 'modern');
  if (nameLower.includes('heritage')) tags.push('rustic', 'traditional');
  if (nameLower.includes('continental')) tags.push('contemporary', 'modern');
  if (nameLower.includes('provincial')) tags.push('classic', 'traditional');

  // Material tags
  if (nameLower.includes('glass') || nameLower.includes('lite')) {
    tags.push('glass', 'transparent');
  }
  if (nameLower.includes('mirror')) {
    tags.push('mirror', 'reflective');
  }

  // Feature tags
  if (product.features) {
    product.features.forEach(feature => {
      const featureLower = feature.toLowerCase();
      if (featureLower.includes('glass')) tags.push('glass');
      if (featureLower.includes('hardware')) tags.push('hardware-included');
    });
  }

  // Location tags
  tags.push('ottawa', 'canada', 'renin');

  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Generate short description for cards
 */
function generateShortDescription(product: LegacyReninProduct): string {
  if (product.description && product.description.length < 150) {
    return product.description;
  }

  const category = product.category.toLowerCase();
  const templates: Record<string, string> = {
    'barn': 'Premium barn door system with smooth sliding hardware and professional installation available.',
    'bypass': 'Space-saving bypass door system with smooth operation and easy installation.',
    'bifold': 'Compact bifold door solution perfect for closets and small spaces.',
    'pivot': 'Elegant pivot door system with smooth operation and premium finish.',
    'sliding': 'Premium sliding door with smooth gliding track and quality construction.',
    'hardware': 'Quality door hardware for reliable installation and long-lasting performance.',
    'mirror': 'High-quality mirror for closet doors or wall mounting.',
  };

  for (const [key, template] of Object.entries(templates)) {
    if (category.includes(key)) {
      return template;
    }
  }

  return 'Premium Renin door product with professional installation available in Ottawa.';
}

/**
 * Generate full description with local SEO
 */
function generateDescription(
  product: LegacyReninProduct,
  category: typeof RENIN_CATEGORY_TAXONOMY[string]
): string {
  const parts: string[] = [];

  // Product intro
  parts.push(`The ${product.name} is a premium ${category.name.toLowerCase()} from Renin, designed for both style and durability.`);

  // Features
  if (product.features && product.features.length > 0) {
    parts.push(`Key features include ${product.features.join(', ').toLowerCase()}.`);
  }

  // Installation
  if (product.installationTime) {
    parts.push(`Professional installation takes approximately ${product.installationTime}.`);
  }

  // Local service
  parts.push(`Available for delivery and installation in Ottawa, Kanata, Orleans, and surrounding areas.`);

  // Warranty
  parts.push(`Includes manufacturer warranty and professional installation services.`);

  return parts.join(' ');
}

/**
 * Generate SEO description
 */
function generateSEODescription(
  product: LegacyReninProduct,
  category: typeof RENIN_CATEGORY_TAXONOMY[string]
): string {
  return `${product.name} - Premium ${category.name.toLowerCase()} with professional installation in Ottawa. Authorized Renin dealer with warranty support. Free consultation and measurement.`;
}

/**
 * Generate SEO keywords
 */
function generateSEOKeywords(
  product: LegacyReninProduct,
  category: typeof RENIN_CATEGORY_TAXONOMY[string]
): string[] {
  const keywords: string[] = [
    product.name.toLowerCase(),
    category.name.toLowerCase(),
    'renin',
    'renin doors',
    'ottawa',
    'door installation ottawa',
    'closet doors ottawa',
  ];

  // Add category-specific keywords
  const categoryLower = product.category.toLowerCase();
  if (categoryLower.includes('barn')) {
    keywords.push('barn door', 'sliding barn door', 'barn door hardware');
  }

  return keywords;
}

/**
 * Determine if product should be featured
 */
function isFeaturedProduct(product: LegacyReninProduct): boolean {
  // Feature expensive products
  if (product.price > 600) return true;

  // Feature products with HD images
  if (product.arcatImages?.some(url => url.includes('_hd.'))) return true;

  // Feature barn doors (popular category)
  if (product.category.toLowerCase().includes('barn')) return true;

  return false;
}

/**
 * Build category hierarchy
 */
export function buildCategoryHierarchy(): ProductCategory[] {
  const categories: ProductCategory[] = [];

  Object.values(RENIN_CATEGORY_TAXONOMY).forEach(cat => {
    const category: ProductCategory = {
      id: cat.id,
      handle: cat.handle,
      name: cat.name,
      description: cat.description,
      parentId: cat.parentId,
      level: cat.level,
      path: buildCategoryPath(cat.id),
      productCount: 0, // Will be calculated
      displayOrder: cat.displayOrder,
      seo: {
        title: `${cat.name} - Premium Renin Products | Ottawa Installation`,
        description: cat.description,
        keywords: [cat.name.toLowerCase(), 'renin', 'ottawa', 'door installation'],
      },
      active: true,
    };

    categories.push(category);
  });

  return categories;
}

/**
 * Build category path (array of ancestor IDs)
 */
function buildCategoryPath(categoryId: string): string[] {
  const path: string[] = [categoryId];
  let current = RENIN_CATEGORY_TAXONOMY[categoryId];

  while (current.parentId) {
    path.unshift(current.parentId);
    current = RENIN_CATEGORY_TAXONOMY[current.parentId];
  }

  return path;
}

/**
 * Create default collections
 */
export function createDefaultCollections(): ProductCollection[] {
  return [
    {
      id: 'coll_new',
      handle: 'new-arrivals',
      title: 'New Arrivals',
      description: 'Recently added products',
      productIds: [],
      displayOrder: 1,
      active: true,
    },
    {
      id: 'coll_bestsellers',
      handle: 'bestsellers',
      title: 'Best Sellers',
      description: 'Our most popular products',
      productIds: [],
      displayOrder: 2,
      active: true,
    },
    {
      id: 'coll_premium',
      handle: 'premium',
      title: 'Premium Collection',
      description: 'High-end premium products',
      productIds: [],
      displayOrder: 3,
      active: true,
    },
    {
      id: 'coll_featured',
      handle: 'featured',
      title: 'Featured Products',
      description: 'Hand-picked featured products',
      productIds: [],
      displayOrder: 4,
      active: true,
    },
  ];
}

/**
 * SKU configuration for Renin products
 */
export const RENIN_SKU_CONFIG: SKUConfig = {
  prefix: 'REN',
  separator: '-',
  includeCategory: true,
  includeYear: false,
  sequenceLength: 4,
};
