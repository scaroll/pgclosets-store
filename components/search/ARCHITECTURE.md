# Search System Architecture

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                      SearchPage                         │
│  (Main orchestrator - combines all components)          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │         InstantSearch                         │      │
│  │  - Real-time search                           │      │
│  │  - Autocomplete dropdown                      │      │
│  │  - Recent searches                            │      │
│  │  - Keyboard navigation                        │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
│  ┌─────────────────┬──────────────────────────────┐   │
│  │                 │                              │   │
│  │ AdvancedFilters │    Main Content Area         │   │
│  │                 │                              │   │
│  │ - Type filter   │  ┌────────────────────────┐  │   │
│  │ - Style filter  │  │   SortOptions          │  │   │
│  │ - Color filter  │  │  - Dropdown menu       │  │   │
│  │ - Size filter   │  │  - 8 sort options      │  │   │
│  │ - Material      │  └────────────────────────┘  │   │
│  │ - Features      │                              │   │
│  │ - Price range   │  ┌────────────────────────┐  │   │
│  │ - In stock      │  │   SearchResults        │  │   │
│  │                 │  │                        │  │   │
│  │ Active Filters: │  │  ┌──────┬──────┬────┐ │  │   │
│  │ [Badge] [Badge] │  │  │ Card │ Card │ .. │ │  │   │
│  │                 │  │  ├──────┼──────┼────┤ │  │   │
│  │ [Clear All]     │  │  │ Card │ Card │ .. │ │  │   │
│  │                 │  │  └──────┴──────┴────┘ │  │   │
│  │                 │  │                        │  │   │
│  │                 │  │  [Pagination: 1 2 3..] │  │   │
│  │                 │  └────────────────────────┘  │   │
│  └─────────────────┴──────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Input (Search/Filter/Sort)
        ↓
    SearchPage (State Management)
        ↓
    ┌───┴────┬──────────┬─────────┐
    ↓        ↓          ↓         ↓
Search   Filters     Sort    Pagination
Query    State       Value    State
    ↓        ↓          ↓         ↓
    └────────┴──────────┴─────────┘
                ↓
        Product Filtering Logic
                ↓
        Sorted & Paginated Results
                ↓
           SearchResults
                ↓
          Product Cards
