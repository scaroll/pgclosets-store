// @ts-nocheck - Script with potentially undefined values
/**
 * Transform Renin Extracted Products to PG Closets Schema - FINAL
 *
 * This script reads 70 extracted Renin products and transforms them
 * to match the existing Product schema used by PG Closets.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { Product, ProductImage, ProductVariant } from '../types/commerce';

interface ExtractedReninProduct {
  name: string;
  sku: string;
  price: string | number | { min: number; max: number };
  description: string;
  specifications: {
    sizes?: string[] | string;
    suitable_for_openings?: string;
    door_style?: string;
    door_styles?: string[];
    materials?: string | string[];
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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parsePriceString(priceStr: string | number | { min: number; max: number }): { min: number; max: number } {
  // Handle price object
  if (typeof priceStr === 'object' && priceStr !== null && 'min' in priceStr) {
    return {
      min: Math.round(priceStr.min * 100),
      max: Math.round(priceStr.max * 100)
    };
  }

  // Handle numeric prices
  if (typeof priceStr === 'number') {
    const price = Math.round(priceStr * 100);
    return { min: price, max: price };
  }

  // Handle string prices
  const cleaned = (typeof priceStr === 'string') ? priceStr.replace(/[$,]/g, '').trim() : String(priceStr).replace(/[$,]/g, '').trim();

  if (cleaned.includes('–') || cleaned.includes('-')) {
    const [minStr, maxStr] = cleaned.split(/\s*[–-]\s*/);
    return {
      min: Math.round(parseFloat(minStr) * 100),
      max: Math.round(parseFloat(maxStr) * 100)
    };
  }

  const price = Math.round(parseFloat(cleaned) * 100);
  return { min: price, max: price };
}

function generateVariants(
  extracted: ExtractedReninProduct,
  productId: string
): ProductVariant[] {
  const { min, max } = parsePriceString(extracted.price);

  let sizes: string[] = ['Standard'];
  if (extracted.specifications.sizes) {
    if (Array.isArray(extracted.specifications.sizes)) {
      sizes = extracted.specifications.sizes;
    } else if (typeof extracted.specifications.sizes === 'string') {
      sizes = [extracted.specifications.sizes];
    }
  }

  if (sizes.length === 1 || min === max) {
    return [{
      id: `${productId}-variant-1`,
      title: sizes[0],
      sku: extracted.sku,
      price: min,
      inventory_quantity: 100
    }];
  }

  const priceStep = (max - min) / (sizes.length - 1);

  return sizes.map((size, index) => ({
    id: `${productId}-variant-${index + 1}`,
    title: size,
    sku: `${extracted.sku}-${index + 1}`,
    price: Math.round(min + (priceStep * index)),
    inventory_quantity: 100
  }));
}

function transformImages(imageUrls: string[]): ProductImage[] {
  return imageUrls.map((url, index) => ({
    url,
    altText: `Product image ${index + 1}`
  }));
}

function extractTags(extracted: ExtractedReninProduct, category: string): string[] {
  const tags = new Set<string>();

  tags.add(category);

  if (extracted.specifications.material) {
    tags.add(extracted.specifications.material.toLowerCase());
  }
  if (extracted.specifications.materials) {
    if (Array.isArray(extracted.specifications.materials)) {
      extracted.specifications.materials.forEach(m => tags.add(m.toLowerCase()));
    } else if (typeof extracted.specifications.materials === 'string') {
      tags.add(extracted.specifications.materials.toLowerCase());
    }
  }

  if (extracted.specifications.door_style) {
    tags.add(extracted.specifications.door_style.toLowerCase());
  }
  if (extracted.specifications.door_styles && Array.isArray(extracted.specifications.door_styles)) {
    extracted.specifications.door_styles.forEach(style => tags.add(style.toLowerCase()));
  }

  const nameWords = extracted.name.toLowerCase();
  if (nameWords.includes('invisiglide')) tags.add('invisiglide');
  if (nameWords.includes('extra tall')) tags.add('extra-tall');
  if (nameWords.includes('easy-build')) tags.add('easy-build');
  if (nameWords.includes('complete kit')) tags.add('complete-kit');
  if (nameWords.includes('mirror')) tags.add('mirror');
  if (nameWords.includes('glass')) tags.add('glass');
  if (nameWords.includes('bifold')) tags.add('bifold');
  if (nameWords.includes('bypass')) tags.add('bypass');
  if (nameWords.includes('pivot')) tags.add('pivot');

  if (extracted.specifications.color) {
    tags.add(extracted.specifications.color.toLowerCase());
  }

  if (extracted.specifications.finishes) {
    extracted.specifications.finishes.forEach(finish => {
      tags.add(finish.toLowerCase());
    });
  }

  if (extracted.specifications.hardware) {
    if (extracted.specifications.hardware.toLowerCase().includes('soft close')) {
      tags.add('soft-close');
    }
  }

  return Array.from(tags);
}

