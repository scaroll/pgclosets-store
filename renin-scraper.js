#!/usr/bin/env node
/**
 * Renin Product Image Scraper - Node.js Alternative
 * 
 * A lighter-weight alternative using Puppeteer and Cheerio
 * 
 * Usage:
 *   npm install puppeteer cheerio axios fs-extra
 *   node renin-scraper.js
 */

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { URL } = require('url');
const crypto = require('crypto');

class ReninImageScraperJS {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || 'https://www.renin.com';
        this.outputDir = options.outputDir || './renin_images';
        this.rateLimit = options.rateLimit || 2000; // ms between requests
        this.downloadedImages = [];
        
        // Create output directories
        this.categories = ['barn-doors', 'closet-doors', 'mirrors', 'hardware'];
        this.setupDirectories();
    }

    async setupDirectories() {
        await fs.ensureDir(this.outputDir);
        for (const category of this.categories) {
            await fs.ensureDir(path.join(this.outputDir, category));
        }
    }

    async getProductUrls() {
        console.log('📥 Fetching product URLs from sitemap...');
        
        try {
            const sitemapUrl = `${this.baseUrl}/product-sitemap.xml`;
            const response = await axios.get(sitemapUrl);
            const $ = cheerio.load(response.data, { xmlMode: true });
            
            const products = [];
            $('url loc').each((index, element) => {
                const url = $(element).text();
                
                // Categorize based on URL
                let category = 'other';
                if (url.includes('/barn-doors/')) category = 'barn-doors';
                else if (url.includes('/closet-doors/')) category = 'closet-doors';
                else if (url.includes('/mirrors/')) category = 'mirrors';
                else if (url.includes('/hardware/')) category = 'hardware';
                
                // Extract product name from URL
                const urlParts = url.replace(/\/$/, '').split('/');
                const productName = urlParts[urlParts.length - 1]
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());
                
                products.push({
                    url,
                    category,
                    name: productName
                });
            });
            
            console.log(`✅ Found ${products.length} products`);
            return products;
            
        } catch (error) {
            console.error('❌ Error fetching sitemap:', error.message);
            return [];
        }
    }

    async extractImagesFromPage(productUrl, category, productName) {
        console.log(`🔍 Extracting images from: ${productName}`);
        
        const browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        try {
            const page = await browser.newPage();
            
            // Block unnecessary resources for faster loading
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const resourceType = req.resourceType();
                if (resourceType === 'stylesheet' || resourceType === 'font') {
                    req.abort();
                } else {
                    req.continue();
                }
            });
            
            await page.goto(productUrl, { waitUntil: 'networkidle2' });
            
            // Get page content
            const content = await page.content();
            const $ = cheerio.load(content);
            
            const imageUrls = new Set();
            
            // Target specific selectors for Renin's product images
            const selectors = [
                '.woocommerce-product-gallery img',
                '.product-images img',
                '.flex-viewport img',
                'img[src*="wp-content/uploads"]'
            ];
            
            selectors.forEach(selector => {
                $(selector).each((index, element) => {
                    const imgSrc = $(element).attr('src') || 
                                 $(element).attr('data-src') || 
                                 $(element).attr('data-large_image');
                    
                    if (imgSrc) {
                        let fullUrl = imgSrc;
                        
                        // Handle relative URLs
                        if (imgSrc.startsWith('//')) {
                            fullUrl = 'https:' + imgSrc;
                        } else if (imgSrc.startsWith('/')) {
                            fullUrl = this.baseUrl + imgSrc;
                        }
                        
                        // Filter for high-quality product images
                        if (fullUrl.includes('wp-content/uploads') && 
                            !fullUrl.includes('thumbnail') &&
                            !fullUrl.includes('-100x100') &&
                            !fullUrl.includes('-150x150')) {
                            imageUrls.add(fullUrl);
                        }
                    }
                });
            });
            
            console.log(`   Found ${imageUrls.size} images`);
            return Array.from(imageUrls);
            
        } catch (error) {
            console.error(`❌ Error extracting images from ${productUrl}:`, error.message);
            return [];
        } finally {
            await browser.close();
        }
    }

    async downloadImage(imageUrl, productName, category) {
        try {
            const response = await axios({
                method: 'GET',
                url: imageUrl,
                responseType: 'stream',
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                }
            });
            
            // Generate unique filename
            const urlHash = crypto.createHash('md5').update(imageUrl).digest('hex').substring(0, 8);
            const urlObj = new URL(imageUrl);
            const originalName = path.basename(urlObj.pathname);
            const ext = path.extname(originalName) || '.jpg';
            
            // Clean product name for filename
            const cleanName = productName
                .replace(/[^a-zA-Z0-9\s-]/g, '')
                .replace(/\s+/g, '_')
                .substring(0, 30);
            
            const filename = `${cleanName}_${urlHash}${ext}`;
            const filePath = path.join(this.outputDir, category, filename);
            
            // Download and save
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            
            return new Promise((resolve, reject) => {
                writer.on('finish', () => {
                    const stats = fs.statSync(filePath);
                    const imageData = {
                        url: imageUrl,
                        productName,
                        category,
                        filename,
                        localPath: filePath,
                        fileSize: stats.size
                    };
                    
                    console.log(`   ✅ Downloaded: ${filename}`);
                    resolve(imageData);
                });
                
                writer.on('error', reject);
            });
            
        } catch (error) {
            console.error(`❌ Error downloading ${imageUrl}:`, error.message);
            return null;
        }
    }

    async saveMetadata() {
        const metadataPath = path.join(this.outputDir, 'image_metadata.json');
        const csvPath = path.join(this.outputDir, 'image_metadata.csv');
        
        // Save as JSON
        await fs.writeJSON(metadataPath, this.downloadedImages, { spaces: 2 });
        
        // Save as CSV
        if (this.downloadedImages.length > 0) {
            const csvHeaders = 'url,productName,category,filename,localPath,fileSize\n';
            const csvRows = this.downloadedImages.map(img => 
                `"${img.url}","${img.productName}","${img.category}","${img.filename}","${img.localPath}",${img.fileSize}`
            ).join('\n');
            
            await fs.writeFile(csvPath, csvHeaders + csvRows);
        }
        
        console.log(`📊 Metadata saved to ${metadataPath} and ${csvPath}`);
    }

    async scrapeAllProducts(limit = null) {
        console.log('🚀 Starting Renin product image scraping...');
        
        const products = await this.getProductUrls();
        const productsToProcess = limit ? products.slice(0, limit) : products;
        
        if (limit) {
            console.log(`🧪 Testing mode: Processing first ${limit} products`);
        }
        
        let totalImages = 0;
        
        for (let i = 0; i < productsToProcess.length; i++) {
            const product = productsToProcess[i];
            console.log(`\n📦 Processing product ${i + 1}/${productsToProcess.length}: ${product.name}`);
            
            // Extract images from product page
            const imageUrls = await this.extractImagesFromPage(
                product.url,
                product.category,
                product.name
            );
            
            // Download each image
            for (const imageUrl of imageUrls) {
                const imageData = await this.downloadImage(
                    imageUrl,
                    product.name,
                    product.category
                );
                
                if (imageData) {
                    this.downloadedImages.push(imageData);
                    totalImages++;
                }
                
                // Rate limiting
                await this.sleep(this.rateLimit);
            }
            
            // Longer delay between products
            await this.sleep(3000);
        }
        
        // Save metadata
        await this.saveMetadata();
        
        console.log('\n🎉 Scraping complete!');
        this.printSummary();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    printSummary() {
        const categoryCounts = {};
        this.downloadedImages.forEach(img => {
            categoryCounts[img.category] = (categoryCounts[img.category] || 0) + 1;
        });
        
        console.log('\n' + '='.repeat(50));
        console.log('DOWNLOAD SUMMARY');
        console.log('='.repeat(50));
        
        Object.entries(categoryCounts).forEach(([category, count]) => {
            console.log(`${category.charAt(0).toUpperCase() + category.slice(1)}: ${count} images`);
        });
        
        console.log(`Total: ${this.downloadedImages.length} images`);
        console.log(`Storage location: ${path.resolve(this.outputDir)}`);
        console.log('='.repeat(50));
    }
}

// Usage
async function main() {
    const scraper = new ReninImageScraperJS();
    
    // For testing, limit to first 3 products
    await scraper.scrapeAllProducts(3);
    
    // For full scraping, use:
    // await scraper.scrapeAllProducts();
}

// Check if required dependencies are installed
function checkDependencies() {
    const required = ['puppeteer', 'cheerio', 'axios', 'fs-extra'];
    const missing = [];
    
    required.forEach(dep => {
        try {
            require.resolve(dep);
        } catch (_e) {
            missing.push(d_ep);
        }
    });
    
    if (missing.length > 0) {
        console.error('❌ Missing dependencies. Please install:');
        console.error(`npm install ${missing.join(' ')}`);
        process.exit(1);
    }
}

if (require.main === module) {
    checkDependencies();
    main().catch(console.error);
}

module.exports = ReninImageScraperJS;