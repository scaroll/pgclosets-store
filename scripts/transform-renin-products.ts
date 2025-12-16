// @ts-nocheck - Script with potentially undefined values
/**
 * Transform Renin Extracted Products to PG Closets Schema
 *
 * This script reads 70 extracted Renin products and transforms them
 * to match the existing Product schema used by PG Closets.
 *
 * Input: /Users/spencercarroll/renin-extraction-kit/extracted-data/
 * Output: /Users/spencercarroll/pgclosets-store-main/data/transformed-renin-products.json
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { Product, ProductImage, ProductVariant } from '../types/commerce';

interface ExtractedReninProduct {
  name: string;
  sku: string;
  price: string; // e.g., "$565.00 – $799.00" or "$565.00"
  description: string;
  specifications: {
    sizes?: string[];
    suitable_for_openings?: string;
    door_style?: string;
    materials?: string;
    finishes?: string[];
    hardware?: string;
    color?: string;
    material?: string;
    [key: string]: any;
  };
  images: string[];
  pdfs: string[];
  videos: string[];
}

interface TransformationStats {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors: Array<{ file: string; error: string }>;
}

/**
 * Generate a URL-friendly slug from product name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Parse price string and return prices in cents
 * Handles ranges like "$565.00 – $799.00" and single prices like "$565.00"
 */
function parsePriceString(priceStr: string): { min: number; max: number } {
  // Remove currency symbols and clean up
  const cleaned = priceStr.replace(/[$,]/g, '').trim();

  // Check if it's a range
  if (cleaned.includes('–') || cleaned.includes('-')) {
    const [minStr, maxStr] = cleaned.split(/\s*[–-]\s*/);
    return {
      min: Math.round(parseFloat(minStr) * 100),
      max: Math.round(parseFloat(maxStr) * 100)
    };
  }

  // Single price
  const price = Math.round(parseFloat(cleaned) * 100);
  return { min: price, max: price };
}

/**
 * Generate variants based on sizes and price ranges
 */
function generateVariants(
  extracted: ExtractedReninProduct,
  productId: string
): ProductVariant[] {
  const { min, max } = parsePriceString(extracted.price);
  const sizes = extracted.specifications.sizes || ['Standard'];

  // If only one size or same min/max, create single variant
  if (sizes.length === 1 || min === max) {
    return [{
      id: `${productId}-variant-1`,
      title: sizes[0],
      sku: extracted.sku,
      price: min,
      inventory_quantity: 100
    }];
  }

  // Multiple sizes with price range - distribute prices
  const priceStep = (max - min) / (sizes.length - 1);

  return sizes.map((size, index) => ({
    id: `${productId}-variant-${index + 1}`,
    title: size,
    sku: `${extracted.sku}-${index + 1}`,
    price: Math.round(min + (priceStep * index)),
    inventory_quantity: 100
  }));
}

/**
 * Transform image URLs to ProductImage objects
 */
function transformImages(imageUrls: string[]): ProductImage[] {
  return imageUrls.map((url, index) => ({
    url,
    altText: `Product image ${index + 1}`
  }));
}

/**
 * Extract tags from product data
 */
function extractTags(extracted: ExtractedReninProduct, category: string): string[] {
  const tags = new Set<string>();

  // Add category tag
  tags.add(category);

  // Add material tags
  if (extracted.specifications.material) {
    tags.add(extracted.specifications.material.toLowerCase());
  }
  if (extracted.specifications.materials) {
    tags.add(extracted.specifications.materials.toLowerCase());
  }

  // Add style tags
  if (extracted.specifications.door_style) {
    tags.add(extracted.specifications.door_style.toLowerCase());
  }

  // Add feature tags from product name
  const nameWords = extracted.name.toLowerCase();
  if (nameWords.includes('invisiglide')) tags.add('invisiglide');
  if (nameWords.includes('extra tall')) tags.add('extra-tall');
  if (nameWords.includes('easy-build')) tags.add('easy-build');
  if (nameWords.includes('complete kit')) tags.add('complete-kit');
  if (nameWords.includes('mirror')) tags.add('mirror');
  if (nameWords.includes('glass')) tags.add('glass');

  // Add color tags
  if (extracted.specifications.color) {
    tags.add(extracted.specifications.color.toLowerCase());
  }

  // Add finishes as tags
  if (extracted.specifications.finishes) {
    extracted.specifications.finishes.forEach(finish => {
      tags.add(finish.toLowerCase());
    });
  }

  // Add hardware tags
  if (extracted.specifications.hardware) {
    if (extracted.specifications.hardware.toLowerCase().includes('soft close')) {
      tags.add('soft-close');
    }
  }

  return Array.from(tags);
}

/**
 * Determine collection based on category
 */
function getCollection(category: string): { id: string; title: string; handle: string } {
  const collections: Record<string, { id: string; title: string; handle: string }> = {
    'barn-doors': {
      id: 'renin-barn-doors',
      title: 'Renin Barn Doors',
      handle: 'renin-barn-doors'
    },
    'bifold-doors': {
      id: 'renin-bifold-doors',
      title: 'Renin Bifold Doors',
      handle: 'renin-bifold-doors'
    },
    'bypass-doors': {
      id: 'renin-bypass-doors',
      title: 'Renin Bypass Doors',
      handle: 'renin-bypass-doors'
    },
    'closet-doors': {
      id: 'renin-closet-doors',
      title: 'Renin Closet Doors',
      handle: 'renin-closet-doors'
    }
  };

  return collections[category] || {
    id: 'renin-products',
    title: 'Renin Products',
    handle: 'renin-products'
  };
}

/**
 * Transform a single extracted product to the target schema
 */
function transformProduct(
  extracted: ExtractedReninProduct,
  category: string,
  filename: string
): Product {
  const slug = generateSlug(extracted.name);
  const productId = `renin-${extracted.sku.toLowerCase()}`;
  const now = new Date().toISOString();

  const product: Product = {
    id: productId,
    title: extracted.name,
    handle: slug,
    description: extracted.description,
    thumbnail: extracted.images[0] || '',
    images: transformImages(extracted.images),
    variants: generateVariants(extracted, productId),
    tags: extractTags(extracted, category),
    collection: getCollection(category),
    metadata: {
      source: 'renin',
      sku: extracted.sku,
      specifications: extracted.specifications,
      pdfs: extracted.pdfs,
      videos: extracted.videos,
      extractedFrom: filename,
      lastSync: now
    },
    created_at: now,
    updated_at: now
  };

  return product;
}

/**
 * Process all products from a category directory
 */
function processCategory(
  categoryPath: string,
  category: string,
  stats: TransformationStats
): Product[] {
  const products: Product[] = [];
  const files = readdirSync(categoryPath);

  for (const file of files) {
    // Skip non-JSON files
    if (!file.endsWith('.json') || file === 'SUMMARY.json') {
      continue;
    }

    try {
      const filePath = join(categoryPath, file);
      const content = readFileSync(filePath, 'utf-8');
      const extracted: ExtractedReninProduct = JSON.parse(content);

      const transformed = transformProduct(extracted, category, file);
      products.push(transformed);

      stats.successful++;
      console.log(`✓ Transformed: ${extracted.name} (${category})`);
    } catch (error) {
      stats.failed++;
      stats.errors.push({
        file: `${category}/${file}`,
        error: error instanceof Error ? error.message : String(error)
      });
      console.error(`✗ Failed: ${file} - ${error}`);
    }

    stats.totalProcessed++;
  }

  return products;
}

/**
 * Main transformation function
 */
async function transformAllProducts() {
  console.log('🚀 Starting Renin Product Transformation...\n');

  const extractionBasePath = '/Users/spencercarroll/renin-extraction-kit/extracted-data';
  const outputPath = '/Users/spencercarroll/pgclosets-store-main/data/transformed-renin-products.json';

  const stats: TransformationStats = {
    totalProcessed: 0,
    successful: 0,
    failed: 0,
    errors: []
  };

  const allProducts: Product[] = [];

  // Process each category
  const categories = [
    'barn-doors',
    'bifold-doors',
    'bypass-doors',
    'closet-doors'
  ];

  for (const category of categories) {
    console.log(`\n📁 Processing ${category}...`);
    const categoryPath = join(extractionBasePath, category);
    const products = processCategory(categoryPath, category, stats);
    allProducts.push(...products);
  }

  // Write output
  const output = {
    metadata: {
      totalProducts: allProducts.length,
      categories: categories,
      transformedAt: new Date().toISOString(),
      source: 'renin-extraction-kit',
      version: '1.0.0'
    },
    statistics: stats,
    products: allProducts
  };

  writeFileSync(outputPath, JSON.stringify(output, null, 2));

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TRANSFORMATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Products Processed: ${stats.totalProcessed}`);
  console.log(`✓ Successful: ${stats.successful}`);
  console.log(`✗ Failed: ${stats.failed}`);
  console.log(`📦 Total Products: ${allProducts.length}`);
  console.log(`📝 Output: ${outputPath}`);

  // Group by collection
  const byCollection = allProducts.reduce((acc, p) => {
    const collection = p.collection?.title || 'Unknown';
    acc[collection] = (acc[collection] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📚 Products by Collection:');
  Object.entries(byCollection).forEach(([collection, count]) => {
    console.log(`  - ${collection}: ${count}`);
  });

  if (stats.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    stats.errors.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
  }

  console.log('\n✅ Transformation complete!\n');

  return output;
}

// Execute if run directly
if (require.main === module) {
  transformAllProducts()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { transformAllProducts, transformProduct };
