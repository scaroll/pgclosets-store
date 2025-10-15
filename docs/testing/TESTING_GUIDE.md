# PG Closets Testing Guide

## Overview

This guide provides comprehensive documentation for the PG Closets testing infrastructure. Our testing strategy ensures high quality, prevents regressions, and enables confident deployments.

## Testing Philosophy

### Core Principles

1. **Test Behavior, Not Implementation** - Focus on what the code does, not how it does it
2. **Write Tests First for Bugs** - Use TDD for bug fixes to prevent regressions
3. **Maintainable Tests** - Tests should be easy to understand and modify
4. **Fast Feedback** - Tests should run quickly to enable rapid iteration
5. **Comprehensive Coverage** - Aim for >80% code coverage with focus on critical paths

### Testing Pyramid

```
        /\
       /  \
      / E2E \         10% - Full user journeys
     /______\
    /        \
   /Integration\     30% - API routes, database, services
  /____________\
 /              \
/  Unit Tests    \   60% - Functions, hooks, utilities
/_________________\
```

## Test Types

### 1. Unit Tests (Vitest + React Testing Library)

**Purpose**: Test individual functions, hooks, and components in isolation

**Location**: `/tests/unit/`

**Run Command**: `npm run test`

**What to Test**:
- Utility functions (formatting, validation, calculations)
- Custom React hooks
- Component logic without rendering
- Pure functions and business logic

**Example**:
```typescript
import { describe, it, expect } from 'vitest'
import { formatPrice } from '@/lib/utils'

describe('formatPrice', () => {
  it('should format price in USD', () => {
    expect(formatPrice(599.99)).toBe('$599.99')
  })
})
```

### 2. Component Tests (React Testing Library)

**Purpose**: Test React components with user interactions

**Location**: `/tests/components/`

**Run Command**: `npm run test`

**What to Test**:
- Component rendering
- User interactions (click, input, submit)
- Conditional rendering
- Props and state changes
- Accessibility

**Example**:
```typescript
import { renderWithProviders, screen, userEvent } from '@/tests/utils/test-helpers'
import { QuoteButton } from '@/components/QuoteButton'

test('should navigate to quote page on click', async () => {
  renderWithProviders(<QuoteButton />)
  const button = screen.getByRole('button', { name: /get a quote/i })

  await userEvent.click(button)

  expect(mockRouter.push).toHaveBeenCalledWith('/quote')
})
```

### 3. Integration Tests

**Purpose**: Test interactions between multiple modules

**Location**: `/tests/integration/`

**Run Command**: `npm run test`

**What to Test**:
- API route handlers
- Database operations
- Email sending
- File uploads
- Third-party service integrations

**Example**:
```typescript
import { POST } from '@/app/api/quotes/route'
import { mockQuoteFormData } from '@/tests/utils/mock-data'

test('POST /api/quotes should create new quote', async () => {
  const request = new Request('http://localhost/api/quotes', {
    method: 'POST',
    body: JSON.stringify(mockQuoteFormData()),
  })

  const response = await POST(request)
  const data = await response.json()

  expect(response.status).toBe(201)
  expect(data.id).toBeDefined()
  expect(data.status).toBe('pending')
})
```

### 4. E2E Tests (Playwright)

**Purpose**: Test complete user journeys across the application

**Location**: `/tests/e2e/`

**Run Command**: `npx playwright test`

**What to Test**:
- Critical user paths (quote submission, product browsing)
- Multi-page flows
- Form submissions
- Navigation
- Error scenarios

**Example**:
```typescript
import { test, expect } from '@playwright/test'

test('should complete quote request journey', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Get a Quote')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.click('button[type="submit"]')
  await expect(page.locator('text=/success/i')).toBeVisible()
})
```

### 5. Accessibility Tests (Playwright + Axe)

**Purpose**: Ensure WCAG 2.1 Level AAA compliance

**Location**: `/tests/accessibility/`

**Run Command**: `npx playwright test tests/accessibility/`

**What to Test**:
- Automated accessibility violations
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- ARIA attributes
- Focus management

### 6. Visual Regression Tests (Playwright)

**Purpose**: Catch unintended visual changes

**Location**: `/tests/visual/`

**Run Command**: `npx playwright test tests/visual/`

**What to Test**:
- Component snapshots in all states
- Responsive breakpoints
- Dark mode variants
- Loading and error states

### 7. Performance Tests (Lighthouse CI)

**Purpose**: Monitor Core Web Vitals and page performance

**Run Command**: `npm run test:performance`

**Metrics Monitored**:
- Performance Score: >90
- Accessibility Score: 100
- Best Practices Score: >90
- SEO Score: 100
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1

## Running Tests

### Quick Start

```bash
# Run all unit/integration tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui

# Run specific test file
npm test -- formatting.test.ts

# Run tests matching pattern
npm test -- --grep "formatPrice"
```

### CI/CD Pipeline

Tests automatically run on:
- **Pull Requests**: Unit, integration, E2E critical paths, accessibility
- **Push to main**: Full E2E suite across all browsers
- **Nightly**: Performance benchmarks, security scans, load tests

