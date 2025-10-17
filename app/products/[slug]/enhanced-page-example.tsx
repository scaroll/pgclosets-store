/**
 * Enhanced Product Detail Page Example
 * Demonstrates integration of all product enhancement systems
 */

'use client';

import { useState } from 'react';
import { useProductPricing } from '@/hooks/use-product-pricing';
import { useShippingEstimate } from '@/hooks/use-shipping-estimate';
import FreightEstimatorWidget from '@/components/product/FreightEstimatorWidget';
import SampleKitCTA from '@/components/product/SampleKitCTA';
import { PriceDisplay } from '@/lib/pricing/pricing-engine';
import type { FinishOption, ProductSeries } from '@/types/product-taxonomy';

// Example product data
const EXAMPLE_SERIES: ProductSeries = {
  id: 'continental',
  name: 'Continental Series',
  brand: 'Renin',
  description: 'Modern barn door with clean lines and contemporary appeal',
  category: 'barn' as any,
  availableSizes: [
    { width: 48, height: 80, unit: 'inches' },
    { width: 72, height: 80, unit: 'inches' },
    { width: 96, height: 80, unit: 'inches' }
  ],
  availableFinishes: [
    {
      id: 'off-white',
      name: 'Off-White',
      type: 'painted' as any,
      priceModifier: 0,
      availability: 'standard',
      sampleAvailable: true,
      imageUrl: '/images/finishes/off-white.jpg'
    },
    {
      id: 'iron-age',
      name: 'Iron Age',
      type: 'painted' as any,
      priceModifier: 50,
      availability: 'standard',
      sampleAvailable: true,
      imageUrl: '/images/finishes/iron-age.jpg'
    },
    {
      id: 'macchiato',
      name: 'Macchiato',
      type: 'painted' as any,
      priceModifier: 50,
      availability: 'standard',
      sampleAvailable: true,
      imageUrl: '/images/finishes/macchiato.jpg'
    }
  ],
  availableMaterials: ['mdf' as any],
  availableHardware: [],
  constraints: [],
  openingRequirements: {
    minWidth: 24,
    maxWidth: 120,
    minHeight: 60,
    maxHeight: 96,
    recommendedClearance: { top: 2, sides: 1, bottom: 0.5 },
    unit: 'inches'
  },
  basePrice: 449,
  pricingRules: [],
  features: [
    'Modern barn door design',
    'Clean lines and contemporary appeal',
    'Premium MDF construction',
    'Multiple finish options',
    'Easy installation'
  ],
  specifications: [],
  highlights: [
    'Best-selling barn door',
    'Ships in 7-10 business days',
    'Free local pickup available'
  ],
  useCases: ['Closets', 'Pantries', 'Laundry rooms', 'Bedrooms'],
  images: ['/images/products/continental-1.jpg'],
  seo: {
    title: 'Continental Barn Door | Modern Design | Renin',
    description: 'Premium continental barn door with modern design',
    keywords: ['barn door', 'modern', 'continental']
  },
  popularity: 95,
  isBestseller: true,
  isNew: false,
  isFeatured: true
};

