/**
 * Product Taxonomy System
 * Comprehensive taxonomy for closet doors, hardware, and systems
 */

// Door Type Taxonomy
export enum DoorType {
  SLIDING = 'sliding',
  BYPASS = 'bypass',
  BIFOLD = 'bifold',
  PIVOT = 'pivot',
  BARN = 'barn',
  MIRROR = 'mirror',
  FRENCH = 'french'
}

export enum DoorSubtype {
  // Sliding/Bypass
  TWO_PANEL = 'two-panel',
  THREE_PANEL = 'three-panel',
  FOUR_PANEL = 'four-panel',

  // Bifold
  TWO_FOLD = 'two-fold',
  FOUR_FOLD = 'four-fold',
  SIX_FOLD = 'six-fold',

  // Barn
  SINGLE_BARN = 'single-barn',
  DOUBLE_BARN = 'double-barn',
  BYPASS_BARN = 'bypass-barn'
}

// Opening Type
export interface OpeningDimensions {
  width: number;
  height: number;
  depth?: number;
  unit: 'inches' | 'cm' | 'mm';
}

export interface OpeningRequirements {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  recommendedClearance: {
    top: number;
    sides: number;
    bottom: number;
  };
  unit: 'inches' | 'cm' | 'mm';
}

// Material & Finish Taxonomy
export enum MaterialType {
  SOLID_WOOD = 'solid-wood',
  ENGINEERED_WOOD = 'engineered-wood',
  MDF = 'mdf',
  ALUMINUM = 'aluminum',
  STEEL = 'steel',
  GLASS = 'glass',
  MIRROR = 'mirror',
  COMPOSITE = 'composite'
}

export enum FinishType {
  PAINTED = 'painted',
  STAINED = 'stained',
  LAMINATE = 'laminate',
  POWDER_COATED = 'powder-coated',
  ANODIZED = 'anodized',
  NATURAL = 'natural',
  DISTRESSED = 'distressed'
}

export interface FinishOption {
  id: string;
  name: string;
  type: FinishType;
  color?: string;
  hexCode?: string;
  texture?: 'smooth' | 'textured' | 'grainy' | 'matte' | 'glossy';
  priceModifier: number; // Percentage or fixed amount
  availability: 'standard' | 'premium' | 'custom' | 'discontinued';
  leadTimeDays?: number;
  imageUrl?: string;
  sampleAvailable: boolean;
}

// Glass & Mirror Options
export enum GlassType {
  CLEAR = 'clear',
  FROSTED = 'frosted',
  TINTED = 'tinted',
  TEXTURED = 'textured',
  TEMPERED = 'tempered',
  LAMINATED = 'laminated',
  MIRROR = 'mirror'
}

export interface GlassOption {
  id: string;
  type: GlassType;
  thickness: number; // in mm
  priceModifier: number;
  safetyRating?: string;
  soundRating?: number; // STC rating
  isTempered: boolean;
  requiresSpecialHandling: boolean;
  leadTimeDays?: number;
}

// Hardware Taxonomy
export enum HardwareType {
  TRACK = 'track',
  ROLLERS = 'rollers',
  HANDLES = 'handles',
  HINGES = 'hinges',
  SOFT_CLOSE = 'soft-close',
  BOTTOM_GUIDE = 'bottom-guide',
  DOOR_STOP = 'door-stop',
  LOCK = 'lock'
}

export enum TrackType {
  TOP_MOUNT = 'top-mount',
  BOTTOM_ROLLING = 'bottom-rolling',
  BYPASS = 'bypass',
  BARN = 'barn',
  BIFOLD = 'bifold'
}

export interface HardwareOption {
  id: string;
  name: string;
  type: HardwareType;
  finish: string;
  material: MaterialType;
  priceModifier: number;
  compatibility: DoorType[];
  weightCapacity?: number; // in lbs
  isIncluded: boolean;
  isOptional: boolean;
  imageUrl?: string;
}

// Product Variant System
export interface ProductVariant {
  id: string;
  sku: string;
  title: string;

  // Dimensions
  dimensions: OpeningDimensions;
  panelCount?: number;

  // Materials & Finish
  material: MaterialType;
  finish: FinishOption;
  glass?: GlassOption;

  // Hardware
  hardware: {
    track: HardwareOption;
    handles?: HardwareOption;
    softClose?: HardwareOption;
    additional?: HardwareOption[];
  };

  // Pricing
  basePrice: number;
  calculatedPrice: number;
  priceBreakdown: {
    base: number;
    finish: number;
    glass?: number;
    hardware: number;
    labor?: number;
    surcharges: Array<{
      name: string;
      amount: number;
      reason: string;
    }>;
  };

  // Availability
  availability: 'in-stock' | 'make-to-order' | 'out-of-stock';
  leadTimeDays: number;
  inventoryQuantity?: number;

  // Shipping
  shippingClass: 'standard' | 'oversized' | 'freight';
  isFragile: boolean;
  requiresWhiteGlove?: boolean;

  // Images
  images: string[];
  thumbnail: string;
}

// SKU Generation System
export interface SKUComponents {
  brand: string; // RENIN, PG
  series: string; // CONTINENTAL, HERITAGE
  doorType: DoorType;
  width: number;
  height: number;
  panelCount?: number;
  material: string; // Short code
  finish: string; // Short code
  glass?: string; // Short code
  hardware: string; // Short code
}

