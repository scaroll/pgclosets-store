/**
 * Estimator default values and smart product selection
 * Provides defaults when product data is incomplete
 */

import type { ProductConfiguratorData, FinishOption, ProductAddon } from '@/types/configurator';
import { DOOR_TYPES, getDefaultDoorType } from '@/lib/door-types';

/**
 * Default finish options when not provided
 */
export const DEFAULT_FINISH_OPTIONS: FinishOption[] = [
  {
    id: 'matte_white',
    name: 'Matte White',
    color: '#F8F9FA',
    price_modifier: 0,
  },
  {
    id: 'matte_black',
    name: 'Matte Black',
    color: '#1A1A1A',
    price_modifier: 0,
  },
  {
    id: 'steel_frame',
    name: 'Steel Frame',
    color: '#6C757D',
    price_modifier: 10000, // +$100
  },
  {
    id: 'mirror',
    name: 'Full Mirror',
    color: '#E3F2FD',
    price_modifier: 20000, // +$200
  },
];

/**
 * Default add-ons for all door types
 */
export const DEFAULT_ADDONS: ProductAddon[] = [
  {
    id: 'soft_close',
    name: 'Soft Close System',
    description: 'Quiet, smooth closing mechanism',
    price_cad: 15000, // $150
    category: 'hardware',
  },
  {
    id: 'premium_handles',
    name: 'Premium Handles',
    description: 'Designer handle upgrade',
    price_cad: 8000, // $80
    category: 'hardware',
  },
  {
    id: 'installation',
    name: 'Professional Installation',
    description: 'Expert installation by certified technicians',
    price_cad: 50000, // $500
    category: 'service',
  },
  {
    id: 'removal',
    name: 'Old Door Removal',
    description: 'Remove and dispose of existing doors',
    price_cad: 15000, // $150
    category: 'service',
  },
];

/**
 * Default includes for all installations
 */
export const DEFAULT_INCLUDES = [
  'Premium track system',
  'All mounting hardware',
  'Installation instructions',
  'Lifetime warranty on hardware',
  '2-year warranty on finish',
];

/**
 * Get default configurator data for a door type
 * Used when enhanced product data is missing or incomplete
 */
export function getDefaultConfiguratorData(doorSlug: string): ProductConfiguratorData {
  const doorType = DOOR_TYPES.find(dt => dt.slug === doorSlug) || getDefaultDoorType();

  // Base pricing calculation
  const basePrice = doorType.fromPrice; // in cents
  const pricePerPanel = Math.round(basePrice * 0.4); // ~40% of base per additional panel

  return {
    // Dimensions (standard closet opening range)
    opening_min_width: 48, // inches (1220mm)
    opening_max_width: 144, // inches (3660mm)
    opening_min_height: 72, // inches (1830mm)
    opening_max_height: 96, // inches (2440mm)

    // Options
    panel_options: [2, 3, 4],
    finish_options: DEFAULT_FINISH_OPTIONS,

    // Pricing
    base_price_cad: basePrice,
    installed_price_from_cad: basePrice,
    price_per_panel: pricePerPanel,

    // Installation
    lead_time_weeks: 2,
    includes: DEFAULT_INCLUDES,
    addons: DEFAULT_ADDONS,

    // Gallery
    ottawa_projects_refs: [],
  };
}

/**
 * Smart default product selection based on context
 */
export interface DefaultProductContext {
  entryPoint?: 'hero' | 'category_tile' | 'scroll_trigger' | 'mobile_sticky' | 'pdp';
  lastViewedCategory?: string;
  trafficSource?: string;
}

export function getSmartDefaultProduct(context: DefaultProductContext = {}): {
  slug: string;
  title: string;
  category: string;
} {
  // If coming from category tile, use that category
  if (context.entryPoint === 'category_tile' && context.lastViewedCategory) {
    const doorType = DOOR_TYPES.find(dt => dt.slug === context.lastViewedCategory);
    if (doorType) {
      return {
        slug: doorType.slug,
        title: doorType.name,
        category: doorType.category,
      };
    }
  }

  // If coming from PDP, should already have product context
  if (context.entryPoint === 'pdp') {
    // Caller should provide lastViewedCategory
    const doorType = DOOR_TYPES.find(dt => dt.slug === context.lastViewedCategory);
    if (doorType) {
      return {
        slug: doorType.slug,
        title: doorType.name,
        category: doorType.category,
      };
    }
  }

  // Default to Bypass Doors (most popular)
  const defaultDoor = getDefaultDoorType();
  return {
    slug: defaultDoor.slug,
    title: defaultDoor.name,
    category: defaultDoor.category,
  };
}

/**
 * Get initial estimator state with reasonable defaults
 */
export function getInitialEstimatorState() {
  return {
    width: 72, // Standard 6-foot closet opening
    height: 80, // Standard 80-inch height
    widthUnit: 'in' as const,
    heightUnit: 'in' as const,
    panels: 2, // Most common configuration
    finish: 'matte_white', // Most popular finish
    addons: ['installation'], // Pre-select installation
  };
}

/**
 * Calculate typical Ottawa closet sizes based on door type
 */
export function getTypicalDimensions(doorSlug: string): {
  width: number;
  height: number;
  description: string;
} {
  const doorType = DOOR_TYPES.find(dt => dt.slug === doorSlug);

  switch (doorType?.slug) {
    case 'renin-barn-doors':
      return {
        width: 36,
        height: 84,
        description: 'Typical bedroom closet',
      };

    case 'renin-bypass-doors':
      return {
        width: 72,
        height: 80,
        description: 'Standard reach-in closet',
      };

    case 'renin-bifold-doors':
      return {
        width: 48,
        height: 80,
        description: 'Standard bifold opening',
      };

    case 'renin-room-dividers':
      return {
        width: 120,
        height: 96,
        description: 'Open concept room divider',
      };

    default:
      return {
        width: 72,
        height: 80,
        description: 'Standard closet opening',
      };
  }
}
