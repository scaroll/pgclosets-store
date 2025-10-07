/**
 * Dimension-Aware Pricing Engine
 * Calculates accurate pricing based on size, materials, and options
 */

import type {
  DoorType,
  MaterialType,
  FinishOption,
  GlassOption,
  HardwareOption,
  PricingRule,
  ProductConfiguration,
  OpeningDimensions
} from '@/types/product-taxonomy';

// Base Price Tiers by Size
interface SizeTier {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  basePrice: number;
}

// Continental Series Price Tiers (Example)
const CONTINENTAL_SIZE_TIERS: SizeTier[] = [
  // Standard Sizes (Most Common)
  { minWidth: 48, maxWidth: 72, minHeight: 78, maxHeight: 82, basePrice: 449 },
  { minWidth: 73, maxWidth: 96, minHeight: 78, maxHeight: 82, basePrice: 549 },
  { minWidth: 97, maxWidth: 120, minHeight: 78, maxHeight: 82, basePrice: 649 },

  // Tall Sizes
  { minWidth: 48, maxWidth: 72, minHeight: 83, maxHeight: 96, basePrice: 499 },
  { minWidth: 73, maxWidth: 96, minHeight: 83, maxHeight: 96, basePrice: 599 },
  { minWidth: 97, maxWidth: 120, minHeight: 83, maxHeight: 96, basePrice: 699 },

  // Oversized
  { minWidth: 121, maxWidth: 144, minHeight: 78, maxHeight: 96, basePrice: 849 },
  { minWidth: 145, maxWidth: 180, minHeight: 78, maxHeight: 96, basePrice: 1049 },
];

// Heritage Series Price Tiers (Example)
const HERITAGE_SIZE_TIERS: SizeTier[] = [
  { minWidth: 48, maxWidth: 72, minHeight: 78, maxHeight: 82, basePrice: 529 },
  { minWidth: 73, maxWidth: 96, minHeight: 78, maxHeight: 82, basePrice: 629 },
  { minWidth: 97, maxWidth: 120, minHeight: 78, maxHeight: 82, basePrice: 729 },
  { minWidth: 121, maxWidth: 144, minHeight: 78, maxHeight: 96, basePrice: 929 },
];

export class PricingEngine {
  /**
   * Calculate price based on dimensions
   */
  static calculateByDimensions(
    seriesId: string,
    dimensions: OpeningDimensions
  ): {
    basePrice: number;
    pricePerSqFt?: number;
    tier?: string;
  } {
    const tiers = this.getTiersForSeries(seriesId);
    const { width, height } = this.convertToInches(dimensions);

    // Find matching tier
    const matchingTier = tiers.find(
      (tier) =>
        width >= tier.minWidth &&
        width <= tier.maxWidth &&
        height >= tier.minHeight &&
        height <= tier.maxHeight
    );

    if (matchingTier) {
      const sqFt = (width * height) / 144; // Convert sq inches to sq ft
      return {
        basePrice: matchingTier.basePrice,
        pricePerSqFt: matchingTier.basePrice / sqFt,
        tier: `${matchingTier.minWidth}-${matchingTier.maxWidth}" × ${matchingTier.minHeight}-${matchingTier.maxHeight}"`
      };
    }

    // For custom sizes, calculate proportionally
    const sqFt = (width * height) / 144;
    const basePricePerSqFt = 8.5; // Base rate per sq ft
    return {
      basePrice: Math.round(sqFt * basePricePerSqFt),
      pricePerSqFt: basePricePerSqFt,
      tier: 'custom'
    };
  }

  /**
   * Calculate finish modifier
   */
  static calculateFinishModifier(
    finish: FinishOption,
    basePrice: number
  ): number {
    if (finish.priceModifier === 0) return 0;

    // If modifier is percentage (< 10), calculate as percentage
    if (finish.priceModifier < 10) {
      return Math.round(basePrice * finish.priceModifier);
    }

    // Otherwise, it's a fixed amount
    return finish.priceModifier;
  }

  /**
   * Calculate glass/mirror surcharge
   */
  static calculateGlassSurcharge(
    glass: GlassOption,
    dimensions: OpeningDimensions
  ): number {
    const { width, height } = this.convertToInches(dimensions);
    const sqFt = (width * height) / 144;

    let baseSurcharge = glass.priceModifier;

    // Tempered glass adds 40% surcharge
    if (glass.isTempered) {
      baseSurcharge *= 1.4;
    }

    // Calculate per sq ft for glass
    const pricePerSqFt = 15; // Base glass price per sq ft
    return Math.round(sqFt * pricePerSqFt + baseSurcharge);
  }

