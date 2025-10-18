# Architecture Decision Records (ADRs)

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

## Why ADRs?

- Document **why** decisions were made
- Provide context for future developers
- Track architectural evolution
- Prevent revisiting settled decisions
- Enable knowledge transfer

## When to Create an ADR?

Create an ADR when making decisions about:

- Architecture patterns (e.g., monolith vs microservices)
- Technology choices (e.g., database, framework)
- API design approaches
- Authentication/authorization strategies
- State management solutions
- Testing strategies
- Deployment approaches
- Performance optimization strategies

## ADR Template

```markdown
# [Number]. [Title]

**Status**: [Proposed | Accepted | Deprecated | Superseded]
**Date**: YYYY-MM-DD
**Deciders**: [List of people involved]
**Tags**: [technology, pattern, architecture]

## Context

What is the issue we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

### Positive

- What becomes easier or better?

### Negative

- What becomes harder or worse?

### Neutral

- What changes but is neither better nor worse?

## Alternatives Considered

### Alternative 1: [Name]
- Pros:
- Cons:
- Why not chosen:

## References

- Links to relevant documentation, discussions, or resources
```

## Existing ADRs

1. [ADR-001: Next.js 15 with App Router](./001-nextjs-app-router.md)
2. [ADR-002: Tailwind CSS for Styling](./002-tailwind-css.md)
3. [ADR-003: TypeScript Strict Mode](./003-typescript-strict.md)
4. [ADR-004: Supabase for Backend](./004-supabase-backend.md)

## Process

1. Copy the template above
2. Create a new file: `NNN-short-title.md`
3. Fill in all sections
4. Submit as part of PR
5. Get team approval
6. Merge with code changes

---

*Maintained by: PG Closets Development Team*
