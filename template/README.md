# PG Closets E-Commerce Template

A modern, type-safe e-commerce template built with Next.js 15, TypeScript, and Tailwind CSS.

## Project Structure

```
├── app/                       # Next.js App Router directory
│   ├── (marketing)/          # Marketing routes group (public facing pages)
│   ├── (shop)/              # Shop routes group (product catalog, cart, etc.)
│   ├── (account)/           # Account routes group (user dashboard, orders)
│   ├── api/                 # API route handlers
│   └── layout.tsx           # Root layout component
├── components/              # React components
│   ├── cart/               # Shopping cart related components
│   ├── layout/             # Layout components (header, footer)
│   ├── products/          # Product related components
│   ├── shared/            # Shared/common components
│   └── ui/                # UI component library
├── lib/                    # Utility functions and shared code
│   ├── api/               # API client and helpers
│   ├── hooks/             # Custom React hooks
│   └── utils.ts           # Utility functions
├── public/                 # Static assets
│   ├── fonts/             # Web fonts
│   └── images/            # Static images
├── styles/                # Global styles and Tailwind config
├── types/                 # TypeScript type definitions
└── package.json           # Project dependencies and scripts
```

## Features

- Next.js 15 App Router
- TypeScript with strict mode
- Tailwind CSS for styling
- Responsive design
- Dark mode support
- Shopping cart functionality
- Product catalog
- User authentication
- Order management
- Admin dashboard
- SEO optimized
- Performance optimized
- Accessibility compliant
- E2E tests with Playwright
- Unit tests with Jest
- ESLint and Prettier configured

## Getting Started

1. Clone this template
2. Install dependencies: \`npm install\`
3. Run development server: \`npm run dev\`
4. Open [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build production bundle
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript checks
- \`npm test\` - Run tests
- \`npm run e2e\` - Run E2E tests
- \`npm run analyze\` - Analyze bundle size

### Environment Variables

Create a \`.env.local\` file with:

\`\`\`
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://...
MEDUSA_BACKEND_URL=http://localhost:9000
\`\`\`

### Deployment

The template is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT