/**
 * Freight Estimator with Postal Code Lookup
 * Provides accurate shipping quotes for doors and large items
 */

import type {
  FreightCalculationInput,
  ShippingEstimate
} from '@/types/product-taxonomy';

// Ottawa postal code prefixes
const OTTAWA_POSTAL_CODES = ['K1', 'K2', 'K4'];
const NEARBY_POSTAL_CODES = ['J8', 'J9', 'K0', 'K7']; // Gatineau, surrounding areas

/**
 * Shipping zones based on distance from Ottawa
 */
enum ShippingZone {
  LOCAL = 'local', // Within Ottawa (K1, K2, K4)
  NEARBY = 'nearby', // Within 100km (Gatineau, etc)
  REGIONAL = 'regional', // Ontario/Quebec (within 500km)
  PROVINCIAL = 'provincial', // Rest of Ontario/Quebec
  NATIONAL = 'national', // Other provinces
  REMOTE = 'remote' // Territories, very remote
}

interface ZoneRates {
  zone: ShippingZone;
  baseRate: number; // Base LTL rate
  perKgRate: number; // Additional per kg
  residentialSurcharge: number;
  liftgateSurcharge: number;
  minCharge: number;
  estimatedDays: { min: number; max: number };
}

const ZONE_RATES: Record<ShippingZone, ZoneRates> = {
  [ShippingZone.LOCAL]: {
    zone: ShippingZone.LOCAL,
    baseRate: 0, // Free local pickup available
    perKgRate: 0,
    residentialSurcharge: 0,
    liftgateSurcharge: 0,
    minCharge: 0,
    estimatedDays: { min: 1, max: 2 }
  },
  [ShippingZone.NEARBY]: {
    zone: ShippingZone.NEARBY,
    baseRate: 75,
    perKgRate: 0.50,
    residentialSurcharge: 45,
    liftgateSurcharge: 75,
    minCharge: 125,
    estimatedDays: { min: 2, max: 4 }
  },
  [ShippingZone.REGIONAL]: {
    zone: ShippingZone.REGIONAL,
    baseRate: 150,
    perKgRate: 0.75,
    residentialSurcharge: 65,
    liftgateSurcharge: 95,
    minCharge: 225,
    estimatedDays: { min: 3, max: 6 }
  },
  [ShippingZone.PROVINCIAL]: {
    zone: ShippingZone.PROVINCIAL,
    baseRate: 250,
    perKgRate: 1.00,
    residentialSurcharge: 85,
    liftgateSurcharge: 125,
    minCharge: 375,
    estimatedDays: { min: 5, max: 8 }
  },
  [ShippingZone.NATIONAL]: {
    zone: ShippingZone.NATIONAL,
    baseRate: 450,
    perKgRate: 1.50,
    residentialSurcharge: 125,
    liftgateSurcharge: 175,
    minCharge: 625,
    estimatedDays: { min: 7, max: 12 }
  },
  [ShippingZone.REMOTE]: {
    zone: ShippingZone.REMOTE,
    baseRate: 750,
    perKgRate: 2.50,
    residentialSurcharge: 200,
    liftgateSurcharge: 250,
    minCharge: 1000,
    estimatedDays: { min: 10, max: 20 }
  }
};

export class FreightEstimator {
  /**
   * Get shipping estimate for postal code
   */
  static async getEstimate(
    input: FreightCalculationInput
  ): Promise<ShippingEstimate[]> {
    const zone = this.determineZone(input.postalCode);
    const rates = ZONE_RATES[zone];

    // Calculate weight
    const totalWeight = input.items.reduce((sum, item) => sum + item.weight, 0);

    const estimates: ShippingEstimate[] = [];

    // Local pickup (if applicable)
    if (zone === ShippingZone.LOCAL) {
      estimates.push({
        method: 'local-pickup',
        carrier: 'Customer Pickup',
        price: 0,
        estimatedDays: { min: 1, max: 1 },
        restrictions: [
          'Pickup at 123 Industrial Rd, Ottawa',
          'Monday-Friday 9am-5pm, Saturday 10am-3pm',
          'Valid ID required',
          'Bring truck/trailer suitable for items'
        ]
      });
    }

    // Standard parcel (if lightweight and not oversized)
    const canShipParcel = this.canShipAsParcel(input.items);
    if (canShipParcel) {
      const parcelPrice = this.calculateParcelShipping(
        totalWeight,
        input.postalCode
      );

      estimates.push({
        method: 'parcel',
        carrier: 'Canada Post',
        price: parcelPrice,
        estimatedDays: { min: 3, max: 7 },
        restrictions: [
          'Signature required',
          'Items shipped separately if multiple',
          'Fragile items double-boxed'
        ]
      });
    }

    // LTL Freight
    const freightPrice = this.calculateFreightShipping(input, rates);

    const freightSurcharges: Array<{ type: string; amount: number }> = [];

    if (input.deliveryType === 'residential') {
      freightSurcharges.push({
        type: 'Residential Delivery',
        amount: rates.residentialSurcharge
      });
    }

    if (input.requiresLiftgate) {
      freightSurcharges.push({
        type: 'Liftgate Service',
        amount: rates.liftgateSurcharge
      });
    }

    if (input.accessType === 'stairs') {
      freightSurcharges.push({
        type: 'Stairs Access Fee',
        amount: 100
      });
    }

    const totalFreightPrice =
      freightPrice +
      freightSurcharges.reduce((sum, s) => sum + s.amount, 0);

    estimates.push({
      method: 'ltl-freight',
      carrier: 'Day & Ross / Purolator Freight',
      price: Math.max(totalFreightPrice, rates.minCharge),
      estimatedDays: rates.estimatedDays,
      restrictions: [
        'Curbside delivery (driver does not enter home)',
        'Call-ahead delivery (24hr notice)',
        'Inspect for damage before signing',
        '48-hour damage claim window',
        input.requiresLiftgate ? 'Liftgate service included' : 'Customer must provide unloading assistance'
      ],
      requiresLiftgate: input.requiresLiftgate,
      requiresResidentialDelivery: input.deliveryType === 'residential',
      surcharges: freightSurcharges
    });

    // White glove delivery (premium)
    if (zone === ShippingZone.LOCAL || zone === ShippingZone.NEARBY) {
      const whiteGlovePrice = totalFreightPrice * 1.75 + 150;

      estimates.push({
        method: 'white-glove',
        carrier: 'Professional Delivery Service',
        price: whiteGlovePrice,
        estimatedDays: { min: 5, max: 10 },
        restrictions: [
          'Inside delivery to room of choice',
          'Unpacking and debris removal',
          'Appointment scheduling required',
          'Delivery team inspects with customer',
          'Available Ottawa area only'
        ]
      });
    }

    return estimates.sort((a, b) => a.price - b.price);
  }

