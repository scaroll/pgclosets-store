/**
 * Value Proposition Banner Component
 *
 * Conversion Optimization - Trust Signals
 * Displays key trust signals and value propositions prominently
 * above the main header to build credibility immediately.
 *
 * Features:
 * - Always visible for maximum trust signal impact
 * - Mobile responsive with scrolling on small screens
 * - WCAG AA compliant with proper contrast ratios
 */

'use client';

import { Shield, Award, TrendingUp } from 'lucide-react';

export function ValuePropBanner() {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-3 px-4" role="banner" aria-label="Trust signals">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-4">
          {/* Trust Signals - Horizontal scroll on mobile */}
          <div className="flex items-center gap-6 md:gap-8 overflow-x-auto scrollbar-hide flex-1 justify-center">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Shield className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm md:text-base font-medium">Official Renin Dealer</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-gray-600" aria-hidden="true" />
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Award className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm md:text-base font-medium">500+ Ottawa Installations</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-gray-600" aria-hidden="true" />
            <div className="flex items-center gap-2 whitespace-nowrap">
              <TrendingUp className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm md:text-base font-medium">Price Match Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
