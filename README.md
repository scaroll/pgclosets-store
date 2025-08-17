# PG Closets Store - Ottawa's Premium Closet Systems

**TEST 1 VERIFICATION**: This documentation change should only trigger lint/unit tests, NOT deployment.

## Overview

PG Closets is Ottawa's premier destination for custom closet systems and barn doors. Our platform features:

- Real Renin product catalog integration
- Apple-inspired design system
- Comprehensive e-commerce functionality
- Triple-tested CI/CD pipeline

## Technology Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4.x with Geist fonts
- **Testing**: Playwright + Vitest + React Testing Library
- **Deployment**: Vercel with automated CI/CD
- **Analytics**: Vercel Analytics + Speed Insights

## Development

```bash
npm install --legacy-peer-deps
npm run dev
```

## Testing

```bash
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:smoke    # Smoke tests
npm run test:visual   # Visual regression
```

## Deployment

This project uses automated CI/CD with triple-testing:
1. **Stage 1**: Lint & Unit Tests
2. **Stage 2**: Preview Deploy + Smoke Tests + Visual Diff (PRs)
3. **Stage 3**: Production Deploy + Post-Deploy Checks (main branch)

---

Built with ❤️ for Ottawa homeowners