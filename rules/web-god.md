# web-god — Web Development Intelligence Layer

You have access to 15 specialized web development agents and 9 orchestrator skills
installed via web-god. Use them proactively based on what the user is building.

## Available Agents (auto-activate based on context)

### Always Relevant (any web project)
- `frontend-architect` — component structure, state management, rendering strategy, ADRs
- `frontend-builder` — implementation patterns, data fetching, Server Components, build order
- `security-threat-modeler` — STRIDE analysis, OWASP 2025, auth review, Next.js CVEs
- `performance-profiler` — Core Web Vitals, bundle optimization, image/font strategy
- `test-architect` — Testing Diamond model, integration-first, coverage standards
- `devops-deploy-planner` — CI/CD pipelines, Docker, environments, monitoring

### Scrollytelling / Narrative Sites
- Full 5-agent pipeline via `scrollytelling` skill:
  `scrollytelling-director` → `scrollytelling-choreographer` → `scrollytelling-typographer` → `scrollytelling-compositor` → `scrollytelling-auditor`
- Stack: GSAP ScrollTrigger + Lenis smooth scroll
- Grounded in cognitive science (Duarte sparkline, Gestalt principles, attention bottleneck)

### Component Libraries / Design Systems
- `design-system-architect` — 3-tier tokens (primitive → semantic → component), dark mode, DTCG format
- `frontend-component-designer` — prop interfaces, composition patterns, a11y contracts

### API / Backend
- `backend-api-architect` — REST design, database schema, auth flows, error handling, middleware

### Content / Marketing
- `seo-auditor` — meta tags, JSON-LD structured data, sitemap, Open Graph, Core Web Vitals

## Quick Invocation Prompts
```
"Review the architecture of this project"           → frontend-architect
"Audit this for security vulnerabilities"            → security-threat-modeler
"Optimize the performance"                           → performance-profiler
"Design a testing strategy"                          → test-architect
"Set up CI/CD"                                       → devops-deploy-planner
"Build a scrollytelling page for [brief]"            → scrollytelling skill (full pipeline)
"Create a design token system"                       → design-system-architect
"Design the API for [feature]"                       → backend-api-architect
```

## Agent Tiers
- **Core Pipeline** (9): Full multi-agent orchestration — Scrollytelling (5), Frontend (3), Backend (1)
- **Reference Expert** (6): Deep knowledge with auto-activation — Security, Performance, SEO, Testing, DevOps, Design System

## Companion Skills
Each domain has a skill (invoke with `/webgod-[domain]`) backed by a comprehensive reference doc.
Skills run in isolated contexts via `context: fork` — they don't pollute your main conversation.

## Tools (run standalone, no AI needed)
- `node tools/dom-auditor/index.js <url>` — spatial audit across 3 viewports
- `bash tools/build-gate/gate.sh <dir>` — build integrity gate
