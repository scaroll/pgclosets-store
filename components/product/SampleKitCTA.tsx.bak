/**
 * Sample Kit Call-to-Action Component
 * Displays sample kit offers with credit-back information
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SAMPLE_KITS } from '@/lib/products/sample-kit-system';
import type { SampleKit } from '@/types/product-taxonomy';

interface SampleKitCTAProps {
  seriesId: string;
  variant?: 'inline' | 'banner' | 'modal';
  showAllKits?: boolean;
}

export default function SampleKitCTA({
  seriesId,
  variant = 'inline',
  showAllKits = false
}: SampleKitCTAProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Find relevant sample kit for this series
  const relevantKit = SAMPLE_KITS.find(kit =>
    kit.id.includes(seriesId.toLowerCase())
  ) || SAMPLE_KITS[0]; // Default to first kit

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-4xl">
            🎨
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Not sure about the finish?
            </h3>
            <p className="text-gray-700 mb-3">
              Order a sample kit and see the quality for yourself.
              <strong className="text-blue-700"> Get ${relevantKit.pricing.creditAmount} back</strong> when you purchase your door!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/products/sample-kits/${relevantKit.id}`}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Order {relevantKit.name} - ${relevantKit.pricing.price}
              </Link>
              {showAllKits && (
                <Link
                  href="/products/sample-kits"
                  className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  View All Sample Kits
                </Link>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-3">
              {relevantKit.pricing.creditConditions}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'modal' || isExpanded) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Try Before You Buy</h2>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Experience our finishes in person. Order samples and get credit back toward your purchase.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(showAllKits ? SAMPLE_KITS : [relevantKit]).map((kit) => (
                <SampleKitCard key={kit.id} kit={kit} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-2xl">
          🎨
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">
            Try a Sample Kit
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            Get ${relevantKit.pricing.creditAmount} credit back on your door purchase.
            Samples ship in {relevantKit.processingTimeDays} {relevantKit.processingTimeDays === 1 ? 'day' : 'days'}.
          </p>
          <div className="flex gap-2">
            <Link
              href={`/products/sample-kits/${relevantKit.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Order Samples - ${relevantKit.pricing.price}
            </Link>
            {showAllKits && (
              <button
                onClick={() => setIsExpanded(true)}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
              >
                See All Kits
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SampleKitCard({ kit }: { kit: SampleKit }) {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{kit.name}</h3>
        <span className="text-sm font-bold text-blue-600">
          ${kit.pricing.price}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3">{kit.description}</p>

      <div className="bg-green-50 border border-green-200 rounded p-2 mb-3">
        <p className="text-sm font-semibold text-green-800">
          💰 ${kit.pricing.creditAmount} Credit Back
        </p>
        <p className="text-xs text-green-700">
          {kit.pricing.creditConditions}
        </p>
      </div>

      <ul className="text-xs text-gray-600 space-y-1 mb-3">
        <li>✓ {kit.samples.length} finish samples included</li>
        <li>✓ Ships in {kit.processingTimeDays} {kit.processingTimeDays === 1 ? 'day' : 'days'}</li>
        <li>✓ {kit.shipping.price === 0 ? 'Free shipping' : `Shipping: $${kit.shipping.price}`}</li>
        <li>✓ {kit.pricing.creditExpirationDays}-day credit expiration</li>
      </ul>

      <Link
        href={`/products/sample-kits/${kit.id}`}
        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
      >
        Order This Kit
      </Link>
    </div>
  );
}

/**
 * Exit Intent Sample Kit Popup
 * Shows when user is about to leave without purchasing
 */
export function ExitIntentSampleKit({ seriesId }: { seriesId: string }) {
  const [isVisible, setIsVisible] = useState(false);

  // Exit intent logic would go here
  // For now, just a component structure

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Wait! Before you go...</h2>
        <p className="text-gray-700 mb-6">
          Not ready to commit? Order a sample kit to experience our quality finishes
          in person. You'll get credit back toward your purchase!
        </p>
        <SampleKitCTA seriesId={seriesId} variant="inline" showAllKits />
        <button
          onClick={() => setIsVisible(false)}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          No thanks, I'll continue browsing
        </button>
      </div>
    </div>
  );
}

/**
 * Sample Credit Input Component
 * For checkout page to apply sample kit credits
 */
export function SampleCreditInput({ onCreditApplied }: { onCreditApplied?: (amount: number) => void }) {
  const [creditCode, setCreditCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleApplyCredit = async () => {
    if (!creditCode) {
      setError('Please enter a credit code');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // This would call the actual API
      // For now, just simulate
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful credit application
      const creditAmount = 50;
      setSuccess(`Credit of $${creditAmount} applied!`);
      onCreditApplied?.(creditAmount);
    } catch (err) {
      setError('Invalid or expired credit code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <label className="block font-medium mb-2">
        Have a sample kit credit code?
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={creditCode}
          onChange={(e) => setCreditCode(e.target.value.toUpperCase())}
          placeholder="SAMPLE-XXXXXXXX"
          maxLength={16}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleApplyCredit}
          disabled={isLoading || !creditCode}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 mt-2">{success}</p>
      )}
    </div>
  );
}
