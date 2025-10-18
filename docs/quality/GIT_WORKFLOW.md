# Git Workflow & Release Management

**PG Closets - Git Strategy & Best Practices**

## Branching Strategy

We use a modified Gitflow workflow optimized for continuous deployment.

### Branch Types

#### `main` (Production)
- Always deployable
- Protected branch (no direct commits)
- All commits must be via PR
- Requires 1+ approval
- Auto-deploys to production

#### `staging` (Pre-production)
- Integration testing environment
- Protected branch
- Auto-deploys to staging environment
- Testing ground before production

#### `feat/*` (Feature Branches)
- New features or enhancements
- Branch from: `main`
- Merge to: `staging` → `main`
- Example: `feat/premium-hero-section`

#### `fix/*` (Bug Fix Branches)
- Bug fixes
- Branch from: `main`
- Merge to: `staging` → `main`
- Example: `fix/checkout-validation-error`

#### `hotfix/*` (Emergency Fixes)
- Critical production fixes
- Branch from: `main`
- Merge to: `main` + `staging`
- Example: `hotfix/payment-processing-error`

#### `refactor/*` (Refactoring)
- Code improvements without feature changes
- Branch from: `main`
- Merge to: `staging` → `main`
- Example: `refactor/product-card-component`

#### `docs/*` (Documentation)
- Documentation updates
- Branch from: `main`
- Merge to: `main`
- Example: `docs/api-documentation`

### Workflow Diagram

```
main (production)
 ├─ feat/new-feature
 │   └─ PR → staging → PR → main
 ├─ fix/bug-fix
 │   └─ PR → staging → PR → main
 └─ hotfix/critical-fix
     └─ PR → main (fast-track)
```

## Daily Workflow

### Starting New Work

```bash
# 1. Get latest changes
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feat/your-feature-name

# 3. Make changes
# ... edit files ...

# 4. Check status
git status

# 5. Stage changes
git add .

# 6. Commit with conventional commits
git commit -m "feat(component): add new feature"

# 7. Push to remote
git push origin feat/your-feature-name
```

### Keeping Branch Updated

```bash
# Option 1: Merge (preserves history)
git checkout main
git pull origin main
git checkout feat/your-feature
git merge main

# Option 2: Rebase (cleaner history, preferred)
git checkout feat/your-feature
git fetch origin
git rebase origin/main

# If conflicts occur:
# 1. Resolve conflicts in files
# 2. git add <resolved-files>
# 3. git rebase --continue
```

### Creating Pull Request

1. Push your branch
2. Go to GitHub
3. Click "New Pull Request"
4. Fill out PR template completely
5. Select reviewers
6. Link related issues
7. Add labels (if applicable)
8. Submit PR

### Responding to PR Feedback

```bash
# Make requested changes
# ... edit files ...

# Commit changes
git add .
git commit -m "fix(review): address PR feedback"

# Push to same branch
git push origin feat/your-feature

# PR will automatically update
```

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code change that neither fixes bug nor adds feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `build`: Build system or dependencies
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Revert previous commit
- `security`: Security improvements
- `a11y`: Accessibility improvements
- `seo`: SEO improvements
- `ui`: UI/visual changes
- `ux`: UX improvements
- `content`: Content changes

### Examples

```bash
# Good commits
git commit -m "feat(homepage): add premium hero section with animations"
git commit -m "fix(checkout): resolve payment validation error"
git commit -m "docs(readme): update installation instructions"
git commit -m "perf(images): optimize product images for faster load"
git commit -m "refactor(components): simplify button component logic"

# Bad commits (will be rejected by commit-msg hook)
git commit -m "updates"
git commit -m "fix stuff"
git commit -m "wip"
git commit -m "asdf"
```

### Breaking Changes

```bash
git commit -m "feat(api)!: change product API response structure

BREAKING CHANGE: Product API now returns array instead of object.
Update all API calls to handle new format."
```

## Release Management

### Versioning

