"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfiguratorCalculator } from "@/lib/configurator-calculator";
import type { ConfiguratorState, ProductConfiguratorData, EstimateResult } from "@/types/configurator";
import { ConfiguratorDataAdapter } from "@/lib/configurator-adapter";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { trackWizardProgress, trackQuoteRequest } from "@/lib/analytics/enhanced-tracking";

interface InstantEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: {
    id: string;
    title: string;
    configuratorData: ProductConfiguratorData | any;
  };
}

export function InstantEstimateModal({ isOpen, onClose, initialProduct }: InstantEstimateModalProps) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<ConfiguratorState>({
    width: null,
    height: null,
    widthUnit: 'in',
    heightUnit: 'in',
    panels: null,
    finish: null,
    addons: []
  });
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Normalize configurator data on mount
  const normalizedConfig = initialProduct?.configuratorData
    ? ConfiguratorDataAdapter.safeNormalize(initialProduct.configuratorData)
    : null;

  const handleCalculate = () => {
    if (!initialProduct || !normalizedConfig) {
      setError('Product configuration data is unavailable');
      return;
    }

    try {
      const estimate = ConfiguratorCalculator.calculate(
        normalizedConfig,
        state
      );
      setResult(estimate);
      setStep(4);
      setError(null);

      // Track quote generation - Phase 6 enhanced tracking
      trackQuoteRequest({
        product_name: initialProduct.title,
        product_category: 'renin_doors',
        total_estimate: estimate.total_with_addons,
        door_type: initialProduct.title,
        dimensions: `${state.width || 0}${state.widthUnit} x ${state.height || 0}${state.heightUnit}`,
        panels: state.panels || 2,
        finish: state.finish || 'standard',
        addons: state.addons,
        source: 'wizard',
      });

      // Legacy tracking (keep for backward compatibility)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'instant_estimate_submit', {
          product_id: initialProduct.id,
          product_title: initialProduct.title,
          width: state.width,
          height: state.height,
          panels: state.panels,
          estimate_low: estimate.price_low,
          estimate_high: estimate.price_high
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid configuration');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="width">Opening Width</Label>
        <div className="flex gap-2">
          <Input
            id="width"
            type="number"
            placeholder="48"
            value={state.width || ''}
            onChange={(e) => setState({ ...state, width: parseFloat(e.target.value) || null })}
          />
          <select
            className="border rounded px-3"
            value={state.widthUnit}
            onChange={(e) => setState({ ...state, widthUnit: e.target.value as 'in' | 'mm' })}
          >
            <option value="in">inches</option>
            <option value="mm">mm</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="height">Opening Height</Label>
        <div className="flex gap-2">
          <Input
            id="height"
            type="number"
            placeholder="80"
            value={state.height || ''}
            onChange={(e) => setState({ ...state, height: parseFloat(e.target.value) || null })}
          />
          <select
            className="border rounded px-3"
            value={state.heightUnit}
            onChange={(e) => setState({ ...state, heightUnit: e.target.value as 'in' | 'mm' })}
          >
            <option value="in">inches</option>
            <option value="mm">mm</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Most closets: 48–72″ wide, 80–96″ high. Rough numbers are fine — we'll verify on site.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <Button
        onClick={() => {
          trackWizardProgress({
            step_number: 1,
            total_steps: 3,
            dimensions: { width: state.width || 0, height: state.height || 0 },
            completion_percentage: 33,
            time_on_step: Date.now() - (window as any).wizardStartTime || 0,
          });
          setStep(2);
        }}
        disabled={!state.width || !state.height}
        className="w-full"
      >
        Next: Panels & Finish <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const renderStep2 = () => {
    if (!initialProduct || !normalizedConfig) return null;

    return (
      <div className="space-y-4">
        <div>
          <Label>Number of Panels</Label>
          <RadioGroup
            value={state.panels?.toString() || ''}
            onValueChange={(val) => setState({ ...state, panels: parseInt(val) })}
          >
            {normalizedConfig.panel_options.map((count) => (
              <div key={count} className="flex items-center space-x-2">
                <RadioGroupItem value={count.toString()} id={`panels-${count}`} />
                <Label htmlFor={`panels-${count}`}>{count} Panel{count > 1 ? 's' : ''}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label>Finish</Label>
          <RadioGroup
            value={state.finish || ''}
            onValueChange={(val) => setState({ ...state, finish: val })}
          >
            {normalizedConfig.finish_options.map((finish) => (
              <div key={finish.id} className="flex items-center space-x-2">
                <RadioGroupItem value={finish.id} id={`finish-${finish.id}`} />
                <Label htmlFor={`finish-${finish.id}`} className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: finish.color }}
                  />
                  {finish.name}
                  {finish.price_modifier > 0 && (
                    <span className="text-xs text-muted-foreground">
                      +{ConfiguratorCalculator.formatPrice(finish.price_modifier)}
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStep(1)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={() => {
              const wizardParams: any = {
                step_number: 2,
                total_steps: 3,
                completion_percentage: 66,
                time_on_step: Date.now() - (window as any).wizardStepTime || 0,
              };
              if (state.panels) wizardParams.panels = state.panels;
              trackWizardProgress(wizardParams);
              setStep(3);
            }}
            disabled={!state.panels || !state.finish}
            className="flex-1"
          >
            Next: Add-ons <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    if (!initialProduct || !normalizedConfig) return null;

    return (
      <div className="space-y-4">
        <div>
          <Label>Optional Add-ons</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Add now or decide at measure
          </p>

          {normalizedConfig.addons.map((addon) => (
            <div key={addon.id} className="flex items-start space-x-2 mb-2">
              <Checkbox
                id={`addon-${addon.id}`}
                checked={state.addons.includes(addon.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setState({ ...state, addons: [...state.addons, addon.id] });
                  } else {
                    setState({ ...state, addons: state.addons.filter(id => id !== addon.id) });
                  }
                }}
              />
              <div className="flex-1">
                <Label htmlFor={`addon-${addon.id}`} className="font-normal cursor-pointer">
                  {addon.name} – {ConfiguratorCalculator.formatPrice(addon.price_cad)}
                </Label>
                {addon.description && (
                  <p className="text-xs text-muted-foreground">{addon.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStep(2)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={handleCalculate} className="flex-1">
            Calculate Estimate
          </Button>
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    if (!result || !initialProduct) return null;

    return (
      <div className="space-y-4">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
          <p className="text-sm text-green-800 mb-2">Estimated Installed Price</p>
          <p className="text-3xl font-bold text-green-900">
            {ConfiguratorCalculator.formatPriceRange(result.price_low, result.total_with_addons)}
          </p>
          <p className="text-sm text-green-700 mt-2">
            Typical install: {result.lead_time_weeks} weeks after measure
          </p>
        </div>

        <div className="border rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm">What's Included:</h4>
          <ul className="text-sm space-y-1">
            {result.includes.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {result.addons.length > 0 && (
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm">Selected Add-ons:</h4>
            <ul className="text-sm space-y-1">
              {result.addons.map((addon) => (
                <li key={addon.id} className="flex justify-between">
                  <span>{addon.name}</span>
                  <span>{ConfiguratorCalculator.formatPrice(addon.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <a href="/book-measure">Book In-Home Measure</a>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <a href={`/products/${initialProduct.id}`}>View Full Details</a>
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          We don't need perfect measurements today — that's our job at the in-home measure.
        </p>
      </div>
    );
  };

  // Handle case where product has no configurator data
  if (!normalizedConfig) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configuration Unavailable</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              This product doesn't support online configuration. Please contact us for a custom quote.
            </p>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <a href="/book-measure">Book Free Measure</a>
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 4 ? 'Your Estimate' : 'Instant Estimate'}
          </DialogTitle>
          {initialProduct && step < 4 && (
            <p className="text-sm text-muted-foreground">{initialProduct.title}</p>
          )}
        </DialogHeader>

        <div className="py-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {step < 4 && (
          <div className="flex justify-center gap-2 pt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-2 rounded-full ${
                  s === step ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
