import { reninProducts, type Product } from '@/lib/renin-products';
import type {
  PGProduct,
  PGProductVariant,
  PGCart,
  PGCartItem,
  Collection,
  Menu,
  SearchResult,
  ProductFilter,
  Image,
  Money
} from './types';

// Constants
const DEFAULT_CURRENCY = 'CAD';
const TAX_RATE = 0.13; // Ontario HST

// Utility functions
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function formatPrice(price: number, currencyCode: string = DEFAULT_CURRENCY): Money {
  return {
    amount: price.toFixed(2),
    currencyCode
  };
}

function createImageFromUrl(url: string, alt: string): Image {
  return {
    url,
    altText: alt,
    width: 800,
    height: 600
  };
}

// Adapter functions
export function adaptReninProductToPGProduct(reninProduct: Product): PGProduct {
  const handle = createSlug(reninProduct.name);
  const price = reninProduct.price;
  const originalPrice = reninProduct.price;
  
  // Create variants based on available options
  const variants: PGProductVariant[] = [
    {
      id: `${reninProduct.id}-default`,
      title: 'Default',
      availableForSale: true,
      selectedOptions: [],
      price: formatPrice(price)
    }
  ];

  // Add size variants if available (commented out due to schema changes)
  // Use specifications for size info instead
  if (reninProduct.specifications["Standard Sizes"]) {
    const sizes = reninProduct.specifications["Standard Sizes"].split(',').map(s => s.trim());
    sizes.forEach((size, index) => {
      variants.push({
        id: `${reninProduct.id}-size-${index}`,
        title: `Size: ${size}`,
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: size }],
        price: formatPrice(price)
      });
    });
  }

  const featuredImage = createImageFromUrl(reninProduct.images[0], reninProduct.name);

  // Determine category and product type
  const category = 'category' in reninProduct ? 'barn-doors' : 'hardware';
  const description = reninProduct.features.join('. ');

  return {
    id: reninProduct.id.toString(),
    handle,
    availableForSale: true,
    title: reninProduct.name,
    description,
    descriptionHtml: `<p>${description}</p>`,
    options: [
      {
        id: 'size',
        name: 'Size',
        values: reninProduct.specifications["Standard Sizes"] ? reninProduct.specifications["Standard Sizes"].split(',').map(s => s.trim()) : ['Standard']
      },
      {
        id: 'finish',
        name: 'Finish',
        values: [reninProduct.specifications.Finish || 'Natural']
      }
    ],
    priceRange: {
      maxVariantPrice: formatPrice(originalPrice),
      minVariantPrice: formatPrice(price)
    },
    variants,
    featuredImage,
    images: [featuredImage],
    seo: {
      title: `${reninProduct.name} | PG Closets`,
      description
    },
    tags: [
      category,
      reninProduct.specifications.Material || '',
      reninProduct.category || '',
      reninProduct.specifications.Finish || ''
    ].filter(Boolean),
    updatedAt: new Date().toISOString(),
    category: mapCategoryToPGCategory(category),
    specifications: {
      material: reninProduct.specifications.Material || '',
      finish: reninProduct.specifications.Finish || '',
      size: reninProduct.specifications["Standard Sizes"] || '',
      dimensions: {
        thickness: reninProduct.specifications.Thickness || ''
      }
    },
    paddleProductId: undefined,
    isCustomizable: category === 'barn-doors'
  };
}

function mapCategoryToPGCategory(category: string): 'barn-doors' | 'hardware' | 'accessories' | 'track-systems' | 'handles' {
  const categoryMap: Record<string, any> = {
    'barn-doors': 'barn-doors',
    'hardware': 'hardware',
    'track-systems': 'track-systems',
    'handles': 'handles',
    'accessories': 'accessories'
  };
  
  return categoryMap[category] || 'accessories';
}

