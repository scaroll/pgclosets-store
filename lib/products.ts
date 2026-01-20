// PG Closets Product Data
// Real Renin product images with Apple-inspired presentation

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
      hero: '/images/renin/barn-doors/herringbone-hero.jpg',
      gallery: [
        '/images/renin/barn-doors/herringbone-lifestyle.jpg',
        '/images/renin/barn-doors/dimensions.jpg',
      ],
      lifestyle: '/images/renin/barn-doors/herringbone-lifestyle.jpg',
    },
    specs: {
      dimensions: '84" × 36" standard',
      materials: ['Solid pine', 'Satin nickel hardware'],
      finishes: ['Grey Stain', 'Natural', 'White'],
      weight: '45 lbs',
    },
    story:
      'The Continental embodies the belief that true luxury lies in restraint. ' +
      'Clean herringbone patterns and flawless proportions create a door that ' +
      'enhances any space without demanding attention. It simply belongs.',
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
      hero: '/images/renin/barn-doors/provincial-hero.jpg',
      gallery: [
        '/images/renin/barn-doors/dimensions.jpg',
      ],
      lifestyle: '/images/renin/barn-doors/provincial-hero.jpg',
    },
    specs: {
      dimensions: '84" × 36" standard',
      materials: ['Solid wood', 'Frosted glass panels'],
      finishes: ['White', 'Espresso', 'Natural'],
      weight: '52 lbs',
    },
    story:
      'Inspired by European craftsmanship traditions, the Provincial brings ' +
      'warmth and character to contemporary spaces. Eight frosted glass lites ' +
      'diffuse natural light while maintaining privacy.',
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
      hero: '/images/renin/barn-doors/gatsby-hero.jpg',
      gallery: [
        '/images/renin/barn-doors/gatsby-detail.jpg',
        '/images/renin/barn-doors/gatsby-lifestyle.jpg',
        '/images/renin/barn-doors/gatsby-slab.jpg',
      ],
      lifestyle: '/images/renin/barn-doors/gatsby-lifestyle.jpg',
    },
    specs: {
      dimensions: '84" × 36" standard',
      materials: ['MDF core', 'Mix-and-match hardware'],
      finishes: ['Gray', 'White', 'Espresso'],
      weight: '58 lbs',
    },
    story:
      'The Gatsby captures the glamour of a bygone era through a distinctly ' +
      'modern lens. Chevron shaker panels are precision-cut and hand-finished, ' +
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
      hero: '/images/renin/closet-doors/euro-1-lite-hero.jpg',
      gallery: [
        '/images/renin/closet-doors/euro-1-lite-lifestyle.jpg',
      ],
      lifestyle: '/images/renin/closet-doors/euro-1-lite-lifestyle.jpg',
    },
    specs: {
      dimensions: '80" × 36" standard',
      materials: ['Engineered composite', 'Frosted glass'],
      finishes: ['Off-White', 'Espresso', 'Gray'],
      weight: '42 lbs',
    },
    story:
      'The Euro represents the pinnacle of minimalist design. A single frosted ' +
      'lite and clean lines create an unbroken plane of light. When closed, ' +
      'it becomes part of the wall. When open, pure possibility.',
    featured: true,
  },
  {
    id: 'stone-k',
    slug: 'stone-k',
    name: 'Stone K',
    tagline: 'Rustic meets refined',
    price: 609,
    craftHours: 40,
    images: {
      hero: '/images/renin/barn-doors/stone-k-hero.jpg',
      gallery: [
        '/images/renin/barn-doors/stone-k-detail.jpg',
        '/images/renin/barn-doors/dimensions.jpg',
      ],
      lifestyle: '/images/renin/barn-doors/stone-k-hero.jpg',
    },
    specs: {
      dimensions: '84" × 36" standard',
      materials: ['Solid wood', 'Steel hardware'],
      finishes: ['Sandstone', 'Silver Oak', 'Off-White', 'Iron Age'],
      weight: '48 lbs',
    },
    story:
      'The Stone K bridges rustic charm and modern sensibility. The classic ' +
      'K-brace design adds structural interest while the varied finish options ' +
      'allow it to complement any interior style.',
    featured: false,
  },
  {
    id: 'crochet',
    slug: 'crochet',
    name: 'Crochet',
    tagline: 'Intricate geometry',
    price: 665,
    craftHours: 44,
    images: {
      hero: '/images/renin/barn-doors/crochet-hero.jpg',
      gallery: [
        '/images/renin/barn-doors/crochet-lifestyle.jpg',
        '/images/renin/barn-doors/dimensions.jpg',
      ],
      lifestyle: '/images/renin/barn-doors/crochet-lifestyle.jpg',
    },
    specs: {
      dimensions: '84" × 36" standard',
      materials: ['MDF core', 'Mix-and-match hardware'],
      finishes: ['Graphite Gray', 'White', 'Natural'],
      weight: '50 lbs',
    },
    story:
      'The Crochet features an intricate multi-X pattern that creates visual ' +
      'depth and texture. Each intersection is precisely aligned, demonstrating ' +
      'the attention to detail that defines our craft.',
    featured: false,
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
