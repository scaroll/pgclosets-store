// Ottawa-specific pricing types for Renin products

export interface OttawaPricingConfig {
  baseMarkup: number; // 35% reseller margin
  hstRate: number; // 13% HST
  seniorDiscount: number; // 10% discount
  contractorDiscount: number; // Builder/contractor pricing
  volumeDiscounts: VolumeDiscount[];
  deliveryZones: DeliveryZone[];
  installationRates: InstallationRate[];
}

export interface VolumeDiscount {
  minQuantity: number;
  maxQuantity?: number;
  discountPercent: number;
  description: string;
}

export interface DeliveryZone {
  name: string;
  postalCodes: string[]; // First 3 characters of postal codes
  deliveryFee: number;
  freeDeliveryThreshold?: number;
}

export interface InstallationRate {
  doorType: 'barn-door' | 'sliding' | 'bifold' | 'pocket' | 'french' | 'standard';
  baseRate: number; // Base installation cost
  perSquareFootRate?: number; // Additional rate for size
  complexity: 'standard' | 'complex' | 'premium';
  timeEstimate: string;
}

export interface QuoteCalculationInput {
  productId: string;
  productName: string;
  productCategory: string;
  msrpPrice: number;
  width: number; // inches
  height: number; // inches
  quantity: number;
  includeInstallation: boolean;
  customerType: 'residential' | 'contractor' | 'senior';
  postalCode: string;
  doorType?: string;
}

export interface QuoteCalculationResult {
  basePrice: number;
  markedUpPrice: number;
  volumeDiscount: number;
  customerDiscount: number;
  subtotal: number;
  installationCost: number;
  deliveryFee: number;
  subtotalWithServices: number;
  hst: number;
  total: number;
  savings: number;
  breakdown: PriceBreakdown;
  financing?: FinancingOptions;
}

export interface PriceBreakdown {
  msrp: number;
  markup: number;
  volumeDiscount: number;
  customerDiscount: number;
  installation: number;
  delivery: number;
  hst: number;
  total: number;
}

export interface FinancingOptions {
  available: boolean;
  terms: FinancingTerm[];
  minAmount: number;
  qualificationNote: string;
}

export interface FinancingTerm {
  months: number;
  interestRate: number;
  monthlyPayment: number;
  totalAmount: number;
  description: string;
}

export interface ReninQuoteRequest {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    postalCode: string;
    customerType: 'residential' | 'contractor' | 'senior';
  };
  products: QuoteCalculationInput[];
  includeFinancing: boolean;
  projectDetails?: {
    projectType: 'new-construction' | 'renovation' | 'replacement';
    timeline: 'immediate' | '1-3months' | '3-6months' | '6plus-months';
    additionalNotes?: string;
  };
  preferredContactMethod: 'email' | 'phone' | 'both';
  hearAboutUs?: string;
}

export interface ReninQuoteResponse {
  success: boolean;
  quoteNumber: string;
  quote: QuoteCalculationResult;
  estimatedDelivery: string;
  validUntil: string;
  salesContact: {
    name: string;
    email: string;
    phone: string;
  };
  nextSteps: string[];
  error?: string;
}

// Ottawa-specific configuration constants
export const OTTAWA_PRICING_CONFIG: OttawaPricingConfig = {
  baseMarkup: 0.35, // 35% reseller margin
  hstRate: 0.13, // 13% HST for Ontario
  seniorDiscount: 0.10, // 10% senior discount
  contractorDiscount: 0.15, // 15% contractor discount
  volumeDiscounts: [
    { minQuantity: 2, maxQuantity: 4, discountPercent: 0.05, description: "5% off 2-4 doors" },
    { minQuantity: 5, maxQuantity: 9, discountPercent: 0.10, description: "10% off 5-9 doors" },
    { minQuantity: 10, discountPercent: 0.15, description: "15% off 10+ doors" }
  ],
  deliveryZones: [
    {
      name: "Downtown Ottawa",
      postalCodes: ["K1A", "K1B", "K1G", "K1H", "K1J", "K1K", "K1L", "K1M", "K1N", "K1P", "K1R", "K1S", "K1T", "K1V", "K1W", "K1X", "K1Y", "K1Z"],
      deliveryFee: 75,
      freeDeliveryThreshold: 2000
    },
    {
      name: "Kanata/Stittsville",
      postalCodes: ["K2K", "K2M", "K2S", "K2T", "K2V", "K2W"],
      deliveryFee: 100,
      freeDeliveryThreshold: 2500
    },
    {
      name: "Orleans/Cumberland",
      postalCodes: ["K1C", "K1E", "K1W", "K4A", "K4K", "K4M"],
      deliveryFee: 125,
      freeDeliveryThreshold: 2500
    },
    {
      name: "Nepean/Barrhaven",
      postalCodes: ["K2A", "K2B", "K2C", "K2E", "K2G", "K2H", "K2J", "K2L"],
      deliveryFee: 100,
      freeDeliveryThreshold: 2000
    },
    {
      name: "Outer Ottawa/Rural",
      postalCodes: ["K0A", "K0G", "K4B", "K4C", "K4P", "K4R"],
      deliveryFee: 175,
      freeDeliveryThreshold: 3000
    }
  ],
  installationRates: [
    {
      doorType: 'barn-door',
      baseRate: 450,
      perSquareFootRate: 12,
      complexity: 'complex',
      timeEstimate: '3-5 hours'
    },
    {
      doorType: 'sliding',
      baseRate: 350,
      perSquareFootRate: 8,
      complexity: 'standard',
      timeEstimate: '2-4 hours'
    },
    {
      doorType: 'bifold',
      baseRate: 275,
      perSquareFootRate: 6,
      complexity: 'standard',
      timeEstimate: '2-3 hours'
    },
    {
      doorType: 'pocket',
      baseRate: 525,
      perSquareFootRate: 15,
      complexity: 'premium',
      timeEstimate: '4-6 hours'
    },
    {
      doorType: 'french',
      baseRate: 400,
      perSquareFootRate: 10,
      complexity: 'complex',
      timeEstimate: '3-4 hours'
    },
    {
      doorType: 'standard',
      baseRate: 225,
      perSquareFootRate: 5,
      complexity: 'standard',
      timeEstimate: '1-2 hours'
    }
  ]
};

// Financing options configuration
export const FINANCING_OPTIONS: FinancingOptions = {
  available: true,
  minAmount: 1000,
  qualificationNote: "Subject to credit approval. 0% APR for qualified customers on orders over $2000.",
  terms: [
    {
      months: 6,
      interestRate: 0,
      monthlyPayment: 0, // Calculated dynamically
      totalAmount: 0, // Calculated dynamically
      description: "6 months, 0% APR"
    },
    {
      months: 12,
      interestRate: 0,
      monthlyPayment: 0,
      totalAmount: 0,
      description: "12 months, 0% APR"
    },
    {
      months: 24,
      interestRate: 0.0599,
      monthlyPayment: 0,
      totalAmount: 0,
      description: "24 months, 5.99% APR"
    },
    {
      months: 36,
      interestRate: 0.0899,
      monthlyPayment: 0,
      totalAmount: 0,
      description: "36 months, 8.99% APR"
    }
  ]
};