// Main API functions
export async function getProducts(): Promise<PGProduct[]> {
  try {
    const barnDoors = reninProducts.getBarnDoors();
    const hardware = reninProducts.getHardware();
    const allProducts = [...barnDoors, ...hardware];
    return allProducts.map(adaptReninProductToPGProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(handle: string): Promise<PGProduct | null> {
  try {
    const products = await getProducts();
    return products.find(product => product.handle === handle) || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProductsByCategory(category: string): Promise<PGProduct[]> {
  try {
    const products = await getProducts();
    return products.filter(product => product.category === category);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function searchProducts(query: string, filters?: ProductFilter): Promise<SearchResult> {
  try {
    let products = await getProducts();
    
    // Apply text search
    if (query) {
      const searchTerm = query.toLowerCase();
      products = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply filters
    if (filters) {
      if (filters.category && filters.category.length > 0) {
        products = products.filter(product => 
          filters.category!.includes(product.category)
        );
      }
      
      if (filters.priceRange) {
        products = products.filter(product => {
          const price = parseFloat(product.priceRange.minVariantPrice.amount);
          return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
        });
      }
      
      if (filters.material && filters.material.length > 0) {
        products = products.filter(product =>
          filters.material!.some(material =>
            product.specifications.material?.toLowerCase().includes(material.toLowerCase())
          )
        );
      }
      
      if (filters.inStock !== undefined) {
        products = products.filter(product => product.availableForSale === filters.inStock);
      }
    }
    
    // Calculate available filters based on current products
    const availableFilters = calculateAvailableFilters(products);
    
    return {
      products,
      totalCount: products.length,
      filters: availableFilters
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return {
      products: [],
      totalCount: 0,
      filters: {
        categories: [],
        materials: [],
        finishes: [],
        sizes: [],
        brands: [],
        priceRange: { min: 0, max: 0 }
      }
    };
  }
}

function calculateAvailableFilters(products: PGProduct[]) {
  const categories = [...new Set(products.map(p => p.category))];
  const materials = [...new Set(products.map(p => p.specifications.material).filter(Boolean))] as string[];
  const finishes = [...new Set(products.map(p => p.specifications.finish).filter(Boolean))] as string[];
  const sizes = [...new Set(products.map(p => p.specifications.size).filter(Boolean))] as string[];
  const brands = [...new Set(products.map(p => p.specifications.brand).filter(Boolean))] as string[];
  
  const prices = products.map(p => parseFloat(p.priceRange.minVariantPrice.amount));
  const priceRange = {
    min: Math.min(...prices) || 0,
    max: Math.max(...prices) || 0
  };
  
  return {
    categories,
    materials,
    finishes,
    sizes,
    brands,
    priceRange
  };
}

export async function getCollections(): Promise<Collection[]> {
  const categories = ['barn-doors', 'hardware', 'track-systems', 'handles', 'accessories'];
  
  return categories.map(category => ({
    handle: category,
    title: category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    description: `Browse our selection of ${category.replace('-', ' ')}`,
    seo: {
      title: `${category.replace('-', ' ')} | PG Closets`,
      description: `Professional ${category.replace('-', ' ')} for your home renovation projects`
    },
    updatedAt: new Date().toISOString(),
    path: `/search/${category}`
  }));
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const collections = await getCollections();
  
  return [
    { title: 'All Products', path: '/store' },
    ...collections.map(collection => ({
      title: collection.title,
      path: collection.path
    })),
    { title: 'Custom Closets', path: '/custom-walk-in-closets' },
    { title: 'Custom Quote', path: '/quote' },
    { title: 'Installation', path: '/installation' }
  ];
}

// Cart functions (for compatibility with existing cart system)
export function createEmptyCart(): PGCart {
  return {
    id: undefined,
    checkoutUrl: '',
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: formatPrice(0),
      totalAmount: formatPrice(0),
      totalTaxAmount: formatPrice(0)
    }
  };
}

export async function getCart(): Promise<PGCart | undefined> {
  // For now, return empty cart - will be handled by cart context
  return createEmptyCart();
}

// Product recommendations
export async function getProductRecommendations(productId: string): Promise<PGProduct[]> {
  try {
    const products = await getProducts();
    const currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) return [];
    
    // Get products from same category, excluding current product
    const recommendations = products
      .filter(p => p.id !== productId && p.category === currentProduct.category)
      .slice(0, 4);
    
    return recommendations;
  } catch (error) {
    console.error('Error fetching product recommendations:', error);
    return [];
  }
}

// Export types for use in components
export type { PGProduct, PGCart, PGCartItem, Collection, Menu, SearchResult, ProductFilter };