// Pricing Rules
export interface PricingRule {
  id: string;
  name: string;
  type: 'base' | 'modifier' | 'surcharge' | 'discount';
  applies_to: {
    doorTypes?: DoorType[];
    sizeRange?: {
      minWidth?: number;
      maxWidth?: number;
      minHeight?: number;
      maxHeight?: number;
    };
    materials?: MaterialType[];
    finishes?: string[];
  };
  calculation: {
    method: 'fixed' | 'percentage' | 'per-sqft' | 'tiered';
    value: number;
    tiers?: Array<{
      threshold: number;
      value: number;
    }>;
  };
  conditions?: {
    minQuantity?: number;
    maxQuantity?: number;
    validFrom?: string;
    validTo?: string;
  };
  priority: number;
}

// Specification System
export interface ProductSpecification {
  category: 'dimensions' | 'materials' | 'performance' | 'installation' | 'warranty';
  specs: Array<{
    label: string;
    value: string | number;
    unit?: string;
    importance: 'critical' | 'important' | 'additional';
  }>;
}

// Constraint System
export interface ProductConstraint {
  type: 'dimension' | 'material' | 'compatibility' | 'regulatory';
  rule: string;
  validation: (variant: Partial<ProductVariant>) => {
    isValid: boolean;
    message?: string;
  };
  errorMessage: string;
  suggestion?: string;
}

// Bundle & Kit System
export interface ProductBundle {
  id: string;
  name: string;
  type: 'sample-kit' | 'installation-kit' | 'hardware-kit' | 'complete-system';
  products: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    isOptional: boolean;
  }>;
  price: number;
  savings: number;
  creditBack?: {
    amount: number;
    conditions: string;
    expirationDays: number;
  };
}

// Series Definition
export interface ProductSeries {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: DoorType;

  // Available Options
  availableSizes: OpeningDimensions[];
  availableFinishes: FinishOption[];
  availableMaterials: MaterialType[];
  availableGlass?: GlassOption[];
  availableHardware: HardwareOption[];

  // Constraints
  constraints: ProductConstraint[];
  openingRequirements: OpeningRequirements;

  // Pricing
  basePrice: number;
  pricingRules: PricingRule[];

  // Features
  features: string[];
  specifications: ProductSpecification[];

  // Marketing
  tagline?: string;
  highlights: string[];
  useCases: string[];
  styleGuide?: string;

  // Media
  images: string[];
  videos?: string[];
  lifestyleImages?: string[];
  installationGuides?: string[];

  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  // Metadata
  popularity: number;
  averageRating?: number;
  reviewCount?: number;
  isBestseller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

// Configuration System
export interface ProductConfiguration {
  seriesId: string;

  // Step 1: Dimensions
  dimensions: OpeningDimensions;
  openingType: DoorType;
  panelCount?: number;

  // Step 2: Material & Finish
  material: MaterialType;
  finish: FinishOption;

  // Step 3: Glass/Mirror (if applicable)
  glass?: GlassOption;

  // Step 4: Hardware
  trackType: TrackType;
  handles?: HardwareOption;
  softClose?: HardwareOption;
  additionalHardware?: HardwareOption[];

  // Step 5: Add-ons
  installation?: {
    required: boolean;
    type: 'professional' | 'diy';
    price?: number;
  };
  warranty?: {
    type: 'standard' | 'extended';
    years: number;
    price?: number;
  };

  // Calculated Results
  generatedSKU: string;
  totalPrice: number;
  priceBreakdown: ProductVariant['priceBreakdown'];
  leadTime: number;
  shippingEstimate?: number;

  // Validation
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

// Sample Kit System
export interface SampleKit {
  id: string;
  name: string;
  description: string;
  type: 'finish' | 'material' | 'complete' | 'custom';

  samples: Array<{
    seriesId: string;
    finish: FinishOption;
    material: MaterialType;
    size: {
      width: number;
      height: number;
      unit: 'inches' | 'cm';
    };
    sampleType: 'chip' | 'swatch' | 'panel';
  }>;

  pricing: {
    price: number;
    refundable: boolean;
    creditAmount?: number;
    creditConditions?: string;
    creditExpirationDays?: number;
  };

  shipping: {
    method: 'standard' | 'expedited';
    price: number;
    estimatedDays: number;
  };

  availability: 'in-stock' | 'made-to-order';
  processingTimeDays: number;
}

// Freight & Shipping
export interface ShippingEstimate {
  method: 'parcel' | 'ltl-freight' | 'white-glove' | 'local-pickup';
  carrier?: string;
  price: number;
  estimatedDays: {
    min: number;
    max: number;
  };
  restrictions?: string[];
  requiresLiftgate?: boolean;
  requiresResidentialDelivery?: boolean;
  surcharges?: Array<{
    type: string;
    amount: number;
  }>;
}

export interface FreightCalculationInput {
  postalCode: string;
  items: Array<{
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    value: number;
    isFragile: boolean;
    requiresSpecialHandling: boolean;
  }>;
  deliveryType: 'residential' | 'commercial';
  accessType: 'ground-level' | 'stairs' | 'elevator';
  requiresLiftgate: boolean;
}
