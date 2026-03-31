---
name: frontend
description: >
  End-to-end frontend architecture and implementation skill. Orchestrates frontend-architect,
  frontend-component-designer, and design-system-architect. Use when "build a web app", "design a
  frontend", "structure a React/Next.js project", "create a component library".
---

# Frontend Architecture Skill

Orchestrate production-grade frontend application design and validation.

## Pipeline

| Step | Agent | Produces |
|---|---|---|
| 1 | Frontend Architect | Architecture Decision Record (ADR) |
| 2 | Component Designer | Component specs + prop interfaces |
| 3 | Builder (you) | Implementation code |
| 4 | Validation | Build + lint + a11y audit |

## Step 1: Architecture
Invoke `frontend-architect`. Review: directory structure follows Component Boundary Rule, state management per type, route architecture with rendering strategies, error boundaries, performance decisions, technology rationale.

**Human checkpoint:** Present ADR for approval.

## Step 2: Component Design
Invoke `frontend-component-designer` per feature module and shared component. Review: clear types, prop minimality, accessibility contracts, composition patterns.

## Step 3: Implementation
Order: scaffold → foundation (providers, layouts, error boundaries) → UI primitives → features → routes → polish (loading/error/empty states).

Principles: TypeScript strict, co-located tests, Server Components by default, next/image + next/font, Server Actions over API routes, Suspense with meaningful fallbacks.

## Step 4: Validation
```bash
npx tsc --noEmit && npm run lint && npm run build
```
