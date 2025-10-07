/**
 * Custom Hook for Shipping Estimates
 * Manages postal code validation and freight calculations
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { FreightEstimator, ShippingCalculator } from '@/lib/shipping/freight-estimator';
import type { ShippingEstimate, FreightCalculationInput } from '@/types/product-taxonomy';

interface UseShippingEstimateOptions {
  productWeight: number;
  productDimensions: {
    length: number;
    width: number;
    height: number;
  };
  productValue: number;
  quantity?: number;
  defaultPostalCode?: string;
  autoCalculate?: boolean;
}

export function useShippingEstimate({
  productWeight,
  productDimensions,
  productValue,
  quantity = 1,
  defaultPostalCode,
  autoCalculate = false
}: UseShippingEstimateOptions) {
  const [postalCode, setPostalCode] = useState(defaultPostalCode || '');
  const [estimates, setEstimates] = useState<ShippingEstimate[] | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate postal code as user types
  const postalCodeValidation = useMemo(() => {
    if (!postalCode) {
      return { isValid: false, error: null };
    }

    return FreightEstimator.validatePostalCode(postalCode);
  }, [postalCode]);

  // Calculate estimates
  const calculateEstimates = useCallback(async () => {
    if (!postalCodeValidation.isValid) {
      setError(postalCodeValidation.error || 'Invalid postal code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await ShippingCalculator.calculateForProduct(
        productWeight,
        productDimensions,
        productValue,
        quantity,
        postalCodeValidation.formatted!
      );

      setEstimates(result.estimates);

      // Auto-select cheapest method
      if (result.estimates.length > 0) {
        setSelectedMethod(result.cheapest.method);
      }
    } catch (err) {
      setError('Unable to calculate shipping. Please try again.');
      console.error('Shipping calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    postalCodeValidation,
    productWeight,
    productDimensions,
    productValue,
    quantity
  ]);

  // Auto-calculate when postal code is valid and autoCalculate is true
  useEffect(() => {
    if (autoCalculate && postalCodeValidation.isValid) {
      calculateEstimates();
    }
  }, [autoCalculate, postalCodeValidation.isValid, calculateEstimates]);

  // Get delivery promise without full calculation
  const deliveryPromise = useMemo(() => {
    if (!postalCodeValidation.isValid) return null;

    return FreightEstimator.getDeliveryPromise(
      postalCodeValidation.formatted!,
      true // Assume in stock
    );
  }, [postalCodeValidation]);

  // Get selected estimate details
  const selectedEstimate = useMemo(() => {
    if (!estimates || !selectedMethod) return null;
    return estimates.find(e => e.method === selectedMethod) || null;
  }, [estimates, selectedMethod]);

  // Get cheapest and fastest options
  const cheapestOption = useMemo(() => {
    if (!estimates) return null;
    return estimates.reduce((min, est) =>
      est.price < min.price ? est : min
    );
  }, [estimates]);

  const fastestOption = useMemo(() => {
    if (!estimates) return null;
    return estimates.reduce((min, est) =>
      est.estimatedDays.min < min.estimatedDays.min ? est : min
    );
  }, [estimates]);

  // Format postal code as user types
  const updatePostalCode = useCallback((value: string) => {
    let formatted = value.toUpperCase().replace(/\s/g, '');
    if (formatted.length > 3) {
      formatted = `${formatted.slice(0, 3)} ${formatted.slice(3, 6)}`;
    }
    setPostalCode(formatted.slice(0, 7));
  }, []);

  // Reset
  const reset = useCallback(() => {
    setEstimates(null);
    setSelectedMethod(null);
    setError(null);
  }, []);

  return {
    postalCode,
    setPostalCode: updatePostalCode,
    postalCodeValidation,
    estimates,
    selectedMethod,
    setSelectedMethod,
    selectedEstimate,
    cheapestOption,
    fastestOption,
    deliveryPromise,
    isLoading,
    error,
    calculateEstimates,
    reset
  };
}

/**
 * Hook for local pickup locations
 */
