# PG Closets - Claude Code Configuration

## Quick Reference

### Essential Commands

```bash
# Development
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Production build
pnpm type-check       # TypeScript check
pnpm lint             # ESLint check
pnpm test             # Run tests

# PM2 Process Management
pnpm pm2:start        # Start all services
pnpm pm2:stop         # Stop all services
pnpm pm2:logs         # View logs
pnpm pm2:status       # Check status

# Quality
pnpm quality          # Run all checks
pnpm quality:fix      # Auto-fix issues
```

### Key File Locations

| Purpose | Path |
|---------|------|
| Quote types | `types/quote.ts` |
| Quote builder | `app/quote-builder/` |
| Quote APIs | `app/api/quotes/` |
| Admin dashboard | `app/(admin)/admin/` |
| Customer portal | `app/(account)/account/` |
| Email templates | `emails/` |
| Database schema | `prisma/schema.prisma` |
| UI components | `components/ui/` |

---

## Task Management Workflow

### Starting Large Tasks

When exiting plan mode with an accepted plan:

1. **Create Task Directory:**
   ```bash
   mkdir -p dev/active/[task-name]/
   ```

2. **Create Three Documents:**
   - `[task-name]-plan.md` - The accepted plan
   - `[task-name]-context.md` - Key files, decisions, state
   - `[task-name]-tasks.md` - Checklist of work items

3. **Update Regularly:** Mark tasks complete immediately after finishing

Use `/dev-docs` slash command to auto-generate these files.

### Continuing Tasks

1. Check `/dev/active/` for existing task directories
2. Read all three files before proceeding
3. Update "Last Updated" timestamps
4. Add session history entries

Use `/update-dev-docs` before compaction or session end.

---

## Skills System

Skills are auto-activated based on your prompt and file context. Available skills:

| Skill | Triggers |
|-------|----------|
| `quote-system-developer` | Quote, pricing, deposit, order |
| `frontend-dev-guidelines` | Component, page, UI, React |
| `backend-dev-guidelines` | API, route, Prisma, database |
| `admin-dashboard-developer` | Admin, dashboard, reports |
| `email-notification-developer` | Email, notification, template |
| `payment-integration-developer` | Stripe, payment, webhook |

To manually load a skill: Reference it in your prompt or check `.claude/skills/`

---

## Slash Commands

| Command | Purpose |
|---------|---------|
| `/dev-docs` | Create task documentation files |
| `/update-dev-docs` | Update docs before compaction |
| `/build-and-fix` | Run build and fix all errors |
| `/code-review` | Perform architectural code review |
| `/plan-feature` | Create comprehensive feature plan |
| `/deploy-check` | Pre-deployment verification |

---

## Project Architecture

### Quote-Based Sales Flow

```
Customer → Quote Builder → Admin Review → Measurement → Final Quote → Approval → Deposit → Production → Install
```

### Tech Stack

- **Frontend:** Next.js 15, React 19, TailwindCSS, shadcn/ui
- **Backend:** Next.js API Routes, Prisma, PostgreSQL
- **Auth:** NextAuth.js v5
- **Payments:** Stripe
- **Email:** React Email + Resend
- **State:** Zustand (client), Server Components (server)

### Key Patterns

1. **Server Components** by default, Client Components only when needed
2. **Zod validation** for all API inputs
3. **Consistent API responses:** `{ success: boolean, data?: T, error?: string }`
4. **Status logging** for audit trails
5. **Email notifications** on key events

---

## Testing

### Run Tests
```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage
```

### Test Authenticated Routes

Use the quote detail page to test customer-facing features.
Admin features require ADMIN role user.

---

## Environment Variables

Required for full functionality:

```
DATABASE_URL=          # PostgreSQL connection
NEXTAUTH_SECRET=       # Auth encryption key
STRIPE_SECRET_KEY=     # Stripe API key
STRIPE_WEBHOOK_SECRET= # Stripe webhook verification
RESEND_API_KEY=        # Email sending
```

---

## Hooks (Auto-Running)

The following hooks run automatically:

1. **Skill Activator** (UserPromptSubmit) - Suggests relevant skills
2. **File Edit Tracker** (PostToolUse) - Logs file changes
3. **Build Checker** (Stop) - Checks for TypeScript errors
4. **Error Handling Reminder** (Stop) - Reminds about error handling

Configuration: `.claude/settings.json`

---

## Important Rules

1. **Never commit secrets** - Use environment variables
2. **Always validate inputs** - Use Zod schemas
3. **Handle errors properly** - Log and return appropriate status codes
4. **Keep components focused** - Single responsibility
5. **Write TypeScript** - No `any` types without justification
6. **Test your changes** - Run build before committing

---

## Getting Help

- **Slash Commands:** Type `/` to see available commands
- **Skills:** Check `.claude/skills/` for detailed guidelines
- **Templates:** Check `.claude/templates/` for dev doc templates
- **Agents:** Check `.claude/agents/` for specialized agent prompts
