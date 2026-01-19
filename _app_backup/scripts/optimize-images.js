#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts product images to AVIF/WebP with responsive variants
 * Generates thumbnails and optimizes for web delivery
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { existsSync } = require('fs');

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '../public/images'),
  outputDir: path.join(__dirname, '../public/optimized-images'),
  formats: ['avif', 'webp', 'jpg'], // AVIF first for best compression
  sizes: {
    thumbnail: { width: 256, quality: 80, suffix: '-thumb' },
    small: { width: 640, quality: 85, suffix: '-sm' },
    medium: { width: 1080, quality: 85, suffix: '-md' },
    large: { width: 1920, quality: 90, suffix: '-lg' },
    original: { width: null, quality: 90, suffix: '' }, // Keep original size
  },
  // Preserve directory structure
  preserveStructure: true,
  // Skip already optimized images
  skipExisting: false,
  // Compression settings
  avifQuality: 80,
  webpQuality: 85,
  jpegQuality: 90,
  pngCompressionLevel: 9,
};

// Statistics tracking
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
  filesByFormat: {
    avif: 0,
    webp: 0,
    jpg: 0,
  },
  startTime: Date.now(),
};

/**
 * Get all image files recursively
 */
async function getImageFiles(dir, fileList = []) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      await getImageFiles(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * Get output path preserving directory structure
 */
function getOutputPath(inputPath, size, format) {
  const relativePath = path.relative(CONFIG.inputDir, inputPath);
  const parsedPath = path.parse(relativePath);
  const outputFileName = `${parsedPath.name}${CONFIG.sizes[size].suffix}.${format}`;
  return path.join(CONFIG.outputDir, parsedPath.dir, outputFileName);
}

/**
 * Ensure directory exists
 */
async function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }
}

/**
 * Optimize single image
 */
async function optimizeImage(inputPath) {
  try {
    const filename = path.basename(inputPath);
    console.log(`\n📸 Processing: ${filename}`);

    // Get original file size
    const originalStat = await fs.stat(inputPath);
    stats.totalOriginalSize += originalStat.size;

    // Load image
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`   Original: ${metadata.width}x${metadata.height}, ${(originalStat.size / 1024).toFixed(2)} KB`);

    let variantsGenerated = 0;

    // Generate variants for each size and format
    for (const [sizeName, sizeConfig] of Object.entries(CONFIG.sizes)) {
      // Skip if target width is larger than original (except for 'original')
      if (sizeName !== 'original' && sizeConfig.width && metadata.width < sizeConfig.width) {
        continue;
      }

      for (const format of CONFIG.formats) {
        const outputPath = getOutputPath(inputPath, sizeName, format);

        // Skip if file exists and skipExisting is true
        if (CONFIG.skipExisting && existsSync(outputPath)) {
          continue;
        }

        await ensureDir(outputPath);

        // Prepare image pipeline
        let pipeline = sharp(inputPath);

        // Resize if needed
        if (sizeConfig.width) {
          pipeline = pipeline.resize(sizeConfig.width, null, {
            fit: 'inside',
            withoutEnlargement: true,
          });
        }

        // Apply format-specific optimizations
        switch (format) {
          case 'avif':
            pipeline = pipeline.avif({
              quality: CONFIG.avifQuality,
              effort: 6, // 0-9, higher = better compression but slower
            });
            break;
          case 'webp':
            pipeline = pipeline.webp({
              quality: CONFIG.webpQuality,
              effort: 6,
            });
            break;
          case 'jpg':
          case 'jpeg':
            pipeline = pipeline.jpeg({
              quality: CONFIG.jpegQuality,
              progressive: true,
              mozjpeg: true,
            });
            break;
        }

        // Save optimized image
        await pipeline.toFile(outputPath);

        // Track size
        const optimizedStat = await fs.stat(outputPath);
        stats.totalOptimizedSize += optimizedStat.size;
        stats.filesByFormat[format]++;
        variantsGenerated++;

        const savedKB = ((originalStat.size - optimizedStat.size) / 1024).toFixed(2);
        const savedPercent = ((1 - optimizedStat.size / originalStat.size) * 100).toFixed(1);
        console.log(`   ✓ ${sizeName} ${format}: ${(optimizedStat.size / 1024).toFixed(2)} KB (saved ${savedKB} KB, ${savedPercent}%)`);
      }
    }

    stats.processed++;
    console.log(`   ✅ Generated ${variantsGenerated} variants`);

  } catch (error) {
    stats.errors++;
    console.error(`   ❌ Error processing ${inputPath}:`, error.message);
  }
}

