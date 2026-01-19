# Developer Onboarding Guide

**Welcome to PG Closets! 🎉**

This guide will help you get up and running quickly.

## Prerequisites

- **Node.js**: v20.x or higher ([Download](https://nodejs.org/))
- **Git**: Latest version
- **VS Code**: Recommended IDE ([Download](https://code.visualstudio.com/))
- **Basic knowledge of**: TypeScript, React, Next.js

## Day 1: Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone [repository-url]
cd pgclosets-store-main

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 2. VS Code Setup

Recommended extensions (will auto-prompt when you open the project):
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- GitLens

The project includes workspace settings that will auto-configure your editor.

### 3. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Verify Setup

```bash
# Run all checks
npm run validate:all

# This runs:
# - TypeScript type checking
# - ESLint
# - Prettier check
# - Tests
# - Security audit
```

## Day 2: Understanding the Codebase

### Project Structure

```
pgclosets-store-main/
├── app/                    # Next.js App Router pages
│   ├── (routes)/          # Route groups
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── forms/            # Form components
│   ├── navigation/       # Navigation components
│   └── home/             # Homepage components
├── lib/                  # Utility functions
│   ├── utils.ts         # General utilities
│   ├── hooks/           # Custom React hooks
│   └── validation/      # Validation schemas (Zod)
├── types/               # TypeScript type definitions
├── styles/              # Global styles
├── public/              # Static assets
├── docs/                # Documentation
├── tests/               # Test files
└── scripts/             # Build and utility scripts
```

### Key Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Forms**: React Hook Form + Zod validation
- **Backend**: Supabase
- **Deployment**: Vercel

### Coding Standards

Read these documents (in order):
1. [Code Review Guide](./CODE_REVIEW_GUIDE.md)
2. [ADR Documentation](./adr/README.md)
3. [Git Workflow](./GIT_WORKFLOW.md)

## Day 3: First Contribution

### 1. Create a Feature Branch

```bash
# Always branch from main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/your-feature-name
```

### 2. Make Changes

```bash
# Edit files
# Run dev server to test
npm run dev

# Auto-fix code issues
npm run quality:fix
```

### 3. Test Your Changes

```bash
# Run all tests
npm run test

# Type check
npm run type-check

# Lint
npm run lint
```

### 4. Commit Changes

We use Conventional Commits. The pre-commit hook will enforce this:

```bash
# Good commit messages
git commit -m "feat(homepage): add premium hero section"
git commit -m "fix(checkout): resolve payment validation bug"
git commit -m "docs(readme): update setup instructions"

# Bad commit messages (will be rejected)
git commit -m "updates"
git commit -m "fix stuff"
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `security`, `a11y`, `seo`, `ui`, `ux`, `content`

### 5. Create Pull Request

```bash
# Push your branch
git push origin feat/your-feature-name

# Create PR on GitHub
# Fill out the PR template completely
# Request review from team members
```

## Common Tasks

### Adding a New Component

```typescript
// components/ui/my-component.tsx
import type { ReactNode } from 'react';

interface MyComponentProps {
  children: ReactNode;
  variant?: 'default' | 'primary';
}

export const MyComponent = ({ 
  children, 
  variant = 'default' 
}: MyComponentProps) => {
  return (
    <div className='my-component'>
      {children}
    </div>
  );
};
```

### Adding a New Page

```typescript
// app/my-page/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page | PG Closets',
  description: 'Page description for SEO',
};

export default function MyPage() {
  return (
    <main className='container mx-auto'>
      <h1>My Page</h1>
    </main>
  );
}
```

### Adding a Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      {/* ... */}
    </form>
  );
};
```

## Debugging Tips

### TypeScript Errors

```bash
# Run type check with watch mode
npm run type-check:watch

# This will show errors in real-time
```

### ESLint Errors

```bash
# Auto-fix most errors
npm run lint:fix

# Some errors need manual fixing
```

### Build Errors

```bash
# Check for build issues
npm run build

# The build will show detailed errors
```

### Runtime Errors

- Check browser console
- Check terminal (server errors)
- Use React DevTools
- Add `console.log` for debugging (remove before commit!)

## Getting Help

- **Code Questions**: Ask in #dev-help Slack channel
- **Design Questions**: Ask in #design Slack channel
- **Bug Reports**: Create GitHub issue
- **Documentation**: Check `/docs` directory
- **Emergency**: Contact team lead

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## Checklist

### Before First PR
- [ ] Repository cloned and dependencies installed
- [ ] Dev server runs successfully
- [ ] All validation checks pass
- [ ] VS Code extensions installed
- [ ] Read code review guide
- [ ] Read Git workflow guide
- [ ] Understand project structure
- [ ] Know how to commit (conventional commits)
- [ ] Know how to create PR

### Before Each PR
- [ ] Tests pass
- [ ] Type check passes
- [ ] Linting passes
- [ ] Code formatted with Prettier
- [ ] No console.logs left in code
- [ ] PR template filled out
- [ ] Screenshots added (if UI changes)
- [ ] Tested on multiple browsers (if UI changes)

---

**Welcome to the team! Elevated taste without pretense.** ✨
