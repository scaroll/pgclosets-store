import fs from 'fs/promises';
import path from 'path';

export interface ReninProduct {
  id: string;
  sku: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  product_type: string;
  tags: string[];
  status: string;
  published: boolean;
  price: {
    base_price: number;
    compare_at_price?: number;
    currency: string;
  };
  inventory: {
    track_inventory: boolean;
    inventory_policy: string;
    inventory_quantity: number;
  };
  weight: {
    value: number;
    unit: string;
  };
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  options: {
    name: string;
    values: string[];
  }[];
  variants: {
    id: string;
    sku: string;
    title?: string;
    price: number;
    compare_at_price?: number;
    weight: number;
    inventory_quantity: number;
    requires_shipping: boolean;
    taxable: boolean;
    option1?: string;
    option2?: string;
    option3?: string;
    image?: {
      src: string;
      alt: string;
    };
  }[];
  images: {
    src: string;
    alt: string;
    position: number;
  }[];
  metafields: {
    namespace: string;
    key: string;
    value: string;
    type: string;
  }[];
  seo?: {
    title: string;
    description: string;
  };
}

export interface ReninProductData {
  products: ReninProduct[];
}

export class ReninProductLoader {
  private static instance: ReninProductLoader;
  private cachedProducts: ReninProduct[] | null = null;
  private lastLoadTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ReninProductLoader {
    if (!ReninProductLoader.instance) {
      ReninProductLoader.instance = new ReninProductLoader();
    }
    return ReninProductLoader.instance;
  }

  async loadProducts(): Promise<ReninProduct[]> {
    const now = Date.now();

    // Return cached products if still valid
    if (this.cachedProducts && (now - this.lastLoadTime) < this.CACHE_DURATION) {
      return this.cachedProducts;
    }

    try {
      const dataPath = path.resolve(process.cwd(), 'renin_js_crawl_all/metadata/products_detailed_filtered.json');
      const data = await fs.readFile(dataPath, 'utf8');
      const parsed = JSON.parse(data);

      // Normalize the data to ensure it has the expected structure
      const products = parsed.products || [];

      // Create variants from price data if variants don't exist
      this.cachedProducts = products.map((product: any) => {
        // Ensure variants exist
        if (!product.variants || product.variants.length === 0) {
          product.variants = [{
            id: `${product.id}-variant-1`,
            sku: product.sku,
            title: 'Default',
            price: product.price?.base_price || 0,
            compare_at_price: product.price?.compare_at_price,
            weight: product.weight?.value || 0,
            inventory_quantity: product.inventory?.inventory_quantity || 50,
            requires_shipping: true,
            taxable: true
          }];
        }

        // Ensure all variants have required fields
        product.variants = product.variants.map((variant: any) => ({
          ...variant,
          title: variant.title || variant.option1 || 'Default',
          inventory_quantity: variant.inventory_quantity ?? 50,
          requires_shipping: variant.requires_shipping !== false,
          taxable: variant.taxable !== false
        }));

        // Ensure images exist
        if (!product.images) {
          product.images = [];
        }

        // Ensure metafields exist
        if (!product.metafields) {
          product.metafields = [];
        }

        // Ensure required fields have default values
        product.tags = product.tags || [];
        product.status = product.status || 'active';
        product.published = product.published !== false;
        product.vendor = product.vendor || 'Renin';

        return product;
      });

      this.lastLoadTime = now;

      return this.cachedProducts || [];
    } catch (error) {
      console.error('Error loading Renin products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<ReninProduct | null> {
    const products = await this.loadProducts();
    return products.find(product => product.id === id) || null;
  }

  async getProductByHandle(handle: string): Promise<ReninProduct | null> {
    const products = await this.loadProducts();
    return products.find(product => product.handle === handle) || null;
  }

  async getProductsBySku(sku: string): Promise<ReninProduct | null> {
    const products = await this.loadProducts();
    return products.find(product => product.sku === sku) || null;
  }

  async getProductsByType(productType: string): Promise<ReninProduct[]> {
    const products = await this.loadProducts();
    return products.filter(product =>
      product.product_type.toLowerCase() === productType.toLowerCase()
    );
  }

  async getProductsByTag(tag: string): Promise<ReninProduct[]> {
    const products = await this.loadProducts();
    return products.filter(product =>
      product.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  async searchProducts(query: string): Promise<ReninProduct[]> {
    const products = await this.loadProducts();
    const searchTerm = query.toLowerCase();

    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      product.product_type.toLowerCase().includes(searchTerm)
    );
  }

  async getFeaturedProducts(limit: number = 8): Promise<ReninProduct[]> {
    const products = await this.loadProducts();
    // Return products with price data
    return products
      .filter(product =>
        product.price &&
        product.price.base_price > 0 &&
        product.published === true
      )
      .slice(0, limit);
  }

  async getProductCategories(): Promise<string[]> {
    const products = await this.loadProducts();
    const categories = new Set(products.map(p => p.product_type));
    return Array.from(categories).sort();
  }

  async getProductTags(): Promise<string[]> {
    const products = await this.loadProducts();
    const tags = new Set<string>();
    products.forEach(product => {
      product.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  async getProductStats(): Promise<{
    totalProducts: number;
    totalVariants: number;
    categories: number;
    tags: number;
    averagePrice: number;
    priceRange: { min: number; max: number };
    inStockCount: number;
    outOfStockCount: number;
  }> {
    const products = await this.loadProducts();
    const categories = await this.getProductCategories();
    const tags = await this.getProductTags();

    const allPrices = products.flatMap(p => p.variants.map(v => v.price));
    const validPrices = allPrices.filter(price => price > 0);

    // Calculate in-stock vs out-of-stock counts
    const inStockCount = products.filter(p =>
      p.variants.some(v => v.inventory_quantity > 0)
    ).length;
    const outOfStockCount = products.length - inStockCount;

    return {
      totalProducts: products.length,
      totalVariants: products.reduce((sum, p) => sum + p.variants.length, 0),
      categories: categories.length,
      tags: tags.length,
      averagePrice: validPrices.length > 0
        ? validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length
        : 0,
      priceRange: {
        min: validPrices.length > 0 ? Math.min(...validPrices) : 0,
        max: validPrices.length > 0 ? Math.max(...validPrices) : 0
      },
      inStockCount,
      outOfStockCount
    };
  }

  clearCache(): void {
    this.cachedProducts = null;
    this.lastLoadTime = 0;
  }
}

// Export singleton instance
export const reninProductLoader = ReninProductLoader.getInstance();