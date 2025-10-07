/**
 * Fitment Table Component
 *
 * Displays technical fitment information for door products to reduce sizing anxiety
 * and help customers understand compatibility with their openings.
 *
 * North Star Strategy: Pillar 5 - PDP Elevation
 * - Width and height ranges
 * - Track type compatibility
 * - Soft-close compatibility
 * - Clear "What's Included" vs "Optional"
 */

'use client';

import { Check, X } from 'lucide-react';

interface FitmentSpec {
  widthRange: string;
  heightRange: string;
  trackType: string;
  softCloseCompatible: boolean;
  whatsIncluded: string[];
  optional: string[];
}

interface FitmentTableProps {
  spec: FitmentSpec;
  className?: string;
}

export function FitmentTable({ spec, className = '' }: FitmentTableProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Compatibility Table */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Fitment Specifications</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="grid grid-cols-2 px-4 py-3">
            <div className="text-sm font-medium text-gray-900">Opening Width</div>
            <div className="text-sm text-gray-700">{spec.widthRange}</div>
          </div>
          <div className="grid grid-cols-2 px-4 py-3">
            <div className="text-sm font-medium text-gray-900">Opening Height</div>
            <div className="text-sm text-gray-700">{spec.heightRange}</div>
          </div>
          <div className="grid grid-cols-2 px-4 py-3">
            <div className="text-sm font-medium text-gray-900">Track Type</div>
            <div className="text-sm text-gray-700">{spec.trackType}</div>
          </div>
          <div className="grid grid-cols-2 px-4 py-3">
            <div className="text-sm font-medium text-gray-900">Soft-Close Compatible</div>
            <div className="flex items-center gap-2">
              {spec.softCloseCompatible ? (
                <>
                  <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
                  <span className="text-sm text-green-600 font-medium">Yes</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <span className="text-sm text-gray-500">No</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* What's Included vs Optional */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* What's Included */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Check className="w-4 h-4" aria-hidden="true" />
            What's Included
          </h4>
          <ul className="space-y-2">
            {spec.whatsIncluded.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Optional Upgrades */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-3">
            Optional Upgrades
          </h4>
          <ul className="space-y-2">
            {spec.optional.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                <span className="text-blue-500 mt-0.5">+</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Measurement Help */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          <strong>Not sure about your measurements?</strong> Our team provides free in-home measurements
          to ensure perfect fit. Book a measurement consultation or upload photos in your quote request.
        </p>
      </div>
    </div>
  );
}

/**
 * Default fitment specs for common door types
 */
export const defaultFitmentSpecs = {
  bypassDoor: {
    widthRange: '48" - 96" (custom sizes available)',
    heightRange: '80" - 96" standard',
    trackType: 'Top-mount bypass track',
    softCloseCompatible: true,
    whatsIncluded: [
      'Custom door panel and frame',
      'Premium bypass track hardware',
      'Soft-close mechanism',
      'Professional installation',
      'Removal of old doors',
      '2-year workmanship warranty',
      'Lifetime manufacturer warranty'
    ],
    optional: [
      'Frosted or mirror inserts',
      'Premium frame finishes (satin nickel, oil-rubbed bronze)',
      'Extended height options',
      'Decorative hardware upgrades'
    ]
  },
  bifoldDoor: {
    widthRange: '24" - 48" per panel',
    heightRange: '80" - 84" standard',
    trackType: 'Top-mount bifold track',
    softCloseCompatible: false,
    whatsIncluded: [
      'Custom door panels',
      'Bifold track and hardware',
      'Pivot and guide systems',
      'Professional installation',
      'Removal of old doors',
      '2-year workmanship warranty',
      'Lifetime manufacturer warranty'
    ],
    optional: [
      'Louvered or paneled designs',
      'Custom finishes',
      'Upgraded hardware',
      'Soft-close retrofit (select models)'
    ]
  },
  barnDoor: {
    widthRange: '32" - 48" single door',
    heightRange: '80" - 96" standard',
    trackType: 'Barn door rail system',
    softCloseCompatible: true,
    whatsIncluded: [
      'Custom barn door panel',
      'Heavy-duty rail and hardware',
      'Soft-close dampers (select models)',
      'Professional installation',
      'Wall mounting hardware',
      '2-year workmanship warranty',
      'Lifetime manufacturer warranty'
    ],
    optional: [
      'Decorative rail finishes',
      'Custom door designs',
      'Floor guides',
      'Privacy locks'
    ]
  }
};
