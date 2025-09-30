import { Product } from '@/types/commerce';
import { unstable_cache } from 'next/cache';
import { products as localProducts } from '@/app/products/products-data';

const { NEXT_PUBLIC_APP_URL } = process.env;
// Ensure we always have a valid base URL when constructing API routes.
// During build/server-side rendering NEXT_PUBLIC_APP_URL may be undefined,
// so fall back to localhost which is safe for local builds. In production
// deployments the environment should set NEXT_PUBLIC_APP_URL to the
// canonical site URL (for example via VERCEL_URL).
const API_BASE = NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const API_URL = `${API_BASE.replace(/\/$/, '')}/api`;

/**
 * Internal function to fetch products with caching
 */
const fetchProductsInternal = async (params: {
  query?: string;
  collection?: string;
  limit?: number;
}): Promise<Product[]> => {
  let filteredProducts = [...localProducts];

  // Filter by search query
  if (params.query) {
    const searchTerm = params.query.toLowerCase();
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by collection/category
  if (params.collection && params.collection !== 'All Categories') {
    filteredProducts = filteredProducts.filter((product) =>
      product.category.toLowerCase() === params.collection!.toLowerCase()
    );
  }

  // Apply limit if specified
  if (params.limit) {
    filteredProducts = filteredProducts.slice(0, params.limit);
  }

  // Transform to match the expected Product type
  return filteredProducts.map((product): Product => ({
    id: product.id,
    title: product.name,
    handle: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description: product.description,
    thumbnail: product.image,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ url: product.image, altText: product.name }],
    variants: [{
      id: `${product.id}-variant`,
      title: 'Default',
      sku: product.id,
      price: product.price,
      inventory_quantity: 100 // Assume in stock
    }],
    tags: [product.category],
    collection: {
      id: product.category,
      title: product.category,
      handle: product.category.toLowerCase().replace(/\s+/g, '-')
    }
  }));
};

/**
 * Cached version of products fetch - revalidate every 5 minutes
 */
const getCachedProducts = unstable_cache(
  fetchProductsInternal,
  ['products-cache'],
  {
    revalidate: 300, // 5 minutes
    tags: ['products']
  }
);

/**
 * Fetches a list of products from the new unified backend.
 * @param params - Optional parameters for filtering, sorting, and pagination.
 * @returns A promise that resolves to an array of products.
 */
export async function getProducts(params: {
  query?: string;
  collection?: string;
  limit?: number;
}): Promise<Product[]> {
  // For static generation, use cached local data
  if (typeof window === 'undefined') {
    return getCachedProducts(params);
  }

  // For client-side calls, use the API with cache
  try {
    const searchParams = new URLSearchParams();
    if (params.query) {
      searchParams.set('query', params.query);
    }
    if (params.collection) {
      searchParams.set('collection', params.collection);
    }
    if (params.limit) {
      searchParams.set('limit', params.limit.toString());
    }

    const res = await fetch(`${API_URL}/products?${searchParams.toString()}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const data = await res.json();
    return data.products as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to local data on error
    return fetchProductsInternal(params);
  }
}

/**
 * Internal function to fetch a single product by handle
 */
const fetchProductByHandleInternal = async (handle: string): Promise<Product | null> => {
  const product = localProducts.find((p) =>
    p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === handle
  );
  if (!product) return null;

  return {
    id: product.id,
    title: product.name,
    handle: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description: product.description,
    thumbnail: product.image,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ url: product.image, altText: product.name }],
    variants: [{
      id: `${product.id}-variant`,
      title: 'Default',
      sku: product.id,
      price: product.price,
      inventory_quantity: 100 // Assume in stock
    }],
    tags: [product.category],
    collection: {
      id: product.category,
      title: product.category,
      handle: product.category.toLowerCase().replace(/\s+/g, '-')
    }
  };
};

/**
 * Cached version of product by handle fetch - revalidate every 5 minutes
 */
const getCachedProductByHandle = unstable_cache(
  fetchProductByHandleInternal,
  ['product-by-handle-cache'],
  {
    revalidate: 300, // 5 minutes
    tags: ['products']
  }
);

/**
 * Fetches a single product by its handle.
 * @param handle - The URL-friendly handle of the product.
 * @returns A promise that resolves to the product, or null if not found.
 */
export async function getProductByHandle(handle: string): Promise<Product | null> {
  // For static generation, use cached local data
  if (typeof window === 'undefined') {
    return getCachedProductByHandle(handle);
  }

  // For client-side calls, use the API with cache
  try {
    const res = await fetch(`${API_URL}/products/${handle}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    const data = await res.json();
    return data.product as Product;
  } catch (error) {
    console.error(`Error fetching product by handle ${handle}:`, error);
    // Fallback to local data on error
    return fetchProductByHandleInternal(handle);
  }
}

/**
 * Fetches all product collections.
 * @returns A promise that resolves to an array of collections.
 */
export async function getCollections(): Promise<{ id: string; title: string }[]> {
  noStore();
  // This is a placeholder. In a real implementation, you would fetch this
  // from a dedicated /api/collections endpoint.
  // For now, we can derive collections from the products themselves or return a static list.
  try {
    const products = await getProducts({});
    const collectionSet = new Map<string, string>();
    products.forEach(product => {
      if (product.collection) {
        collectionSet.set(product.collection.id, product.collection.title);
      }
    });
    return Array.from(collectionSet, ([id, title]) => ({ id, title }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}
