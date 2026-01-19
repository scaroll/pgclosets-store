# Renin.com Media Capture & Processing Prompt for Claude Browser

## Objective
Systematically capture, download, and format all product media from renin.com for integration into the PG Closets e-commerce store. This includes product images, specifications, descriptions, and technical documentation.

## Instructions for Claude Browser Session

### Phase 1: Site Analysis & Navigation
1. **Navigate to renin.com** and analyze the site structure
2. **Identify product categories** (doors, hardware, accessories, etc.)
3. **Map the navigation structure** and create a comprehensive sitemap
4. **Document the URL patterns** for products and categories
5. **Identify pagination systems** if any exist

### Phase 2: Product Data Collection
For each product category, systematically:

1. **Navigate through all product pages**
2. **Extract comprehensive product information:**
   - Product name and model number
   - SKU/part numbers
   - Product descriptions (short and detailed)
   - Technical specifications
   - Dimensions and measurements
   - Materials and finishes
   - Installation requirements
   - Compatibility information
   - Pricing information (if available)
   - Availability status

3. **Capture all product images:**
   - High-resolution product photos
   - Multiple angles and views
   - Detail shots and close-ups
   - Installation/lifestyle images
   - Technical diagrams
   - Color/finish variations
   - Before/after installation photos

4. **Download technical documents:**
   - Installation guides (PDF)
   - Specification sheets
   - CAD files (if available)
   - Warranty information
   - Care and maintenance guides

### Phase 3: Media Organization & Processing

For each captured item, create structured data in this format:

```json
{
  "product": {
    "id": "renin_[model_number]",
    "name": "[Product Name]",
    "brand": "Renin",
    "model": "[Model Number]",
    "sku": "[SKU]",
    "category": "[Primary Category]",
    "subcategory": "[Subcategory]",
    "description": {
      "short": "[Brief description]",
      "detailed": "[Full product description]",
      "features": ["Feature 1", "Feature 2", "..."],
      "benefits": ["Benefit 1", "Benefit 2", "..."]
    },
    "specifications": {
      "dimensions": {
        "width": "[measurement]",
        "height": "[measurement]",
        "depth": "[measurement]",
        "weight": "[weight]"
      },
      "materials": ["Material 1", "Material 2"],
      "finishes": ["Finish 1", "Finish 2"],
      "colors": ["Color 1", "Color 2"],
      "installation": "[Installation type]",
      "compatibility": ["Compatible with..."]
    },
    "media": {
      "images": {
        "primary": "path/to/primary/image.jpg",
        "gallery": [
          "path/to/image1.jpg",
          "path/to/image2.jpg",
          "path/to/image3.jpg"
        ],
        "technical": [
          "path/to/diagram1.jpg",
          "path/to/diagram2.jpg"
        ],
        "lifestyle": [
          "path/to/lifestyle1.jpg",
          "path/to/lifestyle2.jpg"
        ]
      },
      "documents": [
        "path/to/installation_guide.pdf",
        "path/to/spec_sheet.pdf"
      ]
    },
    "pricing": {
      "msrp": "[Price if available]",
      "currency": "CAD"
    },
    "availability": "[In Stock/Out of Stock/Discontinued]",
    "tags": ["tag1", "tag2", "tag3"],
    "seo": {
      "title": "[SEO optimized title]",
      "description": "[Meta description]",
      "keywords": ["keyword1", "keyword2"]
    }
  }
}
```

### Phase 4: File Organization & Naming

**Directory Structure:**
```
/renin_capture/
├── products/
│   ├── doors/
│   │   ├── barn-doors/
│   │   ├── bifold-doors/
│   │   └── sliding-doors/
│   ├── hardware/
│   │   ├── handles/
│   │   ├── tracks/
│   │   └── accessories/
│   └── components/
├── images/
│   ├── [category]/
│   │   ├── [product_id]/
│   │   │   ├── primary/
│   │   │   ├── gallery/
│   │   │   ├── technical/
│   │   │   └── lifestyle/
├── documents/
│   ├── [category]/
│   │   ├── [product_id]/
│   │   │   ├── installation/
│   │   │   ├── specifications/
│   │   │   └── warranty/
└── data/
    ├── products.json
    ├── categories.json
    └── metadata.json
```

**Naming Conventions:**
- Product IDs: `renin_[model_number]_[variant]`
- Images: `[product_id]_[type]_[number].jpg`
- Documents: `[product_id]_[doc_type].pdf`

### Phase 5: Quality Control & Validation

1. **Verify all images are high quality** (minimum 800x600, prefer 1200x1200+)
2. **Check for missing or broken links**
3. **Validate all product data is complete**
4. **Ensure consistent formatting across all entries**
5. **Test image accessibility and loading**

### Phase 6: Integration Preparation

Create integration-ready files:

1. **products_import.json** - Complete product database
2. **images_manifest.json** - All image paths and metadata
3. **category_mapping.json** - Category structure for navigation
4. **migration_script.sql** - Database insertion queries
5. **image_optimization_queue.json** - Images needing resize/optimization

### Technical Requirements

**Image Specifications:**
- Format: JPG or PNG
- Primary images: 1200x1200px minimum
- Gallery images: 800x600px minimum
- Thumbnails: 300x300px
- Technical diagrams: Original resolution
- File size: Under 2MB per image

**Data Quality Standards:**
- All required fields must be populated
- Descriptions must be unique (not copied verbatim)
- Images must be properly attributed
- Technical specifications must be accurate
- Categories must align with PG Closets taxonomy

### Expected Deliverables

1. **Complete product database** in JSON format
2. **Organized media library** with consistent naming
3. **Technical documentation** collection
4. **Category mapping** for site navigation
5. **Integration guide** with specific instructions
6. **Quality report** documenting completeness and issues

### Error Handling & Logging

- Log all failed downloads with reasons
- Document any missing or inaccessible content
- Note any copyright or usage restrictions
- Track processing time and completion rates
- Report any technical issues encountered

### Legal & Ethical Considerations

- Respect robots.txt and rate limiting
- Document source URLs for attribution
- Note any copyright restrictions
- Avoid overloading their servers
- Maintain professional standards throughout

## Post-Processing Instructions

After capture, prepare the data for PG Closets integration:

1. **Review and enhance product descriptions** for SEO optimization
2. **Categorize products** according to PG Closets taxonomy
3. **Generate pricing structure** based on MSRP and markup strategy
4. **Create cross-sell and upsell relationships**
5. **Optimize images** for web performance
6. **Generate product URLs** following PG Closets conventions

This systematic approach will ensure comprehensive capture of all Renin products while maintaining organization and quality standards suitable for professional e-commerce integration.