# Running Tests - Quick Reference

## Quick Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- formatting.test.ts

# Run tests matching a pattern
npm test -- --grep "formatPrice"

# Run E2E tests (all browsers)
npx playwright test

# Run E2E tests (specific browser)
npx playwright test --project=chromium

# Run E2E tests in UI mode
npx playwright test --ui

# Run E2E tests in debug mode
npx playwright test --debug

# Run accessibility tests only
npx playwright test tests/accessibility/

# Run Lighthouse performance tests
npm run test:performance

# Run all quality checks (lint, type-check, test)
npm run validate:all
```

## Test Types

### Unit Tests
- **Command**: `npm test`
- **Speed**: Fast (~10 seconds)
- **Use for**: Quick validation during development
- **Coverage**: Utilities, hooks, component logic

### Integration Tests
- **Command**: `npm test` (included with unit tests)
- **Speed**: Medium (~30 seconds)
- **Use for**: Testing API routes and services
- **Coverage**: API handlers, database operations

### E2E Tests (Critical Paths Only)
- **Command**: `npx playwright test tests/e2e/critical-paths.spec.ts`
- **Speed**: Fast (~2 minutes)
- **Use for**: Pre-commit verification
- **Coverage**: Quote submission, product browsing, contact form

### E2E Tests (Full Suite)
- **Command**: `npx playwright test`
- **Speed**: Slow (~10 minutes)
- **Use for**: Pre-deployment verification
- **Coverage**: All user journeys, cross-browser

### Accessibility Tests
- **Command**: `npx playwright test tests/accessibility/`
- **Speed**: Medium (~5 minutes)
- **Use for**: WCAG compliance verification
- **Coverage**: All pages and components

### Visual Regression Tests
- **Command**: `npx playwright test tests/visual/`
- **Speed**: Medium (~5 minutes)
- **Use for**: Catching unintended visual changes
- **Coverage**: Component snapshots, responsive breakpoints

## Development Workflow

### Before Starting Work
```bash
# Verify everything works
npm test && npx playwright test tests/e2e/critical-paths.spec.ts
```

### During Development
```bash
# Run tests in watch mode
npm run test:watch

# In another terminal, work on your code
# Tests will automatically re-run as you save files
```

### Before Committing
```bash
# Run full quality checks
npm run validate:all

# Or run individual checks
npm run lint
npm run type-check
npm test
```

### Before Creating PR
```bash
# Run E2E critical paths
npx playwright test tests/e2e/critical-paths.spec.ts

# Run accessibility tests
npx playwright test tests/accessibility/

# Check coverage
npm run test:coverage
```

## CI/CD Pipeline

### On Pull Request
- ✓ Linting
- ✓ Type checking
- ✓ Unit tests
- ✓ Integration tests
- ✓ E2E critical paths (Chromium only)
- ✓ Accessibility tests
- ✓ Coverage check (must be >80%)

### On Push to Main/Staging
- ✓ All PR checks
- ✓ E2E full suite (Chrome, Firefox, Safari)
- ✓ Visual regression tests
- ✓ Lighthouse performance tests

### Nightly
- ✓ All tests
- ✓ Load testing
- ✓ Security scanning
- ✓ Dependency auditing

## Debugging Failed Tests

### Unit Tests Failing

```bash
# Run in debug mode
npm test -- --reporter=verbose

# Run specific test with debugging
npm test -- formatting.test.ts --reporter=verbose

# Check what's being rendered
# Add to your test:
import { screen } from '@testing-library/react'
screen.debug() // Prints current DOM
```

### E2E Tests Failing

```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode (step through)
npx playwright test --debug

# Run specific test
npx playwright test -g "quote request journey"

# Generate trace for failed tests
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Accessibility Tests Failing

```bash
# Run with verbose output
npx playwright test tests/accessibility/ --reporter=list

# Check specific page
npx playwright test tests/accessibility/a11y.spec.ts -g "Homepage"

# Review violations in HTML report
npx playwright show-report
```

## Troubleshooting

### Tests Timing Out

```typescript
// Increase timeout for specific test
test('slow test', async () => {
  // ...
}, { timeout: 30000 }) // 30 seconds

// Or globally in vitest.config.ts
testTimeout: 30000
```

### Flaky Tests

```bash
# Run test multiple times to identify flaky behavior
npx playwright test --repeat-each=10

# Add better waits in your test
await expect(page.locator('text=Success')).toBeVisible({ timeout: 10000 })
```

### Out of Memory Errors

```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm test
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port
PORT=3001 npm run dev
```

## Coverage Reports

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html

# Check coverage summary
cat coverage/coverage-summary.json
```

### Understanding Coverage Metrics

- **Lines**: Percentage of code lines executed
- **Functions**: Percentage of functions called
- **Branches**: Percentage of conditional branches taken
- **Statements**: Percentage of statements executed

**Goal**: All metrics >80% (Critical paths: 100%)

## Performance Tips

### Speed Up Tests

1. **Run Only Changed Tests**
   ```bash
   npm test -- --changed
   ```

2. **Run Tests in Parallel**
   ```bash
   # Already enabled by default
   # Adjust workers if needed
   npm test -- --max-workers=4
   ```

3. **Skip Slow Tests During Development**
   ```typescript
   test.skip('slow test', () => {
     // This test will be skipped
   })
   ```

4. **Use Focused Tests**
   ```typescript
   test.only('focused test', () => {
     // Only this test will run
   })
   ```

## Common Patterns

### Testing Forms
```bash
# Find form tests
grep -r "form" tests/

# Run form tests
npm test -- --grep "form"
```

### Testing API Routes
```bash
# Find API tests
find tests/integration -name "*api*"

# Run API tests
npm test tests/integration/api/
```

### Testing Components
```bash
# Find component tests
find tests/components -name "*.test.tsx"

# Run specific component tests
npm test tests/components/Button.test.tsx
```

## Continuous Testing

### Watch Mode (Recommended for Development)
```bash
npm run test:watch
```

This will:
- ✓ Watch for file changes
- ✓ Re-run affected tests automatically
- ✓ Show only relevant test output
- ✓ Support filtering by pattern
- ✓ Fast feedback loop

### Editor Integration

**VS Code**: Install "Vitest" and "Playwright Test for VSCode" extensions
- Run tests from editor
- Debug tests inline
- See coverage in gutter
- Click to run individual tests

## Need Help?

1. **Check test output** - Often contains helpful error messages
2. **Review test documentation** - See TESTING_GUIDE.md
3. **Look at similar tests** - Find examples in the codebase
4. **Ask the team** - Someone has likely solved this before
5. **Check CI logs** - See what worked in CI

## Resources

- [Vitest CLI Documentation](https://vitest.dev/guide/cli.html)
- [Playwright CLI Documentation](https://playwright.dev/docs/test-cli)
- [Debugging Tests](https://testing-library.com/docs/dom-testing-library/api-debugging)
