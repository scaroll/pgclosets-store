"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

export function UtilityBar() {
  return (
    <div className="bg-teal-700 text-white text-center py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium">
        <span className="flex items-center gap-1">
          Free in-home measure within 30 km
        </span>
        <span className="hidden sm:inline text-teal-300">•</span>
        <span className="flex items-center gap-1">
          Typical installs: 2–3 weeks
        </span>
        <span className="hidden sm:inline text-teal-300">•</span>
        <span className="flex items-center gap-1">
          Lifetime workmanship warranty
        </span>
      </div>
    </div>
  );
}

export function EnhancedHeaderActions() {
  return (
    <div className="hidden lg:flex items-center gap-3">
      <a
        href="tel:6137016393"
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-teal-700 transition-colors"
      >
        <Phone className="h-4 w-4" />
        <span>(613) 701-6393</span>
      </a>

      <Link
        href="/book-measure"
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors"
      >
        Book Measure
      </Link>

      <Link
        href="/instant-estimate"
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-teal-700 bg-white border-2 border-teal-700 hover:bg-teal-50 rounded-md transition-colors"
      >
        Instant Estimate
      </Link>
    </div>
  );
}
