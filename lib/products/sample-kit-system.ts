/**
 * Sample Kit System with Credit-Back Logic
 * Allows customers to order finish samples with purchase credit
 */

import type { SampleKit, FinishOption, MaterialType } from '@/types/product-taxonomy';

export interface SampleKitOrder {
  id: string;
  customerId: string;
  kit: SampleKit;
  orderDate: Date;
  status: 'pending' | 'shipped' | 'delivered' | 'credit-redeemed' | 'expired';

  // Credit tracking
  creditAvailable: boolean;
  creditAmount: number;
  creditCode: string;
  creditExpirationDate: Date;
  creditRedeemedDate?: Date;
  creditRedeemedOrderId?: string;

  // Shipping
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  deliveredDate?: Date;
}

/**
 * Predefined Sample Kits
 */
export const SAMPLE_KITS: SampleKit[] = [
  {
    id: 'continental-finishes',
    name: 'Continental Series Finish Kit',
    description: 'Experience all finish options for our popular Continental series. Includes 6 finish samples (5" × 5" panels).',
    type: 'finish',
    samples: [
      {
        seriesId: 'continental',
        finish: {
          id: 'off-white',
          name: 'Off-White',
          type: 'painted' as any,
          priceModifier: 0,
          availability: 'standard',
          sampleAvailable: true
        },
        material: 'mdf' as MaterialType,
        size: { width: 5, height: 5, unit: 'inches' },
        sampleType: 'panel'
      },
      {
        seriesId: 'continental',
        finish: {
          id: 'iron-age',
          name: 'Iron Age',
          type: 'painted' as any,
          priceModifier: 50,
          availability: 'standard',
          sampleAvailable: true
        },
        material: 'mdf' as MaterialType,
        size: { width: 5, height: 5, unit: 'inches' },
        sampleType: 'panel'
      },
      {
        seriesId: 'continental',
        finish: {
          id: 'macchiato',
          name: 'Macchiato',
          type: 'painted' as any,
          priceModifier: 50,
          availability: 'standard',
          sampleAvailable: true
        },
        material: 'mdf' as MaterialType,
        size: { width: 5, height: 5, unit: 'inches' },
        sampleType: 'panel'
      },
      {
        seriesId: 'continental',
        finish: {
          id: 'charcoal',
          name: 'Charcoal',
          type: 'painted' as any,
          priceModifier: 50,
          availability: 'premium',
          sampleAvailable: true
        },
        material: 'mdf' as MaterialType,
        size: { width: 5, height: 5, unit: 'inches' },
        sampleType: 'panel'
      },
      {
        seriesId: 'continental',
        finish: {
          id: 'natural-oak',
          name: 'Natural Oak',
          type: 'stained' as any,
          priceModifier: 75,
          availability: 'premium',
          sampleAvailable: true
        },
        material: 'solid-wood' as MaterialType,
        size: { width: 5, height: 5, unit: 'inches' },
        sampleType: 'panel'
      },
      {
        seriesId: 'continental',
        finish: {
          id: 'espresso',
          name: 'Espresso',
          type: 'stained' as any,
          priceModifier: 75,
          availability: 'premium',
          sampleAvailable: true
        },
        material: 'solid-wood' as MaterialType,
        size: { width: 5, height: 5, unit: 'inches' },
        sampleType: 'panel'
      }
    ],
    pricing: {
      price: 29.99,
      refundable: false,
      creditAmount: 50,
      creditConditions: 'Valid on door purchases over $500. Must be redeemed within 60 days.',
      creditExpirationDays: 60
    },
    shipping: {
      method: 'standard',
      price: 9.99,
      estimatedDays: 5
    },
    availability: 'in-stock',
    processingTimeDays: 1
  },
  {
    id: 'heritage-finishes',
    name: 'Heritage Series Finish Kit',
    description: 'Classic finishes for Heritage series doors. Includes 8 finish samples (5" × 5" panels).',
    type: 'finish',
    samples: [
      // Similar structure with Heritage finishes
    ] as any,
    pricing: {
      price: 34.99,
      refundable: false,
      creditAmount: 50,
      creditConditions: 'Valid on door purchases over $500. Must be redeemed within 60 days.',
      creditExpirationDays: 60
    },
    shipping: {
      method: 'standard',
      price: 9.99,
      estimatedDays: 5
    },
    availability: 'in-stock',
    processingTimeDays: 1
  },
  {
    id: 'complete-sample-collection',
    name: 'Complete Sample Collection',
    description: 'Experience our full range. Includes finish samples from all series, material swatches, and hardware samples.',
    type: 'complete',
    samples: [] as any, // Would include samples from all series
    pricing: {
      price: 79.99,
      refundable: false,
      creditAmount: 100,
      creditConditions: 'Valid on any door purchase over $750. Must be redeemed within 90 days.',
      creditExpirationDays: 90
    },
    shipping: {
      method: 'expedited',
      price: 0, // Free shipping
      estimatedDays: 3
    },
    availability: 'in-stock',
    processingTimeDays: 1
  },
  {
    id: 'custom-sample-kit',
    name: 'Custom Sample Kit',
    description: 'Build your own sample kit. Select up to 10 finish and material samples.',
    type: 'custom',
    samples: [], // Customer selects
    pricing: {
      price: 0, // Calculated based on selections ($4.99 per sample)
      refundable: false,
      creditAmount: 50,
      creditConditions: 'Valid on door purchases over $500. Must be redeemed within 60 days.',
      creditExpirationDays: 60
    },
    shipping: {
      method: 'standard',
      price: 9.99,
      estimatedDays: 5
    },
    availability: 'made-to-order',
    processingTimeDays: 3
  }
];

