"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { products as reninProducts } from "@/lib/renin-products";
import { OTTAWA_PRICING_CONFIG } from "@/types/ottawa-pricing";
import type {
  ReninQuoteRequest,
  ReninQuoteResponse,
  QuoteCalculationInput,
  QuoteCalculationResult
} from "@/types/ottawa-pricing";

interface ReninQuoteFormProps {
  selectedProductId?: string;
  className?: string;
}

interface ProductSelection extends QuoteCalculationInput {
  id: string;
}

export function ReninQuoteForm({ selectedProductId, className = "" }: ReninQuoteFormProps) {
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<ProductSelection[]>([]);
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postalCode: "",
    customerType: "residential" as const
  });
  const [projectDetails, setProjectDetails] = useState({
    projectType: "renovation" as const,
    timeline: "1-3months" as const,
    additionalNotes: ""
  });
  const [preferences, setPreferences] = useState({
    includeFinancing: false,
    preferredContactMethod: "both" as const,
    hearAboutUs: ""
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [quote, setQuote] = useState<ReninQuoteResponse | null>(null);
  const [pricePreview, setPricePreview] = useState<QuoteCalculationResult | null>(null);

  // Initialize with selected product if provided
  useEffect(() => {
    if (selectedProductId) {
      const product = reninProducts.find(p => p.id === selectedProductId);
      if (product) {
        addProduct(product);
      }
    }
  }, [selectedProductId]);

  // Calculate price preview when products change
  useEffect(() => {
    if (selectedProducts.length > 0) {
      calculatePreview();
    } else {
      setPricePreview(null);
    }
  }, [selectedProducts, customer.customerType, customer.postalCode]);

  const addProduct = (product: any) => {
    const newProduct: ProductSelection = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id.toString(),
      productName: product.name,
      productCategory: product.category,
      msrpPrice: product.price,
      width: 30, // Default width
      height: 80, // Default height
      quantity: 1,
      includeInstallation: true,
      customerType: customer.customerType,
      postalCode: customer.postalCode,
      doorType: mapCategoryToDoorType(product.category)
    };
    setSelectedProducts([...selectedProducts, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<ProductSelection>) => {
    setSelectedProducts(products =>
      products.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const removeProduct = (id: string) => {
    setSelectedProducts(products => products.filter(p => p.id !== id));
  };

  const mapCategoryToDoorType = (category: string): string => {
    const mapping: Record<string, string> = {
      'barn-doors': 'barn-door',
      'interior-doors': 'sliding',
      'closet-systems': 'bifold',
      'room-dividers': 'sliding',
      'glass-mirrors': 'sliding'
    };
    return mapping[category] || 'standard';
  };

  const calculatePreview = async () => {
    if (selectedProducts.length === 0 || !customer.postalCode) return;

    try {
      // Simple preview calculation (basic pricing logic)
      let total = 0;
      let installation = 0;
      let delivery = 0;

      selectedProducts.forEach(product => {
        const basePrice = product.msrpPrice * product.quantity;
        const markedUp = basePrice * (1 + OTTAWA_PRICING_CONFIG.baseMarkup);
        total += markedUp;

        if (product.includeInstallation) {
          const installRate = OTTAWA_PRICING_CONFIG.installationRates.find(r =>
            r.doorType === product.doorType) || OTTAWA_PRICING_CONFIG.installationRates[5];
          const sqft = (product.width * product.height) / 144;
          installation += (installRate.baseRate + (installRate.perSquareFootRate || 0) * sqft) * product.quantity;
        }
      });

      // Calculate delivery for postal code
      const zone = OTTAWA_PRICING_CONFIG.deliveryZones.find(z =>
        z.postalCodes.some(code => customer.postalCode.toUpperCase().startsWith(code))
      );
      delivery = zone ? zone.deliveryFee : 175;

      if (zone?.freeDeliveryThreshold && (total + installation) >= zone.freeDeliveryThreshold) {
        delivery = 0;
      }

      const subtotal = total + installation + delivery;
      const hst = subtotal * OTTAWA_PRICING_CONFIG.hstRate;
      const finalTotal = subtotal + hst;

      setPricePreview({
        basePrice: total,
        markedUpPrice: total,
        volumeDiscount: 0,
        customerDiscount: 0,
        subtotal: total,
        installationCost: installation,
        deliveryFee: delivery,
        subtotalWithServices: subtotal,
        hst,
        total: finalTotal,
        savings: 0,
        breakdown: {
          msrp: total,
          markup: 0,
          volumeDiscount: 0,
          customerDiscount: 0,
          installation,
          delivery,
          hst,
          total: finalTotal
        }
      });
    } catch (error) {
      console.error("Error calculating preview:", error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const quoteRequest: ReninQuoteRequest = {
        customer: {
          ...customer,
          customerType: customer.customerType
        },
        products: selectedProducts.map(p => ({
          productId: p.productId,
          productName: p.productName,
          productCategory: p.productCategory,
          msrpPrice: p.msrpPrice,
          width: p.width,
          height: p.height,
          quantity: p.quantity,
          includeInstallation: p.includeInstallation,
          customerType: customer.customerType,
          postalCode: customer.postalCode,
          doorType: p.doorType
        })),
        includeFinancing: preferences.includeFinancing,
        projectDetails,
        preferredContactMethod: preferences.preferredContactMethod,
        hearAboutUs: preferences.hearAboutUs
      };

      const response = await fetch("/api/quotes/renin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteRequest)
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote request");
      }

      const result: ReninQuoteResponse = await response.json();
      setQuote(result);
      setCurrentStep(4); // Move to success step
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-12 h-0.5 mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderProductSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Select Your Renin Products</h2>

      {/* Product Search/Filter */}
      <div className="max-w-md mx-auto">
        <label htmlFor="product-select" className="sr-only">
          Select a product to add to your quote
        </label>
        <select
          id="product-select"
          className="w-full p-3 border border-gray-300 rounded-lg"
          aria-label="Select a Renin product to add to your quote"
          onChange={(e) => {
            if (e.target.value) {
              const product = reninProducts.find(p => p.id === e.target.value);
              if (product) {
                addProduct(product);
                e.target.value = "";
              }
            }
          }}
        >
          <option value="">Add a Product...</option>
          {reninProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - ${product.price}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Selected Products:</h3>
          {selectedProducts.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium">{product.productName}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProduct(product.id)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor={`width-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Width (inches)
                  </label>
                  <input
                    id={`width-${product.id}`}
                    type="number"
                    min="12"
                    max="120"
                    value={product.width}
                    onChange={(e) => updateProduct(product.id, { width: parseInt(e.target.value) || 30 })}
                    className="w-full p-2 border border-gray-300 rounded"
                    aria-label={`Width in inches for ${product.productName}`}
                  />
                </div>

                <div>
                  <label htmlFor={`height-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Height (inches)
                  </label>
                  <input
                    id={`height-${product.id}`}
                    type="number"
                    min="60"
                    max="120"
                    value={product.height}
                    onChange={(e) => updateProduct(product.id, { height: parseInt(e.target.value) || 80 })}
                    className="w-full p-2 border border-gray-300 rounded"
                    aria-label={`Height in inches for ${product.productName}`}
                  />
                </div>

                <div>
                  <label htmlFor={`quantity-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    id={`quantity-${product.id}`}
                    type="number"
                    min="1"
                    max="50"
                    value={product.quantity}
                    onChange={(e) => updateProduct(product.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 border border-gray-300 rounded"
                    aria-label={`Quantity for ${product.productName}`}
                  />
                </div>

                <div className="flex items-end">
                  <label htmlFor={`installation-${product.id}`} className="flex items-center">
                    <input
                      id={`installation-${product.id}`}
                      type="checkbox"
                      checked={product.includeInstallation}
                      onChange={(e) => updateProduct(product.id, { includeInstallation: e.target.checked })}
                      className="mr-2"
                      aria-label={`Include installation for ${product.productName}`}
                    />
                    <span className="text-sm">Include Installation</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Price Preview */}
      {pricePreview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Price Preview</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Products:</span>
              <span>${pricePreview.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Installation:</span>
              <span>${pricePreview.installationCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>${pricePreview.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>HST (13%):</span>
              <span>${pricePreview.hst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-blue-900 border-t pt-1">
              <span>Total:</span>
              <span>${pricePreview.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Button
          onClick={() => setCurrentStep(2)}
          disabled={selectedProducts.length === 0}
          size="lg"
        >
          Continue to Customer Info
        </Button>
      </div>
    </div>
  );

  const renderCustomerInfo = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Customer Information</h2>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              id="first-name"
              type="text"
              required
              value={customer.firstName}
              onChange={(e) => setCustomer({...customer, firstName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg"
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              id="last-name"
              type="text"
              required
              value={customer.lastName}
              onChange={(e) => setCustomer({...customer, lastName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg"
              aria-required="true"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            required
            value={customer.email}
            onChange={(e) => setCustomer({...customer, email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            aria-required="true"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={customer.phone}
              onChange={(e) => setCustomer({...customer, phone: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Optional contact number"
            />
          </div>

          <div>
            <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 mb-1">
              Ottawa Postal Code *
            </label>
            <input
              id="postal-code"
              type="text"
              required
              value={customer.postalCode}
              onChange={(e) => setCustomer({...customer, postalCode: e.target.value.toUpperCase()})}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="K1A 0A6"
              pattern="[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d"
              aria-required="true"
            />
          </div>
        </div>

        <div>
          <label htmlFor="customer-type" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Type
          </label>
          <select
            id="customer-type"
            value={customer.customerType}
            onChange={(e) => setCustomer({...customer, customerType: e.target.value as any})}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="residential">Residential Customer</option>
            <option value="contractor">Contractor/Builder (15% discount)</option>
            <option value="senior">Senior (65+) - 10% discount</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(1)}
        >
          Back to Products
        </Button>
        <Button
          onClick={() => setCurrentStep(3)}
          disabled={!customer.firstName || !customer.lastName || !customer.email || !customer.postalCode}
          size="lg"
        >
          Continue to Project Details
        </Button>
      </div>
    </div>
  );

  const renderProjectDetails = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Project Details</h2>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="project-type" className="block text-sm font-medium text-gray-700 mb-1">
              Project Type
            </label>
            <select
              id="project-type"
              value={projectDetails.projectType}
              onChange={(e) => setProjectDetails({...projectDetails, projectType: e.target.value as any})}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="renovation">Home Renovation</option>
              <option value="new-construction">New Construction</option>
              <option value="replacement">Door Replacement</option>
            </select>
          </div>

          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
              Timeline
            </label>
            <select
              id="timeline"
              value={projectDetails.timeline}
              onChange={(e) => setProjectDetails({...projectDetails, timeline: e.target.value as any})}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="immediate">ASAP (Rush order)</option>
              <option value="1-3months">1-3 months</option>
              <option value="3-6months">3-6 months</option>
              <option value="6plus-months">6+ months</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contact-method" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Contact Method
          </label>
          <select
            id="contact-method"
            value={preferences.preferredContactMethod}
            onChange={(e) => setPreferences({...preferences, preferredContactMethod: e.target.value as any})}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="both">Phone and Email</option>
            <option value="email">Email Only</option>
            <option value="phone">Phone Only</option>
          </select>
        </div>

        <div>
          <label htmlFor="financing-option" className="flex items-center">
            <input
              id="financing-option"
              type="checkbox"
              checked={preferences.includeFinancing}
              onChange={(e) => setPreferences({...preferences, includeFinancing: e.target.checked})}
              className="mr-2"
              aria-label="Include financing options in quote"
            />
            <span className="text-sm">Include financing options (available for orders over $1,000)</span>
          </label>
        </div>

        <div>
          <label htmlFor="hear-about-us" className="block text-sm font-medium text-gray-700 mb-1">
            How did you hear about us?
          </label>
          <input
            id="hear-about-us"
            type="text"
            value={preferences.hearAboutUs}
            onChange={(e) => setPreferences({...preferences, hearAboutUs: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Google, referral, social media, etc."
          />
        </div>

        <div>
          <label htmlFor="additional-notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            id="additional-notes"
            rows={4}
            value={projectDetails.additionalNotes}
            onChange={(e) => setProjectDetails({...projectDetails, additionalNotes: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Any special requirements, measurements, or questions..."
          />
        </div>
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(2)}
        >
          Back to Customer Info
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? "Submitting Quote..." : "Submit Quote Request"}
        </Button>
      </div>

      {submitError && (
        <div
          className="text-red-600 text-center bg-red-50 border border-red-200 rounded-lg p-3"
          role="alert"
          aria-live="polite"
        >
          {submitError}
        </div>
      )}
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-green-900">Quote Request Submitted!</h2>

      {quote && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Quote #{quote.quoteNumber}</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold">${quote.quote.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Valid Until:</span>
                <span>{quote.validUntil}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <span>{quote.estimatedDelivery}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ul className="text-sm text-left space-y-1">
              {quote.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-sm text-gray-600">
            <p>Sales Contact: {quote.salesContact.name}</p>
            <p>Email: {quote.salesContact.email}</p>
            <p>Phone: {quote.salesContact.phone}</p>
          </div>
        </div>
      )}

      <Button
        onClick={() => {
          setCurrentStep(1);
          setSelectedProducts([]);
          setQuote(null);
          setCustomer({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            postalCode: "",
            customerType: "residential"
          });
        }}
        variant="outline"
      >
        Get Another Free Quote
      </Button>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      {renderStepIndicator()}

      {currentStep === 1 && renderProductSelection()}
      {currentStep === 2 && renderCustomerInfo()}
      {currentStep === 3 && renderProjectDetails()}
      {currentStep === 4 && renderSuccess()}
    </div>
  );
}