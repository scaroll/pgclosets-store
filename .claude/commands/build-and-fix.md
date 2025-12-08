# Build and Fix All Errors

Run the TypeScript build and systematically fix all errors found.

## Instructions

1. **Run Initial Build**
   ```bash
   pnpm build 2>&1 || true
   ```

2. **Analyze Errors**
   - Count total errors
   - Group by file
   - Identify patterns (missing imports, type mismatches, etc.)

3. **Fix Strategy**
   - Start with files that have the most errors
   - Fix import errors first (they often cascade)
   - Then fix type errors
   - Then fix logic errors

4. **For Each Error:**
   - Read the relevant file section
   - Understand the context
   - Make the minimal fix needed
   - Don't over-engineer solutions

5. **Verification**
   - Run build again after each batch of fixes
   - Continue until zero errors
   - Run `pnpm lint` to check for linting issues

## Output Format

```
🔨 Build & Fix Report

Initial State:
- Errors: X
- Files affected: Y

Fixes Applied:
1. [file.ts] - Description of fix
2. [file2.tsx] - Description of fix

Final State:
- Errors: 0 ✅
- Warnings: X (if any)

Build successful!
```

## Important Rules

- Never ignore errors with `// @ts-ignore` unless absolutely necessary
- If an error reveals a deeper issue, note it but fix the immediate problem
- If you can't fix an error, document why and continue
- Always run a final verification build
