export interface Product {
  id: string
  title: string
  slug: string | null
  handle: string | null
  price: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function deriveSlug(product: Product): string | null {
  if (product.slug && product.slug !== 'undefined') {
    return product.slug
  }
  if (product.handle) {
    return product.handle
  }
  if (product.title) {
    return slugify(product.title)
  }
  return null
}

export function QuickConfigureCard({ product }: { product: Product }) {
  return (
    <div>
      {/* Implementation placeholder */}
      <h3>{product.title}</h3>
    </div>
  )
}
