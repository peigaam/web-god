# web-god

Web development intelligence layer: 15 specialized agents, 9 orchestrator skills,
deterministic tools, and production React hook examples.

## Structure
- agents/ — Claude Code agents (YAML frontmatter + markdown), organized by domain
- skills/ — Orchestrator skills (SKILL.md + references/ + scripts/)
- tools/ — Standalone CLI scripts (Node.js, bash)
- examples/react-hooks/ — SSR-safe React hooks for common patterns
- hooks/git/ — Pre-configured git hooks (Husky-compatible)
- templates/ — Config scaffolds and prompt templates
- docs/ — Agent invocation guide and contributor docs

## Agent Tiers
- **Core Pipeline Agents** (9): Scrollytelling (5) + Frontend (3) + Backend (1)
  → Full orchestrated pipelines with multi-agent chaining
- **Reference Wrapper Agents** (6): Performance, Security, SEO, Testing, DevOps, Design System
  → Expert knowledge auto-activated by Claude Code, backed by deep reference docs

## Conventions
- Agent frontmatter fields: name, description, tools, model
- Skills reference agents by their `name:` field
- All React hooks use 'use client' and handle SSR hydration
- Tools are framework-agnostic (auto-detect Next.js, Vite, Remix)

## See Also
- docs/AGENT_GUIDE.md — Invocation prompts for every agent
- docs/ADDING_A_DOMAIN.md — How to add a new domain to web-god
