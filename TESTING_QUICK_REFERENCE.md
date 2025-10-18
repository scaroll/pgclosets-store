# Testing Quick Reference Guide

## 🚀 Common Commands

### Unit Tests
```bash
npm test                    # Run all unit tests
npm run test:watch          # Watch mode for development
npm run test:coverage       # Generate coverage report
npm test -- button          # Run specific test file
```

### E2E Tests
```bash
npx playwright test                        # Run all E2E tests
npx playwright test --headed               # Run with browser visible
npx playwright test --debug                # Debug mode
npx playwright test --ui                   # Interactive UI mode
npx playwright test --project=chromium     # Run specific browser
npx playwright test quote-flow.spec.ts     # Run specific test file
```

### Accessibility Tests
```bash
npx playwright test tests/accessibility/              # All a11y tests
npx playwright test tests/accessibility/automated-a11y.spec.ts    # Automated scanning
npx playwright test tests/accessibility/keyboard-navigation.spec.ts  # Keyboard tests
```

### Performance Tests
```bash
npx playwright test tests/performance/     # Performance tests
lhci autorun                               # Run Lighthouse CI
lighthouse http://localhost:3000 --view    # Single page Lighthouse
```

---

## 📊 Coverage & Reports

### View Coverage Report
```bash
npm run test:coverage
open coverage/index.html
```

### View Playwright Report
```bash
npx playwright show-report
```

### Generate All Reports
```bash
npm run test:coverage && npx playwright test && npx playwright show-report
```

---

## 🐛 Debugging

### Debug Unit Test
```bash
npm test -- --reporter=verbose luxury-button
```

### Debug E2E Test
```bash
npx playwright test --debug quote-flow.spec.ts
```

### Debug Specific Test
```bash
npx playwright test --debug --grep "should complete quote"
```

---

## ✅ Pre-Commit Checklist

```bash
# 1. Run linter
npm run lint:fix

# 2. Run type check
npm run type-check

# 3. Run unit tests
npm test

# 4. Run critical E2E tests
npx playwright test --project=chromium tests/e2e/critical-paths.spec.ts

# 5. Check coverage (if needed)
npm run test:coverage
```

---

## 🎯 Test Patterns

### Unit Test Pattern
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ComponentName', () => {
  it('should do something', async () => {
    const user = userEvent.setup();
    render(<Component />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

### E2E Test Pattern
```typescript
import { test, expect } from '@playwright/test';

test('should complete user flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=/Get Quote/i');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=/success/i')).toBeVisible();
});
```

---

## 🔍 Finding Tests

### By Feature
- Quote flow: `tests/e2e/quote-flow.spec.ts`
- Product browsing: `tests/e2e/product-browsing.spec.ts`
- Navigation: `tests/e2e/navigation.spec.ts`
- Accessibility: `tests/accessibility/`
- Performance: `tests/performance/`

### By Component
- Button: `tests/unit/components/luxury-button.test.tsx`
- Form: `tests/unit/components/luxury-quote-form.test.tsx`
- Utils: `tests/unit/utils/`

---

## 🎨 Test Selectors

### Recommended Selectors (in order of preference)
1. `getByRole('button', { name: /submit/i })`
2. `getByLabelText(/email/i)`
3. `getByPlaceholderText(/search/i)`
4. `getByText(/welcome/i)`
5. `getByTestId('product-card')`

### Avoid
- ❌ `querySelector('.class-name')`
- ❌ `getByClassName`
- ❌ CSS selectors (unless necessary)

---

## 📈 Coverage Thresholds

| Category | Minimum | Target |
|----------|---------|--------|
| Statements | 80% | 90% |
| Branches | 80% | 85% |
| Functions | 80% | 85% |
| Lines | 80% | 90% |

---

## 🏷️ Test Tags

### Run tests by tag
```bash
# Run only smoke tests
npx playwright test --project=smoke-tests

# Run only accessibility tests
npx playwright test --project=accessibility-tests

# Run only visual tests
npx playwright test --project=visual-tests
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vitest.config.ts` | Unit test configuration |
| `playwright.config.ts` | E2E test configuration |
| `.lighthouserc.json` | Performance budgets |
| `tests/setup.ts` | Global test setup |

---

## 📝 Writing New Tests

### 1. Create test file
```bash
# Unit test
touch tests/unit/components/my-component.test.tsx

# E2E test
touch tests/e2e/my-feature.spec.ts
```

### 2. Write test
See test patterns above

### 3. Run test
```bash
npm test -- my-component
npx playwright test my-feature.spec.ts
```

### 4. Verify coverage
```bash
npm run test:coverage
```

---

## 🚨 Common Issues & Fixes

### Issue: Tests timeout
```bash
# Increase timeout in test
test('long test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});
```

### Issue: Element not found
```bash
# Add explicit wait
await page.waitForSelector('text=/Submit/i', { timeout: 10000 });
```

### Issue: Flaky test
```bash
# Use waitFor
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

### Issue: Coverage too low
```bash
# View uncovered files
npm run test:coverage
open coverage/index.html
```

---

## 🎯 Best Practices

### ✅ Do
- Test user behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Test error states and edge cases
- Keep tests isolated and independent
- Use descriptive test names

### ❌ Don't
- Test implementation details
- Use arbitrary waits (setTimeout)
- Skip failing tests
- Make tests depend on each other
- Use overly specific selectors

---

## 📞 Getting Help

1. Check `/tests/README.md` for comprehensive guide
2. Review `/TESTING_INFRASTRUCTURE_COMPLETE.md` for full documentation
3. Look at existing tests for examples
4. Check Playwright/Vitest documentation
5. Ask the team

---

## 🔗 Useful Links

- [Tests README](/tests/README.md)
- [Playwright Docs](https://playwright.dev/)
- [Vitest Docs](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [axe-core Docs](https://github.com/dequelabs/axe-core)
- [Lighthouse Docs](https://github.com/GoogleChrome/lighthouse)

---

**Last Updated:** October 14, 2025
**Maintained By:** PG Closets Development Team
