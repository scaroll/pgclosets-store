# Copilot Instructions for PG Closets E-Commerce Store

## Project Overview
This is a modern Next.js 15 e-commerce store for PG Closets, built with React 19, TypeScript, and Tailwind CSS. The application focuses on custom closet solutions and professional installation services.

## Code Style & Conventions

### TypeScript Standards
- Use strict TypeScript with proper type definitions
- Prefer interfaces over type aliases for object shapes
- Always define return types for functions
- Use generic types where appropriate
- Never use `any` - use `unknown` or proper typing instead

### React Component Standards
- Use functional components with hooks exclusively
- Prefer arrow function syntax: `const Component = () => {}`
- Use destructured props: `({ prop1, prop2 }: Props) => {}`
- Always define prop interfaces with JSDoc comments
- Use React.memo for performance when appropriate
- Keep components under 200 lines - extract to smaller components if larger

### File Organization
- Components: PascalCase (e.g., `ProductCard.tsx`)
- Utilities: camelCase (e.g., `formatPrice.ts`)
- Pages: kebab-case following Next.js App Router structure
- Types: PascalCase with descriptive names (e.g., `ProductType`, `UserPreferences`)

### Import Organization
```typescript
// 1. React and Next.js imports
import React from 'react'
import { NextPage } from 'next'

// 2. Third-party libraries
import { clsx } from 'clsx'

// 3. Internal utilities and types
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/product'

// 4. Internal components
import { ProductCard } from '@/components/ProductCard'
```

### CSS and Styling
- Use Tailwind CSS exclusively for styling
- Prefer utility classes over custom CSS
- Use the `cn()` utility for conditional classes
- Responsive design: mobile-first approach
- Use semantic color names from the design system

## Architecture Patterns

### Next.js App Router
- Use Server Components by default
- Add 'use client' only when necessary (interactivity, hooks, browser APIs)
- Implement proper loading and error boundaries
- Use Next.js Image component for all images
- Implement proper metadata for SEO

### State Management
- Use React hooks for local component state
- Implement Context for shared state when needed
- Consider Zustand for complex global state
- Use React Query/TanStack Query for server state

### API Design
- Use Next.js Route Handlers for API routes
- Implement proper error handling and validation
- Use Zod for runtime type validation
- Return consistent API response shapes
- Implement proper status codes

## Business Domain

### E-Commerce Features
- Product catalog with categories and filtering
- Shopping cart functionality
- Checkout process with payment integration
- User accounts and order history
- Product reviews and ratings

### PG Closets Specific
- Custom closet configuration tools
- Installation service booking
- Geographic service areas (Ottawa, Kanata, Barrhaven, etc.)
- Professional consultation scheduling
- Gallery showcasing completed projects

## Performance Guidelines

### Core Web Vitals
- Optimize Largest Contentful Paint (LCP) < 2.5s
- Minimize Cumulative Layout Shift (CLS) < 0.1
- Ensure First Input Delay (FID) < 100ms
- Use Next.js Image optimization
- Implement proper lazy loading

### Bundle Optimization
- Use dynamic imports for heavy components
- Implement code splitting at route level
- Minimize bundle size - avoid unnecessary dependencies
- Use tree shaking effectively

## Security Best Practices

### Data Handling
- Validate all user inputs with Zod
- Sanitize data before database operations
- Never expose sensitive data in client-side code
- Use environment variables for secrets
- Implement proper CORS policies

### Authentication
- Use NextAuth.js for authentication
- Implement proper session management
- Secure API routes with middleware
- Use HTTPS in production

## Testing Strategy

### Unit Testing
- Test utility functions thoroughly
- Test custom hooks in isolation
- Use Jest and React Testing Library
- Aim for >80% code coverage on new features

### Integration Testing
- Test API routes with proper mocking
- Test component interactions
- Use MSW for API mocking in tests

### E2E Testing
- Test critical user journeys
- Use Playwright for cross-browser testing
- Test checkout flow end-to-end
- Test responsive design on different devices

## Error Handling

### User Experience
- Provide meaningful error messages
- Implement fallback UI for error states
- Use Error Boundaries for React errors
- Show loading states during async operations

### Logging and Monitoring
- Log errors with proper context
- Never log sensitive information
- Use structured logging format
- Implement proper error tracking

## Accessibility Standards

### WCAG Compliance
- Ensure keyboard navigation works throughout
- Use semantic HTML elements
- Provide alt text for all images
- Maintain proper color contrast ratios
- Use ARIA labels where appropriate

### Screen Reader Support
- Use proper heading hierarchy (h1-h6)
- Provide skip navigation links
- Ensure form labels are properly associated
- Test with screen readers

## Git Workflow

### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, etc.
- Keep commits atomic and focused
- Write descriptive commit messages
- Reference issue numbers when applicable

### Branch Strategy
- Use feature branches for new development
- Merge to `main` only after review
- Delete feature branches after merging
- Keep commit history clean

## Code Review Guidelines

### What to Look For
- Code follows established patterns
- Proper error handling is implemented
- Tests are included for new functionality
- Performance implications are considered
- Accessibility standards are met
- Security best practices are followed

## When Generating Code

1. **Always consider the full context** of the application
2. **Follow existing patterns** rather than introducing new ones
3. **Include proper TypeScript types** and JSDoc comments
4. **Consider performance implications** of your suggestions
5. **Include error handling** and loading states
6. **Ensure accessibility** in UI components
7. **Write clean, readable code** that follows the established conventions
8. **Suggest tests** when implementing new functionality
9. **Consider mobile responsiveness** for all UI changes
10. **Follow the principle of least surprise** - code should be predictable

## Preferred Libraries and Tools

- **UI Components**: Radix UI primitives with custom styling
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Fetch API with custom wrappers
- **State Management**: React hooks, Context API, or Zustand
- **Styling**: Tailwind CSS with custom design tokens
- **Testing**: Jest, React Testing Library, Playwright
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

Remember: The goal is to maintain a high-quality, performant, and maintainable codebase that delivers an excellent user experience for PG Closets customers.