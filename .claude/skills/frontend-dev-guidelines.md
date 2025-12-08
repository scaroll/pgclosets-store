# Frontend Development Guidelines

Best practices for React 19, Next.js 15, and the PG Closets frontend architecture.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **React:** Version 19
- **Styling:** TailwindCSS + shadcn/ui
- **State:** Zustand for client state, Server Components for server state
- **Forms:** react-hook-form + zod validation
- **Animation:** Framer Motion

## Component Architecture

### Server vs Client Components

```tsx
// Server Component (default) - data fetching, no interactivity
// app/products/page.tsx
export default async function ProductsPage() {
  const products = await getProducts() // Direct DB access
  return <ProductList products={products} />
}

// Client Component - interactivity required
// components/product-card.tsx
'use client'

import { useState } from 'react'

export function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  // ...
}
```

### When to Use 'use client'

Use client components for:
- Event handlers (onClick, onChange)
- useState, useEffect, useRef
- Browser APIs (localStorage, window)
- Third-party client libraries

Keep server by default for:
- Data fetching
- Static content
- SEO-critical pages
- Components without interactivity

## File Structure

```
app/
├── (admin)/          # Admin route group
│   └── admin/
│       ├── layout.tsx
│       ├── page.tsx
│       └── quotes/
├── (account)/        # Customer account route group
│   └── account/
├── api/              # API routes
├── quote-builder/    # Quote builder feature
components/
├── ui/               # shadcn/ui components
├── features/         # Feature-specific components
└── shared/           # Shared components
```

## shadcn/ui Patterns

### Using Components

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function MyForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Title</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter name" />
          </div>
          <Button type="submit">Submit</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Variants

```tsx
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

## Form Handling

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name too short')
})

type FormData = z.infer<typeof schema>

export function ContactForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    // Handle response
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <Input {...register('name')} />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
```

## Loading & Error States

### Loading UI

```tsx
// app/products/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  )
}
```

### Error Handling

```tsx
// app/products/error.tsx
'use client'

export default function Error({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="text-center p-8">
      <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
```

## Styling Patterns

### TailwindCSS Classes

```tsx
// Responsive design
<div className="p-4 md:p-6 lg:p-8">

// Conditional classes
<div className={cn(
  "p-4 rounded-lg",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>

// Dark mode
<div className="bg-white dark:bg-gray-900">
```

### cn() Utility

```tsx
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  variant?: 'default' | 'destructive'
}

export function MyComponent({ className, variant = 'default' }: Props) {
  return (
    <div className={cn(
      "base-classes",
      variant === 'destructive' && "destructive-classes",
      className
    )}>
      Content
    </div>
  )
}
```

## Data Fetching

### Server Components (Preferred)

```tsx
// Direct database access in Server Components
export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany({
    where: { status: 'SUBMITTED' },
    orderBy: { createdAt: 'desc' }
  })

  return <QuoteList quotes={quotes} />
}
```

### Client-Side (When Needed)

```tsx
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function QuoteStatus({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR(`/api/quotes/${id}`, fetcher)

  if (isLoading) return <Skeleton />
  if (error) return <Error />

  return <StatusBadge status={data.status} />
}
```

## Performance Best Practices

1. **Use Server Components** for data-heavy pages
2. **Lazy load** non-critical components
3. **Optimize images** with next/image
4. **Minimize client bundle** - keep 'use client' minimal
5. **Use Suspense** for streaming
6. **Prefetch links** for faster navigation

```tsx
import dynamic from 'next/dynamic'

// Lazy load heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false
})
```