  /**
   * Determine shipping zone from postal code
   */
  private static determineZone(postalCode: string): ShippingZone {
    const normalized = postalCode.toUpperCase().replace(/\s/g, '');
    const prefix = normalized.substring(0, 2);

    // Local Ottawa
    if (OTTAWA_POSTAL_CODES.includes(prefix)) {
      return ShippingZone.LOCAL;
    }

    // Nearby (Gatineau, surrounding)
    if (NEARBY_POSTAL_CODES.includes(prefix)) {
      return ShippingZone.NEARBY;
    }

    // Ontario
    if (prefix.startsWith('K') || prefix.startsWith('L') || prefix.startsWith('M') || prefix.startsWith('N') || prefix.startsWith('P')) {
      // Close to Ottawa (K7, K6, K8 = regional)
      if (['K6', 'K7', 'K8'].includes(prefix)) {
        return ShippingZone.REGIONAL;
      }
      // Rest of Ontario
      return ShippingZone.PROVINCIAL;
    }

    // Quebec
    if (prefix.startsWith('G') || prefix.startsWith('H') || prefix.startsWith('J')) {
      // Close Quebec cities
      if (['J0', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7'].includes(prefix)) {
        return ShippingZone.REGIONAL;
      }
      return ShippingZone.PROVINCIAL;
    }

    // Territories
    if (prefix.startsWith('X') || prefix.startsWith('Y')) {
      return ShippingZone.REMOTE;
    }

    // Rest of Canada
    return ShippingZone.NATIONAL;
  }

  /**
   * Check if items can ship as parcel
   */
  private static canShipAsParcel(
    items: FreightCalculationInput['items']
  ): boolean {
    // Max parcel weight: 30kg (66 lbs)
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight > 30) return false;

    // Max dimensions: 270cm combined length + girth
    for (const item of items) {
      const { length, width, height } = item.dimensions;
      const girth = 2 * (width + height);
      const combined = length + girth;

      if (combined > 270) return false;

      // Max single dimension: 150cm
      if (length > 150 || width > 150 || height > 150) return false;
    }

    return true;
  }

  /**
   * Calculate parcel shipping cost
   */
  private static calculateParcelShipping(
    weight: number,
    postalCode: string
  ): number {
    const zone = this.determineZone(postalCode);

    // Base rates for Canada Post
    const baseRates: Record<ShippingZone, number> = {
      [ShippingZone.LOCAL]: 15,
      [ShippingZone.NEARBY]: 20,
      [ShippingZone.REGIONAL]: 30,
      [ShippingZone.PROVINCIAL]: 45,
      [ShippingZone.NATIONAL]: 75,
      [ShippingZone.REMOTE]: 150
    };

    const baseRate = baseRates[zone] || 50;

    // Additional per kg over 5kg
    const additionalWeight = Math.max(0, weight - 5);
    const weightCharge = additionalWeight * 2.5;

    return Math.round(baseRate + weightCharge);
  }

