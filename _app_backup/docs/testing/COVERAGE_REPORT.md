# Test Coverage Report

## Coverage Goals

| Component | Current | Target | Critical Path |
|-----------|---------|--------|---------------|
| **Overall** | TBD | 80% | 100% |
| Utilities | TBD | 90% | N/A |
| Components | TBD | 75% | N/A |
| API Routes | TBD | 85% | 100% |
| Hooks | TBD | 85% | N/A |

## Critical Paths (Must Have 100% Coverage)

### 1. Quote Submission Flow
- ✅ Quote form validation
- ✅ Quote API endpoint
- ✅ Email notification
- ✅ Success/error handling
- ✅ Data persistence

### 2. Product Catalog
- ✅ Product listing
- ✅ Product filtering
- ✅ Product detail page
- ✅ Product search
- ✅ Image loading

### 3. Contact Form
- ✅ Form validation
- ✅ Contact API endpoint
- ✅ Email sending
- ✅ Success confirmation

## Coverage by Directory

### `/app` - Application Code
```
/app
  /api                 TBD% (Target: 85%)
  /components          TBD% (Target: 75%)
  /lib                 TBD% (Target: 90%)
  /hooks               TBD% (Target: 85%)
```

### `/components` - Reusable Components
```
/components
  /ui                  TBD% (Target: 75%)
  /forms               TBD% (Target: 85%)
  /layout              TBD% (Target: 70%)
```

## Uncovered Areas

### High Priority (Must Cover)
- [ ] Payment processing flow
- [ ] File upload validation
- [ ] Authentication logic
- [ ] Database migrations
- [ ] Error boundary components

### Medium Priority (Should Cover)
- [ ] Analytics tracking
- [ ] Newsletter subscription
- [ ] Search functionality
- [ ] Pagination logic
- [ ] Filter combinations

### Low Priority (Nice to Cover)
- [ ] Static content rendering
- [ ] SEO meta tags
- [ ] Styling utilities
- [ ] Constants and configs

## Coverage Exclusions

The following are intentionally excluded from coverage:
- Configuration files (*.config.*)
- Type definitions (*.d.ts)
- Test files themselves
- Build artifacts (.next/, dist/)
- Node modules
- Mock data
- Migration scripts

## How to Generate Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html

# View text summary
npm test -- --coverage

# Generate JSON report
npm test -- --coverage --coverage.reporter=json

# Check coverage in CI
# Automatically runs on every push
```

## Understanding Coverage Metrics

### Lines Coverage
Percentage of executable code lines that were run during tests.
- **Good**: >80%
- **Excellent**: >90%

### Function Coverage
Percentage of functions that were called during tests.
- **Good**: >80%
- **Excellent**: >85%

### Branch Coverage
Percentage of conditional branches (if/else, switch) that were tested.
- **Good**: >75%
- **Excellent**: >80%

### Statement Coverage
Percentage of statements that were executed during tests.
- **Good**: >80%
- **Excellent**: >90%

## Improving Coverage

### 1. Identify Uncovered Code

```bash
# Run coverage and open report
npm run test:coverage
open coverage/index.html

# Look for red/yellow highlighted code
# These lines were not executed during tests
```

### 2. Add Tests for Uncovered Paths

```typescript
// Example: Testing error path
test('should handle API errors', async () => {
  server.use(
    http.post('/api/endpoint', () => {
      return HttpResponse.json({ error: 'Error' }, { status: 500 })
    })
  )

  // Test error handling
  // This will increase branch coverage
})
```

### 3. Test Edge Cases

```typescript
// Test boundary conditions
test('should handle empty string', () => {
  expect(formatText('')).toBe('')
})

test('should handle very long strings', () => {
  const longString = 'a'.repeat(10000)
  expect(formatText(longString)).toBeDefined()
})

test('should handle special characters', () => {
  expect(formatText('Test & Co.')).toBe('Test &amp; Co.')
})
```

### 4. Test Error Paths

```typescript
// Don't just test the happy path
test('should throw error for invalid input', () => {
  expect(() => {
    validateEmail('not-an-email')
  }).toThrow('Invalid email')
})
```

## Coverage Trends

### Historical Coverage
```
Date       | Overall | Change
-----------|---------|--------
2025-01-15 | TBD%    | Baseline
2025-01-22 | TBD%    | +X%
2025-01-29 | TBD%    | +X%
```

### Coverage by Feature
```
Feature              | Coverage | Tests
---------------------|----------|------
Quote System         | TBD%     | X tests
Product Catalog      | TBD%     | X tests
Contact Form         | TBD%     | X tests
Search               | TBD%     | X tests
```

## Coverage Reports in CI/CD

### Pull Request Checks
- Coverage must not decrease
- New code must have >80% coverage
- Critical paths must have 100% coverage
- Report posted as PR comment

### Coverage Badge
![Coverage](https://img.shields.io/badge/coverage-TBD%25-yellow)

Add to README.md:
```markdown
![Coverage](https://img.shields.io/codecov/c/github/pgclosets/pgclosets-store)
```

## Best Practices

### Do's
✅ Test critical business logic thoroughly
✅ Test error paths and edge cases
✅ Test user-facing features completely
✅ Aim for meaningful coverage, not just high numbers
✅ Review coverage reports regularly

### Don'ts
❌ Don't write tests just to increase coverage
❌ Don't test implementation details
❌ Don't ignore failing tests
❌ Don't skip testing error scenarios
❌ Don't test trivial getters/setters

## Maintaining Coverage

### During Development
1. Run tests in watch mode
2. Check coverage for new files
3. Add tests before pushing code
4. Review coverage in PR

### During Code Review
1. Check coverage didn't decrease
2. Verify new code has tests
3. Ensure critical paths are covered
4. Review test quality, not just quantity

### Regular Maintenance
1. Weekly: Review uncovered areas
2. Monthly: Update coverage goals
3. Quarterly: Audit test effectiveness
4. Yearly: Review testing strategy

## Troubleshooting

### Coverage Not Generated
```bash
# Clean coverage directory
rm -rf coverage

# Run with explicit coverage flag
npm test -- --coverage

# Check Vitest configuration
cat vitest.config.ts
```

### Coverage Seems Wrong
```bash
# Clear cache and regenerate
rm -rf .vitest node_modules/.vitest
npm run test:coverage
```

### Slow Coverage Generation
```bash
# Use faster coverage provider
# In vitest.config.ts:
coverage: {
  provider: 'v8', // Faster than 'istanbul'
}
```

## Resources

- [Vitest Coverage](https://vitest.dev/guide/coverage.html)
- [Codecov Documentation](https://docs.codecov.com/)
- [Istanbul Coverage](https://istanbul.js.org/)
- [Testing Best Practices](https://testingjavascript.com/)

## Next Steps

1. ✅ Set up coverage infrastructure
2. ⏳ Write comprehensive unit tests
3. ⏳ Achieve 80% overall coverage
4. ⏳ Achieve 100% critical path coverage
5. ⏳ Set up automated coverage reporting
6. ⏳ Add coverage badges to README
7. ⏳ Establish coverage requirements for PRs

## Notes

Update this document as coverage improves. Track progress weekly and celebrate milestones!
