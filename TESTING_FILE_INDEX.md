# Testing Infrastructure File Index

Complete reference of all testing files and their purposes.

## Documentation 📚

### Main Guides
- **`/TESTING_QUICK_START.md`** - Get started in 5 minutes
- **`/AGENT_21_TESTING_INFRASTRUCTURE_SUMMARY.md`** - Complete deliverables summary
- **`/docs/testing/TESTING_GUIDE.md`** - Comprehensive testing guide (11KB)
- **`/docs/testing/RUNNING_TESTS.md`** - Commands and workflow reference (7KB)
- **`/docs/testing/COVERAGE_REPORT.md`** - Coverage tracking and goals (7KB)

## Configuration ⚙️

### Test Framework Configuration
- **`/vitest.config.ts`** - Vitest configuration
  - Happy-DOM environment
  - Coverage settings (80% thresholds)
  - Path aliases
  - Test discovery patterns

- **`/playwright.config.ts`** - Playwright configuration
  - Cross-browser projects (Chromium, Firefox, WebKit)
  - Smoke test project
  - Visual test project
  - Dev server auto-start
  - Reporting configuration

- **`/lighthouserc.json`** - Lighthouse CI configuration
  - Performance budgets
  - Core Web Vitals thresholds
  - Test URLs
  - Assertion rules

### CI/CD Configuration
- **`/.github/workflows/test.yml`** - GitHub Actions pipeline
  - Unit test job
  - E2E critical paths job
  - E2E full suite job (cross-browser)
  - Accessibility test job
  - Lighthouse CI job
  - Visual regression job
  - Security audit job
  - Test summary job

## Test Setup 🛠️

### Global Setup
- **`/tests/setup/vitest.setup.ts`** - Global test setup
  - Jest-DOM matchers
  - MSW server initialization
  - Next.js mocks (router, Image, navigation)
  - Browser API mocks
  - LocalStorage/SessionStorage mocks
  - Custom matchers (email, phone, postal code validation)

### Mock Server
- **`/tests/mocks/msw-server.ts`** - Mock Service Worker server
  - API endpoint handlers (products, quotes, contact, email)
  - Error simulation handlers (500, 404, 401)
  - Helper functions for test overrides

## Test Utilities 🧰

### Helper Functions
- **`/tests/utils/test-helpers.tsx`** - Test utility functions
  - `renderWithProviders()` - Render with context
  - `createMockRouter()` - Mock Next.js router
  - `createMockRequest/Response()` - Mock API handlers
  - `mockLocalStorage()` - LocalStorage operations
  - `mockFetch()` - Fetch mocking
  - `createMockFile()` - File upload mocking
  - `simulateDelay()` - Async operation delays
  - `assertNoConsoleErrors()` - Console error tracking

### Mock Data
- **`/tests/utils/mock-data.ts`** - Mock data generators
  - Product fixtures (`mockProduct`, `mockProducts`)
  - User fixtures (`mockUser`)
  - Quote fixtures (`mockQuote`, `mockQuotes`)
  - Order fixtures (`mockOrder`)
  - Review fixtures (`mockReview`, `mockReviews`)
  - Cart fixtures (`mockCartItem`, `mockCart`)
  - Form data (`mockContactFormData`, `mockQuoteFormData`)
  - API responses (`mockApiSuccess`, `mockApiError`)
  - Search results (`mockSearchResults`)
  - Error fixtures (`mockValidationError`, `mockNetworkError`)

## Unit Tests 🧪

### Utility Tests
- **`/tests/unit/utils/formatting.test.ts`** - Formatting utilities (20+ tests)
  - `formatPrice()` - Currency formatting
  - `formatDate()` - Date formatting
  - `slugify()` - URL slug generation
  - `truncate()` - Text truncation
  - `capitalize()` - Text capitalization
  - `formatPhone()` - Phone number formatting

- **`/tests/unit/utils/validation.test.ts`** - Validation utilities (25+ tests)
  - `isValidEmail()` - Email validation
  - `isValidPhone()` - Phone number validation
  - `isValidPostalCode()` - Postal code validation (US/Canada)
  - `isValidUrl()` - URL validation
  - `isValidPrice()` - Price validation
  - `isValidQuantity()` - Quantity validation
  - `isValidSlug()` - URL slug validation
  - `isStrongPassword()` - Password strength validation

### Component Tests
- **`/tests/components/`** - Component tests (to be expanded)
  - Ready for UI component tests
  - Follow patterns in test-helpers.tsx

## Integration Tests 🔗

- **`/tests/integration/`** - API and service integration tests
  - MSW server provides API mocking
  - Ready for database operation tests
  - Ready for third-party service tests

## E2E Tests 🌐

### Critical Paths
- **`/tests/e2e/critical-paths.spec.ts`** - Critical user journeys (20+ tests)
  - Quote request flow (5 tests)
    - Complete journey
    - Validation errors
    - Email format validation
  - Product browsing (3 tests)
    - Navigation
    - Search
    - Filtering
  - Contact form (1 test)
    - Submission flow
  - Navigation (2 tests)
    - Main menu
    - Footer links
  - Mobile experience (2 tests)
    - Quote flow
    - Menu interaction
  - Performance (1 test)
    - Page load timing
  - Error handling (2 tests)
    - 404 pages
    - Network errors
  - SEO & Meta (1 test)
    - Title and description tags