  /**
   * Calculate freight shipping cost
   */
  private static calculateFreightShipping(
    input: FreightCalculationInput,
    rates: ZoneRates
  ): number {
    const totalWeight = input.items.reduce((sum, item) => sum + item.weight, 0);

    // Base + per-kg rate
    let price = rates.baseRate + totalWeight * rates.perKgRate;

    // Oversized surcharge (if any dimension > 2.4m)
    const hasOversized = input.items.some((item) => {
      const maxDim = Math.max(
        item.dimensions.length,
        item.dimensions.width,
        item.dimensions.height
      );
      return maxDim > 240; // 2.4 meters
    });

    if (hasOversized) {
      price += 125;
    }

    // Fragile handling surcharge
    const hasFragile = input.items.some((item) => item.isFragile);
    if (hasFragile) {
      price += 75;
    }

    // Special handling surcharge
    const needsSpecialHandling = input.items.some(
      (item) => item.requiresSpecialHandling
    );
    if (needsSpecialHandling) {
      price += 100;
    }

    // High value surcharge (insurance)
    const totalValue = input.items.reduce((sum, item) => sum + item.value, 0);
    if (totalValue > 2000) {
      const insuranceCost = (totalValue - 2000) * 0.015; // 1.5% over $2000
      price += insuranceCost;
    }

    return Math.round(price);
  }

  /**
   * Get delivery promise text
   */
  static getDeliveryPromise(
    postalCode: string,
    inStock: boolean = true
  ): {
    text: string;
    dateRange: { min: Date; max: Date };
    icon: string;
  } {
    const zone = this.determineZone(postalCode);
    const rates = ZONE_RATES[zone];

    const processingDays = inStock ? 1 : 7; // 1 day if in stock, 7 if made-to-order
    const minDays = processingDays + rates.estimatedDays.min;
    const maxDays = processingDays + rates.estimatedDays.max;

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    let text = '';
    let icon = '📦';

    if (zone === ShippingZone.LOCAL && inStock) {
      text = 'Available for pickup as early as tomorrow';
      icon = '🚗';
    } else if (minDays <= 3) {
      text = `Estimated delivery ${minDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${maxDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      icon = '🚚';
    } else {
      text = `Estimated delivery in ${minDays}-${maxDays} business days`;
      icon = '📅';
    }

    return {
      text,
      dateRange: { min: minDate, max: maxDate },
      icon
    };
  }

  /**
   * Validate postal code format
   */
  static validatePostalCode(postalCode: string): {
    isValid: boolean;
    formatted?: string;
    error?: string;
  } {
    // Remove spaces and convert to uppercase
    const cleaned = postalCode.replace(/\s/g, '').toUpperCase();

    // Canadian postal code regex: A1A 1A1
    const regex = /^[A-Z]\d[A-Z]\d[A-Z]\d$/;

    if (!regex.test(cleaned)) {
      return {
        isValid: false,
        error: 'Invalid postal code format. Expected format: A1A 1A1'
      };
    }

    // Format with space
    const formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;

    return {
      isValid: true,
      formatted
    };
  }

  /**
   * Get local pickup locations
   */
  static getPickupLocations(postalCode: string): Array<{
    name: string;
    address: string;
    hours: string;
    distance?: number;
    isWarehouse: boolean;
  }> {
    const zone = this.determineZone(postalCode);

    if (zone !== ShippingZone.LOCAL && zone !== ShippingZone.NEARBY) {
      return [];
    }

    return [
      {
        name: 'PG Closets Main Warehouse',
        address: '123 Industrial Road, Ottawa, ON K1B 3L4',
        hours: 'Mon-Fri 9:00 AM - 5:00 PM, Sat 10:00 AM - 3:00 PM',
        distance: zone === ShippingZone.LOCAL ? 5 : 25,
        isWarehouse: true
      },
      {
        name: 'PG Closets Kanata Showroom',
        address: '456 Kanata Ave, Ottawa, ON K2K 2P5',
        hours: 'Tue-Sat 10:00 AM - 6:00 PM, Sun 11:00 AM - 4:00 PM',
        distance: zone === ShippingZone.LOCAL ? 8 : 30,
        isWarehouse: false
      }
    ];
  }
}

/**
 * Shipping cost calculator for product pages
 */
export class ShippingCalculator {
  static async calculateForProduct(
    productWeight: number,
    productDimensions: { length: number; width: number; height: number },
    productValue: number,
    quantity: number,
    postalCode: string
  ): Promise<{
    estimates: ShippingEstimate[];
    cheapest: ShippingEstimate;
    fastest: ShippingEstimate;
  }> {
    const items = Array(quantity).fill({
      weight: productWeight,
      dimensions: productDimensions,
      value: productValue,
      isFragile: true, // Doors are fragile
      requiresSpecialHandling: productDimensions.length > 200 || productDimensions.width > 100
    });

    const estimates = await FreightEstimator.getEstimate({
      postalCode,
      items,
      deliveryType: 'residential',
      accessType: 'ground-level',
      requiresLiftgate: true
    });

    const cheapest = estimates.reduce((min, est) =>
      est.price < min.price ? est : min
    );

    const fastest = estimates.reduce((min, est) =>
      est.estimatedDays.min < min.estimatedDays.min ? est : min
    );

    return {
      estimates,
      cheapest,
      fastest
    };
  }
}