/**
 * Sample Kit Credit Management
 */
export class SampleKitCreditManager {
  /**
   * Generate unique credit code
   */
  static generateCreditCode(orderId: string): string {
    const prefix = 'SAMPLE';
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}-${random}`;
  }

  /**
   * Calculate credit expiration date
   */
  static calculateExpirationDate(orderDate: Date, days: number): Date {
    const expDate = new Date(orderDate);
    expDate.setDate(expDate.getDate() + days);
    return expDate;
  }

  /**
   * Validate credit code
   */
  static async validateCreditCode(
    creditCode: string
  ): Promise<{
    isValid: boolean;
    order?: SampleKitOrder;
    reason?: string;
  }> {
    // This would query database in production
    // For now, return mock validation

    // Check format
    if (!creditCode.startsWith('SAMPLE-')) {
      return {
        isValid: false,
        reason: 'Invalid credit code format'
      };
    }

    // Mock: Check if code exists (would query DB)
    const order = await this.findOrderByCreditCode(creditCode);

    if (!order) {
      return {
        isValid: false,
        reason: 'Credit code not found'
      };
    }

    // Check if already redeemed
    if (order.status === 'credit-redeemed') {
      return {
        isValid: false,
        reason: `Credit already redeemed on ${order.creditRedeemedDate?.toLocaleDateString()}`
      };
    }

    // Check if expired
    if (order.status === 'expired' || new Date() > order.creditExpirationDate) {
      return {
        isValid: false,
        reason: `Credit expired on ${order.creditExpirationDate.toLocaleDateString()}`
      };
    }

    // Check if delivered (credit only available after delivery)
    if (order.status !== 'delivered') {
      return {
        isValid: false,
        reason: 'Credit available after sample kit is delivered'
      };
    }

    return {
      isValid: true,
      order
    };
  }

  /**
   * Apply credit to cart
   */
  static async applyCreditToCart(
    creditCode: string,
    cartTotal: number,
    cartItems: any[]
  ): Promise<{
    success: boolean;
    discountAmount: number;
    message: string;
    updatedTotal: number;
  }> {
    const validation = await this.validateCreditCode(creditCode);

    if (!validation.isValid) {
      return {
        success: false,
        discountAmount: 0,
        message: validation.reason || 'Invalid credit code',
        updatedTotal: cartTotal
      };
    }

    const order = validation.order!;
    const creditAmount = order.creditAmount;

    // Check minimum purchase requirement
    const minPurchase = this.getMinimumPurchase(order.kit);
    if (cartTotal < minPurchase) {
      return {
        success: false,
        discountAmount: 0,
        message: `Minimum purchase of $${minPurchase} required to use this credit`,
        updatedTotal: cartTotal
      };
    }

    // Apply credit (cannot exceed cart total)
    const discountAmount = Math.min(creditAmount, cartTotal);
    const updatedTotal = cartTotal - discountAmount;

    return {
      success: true,
      discountAmount,
      message: `Sample kit credit of $${discountAmount} applied!`,
      updatedTotal
    };
  }

  /**
   * Redeem credit
   */
  static async redeemCredit(
    creditCode: string,
    orderId: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const validation = await this.validateCreditCode(creditCode);

    if (!validation.isValid) {
      return {
        success: false,
        message: validation.reason || 'Invalid credit code'
      };
    }

    // Mark credit as redeemed (would update database)
    const order = validation.order!;
    order.status = 'credit-redeemed';
    order.creditRedeemedDate = new Date();
    order.creditRedeemedOrderId = orderId;

    return {
      success: true,
      message: `Credit of $${order.creditAmount} successfully applied to your order`
    };
  }

  /**
   * Get credit details
   */
  static async getCreditDetails(creditCode: string): Promise<{
    isValid: boolean;
    creditAmount?: number;
    expirationDate?: Date;
    daysRemaining?: number;
    kitName?: string;
    conditions?: string;
  }> {
    const validation = await this.validateCreditCode(creditCode);

    if (!validation.isValid) {
      return { isValid: false };
    }

    const order = validation.order!;
    const daysRemaining = Math.ceil(
      (order.creditExpirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return {
      isValid: true,
      creditAmount: order.creditAmount,
      expirationDate: order.creditExpirationDate,
      daysRemaining,
      kitName: order.kit.name,
      conditions: order.kit.pricing.creditConditions
    };
  }

  // Helper methods

  private static async findOrderByCreditCode(
    creditCode: string
  ): Promise<SampleKitOrder | null> {
    // This would query database in production
    // For now, return mock order
    return null;
  }

  private static getMinimumPurchase(kit: SampleKit): number {
    // Extract minimum from conditions string
    const match = kit.pricing.creditConditions?.match(/\$(\d+)/);
    return match ? parseInt(match[1]) : 500;
  }
}

/**
 * Sample Kit Product Data (for e-commerce integration)
 */
export const sampleKitProducts = SAMPLE_KITS.map((kit) => ({
  id: kit.id,
  name: kit.name,
  description: kit.description,
  category: 'Sample Kits',
  price: kit.pricing.price,
  shippingPrice: kit.shipping.price,
  images: [
    `/images/sample-kits/${kit.id}-primary.jpg`,
    `/images/sample-kits/${kit.id}-contents.jpg`
  ],
  features: [
    `${kit.samples.length} finish samples included`,
    `$${kit.pricing.creditAmount} purchase credit`,
    kit.pricing.creditConditions || '',
    `Ships in ${kit.shipping.estimatedDays} days`,
    kit.shipping.price === 0 ? 'Free shipping' : `Shipping: $${kit.shipping.price}`
  ],
  metadata: {
    type: kit.type,
    creditAmount: kit.pricing.creditAmount,
    creditExpirationDays: kit.pricing.creditExpirationDays,
    sampleCount: kit.samples.length,
    availability: kit.availability
  },
  sku: `SAMPLE-KIT-${kit.id.toUpperCase()}`,
  inStock: kit.availability === 'in-stock',
  leadTime: kit.processingTimeDays
}));