  /**
   * Calculate hardware pricing
   */
  static calculateHardwarePrice(hardware: {
    track: HardwareOption;
    handles?: HardwareOption;
    softClose?: HardwareOption;
    additional?: HardwareOption[];
  }): {
    total: number;
    breakdown: Array<{ name: string; price: number }>;
  } {
    const breakdown: Array<{ name: string; price: number }> = [];
    let total = 0;

    // Track (usually included)
    if (!hardware.track.isIncluded) {
      breakdown.push({
        name: hardware.track.name,
        price: hardware.track.priceModifier
      });
      total += hardware.track.priceModifier;
    }

    // Handles (usually optional)
    if (hardware.handles) {
      breakdown.push({
        name: hardware.handles.name,
        price: hardware.handles.priceModifier
      });
      total += hardware.handles.priceModifier;
    }

    // Soft-close (premium upgrade)
    if (hardware.softClose) {
      breakdown.push({
        name: hardware.softClose.name,
        price: hardware.softClose.priceModifier
      });
      total += hardware.softClose.priceModifier;
    }

    // Additional hardware
    if (hardware.additional) {
      hardware.additional.forEach((hw) => {
        breakdown.push({
          name: hw.name,
          price: hw.priceModifier
        });
        total += hw.priceModifier;
      });
    }

    return { total, breakdown };
  }

  /**
   * Calculate surcharges
   */
  static calculateSurcharges(
    config: ProductConfiguration
  ): Array<{ name: string; amount: number; reason: string }> {
    const surcharges: Array<{ name: string; amount: number; reason: string }> = [];
    const { width, height } = this.convertToInches(config.dimensions);

    // Oversized surcharge (>96" width or >84" height)
    if (width > 96 || height > 84) {
      surcharges.push({
        name: 'Oversized',
        amount: 150,
        reason: 'Doors over 96" wide or 84" tall require special handling'
      });
    }

    // Mirror/Tempered glass surcharge
    if (config.glass?.isTempered || config.glass?.type === 'mirror') {
      surcharges.push({
        name: 'Safety Glass Handling',
        amount: 75,
        reason: 'Tempered and mirror glass require special packaging'
      });
    }

    // Custom dimensions (non-standard)
    const isStandardSize = this.isStandardSize(config.dimensions);
    if (!isStandardSize) {
      surcharges.push({
        name: 'Custom Sizing',
        amount: 100,
        reason: 'Non-standard dimensions require custom manufacturing'
      });
    }

    // Premium finish surcharge
    if (config.finish.availability === 'premium') {
      surcharges.push({
        name: 'Premium Finish',
        amount: 125,
        reason: 'Premium finishes require additional processing'
      });
    }

    return surcharges;
  }

  /**
   * Calculate complete configuration price
   */
  static calculateTotalPrice(config: ProductConfiguration): {
    totalPrice: number;
    breakdown: {
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
    displayPrice: string;
    savingsFromMSRP?: number;
  } {
    // 1. Base price from dimensions
    const baseResult = this.calculateByDimensions(
      config.seriesId,
      config.dimensions
    );
    const basePrice = baseResult.basePrice;

    // 2. Finish modifier
    const finishPrice = this.calculateFinishModifier(config.finish, basePrice);

    // 3. Glass surcharge
    const glassPrice = config.glass
      ? this.calculateGlassSurcharge(config.glass, config.dimensions)
      : 0;

    // 4. Hardware pricing
    const hardwareResult = this.calculateHardwarePrice({
      track: config.trackType as any, // Simplified for example
      handles: config.handles,
      softClose: config.softClose,
      additional: config.additionalHardware
    });

    // 5. Surcharges
    const surcharges = this.calculateSurcharges(config);
    const totalSurcharges = surcharges.reduce((sum, s) => sum + s.amount, 0);

    // 6. Total
    const totalPrice =
      basePrice +
      finishPrice +
      glassPrice +
      hardwareResult.total +
      totalSurcharges;

    return {
      totalPrice: Math.round(totalPrice),
      breakdown: {
        base: basePrice,
        finish: finishPrice,
        glass: glassPrice || undefined,
        hardware: hardwareResult.total,
        surcharges
      },
      displayPrice: this.formatPrice(totalPrice),
      savingsFromMSRP: this.calculateMSRPSavings(config, totalPrice)
    };
  }

  /**
   * Calculate volume/trade discount
   */
  static calculateVolumeDiscount(
    quantity: number,
    unitPrice: number
  ): {
    discountPercentage: number;
    discountAmount: number;
    finalPrice: number;
  } {
    let discountPercentage = 0;

    if (quantity >= 10) {
      discountPercentage = 0.15; // 15% off
    } else if (quantity >= 5) {
      discountPercentage = 0.10; // 10% off
    } else if (quantity >= 3) {
      discountPercentage = 0.05; // 5% off
    }

    const discountAmount = Math.round(unitPrice * discountPercentage * quantity);
    const finalPrice = Math.round(unitPrice * quantity - discountAmount);

    return {
      discountPercentage,
      discountAmount,
      finalPrice
    };
  }

  /**
   * Calculate financing options
   */
  static calculateFinancing(
    totalPrice: number,
    termMonths: number = 12,
    interestRate: number = 0.0999 // 9.99% APR
  ): {
    monthlyPayment: number;
    totalInterest: number;
    totalPaid: number;
    effectiveAPR: number;
  } {
    const monthlyRate = interestRate / 12;
    const monthlyPayment =
      (totalPrice * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);

    const totalPaid = monthlyPayment * termMonths;
    const totalInterest = totalPaid - totalPrice;

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      effectiveAPR: interestRate
    };
  }

