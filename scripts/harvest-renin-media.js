#!/usr/bin/env node

/**
 * Renin Media Harvest Script
 * Comprehensive extraction of ALL Renin product media from pgclosets-store-main
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = '/Users/spencercarroll/pgclosets-store-main';
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'data/renin-media-harvest');
const INVENTORY_FILE = path.join(PROJECT_ROOT, 'data/renin-media-inventory.json');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const mediaInventory = {
  harvestDate: new Date().toISOString(),
  projectPath: PROJECT_ROOT,
  summary: {
    totalImages: 0,
    totalProducts: 0,
    totalDatabases: 0,
    totalComponents: 0
  },
  images: {
    arcat: [],
    public: [],
    placeholder: []
  },
  databases: [],
  components: [],
  cdn: {
    homeDepot: [],
    external: []
  },
  products: []
};

// Function to scan directory for images
function scanDirectory(dir, category) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && file !== 'node_modules' && file !== '.next') {
        scanDirectory(fullPath, category);
      } else if (stat.isFile() && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file)) {
        if (file.toLowerCase().includes('renin') || fullPath.includes('arcat')) {
          const relativePath = fullPath.replace(PROJECT_ROOT, '');
          const imageInfo = {
            filename: file,
            path: relativePath,
            fullPath: fullPath,
            size: stat.size,
            extension: path.extname(file),
            category: category
          };
          
          if (fullPath.includes('arcat')) {
            mediaInventory.images.arcat.push(imageInfo);
          } else if (file.includes('placeholder') || file.includes('api/placeholder')) {
            mediaInventory.images.placeholder.push(imageInfo);
          } else {
            mediaInventory.images.public.push(imageInfo);
          }
          
          mediaInventory.summary.totalImages++;
        }
      }
    });
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
}

// Function to load and parse JSON databases
function loadDatabases() {
  const dbFiles = [
    'data/renin-products-database.json',
    'data/enhanced-renin-database.json',
    'lib/renin-products-database.json',
    'lib/enhanced-renin-database.json',
    'renin-products-database.json',
    'enhanced-renin-database.json'
  ];
  
  dbFiles.forEach(dbPath => {
    const fullPath = path.join(PROJECT_ROOT, dbPath);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const data = JSON.parse(content);
        
        mediaInventory.databases.push({
          path: dbPath,
          fullPath: fullPath,
          productCount: data.products?.length || 0,
          size: fs.statSync(fullPath).size,
          hasImages: data.products?.some(p => p.images || p.image || p.arcatImages) || false
        });
        
        mediaInventory.summary.totalDatabases++;
        
        // Extract product data
        if (data.products) {
          data.products.forEach(product => {
            const productInfo = {
              id: product.id,
              name: product.name,
              slug: product.slug,
              category: product.category,
              images: []
            };
            
            // Collect all image references
            if (product.image) productInfo.images.push(product.image);
            if (product.images) productInfo.images.push(...product.images);
            if (product.arcatImages) productInfo.images.push(...product.arcatImages);
            if (product.homeDepotImage) {
              mediaInventory.cdn.homeDepot.push({
                productId: product.id,
                url: product.homeDepotImage
              });
            }
            
            if (productInfo.images.length > 0) {
              mediaInventory.products.push(productInfo);
              mediaInventory.summary.totalProducts++;
            }
          });
        }
      } catch (error) {
        console.error(`Error loading ${dbPath}:`, error.message);
      }
    }
  });
}

// Function to find TypeScript product files
function findProductComponents() {
  const componentFiles = [
    'data/renin-products.ts',
    'lib/renin-products.ts',
    'lib/enhanced-renin-products.ts',
    'enhanced-renin-products.ts',
    'renin-products.ts'
  ];
  
  componentFiles.forEach(compPath => {
    const fullPath = path.join(PROJECT_ROOT, compPath);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      mediaInventory.components.push({
        path: compPath,
        fullPath: fullPath,
        size: stat.size,
        type: 'TypeScript Product Data'
      });
      mediaInventory.summary.totalComponents++;
    }
  });
  
  // Find React components
  const reactComponents = [
    'components/gallery/renin-product-gallery.tsx',
    'components/visualizer/renin-door-visualizer.tsx',
    'components/quote/renin-quote-form.tsx'
  ];
  
  reactComponents.forEach(compPath => {
    const fullPath = path.join(PROJECT_ROOT, compPath);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      mediaInventory.components.push({
        path: compPath,
        fullPath: fullPath,
        size: stat.size,
        type: 'React Component'
      });
      mediaInventory.summary.totalComponents++;
    }
  });
}

// Main execution
console.log('🔍 Starting Renin Media Harvest...\n');

console.log('📸 Scanning for images...');
scanDirectory(path.join(PROJECT_ROOT, 'public'), 'public');

console.log('📚 Loading databases...');
loadDatabases();

console.log('🧩 Finding components...');
findProductComponents();

// Generate summary statistics
console.log('\n📊 Harvest Summary:');
console.log(`   Total Images: ${mediaInventory.summary.totalImages}`);
console.log(`   - ARCAT Images: ${mediaInventory.images.arcat.length}`);
console.log(`   - Public Images: ${mediaInventory.images.public.length}`);
console.log(`   - Placeholder Images: ${mediaInventory.images.placeholder.length}`);
console.log(`   Total Products: ${mediaInventory.summary.totalProducts}`);
console.log(`   Total Databases: ${mediaInventory.summary.totalDatabases}`);
console.log(`   Total Components: ${mediaInventory.summary.totalComponents}`);
console.log(`   Home Depot CDN Links: ${mediaInventory.cdn.homeDepot.length}`);

// Save inventory
fs.writeFileSync(INVENTORY_FILE, JSON.stringify(mediaInventory, null, 2));
console.log(`\n✅ Inventory saved to: ${INVENTORY_FILE}`);

// Create organized folder structure
const categories = ['barn', 'bypass', 'bifold', 'pivot', 'glass', 'hardware', 'accessories'];
categories.forEach(cat => {
  const catDir = path.join(OUTPUT_DIR, cat);
  if (!fs.existsSync(catDir)) {
    fs.mkdirSync(catDir, { recursive: true });
  }
});

console.log(`📁 Organized folder structure created at: ${OUTPUT_DIR}`);

// Generate report
const reportPath = path.join(PROJECT_ROOT, 'data/renin-media-harvest-report.md');
let report = `# Renin Media Harvest Report\n\n`;
report += `**Harvest Date:** ${new Date().toISOString()}\n\n`;
report += `## Summary\n\n`;
report += `- **Total Images:** ${mediaInventory.summary.totalImages}\n`;
report += `- **ARCAT Images:** ${mediaInventory.images.arcat.length}\n`;
report += `- **Public Images:** ${mediaInventory.images.public.length}\n`;
report += `- **Total Products:** ${mediaInventory.summary.totalProducts}\n`;
report += `- **Databases Found:** ${mediaInventory.summary.totalDatabases}\n`;
report += `- **Components Found:** ${mediaInventory.summary.totalComponents}\n\n`;

report += `## Image Locations\n\n`;
report += `### ARCAT Directory\n`;
report += `\`/public/images/arcat/\` - ${mediaInventory.images.arcat.length} files\n\n`;

report += `### Product Databases\n\n`;
mediaInventory.databases.forEach(db => {
  report += `- \`${db.path}\` - ${db.productCount} products, ${(db.size / 1024).toFixed(2)} KB\n`;
});

report += `\n### Components\n\n`;
mediaInventory.components.forEach(comp => {
  report += `- \`${comp.path}\` - ${comp.type}\n`;
});

report += `\n## Product Coverage\n\n`;
report += `Total unique products with media: ${mediaInventory.products.length}\n\n`;

report += `## CDN Resources\n\n`;
report += `- Home Depot CDN links: ${mediaInventory.cdn.homeDepot.length}\n\n`;

report += `## Next Steps\n\n`;
report += `1. Review \`renin-media-inventory.json\` for complete details\n`;
report += `2. Organized folders created in \`data/renin-media-harvest/\`\n`;
report += `3. All product data preserved in databases\n`;

fs.writeFileSync(reportPath, report);
console.log(`📄 Report generated at: ${reportPath}\n`);

console.log('✨ Harvest complete!\n');
