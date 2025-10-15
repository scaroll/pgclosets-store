# Contributing to PG Closets

Thank you for contributing to the PG Closets project! This guide will help you get started with contributing code, documentation, and improvements.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation Standards](#documentation-standards)

## 🤝 Code of Conduct

### Our Standards

- **Be Respectful**: Treat everyone with respect and kindness
- **Be Collaborative**: Work together towards common goals
- **Be Professional**: Maintain professional conduct in all interactions
- **Be Inclusive**: Welcome diverse perspectives and backgrounds
- **Be Constructive**: Provide helpful, actionable feedback

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Sharing others' private information
- Unprofessional conduct

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- Git
- A code editor (VS Code recommended)
- PostgreSQL (for local database)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/pgclosets/store.git
cd store

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Set up database
npm run db:push

# Start development server
npm run dev
```

See [Development Setup Guide](./developer-guides/SETUP.md) for detailed instructions.

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Feature branch
git checkout -b feature/add-new-component

# Bug fix branch
git checkout -b fix/resolve-navigation-issue

# Documentation branch
git checkout -b docs/update-api-guide
```

### 2. Make Your Changes

- Write clean, maintainable code
- Follow existing code patterns
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm run test

# Run type checking
npm run type-check

# Run linting
npm run lint

# Check performance
npm run validate:performance
```

### 4. Commit Your Changes

Follow our [commit message guidelines](#commit-message-guidelines).

### 5. Push and Create PR

```bash
# Push your branch
git push origin feature/add-new-component

# Create pull request on GitHub
```

## 🎨 Code Style Guidelines

### TypeScript/JavaScript

#### General Principles

- Use TypeScript for all new code
- Enable strict mode in TypeScript
- Prefer functional components with hooks
- Use async/await over promises
- Destructure props and imports

#### Naming Conventions

```typescript
// Components: PascalCase
export function ProductCard() {}

// Functions: camelCase
function calculateTotal() {}

// Constants: UPPER_SNAKE_CASE
const MAX_ITEMS = 100;

// Types/Interfaces: PascalCase
interface User {
  id: string;
  name: string;
}

// Files:
// - Components: PascalCase (ProductCard.tsx)
// - Utilities: kebab-case (format-currency.ts)
// - Hooks: camelCase with 'use' prefix (useCart.ts)
```

#### Code Organization

```typescript
// 1. Imports (organized)
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface ProductCardProps {
  title: string;
  price: number;
}

// 3. Component
export function ProductCard({ title, price }: ProductCardProps) {
  // 4. Hooks
  const [isHovered, setIsHovered] = useState(false);

  // 5. Event handlers
  const handleClick = () => {
    // Implementation
  };

  // 6. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

#### Best Practices

```typescript
// ✅ DO: Use type-safe props
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

// ❌ DON'T: Use 'any' type
function handleData(data: any) {}

// ✅ DO: Use proper typing
function handleData(data: Product[]) {}

// ✅ DO: Destructure props
function ProductCard({ title, price }: ProductCardProps) {}

// ❌ DON'T: Access props directly
function ProductCard(props) {
  return <div>{props.title}</div>
}

// ✅ DO: Use early returns
function processUser(user: User | null) {
  if (!user) return null;

  // Process user
  return user.name;
}

// ✅ DO: Use optional chaining
const email = user?.contact?.email;

// ✅ DO: Use nullish coalescing
const name = user.name ?? 'Guest';
```

### React Components

#### Functional Components

```typescript
// ✅ DO: Use arrow functions for components
export const Button = ({ children, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>;
};

// ✅ DO: Use React.FC when you need children type inference
export const Container: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
};
```

#### Hooks Rules

```typescript
// ✅ DO: Custom hooks start with 'use'
function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProduct(id).then(setProduct);
  }, [id]);

  return product;
}

// ✅ DO: Extract complex logic to custom hooks
function useCartCalculations(items: CartItem[]) {
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  return { subtotal, tax, total };
}
```

#### Performance Optimization

```typescript
// ✅ DO: Use React.memo for expensive components
export const ProductCard = React.memo(({ product }: Props) => {
  return <div>{product.title}</div>;
});

// ✅ DO: Use useMemo for expensive calculations
const sortedProducts = useMemo(
  () => products.sort((a, b) => a.price - b.price),
  [products]
);

// ✅ DO: Use useCallback for functions passed as props
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### CSS/Styling

```typescript
// ✅ DO: Use Tailwind utility classes
<button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
  Click me
</button>

// ✅ DO: Use cn() helper for conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-variant"
)}>
  Content
