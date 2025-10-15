# Code Documentation Standards

> **TSDoc/JSDoc standards and best practices for PG Closets codebase**

## 📋 Table of Contents

- [Documentation Philosophy](#documentation-philosophy)
- [TSDoc Overview](#tsdoc-overview)
- [Function Documentation](#function-documentation)
- [Class Documentation](#class-documentation)
- [Interface & Type Documentation](#interface--type-documentation)
- [Component Documentation](#component-documentation)
- [Hook Documentation](#hook-documentation)
- [Best Practices](#best-practices)
- [Examples Library](#examples-library)

## 🎯 Documentation Philosophy

### When to Document

**ALWAYS document:**
- ✅ Public APIs and exported functions
- ✅ Complex algorithms or business logic
- ✅ Non-obvious code behavior
- ✅ Component props and interfaces
- ✅ Custom React hooks
- ✅ Utility functions

**OPTIONAL for:**
- 🤔 Simple, self-explanatory code
- 🤔 Private helper functions (if obvious)
- 🤔 Trivial getters/setters

**NEVER document:**
- ❌ Obvious code that explains itself
- ❌ Code that should be refactored instead

### Documentation Principles

1. **Clarity Over Brevity** - Be clear, even if verbose
2. **Code Examples** - Include examples for complex functions
3. **Why Over What** - Explain why, not just what
4. **Keep Updated** - Update docs when code changes
5. **Be Consistent** - Follow the same style throughout

## 📚 TSDoc Overview

We use TSDoc (TypeScript documentation) which is compatible with JSDoc but optimized for TypeScript.

### Basic Structure

```typescript
/**
 * Brief one-line description
 *
 * Optional detailed description that can span multiple lines
 * and provide more context about the function's purpose,
 * usage patterns, and any important considerations.
 *
 * @param paramName - Description of parameter
 * @returns Description of return value
 * @throws {ErrorType} Description of when error is thrown
 *
 * @example
 * ```ts
 * // Example usage
 * const result = functionName(arg);
 * ```
 *
 * @see {@link RelatedFunction} for related functionality
 * @since 1.0.0
 */
```

### Common Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `@param` | Document parameters | `@param id - Product ID` |
| `@returns` | Document return value | `@returns Product object` |
| `@throws` | Document thrown errors | `@throws {NotFoundError}` |
| `@example` | Provide usage example | See examples below |
| `@see` | Link to related items | `@see {@link Product}` |
| `@since` | Version introduced | `@since 1.0.0` |
| `@deprecated` | Mark as deprecated | `@deprecated Use newFunc instead` |
| `@internal` | Mark as internal API | `@internal` |
| `@beta` | Mark as beta/experimental | `@beta` |
| `@public` | Mark as public API | `@public` |
| `@private` | Mark as private | `@private` |

## 🔧 Function Documentation

### Basic Function

```typescript
/**
 * Formats a price value as a currency string
 *
 * @param amount - The numeric amount to format
 * @param currency - The currency code (e.g., "USD", "CAD")
 * @returns Formatted currency string (e.g., "$123.45")
 *
 * @example
 * ```ts
 * formatCurrency(1234.56, "USD")
 * // returns "$1,234.56"
 *
 * formatCurrency(0, "CAD")
 * // returns "$0.00"
 * ```
 */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
```

### Function with Multiple Parameters

```typescript
/**
 * Calculates the total cart price including tax and discounts
 *
 * This function handles complex pricing calculations including:
 * - Item subtotals (price × quantity)
 * - Discount code validation and application
 * - Tax calculation based on province/state
 * - Shipping cost calculation
 *
 * @param items - Array of cart items with price and quantity
 * @param taxRate - Tax rate as decimal (e.g., 0.13 for 13% HST)
 * @param discountCode - Optional discount code to apply
 * @param shippingAddress - Customer shipping address for tax calculation
 * @returns Object containing subtotal, tax, discount, and total
 *
 * @throws {InvalidDiscountError} If discount code is invalid or expired
 * @throws {TaxCalculationError} If tax calculation fails
 *
 * @example
 * ```ts
 * const items = [
 *   { id: '1', price: 100, quantity: 2 },
 *   { id: '2', price: 50, quantity: 1 }
 * ];
 *
 * const result = calculateCartTotal(
 *   items,
 *   0.13,
 *   "SAVE10",
 *   { province: "ON", country: "CA" }
 * );
 * // returns {
 * //   subtotal: 250,
 * //   discount: 25,
 * //   tax: 29.25,
 * //   total: 254.25
 * // }
 * ```
 */
export function calculateCartTotal(
  items: CartItem[],
  taxRate: number,
  discountCode?: string,
  shippingAddress?: Address
): CartTotal {
  // Implementation
}
```

### Async Function

```typescript
/**
 * Fetches product data from the database by ID or slug
 *
 * This function attempts to find a product by ID first, then falls back
 * to slug lookup. Results are cached for 5 minutes to improve performance.
 *
 * @param identifier - Product ID or slug
 * @param includeRelated - Whether to include related products (default: false)
 * @returns Promise resolving to product data or null if not found
 *
 * @throws {DatabaseError} If database query fails
 * @throws {NetworkError} If connection to database is lost
 *
 * @example
 * ```ts
 * // Fetch by ID
 * const product = await fetchProduct("123");
 *
 * // Fetch by slug with related products
 * const product = await fetchProduct("modern-closet-door", true);
 *
 * if (!product) {
 *   console.error("Product not found");
 * }
 * ```
 *
 * @see {@link Product} for return type structure
 */
export async function fetchProduct(
  identifier: string,
  includeRelated: boolean = false
): Promise<Product | null> {
  // Implementation
}
```

### Generic Function

```typescript
/**
 * Creates a paginated query builder for any database model
 *
 * This utility function provides consistent pagination across all models
 * with support for sorting, filtering, and cursor-based pagination.
 *
 * @template T - The model type being queried
 * @param model - Prisma model delegate
 * @param options - Pagination options
 * @param options.page - Page number (1-indexed)
 * @param options.pageSize - Items per page
 * @param options.sortBy - Field to sort by
 * @param options.sortOrder - Sort direction ("asc" | "desc")
 * @returns Promise resolving to paginated results
 *
 * @example
 * ```ts
 * const result = await paginate(prisma.product, {
 *   page: 1,
 *   pageSize: 20,
 *   sortBy: 'createdAt',
 *   sortOrder: 'desc'
 * });
 * // returns { data: Product[], total: number, page: number, pages: number }
 * ```
 */
export async function paginate<T>(
  model: any,
  options: PaginationOptions
): Promise<PaginatedResult<T>> {
  // Implementation
}
```

## 🏗️ Class Documentation

### Class with Constructor

```typescript
/**
 * Service for managing product operations
 *
 * This service provides a centralized interface for all product-related
 * operations including CRUD operations, search, and filtering. It handles
 * caching, validation, and error handling automatically.
 *
 * @example
 * ```ts
 * const productService = new ProductService(prisma);
 *
 * // Fetch all products
 * const products = await productService.findAll();
 *
 * // Search products
 * const results = await productService.search("modern door");
 *
 * // Create new product
 * const product = await productService.create({
 *   title: "New Product",
 *   price: 299.99
 * });
 * ```
 */
export class ProductService {
  /**
   * Creates a new ProductService instance
   *
   * @param prisma - Prisma client instance for database access
   * @param cache - Optional cache service for query caching
   */
  constructor(
    private prisma: PrismaClient,
    private cache?: CacheService
  ) {}

  /**
   * Retrieves all products with optional filtering
   *
   * @param filters - Optional filters to apply
   * @param filters.category - Filter by category slug
   * @param filters.featured - Filter by featured status
   * @returns Promise resolving to array of products
   *
   * @example
   * ```ts
   * const products = await productService.findAll({
   *   category: "closet-doors",
   *   featured: true
   * });
   * ```
   */
  async findAll(filters?: ProductFilters): Promise<Product[]> {
    // Implementation
  }

  /**
   * Searches products using full-text search
   *
   * Searches across product title, description, and metadata.
   * Results are ranked by relevance.
   *
   * @param query - Search query string
   * @param options - Search options
   * @returns Promise resolving to search results with relevance scores
   *
   * @example
   * ```ts
   * const results = await productService.search("modern door", {
   *   limit: 10,
   *   includeHighlight: true
   * });
   * ```
   */
  async search(
    query: string,
    options?: SearchOptions
  ): Promise<SearchResult[]> {
    // Implementation
  }
}
```

## 📦 Interface & Type Documentation

### Interface

```typescript
/**
 * Represents a product in the catalog
 *
 * Products are the core entities in the e-commerce system.
 * Each product has required fields (id, title, price) and optional
 * metadata for additional flexibility.
 *
 * @see {@link ProductCategory} for category structure
 * @see {@link ProductImage} for image structure
 */
export interface Product {
  /** Unique identifier (UUID) */
  id: string;

  /** URL-friendly slug for routing */
  slug: string;

  /** Product display name */
  title: string;

  /**
   * Product description (supports Markdown)
   * @remarks
   * Should be 50-300 characters for optimal SEO
   */
  description: string;

  /**
   * Current price in cents
   * @remarks
   * Stored in cents to avoid floating-point issues
   * @example 29999 represents $299.99
   */
  price: number;

  /**
   * Original price before discount (optional)
   * Used to show savings to customers
   */
  compareAtPrice?: number;

  /** Product category */
  category: ProductCategory;

  /** Array of product images (first is primary) */
  images: ProductImage[];

  /**
   * Whether product is marked as featured
   * Featured products appear in special sections
   */
  featured: boolean;

  /**
   * Whether product is in stock
   * @default true
   */
  inStock: boolean;

  /**
   * Additional product metadata (flexible schema)
   * Used for custom attributes like material, finish, dimensions
   */
  metadata?: Record<string, any>;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}
```

### Type Alias

```typescript
/**
 * Union type for product sort options
 *
 * Defines all valid sort options for product listings.
 * Each option sorts products by the specified field and direction.
 *
 * @example
 * ```ts
 * const sortOption: ProductSort = "price_asc";
 * const products = await fetchProducts({ sort: sortOption });
 * ```
 */
export type ProductSort =
  | 'price_asc'    // Price: Low to High
  | 'price_desc'   // Price: High to Low
  | 'title_asc'    // Title: A to Z
  | 'title_desc'   // Title: Z to A
  | 'newest'       // Newest first
  | 'featured';    // Featured first

/**
 * Utility type for making all properties of T optional except K
 *
 * @template T - The base type
 * @template K - Keys that should remain required
 *
 * @example
 * ```ts
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * type UserUpdate = PartialExcept<User, 'id'>;
 * // Result: { id: string; name?: string; email?: string; }
 * ```
 */
export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;
```

## ⚛️ Component Documentation

### Basic Component

```tsx
/**
 * Button component with multiple variants and sizes
 *
 * A flexible button component that supports different visual styles,
 * sizes, and states. Built on top of Radix UI primitives with
 * Tailwind CSS for styling.
 *
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * // Secondary button with loading state
 * <Button variant="secondary" isLoading disabled>
 *   Loading...
 * </Button>
 *
 * // Link-styled button
 * <Button variant="ghost" size="sm" asChild>
 *   <Link href="/products">Browse Products</Link>
 * </Button>
 * ```
 *
 * @see {@link ButtonVariant} for available variants
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

  /**
   * Button size
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether button is in loading state
   * Shows loading spinner and disables interaction
   * @default false
   */
  isLoading?: boolean;

  /**
   * Icon to display before button text
   * Accepts any React node (typically a Lucide icon)
   */
  icon?: React.ReactNode;

  /**
   * Whether to render as child component
   * Useful for rendering buttons as links
   * @default false
   */
  asChild?: boolean;

  /**
   * Button content (text, icons, etc.)
   */
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      asChild = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Implementation
  }
);

Button.displayName = 'Button';
```

### Complex Component

```tsx
/**
 * Product card component for displaying product information
 *
 * Displays product image, title, price, and optional features like
 * wishlist, quick view, and comparison. Supports hover states,
 * keyboard navigation, and screen readers.
 *
 * **Accessibility Features:**
 * - ARIA labels for all interactive elements
 * - Keyboard navigation support
 * - Focus management
 * - Screen reader optimized
 *
 * **Performance Considerations:**
 * - Images are lazy-loaded below the fold
 * - Component uses React.memo for optimization
 * - Hover state uses CSS for better performance
 *
 * @example
 * ```tsx
 * <ProductCard
 *   product={{
 *     id: "123",
 *     title: "Modern Closet Door",
 *     price: 299.99,
 *     compareAtPrice: 399.99,
 *     image: "/products/door.jpg"
 *   }}
 *   onAddToCart={(product) => console.log("Added:", product)}
 *   onQuickView={(product) => console.log("Quick view:", product)}
 *   showWishlist
 *   showCompare
 * />
 * ```
 *
 * @see {@link Product} for product data structure
 */
export interface ProductCardProps {
  /**
   * Product data to display
   * Must include at minimum: id, title, price, and image
   */
  product: Product;

  /**
   * Called when user clicks "Add to Cart" button
   * @param product - The product being added
   */
  onAddToCart?: (product: Product) => void;

  /**
   * Called when user clicks quick view icon
   * @param product - The product to preview
   */
  onQuickView?: (product: Product) => void;

  /**
   * Whether to show wishlist button
   * @default false
   */
  showWishlist?: boolean;

  /**
   * Whether to show comparison checkbox
   * @default false
   */
  showCompare?: boolean;

  /**
   * Whether to show product as featured (different styling)
   * @default false
   */
  isFeatured?: boolean;

  /**
   * Image loading priority
   * Use "eager" for above-the-fold images
   * @default "lazy"
   */
  priority?: 'lazy' | 'eager';

  /**
   * Additional CSS classes
   */
  className?: string;
}

export const ProductCard = React.memo<ProductCardProps>(({
  product,
  onAddToCart,
  onQuickView,
  showWishlist = false,
  showCompare = false,
  isFeatured = false,
  priority = 'lazy',
  className
}) => {
  // Implementation
});

ProductCard.displayName = 'ProductCard';
```

## 🪝 Hook Documentation

```typescript
/**
 * Custom hook for managing product filtering and pagination
 *
 * Provides a complete solution for product listing pages including:
 * - Client-side filtering
 * - Server-side pagination
 * - URL state synchronization
 * - Loading and error states
 * - Automatic data fetching
 *
 * @param initialFilters - Initial filter values
 * @returns Object containing products, loading state, and filter functions
 *
 * @example
 * ```tsx
 * function ProductsPage() {
 *   const {
 *     products,
 *     isLoading,
 *     error,
 *     filters,
 *     setFilters,
 *     pagination,
 *     goToPage,
 *   } = useProductFilters({
 *     category: 'closet-doors',
 *     sort: 'price_asc'
 *   });
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return (
 *     <div>
 *       <FilterBar filters={filters} onFilterChange={setFilters} />
 *       <ProductGrid products={products} />
 *       <Pagination {...pagination} onPageChange={goToPage} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link ProductFilters} for available filter options
 * @see {@link UseProductFiltersReturn} for return type details
 */
export function useProductFilters(
  initialFilters: ProductFilters = {}
): UseProductFiltersReturn {
  // Implementation
}
```

## ✅ Best Practices

### 1. Be Descriptive

```typescript
// ❌ BAD: Too brief
/**
 * Gets user
 */
function getUser(id: string) {}

// ✅ GOOD: Descriptive
/**
 * Fetches user data from the database by user ID
 *
 * @param id - User UUID
 * @returns Promise resolving to user object or null if not found
 */
async function getUser(id: string): Promise<User | null> {}
```

### 2. Include Examples

```typescript
// ❌ BAD: No examples
/**
 * Formats a date
 */
function formatDate(date: Date): string {}

// ✅ GOOD: With examples
/**
 * Formats a date according to user's locale
 *
 * @param date - Date to format
 * @param format - Format string ('short' | 'long' | 'iso')
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatDate(new Date('2025-10-14'), 'short')
 * // returns "10/14/2025"
 *
 * formatDate(new Date('2025-10-14'), 'long')
 * // returns "October 14, 2025"
 * ```
 */
function formatDate(date: Date, format: string): string {}
```

### 3. Document Edge Cases

```typescript
/**
 * Divides two numbers
 *
 * @param dividend - Number to be divided
 * @param divisor - Number to divide by
 * @returns Result of division
 *
 * @throws {Error} If divisor is zero
 *
 * @example
 * ```ts
 * divide(10, 2)  // returns 5
 * divide(0, 5)   // returns 0
 * divide(10, 0)  // throws Error: "Cannot divide by zero"
 * ```
 */
function divide(dividend: number, divisor: number): number {
  if (divisor === 0) {
    throw new Error('Cannot divide by zero');
  }
  return dividend / divisor;
}
```

### 4. Link Related Items

```typescript
/**
 * Validates product data before database insertion
 *
 * @param data - Product data to validate
 * @returns Validated and sanitized product data
 *
 * @throws {ValidationError} If validation fails
 *
 * @see {@link Product} for product structure
 * @see {@link createProduct} for creating products after validation
 * @see {@link updateProduct} for updating existing products
 */
function validateProductData(data: Partial<Product>): Product {
  // Implementation
}
```

## 📖 Examples Library

### Utility Function

```typescript
/**
 * Debounces a function call
 *
 * Creates a debounced version of a function that delays execution
 * until after the specified wait period has elapsed since the last call.
 * Useful for rate-limiting expensive operations like API calls or
 * search queries.
 *
 * @template T - Function type being debounced
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait before executing
 * @returns Debounced version of the function
 *
 * @example
 * ```ts
 * const handleSearch = debounce((query: string) => {
 *   fetch(`/api/search?q=${query}`);
 * }, 300);
 *
 * // Function is called once after user stops typing for 300ms
 * input.addEventListener('input', (e) => {
 *   handleSearch(e.target.value);
 * });
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

## 🔍 Documentation Quality Checklist

- [ ] One-line summary is clear and concise
- [ ] Detailed description explains why, not just what
- [ ] All parameters are documented
- [ ] Return value is documented
- [ ] Errors/exceptions are documented
- [ ] At least one code example is provided
- [ ] Complex logic is explained
- [ ] Links to related items are included
- [ ] Edge cases are documented
- [ ] Type parameters are explained (for generics)

## 📚 Related Documentation

- [Contributing Guide](../CONTRIBUTING.md) - General contribution guidelines
- [Code Style Guide](../knowledge-base/BEST_PRACTICES.md) - Code style conventions
- [Component Library](../components/README.md) - Component documentation
- [API Documentation](./API_DOCUMENTATION.md) - API reference

---

For questions about documentation standards, please contact the documentation team or create an issue.
