#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GenericProductProcessor {
  constructor(options = {}) {
    this.outputFormat = options.outputFormat || 'csv';
    this.validateOnly = options.validateOnly || false;
    this.includeImages = options.includeImages !== false;
    this.stats = {
      total: 0,
      valid: 0,
      invalid: 0,
      exported: 0
    };
  }

  async loadProductData() {
    const dataPath = path.resolve(__dirname, '../../renin_js_crawl_all/metadata/products_detailed_filtered.json');

    try {
      const data = await fs.readFile(dataPath, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.products || [];
    } catch (error) {
      console.error(`❌ Error loading product data: ${error.message}`);
      return [];
    }
  }

  validateProduct(product) {
    const errors = [];

    // Required fields validation
    if (!product.id) errors.push('Missing product ID');
    if (!product.title) errors.push('Missing product title');
    if (!product.handle) errors.push('Missing product handle');
    if (!product.variants || !Array.isArray(product.variants) || product.variants.length === 0) {
      errors.push('Missing or empty variants array');
    }

    // Validate variants
    if (product.variants) {
      product.variants.forEach((variant, index) => {
        if (!variant.sku) errors.push(`Variant ${index + 1}: Missing SKU`);
        if (typeof variant.price !== 'number') errors.push(`Variant ${index + 1}: Invalid price`);
      });
    }

    // Validate images
    if (this.includeImages && (!product.images || !Array.isArray(product.images))) {
      errors.push('Missing or invalid images array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  formatProductForCSV(product) {
    const variants = product.variants || [];
    const images = product.images || [];
    const metafields = product.metafields || [];

    return variants.map((variant, index) => {
      const baseProduct = {
        'Handle': product.handle,
        'Title': index === 0 ? product.title : '', // Only show title on first variant
        'Body (HTML)': index === 0 ? this.formatDescription(product.description) : '',
        'Vendor': product.vendor || 'Renin',
        'Product Category': product.product_type || 'Door',
        'Type': product.product_type || 'Door',
        'Tags': (product.tags || []).join(', '),
        'Published': product.status === 'active' ? 'TRUE' : 'FALSE',
        'Option1 Name': product.options?.[0]?.name || 'Size',
        'Option1 Value': variant.option1 || '',
        'Option2 Name': product.options?.[1]?.name || 'Finish',
        'Option2 Value': variant.option2 || '',
        'Option3 Name': product.options?.[2]?.name || 'Hardware',
        'Option3 Value': variant.option3 || '',
        'Variant SKU': variant.sku,
        'Variant Grams': Math.round((variant.weight || 20) * 1000), // Convert kg to grams
        'Variant Inventory Tracker': 'shopify',
        'Variant Inventory Qty': variant.inventory_quantity || 50,
        'Variant Inventory Policy': 'deny',
        'Variant Fulfillment Service': 'manual',
        'Variant Price': variant.price,
        'Variant Compare At Price': variant.compare_at_price || '',
        'Variant Requires Shipping': variant.requires_shipping !== false ? 'TRUE' : 'FALSE',
        'Variant Taxable': variant.taxable !== false ? 'TRUE' : 'FALSE',
        'Variant Barcode': variant.barcode || '',
        'Image Src': images[0]?.src || '',
        'Image Position': '1',
        'Image Alt Text': images[0]?.alt || product.title,
        'Gift Card': 'FALSE',
        'SEO Title': product.seo?.title || product.title,
        'SEO Description': product.seo?.description || product.description?.substring(0, 160),
        'Google Shopping / Google Product Category': 'Home & Garden > Decor > Window Treatments',
        'Google Shopping / AdWords Grouping': 'Closet Doors',
        'Google Shopping / AdWords Labels': (product.tags || []).join(', '),
        'Google Shopping / Condition': 'New',
        'Google Shopping / Custom Product': 'TRUE',
        'Google Shopping / Custom Label 0': product.product_type || 'Door',
        'Google Shopping / Custom Label 1': variant.option1 || '',
        'Google Shopping / Custom Label 2': variant.option2 || '',
        'Google Shopping / Custom Label 3': variant.option3 || '',
        'Google Shopping / Custom Label 4': 'CAD',
        'Variant Image': variant.image?.src || '',
        'Variant Weight Unit': 'kg',
        'Variant Tax Code': '',
        'Cost per item': variant.cost || '',
        'Status': product.status || 'active'
      };

      // Add metafields as additional columns
      metafields.forEach(field => {
        const key = `Metafield: ${field.namespace}.${field.key}`;
        baseProduct[key] = field.value;
      });

      return baseProduct;
    });
  }

  formatProductForJSON(product) {
    return {
      id: product.id,
      handle: product.handle,
      title: product.title,
      description: product.description,
      vendor: product.vendor || 'Renin',
      product_type: product.product_type || 'Door',
      tags: product.tags || [],
      status: product.status || 'active',
      options: product.options || [],
      variants: (product.variants || []).map(variant => ({
        id: variant.id,
        sku: variant.sku,
        title: variant.title || variant.option1,
        price: variant.price,
        compare_at_price: variant.compare_at_price,
        weight: variant.weight,
        weight_unit: 'kg',
        inventory_quantity: variant.inventory_quantity || 50,
        requires_shipping: variant.requires_shipping !== false,
        taxable: variant.taxable !== false,
        option1: variant.option1,
        option2: variant.option2,
        option3: variant.option3,
        image: variant.image
      })),
      images: product.images || [],
      metafields: product.metafields || [],
      seo: product.seo || {}
    };
  }

  formatDescription(description) {
    if (!description) return '';

    // Convert to basic HTML if it's plain text
    if (!description.includes('<')) {
      return `<p>${description}</p>`;
    }

    return description;
  }

  formatCSVValue(value) {
    if (value === null || value === undefined) return '';

    const stringValue = String(value);

    // Escape quotes and wrap in quotes if contains comma, newline, or quote
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }

  async exportToCSV(products) {
    const allRows = [];
    const headers = new Set();

    // Process all products to get all possible headers
    products.forEach(product => {
      const csvRows = this.formatProductForCSV(product);
      csvRows.forEach(row => {
        Object.keys(row).forEach(key => headers.add(key));
        allRows.push(row);
      });
    });

    const headerArray = Array.from(headers).sort();

    // Create CSV content
    const csvLines = [
      headerArray.map(h => this.formatCSVValue(h)).join(','),
      ...allRows.map(row =>
        headerArray.map(header => this.formatCSVValue(row[header] || '')).join(',')
      )
    ];

    return csvLines.join('\n');
  }

  async exportToJSON(products) {
    const processedProducts = products.map(product => this.formatProductForJSON(product));

    return JSON.stringify({
      exported_at: new Date().toISOString(),
      total_products: products.length,
      total_variants: products.reduce((sum, p) => sum + (p.variants?.length || 0), 0),
      products: processedProducts
    }, null, 2);
  }

  async processProducts() {
    console.log('🔄 Generic Product Processor v1.0\n');

    const products = await this.loadProductData();
    console.log(`📂 Loaded ${products.length} products from data file`);

    if (products.length === 0) {
      console.log('❌ No products found to process');
      return;
    }

    // Validate products
    console.log('\n🔍 Validating product data...');
    const validProducts = [];
    const invalidProducts = [];

    products.forEach(product => {
      this.stats.total++;
      const validation = this.validateProduct(product);

      if (validation.isValid) {
        validProducts.push(product);
        this.stats.valid++;
      } else {
        invalidProducts.push({ product, errors: validation.errors });
        this.stats.invalid++;
      }
    });

    // Report validation results
    console.log(`✅ Valid products: ${this.stats.valid}`);
    console.log(`❌ Invalid products: ${this.stats.invalid}`);

    if (invalidProducts.length > 0) {
      console.log('\n⚠️  Validation errors:');
      invalidProducts.slice(0, 5).forEach(({ product, errors }) => {
        console.log(`   ${product.title || product.id}: ${errors.join(', ')}`);
      });
      if (invalidProducts.length > 5) {
        console.log(`   ... and ${invalidProducts.length - 5} more products with errors`);
      }
    }

    if (this.validateOnly) {
      console.log('\n📊 Validation complete (validate-only mode)');
      return;
    }

    if (validProducts.length === 0) {
      console.log('❌ No valid products to export');
      return;
    }

    // Export data
    console.log(`\n📤 Exporting ${validProducts.length} valid products to ${this.outputFormat.toUpperCase()}...`);

    let outputContent;
    let outputExtension;

    switch (this.outputFormat.toLowerCase()) {
      case 'csv':
        outputContent = await this.exportToCSV(validProducts);
        outputExtension = 'csv';
        break;
      case 'json':
        outputContent = await this.exportToJSON(validProducts);
        outputExtension = 'json';
        break;
      default:
        throw new Error(`Unsupported output format: ${this.outputFormat}`);
    }

    // Save to file
    const outputPath = path.resolve(__dirname, `../../renin_processed_products.${outputExtension}`);
    await fs.writeFile(outputPath, outputContent, 'utf8');

    this.stats.exported = validProducts.length;

    console.log(`✅ Export completed successfully!`);
    console.log(`📄 Output saved to: ${outputPath}`);

    this.printStats();
  }

  printStats() {
    console.log('\n📊 Processing Statistics:');
    console.log(`   Total Products: ${this.stats.total}`);
    console.log(`   Valid Products: ${this.stats.valid}`);
    console.log(`   Invalid Products: ${this.stats.invalid}`);
    console.log(`   Exported Products: ${this.stats.exported}`);
    console.log(`   Success Rate: ${((this.stats.valid / this.stats.total) * 100).toFixed(1)}%`);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  // Parse format option
  const formatIndex = args.findIndex(arg => arg === '--format');
  if (formatIndex !== -1 && args[formatIndex + 1]) {
    options.outputFormat = args[formatIndex + 1];
  }

  // Parse flags
  options.validateOnly = args.includes('--validate-only');
  options.includeImages = !args.includes('--no-images');

  return options;
}

function showUsage() {
  console.log('🔄 Generic Product Processor Usage:');
  console.log('');
  console.log('node generic_product_processor.mjs [options]');
  console.log('');
  console.log('Options:');
  console.log('  --format <format>    Output format: csv, json (default: csv)');
  console.log('  --validate-only      Only validate data, don\'t export');
  console.log('  --no-images          Exclude image validation and data');
  console.log('  --help               Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  node generic_product_processor.mjs --format csv');
  console.log('  node generic_product_processor.mjs --format json');
  console.log('  node generic_product_processor.mjs --validate-only');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    showUsage();
    return;
  }

  const options = parseArgs();
  const processor = new GenericProductProcessor(options);

  try {
    await processor.processProducts();
  } catch (error) {
    console.error(`\n❌ Processing failed:`, error.message);
    process.exit(1);
  }
}

// Run the processor
main().catch(console.error);