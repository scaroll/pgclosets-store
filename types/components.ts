/**
 * Component prop types and React-specific interfaces
 */

import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Product, CartItem } from './commerce';
import { PaymentCallback, PaymentSessionData, ShippingInfo } from './api';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Product-related component props
export interface ProductCardProps extends BaseComponentProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  showQuickActions?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export interface ProductGridProps extends BaseComponentProps {
  products: Product[];
  onProductSelect?: (product: Product) => void;
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
  showFilters?: boolean;
}

export interface RelatedProductsProps extends BaseComponentProps {
  products: Product[];
  currentProductId?: string;
  title?: string;
  limit?: number;
}

export interface ProductImageProps extends BaseComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
  placeholder?: string;
}

// Cart-related component props
export interface AddToCartButtonProps extends BaseComponentProps {
  product: Product;
  variantId?: string;
  quantity?: number;
  disabled?: boolean;
  onSuccess?: (item: CartItem) => void;
  onError?: (error: string) => void;
}

export interface CartDrawerProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  cart: import('./commerce').Cart | null;
}

export interface CartIconProps extends BaseComponentProps {
  itemCount?: number;
  onClick?: () => void;
}

// Form component props
export interface QuoteFormData {
  productId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  projectDescription: string;
  projectTimeline?: string;
  projectBudget?: string;
  additionalInfo?: string;
}

export interface QuoteFormProps extends BaseComponentProps {
  product?: Product;
  onSubmit: (data: QuoteFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export interface QuoteModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export interface RequestQuoteButtonProps extends BaseComponentProps {
  product?: Product;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Payment component props
export interface PaymentSectionProps extends BaseComponentProps {
  amount: number;
  currency?: string;
  shippingInfo?: ShippingInfo;
  paymentSessions?: PaymentSessionData[];
  onPaymentSelect?: (sessionId: string) => void;
  onSuccess: (data: PaymentCallback) => void;
  onError?: (error: string) => void;
}

export interface MedusaPaymentSectionProps extends BaseComponentProps {
  cart: import('./commerce').Cart;
  shippingInfo: ShippingInfo;
  paymentSessions: PaymentSessionData[];
  onPaymentSelect?: (sessionId: string) => void;
  onSuccess: (data: PaymentCallback) => void;
  onError?: (error: string) => void;
}

// UI component props
export interface ButtonProps extends BaseComponentProps, ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  loadingText?: string;
}

export interface InputProps extends BaseComponentProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface TextareaProps extends BaseComponentProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resize?: boolean;
}

export interface FileUploadProps extends BaseComponentProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  onFileSelect: (files: File[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  progress?: number;
}

export interface DropdownMenuProps extends BaseComponentProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export interface DropdownMenuItem {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

// Layout component props
export interface MegaMenuProps extends BaseComponentProps {
  items: MegaMenuItem[];
  isOpen?: boolean;
  onClose?: () => void;
}

export interface MegaMenuItem {
  label: string;
  href?: string;
  children?: MegaMenuItem[];
  featured?: boolean;
  description?: string;
  image?: string;
}

export interface FooterProps extends BaseComponentProps {
  companyInfo?: {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  links?: FooterLinkSection[];
  socialLinks?: SocialLink[];
  showNewsletter?: boolean;
}

export interface FooterLinkSection {
  title: string;
  links: {
    label: string;
    href: string;
    external?: boolean;
  }[];
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
  url: string;
  label?: string;
}

// Performance and monitoring component props
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
}

export interface PerformanceMonitorProps {
  enabled?: boolean;
  sampleRate?: number;
  onMetric?: (metric: PerformanceMetric) => void;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  additional?: Record<string, unknown>;
}

// SEO component props
export interface StructuredDataProps {
  type: 'Product' | 'Organization' | 'WebSite' | 'BreadcrumbList';
  data: Record<string, unknown>;
}

export interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

// Gallery component props
export interface ImageCarouselProps extends BaseComponentProps {
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  autoPlay?: boolean;
  showThumbnails?: boolean;
  showControls?: boolean;
  aspectRatio?: string;
}

export interface VideoGalleryProps extends BaseComponentProps {
  videos: Array<{
    url: string;
    title: string;
    thumbnail?: string;
    duration?: string;
  }>;
  layout?: 'grid' | 'carousel';
  autoPlay?: boolean;
}