We use [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (e.g., 1.0.0 → 2.0.0)
- **MINOR**: New features (e.g., 1.0.0 → 1.1.0)
- **PATCH**: Bug fixes (e.g., 1.0.0 → 1.0.1)

### Creating a Release

```bash
# 1. Update version in package.json
npm version patch   # for bug fixes
npm version minor   # for new features
npm version major   # for breaking changes

# 2. This automatically:
#    - Updates package.json version
#    - Creates git tag
#    - Creates git commit

# 3. Push with tags
git push origin main --tags

# 4. Create GitHub Release
#    - Go to GitHub Releases
#    - Click "Create new release"
#    - Select the tag
#    - Add release notes (from CHANGELOG.md)
#    - Publish release

# 5. Auto-deployment triggers to production
```

### Release Notes Template

```markdown
## What's Changed

### Features ✨
- Add premium hero section by @username in #123
- Implement quote wizard by @username in #124

### Bug Fixes 🐛
- Fix checkout validation error by @username in #125
- Resolve image loading issue by @username in #126

### Performance 🚀
- Optimize bundle size by 15% by @username in #127

### Accessibility ♿
- Improve keyboard navigation by @username in #128

### Documentation 📚
- Update API documentation by @username in #129

**Full Changelog**: v1.0.0...v1.1.0
```

## Hotfix Process

For critical production bugs that need immediate fix:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-payment-bug

# 2. Fix the issue
# ... make changes ...

# 3. Commit
git commit -m "hotfix(payment): fix critical payment processing error"

# 4. Push
git push origin hotfix/critical-payment-bug

# 5. Create PR to main (fast-track approval)
# 6. After merge, cherry-pick to staging
git checkout staging
git cherry-pick <commit-hash>
git push origin staging

# 7. Delete hotfix branch
git branch -d hotfix/critical-payment-bug
git push origin --delete hotfix/critical-payment-bug
```

## Best Practices

### DO ✅

- Keep commits atomic and focused
- Write clear, descriptive commit messages
- Pull latest changes before starting work
- Create small, focused PRs (<400 lines)
- Test locally before pushing
- Respond to PR feedback promptly
- Delete merged branches
- Use draft PRs for work-in-progress
- Tag team members for review
- Link PRs to issues

### DON'T ❌

- Force push to `main` or `staging`
- Commit directly to `main`
- Commit sensitive data (keys, tokens, passwords)
- Commit `console.log` statements
- Create huge PRs (>1000 lines)
- Leave PRs open indefinitely
- Commit commented-out code
- Mix multiple concerns in one commit
- Use generic commit messages
- Bypass pre-commit hooks

## Git Commands Cheat Sheet

```bash
# Status and info
git status                    # Show working tree status
git log --oneline            # Show commit history (concise)
git diff                     # Show changes
git branch -a                # Show all branches

# Branching
git checkout -b feat/name    # Create and switch to branch
git branch -d feat/name      # Delete local branch
git push -d origin feat/name # Delete remote branch

# Updating
git pull origin main         # Pull latest from main
git fetch origin             # Fetch without merging
git rebase origin/main       # Rebase on main

# Committing
git add .                    # Stage all changes
git commit -m "message"      # Commit with message
git commit --amend           # Amend last commit
git push                     # Push to remote

# Undoing changes
git restore <file>           # Discard changes in file
git reset HEAD~1             # Undo last commit (keep changes)
git reset --hard HEAD~1      # Undo last commit (discard changes)

# Stashing
git stash                    # Stash changes
git stash pop                # Apply and remove stash
git stash list               # List stashes

# Cherry-picking
git cherry-pick <hash>       # Apply specific commit
```

## Troubleshooting

### Merge Conflicts

```bash
# When merge conflict occurs:
# 1. Open conflicted files
# 2. Look for conflict markers:
<<<<<<< HEAD
Your changes
=======
Incoming changes
>>>>>>> branch-name

# 3. Resolve by choosing or combining changes
# 4. Remove conflict markers
# 5. Stage resolved files
git add <resolved-files>

# 6. Complete merge
git merge --continue
# or for rebase:
git rebase --continue
```

### Accidentally Committed to Wrong Branch

```bash
# If not pushed yet:
git reset HEAD~1             # Undo commit (keep changes)
git stash                    # Stash changes
git checkout correct-branch  # Switch to correct branch
git stash pop                # Apply changes
git commit -m "message"      # Commit on correct branch
```

### Undo Last Commit

```bash
# Keep changes (most common)
git reset HEAD~1

# Discard changes (be careful!)
git reset --hard HEAD~1
```

## GitHub Settings

### Branch Protection Rules (main)

- Require pull request before merging
- Require approvals: 1
- Dismiss stale approvals
- Require status checks to pass
- Require conversation resolution
- Do not allow bypassing

### Required Status Checks

- TypeScript type check
- ESLint
- Tests
- Build

---

**Questions? Ask in #dev-help**

*Last updated: October 2024*
*Maintained by: PG Closets Development Team*
