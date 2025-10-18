/**
 * Configurator Data Adapter
 *
 * Bridges the gap between JSON product data structure and TypeScript interfaces.
 * Handles both legacy nested format and new flat format for backward compatibility.
 */

import type { ProductConfiguratorData, FinishOption, ProductAddon } from '@/types/configurator';

/**
 * Raw product data structure from JSON (nested format)
 */
interface RawConfiguratorData {
  size?: {
    opening_min_width_mm?: number;
    opening_max_width_mm?: number;
    opening_min_height_mm?: number;
    opening_max_height_mm?: number;
  };
  options?: {
    panel_options?: string[] | number[];
    finish_options?: string[] | FinishOption[];
  };
  base_price_cad?: number;
  installed_price_from_cad?: number;
  lead_time_weeks?: number;
  // Flat format fallbacks
  opening_min_width?: number;
  opening_max_width?: number;
  opening_min_height?: number;
  opening_max_height?: number;
  panel_options?: number[];
  finish_options?: FinishOption[];
  price_per_panel?: number;
  includes?: string[];
  addons?: ProductAddon[];
}

/**
 * Default finish options for products without explicit finish data
 */
const DEFAULT_FINISH_OPTIONS: FinishOption[] = [
  {
    id: 'matte_white',
    name: 'Matte White',
    color: '#F8F8F8',
    price_modifier: 0
  },
  {
    id: 'matte_black',
    name: 'Matte Black',
    color: '#1A1A1A',
    price_modifier: 5000 // $50 upcharge
  },
  {
    id: 'wood_grain',
    name: 'Natural Wood Grain',
    color: '#8B6F47',
    price_modifier: 10000 // $100 upcharge
  },
  {
    id: 'mirror',
    name: 'Mirror Finish',
    color: '#E8E8E8',
    price_modifier: 15000 // $150 upcharge
  }
];

/**
 * Default add-ons available for most products
 */
const DEFAULT_ADDONS: ProductAddon[] = [
  {
    id: 'soft_close',
    name: 'Soft-Close Hardware',
    description: 'Premium damping system prevents slamming',
    price_cad: 9900,
    category: 'hardware'
  },
  {
    id: 'premium_handles',
    name: 'Designer Handles',
    description: 'Upgraded handle set in brushed nickel or brass',
    price_cad: 7900,
    category: 'hardware'
  },
  {
    id: 'white_glove',
    name: 'White Glove Service',
    description: 'Premium installation with furniture moving',
    price_cad: 14900,
    category: 'service'
  }
];

/**
 * Default values included in installed price
 */
const DEFAULT_INCLUDES = [
  'Professional in-home measurement',
  'Custom fabrication to exact dimensions',
  'Professional installation',
  'All mounting hardware and tracks',
  'Post-installation cleanup',
  '30-day fit and finish check',
  'Lifetime warranty on materials'
];

/**
 * Adapter class to normalize configurator data
 */
export class ConfiguratorDataAdapter {
  /**
   * Normalize raw JSON data to ProductConfiguratorData interface
   */
  static normalize(raw: RawConfiguratorData | null | undefined): ProductConfiguratorData {
    if (!raw) {
      throw new Error('Configurator data is missing');
    }

    // Convert mm to inches for dimensions (interface expects inches)
    const mmToInches = (mm: number) => Math.round(mm / 25.4);

    // Extract dimensions (try nested format first, then flat)
    const opening_min_width = raw.opening_min_width ||
      (raw.size?.opening_min_width_mm ? mmToInches(raw.size.opening_min_width_mm) : 24);

    const opening_max_width = raw.opening_max_width ||
      (raw.size?.opening_max_width_mm ? mmToInches(raw.size.opening_max_width_mm) : 120);

    const opening_min_height = raw.opening_min_height ||
      (raw.size?.opening_min_height_mm ? mmToInches(raw.size.opening_min_height_mm) : 72);

    const opening_max_height = raw.opening_max_height ||
      (raw.size?.opening_max_height_mm ? mmToInches(raw.size.opening_max_height_mm) : 96);

    // Extract panel options (try nested format first, then flat)
    const panelOptions = raw.panel_options || raw.options?.panel_options || [2, 3, 4];
    const panel_options = panelOptions.map(p => typeof p === 'string' ? parseInt(p) : p);

    // Extract finish options
    const rawFinishOptions = raw.finish_options || raw.options?.finish_options || [];
    const finish_options = this.normalizeFinishOptions(rawFinishOptions);

    // Calculate price per panel (20% of base price by default)
    const base_price = (raw.installed_price_from_cad || raw.base_price_cad || 1299) * 100; // Convert to cents
    const price_per_panel = raw.price_per_panel || Math.floor(base_price * 0.20);

    return {
      opening_min_width,
      opening_max_width,
      opening_min_height,
      opening_max_height,
      panel_options,
      finish_options,
      base_price_cad: base_price,
      installed_price_from_cad: base_price,
      price_per_panel,
      lead_time_weeks: raw.lead_time_weeks || 2,
      includes: raw.includes || DEFAULT_INCLUDES,
      addons: raw.addons || DEFAULT_ADDONS,
      ottawa_projects_refs: []
    };
  }