function getCollection(category: string): { id: string; title: string; handle: string } {
  const collections: Record<string, { id: string; title: string; handle: string }> = {
    'barn-doors': { id: 'renin-barn-doors', title: 'Renin Barn Doors', handle: 'renin-barn-doors' },
    'bifold-doors': { id: 'renin-bifold-doors', title: 'Renin Bifold Doors', handle: 'renin-bifold-doors' },
    'bypass-doors': { id: 'renin-bypass-doors', title: 'Renin Bypass Doors', handle: 'renin-bypass-doors' },
    'closet-doors': { id: 'renin-closet-doors', title: 'Renin Closet Doors', handle: 'renin-closet-doors' }
  };

  return collections[category] || { id: 'renin-products', title: 'Renin Products', handle: 'renin-products' };
}

function transformProduct(extracted: ExtractedReninProduct, category: string, filename: string): Product {
  const slug = generateSlug(extracted.name);
  const productId = `renin-${extracted.sku.toLowerCase().replace(/\//g, '-')}`;
  const now = new Date().toISOString();

  return {
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
}

function processCategory(categoryPath: string, category: string, stats: TransformationStats): Product[] {
  const products: Product[] = [];
  const files = readdirSync(categoryPath);

  for (const file of files) {
    if (!file.endsWith('.json') || file === 'SUMMARY.json') continue;

    try {
      const filePath = join(categoryPath, file);
      const content = readFileSync(filePath, 'utf-8');
      const extracted: ExtractedReninProduct = JSON.parse(content);

      const transformed = transformProduct(extracted, category, file);
      products.push(transformed);

      stats.successful++;
      console.log(`✓ ${extracted.name}`);
    } catch (error) {
      stats.failed++;
      stats.errors.push({
        file: `${category}/${file}`,
        error: error instanceof Error ? error.message : String(error)
      });
      console.error(`✗ ${file}: ${error}`);
    }

    stats.totalProcessed++;
  }

  return products;
}

async function transformAllProducts() {
  console.log('🚀 Renin Product Transformation - FINAL\n');

  const extractionBasePath = '/Users/spencercarroll/renin-extraction-kit/extracted-data';
  const outputPath = '/Users/spencercarroll/pgclosets-store-main/data/transformed-renin-products.json';

  const stats: TransformationStats = { totalProcessed: 0, successful: 0, failed: 0, errors: [] };
  const allProducts: Product[] = [];

  const categories = ['barn-doors', 'bifold-doors', 'bypass-doors', 'closet-doors'];

  for (const category of categories) {
    console.log(`\n📁 ${category}...`);
    const categoryPath = join(extractionBasePath, category);
    const products = processCategory(categoryPath, category, stats);
    allProducts.push(...products);
  }

  const output = {
    metadata: {
      totalProducts: allProducts.length,
      categories,
      transformedAt: new Date().toISOString(),
      source: 'renin-extraction-kit',
      version: '2.0.0-final'
    },
    statistics: stats,
    products: allProducts
  };

  writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('📊 TRANSFORMATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Processed: ${stats.totalProcessed} | Success: ${stats.successful} | Failed: ${stats.failed}`);
  console.log(`Total Products: ${allProducts.length}`);
  console.log(`Output: ${outputPath}`);

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
    console.log('\n⚠️  Errors:', stats.errors.length);
  }

  console.log('\n✅ Complete!\n');
  return output;
}

if (require.main === module) {
  transformAllProducts()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { transformAllProducts, transformProduct };
