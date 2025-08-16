#!/usr/bin/env node

/**
 * PG Closets - Advanced Image Optimization Pipeline
 * Multi-format image processing with intelligent compression
 * Generates responsive image variants for optimal performance
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
  INPUT_DIR: './public/images/harvested',
  OUTPUT_DIR: './public/images/optimized',
  SIZES: [150, 300, 600, 1200, 1920],
  FORMATS: {
    webp: { quality: 80 },
    avif: { quality: 75 },
    jpeg: { quality: 85 }
  },
  BATCH_SIZE: 5,
  CATEGORIES: [
    'barn-doors',
    'closet-doors', 
    'hardware',
    'track-systems',
    'handles',
    'accessories'
  ]
};

class ImageOptimizer {
  constructor() {
    this.processed = 0;
    this.failed = 0;
    this.optimizedImages = [];
    this.stats = {
      total_input_images: 0,
      total_output_variants: 0,
      compression_ratio: 0,
      processing_time: 0
    };
  }

  async init() {
    console.log('🎨 PG Closets Image Optimization Pipeline Starting...');
    
    // Create output directories
    this.createDirectories();
    
    // Load input images
    this.loadInputImages();
    
    console.log(`📸 Found ${this.stats.total_input_images} images to optimize`);
    console.log(`🖼️ Will generate ${this.stats.total_input_images * CONFIG.SIZES.length * Object.keys(CONFIG.FORMATS).length} variants`);
  }

  createDirectories() {
    const dirs = [
      CONFIG.OUTPUT_DIR,
      ...CONFIG.CATEGORIES.map(cat => path.join(CONFIG.OUTPUT_DIR, cat))
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }

  loadInputImages() {
    CONFIG.CATEGORIES.forEach(category => {
      const categoryDir = path.join(CONFIG.INPUT_DIR, category);
      if (fs.existsSync(categoryDir)) {
        const files = fs.readdirSync(categoryDir)
          .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
        this.stats.total_input_images += files.length;
      }
    });
  }

  async optimizeImage(inputPath, outputDir, baseName) {
    const results = [];
    
    try {
      // Get original image metadata
      const metadata = await sharp(inputPath).metadata();
      const originalSize = fs.statSync(inputPath).size;
      
      // Generate optimized variants
      for (const size of CONFIG.SIZES) {
        // Skip if original is smaller than target size
        if (metadata.width && metadata.width < size) continue;
        
        for (const [format, options] of Object.entries(CONFIG.FORMATS)) {
          const outputPath = path.join(outputDir, `${baseName}-${size}w.${format}`);
          
          try {
            const info = await sharp(inputPath)
              .resize(size, null, { 
                withoutEnlargement: true,
                fit: 'inside'
              })
              .toFormat(format, options)
              .toFile(outputPath);
            
            const outputSize = fs.statSync(outputPath).size;
            const compressionRatio = ((originalSize - outputSize) / originalSize * 100).toFixed(1);
            
            results.push({
              path: outputPath,
              size: outputSize,
              width: info.width,
              height: info.height,
              format,
              compression_ratio: compressionRatio
            });
            
            console.log(`✅ ${path.basename(outputPath)} - ${this.formatBytes(outputSize)} (${compressionRatio}% smaller)`);
            
          } catch (error) {
            console.warn(`❌ Failed to generate ${format} variant:`, error.message);
            this.failed++;
          }
        }
      }
      
      this.processed++;
      return results;
      
    } catch (error) {
      console.error(`❌ Failed to process ${inputPath}:`, error.message);
      this.failed++;
      return [];
    }
  }

  async processCategory(category) {
    console.log(`\n📂 Processing category: ${category}`);
    
    const inputDir = path.join(CONFIG.INPUT_DIR, category);
    const outputDir = path.join(CONFIG.OUTPUT_DIR, category);
    
    if (!fs.existsSync(inputDir)) {
      console.log(`⚠️ Input directory not found: ${inputDir}`);
      return;
    }
    
    const imageFiles = fs.readdirSync(inputDir)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => ({
        input: path.join(inputDir, file),
        baseName: path.parse(file).name
      }));
    
    if (imageFiles.length === 0) {
      console.log(`📭 No images found in ${category}`);
      return;
    }
    
    console.log(`📸 Found ${imageFiles.length} images in ${category}`);
    
    // Process images in batches
    for (let i = 0; i < imageFiles.length; i += CONFIG.BATCH_SIZE) {
      const batch = imageFiles.slice(i, i + CONFIG.BATCH_SIZE);
      
      console.log(`🔄 Processing batch ${Math.floor(i / CONFIG.BATCH_SIZE) + 1}/${Math.ceil(imageFiles.length / CONFIG.BATCH_SIZE)}`);
      
      const batchPromises = batch.map(({ input, baseName }) => 
        this.optimizeImage(input, outputDir, baseName)
      );
      
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(results => {
        this.optimizedImages.push(...results);
      });
    }
    
    console.log(`✅ Completed ${category}: ${imageFiles.length} images processed`);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async generateManifest() {
    const manifest = {
      generated_at: new Date().toISOString(),
      optimization_config: CONFIG,
      statistics: {
        total_input_images: this.stats.total_input_images,
        total_output_variants: this.optimizedImages.length,
        processed_successfully: this.processed,
        failed_processing: this.failed,
        success_rate: ((this.processed / (this.processed + this.failed)) * 100).toFixed(1) + '%'
      },
      images_by_category: {},
      images_by_format: {},
      images_by_size: {}
    };
    
    // Group by category
    CONFIG.CATEGORIES.forEach(category => {
      manifest.images_by_category[category] = this.optimizedImages
        .filter(img => img.path.includes(`/${category}/`)).length;
    });
    
    // Group by format
    Object.keys(CONFIG.FORMATS).forEach(format => {
      manifest.images_by_format[format] = this.optimizedImages
        .filter(img => img.format === format).length;
    });
    
    // Group by size
    CONFIG.SIZES.forEach(size => {
      manifest.images_by_size[`${size}w`] = this.optimizedImages
        .filter(img => img.path.includes(`-${size}w.`)).length;
    });
    
    // Calculate compression statistics
    const totalOriginalSize = this.optimizedImages.reduce((sum, img) => sum + img.size, 0);
    const avgCompressionRatio = this.optimizedImages.reduce((sum, img) => 
      sum + parseFloat(img.compression_ratio), 0) / this.optimizedImages.length;
    
    manifest.compression_stats = {
      total_optimized_size: this.formatBytes(totalOriginalSize),
      average_compression_ratio: avgCompressionRatio.toFixed(1) + '%',
      formats_performance: Object.keys(CONFIG.FORMATS).map(format => {
        const formatImages = this.optimizedImages.filter(img => img.format === format);
        const avgRatio = formatImages.reduce((sum, img) => 
          sum + parseFloat(img.compression_ratio), 0) / formatImages.length;
        return {
          format,
          average_compression: avgRatio.toFixed(1) + '%',
          image_count: formatImages.length
        };
      })
    };
    
    return manifest;
  }

  async saveResults() {
    const manifest = await this.generateManifest();
    
    // Save optimization manifest
    const manifestFile = path.join(CONFIG.OUTPUT_DIR, 'optimization-manifest.json');
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
    
    // Generate optimization report
    const report = this.generateReport(manifest);
    const reportFile = path.join(CONFIG.OUTPUT_DIR, 'optimization-report.md');
    fs.writeFileSync(reportFile, report);
    
    console.log(`💾 Saved optimization manifest: ${manifestFile}`);
    console.log(`📊 Generated report: ${reportFile}`);
  }

  generateReport(manifest) {
    return `# PG Closets - Image Optimization Report

## Optimization Summary
- **Total Input Images**: ${manifest.statistics.total_input_images}
- **Total Output Variants**: ${manifest.statistics.total_output_variants}
- **Success Rate**: ${manifest.statistics.success_rate}
- **Average Compression**: ${manifest.compression_stats.average_compression_ratio}

## Images by Category
${CONFIG.CATEGORIES.map(cat => 
  `- **${cat}**: ${manifest.images_by_category[cat]} variants`
).join('\n')}

## Images by Format
${Object.keys(CONFIG.FORMATS).map(format => 
  `- **${format.toUpperCase()}**: ${manifest.images_by_format[format]} images (avg compression: ${
    manifest.compression_stats.formats_performance.find(f => f.format === format)?.average_compression || 'N/A'
  })`
).join('\n')}

## Responsive Sizes Generated
${CONFIG.SIZES.map(size => 
  `- **${size}px width**: ${manifest.images_by_size[size + 'w']} variants`
).join('\n')}

## Performance Impact
- **Total Optimized Size**: ${manifest.compression_stats.total_optimized_size}
- **WebP Variants**: Best for modern browsers
- **AVIF Variants**: Next-gen format with superior compression
- **JPEG Variants**: Universal fallback compatibility

## Implementation
Use these optimized images in your components with picture elements:

\`\`\`jsx
<picture>
  <source srcSet="/images/optimized/barn-doors/image-600w.avif" type="image/avif" />
  <source srcSet="/images/optimized/barn-doors/image-600w.webp" type="image/webp" />
  <img src="/images/optimized/barn-doors/image-600w.jpeg" alt="Product" />
</picture>
\`\`\`

---
Generated on: ${manifest.generated_at}
`;
  }

  async run() {
    const startTime = Date.now();
    
    await this.init();
    
    console.log('🔄 Starting optimization process...');
    
    // Process each category
    for (const category of CONFIG.CATEGORIES) {
      await this.processCategory(category);
    }
    
    const endTime = Date.now();
    this.stats.processing_time = (endTime - startTime) / 1000;
    
    await this.saveResults();
    
    console.log('\n🎉 Optimization complete!');
    console.log(`📊 Results: ${this.processed} images processed, ${this.optimizedImages.length} variants generated`);
    console.log(`⏱️ Processing time: ${this.stats.processing_time.toFixed(1)}s`);
    console.log(`💾 Average compression: ${(this.optimizedImages.reduce((sum, img) => sum + parseFloat(img.compression_ratio), 0) / this.optimizedImages.length).toFixed(1)}%`);
    
    return this.stats;
  }
}

// Export for use as module
module.exports = ImageOptimizer;

// Run if called directly
if (require.main === module) {
  const optimizer = new ImageOptimizer();
  optimizer.run().catch(console.error);
}