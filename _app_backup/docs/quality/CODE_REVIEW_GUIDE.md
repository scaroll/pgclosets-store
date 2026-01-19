# Code Review Guide

**PG Closets - Elevated Taste Without Pretense**

## Table of Contents

- [Philosophy](#philosophy)
- [Review Process](#review-process)
- [What to Look For](#what-to-look-for)
- [Review Checklist](#review-checklist)
- [Common Issues](#common-issues)
- [Best Practices](#best-practices)

## Philosophy

Code reviews are about:
- **Quality**: Maintaining high code standards
- **Learning**: Sharing knowledge across the team
- **Collaboration**: Building better solutions together
- **Consistency**: Ensuring codebase coherence

Code reviews are NOT about:
- ❌ Finding fault or criticism
- ❌ Nitpicking style (that's what automated tools are for)
- ❌ Blocking progress unnecessarily
- ❌ Ego or showing off knowledge

## Review Process

### 1. Initial Review (5-10 minutes)

- Read the PR description and linked issues
- Understand the context and goals
- Check that CI/CD passes
- Verify PR template is complete

### 2. Code Review (15-30 minutes)

- Review changed files systematically
- Test locally if needed
- Check for potential issues
- Add constructive comments

### 3. Final Decision (5 minutes)

- Approve, Request Changes, or Comment
- Provide clear next steps
- Be responsive to follow-ups

## What to Look For

### Architecture & Design

✅ **Good**
- Follows existing patterns
- Appropriate abstraction level
- Clear separation of concerns
- Scalable design

❌ **Bad**
- Introduces new patterns unnecessarily
- Over-engineering simple features
- Tight coupling
- Duplicates existing functionality

### Code Quality

✅ **Good**
```typescript
// Clear, type-safe, and maintainable
interface ProductCardProps {
  product: Product;
  variant?: 'compact' | 'detailed';
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, variant = 'compact', onAddToCart }: ProductCardProps) => {
  const handleClick = useCallback(() => {
    onAddToCart?.(product);
  }, [product, onAddToCart]);
  
  return (
    <article className='product-card'>
      <h3>{product.name}</h3>
      {/* ... */}
    </article>
  );
};
```

❌ **Bad**
```typescript
// Unclear types, poor structure
export function ProductCard(props: any) {
  return (
    <div onClick={() => props.callback(props.data)}>
      {props.data.title}
    </div>
  );
}
```

### Performance

✅ **Look for:**
- Proper memoization (React.memo, useMemo, useCallback)
- Lazy loading for heavy components
- Optimized images (Next.js Image)
- Efficient data fetching
- No unnecessary re-renders

❌ **Watch out for:**
- Creating functions in render
- Missing dependency arrays
- Large bundle imports
- Unoptimized images
- N+1 queries

### Security

✅ **Look for:**
- Input validation
- Sanitized user content
- Secure API calls
- Environment variables for secrets
- Proper authentication/authorization

❌ **Watch out for:**
- Hardcoded secrets
- Unvalidated inputs
- XSS vulnerabilities
- CSRF vulnerabilities
- Exposed sensitive data

### Accessibility

✅ **Look for:**
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

❌ **Watch out for:**
- Missing alt text
- Non-semantic divs
- Missing focus states
- Color-only indicators
- Poor contrast ratios

### Testing

✅ **Look for:**
- Tests for new features
- Tests for bug fixes
- Edge cases covered
- Clear test descriptions
- Proper mocking

❌ **Watch out for:**
- Missing tests
- Flaky tests
- Over-mocked tests
- Unclear assertions
- Low coverage

## Review Checklist

### Functionality
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No obvious bugs

### Code Quality
- [ ] TypeScript strict mode passing
- [ ] ESLint rules followed
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Functions are single-purpose
- [ ] Variables and functions are well-named
- [ ] Complex logic is commented

### Testing
- [ ] Adequate test coverage
- [ ] Tests are meaningful
- [ ] Tests pass locally
- [ ] Manual testing performed

### Performance
- [ ] No performance regressions
- [ ] Bundle size impact acceptable
- [ ] Images optimized
- [ ] Async operations handled properly

### Security
- [ ] No security vulnerabilities
- [ ] Input validation present
- [ ] No hardcoded secrets
- [ ] Authentication/authorization correct

### Accessibility
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Color contrast acceptable
- [ ] ARIA labels where needed

### Documentation
- [ ] README updated if needed
- [ ] Complex code commented
- [ ] API changes documented
- [ ] Breaking changes noted

## Common Issues

### Issue: Too Many Changes

**Problem**: PR changes 50+ files across multiple domains

**Solution**: 
- Ask author to split into smaller PRs
- Each PR should have single responsibility
- Easier to review, test, and revert if needed

### Issue: No Tests

**Problem**: New feature or bug fix without tests

**Solution**:
- Request tests before approval
- Suggest test cases
- Offer to pair on tests if needed

### Issue: Poor TypeScript Usage

**Problem**: Liberal use of `any`, type assertions, non-null assertions

**Solution**:
```typescript
// ❌ Bad
const data = response.data as any;
const user = users[0]!;

// ✅ Good
const data: ApiResponse = response.data;
const user = users[0];
if (!user) throw new Error('User not found');
```

### Issue: Accessibility Violations

**Problem**: Missing alt text, poor semantic HTML

**Solution**:
```tsx
// ❌ Bad
<div onClick={handleClick}>Click me</div>
<img src='...' />

// ✅ Good
<button onClick={handleClick}>Click me</button>
<img src='...' alt='Product thumbnail showing luxury closet interior' />
```

## Best Practices

### For Reviewers

1. **Be Kind and Constructive**
   - Use "we" language: "We could improve this by..."
   - Ask questions: "Have you considered...?"
   - Explain why: "This approach is better because..."

2. **Be Specific**
   - Point to exact lines
   - Provide examples
   - Suggest concrete improvements

3. **Prioritize Issues**
   - 🔴 Critical: Security, bugs, breaking changes
   - 🟡 Important: Performance, accessibility, maintainability
   - 🟢 Nice to have: Style preferences, minor optimizations

4. **Be Timely**
   - Review within 24 hours
   - Respond to updates quickly
   - Don't leave PRs hanging

### For Authors

1. **Self-Review First**
   - Review your own PR before requesting review
   - Check for console.logs, TODOs, debugging code
   - Ensure CI passes

2. **Provide Context**
   - Fill out PR template completely
   - Link to relevant issues
   - Explain complex decisions

3. **Keep PRs Small**
   - Aim for < 400 lines changed
   - Single responsibility
   - Easier to review and merge

4. **Be Responsive**
   - Respond to feedback promptly
   - Ask for clarification if needed
   - Be open to suggestions

## Review Comments Examples

### Constructive Feedback

✅ **Good**
> "This function could be simplified by using `Array.reduce()` instead of the for loop. This would make it more functional and easier to read. Here's an example: [code snippet]"

❌ **Bad**
> "This is wrong. Use reduce."

### Asking Questions

✅ **Good**
> "I notice we're fetching all products here. Have we considered pagination to improve performance? What happens if there are 10,000+ products?"

❌ **Bad**
> "This will break with lots of products."

### Suggesting Improvements

✅ **Good**
> "For better type safety, we could use a discriminated union here:
> ```typescript
> type Status = 
>   | { type: 'loading' }
>   | { type: 'error'; message: string }
>   | { type: 'success'; data: Product[] }
> ```
> This way TypeScript can narrow the type in each case."

❌ **Bad**
> "Types are wrong."

## Conclusion

Great code reviews make great teams. Approach each review as an opportunity to learn, teach, and improve the codebase together.

Remember: **Elevated taste without pretense** applies to code reviews too.

---

*Last updated: October 2024*
*Maintained by: PG Closets Development Team*
