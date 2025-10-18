# PG Closets Test Suite

Comprehensive testing infrastructure for the PG Closets e-commerce platform.

## Quick Start

```bash
# Run unit tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run E2E tests
npx playwright test

# Run accessibility tests
npx playwright test tests/accessibility/
```

## Directory Structure

```
tests/
├── accessibility/     # Accessibility & WCAG compliance tests
├── e2e/              # End-to-end user journey tests
├── integration/      # API & service integration tests
├── mocks/            # MSW mock server configuration
├── setup/            # Global test setup and configuration
├── smoke/            # Critical functionality smoke tests
├── unit/             # Unit tests for utilities & components
├── utils/            # Test helpers and mock data generators
└── visual/           # Visual regression tests
```

## Test Categories

### Unit Tests (`/unit/`)
Fast tests for individual functions and utilities.

**What's Tested**:
- Formatting utilities (price, date, slugify, truncate)
- Validation functions (email, phone, postal code, URL)
- Business logic
- Pure functions

**Run Command**: `npm test`
**Speed**: <10 seconds

### Component Tests
Tests for React components with user interactions.

**What's Tested**:
- Component rendering
- User interactions (click, type, submit)
- Conditional rendering
- Props and state

**Run Command**: `npm test`
**Speed**: <20 seconds

### Integration Tests (`/integration/`)
Tests for API routes and service integrations.

**What's Tested**:
- API endpoint handlers
- Database operations
- Third-party services (email, payments)
- File uploads

**Run Command**: `npm test`
**Speed**: <30 seconds

### E2E Tests (`/e2e/`)
Full user journey tests across the application.

**What's Tested**:
- Quote request flow
- Product browsing
- Contact form submission
- Navigation
- Mobile experience

**Run Command**: `npx playwright test`
**Speed**: 2-10 minutes

### Accessibility Tests (`/accessibility/`)
WCAG 2.1 Level AAA compliance tests.

**What's Tested**:
- Automated accessibility violations
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- ARIA attributes

**Run Command**: `npx playwright test tests/accessibility/`
**Speed**: ~5 minutes

### Visual Regression Tests (`/visual/`)
Screenshot comparison tests for UI consistency.

**What's Tested**:
- Component visual states
- Responsive breakpoints
- Dark mode (if applicable)
- Loading and error states

**Run Command**: `npx playwright test tests/visual/`
**Speed**: ~5 minutes

### Smoke Tests (`/smoke/`)
Critical functionality verification.

**What's Tested**:
- Homepage loads
- Core navigation works
- Essential features functional

**Run Command**: `npx playwright test tests/smoke/`
**Speed**: <2 minutes

## Test Utilities

### Test Helpers (`/utils/test-helpers.tsx`)
Reusable testing utilities:

```typescript
import { renderWithProviders, screen, userEvent } from '@/tests/utils/test-helpers'

// Render component with providers
renderWithProviders(<MyComponent />)

// Simulate user interactions
await userEvent.click(screen.getByRole('button'))

// Create mocks
const mockRouter = createMockRouter()
const mockStorage = mockLocalStorage()
```

### Mock Data (`/utils/mock-data.ts`)
Realistic test data generators:

```typescript
import { mockProduct, mockQuote, mockUser } from '@/tests/utils/mock-data'

// Generate single fixture
const product = mockProduct()

// Generate multiple fixtures
const products = mockProducts(10)

// Override specific fields
const premiumProduct = mockProduct({ price: 999.99 })
```

### MSW Server (`/mocks/msw-server.ts`)
API request mocking:

```typescript
import { server, createErrorHandler } from '@/tests/mocks/msw-server'

// Server starts automatically in tests

// Override for specific test
server.use(
  createErrorHandler('/api/quotes', 500, 'Server error')
)

// Reset between tests (automatic)
```

## Writing Tests

### Unit Test Example

```typescript
// tests/unit/utils/my-util.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/utils'

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction('input')).toBe('output')
  })

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('')
    expect(myFunction(null)).toThrow()
  })
})
```

