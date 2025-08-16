#!/usr/bin/env node

/**
 * PG Closets - AI-Powered Content Generation System
 * Automatically generates product database, API endpoints, and website content
 * Integrates harvested images with intelligent product categorization
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  HARVESTED_DIR: './public/images/harvested',
  OPTIMIZED_DIR: './public/images/optimized',
  OUTPUT_DIR: './lib/generated',
  API_DIR: './app/api/products',
  COMPONENTS_DIR: './components/products',
  CATEGORIES: {
    'barn-doors': {
      name: 'Barn Doors',
      description: 'Premium sliding barn doors for modern homes',
      price_range: [679, 1249],
      features: ['Solid wood construction', 'Premium hardware included', 'Multiple finish options', 'Professional installation available']
    },
    'closet-doors': {
      name: 'Closet Doors',
      description: 'Custom closet door solutions for any space',
      price_range: [449, 899],
      features: ['Custom sizing available', 'Multiple panel options', 'Quality hinges included', 'Lifetime warranty']
    },
    'hardware': {
      name: 'Door Hardware',
      description: 'Professional-grade track systems and hardware',
      price_range: [299, 699],
      features: ['Smooth operation', 'Soft-close technology', 'Industrial strength', 'Easy installation']
    },
    'track-systems': {
      name: 'Track Systems',
      description: 'Complete sliding door track systems',
      price_range: [399, 899],
      features: ['Heavy-duty construction', 'Multiple finish options', 'Complete hardware kit', 'Installation guide included']
    },
    'handles': {
      name: 'Door Handles',
      description: 'Premium door handles and pulls',
      price_range: [89, 249],
      features: ['Ergonomic design', 'Multiple finishes', 'Easy installation', 'Matching hardware available']
    },
    'accessories': {
      name: 'Accessories',
      description: 'Complete your door system with quality accessories',
      price_range: [49, 199],
      features: ['Quality materials', 'Easy installation', 'Perfect fit guarantee', 'Lifetime support']
    }
  }
};

class ContentGenerator {
  constructor() {
    this.harvestedData = null;
    this.optimizedManifest = null;
    this.generatedProducts = [];
    this.stats = {
      products_generated: 0,
      categories_processed: 0,
      api_endpoints_created: 0,
      components_created: 0
    };
  }

  async init() {
    console.log('🚀 PG Closets Content Generation System Starting...');
    
    // Create output directories
    this.createDirectories();
    
    // Load existing data
    await this.loadData();
    
    console.log(`📊 Found ${this.harvestedData?.harvested?.length || 0} harvested images`);
    console.log(`🎨 Found ${this.optimizedManifest?.statistics?.total_output_variants || 0} optimized variants`);
  }

  createDirectories() {
    const dirs = [
      CONFIG.OUTPUT_DIR,
      CONFIG.API_DIR,
      CONFIG.COMPONENTS_DIR
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }

  async loadData() {
    // Load harvested data
    const harvestFile = path.join(CONFIG.HARVESTED_DIR, 'harvest-data.json');
    if (fs.existsSync(harvestFile)) {
      this.harvestedData = JSON.parse(fs.readFileSync(harvestFile, 'utf8'));
    }
    
    // Load optimization manifest
    const manifestFile = path.join(CONFIG.OPTIMIZED_DIR, 'optimization-manifest.json');
    if (fs.existsSync(manifestFile)) {
      this.optimizedManifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    }
  }

  generateProductFromImage(imageData, category) {
    const categoryConfig = CONFIG.CATEGORIES[category];
    const baseName = path.parse(imageData.filename).name;
    
    // Generate product details
    const productName = this.generateProductName(baseName, category);
    const productSlug = this.slugify(productName);
    const price = this.generatePrice(categoryConfig.price_range);
    const salePrice = Math.random() > 0.7 ? this.generateSalePrice(price) : null;
    
    // Find optimized variants
    const imageVariants = this.getImageVariants(baseName, category);
    
    const product = {
      id: `pgc-${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      slug: productSlug,
      name: productName,
      category: category,
      description: this.generateDescription(productName, categoryConfig),
      price: price,
      sale_price: salePrice,
      currency: 'CAD',
      tax_rate: 0.13, // Ontario HST
      images: {
        main: imageVariants.main,
        gallery: imageVariants.gallery,
        optimized: imageVariants.optimized
      },
      features: this.selectFeatures(categoryConfig.features),
      specifications: this.generateSpecifications(category),
      availability: {
        in_stock: true,
        quantity: Math.floor(Math.random() * 50) + 10,
        lead_time: Math.floor(Math.random() * 14) + 1
      },
      seo: {
        title: `${productName} - Premium ${categoryConfig.name} | PG Closets Ottawa`,
        description: `${productName} available in Ottawa. ${categoryConfig.description} Professional installation available.`,
        keywords: this.generateKeywords(productName, category)
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source: {
        harvested_from: imageData.source_store,
        original_handle: imageData.product_handle,
        generation_method: 'automated'
      }
    };
    
    return product;
  }

  generateProductName(baseName, category) {
    const prefixes = {
      'barn-doors': ['Premier', 'Rustic', 'Modern', 'Classic', 'Designer', 'Artisan'],
      'closet-doors': ['Custom', 'Contemporary', 'Traditional', 'Elegant', 'Luxury', 'Premium'],
      'hardware': ['Professional', 'Heavy-Duty', 'Premium', 'Commercial', 'Designer', 'Industrial'],
      'track-systems': ['Complete', 'Professional', 'Heavy-Duty', 'Premium', 'Commercial', 'Designer'],
      'handles': ['Ergonomic', 'Designer', 'Premium', 'Contemporary', 'Classic', 'Modern'],
      'accessories': ['Premium', 'Professional', 'Complete', 'Designer', 'Quality', 'Essential']
    };
    
    const suffixes = {
      'barn-doors': ['Barn Door', 'Sliding Door', 'Door System'],
      'closet-doors': ['Closet Door', 'Wardrobe Door', 'Door Panel'],
      'hardware': ['Hardware Kit', 'Track Hardware', 'Door Hardware'],
      'track-systems': ['Track System', 'Sliding System', 'Door Track'],
      'handles': ['Door Handle', 'Pull Handle', 'Lever Handle'],
      'accessories': ['Accessory Kit', 'Hardware Set', 'Component Set']
    };
    
    const prefix = prefixes[category][Math.floor(Math.random() * prefixes[category].length)];
    const suffix = suffixes[category][Math.floor(Math.random() * suffixes[category].length)];
    
    return `${prefix} ${suffix}`;
  }

  generateDescription(productName, categoryConfig) {
    const templates = [
      `Transform your space with our ${productName.toLowerCase()}. ${categoryConfig.description} Expertly crafted for the discerning Ottawa homeowner.`,
      `Discover the perfect blend of style and functionality with our ${productName.toLowerCase()}. ${categoryConfig.description} Professional installation available throughout Ottawa.`,
      `Elevate your home's aesthetic with our premium ${productName.toLowerCase()}. ${categoryConfig.description} Backed by our satisfaction guarantee.`,
      `Experience exceptional quality with our ${productName.toLowerCase()}. ${categoryConfig.description} Designed for modern Ottawa homes.`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  generatePrice(priceRange) {
    const min = priceRange[0];
    const max = priceRange[1];
    const price = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Round to nearest $10
    return Math.round(price / 10) * 10;
  }

  generateSalePrice(originalPrice) {
    const discount = 0.15 + Math.random() * 0.25; // 15-40% discount
    const salePrice = Math.floor(originalPrice * (1 - discount));
    return Math.round(salePrice / 10) * 10;
  }

  getImageVariants(baseName, category) {
    const optimizedDir = path.join(CONFIG.OPTIMIZED_DIR, category);
    const variants = {
      main: `/images/optimized/${category}/${baseName}-600w.webp`,
      gallery: [],
      optimized: {
        webp: {},
        avif: {},
        jpeg: {}
      }
    };
    
    if (fs.existsSync(optimizedDir)) {
      const files = fs.readdirSync(optimizedDir)
        .filter(file => file.startsWith(baseName));
      
      // Organize by format and size
      files.forEach(file => {
        const match = file.match(/-(\d+)w\.(webp|avif|jpeg)$/);
        if (match) {
          const size = match[1];
          const format = match[2];
          const url = `/images/optimized/${category}/${file}`;
          
          if (!variants.optimized[format]) variants.optimized[format] = {};
          variants.optimized[format][size] = url;
          
          // Add to gallery
          if (format === 'webp' && ['300', '600'].includes(size)) {
            variants.gallery.push(url);
          }
        }
      });
    }
    
    return variants;
  }

  selectFeatures(allFeatures) {
    const count = Math.floor(Math.random() * 2) + 3; // 3-4 features
    const shuffled = [...allFeatures].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  generateSpecifications(category) {
    const specs = {
      'barn-doors': {
        material: ['Solid Wood', 'MDF', 'Engineered Wood'][Math.floor(Math.random() * 3)],
        thickness: ['1.5"', '1.75"', '2"'][Math.floor(Math.random() * 3)],
        finish: ['Natural', 'Stained', 'Painted'][Math.floor(Math.random() * 3)],
        hardware_included: true
      },
      'closet-doors': {
        material: ['Solid Wood', 'MDF', 'Glass Panel'][Math.floor(Math.random() * 3)],
        thickness: ['1.375"', '1.5"', '1.75"'][Math.floor(Math.random() * 3)],
        hinge_type: ['Standard', 'Soft-Close', 'European'][Math.floor(Math.random() * 3)],
        adjustable: true
      },
      'hardware': {
        material: ['Stainless Steel', 'Carbon Steel', 'Aluminum'][Math.floor(Math.random() * 3)],
        finish: ['Black', 'Brushed Nickel', 'Oil Rubbed Bronze'][Math.floor(Math.random() * 3)],
        weight_capacity: `${(Math.floor(Math.random() * 50) + 100)} lbs`,
        warranty: '10 years'
      },
      'track-systems': {
        material: ['Steel', 'Aluminum', 'Stainless Steel'][Math.floor(Math.random() * 3)],
        length: `${(Math.floor(Math.random() * 4) + 6)} ft`,
        weight_capacity: `${(Math.floor(Math.random() * 100) + 150)} lbs`,
        mounting: 'Top Mount'
      },
      'handles': {
        material: ['Stainless Steel', 'Brass', 'Aluminum'][Math.floor(Math.random() * 3)],
        finish: ['Brushed', 'Polished', 'Matte'][Math.floor(Math.random() * 3)],
        length: `${(Math.floor(Math.random() * 8) + 4)} inches`,
        mounting: 'Surface Mount'
      },
      'accessories': {
        material: ['Metal', 'Plastic', 'Composite'][Math.floor(Math.random() * 3)],
        finish: ['Black', 'White', 'Chrome'][Math.floor(Math.random() * 3)],
        compatibility: 'Universal',
        installation: 'Easy'
      }
    };
    
    return specs[category] || {};
  }

  generateKeywords(productName, category) {
    const baseKeywords = [
      'Ottawa closet doors',
      'custom doors Ottawa',
      'door installation Ottawa',
      'PG Closets'
    ];
    
    const categoryKeywords = {
      'barn-doors': ['barn doors', 'sliding doors', 'rustic doors'],
      'closet-doors': ['closet doors', 'wardrobe doors', 'custom closets'],
      'hardware': ['door hardware', 'track systems', 'sliding hardware'],
      'track-systems': ['track systems', 'sliding tracks', 'door tracks'],
      'handles': ['door handles', 'cabinet pulls', 'hardware'],
      'accessories': ['door accessories', 'hardware accessories', 'door parts']
    };
    
    return [
      ...baseKeywords,
      ...(categoryKeywords[category] || []),
      productName.toLowerCase()
    ].join(', ');
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async generateProducts() {
    console.log('🏭 Generating product database...');
    
    if (!this.harvestedData?.harvested) {
      console.warn('⚠️ No harvested data found');
      return;
    }
    
    // Group harvested images by category
    const imagesByCategory = {};
    this.harvestedData.harvested.forEach(image => {
      if (!imagesByCategory[image.category]) {
        imagesByCategory[image.category] = [];
      }
      imagesByCategory[image.category].push(image);
    });
    
    // Generate products for each category
    Object.entries(imagesByCategory).forEach(([category, images]) => {
      console.log(`📦 Generating products for ${category} (${images.length} images)`);
      
      images.forEach(image => {
        const product = this.generateProductFromImage(image, category);
        this.generatedProducts.push(product);
        this.stats.products_generated++;
      });
      
      this.stats.categories_processed++;
    });
    
    console.log(`✅ Generated ${this.stats.products_generated} products across ${this.stats.categories_processed} categories`);
  }

  async saveProductDatabase() {
    const database = {
      metadata: {
        generated_at: new Date().toISOString(),
        total_products: this.generatedProducts.length,
        categories: Object.keys(CONFIG.CATEGORIES),
        version: '2.0',
        source: 'PG Closets AI Content Generator'
      },
      products: this.generatedProducts,
      categories: CONFIG.CATEGORIES,
      statistics: this.stats
    };
    
    // Save main database
    const dbFile = path.join(CONFIG.OUTPUT_DIR, 'products-database.json');
    fs.writeFileSync(dbFile, JSON.stringify(database, null, 2));
    
    // Save TypeScript interfaces
    await this.generateTypeScriptInterfaces();
    
    // Save API endpoints
    await this.generateAPIEndpoints();
    
    console.log(`💾 Saved product database: ${dbFile}`);
  }

  async generateTypeScriptInterfaces() {
    const interfaces = `// Generated TypeScript interfaces for PG Closets products
// Auto-generated on ${new Date().toISOString()}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  sale_price?: number;
  currency: string;
  tax_rate: number;
  images: ProductImages;
  features: string[];
  specifications: Record<string, any>;
  availability: ProductAvailability;
  seo: ProductSEO;
  created_at: string;
  updated_at: string;
  source: ProductSource;
}

export interface ProductImages {
  main: string;
  gallery: string[];
  optimized: {
    webp: Record<string, string>;
    avif: Record<string, string>;
    jpeg: Record<string, string>;
  };
}

export interface ProductAvailability {
  in_stock: boolean;
  quantity: number;
  lead_time: number;
}

export interface ProductSEO {
  title: string;
  description: string;
  keywords: string;
}

export interface ProductSource {
  harvested_from: string;
  original_handle: string;
  generation_method: string;
}

export type ProductCategory = ${Object.keys(CONFIG.CATEGORIES).map(cat => `'${cat}'`).join(' | ')};

export interface CategoryConfig {
  name: string;
  description: string;
  price_range: [number, number];
  features: string[];
}

export const CATEGORIES: Record<ProductCategory, CategoryConfig> = ${JSON.stringify(CONFIG.CATEGORIES, null, 2)};

// Product service functions
export class ProductService {
  static getProductsByCategory(category: ProductCategory): Product[] {
    // Implementation will be added by the product service
    return [];
  }
  
  static getProductBySlug(slug: string): Product | null {
    // Implementation will be added by the product service
    return null;
  }
  
  static searchProducts(query: string): Product[] {
    // Implementation will be added by the product service
    return [];
  }
  
  static getFeaturedProducts(limit = 6): Product[] {
    // Implementation will be added by the product service
    return [];
  }
}
`;
    
    const interfacesFile = path.join(CONFIG.OUTPUT_DIR, 'product-interfaces.ts');
    fs.writeFileSync(interfacesFile, interfaces);
    console.log(`📝 Generated TypeScript interfaces: ${interfacesFile}`);
  }

  async generateAPIEndpoints() {
    // Products API endpoint
    const productsAPI = `import { NextRequest, NextResponse } from 'next/server';
import productsData from '@/lib/generated/products-database.json';
import type { Product } from '@/lib/generated/product-interfaces';

const products: Product[] = productsData.products;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  let filteredProducts = products;
  
  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  // Search functionality
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.features.some(f => f.toLowerCase().includes(searchLower))
    );
  }
  
  // Pagination
  const total = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(offset, offset + limit);
  
  return NextResponse.json({
    products: paginatedProducts,
    pagination: {
      total,
      limit,
      offset,
      has_more: offset + limit < total
    },
    metadata: {
      generated_at: productsData.metadata.generated_at,
      total_products: productsData.metadata.total_products
    }
  });
}`;
    
    const apiFile = path.join(CONFIG.API_DIR, 'route.ts');
    fs.writeFileSync(apiFile, productsAPI);
    this.stats.api_endpoints_created++;
    
    // Individual product API
    const productAPI = `import { NextRequest, NextResponse } from 'next/server';
import productsData from '@/lib/generated/products-database.json';
import type { Product } from '@/lib/generated/product-interfaces';

const products: Product[] = productsData.products;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const product = products.find(p => p.slug === params.slug);
  
  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }
  
  // Get related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  return NextResponse.json({
    product,
    related_products: relatedProducts
  });
}`;
    
    const productDir = path.join(CONFIG.API_DIR, '[slug]');
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }
    
    const productFile = path.join(productDir, 'route.ts');
    fs.writeFileSync(productFile, productAPI);
    this.stats.api_endpoints_created++;
    
    console.log(`🔌 Generated ${this.stats.api_endpoints_created} API endpoints`);
  }

  async run() {
    await this.init();
    
    console.log('🔄 Starting content generation...');
    
    await this.generateProducts();
    await this.saveProductDatabase();
    
    console.log('\n🎉 Content generation complete!');
    console.log(`📊 Results: ${this.stats.products_generated} products, ${this.stats.api_endpoints_created} API endpoints`);
    
    return this.stats;
  }
}

// Export for use as module
module.exports = ContentGenerator;

// Run if called directly
if (require.main === module) {
  const generator = new ContentGenerator();
  generator.run().catch(console.error);
}