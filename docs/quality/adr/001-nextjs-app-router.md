# ADR-001: Next.js 15 with App Router

**Status**: Accepted
**Date**: 2024-10-01  
**Deciders**: Development Team
**Tags**: framework, architecture, frontend

## Context

We needed to choose a modern React framework for the PG Closets website that would provide:
- Excellent performance (Core Web Vitals)
- SEO capabilities
- Modern development experience
- Strong ecosystem
- Production-ready stability

## Decision

We will use Next.js 15 with the App Router architecture for the following reasons:

1. **Performance**: Built-in optimizations (image optimization, code splitting, RSC)
2. **SEO**: Server-side rendering and static generation
3. **Developer Experience**: Hot reload, TypeScript support, file-based routing
4. **Ecosystem**: Large community, extensive plugins, Vercel deployment
5. **Modern Features**: React Server Components, Server Actions, Streaming

## Consequences

### Positive

- Automatic code splitting reduces bundle sizes
- Built-in image optimization improves page load times
- Server Components reduce JavaScript sent to client
- File-based routing simplifies navigation logic
- Strong TypeScript integration improves type safety
- Excellent documentation and community support

### Negative

- App Router is newer, some packages may not be fully compatible
- Learning curve for team members new to React Server Components
- Some advanced patterns require understanding of client/server boundaries
- Build times can be longer for large applications

### Neutral

- Requires Vercel or Node.js hosting (vs static hosting)
- Opinionated structure (can be pro or con)

## Alternatives Considered

### Alternative 1: Remix
- **Pros**: Excellent data loading, progressive enhancement, nested routing
- **Cons**: Smaller ecosystem, fewer examples, less mature
- **Why not chosen**: Next.js has larger ecosystem and better image optimization

### Alternative 2: Create React App
- **Pros**: Simple, no framework overhead, flexible
- **Cons**: No SSR, manual optimization needed, no built-in routing
- **Why not chosen**: Lacks SEO and performance features we need

### Alternative 3: Gatsby
- **Pros**: Great for static sites, plugin ecosystem
- **Cons**: Build times, complexity for dynamic content
- **Why not chosen**: Too focused on static sites, slower builds

## Implementation Notes

- Use App Router (`app/` directory) for all new routes
- Leverage Server Components by default
- Use Client Components (`'use client'`) only when needed for interactivity
- Implement proper loading and error states
- Use Suspense boundaries for streaming

## References

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [App Router Documentation](https://nextjs.org/docs/app)
- [React Server Components](https://nextjs.org/docs/getting-started/react-essentials)