## Coverage Goals

| Category | Target | Critical Paths |
|----------|--------|----------------|
| Overall | >80% | 100% |
| Utilities | >90% | N/A |
| Components | >75% | N/A |
| API Routes | >85% | 100% |
| Hooks | >85% | N/A |

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html
```

## Writing Good Tests

### Best Practices

#### 1. Arrange-Act-Assert Pattern

```typescript
test('should add item to cart', () => {
  // Arrange
  const cart = createCart()
  const product = mockProduct()

  // Act
  cart.addItem(product)

  // Assert
  expect(cart.items).toHaveLength(1)
  expect(cart.items[0]).toEqual(product)
})
```

#### 2. Descriptive Test Names

```typescript
// ❌ Bad
test('works', () => { ... })

// ✅ Good
test('should validate email format and show error for invalid input', () => { ... })
```

#### 3. Test One Thing

```typescript
// ❌ Bad - Testing multiple behaviors
test('quote form', () => {
  // Tests validation
  // Tests submission
  // Tests error handling
  // Tests success message
})

// ✅ Good - Focused tests
test('should show validation errors for empty required fields', () => { ... })
test('should submit quote successfully with valid data', () => { ... })
test('should handle API errors gracefully', () => { ... })
```

#### 4. Use Semantic Queries

```typescript
// ❌ Bad
screen.getByTestId('submit-button')
screen.getByClassName('error-message')

// ✅ Good
screen.getByRole('button', { name: /submit/i })
screen.getByText(/error: invalid email/i)
```

#### 5. Avoid Implementation Details

```typescript
// ❌ Bad - Testing state
expect(component.state.isLoading).toBe(true)

// ✅ Good - Testing user-visible behavior
expect(screen.getByText(/loading/i)).toBeVisible()
```

### Common Patterns

#### Testing Async Operations

```typescript
test('should load products', async () => {
  renderWithProviders(<ProductList />)

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  // Assert products are displayed
  expect(screen.getByText('Modern Sliding Door')).toBeVisible()
})
```

#### Testing Form Submissions

```typescript
test('should submit form with valid data', async () => {
  const user = userEvent.setup()
  renderWithProviders(<QuoteForm />)

  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.type(screen.getByLabelText(/name/i), 'John Doe')
  await user.click(screen.getByRole('button', { name: /submit/i }))

  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeVisible()
  })
})
```

#### Testing Error States

```typescript
test('should display error message on API failure', async () => {
  server.use(
    http.post('/api/quotes', () => {
      return HttpResponse.json(
        { error: 'Server error' },
        { status: 500 }
      )
    })
  )

  renderWithProviders(<QuoteForm />)
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeVisible()
  })
})
```

## Debugging Tests

### Common Issues

#### 1. Test Timeout

```typescript
// Increase timeout for slow operations
test('slow operation', async () => {
  // ...
}, { timeout: 10000 }) // 10 seconds
```

#### 2. Element Not Found

```bash
# Use Playwright debug mode
PWDEBUG=1 npx playwright test

# Use testing-library debug
import { screen } from '@testing-library/react'
screen.debug() // Prints current DOM
```

#### 3. Flaky Tests

```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeVisible()
}, { timeout: 3000 })

// Avoid arbitrary delays
// ❌ await new Promise(resolve => setTimeout(resolve, 1000))
// ✅ await waitFor(() => expect(...).toBeVisible())
```

## Test Utilities

### Available Helpers

- `renderWithProviders()` - Render with all providers
- `mockFetch()` - Mock fetch requests
- `mockLocalStorage()` - Mock localStorage
- `createMockRouter()` - Mock Next.js router
- `waitForElementToBeRemoved()` - Wait for element removal
- `mockProduct()` - Generate mock product data
- `mockUser()` - Generate mock user data
- `mockQuote()` - Generate mock quote data

See `/tests/utils/test-helpers.tsx` and `/tests/utils/mock-data.ts` for full documentation.

## Performance Optimization

### Making Tests Faster

1. **Run Tests in Parallel**: Enabled by default in Vitest
2. **Use `happy-dom`**: Faster than `jsdom` for most tests
3. **Mock Heavy Dependencies**: Mock large libraries and API calls
4. **Split Test Files**: Keep test files focused and small
5. **Skip Expensive Tests**: Use `.skip()` for slow tests during development

## Contributing

### Adding New Tests

1. Create test file next to the code being tested (component tests)
2. Or place in appropriate directory under `/tests/`
3. Follow naming convention: `*.test.ts` or `*.spec.ts`
4. Add descriptive test names
5. Ensure tests are isolated and don't depend on each other
6. Run tests locally before committing
7. Verify coverage doesn't decrease

### Updating Tests

- Update tests when changing behavior, not implementation
- Refactor tests to stay aligned with code changes
- Keep tests simple and maintainable
- Remove obsolete tests

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Support

For questions or issues:
1. Check existing tests for examples
2. Review this documentation
3. Ask in team chat
4. Create an issue in the repository
