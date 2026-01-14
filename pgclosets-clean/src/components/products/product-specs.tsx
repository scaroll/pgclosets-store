"use client";

import { useState } from "react";
import { ReninProduct } from "@/lib/renin-product-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Ruler, Package, Truck, Shield, Wrench, Info } from "lucide-react";

interface ProductSpecsProps {
  product: ReninProduct;
  selectedVariantId?: string;
}

interface SpecSection {
  title: string;
  icon: React.ReactNode;
  items: { label: string; value: string; description?: string }[];
}

export function ProductSpecs({ product, selectedVariantId }: ProductSpecsProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["dimensions"]);

  const selectedVariant = selectedVariantId
    ? product.variants?.find(v => v.id === selectedVariantId)
    : product.variants?.[0];

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionKey)
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  // Parse metafields into organized specifications
  const parseMetafields = () => {
    if (!product.metafields) return {};

    const specs: Record<string, Record<string, string>> = {};

    product.metafields.forEach(metafield => {
      const { namespace, key, value, type } = metafield;

      if (!specs[namespace]) {
        specs[namespace] = {};
      }

      specs[namespace][key] = value;
    });

    return specs;
  };

  const metafieldSpecs = parseMetafields();

  // Build specification sections
  const buildSpecSections = (): SpecSection[] => {
    const sections: SpecSection[] = [];

    // Dimensions & Physical Properties
    const dimensionSpecs = metafieldSpecs.dimensions || metafieldSpecs.physical || {};
    const dimensionItems: SpecSection['items'] = [];

    // Add standard dimensions
    if (dimensionSpecs.height) dimensionItems.push({ label: "Height", value: dimensionSpecs.height });
    if (dimensionSpecs.width) dimensionItems.push({ label: "Width", value: dimensionSpecs.width });
    if (dimensionSpecs.depth || dimensionSpecs.thickness) {
      dimensionItems.push({ label: "Thickness", value: dimensionSpecs.depth || dimensionSpecs.thickness });
    }

    // Add weight from variant
    if (selectedVariant?.weight) {
      dimensionItems.push({ label: "Weight", value: `${selectedVariant.weight} kg` });
    }

    // Add other dimensional specs
    Object.entries(dimensionSpecs).forEach(([key, value]) => {
      if (!['height', 'width', 'depth', 'thickness'].includes(key)) {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        dimensionItems.push({ label, value });
      }
    });

    if (dimensionItems.length > 0) {
      sections.push({
        title: "Dimensions & Weight",
        icon: <Ruler className="w-4 h-4" />,
        items: dimensionItems
      });
    }

    // Materials & Construction
    const materialSpecs = metafieldSpecs.materials || metafieldSpecs.construction || {};
    const materialItems: SpecSection['items'] = [];

    Object.entries(materialSpecs).forEach(([key, value]) => {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      materialItems.push({ label, value });
    });

    // Add product type and vendor info
    if (product.product_type) {
      materialItems.push({ label: "Product Type", value: product.product_type });
    }
    if (product.vendor) {
      materialItems.push({ label: "Manufacturer", value: product.vendor });
    }

    if (materialItems.length > 0) {
      sections.push({
        title: "Materials & Construction",
        icon: <Package className="w-4 h-4" />,
        items: materialItems
      });
    }

    // Installation & Hardware
    const installationSpecs = metafieldSpecs.installation || metafieldSpecs.hardware || {};
    const installationItems: SpecSection['items'] = [];

    Object.entries(installationSpecs).forEach(([key, value]) => {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      installationItems.push({ label, value });
    });

    // Add shipping info from variant
    if (selectedVariant?.requires_shipping) {
      installationItems.push({
        label: "Shipping Required",
        value: "Yes",
        description: "Professional installation recommended"
      });
    }

    if (installationItems.length > 0) {
      sections.push({
        title: "Installation & Hardware",
        icon: <Wrench className="w-4 h-4" />,
        items: installationItems
      });
    }

    // Shipping & Logistics
    const shippingSpecs = metafieldSpecs.shipping || metafieldSpecs.logistics || {};
    const shippingItems: SpecSection['items'] = [];

    Object.entries(shippingSpecs).forEach(([key, value]) => {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      shippingItems.push({ label, value });
    });

    // Add tax info from variant
    if (selectedVariant?.taxable !== undefined) {
      shippingItems.push({
        label: "Taxable",
        value: selectedVariant.taxable ? "Yes" : "No"
      });
    }

    if (shippingItems.length > 0) {
      sections.push({
        title: "Shipping & Logistics",
        icon: <Truck className="w-4 h-4" />,
        items: shippingItems
      });
    }

    // Warranty & Care
    const warrantySpecs = metafieldSpecs.warranty || metafieldSpecs.care || {};
    const warrantyItems: SpecSection['items'] = [];

    Object.entries(warrantySpecs).forEach(([key, value]) => {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      warrantyItems.push({ label, value });
    });

    if (warrantyItems.length > 0) {
      sections.push({
        title: "Warranty & Care",
        icon: <Shield className="w-4 h-4" />,
        items: warrantyItems
      });
    }

    // Other specifications (catch-all for remaining metafields)
    const otherSpecs: SpecSection['items'] = [];
    Object.entries(metafieldSpecs).forEach(([namespace, fields]) => {
      if (!['dimensions', 'physical', 'materials', 'construction', 'installation', 'hardware', 'shipping', 'logistics', 'warranty', 'care'].includes(namespace)) {
        Object.entries(fields).forEach(([key, value]) => {
          const label = `${namespace}.${key}`.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          otherSpecs.push({ label, value });
        });
      }
    });

    if (otherSpecs.length > 0) {
      sections.push({
        title: "Additional Specifications",
        icon: <Info className="w-4 h-4" />,
        items: otherSpecs
      });
    }

    return sections;
  };

  const sections = buildSpecSections();

  // If no specifications available, show basic product info
  if (sections.length === 0) {
    const basicItems: SpecSection['items'] = [];

    if (product.product_type) basicItems.push({ label: "Product Type", value: product.product_type });
    if (product.vendor) basicItems.push({ label: "Manufacturer", value: product.vendor });
    if (selectedVariant?.sku) basicItems.push({ label: "SKU", value: selectedVariant.sku });
    if (selectedVariant?.weight) basicItems.push({ label: "Weight", value: `${selectedVariant.weight} kg` });

    if (basicItems.length > 0) {
      sections.push({
        title: "Basic Information",
        icon: <Info className="w-4 h-4" />,
        items: basicItems
      });
    }
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm font-light">No technical specifications available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-light text-slate-900">Technical Specifications</h3>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => {
          const sectionKey = section.title.toLowerCase().replace(/\s+/g, '-');
          const isExpanded = expandedSections.includes(sectionKey);

          return (
            <div key={sectionKey} className="border border-slate-200 rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                className="w-full h-auto p-4 justify-between hover:bg-slate-50 rounded-none"
                onClick={() => toggleSection(sectionKey)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-slate-600">{section.icon}</div>
                  <span className="font-medium text-slate-900">{section.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {section.items.length}
                  </Badge>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                )}
              </Button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-slate-100">
                  <div className="space-y-3 pt-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-slate-900">
                            {item.label}
                          </span>
                          {item.description && (
                            <p className="text-xs text-slate-600 font-light mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span className="text-sm text-slate-600 font-light ml-4 text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expand/Collapse All */}
      {sections.length > 1 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (expandedSections.length === sections.length) {
                setExpandedSections([]);
              } else {
                setExpandedSections(sections.map((_, index) =>
                  sections[index].title.toLowerCase().replace(/\s+/g, '-')
                ));
              }
            }}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            {expandedSections.length === sections.length ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Collapse All
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Expand All
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}