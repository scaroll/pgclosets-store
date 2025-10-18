/**
 * Product configurator and instant estimate types
 */

export interface ProductConfiguratorData {
  // Dimensions
  opening_min_width: number;
  opening_max_width: number;
  opening_min_height: number;
  opening_max_height: number;

  // Options
  panel_options: number[];
  finish_options: FinishOption[];

  // Pricing
  base_price_cad: number;
  installed_price_from_cad: number;
  price_per_panel: number;

  // Installation
  lead_time_weeks: number;
  includes: string[];
  addons: ProductAddon[];

  // Gallery
  ottawa_projects_refs?: string[];
}

export interface FinishOption {
  id: string;
  name: string;
  color: string;
  image?: string;
  price_modifier: number; // +/- amount in cents
}

export interface ProductAddon {
  id: string;
  name: string;
  description?: string;
  price_cad: number;
  category: 'hardware' | 'service' | 'upgrade';
}

export interface ConfiguratorState {
  width: number | null;
  height: number | null;
  widthUnit: 'in' | 'mm';
  heightUnit: 'in' | 'mm';
  panels: number | null;
  finish: string | null;
  addons: string[];
}

export interface EstimateResult {
  price_low: number;
  price_high: number;
  includes: string[];
  addons: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  total_with_addons: number;
  lead_time_weeks: number;
}

export interface QuickConfigureProps {
  product: {
    id: string;
    title: string;
    handle: string;
    thumbnail?: string;
    configuratorData: ProductConfiguratorData;
  };
}

export interface InstantEstimatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: {
    id: string;
    title: string;
    configuratorData: ProductConfiguratorData;
  };
}

// Book Measure types
export interface BookMeasureData {
  address: {
    street: string;
    city: string;
    province: string;
    postal_code: string;
    lat?: number;
    lng?: number;
  };
  within_radius: boolean;
  radius_fee?: number;
  preferred_date?: string;
  preferred_time?: string;
  opening_type: string;
  rough_dimensions?: {
    width: number;
    height: number;
    unit: 'in' | 'mm';
  };
  notes?: string;
  photos?: File[];
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface BookMeasureSlot {
  date: string;
  time: string;
  available: boolean;
  installer?: string;
}

// Service Area types
export interface ServiceArea {
  name: string;
  slug: string;
  neighborhoods: string[];
  lat: number;
  lng: number;
  radius_km: number;
  free_measure: boolean;
  measure_fee?: number;
}

// Analytics event types
export interface ConfiguratorEvent {
  event: 'collection_quick_config' | 'instant_estimate_open' | 'instant_estimate_submit' | 'estimate_result_view' | 'book_measure_open' | 'book_measure_submit' | 'pdp_addons_toggle' | 'rooms_tile_click' | 'service_area_click' | 'exit_offer_accept';
  product_id?: string;
  product_title?: string;
  width?: number;
  height?: number;
  panels?: number;
  finish?: string;
  estimate_low?: number;
  estimate_high?: number;
  service_area?: string;
  timestamp: number;
}
