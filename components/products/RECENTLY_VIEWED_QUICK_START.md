# Recently Viewed Products - Quick Start

## 🚀 2-Minute Setup

### Step 1: Track Views on Product Page

```tsx
// app/(shop)/products/[slug]/page.tsx (or similar)
'use client'

import { useEffect } from 'react'
import { useTrackProductView } from '@/components/products'

export function ProductViewTracker({ product }) {
  const { trackView } = useTrackProductView()

  useEffect(() => {
    return trackView({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: product.images[0],
    })
  }, [product.id])

  return null
}
```

### Step 2: Display on Homepage

```tsx
// app/page.tsx
import { RecentlyViewed } from '@/components/products'

export default function HomePage() {
  return (
    <>
      {/* Your content */}
      <RecentlyViewed />
    </>
  )
}
```

## 📋 Common Use Cases

### Product Detail Page
```tsx
<RecentlyViewed
  title="You Recently Viewed"
  maxItems={4}
  variant="grid"
  className="bg-gray-50"
/>
```

### Homepage
```tsx
<RecentlyViewed
  title="Continue Where You Left Off"
  maxItems={6}
  variant="grid"
/>
```

### Sidebar
```tsx
import { RecentlyViewedCompact } from '@/components/products'

<RecentlyViewedCompact maxItems={3} />
```

### Horizontal Scroll (Mobile)
```tsx
<RecentlyViewed
  maxItems={10}
  variant="horizontal"
/>
```

## 🎨 Props Cheatsheet

### RecentlyViewed
- `title?: string` - Default: "Recently Viewed"
- `maxItems?: number` - Default: 6
- `variant?: "grid" | "horizontal"` - Default: "grid"
- `showClearButton?: boolean` - Default: true
- `className?: string`

### RecentlyViewedCompact
- `maxItems?: number` - Default: 4
- `className?: string`

## 🔧 Direct Store Access

```tsx
import { useRecentlyViewedStore } from '@/lib/stores/recently-viewed-store'

const { products, addProduct, removeProduct, clearAll } = useRecentlyViewedStore()
```

## 📁 File Locations

```
/home/user/pgclosets-store/
├── lib/stores/recently-viewed-store.ts        (Store)
└── components/products/recently-viewed.tsx    (Components)
```

## 🧪 Test It

Add demo to a test page:

```tsx
// app/test/page.tsx
import { RecentlyViewedDemo } from '@/components/products/recently-viewed-demo'

export default function TestPage() {
  return <RecentlyViewedDemo />
}
```

## 💡 Tips

- Component auto-hides when empty ✓
- SSR safe (client-side only) ✓
- localStorage persists across sessions ✓
- Max 10 products auto-maintained ✓
- Duplicates auto-deduplicated ✓

## 📖 Full Documentation

See detailed docs:
- `/home/user/pgclosets-store/components/products/RECENTLY_VIEWED_USAGE.md`
- `/home/user/pgclosets-store/components/products/INTEGRATION_EXAMPLE.tsx`
- `/home/user/pgclosets-store/RECENTLY_VIEWED_FEATURE_SUMMARY.md`
