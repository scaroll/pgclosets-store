"use client";

import { useState } from "react";
import { ReninProduct } from "@/lib/renin-product-loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequestQuoteButton } from "@/components/ui/request-quote-button";
import {
  ShoppingCart,
  Heart,
  Share2,
  Calculator,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Minus,
  Plus,
  Info,
} from "lucide-react";

interface ProductActionsProps {
  product: ReninProduct;
  selectedVariantId?: string;
  onVariantChange?: (variantId: string) => void;
}

export function ProductActions({ product, selectedVariantId, onVariantChange }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const selectedVariant = selectedVariantId
    ? product.variants?.find(v => v.id === selectedVariantId)
    : product.variants?.[0];

  const isInStock = selectedVariant ? selectedVariant.inventory_quantity > 0 : false;
  const isLowStock = selectedVariant ? selectedVariant.inventory_quantity <= 5 && selectedVariant.inventory_quantity > 0 : false;
  const maxQuantity = selectedVariant ? Math.min(selectedVariant.inventory_quantity, 10) : 1;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, Math.min(newQuantity, maxQuantity)));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !isInStock) return;

    setIsAddingToCart(true);

    try {
      // Simulate API call - replace with actual cart implementation
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('Added to cart:', {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
        price: selectedVariant.price,
      });

      // You could show a success toast here
    } catch (error) {
      console.error('Error adding to cart:', error);
      // You could show an error toast here
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Implement wishlist functionality
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could show a success toast here
  };

  const calculateTotal = () => {
    if (!selectedVariant) return 0;
    const subtotal = selectedVariant.price * quantity;
    const tax = subtotal * 0.13; // 13% HST for Ontario
    return subtotal + tax;
  };

  const getDeliveryEstimate = () => {
    if (!selectedVariant?.requires_shipping) return "Digital delivery";
    return "5-7 business days";
  };

  return (
    <div className="space-y-6">
      {/* Price and savings */}
      <div className="space-y-2">
        {selectedVariant && (
          <>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-medium text-slate-900">
                {formatPrice(selectedVariant.price)}
              </span>
              {selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
                <>
                  <span className="text-lg text-slate-500 line-through font-light">
                    {formatPrice(selectedVariant.compare_at_price)}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    Save {formatPrice(selectedVariant.compare_at_price - selectedVariant.price)}
                  </Badge>
                </>
              )}
            </div>

            {/* Tax information */}
            <p className="text-sm text-slate-600 font-light">
              Price includes HST · Free shipping on orders over $500
            </p>
          </>
        )}
      </div>

      {/* Stock status */}
      <div className="flex items-center gap-2">
        {isInStock ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">In Stock</span>
            {isLowStock && (
              <Badge variant="outline" className="text-amber-600 border-amber-600 text-xs">
                Only {selectedVariant?.inventory_quantity} left
              </Badge>
            )}
          </>
        ) : (
          <>
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">Out of Stock</span>
          </>
        )}
      </div>

      {/* Quantity selector */}
      {isInStock && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">Quantity</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-300 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-10 w-10 rounded-r-none border-r border-slate-300"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center text-sm font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxQuantity}
                className="h-10 w-10 rounded-l-none border-l border-slate-300"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <span className="text-sm text-slate-600 font-light">
              {maxQuantity} available
            </span>
          </div>
        </div>
      )}

      {/* Primary actions */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          disabled={!isInStock || isAddingToCart}
          className="w-full h-12 text-base"
          size="lg"
        >
          {isAddingToCart ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Adding to Cart...
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isInStock ? `Add to Cart - ${formatPrice(selectedVariant?.price || 0)}` : "Out of Stock"}
            </>
          )}
        </Button>

        <RequestQuoteButton
          className="w-full h-12 text-base"
          productName={product.title}
        />
      </div>

      {/* Secondary actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleWishlist}
          className="flex-1"
        >
          <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
          {isWishlisted ? "Saved" : "Save"}
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className="flex-1"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowCalculator(!showCalculator)}
          className="flex-1"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate
        </Button>
      </div>

      {/* Price calculator */}
      {showCalculator && selectedVariant && (
        <div className="bg-slate-50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium text-slate-900">Price Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal ({quantity} × {formatPrice(selectedVariant.price)})</span>
              <span>{formatPrice(selectedVariant.price * quantity)}</span>
            </div>
            <div className="flex justify-between">
              <span>HST (13%)</span>
              <span>{formatPrice(selectedVariant.price * quantity * 0.13)}</span>
            </div>
            <div className="flex justify-between font-medium text-base pt-2 border-t border-slate-200">
              <span>Total</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
          </div>
        </div>
      )}

      {/* Delivery information */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h4 className="font-medium text-slate-900 flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Delivery & Installation
        </h4>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Estimated delivery: {getDeliveryEstimate()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Professional installation available</span>
          </div>
        </div>
      </div>

      {/* Additional product info */}
      <div className="space-y-2 pt-4 border-t border-slate-200 text-sm text-slate-600">
        {selectedVariant?.sku && (
          <div className="flex justify-between">
            <span>SKU:</span>
            <span className="font-light">{selectedVariant.sku}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Manufacturer:</span>
          <span className="font-light">{product.vendor}</span>
        </div>
        {selectedVariant?.requires_shipping && (
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span className="font-light">Required</span>
          </div>
        )}
        {selectedVariant?.taxable && (
          <div className="flex justify-between">
            <span>Tax:</span>
            <span className="font-light">HST included</span>
          </div>
        )}
      </div>

      {/* Trust signals */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
          <p className="text-xs font-medium text-slate-900">Quality Guaranteed</p>
          <p className="text-xs text-slate-600">Official Renin dealer</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <Truck className="w-6 h-6 mx-auto mb-1 text-blue-600" />
          <p className="text-xs font-medium text-slate-900">Free Delivery</p>
          <p className="text-xs text-slate-600">Orders over $500</p>
        </div>
      </div>
    </div>
  );
}