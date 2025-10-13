# Deploy Check Command

Before deploying to production, verify the following:

## Pre-Deployment Checklist

1. **Tests Status**
   - [ ] All unit tests passing?
   - [ ] No failing E2E tests?
   - [ ] Test coverage acceptable?

2. **Code Quality**
   - [ ] No console.logs in production code?
   - [ ] No TODO/FIXME comments for critical items?
   - [ ] TypeScript errors resolved?
   - [ ] ESLint warnings addressed?

3. **Configuration**
   - [ ] Environment variables configured in Vercel?
   - [ ] Secrets properly set in GitHub?
   - [ ] API keys not hardcoded?

4. **Performance**
   - [ ] Bundle size acceptable (<200kB per page)?
   - [ ] Images optimized?
   - [ ] No unnecessary dependencies?

5. **Security**
   - [ ] No security vulnerabilities (npm audit)?
   - [ ] Authentication working?
   - [ ] CORS configured correctly?

6. **Documentation**
   - [ ] README updated?
   - [ ] Changelog entries added?
   - [ ] Breaking changes documented?

Run the checks and provide a summary with approval status (✅ Ready / ⚠️ Issues Found / ❌ Blocking Issues).
