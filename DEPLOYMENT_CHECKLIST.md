# 🚀 Visual Consistency Deployment Checklist

## Pre-Deployment

- [ ] Review `VISUAL_CONSISTENCY_REFACTOR_COMPLETE.md`
- [ ] Read `/docs/visual-system.md`
- [ ] Verify all new files exist:
  - [ ] `/design-tokens/tokens.json`
  - [ ] `/components/ui-kit/` (5 components)
  - [ ] `/app/globals-unified.css`
  - [ ] `/scripts/enforce-design-system.sh`
  - [ ] `/.stylelintrc.json`
  - [ ] `/.eslintrc.design-system.json`

## Update Code

- [ ] Replace in `app/layout.tsx`:
  ```diff
  - import './globals.css';
  + import './globals-unified.css';
  ```

- [ ] Add package.json scripts:
  ```json
  {
    "scripts": {
      "lint:design-system": "eslint . --config .eslintrc.design-system.json",
      "validate:design": "./scripts/enforce-design-system.sh"
    }
  }
  ```

## Quality Checks

- [ ] Run `npm run type-check`
- [ ] Run `npm run lint:design-system` (after adding script)
- [ ] Run `./scripts/enforce-design-system.sh`
- [ ] Fix any validation errors

## Deploy

- [ ] Stage changes:
  ```bash
  git add design-tokens/ components/ui-kit/ app/globals-unified.css docs/ scripts/ .stylelintrc.json .eslintrc.design-system.json *.md
  ```

- [ ] Commit:
  ```bash
  git commit -m "feat: unified design system - black/white luxury aesthetic

  - Consolidated 3 conflicting systems into one
  - Created design-tokens/tokens.json
  - Built UI kit components
  - Added quality gates and documentation

  🤖 Generated with Claude Code

  Co-Authored-By: Claude <noreply@anthropic.com>"
  ```

- [ ] Deploy via Vercel CLI:
  ```bash
  VERCEL_PROJECT_ID="prj_u7Hob8ST9TGSra2mJeYfv0Ox1pgu" VERCEL_ORG_ID="team_Xzht85INUsoW05STx9DMMyLX" vercel --prod --yes
  ```

  OR push to trigger auto-deploy:
  ```bash
  git push
  ```

## Post-Deployment

- [ ] Visit https://www.pgclosets.com
- [ ] Verify black/white aesthetic on:
  - [ ] Homepage
  - [ ] Products page
  - [ ] Product detail pages
  - [ ] About/Services/Contact
- [ ] Test mobile responsive design
- [ ] Test accessibility (keyboard nav)
- [ ] Run Lighthouse audit
- [ ] Check browser console for errors

## Validation

- [ ] All pages use consistent colors (black/white)
- [ ] No raw hex colors visible
- [ ] Typography follows scale
- [ ] Buttons have smooth animations
- [ ] Cards have hover effects
- [ ] Focus states are visible
- [ ] Mobile menu works
- [ ] Forms are styled correctly

## Rollback (if needed)

If issues found:
```bash
git revert HEAD
git push
```

---

**Status**: ⏳ Ready to Deploy
**Next**: Update app/layout.tsx and deploy
