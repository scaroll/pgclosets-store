
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
}

const reninProductsData: ReninProduct[] = [
  {
    "id": 1,
    "sku": "BD1L",
    "name": "Euro 1-Lite",
    "category": "sliding",
    "price": 459,
    "image": "/renin_images/barn_doors/product-1.jpg",
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
    "description": "Premium Renin Euro 1-Lite sliding door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 2,
    "sku": "BD3L",
    "name": "Euro 3-Lite",
    "category": "sliding",
    "price": 489,
    "image": "/renin_images/barn_doors/product-2.jpg",
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
    "description": "Premium Renin Euro 3-Lite sliding door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 3,
    "sku": "BD5L",
    "name": "Euro 5-Lite",
    "category": "sliding",
    "price": 519,
    "image": "/renin_images/barn_doors/product-3.jpg",
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
    "description": "Premium Renin Euro 5-Lite sliding door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 4,
    "sku": "HARM48",
    "name": "Harmony Mirror",
    "category": "sliding",
    "price": 429,
    "image": "/renin_images/barn_doors/product-4.jpg",
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
    "description": "Premium Renin Harmony Mirror sliding door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 5,
    "sku": "TWIL48",
    "name": "Twilight Frosted",
    "category": "sliding",
    "price": 399,
    "image": "/renin_images/barn_doors/product-5.jpg",
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
    "description": "Premium Renin Twilight Frosted sliding door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "1-2 hours",
    "inStock": true
  },
  {
    "id": 6,
    "sku": "SALZ36",
    "name": "Heritage Z-Design",
    "category": "barn",
    "price": 659,
    "image": "/renin_images/barn_doors/gatsby-chevron-white-main.jpg",
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
    "description": "Premium Renin Heritage Z-Design barn door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 7,
    "sku": "SALK36",
    "name": "Heritage K-Design",
    "category": "barn",
    "price": 679,
    "image": "/renin_images/barn_doors/herringbone-chevron-main.jpg",
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
    "description": "Premium Renin Heritage K-Design barn door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 8,
    "sku": "CONT36",
    "name": "Continental",
    "category": "barn",
    "price": 589,
    "image": "/renin_images/barn_doors/industrial-x-frame-main.jpg",
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
    "description": "Premium Renin Continental barn door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 9,
    "sku": "BRWN36",
    "name": "Brownstone",
    "category": "barn",
    "price": 719,
    "image": "/renin_images/barn_doors/metal-works-geometric-main.jpg",
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
    "description": "Premium Renin Brownstone barn door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 10,
    "sku": "TRIB36",
    "name": "Industrial Tribeca",
    "category": "barn",
    "price": 849,
    "image": "/renin_images/barn_doors/salinas-z-pine-main.jpg",
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
    "description": "Premium Renin Industrial Tribeca barn door. Official dealer pricing, professional installation available in Ottawa.",
    "installTime": "2-3 hours",
    "inStock": true
  },
  {
    "id": 11,
    "sku": "BFEU30",
    "name": "Euro Bifold",
    "category": "bifold",
    "price": 349,
    "image": "https://images.homedepot.ca/productimages/p_1000740462.jpg",
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
    "image": "https://images.homedepot.ca/productimages/p_1000168984.jpg",
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
    "image": "https://images.homedepot.ca/productimages/p_1000114326.jpg",
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
    "image": "https://images.homedepot.ca/productimages/p_1000786970.jpg",
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
    "image": "https://images.homedepot.ca/productimages/p_1001054574.jpg",
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
    "image": "https://images.homedepot.ca/productimages/p_1001054575.jpg",
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
    "image": "https://images.homedepot.ca/productimages/p_1000408962.jpg",
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
    "image": "https://images.homedepot.ca/productimages/p_1000409177.jpg",
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
    "image": "https://images.homedepot.ca/productimages/p_1001238039.jpg",
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
    "image": "https://images.homedepot.ca/productimages/p_1001529905.jpg",
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
}

// Sample hardware products
export const reninHardware: ReninHardware[] = [
  {
    id: "hw1",
    name: "Standard Track System",
    slug: "standard-track-system", 
    price: 169,
    material: "Steel",
    finish: "Satin Nickel",
    features: ["6ft Track", "All Hardware Included", "Easy Installation"],
    image: "/renin_images/hardware/standard-track-6ft-main.jpg"
  },
  {
    id: "hw2", 
    name: "Premium InvisiGlide System",
    slug: "premium-invisiglide-system",
    price: 399,
    material: "Aluminum",
    finish: "Brushed Nickel", 
    features: ["Smooth Gliding", "Soft Close", "Premium Quality"],
    image: "/renin_images/hardware/invisiglide-premium-main.jpg"
  }
];

// Export the data array for backward compatibility
export const reninProductsArray = reninProductsData;

// Export object with utility methods
export const reninProducts = {
  // Get all products
  getAllProducts: () => reninProductsData,
  
  // Get featured products (first 6)
  getFeaturedProducts: () => reninProductsData.slice(0, 6),
  
  // Get products by category
  getProductsByCategory: (category: string) => 
    reninProductsData.filter(p => p.category === category),
    
  // Format price with CAD currency
  formatPrice: (price: number | null) => {
    if (!price) return "Contact for pricing";
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(price);
  },
  
  // Get product by ID
  getById: (id: number) => reninProductsData.find(p => p.id === id),
  
  // Search products
  search: (query: string) => 
    reninProductsData.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    )
};