</div>

// ✅ DO: Extract repeated patterns to components
// Instead of repeating Tailwind classes, create a Button component
```

### File Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── (routes)/          # Route groups
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── features/         # Feature-specific components
│   └── layout/           # Layout components
├── lib/                  # Utilities and helpers
│   ├── utils/           # Utility functions
│   ├── hooks/           # Custom React hooks
│   └── api/             # API clients
├── types/               # TypeScript type definitions
├── styles/              # Global styles
└── content/             # Static content/data
```

## 💬 Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Test additions or modifications
- **chore**: Build process or auxiliary tool changes
- **ci**: CI/CD configuration changes

### Examples

```bash
# Feature
feat(products): add product filtering by category

# Bug fix
fix(cart): resolve total calculation error

# Documentation
docs(api): update authentication endpoint documentation

# Performance
perf(images): implement lazy loading for product images

# Breaking change
feat(api)!: redesign product API structure

BREAKING CHANGE: Product API now returns nested categories
```

### Subject Guidelines

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Maximum 72 characters

## 🔀 Pull Request Process

### Before Creating a PR

1. **Update from main branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run all checks**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

3. **Update documentation** if needed

### PR Title

Use the same format as commit messages:

```
feat(products): add product filtering by category
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- List key changes
- Include relevant details
- Link to related issues

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### Review Process

1. **Automated Checks**: Must pass all CI checks
2. **Code Review**: At least one approval required
3. **Testing**: All tests must pass
4. **Documentation**: Updated if necessary

### Addressing Feedback

- Respond to all review comments
- Make requested changes in new commits
- Re-request review after changes
- Keep discussion focused and professional

## ✅ Testing Requirements

### Test Coverage

- **Unit Tests**: All utility functions and hooks
- **Component Tests**: All reusable components
- **Integration Tests**: Critical user flows
- **E2E Tests**: Key business processes

### Writing Tests

```typescript
// Unit test example
describe('formatCurrency', () => {
  it('should format USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('should handle zero values', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });
});

// Component test example
describe('ProductCard', () => {
  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<ProductCard product={mockProduct} onClick={handleClick} />);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledWith(mockProduct.id);
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- ProductCard.test.tsx
```

## 📚 Documentation Standards

### Code Documentation

Use TSDoc comments for all exported functions, classes, and interfaces:

```typescript
/**
 * Calculates the total price including tax and discounts
 *
 * @param items - Array of cart items
 * @param taxRate - Tax rate as decimal (e.g., 0.13 for 13%)
 * @param discountCode - Optional discount code to apply
 * @returns Total price after tax and discounts
 *
 * @example
 * ```ts
 * const total = calculateTotal(cartItems, 0.13, "SAVE10")
 * // returns 123.45
 * ```
 *
 * @throws {InvalidDiscountError} If discount code is invalid
 */
export function calculateTotal(
  items: CartItem[],
  taxRate: number,
  discountCode?: string
): number {
  // Implementation
}
```

### Markdown Documentation

- Use clear, descriptive headings
- Include code examples
- Add table of contents for long documents
- Use consistent formatting
- Include links to related docs

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Try to reproduce the bug
3. Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
Clear description of what the bug is

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
 - OS: [e.g., macOS]
 - Browser: [e.g., Chrome 120]
 - Version: [e.g., 1.2.3]

**Additional context**
Any other context about the problem
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Description of desired feature

**Describe alternatives you've considered**
Other approaches you've thought about

**Additional context**
Mockups, examples, or context
```

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes
- Documentation credits

## 📞 Getting Help

- **Documentation**: Check [docs/README.md](./README.md)
- **Slack**: #development channel
- **Email**: dev@pgclosets.com

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to PG Closets! 🎉
