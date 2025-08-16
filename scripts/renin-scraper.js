#!/usr/bin/env node

/**
 * Renin.com Image Scraper - Node.js Version
 * Extracts product images from Renin's barn door catalog
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const cheerio = require('cheerio');

class ReninImageScraperJS {
    constructor(options = {}) {
        this.baseUrl = 'https://www.renin.com';
        this.outputDir = options.outputDir || 'renin_images';
        this.maxConcurrent = options.maxConcurrent || 5;
        this.delay = options.delay || 1000; // ms
        this.downloadedCount = 0;
        this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
    }

    async init() {
        // Create output directories
        await this.ensureDir(this.outputDir);
        await this.ensureDir(path.join(this.outputDir, 'barn_doors'));
        await this.ensureDir(path.join(this.outputDir, 'hardware'));
        await this.ensureDir(path.join(this.outputDir, 'metadata'));
    }

    async ensureDir(dirPath) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }

    async fetchPage(url) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const protocol = urlObj.protocol === 'https:' ? https : http;

            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname + urlObj.search,
                method: 'GET',
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'DNT': '1',
                    'Connection': 'keep-alive'
                }
            };

            const req = protocol.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(data);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    }
                });
            });

            req.on('error', reject);
            req.setTimeout(30000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    async getProductUrls() {
        console.log('🔍 Discovering product URLs...');
        
        try {
            const catalogUrl = `${this.baseUrl}/us/barn-doors/`;
            console.log(`Fetching catalog: ${catalogUrl}`);
            const html = await this.fetchPage(catalogUrl);
            const $ = cheerio.load(html);
            
            // Debug: Log page title and some link info
            console.log(`Page title: ${$('title').text()}`);
            console.log(`Found ${$('a').length} total links`);
            console.log(`Found ${$('a[href*="/barn-doors/"]').length} barn door links`);
            
            const productUrls = [];
            const seenUrls = new Set();

            // Find product links using WooCommerce selectors
            $('.woocommerce-loop-product__title a, .woocommerce-loop-product__title_link, a.woocommerce-LoopProduct-link').each((i, element) => {
                const href = $(element).attr('href');
                if (href && href.includes('/barn-doors/') && href !== '/barn-doors/') {
                    const fullUrl = new URL(href, this.baseUrl).href;
                    if (!seenUrls.has(fullUrl)) {
                        seenUrls.add(fullUrl);
                        productUrls.push(fullUrl);
                    }
                }
            });

            // Also try general barn door links as fallback
            $('a[href*="/barn-doors/"]').each((i, element) => {
                const href = $(element).attr('href');
                if (href && href.includes('/barn-doors/') && href !== '/barn-doors/' && !href.includes('/page/')) {
                    const fullUrl = new URL(href, this.baseUrl).href;
                    if (!seenUrls.has(fullUrl)) {
                        seenUrls.add(fullUrl);
                        productUrls.push(fullUrl);
                    }
                }
            });

            console.log(`📋 Found ${productUrls.length} product URLs`);
            return productUrls;

        } catch (error) {
            console.error('❌ Error getting product URLs:', error.message);
            return [];
        }
    }

    async extractProductData(productUrl) {
        try {
            await this.delay && new Promise(resolve => setTimeout(resolve, this.delay));

            const html = await this.fetchPage(productUrl);
            const $ = cheerio.load(html);

            // Extract product name
            const productName = $('h1.product_title').text().trim() || 'Unknown Product';
            const cleanName = productName.replace(/[^\w\s-]/g, '').replace(/[-\s]+/g, '-').replace(/^-+|-+$/g, '');

            // Extract images
            const images = [];
            const seenUrls = new Set();

            $('img[src*="wp-content/uploads"]').each((i, element) => {
                const src = $(element).attr('src');
                if (src) {
                    // Get full resolution image URL
                    let imgUrl = new URL(src, this.baseUrl).href;
                    
                    // Remove size suffixes to get original image
                    imgUrl = imgUrl.replace(/-\d+x\d+(\.(jpg|jpeg|png|webp))$/i, '$1');
                    
                    if (!seenUrls.has(imgUrl)) {
                        seenUrls.add(imgUrl);
                        images.push({
                            url: imgUrl,
                            alt: $(element).attr('alt') || '',
                            filename: this.getImageFilename(imgUrl, cleanName)
                        });
                    }
                }
            });

            return {
                name: productName,
                cleanName: cleanName,
                url: productUrl,
                images: images
            };

        } catch (error) {
            console.error(`❌ Error extracting data from ${productUrl}:`, error.message);
            return null;
        }
    }

    getImageFilename(imgUrl, productName) {
        const urlObj = new URL(imgUrl);
        const originalFilename = path.basename(urlObj.pathname);
        const { name, ext } = path.parse(originalFilename);

        let suffix = 'image';
        if (name.toLowerCase().includes('lifestyle')) {
            suffix = 'lifestyle';
        } else if (name.toLowerCase().includes('slab')) {
            suffix = 'product';
        } else if (name.toLowerCase().includes('detail')) {
            suffix = 'detail';
        }

        return `${productName}_${suffix}${ext}`;
    }

    async downloadImage(imageData, category = 'barn_doors') {
        try {
            const imgUrl = imageData.url;
            const filename = imageData.filename;
            const outputPath = path.join(this.outputDir, category, filename);

            // Skip if already exists
            try {
                await fs.access(outputPath);
                return true; // File exists, skip
            } catch {
                // File doesn't exist, continue with download
            }

            return new Promise((resolve, reject) => {
                const urlObj = new URL(imgUrl);
                const protocol = urlObj.protocol === 'https:' ? https : http;

                const req = protocol.get(imgUrl, (res) => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        const fileStream = require('fs').createWriteStream(outputPath);
                        res.pipe(fileStream);

                        fileStream.on('finish', () => {
                            fileStream.close();
                            this.downloadedCount++;
                            console.log(`✅ Downloaded: ${filename} (${this.downloadedCount})`);
                            resolve(true);
                        });

                        fileStream.on('error', reject);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    }
                });

                req.on('error', reject);
                req.setTimeout(30000, () => {
                    req.destroy();
                    reject(new Error('Download timeout'));
                });
            });

        } catch (error) {
            console.error(`❌ Error downloading ${imageData.url}:`, error.message);
            return false;
        }
    }

    async saveMetadata(productsData) {
        const metadataFile = path.join(this.outputDir, 'metadata', 'products.json');
        
        try {
            await fs.writeFile(metadataFile, JSON.stringify(productsData, null, 2));
            console.log(`💾 Saved metadata to ${metadataFile}`);
        } catch (error) {
            console.error('❌ Error saving metadata:', error.message);
        }
    }

    async scrapeAll() {
        console.log('🚀 Starting Renin image scraper (Node.js)...');

        await this.init();

        // Get all product URLs
        const productUrls = await this.getProductUrls();
        if (productUrls.length === 0) {
            console.log('❌ No product URLs found. Exiting.');
            return;
        }

        // Extract product data
        console.log('\n📊 Extracting product data...');
        const productsData = [];
        const allImages = [];

        for (let i = 0; i < productUrls.length; i++) {
            const url = productUrls[i];
            console.log(`Processing ${i + 1}/${productUrls.length}: ${url}`);
            
            const productData = await this.extractProductData(url);
            if (productData) {
                productsData.push(productData);
                allImages.push(...productData.images);
            }
        }

        console.log(`\n📷 Found ${allImages.length} images to download`);

        // Download images with concurrency control
        console.log('\n⬇️ Downloading images...');
        const chunks = [];
        for (let i = 0; i < allImages.length; i += this.maxConcurrent) {
            chunks.push(allImages.slice(i, i + this.maxConcurrent));
        }

        for (const chunk of chunks) {
            const promises = chunk.map(img => this.downloadImage(img));
            await Promise.allSettled(promises);
        }

        // Save metadata
        await this.saveMetadata(productsData);

        console.log(`\n🎉 Scraping complete! Downloaded ${this.downloadedCount} images`);
        console.log(`📁 Images saved to: ${this.outputDir}`);
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const options = {};

    // Parse command line arguments
    for (let i = 0; i < args.length; i += 2) {
        const flag = args[i];
        const value = args[i + 1];

        switch (flag) {
            case '--output':
            case '-o':
                options.outputDir = value;
                break;
            case '--workers':
            case '-w':
                options.maxConcurrent = parseInt(value) || 5;
                break;
            case '--delay':
            case '-d':
                options.delay = parseFloat(value) * 1000 || 1000; // Convert to ms
                break;
            case '--help':
            case '-h':
                console.log(`
Renin Image Scraper - Node.js Version

Usage: node renin-scraper.js [options]

Options:
  --output, -o     Output directory (default: renin_images)
  --workers, -w    Number of concurrent downloads (default: 5)
  --delay, -d      Delay between requests in seconds (default: 1.0)
  --help, -h       Show this help message

Example:
  node renin-scraper.js --output ../public/renin_images --workers 3 --delay 2.0
                `);
                return;
        }
    }

    const scraper = new ReninImageScraperJS(options);
    await scraper.scrapeAll();
}

// Check if cheerio is available
try {
    require.resolve('cheerio');
    main().catch(console.error);
} catch (error) {
    console.error('❌ cheerio package is required but not installed.');
    console.log('Install it with: npm install cheerio');
    process.exit(1);
}

module.exports = ReninImageScraperJS;