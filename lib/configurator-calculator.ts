/**
 * Instant Estimate Calculator
 *
 * Calculates price ranges for custom closet doors based on dimensions,
 * panel count, finishes, and add-ons.
 */

import type { ProductConfiguratorData, ConfiguratorState, EstimateResult } from '@/types/configurator';

export class ConfiguratorCalculator {
  /**
   * Calculate instant estimate for a product configuration
   */
  static calculate(
    configuratorData: ProductConfiguratorData,
    state: ConfiguratorState
  ): EstimateResult {
    // Validate dimensions
    if (!state.width || !state.height) {
      throw new Error('Width and height are required');
    }

    // Convert to inches if needed
    const widthInches = state.widthUnit === 'mm' ? state.width / 25.4 : state.width;
    const heightInches = state.heightUnit === 'mm' ? state.height / 25.4 : state.height;

    // Validate ranges
    if (widthInches < configuratorData.opening_min_width || widthInches > configuratorData.opening_max_width) {
      throw new Error(`Width must be between ${configuratorData.opening_min_width}" and ${configuratorData.opening_max_width}"`);
    }
    if (heightInches < configuratorData.opening_min_height || heightInches > configuratorData.opening_max_height) {
      throw new Error(`Height must be between ${configuratorData.opening_min_height}" and ${configuratorData.opening_max_height}"`);
    }

    // Base price (already in cents)
    let basePriceLow = configuratorData.installed_price_from_cad;
    let basePriceHigh = configuratorData.installed_price_from_cad;

    // Add panel price if multiple panels
    if (state.panels && state.panels > 1) {
      const additionalPanels = state.panels - 1;
      const panelCost = additionalPanels * configuratorData.price_per_panel;
      basePriceLow += panelCost;
      basePriceHigh += panelCost;
    }

    // Add size-based pricing (10% for sizes near max)
    const sizeFactorWidth = widthInches / configuratorData.opening_max_width;
    const sizeFactorHeight = heightInches / configuratorData.opening_max_height;
    const sizeFactor = (sizeFactorWidth + sizeFactorHeight) / 2;

    if (sizeFactor > 0.8) {
      const sizeUpcharge = Math.floor(basePriceLow * 0.1);
      basePriceHigh += sizeUpcharge;
    }

    // Add finish price modifier
    if (state.finish) {
      const finishOption = configuratorData.finish_options.find(f => f.id === state.finish);
      if (finishOption && finishOption.price_modifier !== 0) {
        basePriceLow += finishOption.price_modifier;
        basePriceHigh += finishOption.price_modifier;
      }
    }

    // Calculate addon prices
    const selectedAddons = configuratorData.addons.filter(addon =>
      state.addons.includes(addon.id)
    );

    const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price_cad, 0);

    return {
      price_low: basePriceLow,
      price_high: basePriceHigh,
      includes: configuratorData.includes,
      addons: selectedAddons.map(addon => ({
        id: addon.id,
        name: addon.name,
        price: addon.price_cad
      })),
      total_with_addons: basePriceHigh + addonTotal,
      lead_time_weeks: configuratorData.lead_time_weeks
    };
  }

  /**
   * Format price in CAD
   */
  static formatPrice(cents: number): string {
    const dollars = cents / 100;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(dollars);
  }

  /**
   * Format price range
   */
  static formatPriceRange(low: number, high: number): string {
    if (low === high) {
      return this.formatPrice(low);
    }
    return `${this.formatPrice(low)} – ${this.formatPrice(high)}`;
  }

  /**
   * Quick estimate without full state (for collection cards)
   */
  static quickEstimate(
    configuratorData: ProductConfiguratorData,
    width: number,
    height: number,
    panels: number = 2
  ): { low: number; high: number } {
    const state: ConfiguratorState = {
      width,
      height,
      widthUnit: 'in',
      heightUnit: 'in',
      panels,
      finish: null,
      addons: []
    };

    try {
      const result = this.calculate(configuratorData, state);
      return {
        low: result.price_low,
        high: result.price_high
      };
    } catch {
      // Return base price if calculation fails
      return {
        low: configuratorData.installed_price_from_cad,
        high: configuratorData.installed_price_from_cad
      };
    }
  }
}

/**
 * Service area calculator
 */
export class ServiceAreaCalculator {
  private static readonly OTTAWA_CENTER = { lat: 45.4215, lng: -75.6972 };
  private static readonly FREE_MEASURE_RADIUS_KM = 30;
  private static readonly OUTSIDE_RADIUS_FEE = 5000; // $50 in cents

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  /**
   * Check if address is within free measure radius
   */
  static isWithinFreeRadius(lat: number, lng: number): boolean {
    const distance = this.calculateDistance(
      this.OTTAWA_CENTER.lat,
      this.OTTAWA_CENTER.lng,
      lat,
      lng
    );
    return distance <= this.FREE_MEASURE_RADIUS_KM;
  }

  /**
   * Get measure fee for address
   */
  static getMeasureFee(lat: number, lng: number): number {
    return this.isWithinFreeRadius(lat, lng) ? 0 : this.OUTSIDE_RADIUS_FEE;
  }

  /**
   * Get distance from Ottawa center
   */
  static getDistanceFromCenter(lat: number, lng: number): number {
    return this.calculateDistance(
      this.OTTAWA_CENTER.lat,
      this.OTTAWA_CENTER.lng,
      lat,
      lng
    );
  }
}
