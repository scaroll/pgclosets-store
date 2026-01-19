export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  thumbnail: string;
  highRes: string;
  width: number;
  height: number;
  fileSize?: number;
  category?: string;
  tags?: string[];
}

export interface GalleryView {
  id: string;
  name: string;
  angle: string;
  icon: string;
  images: GalleryImage[];
}

export interface TechnicalSpec {
  category: string;
  specs: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
}

export interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category: string;
  rating?: number;
  inStock: boolean;
}

export interface LightboxState {
  isOpen: boolean;
  currentImageIndex: number;
  images: GalleryImage[];
  showSpecs: boolean;
  zoomLevel: number;
  panPosition: { x: number; y: number };
}

export interface GalleryConfig {
  showThumbnails: boolean;
  autoPlay: boolean;
  autoPlayInterval: number;
  enableZoom: boolean;
  maxZoom: number;
  showSpecs: boolean;
  enableDownload: boolean;
  enableShare: boolean;
  relatedProductsCount: number;
}

export interface ShareOptions {
  platform: 'email' | 'facebook' | 'twitter' | 'pinterest' | 'whatsapp' | 'copy-link';
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

export interface ZoomState {
  scale: number;
  x: number;
  y: number;
  isDragging: boolean;
}

export interface ViewportDimensions {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}