### Component Test Example

```typescript
// tests/components/Button.test.tsx
import { renderWithProviders, screen, userEvent } from '@/tests/utils/test-helpers'
import { Button } from '@/components/Button'

test('should call onClick when clicked', async () => {
  const handleClick = vi.fn()
  renderWithProviders(<Button onClick={handleClick}>Click Me</Button>)

  await userEvent.click(screen.getByRole('button'))

  expect(handleClick).toHaveBeenCalledOnce()
})
```

### E2E Test Example

```typescript
// tests/e2e/user-flow.spec.ts
import { test, expect } from '@playwright/test'

test('should complete checkout flow', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Shop Now')
  await page.click('text=Add to Cart')
  await page.click('text=Checkout')

  await expect(page).toHaveURL(/.*checkout/)
})
```

## Test Patterns

### Testing Async Operations

```typescript
test('should load data', async () => {
  renderWithProviders(<DataComponent />)

  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  // Assert data is displayed
  expect(screen.getByText('Data loaded')).toBeVisible()
})
```

### Testing Form Submissions

```typescript
test('should submit form', async () => {
  renderWithProviders(<ContactForm />)

  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  await expect(screen.getByText(/success/i)).toBeVisible()
})
```

### Testing Error States

```typescript
test('should display error', async () => {
  server.use(
    http.post('/api/data', () => {
      return HttpResponse.json({ error: 'Failed' }, { status: 500 })
    })
  )

  renderWithProviders(<DataComponent />)

  await expect(screen.findByText(/error/i)).resolves.toBeVisible()
})
```

## Coverage Goals

| Category | Target | Critical Paths |
|----------|--------|----------------|
| Overall | >80% | 100% |
| Utilities | >90% | N/A |
| Components | >75% | N/A |
| API Routes | >85% | 100% |
| Hooks | >85% | N/A |

**View Coverage**: `npm run test:coverage && open coverage/index.html`

## CI/CD Integration

Tests run automatically on:
- Every pull request (unit, integration, E2E critical paths)
- Push to main (full test suite)
- Nightly (performance and security)

See `.github/workflows/test.yml` for full pipeline.

## Debugging Tests

### Unit Tests
```bash
# Run specific test
npm test -- my-test.test.ts

# Debug mode
npm test -- --reporter=verbose

# See rendered HTML
screen.debug()  # Add in test
```

### E2E Tests
```bash
# Run with browser visible
npx playwright test --headed

# Debug mode (step through)
npx playwright test --debug

# UI mode
npx playwright test --ui

# View test report
npx playwright show-report
```

## Best Practices

### Do's ✅
- Test behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Test user-facing features
- Test error scenarios
- Keep tests isolated
- Use descriptive test names

### Don'ts ❌
- Don't test implementation details
- Don't use arbitrary delays
- Don't skip failing tests
- Don't test trivial code
- Don't make tests depend on each other

## Resources

### Documentation
- `/docs/testing/TESTING_GUIDE.md` - Comprehensive guide
- `/docs/testing/RUNNING_TESTS.md` - Command reference
- `/docs/testing/COVERAGE_REPORT.md` - Coverage tracking
- `/TESTING_QUICK_START.md` - Get started quickly
- `/TESTING_FILE_INDEX.md` - Complete file reference

### External Resources
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Need Help?

1. Check documentation in `/docs/testing/`
2. Look at existing tests for examples
3. Review test utilities in `/tests/utils/`
4. Ask in team chat
5. Create an issue

## Maintenance

### Weekly
- Review test failures
- Update flaky tests
- Add tests for new features

### Monthly
- Review coverage reports
- Update dependencies
- Refactor obsolete tests

### Quarterly
- Audit test effectiveness
- Update testing strategy
- Team training sessions

---

**Test Suite Status**: ✅ Production Ready
**Total Tests**: 95+ (and growing)
**Coverage**: Target >80%
**Maintained By**: PG Closets Development Team
