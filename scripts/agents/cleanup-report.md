Repository cleanup report and action plan

Date: 2025-09-25

Summary
-------
- Primary blockers: many ESLint unused-vars warnings, numerous `no-img-element` warnings across components, and 162 TypeScript errors from `npx tsc --noEmit` (missing modules, implicit any, mismatched types).
- Parsing/mismatched JSX tag errors were reduced by earlier fixers; current lint run still reports many unused-vars and TS errors.

High-level counts (from latest runs)
- ESLint/next lint: many files (>=70) with errors/warnings; notable categories: no-unused-vars, no-img-element, react-hooks/exhaustive-deps.
- TypeScript: 162 errors in 74 files (missing modules, implicit any, TS2307 module not found, TS7006 implicit any params).

Files containing raw <img> (sample from repo grep)
- components/navigation/mega-menu.tsx
- components/SecureImageUploader.tsx
- components/ui/file-upload.tsx
- components/ui/pg-logo.tsx
- components/MediaGallery.tsx
- app/blob-contents/page.tsx
- app/files/page.tsx
- app/cart/CartClientPage.tsx
- blog/page.tsx and blog/[slug]/page.tsx
- products/[slug]/page.tsx and products/page.tsx
- deploy/* (many duplicates under deploy/)
- (See scripts/agents/report-assets.js for full list)

Files with internal anchors (candidates for Link conversion)
- The repo contains scripts/agents/convert-anchors.js and report-assets.js; a conservative conversion policy is required (only internal path hrefs, exclude mailto/tel/external).

Top TypeScript hotspots (examples)
- medusa-products.ts (several TS2554/TS2345 errors around medusaClient.getProducts usage)
- products/[slug]/page.tsx (many implicit any and missing module imports like renin-products)
- components/ui/* and ui/* (many missing exported types from '@/lib/utils')
- multiple hooks and lib modules referencing @/lib/medusa-client and @medusajs/medusa — missing packages or types

Action plan (staged, safe, repeatable)
1) Parsing-first: ensure no JSX parse errors remain. (We already executed fixers; re-run after each batch.)
2) Low-risk automated fixes:
   - Prefix unused caught errors and unused function params with `_` where safe.
   - Remove unused `import Link from 'next/link'` where <Link> not used.
   - Run `eslint --fix` for auto-fixable issues.
3) Image conversions (batched): convert high-impact pages & components to `next/image` with `unoptimized` for external blob URLs; validate per-batch via lint + tsc.
4) TypeScript fixes (iterative): address missing modules (add or stub type declarations), fix implicit anys by adding types in priority files (products pages, core libs), and fix medusa client call signatures.
5) Hook deps and logic fixes: fix react-hooks/exhaustive-deps warnings where straightforward; otherwise document/ignore with inline comment.
6) CI & gating: Add/ensure lint/type checks in CI to prevent regressions.

Orchestration & running strategy
- Run safe fixers first (catch renames, import removals). Re-run lint & tsc.
- Convert images in small batches (6–8 files), re-run lint & tsc after each batch.
- Address TS errors in prioritized order (products, medusa integration, UI primitives), using small PR-style commits.

Next immediate step: run the repo fixer orchestration script `run-fixers.sh` (created alongside this report).

Notes
- Many files exist under a `deploy/` subfolder that are duplicates of source files. I will avoid touching deploy/ files until source files are clean to avoid duplicated work.
