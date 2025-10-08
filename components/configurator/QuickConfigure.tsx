"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfiguratorCalculator } from "@/lib/configurator-calculator";
import { ProductConfiguratorData } from "@/types/configurator";
import { Calculator } from "lucide-react";

interface QuickConfigureProps {
  product: {
    id: string;
    title: string;
    handle: string;
    configuratorData: ProductConfiguratorData;
  };
  onEstimate?: (low: number, high: number) => void;
}

export function QuickConfigure({ product, onEstimate }: QuickConfigureProps) {
  const [width, setWidth] = useState<number>(48);
  const [height, setHeight] = useState<number>(80);
  const [panels, setPanels] = useState<number>(product.configuratorData.panel_options[0] || 2);
  const [showResult, setShowResult] = useState(false);
  const [estimate, setEstimate] = useState<{ low: number; high: number } | null>(null);

  const handleCalculate = () => {
    const result = ConfiguratorCalculator.quickEstimate(
      product.configuratorData,
      width,
      height,
      panels
    );

    setEstimate(result);
    setShowResult(true);
    onEstimate?.(result.low, result.high);

    // Track event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'collection_quick_config', {
        product_id: product.id,
        product_title: product.title,
        width,
        height,
        panels,
        estimate_low: result.low,
        estimate_high: result.high
      });
    }
  };

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
        <Calculator className="h-3 w-3" />
        Quick Configure
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-gray-600">Width (in)</label>
          <Input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseFloat(e.target.value) || 48)}
            className="h-8 text-xs"
            min={product.configuratorData.opening_min_width}
            max={product.configuratorData.opening_max_width}
          />
        </div>

        <div>
          <label className="text-xs text-gray-600">Height (in)</label>
          <Input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value) || 80)}
            className="h-8 text-xs"
            min={product.configuratorData.opening_min_height}
            max={product.configuratorData.opening_max_height}
          />
        </div>

        <div>
          <label className="text-xs text-gray-600">Panels</label>
          <select
            value={panels}
            onChange={(e) => setPanels(parseInt(e.target.value))}
            className="h-8 text-xs border rounded-md w-full px-2"
          >
            {product.configuratorData.panel_options.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        onClick={handleCalculate}
        size="sm"
        variant="outline"
        className="w-full h-8 text-xs"
      >
        Get Estimate
      </Button>

      {showResult && estimate && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-center">
          <p className="text-xs text-green-700">Estimated Installed</p>
          <p className="text-sm font-bold text-green-900">
            {ConfiguratorCalculator.formatPriceRange(estimate.low, estimate.high)}
          </p>
          <a
            href={`/products/${product.handle}`}
            className="text-xs text-green-700 hover:underline"
          >
            View details →
          </a>
        </div>
      )}
    </div>
  );
}
