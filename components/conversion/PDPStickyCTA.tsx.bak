/**
 * PDP Sticky CTA Component
 *
 * Mobile-optimized sticky call-to-action for Product Detail Pages
 * with trust signals and reassurance copy.
 *
 * North Star Strategy: Pillar 5 - PDP Elevation
 * - Persistent CTA on mobile (bottom of screen)
 * - "Get Free Quote • No obligation • Reply in 24h" copy (email-only, no free online quote)
 * - High-contrast, easy tap target (48px min)
 * - Analytics tracking for sticky_cta_click events
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { trackStickyMobileCTA } from '@/lib/analytics/events';

interface PDPStickyCTAProps {
  productId: string;
  productName: string;
  /** Show CTA after scrolling this many pixels (default: 200) */
  scrollThreshold?: number;
}

export function PDPStickyCTA({
  productId,
  productName,
  scrollThreshold = 200
}: PDPStickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show after threshold, hide when scrolling down fast
      if (currentScrollY > scrollThreshold) {
        if (currentScrollY < lastScrollY || currentScrollY < scrollThreshold + 50) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY + 10) {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobile, scrollThreshold]);

  const handleClick = () => {
    trackStickyMobileCTA({
      product_id: productId,
      product_name: productName
    });
  };

  if (!isMobile) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      role="complementary"
      aria-label="Sticky call to action"
    >
      {/* Shadow for depth */}
      <div className="absolute inset-x-0 bottom-full h-4 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

      <div className="bg-white border-t border-gray-200 shadow-2xl px-4 py-3">
        {/* Reassurance copy above button - Policy: Email-only, no free online quote */}
        <p className="text-xs text-center text-gray-600 mb-2">
          No obligation • Reply in 24h
        </p>

        <Link
          href="/request-work"
          onClick={handleClick}
          className="flex items-center justify-center gap-2 w-full bg-black text-white px-6 py-3.5 rounded-lg font-semibold text-base min-h-[48px] hover:bg-gray-900 active:bg-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 shadow-lg"
          aria-label={`Get free quote for ${productName}`}
        >
          <span>Get Free Quote</span>
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
