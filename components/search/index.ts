/**
 * Search Components Module
 *
 * Complete search/filter system for PG Closets with:
 * - Instant search with autocomplete
 * - Advanced filters (type, style, color, size, price, material, features)
 * - Sort options
 * - Grid/List view toggle
 * - Pagination
 * - Mobile responsive
 */

export { InstantSearch } from './InstantSearch';
export { AdvancedFilters } from './AdvancedFilters';
export { SortOptions, DEFAULT_SORT_OPTIONS } from './SortOptions';
export { SearchResults } from './SearchResults';
export { SearchPage } from './SearchPage';

export type { FilterValues } from './AdvancedFilters';
export type { SortOption } from './SortOptions';
