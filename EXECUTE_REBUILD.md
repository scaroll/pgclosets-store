# Execute Complete Website Rebuild

## Quick Start

Copy and paste this prompt to Claude Code to execute the complete rebuild:

---

**PROMPT FOR CLAUDE CODE:**

I need you to execute a complete website rebuild for PG Closets using token-efficient sub-agents working in parallel.

**Context**:
- AI SDK 5 is already deployed to https://pgclosets.com but has 125+ issues
- Full requirements and specifications are in `/Users/spencercarroll/pgclosets-store-main/COMPLETE_REBUILD_PROMPT.md`
- Execute in 3 phases to avoid token limits

**Instructions**:
1. Read the complete rebuild prompt: `@COMPLETE_REBUILD_PROMPT.md`
2. Execute Phase 1 (Foundation) using 2 sub-agents in parallel
3. After Phase 1 completes, execute Phase 2 (Core Features) using 3 sub-agents in parallel
4. After Phase 2 completes, execute Phase 3 (Operations & Polish) using 3 sub-agents in parallel
5. After all phases complete, run the deployment checklist

**Phase 1 - Foundation (Launch Now)**:

Launch these 2 sub-agents in parallel:

**Sub-Agent 1: Database Architecture & Prisma Schema**
- Read requirements from COMPLETE_REBUILD_PROMPT.md sections for Sub-Agent 1
- Create complete Prisma schema with all models (products, orders, bookings, users, cart, etc.)
- Add pgvector extension for embeddings
- Create initial migration
- Create seed data
- Deliverables: prisma/schema.prisma, seed.ts, migration files, DATABASE_SETUP.md

**Sub-Agent 2: Security & Authentication System**
- Read requirements from COMPLETE_REBUILD_PROMPT.md sections for Sub-Agent 2
- Implement NextAuth.js v5 with credentials + magic link
- Implement rate limiting with Redis (Upstash)
- Add comprehensive input validation (Zod schemas)
- Add security headers and CSRF protection
- Deliverables: auth.ts, middleware.ts, lib/rate-limit.ts, lib/validation/, SECURITY_GUIDE.md

Use the Task tool with appropriate sub-agent types (fullstack-developer, etc.) and provide the complete context from COMPLETE_REBUILD_PROMPT.md to each sub-agent.

After Phase 1 completes successfully, I'll tell you to proceed with Phase 2.

---

## Alternative: Phase-by-Phase Manual Execution

If you prefer to control the pace, execute each phase manually:

### Phase 1: Foundation

```
I need to execute Phase 1 of the PG Closets website rebuild.

Read the specifications from @COMPLETE_REBUILD_PROMPT.md

Launch 2 sub-agents in parallel:

1. **Database Architecture** (fullstack-developer)
   - Task: Complete Prisma schema with all e-commerce, booking, and AI models
   - Include: pgvector for embeddings, proper indexes, seed data
   - Deliverable: Working database with migrations

2. **Security & Authentication** (fullstack-developer)
   - Task: NextAuth.js v5 + rate limiting + input validation
   - Include: Redis-backed rate limiter, Zod schemas, security headers
   - Deliverable: Complete auth system with protected routes

Wait for both to complete, then validate:
- [ ] Database schema complete and migrated
- [ ] Authentication working (signup, login, logout)
- [ ] Rate limiting functional on test endpoint
- [ ] Security headers verified

Tell me when Phase 1 is complete and validated.
```

### Phase 2: Core Features

```
Phase 1 is complete. Now execute Phase 2.

Read the specifications from @COMPLETE_REBUILD_PROMPT.md

Launch 3 sub-agents in parallel:

1. **E-Commerce Core** (fullstack-developer)
   - Task: Product catalog, shopping cart, Stripe checkout
   - Include: Product pages, cart API, order management
   - Deliverable: Working e-commerce flow from browse to purchase

2. **Booking System** (fullstack-developer)
   - Task: Calendar UI, availability logic, booking management
   - Include: Conflict prevention, email confirmations, admin interface
   - Deliverable: Working booking system with calendar

3. **AI System Hardening** (llm-application-dev:ai-engineer)
   - Task: Fix all 20 critical issues from audit report
   - Include: Database integration, rate limiting, type safety, performance
   - Deliverable: Production-ready AI system

Wait for all to complete, then validate:
- [ ] Can browse products and add to cart
- [ ] Can complete Stripe checkout (test mode)
- [ ] Can book appointment without conflicts
- [ ] AI chat uses real database (no mock data)
- [ ] All critical issues resolved

Tell me when Phase 2 is complete and validated.
```

### Phase 3: Operations & Polish

