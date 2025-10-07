/**
 * Custom Hook for Product Pricing
 * Manages product configuration and real-time price calculations
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PricingEngine, PriceDisplay } from '@/lib/pricing/pricing-engine';
import type {
  ProductConfiguration,
  OpeningDimensions,
  FinishOption,
  GlassOption,
  HardwareOption
} from '@/types/product-taxonomy';

interface UsePricingOptions {
  seriesId: string;
  initialDimensions?: OpeningDimensions;
  initialFinish?: FinishOption;
  onPriceChange?: (price: number) => void;
}

export function useProductPricing({
  seriesId,
  initialDimensions,
  initialFinish,
  onPriceChange
}: UsePricingOptions) {
  const [configuration, setConfiguration] = useState<Partial<ProductConfiguration>>({
    seriesId,
    dimensions: initialDimensions,
    finish: initialFinish
  });

  // Calculate pricing whenever configuration changes
  const pricing = useMemo(() => {
    if (!isConfigurationComplete(configuration)) {
      return null;
    }

    return PricingEngine.calculateTotalPrice(configuration as ProductConfiguration);
  }, [configuration]);

  // Notify parent of price changes
  useEffect(() => {
    if (pricing && onPriceChange) {
      onPriceChange(pricing.totalPrice);
    }
  }, [pricing, onPriceChange]);

  // Update dimensions
  const updateDimensions = useCallback((dimensions: OpeningDimensions) => {
    setConfiguration(prev => ({ ...prev, dimensions }));
  }, []);

  // Update finish
  const updateFinish = useCallback((finish: FinishOption) => {
    setConfiguration(prev => ({ ...prev, finish }));
  }, []);

  // Update glass
  const updateGlass = useCallback((glass?: GlassOption) => {
    setConfiguration(prev => ({ ...prev, glass }));
  }, []);

  // Update hardware
  const updateHardware = useCallback((hardware: Partial<ProductConfiguration>) => {
    setConfiguration(prev => ({ ...prev, ...hardware }));
  }, []);

  // Get base price for current dimensions
  const basePrice = useMemo(() => {
    if (!configuration.dimensions) return null;

    return PricingEngine.calculateByDimensions(seriesId, configuration.dimensions);
  }, [seriesId, configuration.dimensions]);

  // Get "From $X" pricing for series
  const fromPrice = useMemo(() => {
    return PricingEngine.getFromPrice(seriesId);
  }, [seriesId]);

  // Calculate financing
  const financing = useMemo(() => {
    if (!pricing) return null;

    return {
      monthly12: PricingEngine.calculateFinancing(pricing.totalPrice, 12),
      monthly24: PricingEngine.calculateFinancing(pricing.totalPrice, 24),
      monthly36: PricingEngine.calculateFinancing(pricing.totalPrice, 36)
    };
  }, [pricing]);

  // Reset configuration
  const reset = useCallback(() => {
    setConfiguration({
      seriesId,
      dimensions: initialDimensions,
      finish: initialFinish
    });
  }, [seriesId, initialDimensions, initialFinish]);

  return {
    configuration,
    pricing,
    basePrice,
    fromPrice,
    financing,
    updateDimensions,
    updateFinish,
    updateGlass,
    updateHardware,
    reset,
    isComplete: isConfigurationComplete(configuration)
  };
}

/**
 * Hook for managing volume pricing and discounts
 */
export function useVolumePricing(unitPrice: number, initialQuantity: number = 1) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const volumeDiscount = useMemo(() => {
    return PricingEngine.calculateVolumeDiscount(quantity, unitPrice);
  }, [quantity, unitPrice]);

  const totalPrice = useMemo(() => {
    return volumeDiscount.finalPrice;
  }, [volumeDiscount]);

  const savings = useMemo(() => {
    return volumeDiscount.discountAmount;
  }, [volumeDiscount]);

  return {
    quantity,
    setQuantity,
    unitPrice,
    totalPrice,
    savings,
    discountPercentage: volumeDiscount.discountPercentage,
    pricePerUnit: totalPrice / quantity
  };
}

/**
 * Hook for price comparison and display
 */
