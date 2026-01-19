// PG Closets Product Data
// Apple-inspired product structure with emphasis on craft and storytelling

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  price: number
  craftHours: number
  images: {
    hero: string
    gallery: string[]
    lifestyle?: string
  }
  specs: {
    dimensions: string
    materials: string[]
    finishes: string[]
    weight: string
  }
  story: string
  featured: boolean
}

export const products: Product[] = [
  {
    id: 'continental',
    slug: 'continental',
    name: 'Continental',
    tagline: 'Where simplicity meets sophistication',
    price: 459,
    craftHours: 32,
    images: {
      hero: '/images/products/continental-hero.jpg',
      gallery: [
        '/images/products/continental-detail-1.jpg',
        '/images/products/continental-detail-2.jpg',
        '/images/products/continental-detail-3.jpg',
      ],
      lifestyle: '/images/products/continental-lifestyle.jpg',
    },
    specs: {
      dimensions: '80" × 24" standard',
      materials: ['Solid maple', 'Brushed steel hardware'],
      finishes: ['Natural', 'Espresso', 'Arctic White'],
      weight: '45 lbs',
    },
    story:
      'The Continental embodies the belief that true luxury lies in restraint. ' +
      'Clean lines and flawless proportions create a door that enhances any space ' +
      'without demanding attention. It simply belongs.',
    featured: true,
  },
  {
    id: 'provincial',
    slug: 'provincial',
    name: 'Provincial',
    tagline: 'Classic lines, timeless craft',
    price: 549,
    craftHours: 38,
    images: {
      hero: '/images/products/provincial-hero.jpg',
      gallery: [
        '/images/products/provincial-detail-1.jpg',
        '/images/products/provincial-detail-2.jpg',
        '/images/products/provincial-detail-3.jpg',
      ],
      lifestyle: '/images/products/provincial-lifestyle.jpg',
    },
    specs: {
      dimensions: '80" × 24" standard',
      materials: ['Quarter-sawn oak', 'Aged brass hardware'],
      finishes: ['Honey Oak', 'Walnut', 'Ebony'],
      weight: '52 lbs',
    },
    story:
      'Inspired by European craftsmanship traditions, the Provincial brings ' +
      'warmth and character to contemporary spaces. Each raised panel is shaped ' +
      'by hand, creating subtle variations that catch the light.',
    featured: true,
  },
  {
    id: 'gatsby',
    slug: 'gatsby',
    name: 'Gatsby',
    tagline: 'Art deco reimagined',
    price: 799,
    craftHours: 47,
    images: {
      hero: '/images/products/gatsby-hero.jpg',
      gallery: [
        '/images/products/gatsby-detail-1.jpg',
        '/images/products/gatsby-detail-2.jpg',
        '/images/products/gatsby-detail-3.jpg',
      ],
      lifestyle: '/images/products/gatsby-lifestyle.jpg',
    },
    specs: {
      dimensions: '80" × 24" standard',
      materials: ['Black walnut', 'Polished nickel inlays'],
      finishes: ['Midnight', 'Champagne', 'Noir'],
      weight: '58 lbs',
    },
    story:
      'The Gatsby captures the glamour of a bygone era through a distinctly ' +
      'modern lens. Geometric patterns are precision-cut and hand-finished, ' +
      'creating doors that are as much art as function.',
    featured: true,
  },
  {
    id: 'euro',
    slug: 'euro',
    name: 'Euro',
    tagline: 'Pure contemporary form',
    price: 899,
    craftHours: 52,
    images: {
      hero: '/images/products/euro-hero.jpg',
      gallery: [
        '/images/products/euro-detail-1.jpg',
        '/images/products/euro-detail-2.jpg',
        '/images/products/euro-detail-3.jpg',
      ],
      lifestyle: '/images/products/euro-lifestyle.jpg',
    },
    specs: {
      dimensions: '80" × 24" standard',
      materials: ['Engineered composite', 'Concealed aluminum track'],
      finishes: ['Matte White', 'Matte Black', 'Greige'],
      weight: '42 lbs',
    },
    story:
      'The Euro represents the pinnacle of minimalist design. Flush surfaces ' +
      'and invisible hardware create an unbroken plane of color. When closed, ' +
      'it becomes part of the wall. When open, pure possibility.',
    featured: true,
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getAllProducts(): Product[] {
  return products
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
  }).format(price)
}
