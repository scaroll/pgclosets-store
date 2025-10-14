"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, ExternalLink } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  slug: string;
  handle?: string; // legacy support
  featured_image?: string;
  price?: number;
  configurator_data?: {
    size?: {
      opening_min_width_mm: number;
      opening_max_width_mm: number;
      opening_min_height_mm: number;
      opening_max_height_mm: number;
    };
    options?: {
      panel_options?: string[];
      finish_options?: string[];
    };
    base_price_cad?: number;
  };
}

interface QuickConfigureCardProps {
  product: Product;
}

export function QuickConfigureCard({ product }: QuickConfigureCardProps) {
  const [width, setWidth] = useState<number>(914); // default 36"
  const [height, setHeight] = useState<number>(2032); // default 80"
  const [panels, setPanels] = useState<string>('2');
  const [finish, setFinish] = useState<string>('matte_white');
  const [estimate, setEstimate] = useState<{ low: number; high: number } | null>(null);
  const [calculating, setCalculating] = useState(false);

  const configData = product.configurator_data;
  const hasConfigurator = !!configData;

  // Get min/max values with safe defaults
  const minWidth = configData?.size?.opening_min_width_mm || 600;
  const maxWidth = configData?.size?.opening_max_width_mm || 3000;
  const minHeight = configData?.size?.opening_min_height_mm || 1800;
  const maxHeight = configData?.size?.opening_max_height_mm || 2800;

  // Get options with safe defaults
  const panelOptions = configData?.options?.panel_options || ['1', '2', '3', '4'];
  const finishOptions = configData?.options?.finish_options || [
    'matte_white',
    'matte_black',
    'mirror',
    'steel_frame',
  ];

  const handleCalculateEstimate = async () => {
    setCalculating(true);

    try {
      // Load config
      const response = await fetch('/estimator.config.json');
      const cfg = await response.json();

      // Detect type
      const type = product.title.toLowerCase().includes('bifold') ? 'bifold' :
                   product.title.toLowerCase().includes('pivot') ? 'pivot' :
                   product.title.toLowerCase().includes('barn') ? 'barn' :
                   product.title.toLowerCase().includes('bypass') ? 'bypass' :
                   product.title.toLowerCase().includes('divider') ? 'divider' : 'bypass';

      // Calculate
      const area = (width / 1000) * (height / 1000);
      const sizeFactor = cfg.size_factor.find((x: any) => area <= x.max_area_m2)?.factor ||
                        cfg.size_factor[cfg.size_factor.length - 1].factor;
      const base = cfg.base_model[type] || cfg.base_model.bypass;
      const panelFactor = cfg.panel_factor[panels] || 1.0;
      const finishFactor = cfg.finish_factor[finish] || 1.0;

      const basePrice = base * sizeFactor * panelFactor * finishFactor;
      const low = Math.round(basePrice * (1 - cfg.range_margin));
      const high = Math.round(basePrice * (1 + cfg.range_margin));

      setEstimate({ low, high });

      // Track in GA4
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'quick_config_estimate',
          product_id: product.id,
          product_title: product.title,
          estimate: { low, high, width, height, panels, finish, type },
        });
      }
    } catch (error) {
      console.error('Estimate calculation failed:', error);
    } finally {
      setCalculating(false);
    }
  };

  if (!hasConfigurator) {
    // Simple card without configurator
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-shadow">
        <Link href={`/simple-products/${product.slug}`}>
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            {product.featured_image && (
              <Image
                src={product.featured_image}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 hover:text-teal-700 transition-colors">
              {product.title}
            </h3>
            {product.price && (
              <p className="text-lg font-semibold text-gray-900">
                From ${(product.price / 100).toFixed(2)}
              </p>
            )}
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      {/* Product Image */}
      <Link href={`/simple-products/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {product.featured_image && (
            <Image
              src={product.featured_image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          )}
        </div>
      </Link>

      {/* Product Info & Configurator */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">
          <Link href={`/simple-products/${product.slug}`} className="hover:text-teal-700 transition-colors">
            {product.title}
          </Link>
        </h3>

        {typeof configData?.base_price_cad === 'number' && (
          <p className="text-lg font-semibold text-gray-900 mb-4">
            {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(configData.base_price_cad)}
          </p>
        )}

        {/* Quick Configure Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleCalculateEstimate(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`width-${product.id}`} className="text-xs">
                Width (mm)
              </Label>
              <Input
                id={`width-${product.id}`}
                type="number"
                min={minWidth}
                max={maxWidth}
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                className="h-9"
                required
              />
            </div>
            <div>
              <Label htmlFor={`height-${product.id}`} className="text-xs">
                Height (mm)
              </Label>
              <Input
                id={`height-${product.id}`}
                type="number"
                min={minHeight}
                max={maxHeight}
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                className="h-9"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`panels-${product.id}`} className="text-xs">
              Panels
            </Label>
            <Select value={panels} onValueChange={setPanels}>
              <SelectTrigger id={`panels-${product.id}`} className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {panelOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt} Panel{opt !== '1' ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`finish-${product.id}`} className="text-xs">
              Finish
            </Label>
            <Select value={finish} onValueChange={setFinish}>
              <SelectTrigger id={`finish-${product.id}`} className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {finishOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700"
              disabled={calculating}
            >
              <Calculator className="w-4 h-4 mr-2" />
              {calculating ? 'Calculating...' : 'Instant Estimate'}
            </Button>
            <Link href={`/simple-products/${product.slug}`}>
              <Button type="button" variant="outline" className="px-3">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {estimate && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Estimated Installed Price
              </p>
              <p className="text-2xl font-bold text-teal-900">
                ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Includes measure, delivery & installation
              </p>
            </div>
          )}
        </form>
      </div>
    </Card>
  );
}