```
Phase 2 is complete. Now execute Phase 3 (final phase).

Read the specifications from @COMPLETE_REBUILD_PROMPT.md

Launch 3 sub-agents in parallel:

1. **Admin Dashboard** (fullstack-developer)
   - Task: Admin interface for products, orders, bookings, content
   - Include: Metrics dashboard, CRUD operations, bulk actions
   - Deliverable: Complete admin system

2. **Email & Notifications** (fullstack-developer)
   - Task: Email system with React Email templates
   - Include: Order confirmations, booking reminders, welcome emails
   - Deliverable: Working email notifications

3. **Frontend Polish** (frontend-developer)
   - Task: Apple-inspired design, mobile optimization, performance
   - Include: Component library, image optimization, SEO
   - Deliverable: Lighthouse 95+ performance score

Wait for all to complete, then validate:
- [ ] Admin can manage products, orders, bookings
- [ ] Emails send correctly (test in Resend)
- [ ] Site looks polished on mobile and desktop
- [ ] Lighthouse score 95+ performance
- [ ] All pages SEO optimized

Tell me when Phase 3 is complete and validated.
```

### Final: Deployment

```
All phases complete. Execute deployment checklist.

1. Run full test suite: `npm run test`
2. Run type check: `npm run type-check`
3. Run build: `npm run build`
4. Verify no console errors
5. Review deployment checklist in @COMPLETE_REBUILD_PROMPT.md
6. Deploy to Vercel: `vercel --prod`
7. Run post-deployment verification
8. Monitor for errors

Report deployment status and any issues found.
```

---

## Super Efficient Single-Command Version

If you want everything done in one prompt (use with caution, may hit token limits):

```
Execute complete website rebuild for PG Closets using 8 parallel sub-agents.

Full specifications: @COMPLETE_REBUILD_PROMPT.md

Launch all 8 sub-agents in parallel RIGHT NOW:

1. Database Architecture (fullstack-developer)
2. Security & Authentication (fullstack-developer)
3. E-Commerce Core (fullstack-developer)
4. Booking System (fullstack-developer)
5. Admin Dashboard (fullstack-developer)
6. Email & Notifications (fullstack-developer)
7. AI System Hardening (llm-application-dev:ai-engineer)
8. Frontend Polish (frontend-developer)

Each sub-agent should:
- Read their requirements from COMPLETE_REBUILD_PROMPT.md
- Implement all deliverables
- Create all necessary files
- Write tests
- Generate documentation

After all sub-agents complete:
- Run integration tests
- Fix any conflicts between sub-agents
- Run deployment checklist
- Deploy to production

Report progress and completion status for each sub-agent.
```

---

## Tips for Best Results

1. **Start with Phase 1**: Don't skip the foundation. Database and auth are critical.

2. **Validate Between Phases**: Test thoroughly before moving to next phase.

3. **Monitor Token Usage**: If approaching limit, pause and continue in new conversation.

4. **Save Progress**: Commit after each phase completes successfully.

5. **Use Specific Sub-Agent Types**:
   - `fullstack-developer` for full-stack work
   - `llm-application-dev:ai-engineer` for AI-specific tasks
   - `frontend-developer` for UI/UX work

6. **Provide Context**: Always reference `@COMPLETE_REBUILD_PROMPT.md` so sub-agents have full context.

7. **Test Incrementally**: Don't wait until the end to test. Test after each phase.

8. **Document Issues**: If a sub-agent encounters issues, document them for the next iteration.

---

## What to Expect

**Timeline**:
- Phase 1: 2-4 hours (2 sub-agents)
- Phase 2: 4-6 hours (3 sub-agents)
- Phase 3: 3-5 hours (3 sub-agents)
- Testing & Deployment: 2-3 hours
- **Total: 11-18 hours** with proper validation

**Files Created**: 100+ files across:
- Database schema and migrations
- Authentication system
- E-commerce pages and APIs
- Booking system
- Admin dashboard
- Email templates
- Component library
- Tests
- Documentation

**Database Changes**:
- 20+ tables created
- Seed data populated
- pgvector extension installed
- All indexes created

**Deployment**:
- Environment variables configured
- Database migrated on production
- Stripe webhooks configured
- Email service configured
- Site live and functional

---

## Success Criteria

When complete, you should have:
- ✅ Fully functional e-commerce site
- ✅ Working booking system
- ✅ Admin dashboard
- ✅ AI chat with 11 tools (hardened)
- ✅ Email notifications
- ✅ Mobile-responsive design
- ✅ Lighthouse 95+ performance
- ✅ All 125 audit issues resolved
- ✅ Zero TypeScript errors
- ✅ 85%+ test coverage
- ✅ Production-ready security

---

**Ready to execute? Copy the prompt above and start with Phase 1!**
