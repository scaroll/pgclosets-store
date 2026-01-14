"use client";

import { useState, useEffect } from "react";
import { ReninProduct } from "@/lib/renin-product-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle } from "lucide-react";

interface ProductOptionsProps {
  product: ReninProduct;
  selectedVariantId?: string;
  onVariantChange?: (variantId: string) => void;
}

interface SelectedOptions {
  [optionName: string]: string;
}

export function ProductOptions({ product, selectedVariantId, onVariantChange }: ProductOptionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [currentVariant, setCurrentVariant] = useState(product.variants?.[0]);

  // Initialize selected options from the current variant or first variant
  useEffect(() => {
    const variant = selectedVariantId
      ? product.variants?.find(v => v.id === selectedVariantId)
      : product.variants?.[0];

    if (variant && product.options) {
      const initialOptions: SelectedOptions = {};
      product.options.forEach((option, index) => {
        const optionValue = index === 0 ? variant.option1 :
                           index === 1 ? variant.option2 :
                           variant.option3;
        if (optionValue) {
          initialOptions[option.name] = optionValue;
        }
      });
      setSelectedOptions(initialOptions);
      setCurrentVariant(variant);
    }
  }, [product, selectedVariantId]);

  // Find matching variant based on selected options
  useEffect(() => {
    if (!product.options || !product.variants) return;

    const matchingVariant = product.variants.find(variant => {
      return product.options?.every((option, index) => {
        const selectedValue = selectedOptions[option.name];
        const variantValue = index === 0 ? variant.option1 :
                            index === 1 ? variant.option2 :
                            variant.option3;
        return selectedValue === variantValue;
      });
    });

    if (matchingVariant && matchingVariant !== currentVariant) {
      setCurrentVariant(matchingVariant);
      onVariantChange?.(matchingVariant.id);
    }
  }, [selectedOptions, product.options, product.variants, onVariantChange, currentVariant]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  // Get available values for an option based on current selections
  const getAvailableValues = (targetOptionName: string): string[] => {
    if (!product.options || !product.variants) return [];

    const targetOption = product.options.find(opt => opt.name === targetOptionName);
    if (!targetOption) return [];

    // Get all variants that match currently selected options (except the target option)
    const otherSelectedOptions = Object.entries(selectedOptions)
      .filter(([optionName]) => optionName !== targetOptionName);

    const availableVariants = product.variants.filter(variant => {
      return otherSelectedOptions.every(([optionName, selectedValue]) => {
        const optionIndex = product.options?.findIndex(opt => opt.name === optionName) ?? -1;
        const variantValue = optionIndex === 0 ? variant.option1 :
                            optionIndex === 1 ? variant.option2 :
                            variant.option3;
        return variantValue === selectedValue;
      });
    });

    // Extract unique values for the target option from available variants
    const targetOptionIndex = product.options.findIndex(opt => opt.name === targetOptionName);
    const availableValues = new Set(
      availableVariants.map(variant => {
        return targetOptionIndex === 0 ? variant.option1 :
               targetOptionIndex === 1 ? variant.option2 :
               variant.option3;
      }).filter(Boolean)
    );

    return Array.from(availableValues);
  };

  // Check if a specific option value is in stock
  const isValueInStock = (optionName: string, value: string): boolean => {
    if (!product.variants) return false;

    const testOptions = { ...selectedOptions, [optionName]: value };

    const matchingVariant = product.variants.find(variant => {
      return product.options?.every((option, index) => {
        const testValue = testOptions[option.name];
        const variantValue = index === 0 ? variant.option1 :
                            index === 1 ? variant.option2 :
                            variant.option3;
        return testValue === variantValue;
      });
    });

    return matchingVariant ? matchingVariant.inventory_quantity > 0 : false;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!product.options || product.options.length === 0) {
    // Show single variant info if no options
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-light text-slate-900">Product Details</h3>
          {currentVariant && (
            <div className="text-right">
              <div className="text-xl font-medium text-slate-900">
                {formatPrice(currentVariant.price)}
              </div>
              {currentVariant.compare_at_price && currentVariant.compare_at_price > currentVariant.price && (
                <div className="text-sm text-slate-500 line-through font-light">
                  {formatPrice(currentVariant.compare_at_price)}
                </div>
              )}
            </div>
          )}
        </div>

        {currentVariant && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={currentVariant.inventory_quantity > 0 ? "default" : "secondary"}>
                {currentVariant.inventory_quantity > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
              {currentVariant.inventory_quantity > 0 && currentVariant.inventory_quantity <= 5 && (
                <Badge variant="outline" className="text-amber-600 border-amber-600">
                  Only {currentVariant.inventory_quantity} left
                </Badge>
              )}
            </div>
            {currentVariant.sku && (
              <p className="text-sm text-slate-600 font-light">SKU: {currentVariant.sku}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Price display */}
      {currentVariant && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-light text-slate-900">Select Options</h3>
          <div className="text-right">
            <div className="text-xl font-medium text-slate-900">
              {formatPrice(currentVariant.price)}
            </div>
            {currentVariant.compare_at_price && currentVariant.compare_at_price > currentVariant.price && (
              <div className="text-sm text-slate-500 line-through font-light">
                {formatPrice(currentVariant.compare_at_price)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Option selectors */}
      {product.options.map((option) => {
        const availableValues = getAvailableValues(option.name);
        const selectedValue = selectedOptions[option.name];

        return (
          <div key={option.name} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-900">
                {option.name}
              </label>
              {selectedValue && (
                <span className="text-sm text-slate-600 font-light">
                  {selectedValue}
                </span>
              )}
            </div>

            {/* Option values */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {option.values.map((value) => {
                const isAvailable = availableValues.includes(value);
                const isSelected = selectedValue === value;
                const inStock = isValueInStock(option.name, value);

                return (
                  <Button
                    key={value}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    disabled={!isAvailable}
                    onClick={() => handleOptionChange(option.name, value)}
                    className={`relative h-auto p-3 text-left justify-start ${
                      isSelected ? "bg-slate-900 text-white" : ""
                    } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-light truncate">{value}</span>
                      {isSelected && <Check className="w-3 h-3 ml-1 flex-shrink-0" />}
                      {isAvailable && !inStock && (
                        <AlertCircle className="w-3 h-3 ml-1 flex-shrink-0 text-amber-500" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Out of stock message for selected option */}
            {selectedValue && !isValueInStock(option.name, selectedValue) && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertCircle className="w-4 h-4" />
                <span>Selected {option.name.toLowerCase()} is currently out of stock</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Variant information */}
      {currentVariant && (
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900">Availability</span>
            <div className="flex items-center gap-2">
              <Badge variant={currentVariant.inventory_quantity > 0 ? "default" : "secondary"}>
                {currentVariant.inventory_quantity > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
              {currentVariant.inventory_quantity > 0 && currentVariant.inventory_quantity <= 5 && (
                <Badge variant="outline" className="text-amber-600 border-amber-600">
                  Only {currentVariant.inventory_quantity} left
                </Badge>
              )}
            </div>
          </div>

          {currentVariant.sku && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">SKU</span>
              <span className="text-sm text-slate-600 font-light">{currentVariant.sku}</span>
            </div>
          )}

          {currentVariant.weight > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">Weight</span>
              <span className="text-sm text-slate-600 font-light">{currentVariant.weight} kg</span>
            </div>
          )}
        </div>
      )}

      {/* Selection summary */}
      {Object.keys(selectedOptions).length > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-sm font-medium text-slate-900 mb-2">Selected Configuration</h4>
          <div className="space-y-1">
            {Object.entries(selectedOptions).map(([optionName, value]) => (
              <div key={optionName} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{optionName}:</span>
                <span className="font-light text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}