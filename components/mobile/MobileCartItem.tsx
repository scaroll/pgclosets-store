"use client";

import { Button } from "../ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MobileCartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    customizations?: {
      width?: number;
      height?: number;
      hardware?: string;
      installation?: boolean;
    };
  };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  className?: string;
}

export function MobileCartItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
  className
}: MobileCartItemProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden",
      "mobile-cart-item", // Custom mobile optimization class
      className
    )}>
      <div className="p-4">
        {/* Mobile-optimized layout: image and content stacked */}
        <div className="flex gap-4">
          {/* Larger product image for mobile */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>

          {/* Product details with mobile-optimized layout */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Door</p>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {item.name}
                </h3>
              </div>

              {/* Mobile-optimized remove button */}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemoveItem(item.id)}
                className="text-gray-400 hover:text-red-500 ml-2 p-2 min-w-[40px] min-h-[40px] active:bg-red-50"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Price display optimized for mobile */}
            <div className="mb-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                ${item.price.toLocaleString()} CAD
              </span>
            </div>

            {/* Customizations - mobile-friendly display */}
            {item.customizations && (
              <div className="text-xs sm:text-sm text-gray-600 mb-3 space-y-1">
                {item.customizations.width && item.customizations.height && (
                  <div>
                    Size: {item.customizations.width}" × {item.customizations.height}"
                  </div>
                )}
                {item.customizations.hardware && (
                  <div>Hardware: {item.customizations.hardware}</div>
                )}
                {item.customizations.installation && (
                  <div className="text-blue-600">+ Installation Included</div>
                )}
              </div>
            )}

            {/* Mobile-optimized quantity controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600 mr-3">Qty:</span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-10 h-10 p-0 active:bg-gray-100"
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-12 text-center font-medium text-base">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-10 h-10 p-0 active:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              {/* Total price for this item */}
              <div className="text-right">
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  ${(item.price * item.quantity).toLocaleString()} CAD
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-specific premium quality indicator */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
            Premium Quality • Free Shipping on Orders Over $500
          </div>
        </div>
      </div>
    </div>
  );
}