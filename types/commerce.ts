/**
 * Core commerce types for the unified backend.
 */

/**
 * Represents a product image.
 */
export interface ProductImage {
  url: string;
  altText?: string;
}

/**
 * Represents a single variant of a product (e.g., a specific size or color).
 */
export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number; // Stored in cents
  inventory_quantity: number;
}

/**
 * Represents a value for a product option, like "Small" or "Red".
 */
export interface ProductOptionValue {
  value: string;
}

/**
 * Represents a product option, like "Size" or "Color".
 */
export interface ProductOption {
  id: string;
  title: string;
  values: ProductOptionValue[];
}

/**
 * The main Product interface.
 */
export interface Product {
  id: string;
  title: string;
  handle: string; // URL-friendly slug
  description: string;
  thumbnail?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  options?: ProductOption[];
  tags: string[];
  collection?: {
    id: string;
    title: string;
    handle: string;
  };
  metadata?: Record<string, any>;
  created_at: string; // Changed from createdAt
  updated_at: string; // Changed from updatedAt
}

/**
 * Represents an item in the shopping cart.
 */
export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  title: string;
  unit_price: number; // Stored in cents
  // Include a snapshot of the variant for easy display in the cart
  variant: {
    title: string;
    sku: string;
    price: number;
    image?: ProductImage;
  };
}

/**
 * Represents the user's shopping cart.
 */
export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number; // Stored in cents
  total: number; // Stored in cents
}

/**
 * Represents a customer's shipping or billing address.
 */
export interface Address {
  id?: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
  phone?: string;
}

/**
 * Represents a completed order.
 */
export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  shipping_address: Address;
  billing_address: Address;
  subtotal: number;
  shipping_cost: number;
  tax_total: number;
  total: number;
  status: 'pending' | 'completed' | 'shipped' | 'canceled';
  created_at: string;
}