```

## State Management

```typescript
SearchPage Component State:
├── searchQuery: string
├── filters: FilterValues {
│   ├── types: string[]
│   ├── styles: string[]
│   ├── colors: string[]
│   ├── sizes: string[]
│   ├── priceRange: [number, number]
│   ├── materials: string[]
│   ├── features: string[]
│   └── inStock?: boolean
├── sortValue: string
├── currentPage: number
└── showFilters: boolean (mobile)
```

## Component Dependencies

```
SearchPage
├── InstantSearch
│   ├── ui/input
│   ├── ui/button
│   ├── lucide-react (icons)
│   └── use-debounce (hook)
├── AdvancedFilters
│   ├── ui/accordion
│   ├── ui/checkbox
│   ├── ui/slider
│   ├── ui/badge
│   ├── ui/sheet (mobile)
│   ├── ui/button
│   └── lucide-react (icons)
├── SortOptions
│   ├── ui/dropdown-menu
│   ├── ui/button
│   └── lucide-react (icons)
└── SearchResults
    ├── ui/toggle-group
    ├── ui/button
    ├── lucide-react (icons)
    └── next/image
```

## Filter Processing Pipeline

```
Raw Products
     ↓
1. Extract Filter Options
   (types, styles, colors, sizes, materials, features)
     ↓
2. Apply Search Query
   (filter by title, description, collection)
     ↓
3. Apply Multi-Select Filters
   (AND logic within category, OR across categories)
     ↓
4. Apply Range Filters
   (price range)
     ↓
5. Apply Boolean Filters
   (in stock, featured)
     ↓
6. Apply Sorting
   (relevance, price, name, date)
     ↓
7. Apply Pagination
   (slice results by page)
     ↓
Displayed Products
```

## Search Relevance Algorithm

```typescript
Relevance Score Calculation:
├── Title match:           +10 points
│   └── Starts with query: +5 bonus
├── SKU exact match:       +15 points
├── Category match:        +5 points
└── Description match:     +2 points

Sort by total score (descending)
```

## Mobile Responsiveness

```
Desktop (≥1024px):
┌──────────────────────────────────┐
│  [InstantSearch...............]  │
│                                  │
│  ┌────────┬─────────────────┐   │
│  │Filters │   Results       │   │
│  │Sidebar │   Grid (4 col)  │   │
│  │        │   [Sort]        │   │
│  └────────┴─────────────────┘   │
└──────────────────────────────────┘

Tablet (768px-1023px):
┌──────────────────────────────────┐
│  [InstantSearch...............]  │
│                                  │
│  ┌────────┬─────────────────┐   │
│  │Filters │   Results       │   │
│  │Sidebar │   Grid (3 col)  │   │
│  │        │   [Sort]        │   │
│  └────────┴─────────────────┘   │
└──────────────────────────────────┘

Mobile (<768px):
┌────────────────────┐
│ [InstantSearch...] │
│                    │
│ [Filters] [Sort]   │
│                    │
│ Results Grid       │
│ (1 column)         │
│                    │
│ Sheet Drawer →     │
│ (Filters in modal) │
└────────────────────┘
```

## Performance Optimization

```
Optimization Layer:
├── React.memo
│   ├── ProductCard
│   ├── FilterSection
│   └── PaginationButton
├── React.useMemo
│   ├── filterOptions (computed once)
│   ├── filteredProducts (only when filters change)
│   ├── sortedProducts (only when sort changes)
│   └── paginatedProducts (only when page changes)
├── React.useCallback
│   ├── handleFilterChange
│   ├── handleSortChange
│   └── handlePageChange
├── useDebounce
│   └── searchQuery (300ms delay)
└── Image Optimization
    ├── Next.js Image component
    ├── Lazy loading
    └── Responsive sizes
```

## Event Flow

```
User Actions → Component State → Re-render → Updated UI

Example: Filter Change
1. User clicks checkbox
     ↓
2. handleCheckboxChange()
     ↓
3. setFilters() updates state
     ↓
4. useMemo recomputes filteredProducts
     ↓
5. SearchResults re-renders
     ↓
6. User sees updated results
```

## Accessibility Tree

```
Search Page
├── region: Search
│   ├── textbox: Search input
│   └── listbox: Results dropdown
├── region: Filters
│   ├── group: Type Filter
│   │   └── checkbox: Bypass Doors
│   ├── group: Style Filter
│   │   └── checkbox: Modern
│   └── slider: Price Range
├── combobox: Sort Options
│   └── listbox: Sort menu
└── region: Results
    ├── navigation: Pagination
    └── grid: Products
        └── article: Product Card
```

## File Dependencies

```
components/search/
├── InstantSearch.tsx
│   ├── → lib/hooks/use-debounce
│   └── → components/ui/{input, button}
├── AdvancedFilters.tsx
│   └── → components/ui/{accordion, checkbox, slider, badge, sheet, button}
├── SortOptions.tsx
│   └── → components/ui/{dropdown-menu, button}
├── SearchResults.tsx
│   └── → components/ui/{toggle-group, button}
├── SearchPage.tsx
│   ├── → InstantSearch
│   ├── → AdvancedFilters
│   ├── → SortOptions
│   ├── → SearchResults
│   └── → lib/hooks/use-debounce
└── index.ts
    └── (exports all components)
```

## Type System

```typescript
// Core Types
Product
├── id: string
├── title: string
├── description: string
├── handle: string
├── thumbnail?: string
├── collection?: { title: string }
├── variants: ProductVariant[]
├── tags?: string[]
├── createdAt?: string
└── availableForSale?: boolean

FilterValues
├── types: string[]
├── styles: string[]
├── colors: string[]
├── sizes: string[]
├── priceRange: [number, number]
├── materials: string[]
├── features: string[]
└── inStock?: boolean

SortOption
├── value: string
└── label: string
```

## Integration Points

```
Search System
├── Product Data Source
│   └── lib/actions/commerce
│       └── getProducts()
├── Type Definitions
│   └── types/commerce
│       └── Product, ProductVariant
├── UI Components
│   └── components/ui/*
│       └── shadcn/ui components
├── Layout
│   └── components/layout/StandardLayout
└── Utilities
    ├── lib/utils (cn, formatPrice)
    └── lib/hooks/use-debounce
```

## Deployment Architecture

```
Production Setup:
├── Server Components (Next.js 15)
│   └── app/products/search/page.tsx
│       └── Fetches products on server
├── Client Components
│   └── components/search/*
│       └── Interactive UI
├── Static Assets
│   └── Product images (Next.js Image)
│       └── CDN optimized
└── State Management
    └── React useState/useMemo
        └── Client-side only
```

## Scaling Considerations

```
For Large Datasets (1000+ products):
├── Implement virtual scrolling
├── Add server-side filtering
├── Use database indexes
├── Implement search indexing
├── Add caching layer
└── Consider Algolia/Meilisearch
```

---

This architecture provides a scalable, maintainable, and performant search system that can handle PG Closets' current needs and future growth.