  /**
   * Get "From $X" pricing for a series
   */
  static getFromPrice(seriesId: string): {
    fromPrice: number;
    displayText: string;
    includes: string[];
  } {
    const tiers = this.getTiersForSeries(seriesId);
    const lowestPrice = Math.min(...tiers.map((t) => t.basePrice));

    return {
      fromPrice: lowestPrice,
      displayText: `From $${lowestPrice.toLocaleString()}`,
      includes: [
        'Standard finish',
        'Basic hardware included',
        'Most common sizes'
      ]
    };
  }

  // Helper Methods

  private static getTiersForSeries(seriesId: string): SizeTier[] {
    const seriesMap: Record<string, SizeTier[]> = {
      continental: CONTINENTAL_SIZE_TIERS,
      heritage: HERITAGE_SIZE_TIERS,
      // Add more series as needed
    };

    return seriesMap[seriesId.toLowerCase()] || CONTINENTAL_SIZE_TIERS;
  }

  private static convertToInches(dimensions: OpeningDimensions): {
    width: number;
    height: number;
  } {
    let { width, height } = dimensions;

    if (dimensions.unit === 'cm') {
      width = width / 2.54;
      height = height / 2.54;
    } else if (dimensions.unit === 'mm') {
      width = width / 25.4;
      height = height / 25.4;
    }

    return { width, height };
  }

  private static isStandardSize(dimensions: OpeningDimensions): boolean {
    const { width, height } = this.convertToInches(dimensions);

    // Common standard sizes
    const standardSizes = [
      { w: 48, h: 80 },
      { w: 60, h: 80 },
      { w: 72, h: 80 },
      { w: 96, h: 80 },
      { w: 48, h: 96 },
      { w: 72, h: 96 }
    ];

    return standardSizes.some(
      (size) =>
        Math.abs(width - size.w) <= 2 && Math.abs(height - size.h) <= 2
    );
  }

  private static formatPrice(price: number): string {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  }

  private static calculateMSRPSavings(
    config: ProductConfiguration,
    calculatedPrice: number
  ): number | undefined {
    // Calculate MSRP (typically 25-30% higher)
    const msrp = Math.round(calculatedPrice * 1.25);
    const savings = msrp - calculatedPrice;

    // Only show savings if significant (>10%)
    if (savings / msrp > 0.10) {
      return savings;
    }

    return undefined;
  }
}

/**
 * Price Display Utilities
 */
export class PriceDisplay {
  static formatRange(min: number, max: number): string {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }

  static formatWithSavings(price: number, savings?: number): string {
    if (!savings) return `$${price.toLocaleString()}`;

    const msrp = price + savings;
    return `$${price.toLocaleString()} <span class="line-through text-gray-500">$${msrp.toLocaleString()}</span>`;
  }

  static formatPerSqFt(pricePerSqFt: number): string {
    return `$${pricePerSqFt.toFixed(2)}/sq ft`;
  }

  static formatMonthlyPayment(monthlyPayment: number): string {
    return `$${monthlyPayment.toFixed(2)}/mo`;
  }
}
