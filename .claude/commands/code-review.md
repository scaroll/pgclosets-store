# Code Review

Perform a thorough architectural and code quality review of recent changes.

## Instructions

1. **Identify Changes**
   - Check git diff for uncommitted changes
   - Or review files specified by user
   - List all files to be reviewed

2. **Review Each File For:**

### Architecture & Design
- [ ] Follows project patterns and conventions
- [ ] Proper separation of concerns
- [ ] No business logic in UI components
- [ ] API routes follow REST conventions
- [ ] Proper error handling throughout

### Code Quality
- [ ] No code duplication
- [ ] Functions are single-purpose
- [ ] Variable/function names are clear
- [ ] No magic numbers/strings
- [ ] Proper TypeScript types (no `any`)

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (proper escaping)
- [ ] Authentication checks where needed

### Performance
- [ ] No unnecessary re-renders
- [ ] Efficient database queries
- [ ] Proper use of useMemo/useCallback
- [ ] No blocking operations in critical paths

### Best Practices
- [ ] Follows React 19 patterns
- [ ] Uses shadcn/ui components correctly
- [ ] Proper error boundaries
- [ ] Loading states handled
- [ ] Accessible (ARIA labels, keyboard nav)

3. **Report Format:**

## Review Summary

### Files Reviewed
- `path/to/file.ts` - Brief description

### Issues Found

#### Critical (Must Fix)
- [ ] Issue 1: Description and location
- [ ] Issue 2: Description and location

#### Warnings (Should Fix)
- [ ] Warning 1: Description
- [ ] Warning 2: Description

#### Suggestions (Nice to Have)
- Suggestion 1
- Suggestion 2

### Positive Notes
- Good pattern usage in X
- Clean implementation of Y

### Overall Assessment
✅ Approved / ⚠️ Needs Changes / ❌ Major Issues
