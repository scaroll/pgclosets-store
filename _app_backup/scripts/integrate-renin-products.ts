// @ts-nocheck - Script with potentially undefined values
/**
 * Integrate Transformed Renin Products into PG Closets
 *
 * This script:
 * 1. Reads the transformed Renin products
 * 2. Merges them with existing product data
 * 3. Updates relevant data files
 * 4. Creates backup of original data
 *
 * Run: npx tsx scripts/integrate-renin-products.ts
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Product } from '../types/commerce';

interface TransformedData {
  metadata: {
    totalProducts: number;
    categories: string[];
    transformedAt: string;
    source: string;
    version: string;
  };
  statistics: {
    totalProcessed: number;
    successful: number;
    failed: number;
    errors: any[];
  };
  products: Product[];
}

interface IntegrationResult {
  success: boolean;
  productsAdded: number;
  productsUpdated: number;
  totalProducts: number;
  backupCreated: string;
  errors: string[];
}

/**
 * Create backup of existing data file
 */
function createBackup(filePath: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = filePath.replace('.json', `.backup-${timestamp}.json`);

  if (existsSync(filePath)) {
    copyFileSync(filePath, backupPath);
    console.log(`✓ Backup created: ${backupPath}`);
  }

  return backupPath;
}

/**
 * Load existing product database
 */
function loadExistingProducts(filePath: string): { products: Product[] } {
  if (!existsSync(filePath)) {
    console.log('⚠️  No existing products database found, will create new one');
    return { products: [] };
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return data;
  } catch (error) {
    console.error('Error reading existing products:', error);
    return { products: [] };
  }
}

/**
 * Merge Renin products with existing products
 * - Adds new Renin products
 * - Updates existing Renin products (by SKU match)
 * - Preserves non-Renin products
 */
function mergeProducts(
  existing: Product[],
  reninProducts: Product[]
): { merged: Product[]; added: number; updated: number } {
  const mergedMap = new Map<string, Product>();
  let added = 0;
  let updated = 0;

  // Add all existing products
  existing.forEach(product => {
    mergedMap.set(product.id, product);
  });

  // Add or update Renin products
  reninProducts.forEach(reninProduct => {
    const existingProduct = mergedMap.get(reninProduct.id);

    if (existingProduct) {
      // Update existing Renin product
      mergedMap.set(reninProduct.id, {
        ...reninProduct,
        created_at: existingProduct.created_at, // Preserve original creation date
        updated_at: new Date().toISOString()
      });
      updated++;
      console.log(`  ↻ Updated: ${reninProduct.title}`);
    } else {
      // Add new Renin product
      mergedMap.set(reninProduct.id, reninProduct);
      added++;
      console.log(`  + Added: ${reninProduct.title}`);
    }
  });

  return {
    merged: Array.from(mergedMap.values()),
    added,
    updated
  };
}

/**
 * Update the main products database file
 */
function updateProductDatabase(
  filePath: string,
  products: Product[],
  metadata: any
): void {
  const output = {
    metadata: {
      ...metadata,
      totalProducts: products.length,
      lastUpdated: new Date().toISOString(),
      reninProductsCount: products.filter(p => p.metadata?.source === 'renin').length
    },
    products
  };

  writeFileSync(filePath, JSON.stringify(output, null, 2));
  console.log(`✓ Updated: ${filePath}`);
}

/**
 * Update TypeScript data file (data/renin-products.ts)
 */
function updateTypeScriptDataFile(products: Product[]): void {
  const reninProducts = products.filter(p => p.metadata?.source === 'renin');

  const tsContent = `/**
 * Renin Products - Auto-generated from extracted data
 * Last updated: ${new Date().toISOString()}
 * Total products: ${reninProducts.length}
 */

import type { Product } from '../types/commerce';

export const reninProducts: Product[] = ${JSON.stringify(reninProducts, null, 2)};

export const reninProductsByCategory = {
  'barn-doors': reninProducts.filter(p => p.collection?.id === 'renin-barn-doors'),
  'bifold-doors': reninProducts.filter(p => p.collection?.id === 'renin-bifold-doors'),
  'bypass-doors': reninProducts.filter(p => p.collection?.id === 'renin-bypass-doors'),
  'closet-doors': reninProducts.filter(p => p.collection?.id === 'renin-closet-doors')
};

export const reninCollections = [
  { id: 'renin-barn-doors', title: 'Renin Barn Doors', handle: 'renin-barn-doors', count: reninProductsByCategory['barn-doors'].length },
  { id: 'renin-bifold-doors', title: 'Renin Bifold Doors', handle: 'renin-bifold-doors', count: reninProductsByCategory['bifold-doors'].length },
  { id: 'renin-bypass-doors', title: 'Renin Bypass Doors', handle: 'renin-bypass-doors', count: reninProductsByCategory['bypass-doors'].length },
  { id: 'renin-closet-doors', title: 'Renin Closet Doors', handle: 'renin-closet-doors', count: reninProductsByCategory['closet-doors'].length }
];
`;

  const outputPath = '/Users/spencercarroll/pgclosets-store-main/data/renin-products-integrated.ts';
  writeFileSync(outputPath, tsContent);
  console.log(`✓ Created: ${outputPath}`);
}

