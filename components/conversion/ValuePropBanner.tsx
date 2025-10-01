/**
 * Value Proposition Banner Component
 *
 * Conversion Optimization - Trust Signals
 * Displays key trust signals and value propositions prominently
 * above the main header to build credibility immediately.
 *
 * Features:
 * - Dismissible with localStorage persistence
 * - Only shows once per session for return visitors
 * - Mobile responsive with scrolling on small screens
 * - WCAG AA compliant with proper contrast ratios
 */

'use client';

import { X, Shield, Award, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const BANNER_DISMISSED_KEY = 'pg-value-banner-dismissed';

export function ValuePropBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gray-900 text-white py-2 px-4" role="banner" aria-label="Trust signals">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Trust Signals - Horizontal scroll on mobile */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide flex-1">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Shield className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">Official Renin Dealer</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-600" aria-hidden="true" />
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Award className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">500+ Ottawa Installations</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-600" aria-hidden="true" />
            <div className="flex items-center gap-2 whitespace-nowrap">
              <TrendingUp className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">Price Match Guarantee</span>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-gray-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
