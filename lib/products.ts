// PG Closets Product Data
// Complete Renin product catalog with Apple-inspired presentation

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  price: number
  craftHours: number
  category: 'barn-door' | 'closet-door'
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
  // ===== BARN DOORS =====
  {
    id: 'continental',
    slug: 'continental',
    name: 'Continental',
    tagline: 'Where simplicity meets sophistication',
    price: 459,
    craftHours: 32,
    category: 'barn-door',
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
    category: 'barn-door',
    images: {
      hero: '/images/renin/barn-doors/provincial-hero.jpg',
      gallery: ['/images/renin/barn-doors/dimensions.jpg'],
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
    category: 'barn-door',
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
    id: 'sherwood',
    slug: 'sherwood',
    name: 'Sherwood',
    tagline: 'Bold geometry, refined presence',
    price: 685,
    craftHours: 42,
    category: 'barn-door',
    images: {
      hero: '/images/renin/barn-doors/sherwood-hero.jpg',
      gallery: ['/images/renin/barn-doors/dimensions.jpg'],
      lifestyle: '/images/renin/barn-doors/sherwood-hero.jpg',
    },
    specs: {
      dimensions: '84" × 36" standard',
      materials: ['Engineered wood', 'Steel hardware'],
      finishes: ['Black Brown'],
      weight: '48 lbs',
    },
    story:
      'The Sherwood features bold intersecting diagonal patterns that create ' +
      'an energetic arrow design. Pre-finished in rich Black Brown, it makes ' +
      'a statement while maintaining understated elegance.',
    featured: true,
  },
  {
    id: 'driftwood',
    slug: 'driftwood',
    name: 'Driftwood',
    tagline: 'Rustic warmth, modern soul',
    price: 685,
    craftHours: 40,
    category: 'barn-door',
    images: {
      hero: '/images/renin/barn-doors/driftwood-hero.jpg',
      gallery: ['/images/renin/barn-doors/driftwood-slab.jpg'],
      lifestyle: '/images/renin/barn-doors/driftwood-hero.jpg',
    },
    specs: {
      dimensions: '84" × 36" standard',
      materials: ['Engineered solid wood', 'Bent strap hardware'],
      finishes: ['Barnwood Oak'],
      weight: '46 lbs',
    },
    story:
      'The Driftwood delivers rustic, tactile design in a Barnwood Oak finish. ' +
      'Classic K-design pattern suits vintage farmhouse to contemporary country, ' +
      'bridging eras with effortless style.',
    featured: false,
  },
  {
    id: 'glim',
    slug: 'glim',
    name: 'Glim',
    tagline: 'Light, balanced, beautiful',
    price: 640,
    craftHours: 44,
    category: 'barn-door',
    images: {
      hero: '/images/renin/barn-doors/glim-hero.jpg',
      gallery: ['/images/renin/barn-doors/glim-slab.jpg'],
      lifestyle: '/images/renin/barn-doors/glim-hero.jpg',
    },
    specs: {
      dimensions: '84" × 36" standard',
      materials: ['Engineered wood', 'Tempered frosted glass'],
      finishes: ['Ashen White', 'Ashen Gray'],
      weight: '52 lbs',
    },
    story:
      'The Glim balances daylight with privacy through four tempered frosted ' +
      'glass inserts. Natural light flows through while maintaining the ' +
      'boundary between spaces. Preinstalled soft-close for silent operation.',
    featured: false,
  },
  {
    id: 'augusta',
    slug: 'augusta',
    name: 'Augusta',
    tagline: 'Frame within a frame',
    price: 665,
    craftHours: 41,
    category: 'barn-door',
    images: {
      hero: '/images/renin/barn-doors/augusta-hero.jpg',
      gallery: ['/images/renin/barn-doors/augusta-lifestyle.jpg'],
      lifestyle: '/images/renin/barn-doors/augusta-lifestyle.jpg',
    },
    specs: {
      dimensions: '84" × 36" standard',
      materials: ['Engineered solid wood', 'Translucent insert'],
      finishes: ['Bright White'],
      weight: '44 lbs',
    },
    story:
      'The Augusta presents a clean frame-within-a-frame of engineered solid ' +
      'wood outlining a translucent one-lite insert. Classic mullion design ' +
      'meets contemporary minimalism.',
    featured: false,
  },
  {
    id: 'sagrada',
    slug: 'sagrada',
    name: 'Sagrada',
    tagline: 'Double X, endless character',
    price: 609,
    craftHours: 39,
    category: 'barn-door',
    images: {
      hero: '/images/renin/barn-doors/sagrada-hero.jpg',
      gallery: ['/images/renin/barn-doors/sagrada-slab.jpg'],
      lifestyle: '/images/renin/barn-doors/sagrada-hero.jpg',
    },
    specs: {
      dimensions: '84" × 36" standard',
      materials: ['Engineered wood', 'Steel hardware'],
      finishes: ['Cherry', 'Gunstock Oak'],
      weight: '47 lbs',
    },
    story:
      'The Sagrada features a double X overlay capturing farmhouse aesthetics. ' +
      'Wide plank patterns and scratch-resistant wood grain finishes create ' +
      'a door that ages gracefully with your home.',
    featured: false,
  },
  {
    id: 'sussex',
    slug: 'sussex',
    name: 'Sussex',
    tagline: 'Light meets strength',
    price: 629,
    craftHours: 46,
    category: 'barn-door',
    images: {
      hero: '/images/renin/barn-doors/sussex-hero.jpg',
      gallery: ['/images/renin/barn-doors/sussex-slab.jpg'],
      lifestyle: '/images/renin/barn-doors/sussex-hero.jpg',
    },
    specs: {
      dimensions: '84" × 42" standard',
      materials: ['Engineered wood', 'Tempered frosted glass'],
      finishes: ['Silver Oak'],
      weight: '54 lbs',
    },
    story:
      'The Sussex combines three vertical tempered frosted glass inserts with ' +
      'an X-design lower panel. Natural light flows through the upper half while ' +
      'solid wood provides grounding presence below.',
    featured: false,
  },
  {
    id: 'cheval',
    slug: 'cheval',
    name: 'Cheval',
    tagline: 'Z-design, zero compromise',
    price: 609,
    craftHours: 38,
    category: 'barn-door',
    images: {
      hero: '/images/renin/barn-doors/cheval-hero.jpg',
      gallery: ['/images/renin/barn-doors/cheval-slab.jpg'],
      lifestyle: '/images/renin/barn-doors/cheval-hero.jpg',
    },
    specs: {
      dimensions: '84" × 36" standard',
      materials: ['Engineered solid wood', 'Steel hardware'],
      finishes: ['Iron Age'],
      weight: '46 lbs',
    },
    story:
      'The Cheval blends traditional beauty and strength through its classic ' +
      'Z-design pattern. Finished in sophisticated Iron Age, this door brings ' +
      'timeless character to any modern space.',
    featured: false,
  },
  {
    id: 'salinas',
    slug: 'salinas',
    name: 'Salinas',
    tagline: 'Pure pine, your palette',
    price: 659,
    craftHours: 36,
    category: 'barn-door',
    images: {
      hero: '/images/renin/barn-doors/salinas-hero.jpg',
      gallery: ['/images/renin/barn-doors/salinas-slab.jpg'],
      lifestyle: '/images/renin/barn-doors/salinas-hero.jpg',
    },
    specs: {
      dimensions: '84" × 36" or 84" × 42"',
      materials: ['100% Monterey pine', 'Steel hardware'],
      finishes: ['Ready to paint/stain'],
      weight: '50 lbs',
    },
    story:
      'The Salinas features traditional style and 100% solid pine construction ' +
      'with a minimalist Z-design. Ready to paint or stain, it becomes truly ' +
      'yours through your individualized color palette.',
    featured: false,
  },
  {
    id: 'stone-k',
    slug: 'stone-k',
    name: 'Stone K',
    tagline: 'Rustic meets refined',
    price: 609,
    craftHours: 40,
    category: 'barn-door',
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
    category: 'barn-door',
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

  // ===== CLOSET DOORS =====
  {
    id: 'euro',
    slug: 'euro',
    name: 'Euro',
    tagline: 'Pure contemporary form',
    price: 899,
    craftHours: 52,
    category: 'closet-door',
    images: {
      hero: '/images/renin/closet-doors/euro-1-lite-hero.jpg',
      gallery: ['/images/renin/closet-doors/euro-1-lite-lifestyle.jpg'],
      lifestyle: '/images/renin/closet-doors/euro-1-lite-lifestyle.jpg',
    },
    specs: {
      dimensions: '80" × 48-72" standard',
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
    id: 'euro-3-lite',
    slug: 'euro-3-lite',
    name: 'Euro 3-Lite',
    tagline: 'Triple the light, same elegance',
    price: 589,
    craftHours: 48,
    category: 'closet-door',
    images: {
      hero: '/images/renin/closet-doors/euro-3-lite-hero.jpg',
      gallery: [],
      lifestyle: '/images/renin/closet-doors/euro-3-lite-hero.jpg',
    },
    specs: {
      dimensions: '80" × 48-72" standard',
      materials: ['Engineered wood', '4mm tempered frosted glass'],
      finishes: ['Off-White'],
      weight: '44 lbs',
    },
    story:
      'The Euro 3-Lite offers translucent light transmission and privacy with ' +
      'a clean, bright, contemporary appearance. Three frosted panels create ' +
      'rhythm and visual interest while maintaining the minimalist aesthetic.',
    featured: false,
  },
  {
    id: 'harmony',
    slug: 'harmony',
    name: 'Harmony',
    tagline: 'Mirror, mirror',
    price: 539,
    craftHours: 45,
    category: 'closet-door',
    images: {
      hero: '/images/renin/closet-doors/harmony-hero.jpg',
      gallery: ['/images/renin/closet-doors/harmony-detail.jpg'],
      lifestyle: '/images/renin/closet-doors/harmony-hero.jpg',
    },
    specs: {
      dimensions: '80" × 48-72" standard',
      materials: ['Engineered wood', 'Crystal-clear mirror'],
      finishes: ['Bright White'],
      weight: '48 lbs',
    },
    story:
      'The Harmony features full-length mirrors with narrow framing for both ' +
      'traditional and modern design. Crystal-clear mirror with Safety Shield ' +
      'backing enhances spatial perception and daily functionality.',
    featured: false,
  },
  {
    id: 'twilight',
    slug: 'twilight',
    name: 'Twilight',
    tagline: 'Privacy meets illumination',
    price: 539,
    craftHours: 45,
    category: 'closet-door',
    images: {
      hero: '/images/renin/closet-doors/twilight-hero.jpg',
      gallery: ['/images/renin/closet-doors/twilight-detail.jpg'],
      lifestyle: '/images/renin/closet-doors/twilight-hero.jpg',
    },
    specs: {
      dimensions: '80" × 48-72" standard',
      materials: ['Engineered wood', '4mm tempered frosted glass'],
      finishes: ['Bright White'],
      weight: '46 lbs',
    },
    story:
      'The Twilight presents full-height frosted glass in a Bright White frame. ' +
      'Translucent glass maintains privacy while allowing soft light transmission, ' +
      'creating clean, narrow profiles with contemporary appeal.',
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

export function getProductsByCategory(
  category: 'barn-door' | 'closet-door'
): Product[] {
  return products.filter((p) => p.category === category)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
  }).format(price)
}
