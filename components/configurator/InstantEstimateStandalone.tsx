"use client";

import { useState, useEffect } from "react";
import simpleProducts from "@/data/simple-products.json";
import { InstantEstimateModal } from "./InstantEstimateModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function InstantEstimateStandalone() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showEstimator, setShowEstimator] = useState(false);

  // Get products with configurator data
  const configurableProducts = simpleProducts.filter(
    (p: any) => p.configurator_data
  );

  useEffect(() => {
    // Select first product by default
    if (configurableProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(configurableProducts[0]);
    }
  }, []);

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setShowEstimator(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Choose a Door Type</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {configurableProducts.slice(0, 6).map((product: any) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleProductSelect(product)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.title}
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
          onClose={() => setShowEstimator(false)}
          initialProduct={{
            id: selectedProduct.id,
            title: selectedProduct.title,
            configuratorData: selectedProduct.configurator_data
          }}
        />
      )}
    </>
  );
}
