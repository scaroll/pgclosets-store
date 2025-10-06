# DIVISION 2: QUICKSTART GUIDE

## 🚀 Quick Execution

```bash
# Full catalog scraping (500+ products)
npm run division2:execute

# Test run (10 products only)
npm run division2:test

# Clean previous data
npm run division2:clean
```

## 📋 What Gets Created

After execution, you'll have:

### 1. Product Data Files
```
data/renin/
├── RENIN_PRODUCTS.json          # 500+ products with full data
├── renin-products.ts            # TypeScript import-ready
├── renin-migration.sql          # PostgreSQL schema
├── renin-products.csv           # Spreadsheet format
└── DIVISION_2_CATALOG_INTEGRATION.md
```

### 2. Product Images
```
public/products/renin/
├── barn-doors/                  # Original high-res images
│   ├── continental-product-001.jpg
│   ├── continental-lifestyle-001.jpg
│   └── ...
├── bypass/
├── bifold/
└── optimized/                   # WebP optimized versions
    ├── continental/
    │   ├── main-2400w.webp
    │   ├── main-1200w.webp
    │   ├── main-800w.webp
    │   └── main-400w.webp
    └── ...
```

## 🎯 What You Get

### Complete Product Data
Each product includes:
- ✅ Full product information (name, description, SKU)
- ✅ All size variants (48", 60", 72", etc.)
- ✅ All finish options (White, Oak, Gray, etc.)
- ✅ Pricing for all combinations
- ✅ 3-6 high-quality images per product
- ✅ SEO metadata (title, description, keywords)
- ✅ Categories and tags
- ✅ Features and specifications

### Example Product Object
```json
{
  "id": "renin-arrivee",
  "name": "Arrivée",
  "slug": "arrivee",
  "category": "Bypass",
  "subcategory": "Sliding Closet Doors",
  "description": "Space-saving bypass closet door with smooth operation...",
  "shortDescription": "Space-saving bypass door with smooth glide",
  "price": 449,
  "sku": "RENIN-ARRIVEE",

  "sizes": [
    { "size": "48\"x80\"", "width": 48, "height": 80, "unit": "inches", "priceModifier": 0, "inStock": true },
    { "size": "60\"x80\"", "width": 60, "height": 80, "unit": "inches", "priceModifier": 50, "inStock": true },
    { "size": "72\"x80\"", "width": 72, "height": 80, "unit": "inches", "priceModifier": 100, "inStock": true }
  ],

  "finishes": [
    { "name": "White", "hexCode": "#FFFFFF", "priceModifier": 0, "inStock": true },
    { "name": "Natural Oak", "priceModifier": 25, "inStock": true },
    { "name": "Gray", "priceModifier": 25, "inStock": true }
  ],

  "images": [
    {
      "url": "https://www.renin.com/wp-content/uploads/arrivee-main.jpg",
      "localPath": "/products/renin/optimized/arrivee/main-1200w.webp",
      "type": "product",
      "alt": "Arrivée bypass closet door in white",
      "width": 1200,
      "height": 1600,
      "optimized": true
    }
  ],

  "seoTitle": "Arrivée White Bypass Door 48x80 | Renin | PG Closets",
  "seoDescription": "Premium Arrivée bypass closet door. Space-saving sliding design. Available in 48\", 60\", 72\". Free shipping in Ottawa.",
  "seoKeywords": ["bypass closet door", "sliding door", "renin doors"],

  "features": [
    "Space-saving bypass design",
    "Smooth glide operation",
    "Easy installation",
    "Premium quality"
  ],

  "specifications": {
    "Type": "Bypass Sliding",
    "Material": "MDF",
    "Finish": "Painted",
    "Hardware": "Included",
    "Installation": "Professional recommended"
  },

  "tags": ["modern", "space-saving", "closet", "bypass"],
  "collections": ["Renin Collection", "Modern Doors"],

  "sourceUrl": "https://www.renin.com/en-ca/sliding-doors/arrivee/",
  "extractedAt": "2025-10-05T12:00:00Z",
  "agentId": "scraper-2"
}
```

## 🔧 Using the Data

### 1. Import in Next.js Page

```typescript
// app/products/[slug]/page.tsx
import products from '@/data/renin/RENIN_PRODUCTS.json';

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug);

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.images[0].localPath} alt={product.images[0].alt} />
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  );
}
```

### 2. Import to Database

```sql
-- PostgreSQL
psql -U postgres -d pgclosets < data/renin/renin-migration.sql
```

### 3. Use with Prisma

```typescript
// Import products to Prisma
import products from '@/data/renin/RENIN_PRODUCTS.json';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importProducts() {
  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        description: product.description,
        price: product.price,
        sku: product.sku,
        // ... rest of fields
      },
    });
  }
}

importProducts();
```

### 4. Display Images

```tsx
// components/ProductImage.tsx
import Image from 'next/image';

export function ProductImage({ product }) {
  return (
    <Image
      src={product.images[0].localPath}
      alt={product.images[0].alt}
      width={1200}
      height={1600}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={85}
    />
  );
}
```

## ⏱️ Execution Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Phase 1 | 10-15 min | Scrape 500+ products |
| Phase 2 | 15-20 min | Download 2000+ images |
| Phase 3 | 5 min | Normalize data |
| Phase 4 | 5 min | Process variants |
| Phase 5 | 3 min | Calculate pricing |
| Phase 6 | 3 min | Generate SEO |
| Phase 7 | 2 min | Categorize |
| Phase 8 | 10-15 min | Optimize images |
| Phase 9 | 2 min | Export database |
| **TOTAL** | **30-45 min** | **Complete execution** |

## 📊 Progress Monitoring

Watch real-time progress:

```bash
# Terminal 1: Run Division 2
npm run division2:execute

# Terminal 2: Monitor logs
tail -f logs/division2-*.log

# Terminal 3: Watch file system
watch -n 5 'du -sh data/renin public/products/renin'
```

## 🎨 Product Categories

You'll get products in these categories:

1. **Barn Doors** (~100 products)
   - Traditional Barn
   - Modern Barn
   - Rustic Barn

2. **Bypass/Sliding** (~200 products)
   - Closet Doors
   - Room Dividers
   - Pantry Doors

3. **Bifold** (~100 products)
   - Closet Bifold
   - Accordion Doors

4. **Pivot Doors** (~50 products)

5. **Mirror Doors** (~50 products)
   - Full Mirror
   - Partial Mirror

## 🔍 Quality Checks

After execution, verify:

```bash
# Count products
jq '. | length' data/renin/RENIN_PRODUCTS.json

# Count images
find public/products/renin -type f -name "*.webp" | wc -l

# Check for errors
grep "ERROR" logs/division2-*.log

# Verify all products have images
jq '[.[] | select(.images | length == 0)] | length' data/renin/RENIN_PRODUCTS.json
```

Expected output:
```
Products: 500+
Images: 2000+
Errors: < 5%
Missing images: 0
```

## 🚨 Troubleshooting

### Issue: "Module not found: playwright"
```bash
npm install playwright
npx playwright install chromium
```

### Issue: Rate limiting errors
```bash
# Edit lib/renin-scraper.ts
# Increase rateLimit: 5000 (5 seconds)
```

### Issue: Out of memory
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run division2:execute
```

### Issue: Incomplete data
```bash
# Re-run specific phase
npm run division2:phase1  # Re-scrape products
npm run division2:phase2  # Re-download images
```

## 📞 Next Steps

1. **Review Data**: Check `RENIN_PRODUCTS.json`
2. **Verify Images**: Browse `/public/products/renin/optimized/`
3. **Import Database**: Run migration SQL
4. **Build Frontend**: Use product data in components
5. **Deploy**: Push to production

## 💡 Pro Tips

1. **Test First**: Always run `npm run division2:test` before full execution
2. **Monitor Storage**: Ensure 2GB+ free space before running
3. **Check Logs**: Review agent reports for any issues
4. **Backup Data**: Keep a copy of scraped data
5. **Update Regularly**: Re-run monthly to get latest products

---

**Ready to execute?**

```bash
npm run division2:execute
```

🚀 **Let's build that catalog!**
