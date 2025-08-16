#!/usr/bin/env node

/**
 * PG Closets - Advanced Shopify Image Harvesting System
 * Automatically extracts product images from multiple Shopify stores
 * Part of the AI-Powered E-Commerce Automation Pipeline
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Configuration
const CONFIG = {
  TARGET_STORES: [
    'closet-world.myshopify.com',
    'california-closets.myshopify.com', 
    'organize-it.myshopify.com',
    'closet-solutions.myshopify.com',
    'space-solutions.myshopify.com',
    'custom-closets.myshopify.com',
    'closet-design.myshopify.com'
  ],
  OUTPUT_DIR: './public/images/harvested',
  RATE_LIMIT: 2000, // ms between requests
  MAX_CONCURRENT: 3,
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 30000,
  CATEGORIES: [
    'barn-doors',
    'closet-doors', 
    'hardware',
    'track-systems',
    'handles',
    'accessories'
  ]
};

class ShopifyHarvester {
  constructor() {
    this.harvested = [];
    this.errors = [];
    this.stats = {
      total_images: 0,
      successful_downloads: 0,
      failed_downloads: 0,
      stores_processed: 0
    };
  }

  async init() {
    console.log('🚀 PG Closets Shopify Image Harvester Starting...');
    
    // Create output directories
    this.createDirectories();
    
    // Load existing harvest data
    this.loadExistingData();
    
    console.log(`📡 Targeting ${CONFIG.TARGET_STORES.length} Shopify stores`);
    console.log(`📁 Output directory: ${CONFIG.OUTPUT_DIR}`);
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

  loadExistingData() {
    const dataFile = path.join(CONFIG.OUTPUT_DIR, 'harvest-data.json');
    if (fs.existsSync(dataFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        this.harvested = data.harvested || [];
        console.log(`📊 Loaded ${this.harvested.length} existing harvest records`);
      } catch (error) {
        console.warn('⚠️ Could not load existing harvest data:', error.message);
      }
    }
  }

  async harvestStore(storeDomain) {
    console.log(`🎯 Harvesting: ${storeDomain}`);
    
    try {
      // Get store's sitemap for product discovery
      const sitemap = await this.fetchSitemap(storeDomain);
      const productUrls = this.extractProductUrls(sitemap);
      
      console.log(`📦 Found ${productUrls.length} products on ${storeDomain}`);
      
      // Process products in batches
      const batchSize = CONFIG.MAX_CONCURRENT;
      for (let i = 0; i < productUrls.length; i += batchSize) {
        const batch = productUrls.slice(i, i + batchSize);
        await Promise.all(batch.map(url => this.harvestProduct(storeDomain, url)));
        
        // Rate limiting
        if (i + batchSize < productUrls.length) {
          await this.delay(CONFIG.RATE_LIMIT);
        }
      }
      
      this.stats.stores_processed++;
      console.log(`✅ Completed harvesting: ${storeDomain}`);
      
    } catch (error) {
      console.error(`❌ Failed to harvest ${storeDomain}:`, error.message);
      this.errors.push({
        store: storeDomain,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async fetchSitemap(storeDomain) {
    const sitemapUrl = `https://${storeDomain}/sitemap_products_1.xml`;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout')), CONFIG.TIMEOUT);
      
      https.get(sitemapUrl, (res) => {
        clearTimeout(timeout);
        let data = '';
        
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      }).on('error', reject);
    });
  }

  extractProductUrls(sitemapXml) {
    const urlMatches = sitemapXml.match(/<loc>(.*?)<\\/loc>/g) || [];
    return urlMatches
      .map(match => match.replace(/<\/?loc>/g, ''))
      .filter(url => url.includes('/products/'))
      .slice(0, 50); // Limit per store
  }

  async harvestProduct(storeDomain, productUrl) {
    try {
      const productData = await this.fetchProductData(productUrl);
      if (!productData) return;

      // Categorize product
      const category = this.categorizeProduct(productData);
      
      // Download product images
      const images = productData.images || [];
      for (const imageUrl of images.slice(0, 3)) { // Max 3 images per product
        await this.downloadImage(imageUrl, category, storeDomain, productData.handle);
      }
      
    } catch (error) {
      console.warn(`⚠️ Failed to harvest product ${productUrl}:`, error.message);
    }
  }

  async fetchProductData(productUrl) {
    const jsonUrl = productUrl + '.json';
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout')), CONFIG.TIMEOUT);
      
      https.get(jsonUrl, (res) => {
        clearTimeout(timeout);
        let data = '';
        
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const json = JSON.parse(data);
              resolve(json.product);
            } else {
              resolve(null);
            }
          } catch (error) {
            resolve(null);
          }
        });
      }).on('error', () => resolve(null));
    });
  }

  categorizeProduct(product) {
    const title = (product.title || '').toLowerCase();
    const tags = (product.tags || []).join(' ').toLowerCase();
    const text = `${title} ${tags}`;
    
    if (text.includes('barn') || text.includes('sliding')) return 'barn-doors';
    if (text.includes('hardware') || text.includes('track')) return 'hardware';
    if (text.includes('handle') || text.includes('pull')) return 'handles';
    if (text.includes('closet') || text.includes('wardrobe')) return 'closet-doors';
    if (text.includes('track') || text.includes('rail')) return 'track-systems';
    
    return 'accessories';
  }

  async downloadImage(imageUrl, category, storeDomain, productHandle) {
    if (!imageUrl || typeof imageUrl !== 'string') return;
    
    try {
      // Clean and validate URL
      const url = new URL(imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl);
      
      // Generate filename
      const ext = path.extname(url.pathname) || '.jpg';
      const filename = `${storeDomain}-${productHandle}-${Date.now()}${ext}`;
      const filepath = path.join(CONFIG.OUTPUT_DIR, category, filename);
      
      // Check if already downloaded
      if (this.harvested.some(h => h.filename === filename)) {
        return;
      }
      
      // Download image
      await this.downloadFile(url.href, filepath);
      
      // Record successful harvest
      const harvestRecord = {
        filename,
        category,
        source_store: storeDomain,
        product_handle: productHandle,
        original_url: imageUrl,
        harvested_at: new Date().toISOString(),
        file_size: fs.statSync(filepath).size
      };
      
      this.harvested.push(harvestRecord);
      this.stats.successful_downloads++;
      
      console.log(`📸 Downloaded: ${category}/${filename}`);
      
    } catch (error) {
      this.stats.failed_downloads++;
      console.warn(`❌ Failed to download image:`, error.message);
    }
  }

  async downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filepath);
      const timeout = setTimeout(() => {
        file.destroy();
        reject(new Error('Download timeout'));
      }, CONFIG.TIMEOUT);
      
      https.get(url, (response) => {
        clearTimeout(timeout);
        
        if (response.statusCode !== 200) {
          file.destroy();
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve();
        });
        
        file.on('error', (error) => {
          file.destroy();
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
          reject(error);
        });
      }).on('error', reject);
    });
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async saveResults() {
    // Save harvest data
    const dataFile = path.join(CONFIG.OUTPUT_DIR, 'harvest-data.json');
    const harvestData = {
      harvested: this.harvested,
      stats: this.stats,
      errors: this.errors,
      last_updated: new Date().toISOString()
    };
    
    fs.writeFileSync(dataFile, JSON.stringify(harvestData, null, 2));
    
    // Generate summary report
    const report = this.generateReport();
    const reportFile = path.join(CONFIG.OUTPUT_DIR, 'harvest-report.md');
    fs.writeFileSync(reportFile, report);
    
    console.log(`💾 Saved harvest data: ${dataFile}`);
    console.log(`📊 Generated report: ${reportFile}`);
  }

  generateReport() {
    const categoryStats = {};
    CONFIG.CATEGORIES.forEach(cat => {
      categoryStats[cat] = this.harvested.filter(h => h.category === cat).length;
    });
    
    return `# PG Closets - Shopify Harvest Report

## Summary
- **Total Images Harvested**: ${this.stats.successful_downloads}
- **Failed Downloads**: ${this.stats.failed_downloads}
- **Stores Processed**: ${this.stats.stores_processed}
- **Success Rate**: ${((this.stats.successful_downloads / (this.stats.successful_downloads + this.stats.failed_downloads)) * 100).toFixed(1)}%

## Images by Category
${CONFIG.CATEGORIES.map(cat => `- **${cat}**: ${categoryStats[cat]} images`).join('\n')}

## Processing Errors
${this.errors.length === 0 ? 'No errors encountered! 🎉' : this.errors.map(err => `- ${err.store}: ${err.error}`).join('\n')}

## Next Steps
1. Run image optimization: \`npm run optimize-images\`
2. Generate product database: \`npm run generate-catalog\`
3. Update website content: \`npm run update-content\`

---
Generated on: ${new Date().toISOString()}
`;
  }

  async run() {
    await this.init();
    
    console.log('🔄 Starting harvest process...');
    
    // Process stores sequentially to avoid overwhelming servers
    for (const storeDomain of CONFIG.TARGET_STORES) {
      await this.harvestStore(storeDomain);
      await this.delay(CONFIG.RATE_LIMIT * 2); // Extra delay between stores
    }
    
    await this.saveResults();
    
    console.log('🎉 Harvest complete!');
    console.log(`📊 Results: ${this.stats.successful_downloads} images, ${this.stats.failed_downloads} failures`);
    
    return this.stats;
  }
}

// Export for use as module
module.exports = ShopifyHarvester;

// Run if called directly
if (require.main === module) {
  const harvester = new ShopifyHarvester();
  harvester.run().catch(console.error);
}