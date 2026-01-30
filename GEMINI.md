# PG Closets Website - Project Context

## Project Overview

**PG Closets** is a premium e-commerce and corporate website for a custom closet and door business in Ottawa. The project is built using a modern React stack, emphasizing high performance, accessibility, and a premium "Apple-inspired" design aesthetic.

### Tech Stack
*   **Framework:** Next.js 15 (App Router)
*   **UI Library:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Shadcn UI
*   **Animations:** Framer Motion, GSAP
*   **Database:** PostgreSQL, Prisma ORM
*   **State Management:** Zustand
*   **Testing:** Vitest (Unit), Playwright (E2E)
*   **Deployment:** Vercel

## Key Directories

*   `app/`: Next.js App Router pages and layouts.
*   `components/`: Reusable UI components.
    *   `components/ui/`: Base UI components (Shadcn).
    *   `components/layout/`: Header, Footer, etc.
*   `lib/`: Utility functions, database clients, and configuration.
*   `public/`: Static assets (images, fonts).
*   `scripts/`: Automation scripts for deployment, audits, and maintenance.
*   `prisma/`: Database schema and seed scripts.
*   `styles/`: Global CSS and style configurations.

## Development Workflow

### Key Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server. |
| `npm run lint` | Runs ESLint to check for code quality issues. |
| `npm run type-check` | Runs TypeScript type checking. |
| `npm run test` | Runs unit tests using Vitest. |
| `npm run db:migrate` | Runs Prisma migrations. |
| `npm run db:studio` | Opens Prisma Studio to view database content. |

### Design System
The project follows a strict design system defined in `tailwind.config.ts` and `lib/design-tokens.ts`.
*   **Colors:** "Apple-inspired" palette (Navy, Gold, Forest tones) alongside standard Apple grays and blues.
*   **Typography:** Uses `Inter` font with a custom scaling system (`text-apple-*`).
*   **Spacing:** 8px grid system.
*   **Components:** Built on top of Shadcn UI but heavily customized to match the brand's premium aesthetic.

### Configuration
*   **TypeScript:** Configured in `tsconfig.json`. Note that `strict` mode is currently set to `false`, allowing for looser type checking during rapid development, though specific checks like `noUnusedLocals` are enabled.
*   **Tailwind:** Extensive customization in `tailwind.config.ts`, including specific breakpoints (`mobile`, `tablet`, `desktop`) and custom utility classes.

## Deployment
Deployment is handled via Vercel. There are several scripts in `package.json` dedicated to deployment verification and quality assurance (`verify:prod`, `deploy:prod`).
