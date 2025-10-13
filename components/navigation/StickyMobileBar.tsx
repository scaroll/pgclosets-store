"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Calculator, Calendar, Phone } from "lucide-react";
import { getPhoneHref } from "@/lib/business-info";
import { getSmartDefaultProduct, getDefaultConfiguratorData } from "@/lib/estimator-defaults";

// Dynamic import - wizard only loads when mobile Estimate tapped
const InstantEstimatorWizard = dynamic(
  () => import("../configurator/InstantEstimatorWizard").then(mod => ({ default: mod.InstantEstimatorWizard })),
  { ssr: false }
);

export function StickyMobileBar() {
  const [showEstimator, setShowEstimator] = useState(false);

  // Preselect smart default (bypass doors - most popular)
  const defaultProduct = getSmartDefaultProduct({ entryPoint: 'mobile_sticky' });

  return (
    <>
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
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
            href={getPhoneHref()}
            className="flex flex-col items-center justify-center py-3 hover:bg-gray-50 transition-colors"
          >
            <Phone className="h-5 w-5 text-teal-700 mb-1" />
            <span className="text-xs font-medium text-gray-700">Call</span>
          </a>
        </div>
      </div>

      <InstantEstimatorWizard
        isOpen={showEstimator}
        onClose={() => setShowEstimator(false)}
        initialProduct={{
          id: defaultProduct.slug,
          title: defaultProduct.title,
          configuratorData: getDefaultConfiguratorData(defaultProduct.slug)
        }}
        entryPoint="mobile_sticky"
      />
    </>
  );
}
