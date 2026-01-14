#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration from environment variables
const CONFIG = {
  shopifyDomain: process.env.SHOPIFY_STORE_DOMAIN,
  adminToken: process.env.SHOPIFY_ADMIN_TOKEN,
  apiVersion: process.env.SHOPIFY_API_VERSION || '2024-07',
  baseUrl: null,
  imageBaseUrl: process.env.IMAGE_BASE_URL || null
};

// Initialize Shopify API base URL
if (CONFIG.shopifyDomain) {
  CONFIG.baseUrl = `https://${CONFIG.shopifyDomain}/admin/api/${CONFIG.apiVersion}`;
}

// Rate limiting and retry configuration
const RATE_LIMIT = {
  maxRetries: 3,
  retryDelay: 1000,
  batchSize: 10,
  requestDelay: 500
};

class ShopifyImporter {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.updateExisting = options.updateExisting || false;
    this.batchSize = options.batchSize || RATE_LIMIT.batchSize;
    this.importMap = new Map();
    this.stats = {
      total: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 0
    };
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeRequest(url, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': CONFIG.adminToken
    };

    const requestOptions = {
      ...options,
      headers: { ...defaultHeaders, ...options.headers }
    };

    let lastError;
    for (let attempt = 0; attempt < RATE_LIMIT.maxRetries; attempt++) {
      try {
        if (this.dryRun) {
          console.log(`[DRY RUN] Would make request to: ${url}`);
          console.log(`[DRY RUN] Method: ${requestOptions.method || 'GET'}`);
          if (requestOptions.body) {
            console.log(`[DRY RUN] Body: ${requestOptions.body.substring(0, 200)}...`);
          }
          return { ok: true, data: { id: `dry-run-${Date.now()}` } };
        }

        const response = await fetch(url, requestOptions);

        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || RATE_LIMIT.retryDelay;
          console.log(`Rate limited. Waiting ${retryAfter}ms before retry...`);
          await this.delay(parseInt(retryAfter));
          continue;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        await this.delay(RATE_LIMIT.requestDelay);
        return { ok: true, data };

      } catch (error) {
        lastError = error;
        if (attempt < RATE_LIMIT.maxRetries - 1) {
          console.log(`Request failed (attempt ${attempt + 1}/${RATE_LIMIT.maxRetries}): ${error.message}`);
          await this.delay(RATE_LIMIT.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError;
  }

  async uploadFile(fileData) {
    try {
      // First, create a staged upload
      const stagedUploadMutation = `
        mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
          stagedUploadsCreate(input: $input) {
            stagedTargets {
              url
              resourceUrl
              parameters {
                name
                value
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const stagedUploadInput = {
        filename: fileData.filename,
        mimeType: fileData.type,
        resource: "FILE"
      };

      const stagedUploadResult = await this.makeGraphQLRequest(stagedUploadMutation, {
        input: [stagedUploadInput]
      });

      if (stagedUploadResult.data.stagedUploadsCreate.userErrors.length > 0) {
        throw new Error(`Staged upload error: ${stagedUploadResult.data.stagedUploadsCreate.userErrors[0].message}`);
      }

      const stagedTarget = stagedUploadResult.data.stagedUploadsCreate.stagedTargets[0];

      // If not dry run, we would upload the file to the staged URL here
      if (!this.dryRun) {
        // In a real implementation, you would fetch the file content and upload it
        console.log(`Would upload file to: ${stagedTarget.url}`);
      }

      // Create the file object in Shopify
      const fileCreateMutation = `
        mutation fileCreate($files: [FileCreateInput!]!) {
          fileCreate(files: $files) {
            files {
              id
              resourceUrl
              alt
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const fileCreateInput = {
        originalSource: this.dryRun ? 'dry-run-url' : stagedTarget.resourceUrl,
        contentType: "FILE"
      };

      const fileResult = await this.makeGraphQLRequest(fileCreateMutation, {
        files: [fileCreateInput]
      });

      if (fileResult.data.fileCreate.userErrors.length > 0) {
        throw new Error(`File create error: ${fileResult.data.fileCreate.userErrors[0].message}`);
      }

      return fileResult.data.fileCreate.files[0];

    } catch (error) {
      console.error(`Error uploading file ${fileData.filename}:`, error.message);
      return null;
    }
  }

  async makeGraphQLRequest(query, variables = {}) {
    const url = `${CONFIG.baseUrl}/graphql.json`;
    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify({ query, variables })
    });
  }

  async checkProductExists(handle, sku) {
    try {
      const query = `
        query getProductByHandle($handle: String!) {
          productByHandle(handle: $handle) {
            id
            handle
            variants(first: 250) {
              edges {
                node {
                  id
                  sku
                }
              }
            }
          }
        }
      `;

      const result = await this.makeGraphQLRequest(query, { handle });
      return result.data.productByHandle;
    } catch (error) {
      console.error(`Error checking product existence:`, error.message);
      return null;
    }
  }

  async createProduct(productData) {
    try {
      console.log(`Creating product: ${productData.title}`);

      // Upload files first
      const uploadedFiles = [];
      if (productData.files && productData.files.length > 0) {
        for (const file of productData.files) {
          const uploadedFile = await this.uploadFile(file);
          if (uploadedFile) {
            uploadedFiles.push(uploadedFile);
          }
        }
      }

      // Prepare product input for GraphQL
      const productInput = {
        title: productData.title,
        descriptionHtml: this.formatDescription(productData.description),
        handle: productData.handle,
        productType: productData.product_type,
        vendor: productData.vendor,
        tags: productData.tags.join(', '),
        status: productData.status.toUpperCase(),
        seo: {
          title: productData.seo?.title,
          description: productData.seo?.description
        },
        options: productData.options.map(option => ({
          name: option.name,
          values: option.values.map(value => ({ name: value }))
        })),
        variants: productData.variants.map(variant => ({
          sku: variant.sku,
          price: variant.price.toString(),
          compareAtPrice: variant.compare_at_price ? variant.compare_at_price.toString() : null,
          inventoryQuantities: [{
            availableQuantity: variant.inventory_quantity,
            locationId: "gid://shopify/Location/1" // Default location
          }],
          inventoryPolicy: productData.inventory.inventory_policy.toUpperCase(),
          requiresShipping: variant.requires_shipping,
          taxable: variant.taxable,
          weight: variant.weight,
          weightUnit: "KILOGRAMS",
          options: [variant.option1, variant.option2, variant.option3].filter(Boolean)
        })),
        images: productData.images.map(image => ({
          src: image.src,
          altText: image.alt
        })),
        metafields: [
          ...productData.metafields.map(field => ({
            namespace: field.namespace,
            key: field.key,
            value: field.value,
            type: field.type
          })),
          // Add file references as metafields
          ...uploadedFiles.map((file, index) => ({
            namespace: 'docs',
            key: productData.files[index].name.toLowerCase().replace(/\s+/g, '_'),
            value: file.id,
            type: 'file_reference'
          }))
        ]
      };

      const mutation = `
        mutation productCreate($input: ProductInput!) {
          productCreate(input: $input) {
            product {
              id
              handle
              title
              variants(first: 250) {
                edges {
                  node {
                    id
                    sku
                  }
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const result = await this.makeGraphQLRequest(mutation, { input: productInput });

      if (result.data.productCreate.userErrors.length > 0) {
        throw new Error(`Product creation error: ${result.data.productCreate.userErrors[0].message}`);
      }

      const product = result.data.productCreate.product;
      this.recordImport(productData, product);
      this.stats.created++;

      console.log(`✅ Created product: ${product.title} (ID: ${product.id})`);
      return product;

    } catch (error) {
      console.error(`❌ Error creating product ${productData.title}:`, error.message);
      this.stats.errors++;
      return null;
    }
  }

  async updateProduct(existingProduct, productData) {
    if (!this.updateExisting) {
      console.log(`⏩ Skipping existing product: ${productData.title}`);
      this.stats.skipped++;
      return existingProduct;
    }

    try {
      console.log(`Updating product: ${productData.title}`);

      const productInput = {
        id: existingProduct.id,
        title: productData.title,
        descriptionHtml: this.formatDescription(productData.description),
        productType: productData.product_type,
        vendor: productData.vendor,
        tags: productData.tags.join(', '),
        seo: {
          title: productData.seo?.title,
          description: productData.seo?.description
        }
      };

      const mutation = `
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              handle
              title
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const result = await this.makeGraphQLRequest(mutation, { input: productInput });

      if (result.data.productUpdate.userErrors.length > 0) {
        throw new Error(`Product update error: ${result.data.productUpdate.userErrors[0].message}`);
      }

      this.stats.updated++;
      console.log(`✅ Updated product: ${productData.title}`);
      return result.data.productUpdate.product;

    } catch (error) {
      console.error(`❌ Error updating product ${productData.title}:`, error.message);
      this.stats.errors++;
      return null;
    }
  }

  formatDescription(description) {
    // Convert plain text description to basic HTML
    if (!description) return '';

    return `<div class="product-description">
      <p>${description}</p>
    </div>`;
  }

  recordImport(productData, shopifyProduct) {
    const importRecord = {
      sourceId: productData.id,
      sourceHandle: productData.handle,
      sourceSku: productData.sku,
      shopifyProductId: shopifyProduct.id,
      shopifyHandle: shopifyProduct.handle,
      variants: {}
    };

    // Map variants
    shopifyProduct.variants.edges.forEach((edge, index) => {
      const variant = edge.node;
      const sourceVariant = productData.variants[index];
      if (sourceVariant) {
        importRecord.variants[sourceVariant.id] = {
          sourceVariantId: sourceVariant.id,
          sourceSku: sourceVariant.sku,
          shopifyVariantId: variant.id,
          shopifySku: variant.sku
        };
      }
    });

    this.importMap.set(productData.id, importRecord);
  }

  async processProducts(products) {
    console.log(`\\n🚀 Starting import of ${products.length} products...`);
    console.log(`📋 Configuration:`);
    console.log(`   - Dry Run: ${this.dryRun}`);
    console.log(`   - Update Existing: ${this.updateExisting}`);
    console.log(`   - Batch Size: ${this.batchSize}`);
    console.log(`   - Shopify Domain: ${CONFIG.shopifyDomain}`);

    for (let i = 0; i < products.length; i += this.batchSize) {
      const batch = products.slice(i, i + this.batchSize);
      console.log(`\\n📦 Processing batch ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(products.length / this.batchSize)}`);

      for (const product of batch) {
        this.stats.total++;

        // Check if product exists
        const existingProduct = await this.checkProductExists(product.handle, product.sku);

        if (existingProduct) {
          await this.updateProduct(existingProduct, product);
        } else {
          await this.createProduct(product);
        }
      }

      // Delay between batches
      if (i + this.batchSize < products.length) {
        console.log(`⏳ Waiting ${RATE_LIMIT.requestDelay}ms before next batch...`);
        await this.delay(RATE_LIMIT.requestDelay);
      }
    }
  }

  async saveImportMap() {
    const mapData = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      imports: Object.fromEntries(this.importMap)
    };

    const outputPath = path.resolve(__dirname, '../../renin_js_crawl_all/metadata/shopify_import_map.json');
    await fs.writeFile(outputPath, JSON.stringify(mapData, null, 2));
    console.log(`\\n💾 Import map saved to: ${outputPath}`);
  }

  printStats() {
    console.log(`\\n📊 Import Statistics:`);
    console.log(`   Total Products: ${this.stats.total}`);
    console.log(`   Created: ${this.stats.created}`);
    console.log(`   Updated: ${this.stats.updated}`);
    console.log(`   Skipped: ${this.stats.skipped}`);
    console.log(`   Errors: ${this.stats.errors}`);
    console.log(`   Success Rate: ${((this.stats.created + this.stats.updated) / this.stats.total * 100).toFixed(1)}%`);
  }
}

async function loadProductData() {
  const dataPath = path.resolve(__dirname, '../../renin_js_crawl_all/metadata/products_detailed_filtered.json');

  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const parsed = JSON.parse(data);
    return parsed.products || [];
  } catch (error) {
    console.error(`❌ Error loading product data: ${error.message}`);
    process.exit(1);
  }
}

function validateConfig() {
  const required = ['shopifyDomain', 'adminToken'];
  const missing = required.filter(key => !CONFIG[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error(`\\nRequired environment variables:`);
    console.error(`  SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com`);
    console.error(`  SHOPIFY_ADMIN_TOKEN=your_admin_api_token`);
    console.error(`  SHOPIFY_API_VERSION=2024-07 (optional, defaults to 2024-07)`);
    console.error(`  IMAGE_BASE_URL=https://cdn.yourdomain.com/renin (optional)`);
    process.exit(1);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    updateExisting: args.includes('--update-existing'),
    batchSize: 10
  };

  const batchSizeIndex = args.findIndex(arg => arg === '--batch-size');
  if (batchSizeIndex !== -1 && args[batchSizeIndex + 1]) {
    options.batchSize = parseInt(args[batchSizeIndex + 1]) || 10;
  }

  return options;
}

async function main() {
  console.log('🛍️  Renin Shopify Importer v1.0\\n');

  const options = parseArgs();

  if (!options.dryRun) {
    validateConfig();
  }

  const products = await loadProductData();
  console.log(`📂 Loaded ${products.length} products from data file`);

  const importer = new ShopifyImporter(options);

  try {
    await importer.processProducts(products);
    await importer.saveImportMap();
    importer.printStats();

    console.log(`\\n✅ Import completed successfully!`);

    if (options.dryRun) {
      console.log(`\\n💡 This was a dry run. Use without --dry-run to perform actual import.`);
    }

  } catch (error) {
    console.error(`\\n❌ Import failed:`, error.message);
    process.exit(1);
  }
}

// Run the importer
main().catch(console.error);