export function usePriceDisplay(price: number, msrp?: number) {
  const savings = useMemo(() => {
    if (!msrp || msrp <= price) return null;
    return msrp - price;
  }, [price, msrp]);

  const savingsPercentage = useMemo(() => {
    if (!savings || !msrp) return null;
    return Math.round((savings / msrp) * 100);
  }, [savings, msrp]);

  const formatted = useMemo(() => {
    return PriceDisplay.formatWithSavings(price, savings || undefined);
  }, [price, savings]);

  const monthlyPayment = useMemo(() => {
    const financing = PricingEngine.calculateFinancing(price, 12);
    return PriceDisplay.formatMonthlyPayment(financing.monthlyPayment);
  }, [price]);

  return {
    price,
    formatted,
    savings,
    savingsPercentage,
    monthlyPayment,
    msrp
  };
}

/**
 * Hook for tracking price history and showing best price indicators
 */
export function usePriceHistory(currentPrice: number, productId: string) {
  const [priceHistory, setPriceHistory] = useState<Array<{ date: Date; price: number }>>([]);
  const [isLowestPrice, setIsLowestPrice] = useState(false);

  useEffect(() => {
    // In production, this would fetch from database
    // For now, just track in memory
    const historyKey = `price_history_${productId}`;
    const stored = localStorage.getItem(historyKey);

    if (stored) {
      const parsed = JSON.parse(stored);
      setPriceHistory(parsed.map((p: any) => ({ ...p, date: new Date(p.date) })));
    }

    // Add current price to history
    const newHistory = [
      ...priceHistory,
      { date: new Date(), price: currentPrice }
    ].slice(-30); // Keep last 30 entries

    setPriceHistory(newHistory);
    localStorage.setItem(historyKey, JSON.stringify(newHistory));

    // Check if this is the lowest price
    const lowestHistorical = Math.min(...newHistory.map(h => h.price));
    setIsLowestPrice(currentPrice <= lowestHistorical);
  }, [currentPrice, productId]);

  const averagePrice = useMemo(() => {
    if (priceHistory.length === 0) return currentPrice;
    return priceHistory.reduce((sum, h) => sum + h.price, 0) / priceHistory.length;
  }, [priceHistory, currentPrice]);

  const priceChange = useMemo(() => {
    if (priceHistory.length < 2) return null;
    const previous = priceHistory[priceHistory.length - 2].price;
    return currentPrice - previous;
  }, [priceHistory, currentPrice]);

  return {
    currentPrice,
    averagePrice,
    isLowestPrice,
    priceChange,
    priceHistory
  };
}

/**
 * Hook for comparing prices across different configurations
 */
export function useConfigurationComparison(configurations: Partial<ProductConfiguration>[]) {
  const pricings = useMemo(() => {
    return configurations
      .filter(isConfigurationComplete)
      .map(config => ({
        config,
        pricing: PricingEngine.calculateTotalPrice(config as ProductConfiguration)
      }));
  }, [configurations]);

  const cheapest = useMemo(() => {
    if (pricings.length === 0) return null;
    return pricings.reduce((min, p) =>
      p.pricing.totalPrice < min.pricing.totalPrice ? p : min
    );
  }, [pricings]);

  const mostExpensive = useMemo(() => {
    if (pricings.length === 0) return null;
    return pricings.reduce((max, p) =>
      p.pricing.totalPrice > max.pricing.totalPrice ? p : max
    );
  }, [pricings]);

  const priceRange = useMemo(() => {
    if (!cheapest || !mostExpensive) return null;
    return {
      min: cheapest.pricing.totalPrice,
      max: mostExpensive.pricing.totalPrice,
      difference: mostExpensive.pricing.totalPrice - cheapest.pricing.totalPrice
    };
  }, [cheapest, mostExpensive]);

  return {
    pricings,
    cheapest,
    mostExpensive,
    priceRange
  };
}

// Helper function
function isConfigurationComplete(config: Partial<ProductConfiguration>): boolean {
  return !!(
    config.seriesId &&
    config.dimensions &&
    config.finish
  );
}
