#!/usr/bin/env node

/**
 * CRITICAL IMAGE OPTIMIZATION FOR APPLE-GRADE PERFORMANCE
 * Optimizes hero images and above-the-fold content for sub-2s load times
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { glob } = require('glob');

// Apple-grade performance targets
const PERFORMANCE_TARGETS = {
  heroImageMaxSize: 400 * 1024, // 400KB for hero images
  contentImageMaxSize: 250 * 1024, // 250KB for content images
  thumbnailMaxSize: 50 * 1024, // 50KB for thumbnails
  webpQuality: 85,
  avifQuality: 75,
  jpegQuality: 85,
};

// Critical images that must be optimized immediately
const CRITICAL_IMAGES = [
  'elegant-barn-door-closet.png',
  'lifestyle-barn-door-bedroom.png',
  'urban-lace-mirror-door.png',
  'blog-insights.png',
  'services/installation-mounting.jpg',
];

class CriticalImageOptimizer {
  constructor() {
    this.processed = 0;
    this.saved = 0;
    this.errors = [];
    this.startTime = Date.now();
  }

  async optimizeImage(inputPath, outputPath, options = {}) {
    const {
      width,
      height,
      quality = PERFORMANCE_TARGETS.webpQuality,
      format = 'webp',
      progressive = true,
      optimize = true,
    } = options;

    try {
      // Get original image info
      const stats = await fs.stat(inputPath);
      const originalSize = stats.size;

      let image = sharp(inputPath);

      // Resize if dimensions specified
      if (width || height) {
        image = image.resize(width, height, {
          fit: 'cover',
          position: 'center',
          withoutEnlargement: true,
        });
      }

      // Apply optimizations based on format
      switch (format) {
        case 'webp':
          image = image.webp({
            quality,
            effort: 6,
            smartSubsample: true,
            nearLossless: quality > 90,
          });
          break;
        case 'avif':
          image = image.avif({
            quality,
            effort: 6,
            chromaSubsampling: '4:2:0',
          });
          break;
        case 'jpeg':
          image = image.jpeg({
            quality,
            progressive,
            optimizeScans: optimize,
            mozjpeg: true,
          });
          break;
        case 'png':
          image = image.png({
            quality,
            progressive,
            compressionLevel: 9,
            adaptiveFiltering: true,
          });
          break;
      }

      // Ensure output directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      // Write optimized image
      await image.toFile(outputPath);

      // Calculate savings
      const newStats = await fs.stat(outputPath);
      const newSize = newStats.size;
      const savings = originalSize - newSize;
      const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

      this.processed++;
      this.saved += savings;

      return {
        success: true,
        originalSize,
        newSize,
        savings,
        savingsPercent,
        path: outputPath,
      };
    } catch (error) {
      this.errors.push({
        input: inputPath,
        error: error.message,
      });
      throw error;
    }
  }

  async createResponsiveImages(imagePath) {
    const name = path.basename(imagePath, path.extname(imagePath));
    const outputDir = path.join(process.cwd(), 'public', 'images', 'optimized', name);

    const sizes = [
      { name: 'mobile', width: 640, quality: 80 },
      { name: 'tablet', width: 1024, quality: 85 },
      { name: 'desktop', width: 1920, quality: 90 },
    ];

    const results = [];

    for (const size of sizes) {
      try {
        // Create WebP version
        const webpResult = await this.optimizeImage(
          imagePath,
          path.join(outputDir, `${size.name}.webp`),
          {
            width: size.width,
            quality: size.quality,
            format: 'webp',
          }
        );

        // Create AVIF version for modern browsers
        const avifResult = await this.optimizeImage(
          imagePath,
          path.join(outputDir, `${size.name}.avif`),
          {
            width: size.width,
            quality: Math.max(size.quality - 10, 70),
            format: 'avif',
          }
        );

        // Create fallback JPEG
        const jpegResult = await this.optimizeImage(
          imagePath,
          path.join(outputDir, `${size.name}.jpg`),
          {
            width: size.width,
            quality: size.quality,
            format: 'jpeg',
          }
        );

        results.push({
          size: size.name,
          width: size.width,
          webp: webpResult,
          avif: avifResult,
          jpeg: jpegResult,
        });

        console.log(`✓ ${name} ${size.name}: ${webpResult.savingsPercent}% savings`);
      } catch (error) {
        console.error(`✗ Failed to optimize ${name} ${size.name}:`, error.message);
      }
    }

    return results;
  }

  async optimizeCriticalImages() {
    console.log('🚀 Starting critical image optimization...\n');

    // Process critical images first
    for (const imageName of CRITICAL_IMAGES) {
      const imagePath = path.join(process.cwd(), 'public', 'images', imageName);

      try {
        const exists = await fs.access(imagePath).then(() => true).catch(() => false);
        if (exists) {
          console.log(`Processing critical image: ${imageName}`);
          await this.createResponsiveImages(imagePath);
        }
      } catch (error) {
        console.error(`Error processing ${imageName}:`, error.message);
      }
    }

    // Find and optimize large images
    const imagePatterns = ['public/images/**/*.{jpg,jpeg,png}'];
    const allImages = [];

    for (const pattern of imagePatterns) {
      const files = await glob(pattern, { cwd: process.cwd() });
      allImages.push(...files);
    }

    // Filter for large images (>500KB)
    const largeImages = [];
    for (const image of allImages) {
      const stats = await fs.stat(image);
      if (stats.size > 500 * 1024) { // >500KB
        largeImages.push({ path: image, size: stats.size });
      }
    }

    // Sort by size (largest first)
    largeImages.sort((a, b) => b.size - a.size);

    console.log(`\nFound ${largeImages.length} large images to optimize:`);

    // Optimize top 20 largest images
    const toOptimize = largeImages.slice(0, 20);
    for (const { path: imagePath, size } of toOptimize) {
      const sizeMB = (size / (1024 * 1024)).toFixed(2);
      console.log(`\nOptimizing: ${path} (${sizeMB}MB)`);

      try {
        await this.createResponsiveImages(imagePath);
      } catch (error) {
        console.error(`Failed to optimize ${imagePath}:`, error.message);
      }
    }
  }

  generateReport() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const savedMB = (this.saved / (1024 * 1024)).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('📊 CRITICAL IMAGE OPTIMIZATION REPORT');
    console.log('='.repeat(60));
    console.log(`✅ Images processed: ${this.processed}`);
    console.log(`💾 Space saved: ${savedMB} MB`);
    console.log(`⏱️  Duration: ${duration}s`);

    if (this.errors.length > 0) {
      console.log(`❌ Errors: ${this.errors.length}`);
      this.errors.forEach(err => console.log(`   - ${err.input}: ${err.error}`));
    }

    console.log('\n🎯 Performance Impact:');
    console.log('   • Faster LCP (Largest Contentful Paint)');
    console.log('   • Reduced CLS (Cumulative Layout Shift)');
    console.log('   • Better mobile network performance');
    console.log('   • Improved Core Web Vitals scores');
    console.log('='.repeat(60));
  }

  async createImageManifest() {
    const manifest = {
      version: Date.now(),
      optimized: [],
      generated: new Date().toISOString(),
    };

    const optimizedDir = path.join(process.cwd(), 'public', 'images', 'optimized');

    try {
      const files = await glob('**/*.{webp,avif,jpg}', { cwd: optimizedDir });

      for (const file of files) {
        const parts = file.split('/');
        const imageName = parts[0];
        const size = parts[1].split('.')[0];
        const format = path.extname(file).substring(1);

        if (!manifest.optimized.find(img => img.name === imageName)) {
          manifest.optimized.push({
            name: imageName,
            sizes: [],
          });
        }

        const img = manifest.optimized.find(img => img.name === imageName);
        img.sizes.push({
          size,
          format,
          path: `/images/optimized/${file}`,
        });
      }
    } catch (error) {
      console.error('Error creating image manifest:', error.message);
    }

    await fs.writeFile(
      path.join(process.cwd(), 'public', 'images', 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    console.log('✅ Image manifest created');
  }
}

// Main execution
async function main() {
  const optimizer = new CriticalImageOptimizer();

  try {
    await optimizer.optimizeCriticalImages();
    await optimizer.createImageManifest();
    optimizer.generateReport();
  } catch (error) {
    console.error('Critical image optimization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = CriticalImageOptimizer;