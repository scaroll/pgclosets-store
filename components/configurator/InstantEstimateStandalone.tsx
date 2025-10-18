"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import simpleProducts from "@/data/simple-products.json";
import { InstantEstimateModal } from "./InstantEstimateModal";
import { ConfiguratorDataAdapter } from "@/lib/configurator-adapter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function InstantEstimateStandalone() {
  const searchParams = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showEstimator, setShowEstimator] = useState(false);
  const [prefilledParams, setPrefilledParams] = useState<{
    width?: number;
    height?: number;
    panels?: string;
    finish?: string;
  } | null>(null);

  // Get products with valid configurator data
  const configurableProducts = simpleProducts.filter(
    (p: any) => p.configurator_data && ConfiguratorDataAdapter.safeNormalize(p.configurator_data) !== null
  );

  useEffect(() => {
    // Read URL parameters
    const category = searchParams.get('category');
    const width = searchParams.get('width');
    const height = searchParams.get('height');
    const panels = searchParams.get('panels');
    const finish = searchParams.get('finish');

    // Find product by category if specified
    let productToSelect = null;
    if (category) {
      // Map category slugs to product titles/categories
      const categoryMap: Record<string, string[]> = {
        'barn-doors': ['barn door', 'renin barn'],
        'bypass-doors': ['bypass', 'sliding'],
        'bifold-doors': ['bifold', 'bi-fold'],
        'pivot-doors': ['pivot'],
        'closet-doors': ['closet door'],
        'room-dividers': ['divider', 'partition']
      };

      const searchTerms = categoryMap[category] || [category];
      productToSelect = configurableProducts.find((p: any) =>
        searchTerms.some(term =>
          p.title?.toLowerCase().includes(term.toLowerCase()) ||
          p.category?.toLowerCase().includes(term.toLowerCase())
        )
      );
    }

    // Select product (from URL category or first available)
    const selectedProd = productToSelect || configurableProducts[0];
    if (selectedProd) {
      setSelectedProduct(selectedProd);

      // If URL params are present, pre-fill and auto-open estimator
      if (width || height || panels || finish) {
        setPrefilledParams({
          width: width ? parseInt(width) : undefined,
          height: height ? parseInt(height) : undefined,
          panels: panels || undefined,
          finish: finish || undefined,
        });
        setShowEstimator(true);
      }
    }
  }, [searchParams]);

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setShowEstimator(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Choose a Door Type</h3>
          <div className="grid sm:grid-cols-2 gap-4" role="list">
            {configurableProducts.slice(0, 6).map((product: any) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleProductSelect(product)}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleProductSelect(product);
                  }
                }}
                aria-label={`Select ${product.title} - ${product.category} - Starting from ${(product.price / 100).toFixed(0)} CAD`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={`${product.title} door example`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{product.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.category}
                      </p>
                      <p className="text-sm font-bold text-teal-700 mt-2">
                        From {(product.price / 100).toFixed(0)} CAD
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => selectedProduct && setShowEstimator(true)}
            disabled={!selectedProduct}
            size="lg"
            className="w-full sm:w-auto"
            aria-label={selectedProduct ? `Configure and get estimate for ${selectedProduct.title}` : "Select a product first to configure and get estimate"}
          >
            Configure & Get Estimate
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            What's Included in the Price?
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Professional in-home measurement</li>
            <li>✓ Custom fabrication to your exact opening</li>
            <li>✓ Professional installation</li>
            <li>✓ All hardware and tracks</li>
            <li>✓ Post-install cleanup</li>
            <li>✓ 30-day fit check</li>
          </ul>
        </div>
      </div>

      {selectedProduct && (
        <InstantEstimateModal
          isOpen={showEstimator}
          onClose={() => {
            setShowEstimator(false);
            setPrefilledParams(null);
          }}
          initialProduct={{
            id: selectedProduct.id,
            title: selectedProduct.title,
            configuratorData: selectedProduct.configurator_data
          }}
          prefilledParams={prefilledParams}
        />
      )}
    </>
  );
}
