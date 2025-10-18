/**
 * Migration Script: Transform Renin Data to Normalized Schema
 *
 * This script transforms the existing Renin product data from
 * enhanced-renin-database.json to the optimized normalized format.
 */

import reninDatabase from '../enhanced-renin-database.json';
import {
  transformReninProduct,
  buildCategoryHierarchy,
  createDefaultCollections,
  RENIN_SKU_CONFIG,
} from './transform-renin-data';
import {
  initializeProductStore,
  type NormalizedProduct,
  type ProductCategory,
  type ProductCollection,
  type NormalizedVariant,
  type MediaAsset,
} from './product-data';

/**
 * Migration statistics
 */
interface MigrationStats {
  products: {
    total: number;
    success: number;
    failed: number;
  };
  variants: {
    total: number;
  };
  media: {
    total: number;
  };
  categories: {
    total: number;
  };
  collections: {
    total: number;
  };
  startTime: number;
  endTime?: number;
  duration?: number;
  errors: Array<{ productId: string | number; error: string }>;
}

/**
 * Migrate all Renin data to normalized format
 */
export async function migrateReninData(): Promise<{
  products: NormalizedProduct[];
  categories: ProductCategory[];
  collections: ProductCollection[];
  variants: NormalizedVariant[];
  media: MediaAsset[];
  stats: MigrationStats;
}> {
  const stats: MigrationStats = {
    products: { total: 0, success: 0, failed: 0 },
    variants: { total: 0 },
    media: { total: 0 },
    categories: { total: 0 },
    collections: { total: 0 },
    startTime: Date.now(),
    errors: [],
  };

  console.log('🚀 Starting Renin data migration...');

  // Initialize collections
  const products: NormalizedProduct[] = [];
  const variants: NormalizedVariant[] = [];
  const media: MediaAsset[] = [];
  const mediaMap = new Map<string, MediaAsset>();

  // Build category hierarchy
  console.log('📁 Building category hierarchy...');
  const categories = buildCategoryHierarchy();
  stats.categories.total = categories.length;
  console.log(`✅ Created ${categories.length} categories`);

  // Create collections
  console.log('📦 Creating collections...');
  const collections = createDefaultCollections();
  stats.collections.total = collections.length;
  console.log(`✅ Created ${collections.length} collections`);

  // Transform products
  console.log('🔄 Transforming products...');
  stats.products.total = reninDatabase.products.length;

  for (let i = 0; i < reninDatabase.products.length; i++) {
    const legacyProduct = reninDatabase.products[i];

    try {
      const result = transformReninProduct(
        legacyProduct,
        i + 1, // Sequence number
        RENIN_SKU_CONFIG,
        mediaMap
      );

      products.push(result.product);
      variants.push(...result.variants);
      media.push(...result.media);

      stats.products.success++;
      stats.variants.total += result.variants.length;

      // Update collection membership
      result.product.collectionIds.forEach(collectionId => {
        const collection = collections.find(c => c.id === collectionId);
        if (collection && !collection.productIds.includes(result.product.id)) {
          collection.productIds.push(result.product.id);
        }
      });

      // Log progress every 10 products
      if ((i + 1) % 10 === 0) {
        console.log(`  Processed ${i + 1}/${stats.products.total} products...`);
      }
    } catch (error) {
      stats.products.failed++;
      stats.errors.push({
        productId: legacyProduct.id,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`❌ Failed to transform product ${legacyProduct.id}:`, error);
    }
  }

  // Update category product counts
  console.log('📊 Updating category product counts...');
  categories.forEach(category => {
    category.productCount = products.filter(
      p => p.categoryId === category.id || p.subcategoryId === category.id
    ).length;
  });

  stats.media.total = media.length;
  stats.endTime = Date.now();
  stats.duration = stats.endTime - stats.startTime;

  // Print summary
  console.log('\n✅ Migration complete!');
  console.log('━'.repeat(50));
  console.log(`Products: ${stats.products.success}/${stats.products.total} (${stats.products.failed} failed)`);
  console.log(`Variants: ${stats.variants.total}`);
  console.log(`Media: ${stats.media.total}`);
  console.log(`Categories: ${stats.categories.total}`);
  console.log(`Collections: ${stats.collections.total}`);
  console.log(`Duration: ${(stats.duration / 1000).toFixed(2)}s`);
  console.log('━'.repeat(50));

  if (stats.errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    stats.errors.forEach(err => {
      console.log(`  Product ${err.productId}: ${err.error}`);
    });
  }

  return {
    products,
    categories,
    collections,
    variants,
    media,
    stats,
  };
}

/**
 * Initialize product store with migrated data
 */
export async function initializeStore(): Promise<void> {
  console.log('🔧 Initializing product store...');

  const migrationResult = await migrateReninData();

  initializeProductStore({
    products: migrationResult.products,
    categories: migrationResult.categories,
    collections: migrationResult.collections,
    variants: migrationResult.variants,
    media: migrationResult.media,
  });

  console.log('✅ Product store initialized successfully!');
}

/**
 * Export migrated data to JSON files (for debugging/backup)
 */
export async function exportMigratedData(outputDir: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');

  console.log(`📤 Exporting migrated data to ${outputDir}...`);

  const migrationResult = await migrateReninData();

  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });

  // Export products
  await fs.writeFile(
    path.join(outputDir, 'products.json'),
    JSON.stringify(migrationResult.products, null, 2)
  );

  // Export categories
  await fs.writeFile(
    path.join(outputDir, 'categories.json'),
    JSON.stringify(migrationResult.categories, null, 2)
  );

  // Export collections
  await fs.writeFile(
    path.join(outputDir, 'collections.json'),
    JSON.stringify(migrationResult.collections, null, 2)
  );

  // Export variants
  await fs.writeFile(
    path.join(outputDir, 'variants.json'),
    JSON.stringify(migrationResult.variants, null, 2)
  );

  // Export media
  await fs.writeFile(
    path.join(outputDir, 'media.json'),
    JSON.stringify(migrationResult.media, null, 2)
  );

  // Export stats
  await fs.writeFile(
    path.join(outputDir, 'migration-stats.json'),
    JSON.stringify(migrationResult.stats, null, 2)
  );

  console.log('✅ Export complete!');
}

// Run migration if executed directly
if (require.main === module) {
  migrateReninData()
    .then(result => {
      console.log('\n🎉 Migration successful!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    });
}