### Smoke Tests
- **`/tests/smoke/basic.smoke.spec.ts`** - Basic functionality verification
  - Critical page loads
  - Navigation functionality
  - Core features

## Accessibility Tests ♿

- **`/tests/accessibility/a11y.spec.ts`** - WCAG 2.1 AAA compliance (30+ tests)
  - Homepage accessibility
  - Keyboard navigation
  - Color contrast (AAA)
  - Form accessibility
  - Image alt text
  - ARIA and semantic HTML
  - Touch targets (44x44px)
  - Motion preferences
  - Zoom support (200%)
  - Screen reader support

## Visual Regression Tests 👁️

- **`/tests/visual/regression.visual.spec.ts`** - Visual comparison tests
  - Component snapshots
  - Responsive breakpoints
  - State variations
  - Ready for expansion

## Test Scripts 📜

From `package.json`:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:types": "tsd"
}
```

Plus Playwright scripts:
```bash
npx playwright test                    # Run all E2E
npx playwright test --ui               # UI mode
npx playwright test --debug            # Debug mode
npx playwright show-report             # View HTML report
```

## File Structure Summary

```
pgclosets-store-main/
├── .github/
│   └── workflows/
│       └── test.yml                   # CI/CD pipeline
├── docs/
│   └── testing/
│       ├── TESTING_GUIDE.md           # Main guide
│       ├── RUNNING_TESTS.md           # Quick reference
│       └── COVERAGE_REPORT.md         # Coverage tracking
├── tests/
│   ├── accessibility/
│   │   └── a11y.spec.ts              # 30+ accessibility tests
│   ├── e2e/
│   │   └── critical-paths.spec.ts    # 20+ E2E tests
│   ├── integration/
│   │   └── (ready for expansion)
│   ├── mocks/
│   │   └── msw-server.ts             # MSW configuration
│   ├── setup/
│   │   └── vitest.setup.ts           # Global setup
│   ├── smoke/
│   │   └── basic.smoke.spec.ts       # Smoke tests
│   ├── unit/
│   │   └── utils/
│   │       ├── formatting.test.ts     # 20+ tests
│   │       └── validation.test.ts     # 25+ tests
│   ├── utils/
│   │   ├── test-helpers.tsx          # Test utilities
│   │   └── mock-data.ts              # Mock generators
│   └── visual/
│       └── regression.visual.spec.ts # Visual tests
├── vitest.config.ts                  # Vitest config
├── playwright.config.ts              # Playwright config
├── lighthouserc.json                 # Lighthouse config
├── TESTING_QUICK_START.md            # Quick start guide
├── TESTING_FILE_INDEX.md             # This file
└── AGENT_21_TESTING_INFRASTRUCTURE_SUMMARY.md  # Summary

```

## Statistics 📊

### Files Created
- **Configuration**: 3 files
- **Documentation**: 5 files
- **Test Setup**: 2 files
- **Test Utilities**: 2 files
- **Unit Tests**: 2 files
- **E2E Tests**: 1 file (20+ scenarios)
- **CI/CD**: 1 workflow file
- **Total**: 16 new files

### Test Coverage
- **Unit Tests**: 45+ tests (formatting + validation)
- **E2E Tests**: 20+ scenarios (critical paths)
- **Accessibility Tests**: 30+ tests (WCAG AAA)
- **Total Tests**: 95+ tests

### Documentation
- **Total Lines**: 2,000+ lines of documentation
- **Guides**: 3 comprehensive guides
- **Examples**: 50+ code examples
- **Best Practices**: 20+ patterns documented

## Quick Navigation 🗺️

### Want to...
- **Get Started**: Read `/TESTING_QUICK_START.md`
- **Learn Testing**: Read `/docs/testing/TESTING_GUIDE.md`
- **Run Tests**: Check `/docs/testing/RUNNING_TESTS.md`
- **Check Coverage**: See `/docs/testing/COVERAGE_REPORT.md`
- **Write Tests**: Use `/tests/utils/test-helpers.tsx`
- **Create Mock Data**: Use `/tests/utils/mock-data.ts`
- **Debug E2E**: Use `npx playwright test --debug`
- **View Coverage**: Run `npm run test:coverage && open coverage/index.html`

### Need Help with...
- **Unit Tests**: Check `/tests/unit/utils/*.test.ts` for examples
- **E2E Tests**: Check `/tests/e2e/critical-paths.spec.ts` for patterns
- **Accessibility**: Check `/tests/accessibility/a11y.spec.ts` for WCAG tests
- **Mocking**: Check `/tests/mocks/msw-server.ts` for API mocks
- **CI/CD**: Check `/.github/workflows/test.yml` for pipeline

## Update History 📝

- **2025-01-15**: Initial testing infrastructure created by Agent #21
- **Future**: Keep this index updated as tests are added

## Maintenance Notes 🔧

When adding new tests:
1. Follow existing patterns in `/tests/`
2. Use utilities from `/tests/utils/`
3. Add mock data to `/tests/utils/mock-data.ts`
4. Update this index
5. Update documentation if patterns change

## Related Files 🔗

### Not Listed Above (Already Existed)
- `/tests/setup.ts` - Simple setup file (36 bytes)
- `/tests/setup.tsx` - Legacy setup file (3.6KB)
- Various node_modules test files (excluded)

### Configuration Files Referenced
- `package.json` - npm scripts
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - Linting rules

---

**Last Updated**: January 15, 2025 by Agent #21
**Maintained By**: PG Closets Development Team
**Version**: 1.0.0