export default function EnhancedProductPage() {
  const [selectedFinish, setSelectedFinish] = useState<FinishOption>(
    EXAMPLE_SERIES.availableFinishes[0]!
  );
  const [customWidth, setCustomWidth] = useState(72);
  const [customHeight, setCustomHeight] = useState(80);

  // Use pricing hook
  const {
    pricing,
    fromPrice,
    financing,
    updateDimensions,
    updateFinish,
    isComplete
  } = useProductPricing({
    seriesId: EXAMPLE_SERIES.id,
    initialDimensions: { width: 72, height: 80, unit: 'inches' },
    initialFinish: selectedFinish
  });

  // Use shipping estimate hook
  const {
    postalCode,
    setPostalCode,
    deliveryPromise,
    postalCodeValidation,
    calculateEstimates
  } = useShippingEstimate({
    productWeight: 45, // kg
    productDimensions: { length: 244, width: 100, height: 10 }, // cm
    productValue: pricing?.totalPrice || 449,
    quantity: 1
  });

  // Handle finish selection
  const handleFinishChange = (finish: FinishOption) => {
    setSelectedFinish(finish);
    updateFinish(finish);
  };

  // Handle dimension changes
  const handleDimensionChange = () => {
    updateDimensions({ width: customWidth, height: customHeight, unit: 'inches' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={EXAMPLE_SERIES.images[0]}
              alt={EXAMPLE_SERIES.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            {EXAMPLE_SERIES.isBestseller && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                ⭐ Bestseller
              </span>
            )}
            {EXAMPLE_SERIES.isNew && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                ✨ New
              </span>
            )}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <p className="text-sm text-gray-600 mb-1">{EXAMPLE_SERIES.brand}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {EXAMPLE_SERIES.name}
            </h1>
            <p className="text-gray-700">{EXAMPLE_SERIES.description}</p>
          </div>

          {/* Pricing */}
          <div className="border-t border-b py-4">
            {pricing ? (
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {pricing.displayPrice}
                  </span>
                  {pricing.savingsFromMSRP && (
                    <span className="text-lg text-gray-500 line-through">
                      ${(pricing.totalPrice + pricing.savingsFromMSRP).toLocaleString()}
                    </span>
                  )}
                </div>

                {pricing.savingsFromMSRP && (
                  <p className="text-green-600 font-semibold mb-2">
                    Save ${pricing.savingsFromMSRP}
                  </p>
                )}

                {financing && (
                  <p className="text-sm text-gray-600">
                    or {PriceDisplay.formatMonthlyPayment(financing.monthly12.monthlyPayment)} with 12-month financing
                  </p>
                )}

                {/* Price Breakdown */}
                <details className="mt-4 text-sm">
                  <summary className="cursor-pointer font-medium text-gray-700">
                    See price breakdown
                  </summary>
                  <div className="mt-2 space-y-1 text-gray-600 pl-4">
                    <div className="flex justify-between">
                      <span>Base price ({customWidth}" × {customHeight}"):</span>
                      <span>${pricing.breakdown.base}</span>
                    </div>
                    {pricing.breakdown.finish > 0 && (
                      <div className="flex justify-between">
                        <span>Finish ({selectedFinish.name}):</span>
                        <span>+${pricing.breakdown.finish}</span>
                      </div>
                    )}
                    {pricing.breakdown.surcharges?.map((s, i) => (
                      <div key={i} className="flex justify-between text-orange-600">
                        <span>{s.name}:</span>
                        <span>+${s.amount}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {fromPrice.displayText}
                </p>
                <p className="text-sm text-gray-600">
                  Final price calculated based on your selections
                </p>
              </div>
            )}
          </div>

          {/* Sample Kit CTA */}
          <SampleKitCTA seriesId={EXAMPLE_SERIES.id} variant="inline" showAllKits />

          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Dimensions</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Width (inches)
                </label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  onBlur={handleDimensionChange}
                  min={24}
                  max={120}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Height (inches)
                </label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(Number(e.target.value))}
                  onBlur={handleDimensionChange}
                  min={60}
                  max={96}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Common Sizes */}
            <div className="flex gap-2">
              <p className="text-sm text-gray-600 mr-2">Common sizes:</p>
              {EXAMPLE_SERIES.availableSizes.map((size, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCustomWidth(size.width);
                    setCustomHeight(size.height);
                    updateDimensions(size);
                  }}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:border-blue-600 hover:bg-blue-50"
                >
                  {size.width}" × {size.height}"
                </button>
              ))}
            </div>
          </div>

          {/* Finish Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Finish</h3>

            <div className="grid grid-cols-3 gap-4">
              {EXAMPLE_SERIES.availableFinishes.map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => handleFinishChange(finish)}
                  className={`border-2 rounded-lg p-3 text-left transition ${
                    selectedFinish.id === finish.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {finish.imageUrl && (
                    <div className="w-full h-20 bg-gray-100 rounded mb-2 overflow-hidden">
                      <img
                        src={finish.imageUrl}
                        alt={finish.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="font-medium text-sm">{finish.name}</p>
                  {finish.priceModifier > 0 && (
                    <p className="text-xs text-gray-600">+${finish.priceModifier}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Estimate */}
          <div className="border-t pt-6">
            {deliveryPromise && postalCodeValidation.isValid ? (
              <div className="flex items-center gap-2 text-green-700 font-medium mb-4">
                <span>{deliveryPromise.icon}</span>
                <span>{deliveryPromise.text}</span>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Check delivery to your area
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="A1A 1A1"
                    maxLength={7}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={calculateEstimates}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Check
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <div className="space-y-3">
            <button
              disabled={!isComplete}
              className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              Add to Cart
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Save Configuration
              </button>
              <button className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Request Quote
              </button>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="border-t pt-6 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-2xl mb-1">✓</div>
              <p className="font-medium">Quality Guaranteed</p>
            </div>
            <div>
              <div className="text-2xl mb-1">📦</div>
              <p className="font-medium">Free Local Pickup</p>
            </div>
            <div>
              <div className="text-2xl mb-1">💳</div>
              <p className="font-medium">Financing Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Freight Estimator Widget */}
      <div className="mt-12">
        <FreightEstimatorWidget
          productWeight={45}
          productDimensions={{ length: 244, width: 100, height: 10 }}
          productValue={pricing?.totalPrice || 449}
          quantity={1}
          defaultPostalCode={postalCode}
        />
      </div>

      {/* Features */}
      <div className="mt-12 border-t pt-12">
        <h2 className="text-2xl font-bold mb-6">Features & Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXAMPLE_SERIES.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <p className="text-gray-700">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
