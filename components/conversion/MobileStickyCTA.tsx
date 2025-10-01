/**
 * Mobile Sticky CTA Component
 *
 * Mobile Conversion Optimization
 * Provides a persistent call-to-action button at the bottom of the screen
 * on mobile devices for easy access to quote requests.
 *
 * Features:
 * - Only visible on mobile devices (< 768px)
 * - Appears on key pages (homepage, products, services)
 * - Slides up/down based on scroll direction
 * - Safe area inset support for modern devices
 * - WCAG AA compliant with 48px touch target
 */

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const SHOW_ON_PATHS = ['/', '/products', '/services'];

export function MobileStickyCTA() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if current path should show CTA
  const shouldShow = SHOW_ON_PATHS.some(path =>
    pathname === path || pathname?.startsWith(path + '/')
  );

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll direction
  useEffect(() => {
    if (!isMobile || !shouldShow) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show CTA when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobile, shouldShow]);

  if (!isMobile || !shouldShow) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
    >
      <div className="bg-white border-t border-gray-200 shadow-lg p-4">
        <Link
          href="/request-work"
          className="flex items-center justify-center gap-2 w-full bg-black text-white px-6 py-4 rounded-lg font-semibold text-base min-h-[48px] hover:bg-gray-900 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500"
          aria-label="Get your free design consultation"
        >
          <span>Get FREE Design Consultation</span>
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
