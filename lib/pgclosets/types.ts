// PG Closets types that extend and adapt Vercel Commerce types
export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type SEO = {
  title: string;
  description: string;
};

// PG Closets specific product types
export interface PGProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
}

export interface PGProduct {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: PGProductVariant[];
  featuredImage: Image;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
  // PG Closets specific fields
  category: 'barn-doors' | 'hardware' | 'accessories' | 'track-systems' | 'handles';
  specifications: {
    material?: string;
    size?: string;
    finish?: string;
    style?: string;
    brand?: string;
    dimensions?: {
      width?: string;
      height?: string;
      thickness?: string;
    };
  };
  paddleProductId?: string;
  isCustomizable: boolean;
}

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
};

export type PGCartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
  // PG Closets specific cart item fields
  paddleProductId?: string;
  customization?: {
    size?: string;
    finish?: string;
    hardware?: string;
    installationRequired?: boolean;
  };
};

export type PGCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: PGCartItem[];
  totalQuantity: number;
  // PG Closets specific cart fields
  paddleCheckoutId?: string;
  estimatedDelivery?: string;
  installationQuote?: number;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
  path: string;
};

export type Menu = {
  title: string;
  path: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

// Search and filtering types
export interface ProductFilter {
  category?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  material?: string[];
  finish?: string[];
  size?: string[];
  brand?: string[];
  inStock?: boolean;
}

export interface SearchResult {
  products: PGProduct[];
  totalCount: number;
  filters: {
    categories: string[];
    materials: string[];
    finishes: string[];
    sizes: string[];
    brands: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}

// Adapter functions type definitions
export type CartAdapter = (existingCart: any) => PGCart;
export type SearchAdapter = (query: string, filters?: ProductFilter) => Promise<SearchResult>;