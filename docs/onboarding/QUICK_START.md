# Quick Start Guide

> **Get up and running with PG Closets development in 5 minutes**

## ⚡ Super Quick Start

```bash
# 1. Clone and navigate
git clone https://github.com/pgclosets/store.git && cd store

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local

# 4. Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📋 What You Need

- Node.js 20.x or higher
- npm 10.x or higher
- Git
- A code editor (VS Code recommended)

## 🔧 Essential Commands

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run start                  # Start production server

# Code Quality
npm run lint                   # Check for linting errors
npm run lint:fix               # Fix linting errors
npm run type-check             # Check TypeScript types
npm run format                 # Format code with Prettier
npm run quality                # Run all quality checks

# Testing
npm run test                   # Run tests
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Run tests with coverage

# Database
npx prisma studio              # Open database GUI
npx prisma migrate dev         # Run migrations
npx prisma generate            # Generate Prisma client

# Performance
npm run analyze                # Analyze bundle size
npm run validate:performance   # Check performance metrics
```

## 📁 Project Structure

```
pgclosets-store/
├── app/                       # Next.js App Router pages
│   ├── (routes)/             # Route groups
│   ├── api/                  # API routes
│   ├── products/             # Product pages
│   └── layout.tsx            # Root layout
├── components/               # React components
│   ├── ui/                   # Base UI components
│   ├── features/             # Feature components
│   └── layout/               # Layout components
├── lib/                      # Utilities and helpers
│   ├── utils/                # Utility functions
│   ├── hooks/                # Custom React hooks
│   ├── api/                  # API clients
│   └── db/                   # Database utilities
├── types/                    # TypeScript types
├── styles/                   # Global styles
├── public/                   # Static assets
├── docs/                     # Documentation
└── prisma/                   # Database schema
```

## 🎨 Key Technologies

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| React 18 | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Prisma | Database ORM |
| PostgreSQL | Database |
| Zustand | State management |
| React Hook Form | Form handling |
| Zod | Schema validation |

## 🚀 Common Workflows

### Making Changes to a Page

```bash
# 1. Find the page file
# Pages are in app/ directory
# Example: app/products/page.tsx

# 2. Edit the file
# Changes auto-reload in development

# 3. Check for errors
npm run type-check
npm run lint

# 4. Test your changes
npm run test
```

### Creating a New Component

```tsx
// components/features/product-card/ProductCard.tsx
interface ProductCardProps {
  title: string;
  price: number;
  image: string;
}

export function ProductCard({ title, price, image }: ProductCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">${price}</p>
    </div>
  );
}
```

### Adding a New API Route

```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

### Working with the Database

```bash
# Open Prisma Studio to view/edit data
npx prisma studio

# Make changes to schema
# Edit: prisma/schema.prisma

# Create migration
npx prisma migrate dev --name add_new_field

# Apply migrations
npx prisma migrate deploy
```

## 🐛 Quick Troubleshooting

### Port 3000 in use
```bash
# Use different port
PORT=3001 npm run dev
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Regenerate types
npx prisma generate
npm run type-check
```

### Build failing
```bash
# Clean and rebuild
rm -rf .next
npm run build
```

## 📚 Next Steps

1. **[Complete Setup](../developer-guides/SETUP.md)** - Full development environment setup
2. **[Architecture Overview](../architecture/SYSTEM_OVERVIEW.md)** - Understand the system
3. **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute
4. **[Component Library](../components/README.md)** - Available components
5. **[API Documentation](../api/README.md)** - API reference

## 🆘 Need Help?

- **Documentation**: Check [docs/README.md](../README.md)
- **Common Errors**: See [Troubleshooting](../troubleshooting/COMMON_ERRORS.md)
- **Slack**: #development channel
- **Issues**: [GitHub Issues](https://github.com/pgclosets/store/issues)

## 💡 Pro Tips

- Use `cmd/ctrl + click` on imports to navigate to files in VS Code
- Install recommended VS Code extensions for best experience
- Run `npm run quality` before committing
- Use Prisma Studio for database debugging
- Check Network tab in browser DevTools for API issues

---

**Ready to dive deeper?** See our [Complete Setup Guide](../developer-guides/SETUP.md) for detailed instructions.
