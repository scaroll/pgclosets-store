# ADR-003: TypeScript Strict Mode

**Status**: Accepted
**Date**: 2024-10-01  
**Deciders**: Development Team
**Tags**: typescript, code-quality, tooling

## Context

We needed to decide on TypeScript configuration strictness. The choice is between:
- Relaxed mode (easier to adopt, more flexible)
- Strict mode (more type safety, catches more errors)

## Decision

We will use TypeScript strict mode with all strict flags enabled:
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `strictFunctionTypes: true`
- `strictBindCallApply: true`
- `strictPropertyInitialization: true`
- `noImplicitThis: true`
- `alwaysStrict: true`
- `noUncheckedIndexedAccess: true`

## Consequences

### Positive

- Catches type errors at compile time instead of runtime
- Prevents null/undefined errors (most common JS errors)
- Improves code documentation through types
- Better IDE autocomplete and refactoring
- Easier to maintain and refactor code
- Forces explicit handling of edge cases
- Reduces production bugs significantly

### Negative

- Steeper learning curve for TypeScript beginners
- More verbose code in some cases
- Requires explicit null/undefined handling
- May slow down initial development
- Third-party libraries without proper types can be challenging

### Neutral

- Requires team to learn strict TypeScript patterns
- More upfront time investment for long-term benefits

## Coding Patterns

### Handling Null/Undefined

```typescript
// ❌ Bad - Runtime error possible
const userName = user.name.toUpperCase();

// ✅ Good - Explicit handling
const userName = user.name?.toUpperCase() ?? 'Unknown';

// ✅ Good - Type guard
if (user.name) {
  const userName = user.name.toUpperCase();
}
```

### Array Access

```typescript
// ❌ Bad - Might be undefined
const firstProduct = products[0];

// ✅ Good - Explicit check
const firstProduct = products[0];
if (!firstProduct) {
  throw new Error('No products found');
}
```

### Type Assertions

```typescript
// ❌ Bad - Avoid 'as any'
const data = response.data as any;

// ✅ Good - Proper typing
interface ApiResponse {
  data: Product[];
  total: number;
}
const data: ApiResponse = response.data;
```

## Migration Strategy

For existing code with type errors:

1. Fix critical errors first (null/undefined issues)
2. Add proper types to function parameters and returns
3. Remove `any` types progressively
4. Add type guards where needed
5. Use utility types (Partial, Pick, Omit) appropriately

## References

- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- Project tsconfig.json

## Notes

- Use `unknown` instead of `any` for truly unknown types
- Use type guards to narrow types
- Leverage utility types for DRY type definitions
- Use `satisfies` operator for type checking without widening