/**
 * Generate optimization manifest
 */
async function generateManifest(imageFiles) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    totalImages: imageFiles.length,
    configuration: CONFIG,
    images: [],
  };

  for (const inputPath of imageFiles) {
    const relativePath = path.relative(CONFIG.inputDir, inputPath);
    const parsedPath = path.parse(relativePath);

    const imageEntry = {
      original: relativePath,
      variants: {},
    };

    // List all generated variants
    for (const [sizeName, sizeConfig] of Object.entries(CONFIG.sizes)) {
      imageEntry.variants[sizeName] = {};

      for (const format of CONFIG.formats) {
        const outputPath = getOutputPath(inputPath, sizeName, format);
        if (existsSync(outputPath)) {
          const stat = await fs.stat(outputPath);
          const metadata = await sharp(outputPath).metadata();

          imageEntry.variants[sizeName][format] = {
            path: path.relative(CONFIG.outputDir, outputPath),
            size: stat.size,
            width: metadata.width,
            height: metadata.height,
          };
        }
      }
    }

    manifest.images.push(imageEntry);
  }

  // Save manifest
  const manifestPath = path.join(CONFIG.outputDir, 'image-manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n📋 Manifest saved to: ${manifestPath}`);

  return manifest;
}

/**
 * Generate optimization report
 */
function generateReport() {
  const duration = (Date.now() - stats.startTime) / 1000;
  const originalSizeMB = (stats.totalOriginalSize / 1024 / 1024).toFixed(2);
  const optimizedSizeMB = (stats.totalOptimizedSize / 1024 / 1024).toFixed(2);
  const savedMB = (originalSizeMB - optimizedSizeMB).toFixed(2);
  const savedPercent = ((1 - stats.totalOptimizedSize / stats.totalOriginalSize) * 100).toFixed(1);

  const report = `
╔════════════════════════════════════════════════════════════════╗
║              IMAGE OPTIMIZATION REPORT                         ║
╚════════════════════════════════════════════════════════════════╝

⏱️  Duration: ${duration.toFixed(2)}s
📊 Statistics:
   - Images processed: ${stats.processed}
   - Images skipped:   ${stats.skipped}
   - Errors:           ${stats.errors}

📦 Size Reduction:
   - Original size:    ${originalSizeMB} MB
   - Optimized size:   ${optimizedSizeMB} MB
   - Total saved:      ${savedMB} MB (${savedPercent}%)

📈 Files Generated:
   - AVIF:  ${stats.filesByFormat.avif} files
   - WebP:  ${stats.filesByFormat.webp} files
   - JPEG:  ${stats.filesByFormat.jpg} files
   - Total: ${stats.filesByFormat.avif + stats.filesByFormat.webp + stats.filesByFormat.jpg} files

💡 Performance Impact:
   - Estimated page load improvement: ${(savedPercent / 2).toFixed(1)}%
   - Average file size reduction per image: ${(savedMB / stats.processed * 1024).toFixed(2)} KB

🎯 Next Steps:
   1. Review optimized images in: ${CONFIG.outputDir}
   2. Update image paths to use new optimized versions
   3. Implement lazy loading for below-the-fold images
   4. Configure CDN to serve optimized images
   5. Set up responsive image loading with srcset

╚════════════════════════════════════════════════════════════════╝
`;

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log(`📁 Input:  ${CONFIG.inputDir}`);
  console.log(`📁 Output: ${CONFIG.outputDir}\n`);

  // Ensure output directory exists
  await fs.mkdir(CONFIG.outputDir, { recursive: true });

  // Get all image files
  console.log('🔍 Scanning for images...');
  const imageFiles = await getImageFiles(CONFIG.inputDir);
  console.log(`   Found ${imageFiles.length} images\n`);

  if (imageFiles.length === 0) {
    console.log('⚠️  No images found to optimize');
    return;
  }

  // Process each image
  for (let i = 0; i < imageFiles.length; i++) {
    console.log(`\n[${i + 1}/${imageFiles.length}]`);
    await optimizeImage(imageFiles[i]);
  }

  // Generate manifest
  console.log('\n📝 Generating manifest...');
  await generateManifest(imageFiles);

  // Generate and save report
  const report = generateReport();
  console.log(report);

  const reportPath = path.join(CONFIG.outputDir, 'optimization-report.txt');
  await fs.writeFile(reportPath, report);
  console.log(`💾 Report saved to: ${reportPath}`);
}

// Run optimization
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
