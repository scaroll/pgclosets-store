#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CDNImageRewriter {
  constructor(options = {}) {
    this.imageBaseUrl = options.imageBaseUrl;
    this.inputFile = options.inputFile;
    this.outputFile = options.outputFile;
    this.stats = {
      total: 0,
      rewritten: 0,
      skipped: 0,
      errors: 0
    };
  }

  parseCSV(csvContent) {
    const lines = csvContent.split('\\n');
    const headers = this.parseCSVLine(lines[0]);
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = this.parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        rows.push(row);
      }
    }

    return { headers, rows };
  }

  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);

    return values;
  }

  formatCSVLine(values) {
    return values.map(value => {
      if (value.includes(',') || value.includes('"') || value.includes('\\n')) {
        return '"' + value.replace(/"/g, '""') + '"';
      }
      return value;
    }).join(',');
  }

  rewriteImageUrl(originalUrl) {
    if (!originalUrl || !this.imageBaseUrl) {
      return originalUrl;
    }

    // Skip if already using CDN
    if (originalUrl.startsWith(this.imageBaseUrl)) {
      return originalUrl;
    }

    // Skip external URLs that aren't local images
    if (originalUrl.startsWith('http') && !originalUrl.includes('renin')) {
      return originalUrl;
    }

    // Extract filename from URL
    let filename = originalUrl;

    // Handle relative paths
    if (originalUrl.startsWith('/')) {
      filename = originalUrl.substring(1);
    }

    // Handle full URLs
    if (originalUrl.startsWith('http')) {
      try {
        const url = new URL(originalUrl);
        filename = url.pathname.substring(1);
      } catch (error) {
        console.warn(`Warning: Invalid URL format: ${originalUrl}`);
        return originalUrl;
      }
    }

    // Ensure proper path structure for Renin images
    if (filename.includes('renin_') && !filename.startsWith('products/')) {
      const match = filename.match(/renin_(\\d+)/);
      if (match) {
        const productId = match[1];
        filename = `products/${productId}/${filename}`;
      }
    }

    // Construct new CDN URL
    const cdnUrl = this.imageBaseUrl.endsWith('/')
      ? `${this.imageBaseUrl}${filename}`
      : `${this.imageBaseUrl}/${filename}`;

    return cdnUrl;
  }

  processRow(row) {
    this.stats.total++;
    let modified = false;

    // Image fields that need rewriting
    const imageFields = [
      'Image Src',
      'Variant Image'
    ];

    imageFields.forEach(field => {
      if (row[field]) {
        const originalUrl = row[field];
        const rewrittenUrl = this.rewriteImageUrl(originalUrl);

        if (rewrittenUrl !== originalUrl) {
          row[field] = rewrittenUrl;
          modified = true;
        }
      }
    });

    // Handle multiple image sources in body content
    if (row['Body (HTML)']) {
      const originalBody = row['Body (HTML)'];
      let modifiedBody = originalBody;

      // Find and replace image URLs in HTML content
      const imgRegex = /src=["']([^"']+)["']/g;
      let match;
      while ((match = imgRegex.exec(originalBody)) !== null) {
        const originalSrc = match[1];
        const rewrittenSrc = this.rewriteImageUrl(originalSrc);
        if (rewrittenSrc !== originalSrc) {
          modifiedBody = modifiedBody.replace(originalSrc, rewrittenSrc);
          modified = true;
        }
      }

      row['Body (HTML)'] = modifiedBody;
    }

    if (modified) {
      this.stats.rewritten++;
    } else {
      this.stats.skipped++;
    }

    return row;
  }

  async rewriteCSV() {
    try {
      console.log(`📂 Reading CSV file: ${this.inputFile}`);
      const csvContent = await fs.readFile(this.inputFile, 'utf8');

      console.log(`🔄 Parsing CSV content...`);
      const { headers, rows } = this.parseCSV(csvContent);

      console.log(`🖼️  Rewriting image URLs with CDN base: ${this.imageBaseUrl}`);
      const processedRows = rows.map(row => this.processRow(row));

      console.log(`💾 Writing modified CSV to: ${this.outputFile}`);

      // Reconstruct CSV
      const outputLines = [
        this.formatCSVLine(headers),
        ...processedRows.map(row => this.formatCSVLine(headers.map(header => row[header] || '')))
      ];

      await fs.writeFile(this.outputFile, outputLines.join('\\n'));

      this.printStats();
      return true;

    } catch (error) {
      console.error(`❌ Error processing CSV:`, error.message);
      this.stats.errors++;
      return false;
    }
  }

  validateImageUrls() {
    console.log(`\\n🔍 Validation suggestions:`);
    console.log(`   1. Test CDN URLs manually: ${this.imageBaseUrl}/products/176732/heritage-barn-door-natural-main.jpg`);
    console.log(`   2. Verify CDN serves images with proper CORS headers`);
    console.log(`   3. Check image file extensions are preserved correctly`);
    console.log(`   4. Ensure CDN supports HTTPS`);
    console.log(`   5. Test Shopify import with a few products first`);
  }

  printStats() {
    console.log(`\\n📊 CDN Rewrite Statistics:`);
    console.log(`   Total Rows: ${this.stats.total}`);
    console.log(`   Rows Modified: ${this.stats.rewritten}`);
    console.log(`   Rows Unchanged: ${this.stats.skipped}`);
    console.log(`   Errors: ${this.stats.errors}`);
    console.log(`   Modification Rate: ${(this.stats.rewritten / this.stats.total * 100).toFixed(1)}%`);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  const imageBaseIndex = args.findIndex(arg => arg === '--image-base-url');
  if (imageBaseIndex !== -1 && args[imageBaseIndex + 1]) {
    options.imageBaseUrl = args[imageBaseIndex + 1];
  }

  const inputIndex = args.findIndex(arg => arg === '--input');
  if (inputIndex !== -1 && args[inputIndex + 1]) {
    options.inputFile = args[inputIndex + 1];
  }

  const outputIndex = args.findIndex(arg => arg === '--output');
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    options.outputFile = args[outputIndex + 1];
  }

  return options;
}

