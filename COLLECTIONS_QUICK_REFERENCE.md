# Collections Pages - Quick Reference Guide

## URLs & Routes

| URL | Description | Features |
|-----|-------------|----------|
| `/collections` | Collections index | All 5 categories overview |
| `/collections/barn-doors` | Barn Doors | Sliding barn doors & hardware |
| `/collections/bifold-doors` | Bifold Doors | Space-saving folding doors |
| `/collections/glass-doors` | Glass Doors | Frosted & clear glass designs |
| `/collections/hardware` | Hardware | Tracks, handles, accessories |
| `/collections/bypass-doors` | Bypass Doors | Classic sliding closet doors |

## File Locations

```
📁 Project Root
│
├── 📁 app/(shop)/collections/
│   ├── 📄 page.tsx                         ← Collections index page
│   └── 📁 [category]/
│       ├── 📄 page.tsx                     ← Dynamic category page ⭐
│       └── 📄 not-found.tsx                ← 404 handler
│
├── 📁 lib/data/
│   └── 📄 categories.ts                    ← Category metadata ⭐
│
└── 📁 components/ (reused existing)
    ├── 📁 products/
    │   ├── 📄 product-card.tsx
    │   ├── 📄 product-filters.tsx
    │   └── 📄 product-sort.tsx
    └── 📁 shared/
        └── 📄 pagination.tsx
```

## Category Data Structure

```typescript
interface CategoryData {
  slug: string              // URL slug
  name: string             // Display name
  title: string            // Page title
  description: string      // Hero description
  heroImage: string        // Hero background image
  metaTitle: string        // SEO title
  metaDescription: string  // SEO description
  keywords: string[]       // SEO keywords
}
```

## Page Components Breakdown

### Category Page (`/collections/[category]/page.tsx`)

```
┌─────────────────────────────────────────┐
│         CATEGORY HERO                    │
│  ┌────────────────────────────────┐    │
│  │  Background Image              │    │
│  │  Home > Collections > Category │    │
│  │  Category Title                │    │
│  │  Description Text              │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  PRODUCTS SECTION                        │
│  ┌──────────┐  ┌────────────────────┐  │
│  │ SIDEBAR  │  │  SORT CONTROLS     │  │
│  │          │  ├────────────────────┤  │
│  │ Filters  │  │ ┌──┐  ┌──┐  ┌──┐  │  │
│  │ • Price  │  │ │P1│  │P2│  │P3│  │  │
│  │ • Stock  │  │ └──┘  └──┘  └──┘  │  │
│  │          │  │ ┌──┐  ┌──┐  ┌──┐  │  │
│  │          │  │ │P4│  │P5│  │P6│  │  │
│  │          │  │ └──┘  └──┘  └──┘  │  │
│  │          │  ├────────────────────┤  │
│  │          │  │  PAGINATION        │  │
│  └──────────┘  └────────────────────┘  │
└─────────────────────────────────────────┘
```

## Query Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `sort` | string | `price-asc` | Sort order |
| `page` | number | `2` | Current page |
| `minPrice` | number | `100` | Min price filter |
| `maxPrice` | number | `500` | Max price filter |
| `inStock` | boolean | `true` | Show in-stock only |
| `limit` | number | `48` | Items per page |

## Sort Options

- `featured` - Featured products first (default)
- `newest` - Newest products first
- `price-asc` - Price: Low to High
- `price-desc` - Price: High to Low
- `name-asc` - Name: A to Z
- `name-desc` - Name: Z to A

## Key Functions

### From `/lib/data/categories.ts`

```typescript
// Get category data by slug
getCategoryData(slug: string): CategoryData | null

// Get all category slugs (for static generation)
getAllCategorySlugs(): string[]

// Check if category slug is valid
isValidCategory(slug: string): boolean
```

## SEO Features

### Each category page includes:
- ✅ Dynamic title tag
- ✅ Meta description
- ✅ Keywords meta tag
- ✅ OpenGraph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Semantic HTML structure
- ✅ Breadcrumb navigation
- ✅ Alt text for images

## Responsive Breakpoints

| Screen Size | Grid Columns | Sidebar |
|-------------|--------------|---------|
| Mobile (<640px) | 1 column | Drawer (hidden) |
| Tablet (640-1024px) | 2 columns | Drawer (hidden) |
| Desktop (>1024px) | 3 columns | Visible sidebar |

## Color Scheme (Apple UI)

```css
Primary: #0071e3 (Apple Blue)
Hover: #0077ed
Background: #ffffff / #000000 (dark mode)
Text: #1d1d1f / #f5f5f7 (dark mode)
Border: #d2d2d7 / #424245 (dark mode)
```

## Component Props

### ProductCard
```typescript
{
  product: {
    id: string
    name: string
    slug: string
    price: number
    salePrice?: number
    images: string[]
    inStock: boolean
    category?: { name: string }
    rating?: number
    reviewCount?: number
  }
}
```

### ProductFilters
```typescript
{
  categories?: FilterOption[]  // Optional, auto-fetched
  className?: string
}
```

### Pagination
```typescript
{
  currentPage: number
  totalPages: number
  itemsPerPage?: number
  className?: string
}
```

## Database Schema (Relevant Fields)

### Category Table
```prisma
model Category {
  id          String
  name        String
  slug        String    @unique
  description String?
  image       String?
  products    Product[]
}
```

### Product Table
```prisma
model Product {
  id          String
  name        String
  slug        String     @unique
  price       Decimal
  salePrice   Decimal?
  images      String[]
  categoryId  String
  category    Category
  inStock     Boolean
  featured    Boolean
  bestseller  Boolean
}
```

## Common Tasks

### Add a New Category
1. Add entry to `CATEGORY_DATA` in `/lib/data/categories.ts`
2. Add hero image to `/public/images/`
3. Category page auto-generates via `[category]` route

### Update Category Metadata
Edit the category object in `/lib/data/categories.ts`

### Change Products Per Page
Default is 24. Users can change via dropdown (12, 24, 48, 96)

### Customize Filter Options
Edit `ProductFilters` component or pass custom props

## Performance Tips

1. **Images:** All use Next.js Image component (auto-optimized)
2. **Queries:** Parallel fetching with `Promise.all()`
3. **Pagination:** Limited results per query
4. **Static Generation:** Pages can be pre-rendered at build time

## Testing Commands

```bash
# Build project
npm run build

# Run development server
npm run dev

# Type checking
npx tsc --noEmit

# Access pages
http://localhost:3000/collections
http://localhost:3000/collections/barn-doors
http://localhost:3000/collections/bifold-doors
```

## Troubleshooting

### Category not found?
- Check slug matches exactly in `CATEGORY_DATA`
- Verify database has matching category with products

### Products not showing?
- Check database has products with `categoryId`
- Verify category slug in database matches URL

### Filters not working?
- Check URL params are being passed correctly
- Verify `searchParams` prop is received

### Images not loading?
- Verify image path in `CATEGORY_DATA`
- Check image exists in `/public/images/`

---

**Built by Agent 20 | PG Closets Rebuild Team**