/**
 * Generate integration report
 */
function generateReport(result: IntegrationResult): void {
  const reportContent = `# Renin Products Integration Report

**Date**: ${new Date().toISOString()}
**Status**: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}

## Summary

- **Products Added**: ${result.productsAdded}
- **Products Updated**: ${result.productsUpdated}
- **Total Products**: ${result.totalProducts}
- **Backup Created**: ${result.backupCreated}

## Next Steps

### 1. Media CDN Integration
Upload 307MB of Renin media assets to Vercel Blob Storage:
\`\`\`bash
npx tsx scripts/upload-renin-media.ts
\`\`\`

### 2. Update Product Pages
Review and update product listing/detail pages to use new Renin data:
- Check \`app/products/[handle]/page.tsx\`
- Update product galleries to use new image arrays
- Add PDF download links
- Embed product videos where available

### 3. Test Product Display
- Verify all 69 Renin products display correctly
- Check variant pricing and sizes
- Test product filtering by collection
- Validate image loading and optimization

### 4. SEO Optimization
- Generate product sitemaps
- Add structured data (schema.org)
- Optimize meta tags and descriptions
- Create category pages for collections

## Product Distribution

- **Renin Barn Doors**: Products with sliding barn door hardware
- **Renin Bifold Doors**: Space-saving bifold closet doors
- **Renin Bypass Doors**: Sliding bypass closet door systems
- **Renin Closet Doors**: Comprehensive closet door solutions

## Errors

${result.errors.length > 0 ? result.errors.map((e, i) => `${i + 1}. ${e}`).join('\n') : 'None'}

---

*Auto-generated by integrate-renin-products.ts*
`;

  const reportPath = '/Users/spencercarroll/pgclosets-store-main/RENIN_INTEGRATION_REPORT.md';
  writeFileSync(reportPath, reportContent);
  console.log(`✓ Report created: ${reportPath}`);
}

/**
 * Main integration function
 */
async function integrateReninProducts(): Promise<IntegrationResult> {
  console.log('🚀 Starting Renin Products Integration...\n');

  const result: IntegrationResult = {
    success: false,
    productsAdded: 0,
    productsUpdated: 0,
    totalProducts: 0,
    backupCreated: '',
    errors: []
  };

  try {
    // 1. Load transformed Renin products
    console.log('📂 Loading transformed Renin products...');
    const transformedPath = '/Users/spencercarroll/pgclosets-store-main/data/transformed-renin-products.json';
    const transformedData: TransformedData = JSON.parse(readFileSync(transformedPath, 'utf-8'));
    console.log(`  ✓ Loaded ${transformedData.products.length} Renin products\n`);

    // 2. Create backup of existing data
    console.log('💾 Creating backup...');
    const databasePath = '/Users/spencercarroll/pgclosets-store-main/lib/renin-products-database.json';
    result.backupCreated = createBackup(databasePath);
    console.log();

    // 3. Load existing products
    console.log('📦 Loading existing products...');
    const existingData = loadExistingProducts(databasePath);
    console.log(`  ✓ Found ${existingData.products?.length || 0} existing products\n`);

    // 4. Merge products
    console.log('🔄 Merging products...');
    const { merged, added, updated } = mergeProducts(
      existingData.products || [],
      transformedData.products
    );
    result.productsAdded = added;
    result.productsUpdated = updated;
    result.totalProducts = merged.length;
    console.log();

    // 5. Update database
    console.log('💾 Updating product database...');
    updateProductDatabase(databasePath, merged, transformedData.metadata);
    console.log();

    // 6. Update TypeScript data file
    console.log('📝 Updating TypeScript data files...');
    updateTypeScriptDataFile(merged);
    console.log();

    // 7. Generate report
    console.log('📊 Generating integration report...');
    result.success = true;
    generateReport(result);
    console.log();

    // Print summary
    console.log('='.repeat(60));
    console.log('✅ INTEGRATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`Products Added: ${result.productsAdded}`);
    console.log(`Products Updated: ${result.productsUpdated}`);
    console.log(`Total Products: ${result.totalProducts}`);
    console.log(`Renin Products: ${transformedData.products.length}`);
    console.log();
    console.log('📝 Next Steps:');
    console.log('  1. Upload media assets: npx tsx scripts/upload-renin-media.ts');
    console.log('  2. Review integration report: RENIN_INTEGRATION_REPORT.md');
    console.log('  3. Test product pages and verify data display');
    console.log('  4. Implement SEO optimizations');
    console.log();

  } catch (error) {
    result.success = false;
    const errorMsg = error instanceof Error ? error.message : String(error);
    result.errors.push(errorMsg);
    console.error('❌ Integration failed:', error);
    throw error;
  }

  return result;
}

// Execute if run directly
if (require.main === module) {
  integrateReninProducts()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { integrateReninProducts };