function validateArgs(options) {
  if (!options.imageBaseUrl) {
    console.error(`❌ Missing required --image-base-url parameter`);
    console.error(`\\nUsage: node rewrite_images_for_cdn.mjs --image-base-url https://cdn.yourdomain.com/renin [--input input.csv] [--output output.csv]`);
    process.exit(1);
  }

  // Set defaults
  if (!options.inputFile) {
    options.inputFile = path.resolve(__dirname, '../../store_ready_products.csv');
  }

  if (!options.outputFile) {
    const ext = path.extname(options.inputFile);
    const base = path.basename(options.inputFile, ext);
    const dir = path.dirname(options.inputFile);
    options.outputFile = path.join(dir, `${base}.cdn${ext}`);
  }

  return options;
}

async function validateInputFile(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    console.error(`❌ Input file not found: ${filePath}`);
    console.error(`\\nPlease ensure the CSV file exists or specify a different path with --input`);
    return false;
  }
}

async function main() {
  console.log('🖼️  Renin CDN Image Rewriter v1.0\\n');

  const rawOptions = parseArgs();
  const options = validateArgs(rawOptions);

  console.log(`📋 Configuration:`);
  console.log(`   CDN Base URL: ${options.imageBaseUrl}`);
  console.log(`   Input File: ${options.inputFile}`);
  console.log(`   Output File: ${options.outputFile}`);

  if (!(await validateInputFile(options.inputFile))) {
    process.exit(1);
  }

  const rewriter = new CDNImageRewriter(options);

  try {
    const success = await rewriter.rewriteCSV();

    if (success) {
      console.log(`\\n✅ CDN rewrite completed successfully!`);
      console.log(`📄 Output saved to: ${options.outputFile}`);
      rewriter.validateImageUrls();
    } else {
      console.log(`\\n❌ CDN rewrite failed!`);
      process.exit(1);
    }

  } catch (error) {
    console.error(`\\n❌ Unexpected error:`, error.message);
    process.exit(1);
  }
}

// Run the rewriter
main().catch(console.error);