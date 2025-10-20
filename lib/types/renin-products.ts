// Renin Products Type Definitions for PG Closets
export interface ReninProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  features: string[];
  specifications: ProductSpecs;
  attributes: ProductAttributes;
  media: ProductMedia[];
  variants: ProductVariant[];
  badges: string[];
  relatedProductIds: string[];
  seo: ProductSEO;
  category: string;
  subcategory: string;
  collection: string;
  series: string;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecs {
  frameMaterial?: string;
  coreMaterial?: string;
  thickness?: string;
  weightCapacity?: string;
  warranty?: string;
  installationTime?: string;
  madeIn?: string;
  certifications?: string;
  dimensions?: {
    width: number;
    height: number;
    unit: string;
  };
  glassType?: string;
  trackSystem?: string;
  hardware?: string;
  panelWidth?: string;
  pivotSystem?: string;
  mirrorType?: string;
  diameter?: string;
  bevel?: string;
  trackLength?: string;
  includedHardware?: string;
  weightCapacity?: string;
  pivotType?: string;
  material?: string;
  rollerMaterial?: string;
}

export interface ProductAttributes {
  type: string;
  style?: string;
  frame?: string;
  finish?: string;
  material?: string;
  origin?: string;
  warranty?: string;
  installationTime?: string;
  madeInCanada?: boolean;
  ecoFriendly?: boolean;
  customOptions?: boolean;
  hardwareType?: string;
  compatibleDoors?: string[];
  weightCapacity?: number;
  dimensions?: {
    width: number;
    height: number;
    unit: string;
  };
  mirrorType?: string;
  frameStyle?: string;
  bevelEdge?: boolean;
  backingType?: string;
  glazing?: string;
}

export interface ProductMedia {
  url: string;
  alt: string;
  role: string;
  width: number;
  height: number;
}

export interface ProductVariant {
  sku: string;
  name: string;
  priceCAD: number;
  installAddonCAD: number;
  availability: string;
  dimensions: {
    width: number;
    height: number;
    unit: string;
  };
  weight: number;
  finish?: string;
  glazing?: string;
}

export interface ProductSEO {
  title: string;
  description: string;
  keywords: string[];
}

export type ProductCategory =
  | 'barn-doors'
  | 'bifold-doors'
  | 'bypass-doors'
  | 'pivot-doors'
  | 'hardware'
  | 'mirrors'
  | 'room-dividers'
  | 'closet-systems';

export interface ProductFilter {
  categories: ProductCategory[];
  subcategories: string[];
  priceRange: { min: number; max: number };
  materials: string[];
  finishes: string[];
  features: string[];
  inStock: boolean;
  isNew: boolean;
  madeInCanada: boolean;
}

export interface ProductComparison {
  products: ReninProduct[];
  features: string[];
}