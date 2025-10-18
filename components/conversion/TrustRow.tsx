/**
 * Trust Row Component
 *
 * Displays trust badges and social proof near CTAs to reduce friction
 * and increase conversion confidence.
 *
 * North Star Strategy: Pillar 9 - Trust & Social Proof
 * - Licensed & Insured
 * - 2-Week Install timeline
 * - Lifetime Warranty
 * - 5.0★ rating with 500+ installations
 */

'use client';

import { Shield, Clock, Award, Star } from 'lucide-react';

interface TrustRowProps {
  variant?: 'compact' | 'full';
  className?: string;
  showRating?: boolean;
}

export function TrustRow({
  variant = 'full',
  className = '',
  showRating = true
}: TrustRowProps) {
  const badges = [
    {
      icon: Shield,
      text: 'Licensed & Insured',
      ariaLabel: 'Licensed and insured professional service'
    },
    {
      icon: Clock,
      text: '2-Week Install',
      ariaLabel: 'Installation completed within 2 weeks'
    },
    {
      icon: Award,
      text: 'Lifetime Warranty',
      ariaLabel: 'Lifetime warranty on doors'
    },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 ${className}`}>
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-1.5"
              aria-label={badge.ariaLabel}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{badge.text}</span>
            </div>
          );
        })}
        {showRating && (
          <div className="flex items-center gap-1.5" aria-label="5.0 star rating with over 500 installations">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            <span>5.0★ 500+ Installs</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-2"
              aria-label={badge.ariaLabel}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Icon className="w-5 h-5 text-gray-700" aria-hidden="true" />
              </div>
              <p className="text-xs font-medium text-gray-700">{badge.text}</p>
            </div>
          );
        })}
        {showRating && (
          <div
            className="flex flex-col items-center text-center gap-2"
            aria-label="5.0 star rating with over 500 happy customers"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            </div>
            <p className="text-xs font-medium text-gray-700">
              5.0★ 500+ Happy Customers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
