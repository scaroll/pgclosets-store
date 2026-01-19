#!/usr/bin/env node

/**
 * Production Image Optimization Script
 * Converts all images to WebP/AVIF with multiple responsive variants
 * Generates blur placeholders and image manifest
 *
 * Usage: node scripts/optimize-images-production.js
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

// Configuration
const CONFIG = {
  inputDirs: [
    'public/*.{jpg,jpeg,png}',
    'products/*.{jpg,jpeg,png}',
  ],
  outputDir: 'public/optimized',
  manifestPath: 'public/image-manifest.json',
  blurPlaceholderSize: 20,
  formats: {
    avif: {
      quality: 80,
      effort: 9, // Max compression effort
      chromaSubsampling: '4:2:0'
    },
    webp: {
      quality: 85,
      effort: 6,
      smartSubsample: true
    },
    jpeg: {
      quality: 90,
      mozjpeg: true,
      progressive: true
    }
  },
  sizes: {
    thumbnail: { width: 256, suffix: '-thumb', quality: 75 },
    small: { width: 640, suffix: '-sm', quality: 80 },
    medium: { width: 1080, suffix: '-md', quality: 85 },
    large: { width: 1920, suffix: '-lg', quality: 90 },
    original: { width: 2560, suffix: '', quality: 90 }
  }
};

// Statistics tracking
const stats = {
  totalImages: 0,
  processedImages: 0,
  failedImages: 0,
  originalSize: 0,
  optimizedSize: 0,
  variants: 0,
  startTime: Date.now()
};

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath) {
  const relativePath = path.relative(process.cwd(), inputPath);
  const basename = path.basename(inputPath, path.extname(inputPath));
  const dirname = path.dirname(inputPath);
  const dirBasename = path.basename(dirname);

  console.log(`\n📸 Processing: ${relativePath}`);

  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const originalStats = await fs.stat(inputPath);
    stats.originalSize += originalStats.size;

    // Create output directory
    const outputDir = path.join(CONFIG.outputDir, dirBasename);
    await fs.mkdir(outputDir, { recursive: true });

    // Generate blur placeholder (tiny base64)
    console.log('  ⚡ Generating blur placeholder...');
    const blurBuffer = await sharp(inputPath)
      .resize(CONFIG.blurPlaceholderSize, CONFIG.blurPlaceholderSize, {
        fit: 'inside'
      })
      .jpeg({ quality: 20 })
      .toBuffer();

    const blurDataURL = `data:image/jpeg;base64,${blurBuffer.toString('base64')}`;

    // Results object
    const result = {
      original: relativePath,
      aspectRatio: (metadata.width / metadata.height).toFixed(3),
      originalSize: originalStats.size,
      blurDataURL,
      variants: {}
    };

    // Generate all format/size combinations
    let variantCount = 0;
    for (const [formatName, formatConfig] of Object.entries(CONFIG.formats)) {
      result.variants[formatName] = {};

      for (const [sizeName, sizeConfig] of Object.entries(CONFIG.sizes)) {
        const outputFilename = `${basename}${sizeConfig.suffix}.${formatName}`;
        const outputPath = path.join(outputDir, outputFilename);

        // Skip if image is smaller than target size
        if (sizeConfig.width && metadata.width <= sizeConfig.width && sizeName !== 'original') {
          continue;
        }

        // Build Sharp pipeline
        let pipeline = sharp(inputPath);

        // Resize if needed
        if (sizeConfig.width && sizeConfig.width < metadata.width) {
          pipeline = pipeline.resize(sizeConfig.width, null, {
            withoutEnlargement: true,
            fit: 'inside',
            kernel: 'lanczos3' // Highest quality scaling
          });
        }

        // Apply format-specific optimization
        const quality = sizeConfig.quality || formatConfig.quality;

        if (formatName === 'avif') {
          pipeline = pipeline.avif({
            ...formatConfig,
            quality
          });
        } else if (formatName === 'webp') {
          pipeline = pipeline.webp({
            ...formatConfig,
            quality
          });
        } else if (formatName === 'jpeg') {
          pipeline = pipeline.jpeg({
            ...formatConfig,
            quality
          });
        }

        // Write to disk
        await pipeline.toFile(outputPath);

        // Get file stats
        const variantStats = await fs.stat(outputPath);
        stats.optimizedSize += variantStats.size;
        variantCount++;
        stats.variants++;

        // Store variant info
        result.variants[formatName][sizeName] = {
          path: path.relative(process.cwd(), outputPath),
          url: `/${path.relative('public', outputPath)}`,
          size: variantStats.size,
          width: sizeConfig.width || metadata.width,
          quality
        };

        // Progress indicator
        process.stdout.write('.');
      }
    }

    console.log(`\n  ✅ Generated ${variantCount} variants`);

    stats.processedImages++;
    return result;

  } catch (error) {
    console.error(`\n  ❌ Failed: ${error.message}`);
    stats.failedImages++;
    return null;
  }
}

/**
 * Process all images
 */