export function usePickupLocations(postalCode: string) {
  const [locations, setLocations] = useState<ReturnType<typeof FreightEstimator.getPickupLocations>>([]);

  useEffect(() => {
    if (!postalCode || postalCode.length < 6) {
      setLocations([]);
      return;
    }

    const validation = FreightEstimator.validatePostalCode(postalCode);
    if (validation.isValid) {
      const locs = FreightEstimator.getPickupLocations(validation.formatted!);
      setLocations(locs);
    }
  }, [postalCode]);

  return {
    locations,
    hasPickupAvailable: locations.length > 0
  };
}

/**
 * Hook for delivery date estimation
 */
export function useDeliveryEstimate(postalCode: string, inStock: boolean = true) {
  const estimate = useMemo(() => {
    if (!postalCode || postalCode.length < 6) return null;

    const validation = FreightEstimator.validatePostalCode(postalCode);
    if (!validation.isValid) return null;

    return FreightEstimator.getDeliveryPromise(validation.formatted!, inStock);
  }, [postalCode, inStock]);

  const daysUntilDelivery = useMemo(() => {
    if (!estimate) return null;

    const today = new Date();
    const minDate = estimate.dateRange.min;
    const diffTime = minDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }, [estimate]);

  return {
    estimate,
    daysUntilDelivery,
    text: estimate?.text,
    icon: estimate?.icon
  };
}

/**
 * Hook for cart-level shipping calculations
 */
export function useCartShipping(
  items: Array<{
    weight: number;
    dimensions: { length: number; width: number; height: number };
    value: number;
    quantity: number;
  }>,
  postalCode: string
) {
  const [estimates, setEstimates] = useState<ShippingEstimate[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateCartShipping = useCallback(async () => {
    const validation = FreightEstimator.validatePostalCode(postalCode);
    if (!validation.isValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Flatten items for calculation
      const flatItems = items.flatMap(item =>
        Array(item.quantity).fill({
          weight: item.weight,
          dimensions: item.dimensions,
          value: item.value,
          isFragile: true,
          requiresSpecialHandling: item.dimensions.length > 200
        })
      );

      const result = await FreightEstimator.getEstimate({
        postalCode: validation.formatted!,
        items: flatItems,
        deliveryType: 'residential',
        accessType: 'ground-level',
        requiresLiftgate: true
      });

      setEstimates(result);
    } catch (err) {
      console.error('Cart shipping calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [items, postalCode]);

  useEffect(() => {
    if (postalCode && items.length > 0) {
      calculateCartShipping();
    }
  }, [postalCode, items, calculateCartShipping]);

  const freeShippingThreshold = useMemo(() => {
    // Example: Free shipping on orders over $1000 locally
    const validation = FreightEstimator.validatePostalCode(postalCode);
    if (!validation.isValid) return null;

    // This would be configurable per zone
    return 1000;
  }, [postalCode]);

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value * item.quantity, 0);
  }, [items]);

  const amountToFreeShipping = useMemo(() => {
    if (!freeShippingThreshold) return null;
    const remaining = freeShippingThreshold - totalValue;
    return remaining > 0 ? remaining : 0;
  }, [freeShippingThreshold, totalValue]);

  return {
    estimates,
    isLoading,
    freeShippingThreshold,
    amountToFreeShipping,
    qualifiesForFreeShipping: amountToFreeShipping === 0,
    calculateCartShipping
  };
}

/**
 * Hook for shipping zone information
 */
export function useShippingZone(postalCode: string) {
  const zoneInfo = useMemo(() => {
    if (!postalCode || postalCode.length < 2) return null;

    const validation = FreightEstimator.validatePostalCode(postalCode);
    if (!validation.isValid) return null;

    // This is a simplified version - the actual logic is in FreightEstimator
    const prefix = validation.formatted!.substring(0, 2);

    if (['K1', 'K2', 'K4'].includes(prefix)) {
      return {
        zone: 'local',
        name: 'Ottawa',
        description: 'Free local pickup available',
        icon: '🚗'
      };
    } else if (['J8', 'J9', 'K0', 'K7'].includes(prefix)) {
      return {
        zone: 'nearby',
        name: 'Greater Ottawa Area',
        description: 'Fast delivery available',
        icon: '🚚'
      };
    } else {
      return {
        zone: 'regional',
        name: 'Regional',
        description: 'Delivery available',
        icon: '📦'
      };
    }
  }, [postalCode]);

  return zoneInfo;
}