  /**
   * Normalize finish options from various formats
   */
  private static normalizeFinishOptions(
    raw: string[] | FinishOption[] | undefined
  ): FinishOption[] {
    if (!raw || raw.length === 0) {
      return DEFAULT_FINISH_OPTIONS;
    }

    // If already FinishOption objects, return as-is
    if (typeof raw[0] === 'object' && 'id' in raw[0]) {
      return raw as FinishOption[];
    }

    // Convert string IDs to FinishOption objects
    const finishIds = raw as string[];
    return finishIds.map(id => {
      const defaultFinish = DEFAULT_FINISH_OPTIONS.find(f => f.id === id);
      if (defaultFinish) {
        return defaultFinish;
      }

      // Create basic finish option for unknown IDs
      return {
        id,
        name: this.humanizeFinishId(id),
        color: this.guessColorFromId(id),
        price_modifier: 0
      };
    });
  }

  /**
   * Convert finish ID to human-readable name
   */
  private static humanizeFinishId(id: string): string {
    return id
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Guess color hex from finish ID
   */
  private static guessColorFromId(id: string): string {
    const colorMap: Record<string, string> = {
      white: '#F8F8F8',
      black: '#1A1A1A',
      grey: '#9E9E9E',
      gray: '#9E9E9E',
      wood: '#8B6F47',
      oak: '#C19A6B',
      walnut: '#5C4033',
      mirror: '#E8E8E8',
      steel: '#B0B0B0',
      bronze: '#CD7F32',
      smoke: '#72767D'
    };

    for (const [keyword, color] of Object.entries(colorMap)) {
      if (id.toLowerCase().includes(keyword)) {
        return color;
      }
    }

    return '#CCCCCC'; // Default gray
  }

  /**
   * Validate that normalized data has all required fields
   */
  static validate(data: ProductConfiguratorData): boolean {
    const required = [
      'opening_min_width',
      'opening_max_width',
      'opening_min_height',
      'opening_max_height',
      'panel_options',
      'finish_options',
      'base_price_cad',
      'installed_price_from_cad',
      'price_per_panel',
      'lead_time_weeks',
      'includes',
      'addons'
    ];

    for (const field of required) {
      if (!(field in data)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }

    // Validate arrays aren't empty
    if (data.panel_options.length === 0) {
      console.error('panel_options cannot be empty');
      return false;
    }

    if (data.finish_options.length === 0) {
      console.error('finish_options cannot be empty');
      return false;
    }

    return true;
  }

  /**
   * Safe normalization with error handling
   */
  static safeNormalize(raw: any): ProductConfiguratorData | null {
    try {
      const normalized = this.normalize(raw);

      if (!this.validate(normalized)) {
        console.error('Normalized data failed validation', normalized);
        return null;
      }

      return normalized;
    } catch (error) {
      console.error('Failed to normalize configurator data:', error);
      return null;
    }
  }
}

/**
 * Helper function for components to safely get configurator data
 */
export function getConfiguratorData(product: any): ProductConfiguratorData | null {
  if (!product) {
    return null;
  }

  // Try to get from configurator_data or configuratorData (both formats)
  const raw = product.configurator_data || product.configuratorData;

  if (!raw) {
    return null;
  }

  return ConfiguratorDataAdapter.safeNormalize(raw);
}

/**
 * Check if a product has valid configurator data
 */
export function hasConfiguratorData(product: any): boolean {
  return getConfiguratorData(product) !== null;
}
