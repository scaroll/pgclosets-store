/**
 * Premium Product Display Components
 * Agents 16-20: Complete E-commerce Product System
 *
 * Export all premium product components and types
 */

// Components
export { ProductCard } from './ProductCard.premium'
export { ProductGallery } from './ProductGallery.premium'
export { ProductQuickView } from './ProductQuickView.premium'
export { ProductFilter } from './ProductFilter.premium'
export { ProductSort } from './ProductSort.premium'

// Types - ProductCard
export type {
  ProductVariant,
  ProductCardData,
} from './ProductCard.premium'

// Types - ProductGallery
export type { GalleryImage } from './ProductGallery.premium'

// Types - ProductQuickView
export type {
  QuickViewVariant,
  QuickViewProduct,
} from './ProductQuickView.premium'

// Types - ProductFilter
export type {
  FilterOption,
  FilterGroup,
  PriceRange,
  ActiveFilters,
} from './ProductFilter.premium'

// Types - ProductSort
export type { SortOption } from './ProductSort.premium'

// Examples
export {
  ProductSystemExample,
  ProductCardExample,
  ProductGalleryExample,
  ProductFilterExample,
} from './ProductSystem.example'
