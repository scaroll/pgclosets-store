"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, Calendar, Phone } from "lucide-react";
import { InstantEstimateModal } from "../configurator/InstantEstimateModal";

export function StickyMobileBar() {
  const [showEstimator, setShowEstimator] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg">
        <div className="grid grid-cols-3 divide-x">
          <button
            onClick={() => setShowEstimator(true)}
            className="flex flex-col items-center justify-center py-3 hover:bg-gray-50 transition-colors"
          >
            <Calculator className="h-5 w-5 text-teal-700 mb-1" />
            <span className="text-xs font-medium text-gray-700">Estimate</span>
          </button>

          <Link
            href="/book-measure"
            className="flex flex-col items-center justify-center py-3 hover:bg-gray-50 transition-colors"
          >
            <Calendar className="h-5 w-5 text-teal-700 mb-1" />
            <span className="text-xs font-medium text-gray-700">Book</span>
          </Link>

          <a
            href="tel:6137016393"
            className="flex flex-col items-center justify-center py-3 hover:bg-gray-50 transition-colors"
          >
            <Phone className="h-5 w-5 text-teal-700 mb-1" />
            <span className="text-xs font-medium text-gray-700">Call</span>
          </a>
        </div>
      </div>

      <InstantEstimateModal
        isOpen={showEstimator}
        onClose={() => setShowEstimator(false)}
      />
    </>
  );
}
