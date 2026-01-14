# PG Closets - Renin Store Importer

This is a [Next.js](https://nextjs.org) project with a comprehensive Renin catalog import system for Shopify.

## 🛍️ Renin Product Data System

This repository includes a complete, production-ready generic product data processor for the Renin catalog with 151+ filtered products, variants, images, and documentation.

### ✨ Features

- **Generic Export System**: CSV and JSON export formats for any e-commerce platform
- **Comprehensive Product Data**: 151 filtered products with variants, options, and pricing
- **Image Management**: High-resolution 1600px images with CDN support
- **Data Validation**: Built-in validation and error reporting
- **Multiple Formats**: CSV (e-commerce ready) and JSON (API ready)
- **Flexible Output**: Configurable validation and export options
- **Quality Assurance**: Comprehensive product data validation
- **Platform Agnostic**: Works with any e-commerce system

## 📋 Prerequisites

### System Requirements

- Node.js 20+ with ES Modules support
- No external dependencies required
- Works with any e-commerce platform

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Validate Product Data

```bash
# Validate all product data without exporting
node tools/renin_ingest/generic_product_processor.mjs --validate-only
```

### 3. Export to CSV (E-commerce Ready)

```bash
# Export to CSV format for e-commerce platforms
node tools/renin_ingest/generic_product_processor.mjs --format csv
```

### 4. Export to JSON (API Ready)

```bash
# Export to structured JSON for APIs or custom systems
node tools/renin_ingest/generic_product_processor.mjs --format json
```

### 5. Advanced Options

```bash
# Validation only mode
node tools/renin_ingest/generic_product_processor.mjs --validate-only

# Export without image data
node tools/renin_ingest/generic_product_processor.mjs --format csv --no-images

# Show help and all options
node tools/renin_ingest/generic_product_processor.mjs --help
```

## 📂 Data Structure

```
renin_js_crawl_all/
├── metadata/
│   ├── products_detailed_filtered.json    # Primary data source (151 products)
│   ├── products_detailed_normalized.json  # Alternative format
│   ├── store_report.md                     # Quality assessment
│   ├── store_ready_validation.md          # Import checklist
│   └── shopify_import_map.json            # Generated after import
├── images_resized/                         # 1600px optimized images
│   ├── 176732/
│   │   ├── heritage-barn-door-natural.jpg
│   │   └── heritage-barn-door-detail.jpg
│   └── 176733/
└── docs/                                   # PDF manuals and specs
    ├── heritage/
    │   ├── installation-manual.pdf
    │   └── specifications.pdf
    └── continental/
```

## 🛠️ Available Tools

### Generic Product Processor

```bash
# Basic usage - export to CSV
node tools/renin_ingest/generic_product_processor.mjs

# Available options:
--format <format>      # Output format: csv, json (default: csv)
--validate-only        # Only validate data, don't export
--no-images            # Exclude image validation and data
--help                 # Show usage information
```

### CDN Image Rewriter

```bash
# Rewrite image URLs to use CDN
node tools/renin_ingest/rewrite_images_for_cdn.mjs \
  --image-base-url https://cdn.yourdomain.com/renin

# Optional parameters:
--input store_ready_products.csv          # Source CSV file
--output store_ready_products.cdn.csv     # Output file
```

## 📊 Processing Results

After processing, you'll see statistics like:

```
📊 Processing Statistics:
   Total Products: 2
   Valid Products: 2
   Invalid Products: 0
   Exported Products: 2
   Success Rate: 100.0%
```

### Output Files

**CSV Export** (`renin_processed_products.csv`):
- E-commerce ready format with all product variants
- Includes: Handle, Title, Variants, Options, Pricing, Images, SEO data
- Compatible with most e-commerce platforms
- Metafields included as separate columns

**JSON Export** (`renin_processed_products.json`):
```json
{
  "exported_at": "2024-09-17T22:00:00.000Z",
  "total_products": 2,
  "total_variants": 6,
  "products": [
    {
      "id": "renin-176732",
      "handle": "heritage-barn-door-176732",
      "title": "Heritage Collection Barn Door",
      "variants": [...],
      "images": [...],
      "metafields": [...]
    }
  ]
}
```

## 🔧 Troubleshooting

### Common Issues

**Data File Not Found**
```bash
❌ Error loading product data: ENOENT: no such file or directory
```
- Ensure `renin_js_crawl_all/metadata/products_detailed_filtered.json` exists
- Check file permissions and accessibility
- Verify you're running from the correct directory

**Validation Errors**
```bash
❌ Invalid products: 5
```
- Review validation errors in output
- Check for missing required fields (id, title, handle, variants)
- Ensure all variants have valid SKUs and prices
- Verify image arrays are properly formatted

**Export Failures**
```bash
❌ Processing failed: Unsupported output format
```
- Use supported formats: csv, json
- Check command line arguments with `--help`
- Ensure sufficient disk space for output files

**Permission Errors**
```bash
❌ Error: EACCES: permission denied
```
- Check file system permissions for output directory
- Ensure Node.js has write access to the project directory
- Run with appropriate user permissions

### Validation Checklist

Before exporting:

- [ ] Product data file exists and is accessible
- [ ] Node.js 20+ installed with ES modules support
- [ ] Sufficient disk space for export files
- [ ] Write permissions for output directory
- [ ] Validation check passes without errors
- [ ] Images URLs are accessible (if including images)

## 🎯 Advanced Usage

### Custom Data Mapping

To modify product mapping, edit the `createProduct` function in `shopify_import.mjs`:

```javascript
const productInput = {
  title: productData.title,
  descriptionHtml: this.formatDescription(productData.description),
  handle: productData.handle,
  // Add custom fields here
  metafields: [
    ...productData.metafields,
    // Add custom metafields
    {
      namespace: 'custom',
      key: 'import_source',
      value: 'renin_catalog',
      type: 'single_line_text_field'
    }
  ]
};
```

### Bulk Operations

For large catalogs (500+ products), consider using Shopify's Bulk Operations:

```javascript
// Example bulk operation setup
const bulkOperation = `
  mutation bulkOperationRunMutation($mutation: String!, $stagedUploadPath: String!) {
    bulkOperationRunMutation(mutation: $mutation, stagedUploadPath: $stagedUploadPath) {
      bulkOperation {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;
```

### Webhook Integration

Set up webhooks to monitor import progress:

```bash
# Monitor product creation
curl -X POST \
  https://yourstore.myshopify.com/admin/api/2024-07/webhooks.json \
  -H "X-Shopify-Access-Token: $SHOPIFY_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook": {
      "topic": "products/create",
      "address": "https://yourapp.com/webhooks/products/create",
      "format": "json"
    }
  }'
```

## 📚 Resources

- [Shopify Admin API Documentation](https://shopify.dev/docs/api/admin)
- [GraphQL Admin API Reference](https://shopify.dev/docs/api/admin-graphql)
- [Product Import Best Practices](https://shopify.dev/docs/apps/products)
- [File Upload API Guide](https://shopify.dev/docs/api/admin-graphql/2024-07/mutations/fileCreate)

## 🤝 Support

For issues with the importer:

1. Check the troubleshooting section above
2. Review Shopify API documentation
3. Validate your data with dry-run mode
4. Check import logs for specific error messages

---

## Next.js Development

### Getting Started

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
