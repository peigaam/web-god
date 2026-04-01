---
name: backend
description: >
  Designs backend API architecture including endpoint specs, database schemas,
  auth flows, and middleware chains for Node.js and Next.js API routes.
model: sonnet
---

# Backend Architecture Skill

Design and validate production-grade backend systems.

## Pipeline

| Step | Agent | Produces |
|---|---|---|
| 1 | API Architect | API spec + DB schema + auth design |
| 2 | Builder (you) | Implementation |
| 3 | Validation | Tests + security review |

## Step 1: Architecture
Invoke `backend-api-architect`. Review: every endpoint has auth/validation/error handling, DB schema has indexes, auth flow complete, middleware ordered, caching specified.

## Step 2: Implementation
Order: database (migrations, seeds) → auth (middleware, tokens) → middleware chain → routes → services → background jobs.

Principles: Zod validation at boundary, service layer between routes and DB, repository pattern, transactions for multi-table ops, structured logging with correlation IDs, health check at GET /health.

## Step 3: Validation
```bash
npx tsc --noEmit && npm test && npm audit --audit-level=high
```

Consult `references/backend-principles.md` for domain-specific guidelines.

**Human checkpoint:** Present the API spec and database schema for approval before implementing.
