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

interface ConfiguratorData {
  size?: {
    opening_min_width_mm?: number;
    opening_max_width_mm?: number;
    opening_min_height_mm?: number;
    opening_max_height_mm?: number;
  };
  options?: {
    panel_options?: string[];
    finish_options?: string[];
  };
  base_price_cad?: number;
}

export interface Product {
  id: string;
  title: string;
  slug?: string | null;
  handle?: string | null;
  featured_image?: string;
  price?: number;
  image?: string;
  configurator_data?: ConfiguratorData | null;
}

interface QuickConfigureCardProps {
  product: Product;
}

// Derive a safe slug with fallbacks and sanitization
export const deriveSlug = (product: Product): string | null => {
  const raw = (product.slug ?? product.handle ?? '').trim();
  if (raw.length > 0 && raw !== 'undefined' && raw !== 'null') {
    return raw;
  }

  if (product.title) {
    const converted = product.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    if (converted.length > 0) {
      return converted;
    }
  }

  return null;
};

export const QuickConfigureCard = ({ product }: QuickConfigureCardProps) => {
  const configData = product.configurator_data;
  const hasConfigurator = !!configData;
  const safeSlug = deriveSlug(product);
  const href = safeSlug ? `/simple-products/${encodeURIComponent(safeSlug)}` : '#';

  // State for configurator form
  const [width, setWidth] = useState<number>(configData?.size?.opening_min_width_mm ?? 900);
  const [height, setHeight] = useState<number>(configData?.size?.opening_min_height_mm ?? 2032);
  const [panels, setPanels] = useState<string>(configData?.options?.panel_options?.[0] ?? '1');
  const [finish, setFinish] = useState<string>(configData?.options?.finish_options?.[0] ?? 'matte_white');

  // Safe defaults for min/max
  const minWidth = configData?.size?.opening_min_width_mm ?? 600;
  const maxWidth = configData?.size?.opening_max_width_mm ?? 3000;
  const minHeight = configData?.size?.opening_min_height_mm ?? 1800;
  const maxHeight = configData?.size?.opening_max_height_mm ?? 2800;

  // Options
  const panelOptions = configData?.options?.panel_options ?? ['1', '2', '3', '4'];
  const finishOptions = configData?.options?.finish_options ?? [
    'matte_white',
    'matte_black',
    'mirror',
    'steel_frame',
  ];

  const imageContent = (
    <div className="aspect-square relative overflow-hidden bg-gray-100">
      {(product.featured_image || product.image) && (
        <Image
          src={product.featured_image || product.image || ''}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      )}
      {!safeSlug && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs">
          Missing slug
        </div>
      )}
    </div>
  );

  if (!hasConfigurator) {
    // Simple card without configurator
    return (
      <Card data-slug={safeSlug ?? 'missing'} className="overflow-hidden hover:shadow-xl transition-shadow">
        {safeSlug ? <Link href={href}>{imageContent}</Link> : imageContent}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">
            {safeSlug ? (
              <Link href={href} className="hover:text-teal-700 transition-colors">
                {product.title}
              </Link>
            ) : (
              product.title
            )}
          </h3>
          {product.price && (
            <p className="text-lg font-semibold text-gray-900">
              From ${(product.price / 100).toFixed(2)}
            </p>
          )}
        </div>
      </Card>
    );
  }

  // Helper to build instant estimate URL with current form values
  const buildEstimateUrl = () => {
    // Determine category from product title
    const titleLower = product.title.toLowerCase();
    let category = 'closet-doors';
    if (titleLower.includes('barn')) category = 'barn-doors';
    else if (titleLower.includes('bypass')) category = 'bypass-doors';
    else if (titleLower.includes('bifold')) category = 'bifold-doors';
    else if (titleLower.includes('pivot')) category = 'pivot-doors';
    else if (titleLower.includes('divider')) category = 'room-dividers';

    const params = new URLSearchParams({
      category,
      width: width.toString(),
      height: height.toString(),
      panels: panels,
      finish: finish,
    });
    return `/instant-estimate?${params.toString()}`;
  };

  return (
    <Card data-slug={safeSlug ?? 'missing'} className="overflow-hidden hover:shadow-xl transition-shadow">
      {/* Product Image */}
      {safeSlug ? <Link href={href}>{imageContent}</Link> : imageContent}

      {/* Product Info & Configurator */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">
          {safeSlug ? (
            <Link href={href} className="hover:text-teal-700 transition-colors">
              {product.title}
            </Link>
          ) : (
            product.title
          )}
        </h3>

        {typeof configData?.base_price_cad === 'number' && (
          <p className="text-lg font-semibold text-gray-900 mb-4">
            {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(configData.base_price_cad)}
          </p>
        )}

        {/* Quick Configure Form */}
  <div className="space-y-4">
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
            <Link href={buildEstimateUrl()} className="flex-1">
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Quick Configure
              </Button>
            </Link>
            {safeSlug ? (
              <Link href={href}>
                <Button type="button" variant="outline" className="px-3">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Button type="button" variant="outline" className="px-3" disabled>
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};