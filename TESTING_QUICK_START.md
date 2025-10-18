# Testing Quick Start Guide

Get up and running with the PG Closets testing infrastructure in 5 minutes.

## Install & Setup

```bash
# Install dependencies (if not already done)
npm install

# Install Playwright browsers
npx playwright install chromium
```

## Run Tests

### Unit Tests (Fast - 10 seconds)
```bash
# Run once
npm test

# Watch mode (recommended for development)
npm run test:watch

# With coverage
npm run test:coverage
```

### E2E Tests (Medium - 2 minutes for critical paths)
```bash
# Critical paths only (fast)
npx playwright test tests/e2e/critical-paths.spec.ts

# All E2E tests
npx playwright test

# With UI (interactive)
npx playwright test --ui

# Specific test
npx playwright test -g "quote request journey"
```

### Accessibility Tests (Medium - 5 minutes)
```bash
# All accessibility tests
npx playwright test tests/accessibility/

# Specific page
npx playwright test tests/accessibility/a11y.spec.ts -g "Homepage"
```

## During Development

### Best Workflow
1. Open terminal: `npm run test:watch`
2. Edit code - tests auto-run
3. See instant feedback
4. Fix issues immediately

### Before Committing
```bash
# Run quality checks
npm run validate:all

# Or individually
npm run lint
npm run type-check
npm test
```

### Before Creating PR
```bash
# Run critical E2E tests
npx playwright test tests/e2e/critical-paths.spec.ts

# Check coverage
npm run test:coverage
```

## Writing Tests

### Unit Test Example
```typescript
// tests/unit/utils/my-feature.test.ts
import { describe, it, expect } from 'vitest'

describe('myFunction', () => {
  it('should return correct result', () => {
    const result = myFunction('input')
    expect(result).toBe('expected output')
  })
})
```

### Component Test Example
```typescript
// tests/components/MyComponent.test.tsx
import { renderWithProviders, screen, userEvent } from '@/tests/utils/test-helpers'
import { MyComponent } from '@/components/MyComponent'

test('should handle user click', async () => {
  renderWithProviders(<MyComponent />)

  const button = screen.getByRole('button', { name: /click me/i })
  await userEvent.click(button)

  expect(screen.getByText('Clicked!')).toBeVisible()
})
```

### E2E Test Example
```typescript
// tests/e2e/my-flow.spec.ts
import { test, expect } from '@playwright/test'

test('should complete user flow', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Get Started')
  await expect(page).toHaveURL(/.*started/)
})
```

## Common Commands

```bash
# Run specific test file
npm test -- my-feature.test.ts

# Run tests matching pattern
npm test -- --grep "formatPrice"

# Debug failing test
npx playwright test --debug

# View test report
npx playwright show-report

# Open coverage report
open coverage/index.html
```

## Debugging

### Test Failing?
1. Check error message - usually very helpful
2. Add `screen.debug()` to see rendered HTML
3. Use `--ui` mode for E2E tests
4. Check CI logs if only failing there

### Test Flaking?
1. Add proper `waitFor` instead of delays
2. Use `await expect().toBeVisible()` with timeout
3. Check for race conditions
4. Run test multiple times: `--repeat-each=10`

## CI/CD

Tests run automatically on:
- **Every PR**: Unit, integration, E2E critical paths
- **Push to main**: Full test suite
- **Nightly**: Performance and security scans

## Coverage Goals

- Overall: >80%
- Critical paths: 100%
- Check with: `npm run test:coverage`

## Need Help?

1. **Documentation**: `/docs/testing/TESTING_GUIDE.md`
2. **Quick Reference**: `/docs/testing/RUNNING_TESTS.md`
3. **Examples**: Look at existing tests in `/tests/`
4. **Ask Team**: We're here to help!

## Resources

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**That's it!** You're ready to test. Start with `npm run test:watch` and happy testing! 🎉
