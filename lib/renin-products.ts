
export interface ReninProduct {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  image: string;
  sizes: string[];
  finishes: string[];
  features: string[];
  description: string;
  installTime: string;
  inStock: boolean;
  slug?: string; // Auto-generated from name
  material?: string; // For compatibility with hardware
  finish?: string; // For compatibility with hardware
  sale_price?: number; // For sales/discounts
  // Additional properties for compatibility
  style?: string;
  size?: string;
  width?: number;
  height?: number;
  thickness?: number;
  length?: number;
  weight_capacity?: number;
  images?: {
    main: string;
    gallery?: string[];
  };
}

import { arcatEnhancedProducts, arcatHardwareProducts } from './arcat-image-mapping';

const reninProductsData: ReninProduct[] = [
  {
    "id": 1,
    "sku": "BD155701",
    "name": "Euro 1-Lite Bifold",
    "category": "bifold",
    "price": 459,
    "image": "/images/arcat/renin_155701_hd.jpg",
    "sizes": [
      "48\"",
      "60\"",
      "72\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Authentic Renin Euro 1-Lite Bifold door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 2,
    "sku": "BD155731",
    "name": "Euro 3-Lite Bifold",
    "category": "bifold",
    "price": 489,
    "image": "/images/arcat/renin_155731_hd.jpg",
    "sizes": [
      "48\"",
      "60\"",
      "72\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Authentic Renin Euro 3-Lite Bifold door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 3,
    "sku": "BY155706",
    "name": "Parsons Flush Panel Bypass",
    "category": "sliding",
    "price": 519,
    "image": "/images/arcat/renin_155706_hd.jpg",
    "sizes": [
      "48\"",
      "60\"",
      "72\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Authentic Renin Parsons Flush Panel Bypass door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 4,
    "sku": "BY155725",
    "name": "Euro 1-Lite Bypass",
    "category": "sliding",
    "price": 429,
    "image": "/images/arcat/renin_155725_hd.jpg",
    "sizes": [
      "48\"",
      "60\"",
      "72\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Authentic Renin Euro 1-Lite Bypass door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 5,
    "sku": "BY155732",
    "name": "Euro 3-Lite Bypass",
    "category": "sliding",
    "price": 459,
    "image": "/images/arcat/renin_155732_hd.jpg",
    "sizes": [
      "48\"",
      "60\"",
      "72\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Authentic Renin Euro 3-Lite Bypass door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 6,
    "sku": "BR176737",
    "name": "Heritage Salinas Z-Design",
    "category": "barn",
    "price": 679,
    "image": "/images/arcat/renin_176737_hd.jpg",
    "sizes": [
      "36\"",
      "42\""
    ],
    "finishes": [
      "Natural Wood",
      "White",
      "Espresso",
      "Gray"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Authentic Renin Heritage Salinas Z-Design barn door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 7,
    "sku": "BR192861",
    "name": "Heritage Herringbone Chevron",
    "category": "barn",
    "price": 749,
    "image": "/images/arcat/renin_192861_hd.jpg",
    "sizes": [
      "36\"",
      "42\""
    ],
    "finishes": [
      "Natural Wood",
      "White",
      "Espresso",
      "Gray"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Authentic Renin Heritage Herringbone Chevron barn door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 8,
    "sku": "BR192853",
    "name": "Heritage Authentic Cross Brace",
    "category": "barn",
    "price": 699,
    "image": "/images/arcat/renin_192853_hd.jpg",
    "sizes": [
      "36\"",
      "42\""
    ],
    "finishes": [
      "Natural Wood",
      "White",
      "Espresso",
      "Gray"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Authentic Renin Heritage Authentic Cross Brace barn door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 9,
    "sku": "CO192856",
    "name": "Continental Metal Works 3-Panel",
    "category": "barn",
    "price": 849,
    "image": "/images/arcat/renin_192856_hd.jpg",
    "sizes": [
      "36\"",
      "42\"",
      "42\"x84\""
    ],
    "finishes": [
      "Natural Wood",
      "White",
      "Espresso",
      "Gray"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Authentic Renin Continental Metal Works 3-Panel barn door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 10,
    "sku": "BR192859",
    "name": "Heritage Gladstone 2-Lite",
    "category": "barn",
    "price": 719,
    "image": "/images/arcat/renin_192859_hd.jpg",
    "sizes": [
      "36\"",
      "42\""
    ],
    "finishes": [
      "Natural Wood",
      "White",
      "Espresso",
      "Gray"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Authentic Renin Heritage Gladstone 2-Lite barn door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 11,
    "sku": "BFEU30",
    "name": "Euro Bifold",
    "category": "bifold",
    "price": 349,
    "image": "/renin_images/barn_doors/product-6.jpgp_1000740462.jpg",
    "sizes": [
      "24\"",
      "30\"",
      "36\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Premium Renin Euro Bifold bifold door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 12,
    "sku": "BFLV30",
    "name": "Louver Bifold",
    "category": "bifold",
    "price": 269,
    "image": "/renin_images/barn_doors/product-6.jpgp_1000168984.jpg",
    "sizes": [
      "24\"",
      "30\"",
      "36\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Premium Renin Louver Bifold bifold door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 13,
    "sku": "BFPN30",
    "name": "Panel Bifold",
    "category": "bifold",
    "price": 249,
    "image": "/renin_images/barn_doors/product-6.jpgp_1000114326.jpg",
    "sizes": [
      "24\"",
      "30\"",
      "36\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Premium Renin Panel Bifold bifold door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 14,
    "sku": "BFMR30",
    "name": "Mirror Bifold",
    "category": "bifold",
    "price": 429,
    "image": "/renin_images/barn_doors/product-6.jpgp_1000786970.jpg",
    "sizes": [
      "24\"",
      "30\"",
      "36\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Premium Renin Mirror Bifold bifold door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 15,
    "sku": "CRCH30",
    "name": "Crochet Pivot",
    "category": "pivot",
    "price": 459,
    "image": "/renin_images/barn_doors/product-6.jpgp_1001054574.jpg",
    "sizes": [
      "24\"",
      "30\"",
      "36\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Premium Renin Crochet Pivot pivot door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 16,
    "sku": "PROV30",
    "name": "Provincial Pivot",
    "category": "pivot",
    "price": 479,
    "image": "/renin_images/barn_doors/product-6.jpgp_1001054575.jpg",
    "sizes": [
      "24\"",
      "30\"",
      "36\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Premium Renin Provincial Pivot pivot door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 17,
    "sku": "COL48",
    "name": "Colonial",
    "category": "sliding",
    "price": 379,
    "image": "/renin_images/barn_doors/product-6.jpgp_1000408962.jpg",
    "sizes": [
      "48\"",
      "60\"",
      "72\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Premium Renin Colonial sliding door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 18,
    "sku": "SHAK48",
    "name": "Shaker",
    "category": "sliding",
    "price": 359,
    "image": "/renin_images/barn_doors/product-6.jpgp_1000409177.jpg",
    "sizes": [
      "48\"",
      "60\"",
      "72\""
    ],
    "finishes": [
      "Off-White",
      "Mirror",
      "Frosted"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Premium Renin Shaker sliding door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 19,
    "sku": "RUST36",
    "name": "Rustic Ranch",
    "category": "barn",
    "price": 599,
    "image": "/renin_images/barn_doors/product-6.jpgp_1001238039.jpg",
    "sizes": [
      "36\"",
      "42\""
    ],
    "finishes": [
      "Natural Wood",
      "White",
      "Espresso",
      "Gray"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Premium Renin Rustic Ranch barn door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 20,
    "sku": "FARM36",
    "name": "Modern Farmhouse",
    "category": "barn",
    "price": 549,
    "image": "/renin_images/barn_doors/product-6.jpgp_1001529905.jpg",
    "sizes": [
      "36\"",
      "42\""
    ],
    "finishes": [
      "Natural Wood",
      "White",
      "Espresso",
      "Gray"
    ],
    "features": [
      "Professional Grade",
      "Easy Installation",
      "Canadian Stock",
      "Warranty Included"
    ],
    "description": "Premium Renin Modern Farmhouse barn door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  // Add more ARCAT products
  {
    "id": 21,
    "sku": "BR205717",
    "name": "Heritage Sierra K-Design",
    "category": "barn",
    "price": 689,
    "image": "/images/arcat/renin_205717_hd.jpg",
    "sizes": ["36\"", "42\""],
    "finishes": ["Natural Wood", "White", "Gray", "Espresso"],
    "features": ["Heritage Series", "K-Design Pattern", "Canadian Stock", "Professional Installation"],
    "description": "Authentic Renin Heritage Sierra K-Design barn door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 22,
    "sku": "CO176732",
    "name": "Continental Dunmore K-Lite",
    "category": "barn",
    "price": 589,
    "image": "/images/arcat/renin_176732_hd.jpg",
    "sizes": ["36\"", "42\""],
    "finishes": ["Natural Wood", "White", "Gray", "Black"],
    "features": ["Continental Series", "K-Lite Design", "Canadian Stock", "Professional Installation"],
    "description": "Authentic Renin Continental Dunmore K-Lite barn door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 23,
    "sku": "CO176733",
    "name": "Continental Pavilion 5-Lite",
    "category": "barn",
    "price": 629,
    "image": "/images/arcat/renin_176733_hd.jpg",
    "sizes": ["36\"", "42\""],
    "finishes": ["Natural Wood", "White", "Gray", "Black"],
    "features": ["Continental Series", "5-Lite Glass", "Canadian Stock", "Professional Installation"],
    "description": "Authentic Renin Continental Pavilion 5-Lite barn door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 24,
    "sku": "EB176736",
    "name": "Easy Build Stone K-Design",
    "category": "barn",
    "price": 549,
    "image": "/images/arcat/renin_176736_hd.jpg",
    "sizes": ["36\"", "42\""],
    "finishes": ["Natural Wood", "White", "Gray"],
    "features": ["Easy Build Series", "Stone Pattern", "DIY Friendly", "Professional Installation Available"],
    "description": "Authentic Renin Easy Build Stone K-Design barn door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 25,
    "sku": "BS192857",
    "name": "Brownstone Stone K-Design",
    "category": "barn",
    "price": 719,
    "image": "/images/arcat/renin_192857_hd.jpg",
    "sizes": ["36\"", "42\""],
    "finishes": ["Natural Stone", "White Stone", "Gray Stone"],
    "features": ["Brownstone Series", "Stone Texture", "Canadian Stock", "Professional Installation"],
    "description": "Authentic Renin Brownstone Stone K-Design barn door from ARCAT specifications. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  }
];

// Hardware products interface
export interface ReninHardware {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price?: number;
  material: string;
  finish: string;
  features: string[];
  image: string;
  // Additional properties for compatibility
  style?: string;
  size?: string;
  width?: number;
  height?: number;
  thickness?: number;
  length?: number;
  weight_capacity?: number;
  images?: {
    main: string;
    gallery?: string[];
  };
}

// ARCAT Hardware products with authentic images
export const reninHardware: ReninHardware[] = [
  {
    id: "hw176738",
    name: "Spectrum Bent Strap Hardware Kit",
    slug: "spectrum-bent-strap-kit",
    price: 199,
    material: "Steel",
    finish: "Black",
    features: ["Complete Kit", "Bent Strap Design", "Professional Grade"],
    image: "/images/arcat/renin_176738_Barn_Door_Hardware_Kits_Spectrum_Bent_Strap.jpg"
  },
  {
    id: "hw176739", 
    name: "Spectrum Straight Strap Hardware Kit",
    slug: "spectrum-straight-strap-kit",
    price: 189,
    material: "Steel",
    finish: "Black",
    features: ["Complete Kit", "Straight Strap Design", "Professional Grade"],
    image: "/images/arcat/renin_176739_Barn_Door_Hardware_Kits_Spectrum_Straight_Strap.jpg"
  },
  {
    id: "hw176740",
    name: "Spectrum Top Door Strap Kit",
    slug: "spectrum-top-door-strap-kit", 
    price: 209,
    material: "Steel",
    finish: "Black",
    features: ["Complete Kit", "Top Mount Design", "Professional Grade"],
    image: "/images/arcat/renin_176740_Barn_Door_Hardware_Kits_Spectrum_Top_of_Door_Strap.jpg"
  },
  {
    id: "hw199084",
    name: "Easy Clip Soft Close System",
    slug: "easy-clip-soft-close",
    price: 89,
    material: "Aluminum",
    finish: "Satin Nickel",
    features: ["Soft Close", "Easy Installation", "Retrofit Compatible"],
    image: "/images/arcat/renin_199084_Accessories_Easy_Clip_153_Soft_Close.jpg"
  },
  {
    id: "hw199074",
    name: "Round Flush Pull Handle",
    slug: "round-flush-pull",
    price: 29,
    material: "Stainless Steel",
    finish: "Brushed Nickel",
    features: ["Flush Mount", "Round Design", "Premium Finish"],
    image: "/images/arcat/renin_199074_Handles_Pulls_Round_Flush.jpg"
  }
];

// Utility function to generate slug from product name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Add slugs to products
const productsWithSlugs = reninProductsData.map(product => ({
  ...product,
  slug: generateSlug(product.name)
}));

// Export the data array for backward compatibility
export const reninProductsArray = productsWithSlugs;

// Export object with utility methods
export const reninProducts = {
  // Get all products
  getAllProducts: () => productsWithSlugs,
  
  // Get featured products (first 6)
  getFeaturedProducts: () => productsWithSlugs.slice(0, 6),
  
  // Get products by category
  getProductsByCategory: (category: string) => 
    productsWithSlugs.filter(p => p.category === category),
    
  // Format price with CAD currency
  formatPrice: (price: number | null) => {
    if (!price) return "Contact for pricing";
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(price);
  },
  
  // Calculate price with Canadian tax (HST 13% in Ontario)
  calculatePriceWithTax: (price: number, taxRate: number = 0.13) => {
    const subtotal = price;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    return {
      subtotal: subtotal,
      tax: tax,
      total: total
    };
  },
  
  // Get product by ID
  getById: (id: number) => productsWithSlugs.find(p => p.id === id),
  
  // Get product by slug
  getProductBySlug: (slug: string) => productsWithSlugs.find(p => p.slug === slug) || reninHardware.find(h => h.slug === slug),
  
  // Get product recommendations based on category
  getRecommendations: (productId: string | number, limit: number = 4) => {
    const product = productsWithSlugs.find(p => p.id === productId) || reninHardware.find(h => h.id === productId);
    if (!product) return [];
    
    const category = 'category' in product ? product.category : 'hardware';
    
    if (category === 'hardware') {
      return reninHardware
        .filter(h => h.id !== productId)
        .slice(0, limit);
    }
    
    return productsWithSlugs
      .filter(p => p.category === category && p.id !== productId)
      .slice(0, limit);
  },
  
  // Search products
  search: (query: string) => 
    productsWithSlugs.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    ),
  
  // Get barn door products
  getBarnDoors: () => productsWithSlugs.filter(p => p.category === 'barn'),
  
  // Filter barn doors by material/finish
  filterBarnDoors: (filters: Record<string, string>) => {
    let filtered = productsWithSlugs.filter(p => p.category === 'barn');
    
    if (filters.material && filters.material !== 'all') {
      filtered = filtered.filter(p => 
        p.finishes.some(f => f.toLowerCase().includes(filters.material.toLowerCase()))
      );
    }
    
    return filtered;
  },
  
  // Get hardware products  
  getHardware: () => reninHardware,
  
  // Get installation services (mock data for now)
  getInstallationServices: () => [
    {
      id: "install-basic",
      name: "Basic Installation",
      price: 199,
      description: "Professional installation with basic setup",
      features: ["Installation", "Basic setup", "2-year warranty"]
    },
    {
      id: "install-premium", 
      name: "Premium Installation",
      price: 299,
      description: "Premium installation with complete setup and testing",
      features: ["Premium installation", "Complete setup", "Testing", "5-year warranty"]
    }
  ],
  
  // Search products (alias for compatibility)
  searchProducts: (query: string) => 
    [...productsWithSlugs, ...reninHardware].filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p as any).description?.toLowerCase().includes(query.toLowerCase()) ||
      p.features.some(f => f.toLowerCase().includes(query.toLowerCase()))
    )
};