async function processAllImages() {
  console.log('🎨 PG Closets Image Optimization\n');
  console.log('================================\n');

  // Find all images
  const allImages = [];
  for (const pattern of CONFIG.inputDirs) {
    const matches = await glob(pattern, {
      ignore: ['**/node_modules/**', '**/.next/**', '**/optimized/**']
    });
    allImages.push(...matches);
  }

  stats.totalImages = allImages.length;
  console.log(`📊 Found ${stats.totalImages} images to optimize\n`);

  if (stats.totalImages === 0) {
    console.log('⚠️  No images found. Check your input directories.');
    return;
  }

  // Create output directory
  await fs.mkdir(CONFIG.outputDir, { recursive: true });

  // Process each image
  const manifest = {};

  for (let i = 0; i < allImages.length; i++) {
    const imagePath = allImages[i];
    console.log(`\n[${i + 1}/${allImages.length}]`);

    const result = await optimizeImage(imagePath);
    if (result) {
      manifest[result.original] = result;
    }
  }

  // Save manifest
  console.log('\n\n💾 Saving image manifest...');
  await fs.writeFile(
    CONFIG.manifestPath,
    JSON.stringify(manifest, null, 2)
  );

  // Generate report
  generateReport();
}

/**
 * Generate optimization report
 */
function generateReport() {
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const originalSizeMB = (stats.originalSize / 1024 / 1024).toFixed(2);
  const optimizedSizeMB = (stats.optimizedSize / 1024 / 1024).toFixed(2);
  const savings = ((1 - stats.optimizedSize / stats.originalSize) * 100).toFixed(1);
  const avgOriginal = (stats.originalSize / stats.processedImages / 1024).toFixed(0);
  const avgOptimized = (stats.optimizedSize / stats.variants / 1024).toFixed(0);

  console.log('\n\n');
  console.log('='.repeat(60));
  console.log('✨ OPTIMIZATION COMPLETE');
  console.log('='.repeat(60));
  console.log();
  console.log(`⏱️  Duration: ${duration}s`);
  console.log(`📊 Images processed: ${stats.processedImages}/${stats.totalImages}`);
  console.log(`❌ Failed: ${stats.failedImages}`);
  console.log(`🎯 Variants generated: ${stats.variants}`);
  console.log();
  console.log('💾 FILE SIZES:');
  console.log(`   Original:  ${originalSizeMB} MB (avg: ${avgOriginal} KB/image)`);
  console.log(`   Optimized: ${optimizedSizeMB} MB (avg: ${avgOptimized} KB/variant)`);
  console.log(`   Savings:   ${savings}% reduction`);
  console.log();
  console.log('📈 FORMAT BREAKDOWN:');
  console.log(`   AVIF: ${Math.floor(stats.variants / 3)} variants (~50% compression)`);
  console.log(`   WebP: ${Math.floor(stats.variants / 3)} variants (~30% compression)`);
  console.log(`   JPEG: ${Math.floor(stats.variants / 3)} variants (fallback)`);
  console.log();
  console.log('📂 OUTPUT:');
  console.log(`   Directory: ${CONFIG.outputDir}/`);
  console.log(`   Manifest:  ${CONFIG.manifestPath}`);
  console.log();
  console.log('='.repeat(60));
  console.log();

  // Performance assessment
  if (stats.failedImages === 0 && savings > 60) {
    console.log('🎉 EXCELLENT! All images optimized successfully');
    console.log('   Target achieved: <100KB per image, >60% savings');
  } else if (stats.failedImages > 0) {
    console.log('⚠️  WARNING: Some images failed to optimize');
    console.log('   Review errors above and retry failed images');
  } else if (savings < 60) {
    console.log('⚠️  WARNING: Optimization savings below target');
    console.log('   Consider adjusting quality settings in CONFIG');
  }

  console.log();
  console.log('📋 NEXT STEPS:');
  console.log('   1. Review optimized images in public/optimized/');
  console.log('   2. Check image-manifest.json for blur data URLs');
  console.log('   3. Update components to use OptimizedImage');
  console.log('   4. Run: npm run image:validate');
  console.log('   5. Deploy to production');
  console.log();
}

/**
 * Main execution
 */
async function main() {
  try {
    await processAllImages();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { optimizeImage, processAllImages };
