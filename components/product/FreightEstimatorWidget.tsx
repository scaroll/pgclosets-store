/**
 * Freight Estimator Widget
 * Displays shipping costs and delivery estimates based on postal code
 */

'use client';

import { useState } from 'react';
import { FreightEstimator, ShippingCalculator } from '@/lib/shipping/freight-estimator';
import type { ShippingEstimate } from '@/types/product-taxonomy';

interface FreightEstimatorWidgetProps {
  productWeight: number; // in kg
  productDimensions: {
    length: number; // in cm
    width: number;
    height: number;
  };
  productValue: number;
  quantity?: number;
  defaultPostalCode?: string;
}

export default function FreightEstimatorWidget({
  productWeight,
  productDimensions,
  productValue,
  quantity = 1,
  defaultPostalCode
}: FreightEstimatorWidgetProps) {
  const [postalCode, setPostalCode] = useState(defaultPostalCode || '');
  const [estimates, setEstimates] = useState<ShippingEstimate[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleEstimate = async () => {
    if (!postalCode) {
      setError('Please enter your postal code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Validate postal code
      const validation = FreightEstimator.validatePostalCode(postalCode);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid postal code');
        setIsLoading(false);
        return;
      }

      // Calculate shipping
      const result = await ShippingCalculator.calculateForProduct(
        productWeight,
        productDimensions,
        productValue,
        quantity,
        validation.formatted!
      );

      setEstimates(result.estimates);
      setSelectedMethod(result.cheapest.method);
    } catch (err) {
      setError('Unable to calculate shipping. Please try again.');
      console.error('Freight estimation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostalCodeChange = (value: string) => {
    // Auto-format postal code
    let formatted = value.toUpperCase().replace(/\s/g, '');
    if (formatted.length > 3) {
      formatted = `${formatted.slice(0, 3)} ${formatted.slice(3, 6)}`;
    }
    setPostalCode(formatted.slice(0, 7));
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold text-lg mb-4">Shipping & Delivery</h3>

      {/* Postal Code Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Enter your postal code for delivery estimate
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={postalCode}
            onChange={(e) => handlePostalCodeChange(e.target.value)}
            placeholder="A1A 1A1"
            maxLength={7}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleEstimate}
            disabled={isLoading || !postalCode}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Calculating...</span>
              </div>
            ) : (
              'Get Estimate'
            )}
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}
      </div>

      {/* Shipping Estimates */}
      {estimates && estimates.length > 0 && (
        <div className="space-y-3">
          {estimates.map((estimate, index) => (
            <div
              key={index}
              onClick={() => setSelectedMethod(estimate.method)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                selectedMethod === estimate.method
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">
                      {estimate.method === 'local-pickup' && '🚗 Local Pickup'}
                      {estimate.method === 'parcel' && '📦 Parcel Delivery'}
                      {estimate.method === 'ltl-freight' && '🚚 Freight Delivery'}
                      {estimate.method === 'white-glove' && '✨ White Glove Service'}
                    </h4>
                    {estimate.price === 0 && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {estimate.carrier}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">
                    {estimate.price === 0 ? 'Free' : `$${estimate.price}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {estimate.estimatedDays.min === estimate.estimatedDays.max
                      ? `${estimate.estimatedDays.min} ${estimate.estimatedDays.min === 1 ? 'day' : 'days'}`
                      : `${estimate.estimatedDays.min}-${estimate.estimatedDays.max} days`
                    }
                  </div>
                </div>
              </div>

              {/* Surcharges */}
              {estimate.surcharges && estimate.surcharges.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Includes:</p>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {estimate.surcharges.map((surcharge, idx) => (
                      <li key={idx}>• {surcharge.type}: +${surcharge.amount}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Restrictions */}
              {estimate.restrictions && estimate.restrictions.length > 0 && (
                <div className="mt-2">
                  <details className="text-xs text-gray-600">
                    <summary className="cursor-pointer font-medium">
                      Important information
                    </summary>
                    <ul className="mt-2 space-y-1 pl-4">
                      {estimate.restrictions.map((restriction, idx) => (
                        <li key={idx}>• {restriction}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}
            </div>
          ))}

          {/* Pickup Locations */}
          {estimates.some(e => e.method === 'local-pickup') && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">📍 Pickup Locations</h4>
              {FreightEstimator.getPickupLocations(postalCode).map((location, idx) => (
                <div key={idx} className="mb-3 last:mb-0">
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm text-gray-600">{location.address}</p>
                  <p className="text-sm text-gray-600">{location.hours}</p>
                  {location.distance && (
                    <p className="text-xs text-gray-500 mt-1">
                      ~{location.distance}km from your location
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Delivery Promise (before estimate) */}
      {!estimates && postalCode.length >= 6 && (
        <div className="text-sm text-gray-600 mt-2">
          <p>💡 Enter full postal code for accurate delivery estimate</p>
        </div>
      )}
    </div>
  );
}
