#!/usr/bin/env npx tsx

/**
 * Sync Renin Products to Website
 *
 * This script updates all website data sources with the 69 integrated Renin products:
 * 1. app/products/products-data.ts - Core product data for sitemap and commerce
 * 2. data/simple-products.json - Simple product display format
 *
 * Run: npx tsx scripts/sync-renin-to-website.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Import transformed Renin products
const transformedData = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), 'data/transformed-renin-products.json'),
    'utf-8'
  )
);

interface ReninProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail?: string;
  images: Array<{ url: string; altText: string }>;
  variants: Array<{
    id: string;
    title: string;
    sku: string;
    price: number;
    inventory_quantity: number;
  }>;
  tags: string[];
  collection?: {
    id: string;
    title: string;
    handle: string;
  };
  metadata?: {
    source: string;
    sku: string;
    specifications: any;
    pdfs?: string[];
    videos?: string[];
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Bypass Doors' | 'Bifold Doors' | 'Pivot Doors' | 'Barn Doors' | 'Hardware' | 'Mirrors';
  image: string;
  specs: { label: string; value: string }[];
}

interface SimpleProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const reninProducts: ReninProduct[] = transformedData.products;

console.log('\n🔄 Starting Renin Products Website Sync...\n');
console.log(`📦 Found ${reninProducts.length} Renin products to sync\n`);

// ============================================================================
// 1. Update products-data.ts
// ============================================================================

function categoryMapper(collection?: { title: string }): Product['category'] {
  if (!collection) return 'Barn Doors';

  const title = collection.title.toLowerCase();
  if (title.includes('barn')) return 'Barn Doors';
  if (title.includes('bifold')) return 'Bifold Doors';
  if (title.includes('bypass')) return 'Bypass Doors';
  if (title.includes('pivot')) return 'Pivot Doors';
  if (title.includes('hardware')) return 'Hardware';
  if (title.includes('mirror')) return 'Mirrors';

  return 'Barn Doors'; // Default
}

function generateSpecs(product: ReninProduct): { label: string; value: string }[] {
  const specs: { label: string; value: string }[] = [];

  if (product.metadata?.specifications) {
    const s = product.metadata.specifications;

    if (s.sizes && Array.isArray(s.sizes)) {
      specs.push({ label: 'Sizes Available', value: s.sizes.join(', ') });
    }

    if (s.suitable_for_openings) {
      specs.push({ label: 'Suitable for Openings', value: s.suitable_for_openings });
    }

    if (s.color) {
      specs.push({ label: 'Color', value: s.color });
    }

    if (s.material) {
      specs.push({ label: 'Material', value: s.material });
    }

    if (s.materials && Array.isArray(s.materials)) {
      specs.push({ label: 'Materials', value: s.materials.join(', ') });
    }

    if (s.finishes && Array.isArray(s.finishes)) {
      specs.push({ label: 'Finishes', value: s.finishes.join(', ') });
    }

    if (s.hardware_finish) {
      specs.push({ label: 'Hardware Finish', value: s.hardware_finish });
    }

    if (s.thickness) {
      specs.push({ label: 'Thickness', value: s.thickness });
    }

    if (s.glass_type) {
      specs.push({ label: 'Glass Type', value: s.glass_type });
    }
  }

  // Add SKU
  if (product.metadata?.sku) {
    specs.push({ label: 'SKU', value: product.metadata.sku });
  }

  // Add variant info if multiple sizes
  if (product.variants.length > 1) {
    const sizeOptions = product.variants.map(v => v.title).join(', ');
    specs.push({ label: 'Size Options', value: sizeOptions });
  }

  return specs;
}

const transformedProducts: Product[] = reninProducts.map((product, index) => ({
  id: (index + 1).toString(), // Sequential IDs for products-data.ts
  name: product.title,
  description: product.description || 'Premium Renin product for your home.',
  price: product.variants[0]?.price ? product.variants[0].price / 100 : 0, // Convert from cents to dollars
  category: categoryMapper(product.collection),
  image: product.thumbnail || product.images[0]?.url || '',
  specs: generateSpecs(product),
}));

// Generate products-data.ts content
const productsDataContent = `export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Bypass Doors' | 'Bifold Doors' | 'Pivot Doors' | 'Barn Doors' | 'Hardware' | 'Mirrors';
  image: string;
  specs: { label: string; value: string }[];
}

export const products: Product[] = ${JSON.stringify(transformedProducts, null, 2)};
`;

const productsDataPath = path.join(process.cwd(), 'app/products/products-data.ts');

// Backup existing file
const backupPath = productsDataPath.replace('.ts', `.backup-${new Date().toISOString()}.ts`);
if (fs.existsSync(productsDataPath)) {
  fs.copyFileSync(productsDataPath, backupPath);
  console.log(`📋 Backed up products-data.ts → ${path.basename(backupPath)}`);
}

fs.writeFileSync(productsDataPath, productsDataContent, 'utf-8');
console.log(`✅ Updated app/products/products-data.ts with ${transformedProducts.length} products`);

// ============================================================================
// 2. Update simple-products.json
// ============================================================================

const simpleProducts: SimpleProduct[] = reninProducts.map(product => ({
  id: product.id,
  slug: product.handle,
  title: product.title,
  description: product.description || 'Premium Renin product for your home.',
  price: product.variants[0]?.price || 0, // Already in cents
  image: product.thumbnail || product.images[0]?.url || '',
  category: product.collection?.title || 'Doors',
}));

const simpleProductsPath = path.join(process.cwd(), 'data/simple-products.json');

// Backup existing file
const simpleBackupPath = simpleProductsPath.replace('.json', `.backup-${new Date().toISOString()}.json`);
if (fs.existsSync(simpleProductsPath)) {
  fs.copyFileSync(simpleProductsPath, simpleBackupPath);
  console.log(`📋 Backed up simple-products.json → ${path.basename(simpleBackupPath)}`);
}

fs.writeFileSync(simpleProductsPath, JSON.stringify(simpleProducts, null, 2), 'utf-8');
console.log(`✅ Updated data/simple-products.json with ${simpleProducts.length} products`);

// ============================================================================
// Summary Report
// ============================================================================

console.log('\n📊 Sync Summary:\n');

// Category breakdown
const categoryBreakdown = transformedProducts.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('Category Distribution:');
Object.entries(categoryBreakdown)
  .sort(([, a], [, b]) => b - a)
  .forEach(([category, count]) => {
    console.log(`  ${category}: ${count} products`);
  });

// Price range
const prices = transformedProducts.map(p => p.price).filter(p => p > 0);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);

console.log(`\nPrice Range: $${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`);

// Media stats
const totalImages = reninProducts.reduce((sum, p) => sum + p.images.length, 0);
const productsWithPdfs = reninProducts.filter(p => p.metadata?.pdfs && p.metadata.pdfs.length > 0).length;
const productsWithVideos = reninProducts.filter(p => p.metadata?.videos && p.metadata.videos.length > 0).length;

console.log(`\nMedia Assets:`);
console.log(`  Images: ${totalImages}`);
console.log(`  Products with PDFs: ${productsWithPdfs}`);
console.log(`  Products with Videos: ${productsWithVideos}`);

console.log('\n✅ Sync Complete!\n');
console.log('Next Steps:');
console.log('  1. Run: npm run build');
console.log('  2. Test: npm run dev');
console.log('  3. Deploy: git add . && git commit && git push\n');
