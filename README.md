# web-god

**Drop-in web development intelligence for Claude Code.** Clone into any project —
scrollytelling sites, web3 dashboards, SaaS apps, marketing pages — and get
specialized AI agents that activate automatically based on what you're building.

## What You Get

**15 specialized agents** organized by what you're building:

| Building... | Agents That Activate | Depth |
|---|---|---|
| Any web project | Security, Performance, Testing, DevOps | Reference Expert |
| Scrollytelling / narrative site | Director, Choreographer, Typographer, Compositor, Auditor | Full Pipeline (unique) |
| Frontend app (React/Next.js) | Architect, Component Designer, Builder | Full Pipeline |
| API / backend | API Architect | Reference Expert |
| Component library | Design System Architect, Component Designer | Reference Expert |
| Content / marketing site | SEO Auditor, Frontend Architect | Reference Expert |

**Plus:** 9 orchestrator skills, deep reference docs per domain, a DOM spatial
auditor, a build integrity gate, Playwright test templates, SSR-safe React hooks,
and git hooks.

## Install

```bash
# Clone anywhere (not INTO your project — web-god installs globally)
git clone https://github.com/inspectre/web-god.git
cd web-god && bash install.sh
```

This installs agents, skills, and a global rule to `~/.claude/`. They activate
automatically in EVERY project you open with Claude Code. Your existing project
CLAUDE.md files are never touched.

No per-project configuration needed. Open Claude Code in any project and go.

## What Makes This Different

The scrollytelling pipeline is the crown jewel — 5 agents grounded in cognitive
science (Duarte's Resonate methodology, Gestalt principles, attention bottleneck
research) producing Awwwards-grade scroll-driven experiences. No comparable system
exists in the 63,000+ agent skill ecosystem.

The other domains (security, performance, testing, etc.) are honest reference
experts — deep knowledge bases with auto-activating agent wrappers. They're not
full pipelines, but they encode real expertise that makes Claude Code significantly
better at web development tasks.

Compatible with the [Agent Skills open standard](https://agentskills.io).
Works with Claude Code, Codex CLI, Gemini CLI, and other compatible tools.

## Prerequisites

- **Node.js 18+** (for CLI tools and dom-auditor)
- **Playwright** (optional — required for dom-auditor and scrollytelling test suites)

## Architecture

```
web-god/
├── agents/              # 15 specialized AI agents (Claude Code format)
├── skills/              # 9 orchestrator skills that chain agents into pipelines
├── tools/               # Standalone CLI scripts — run without AI
├── examples/react-hooks/# SSR-safe React hooks for common patterns
├── hooks/git/           # Pre-configured git hooks (Husky-compatible)
├── templates/           # Prompt templates and config scaffolds
├── docs/                # Agent invocation guide and contributor docs
└── research/            # Design rationale and theoretical foundations
```

## Agent Tiers

### Core Pipeline Agents (9 agents)

Full orchestrated pipelines with multi-agent chaining. These agents produce distinct artifacts that feed into the next agent.

| Domain | Agents | Skill | Pipeline |
|--------|--------|-------|----------|
| **Scrollytelling** | director, choreographer, typographer, compositor, auditor | `scrollytelling` | Brief → Storyboard → Animation spec → Type system → Composition → Validation |
| **Frontend** | architect, component-designer, builder | `frontend` | ADR → Component specs → Implementation |
| **Backend** | api-architect | `backend` | API spec + DB schema + Auth design → Implementation |

### Reference Wrapper Agents (6 agents)

Expert knowledge auto-activated by Claude Code, backed by deep reference docs. These agents wrap domain expertise into a structured audit or design workflow.

| Domain | Agent | Skill | Reference Doc |
|--------|-------|-------|---------------|
| **Performance** | profiler | `performance` | Core Web Vitals, bundle optimization, GPU-safe properties |
| **Security** | threat-modeler | `security` | STRIDE framework, OWASP Top 10, auth patterns |
| **SEO** | seo-auditor | `seo` | Structured data, meta tags, crawlability |
| **Testing** | test-architect | `testing` | Testing Diamond, coverage standards, flaky test protocol |
| **DevOps** | deploy-planner | `devops` | 12-factor app, CI/CD pipeline design, migration safety |
| **Design System** | design-system-architect | `design-system` | Token hierarchy, spacing scale, dark mode strategy |

## Standalone Tools

| Tool | Usage | What It Does |
|------|-------|-------------|
| **DOM Auditor** | `node tools/dom-auditor/index.js [url]` | Playwright-based spatial checks: overflow, contrast, touch targets, small text across 3 viewports |
| **Build Gate** | `bash tools/build-gate/gate.sh [dir]` | Build integrity: orphan imports, kill list, TypeScript check, framework build, DOM audit |
| **Playwright Test Templates** | Copy from `tools/testing/` | Scroll performance (60fps), visual regression, accessibility test suites for scrollytelling |

## Using the Agents

Once installed, agents activate automatically based on your prompts:

```
# Triggers the scrollytelling skill (full 5-agent pipeline)
"Build a scroll-driven landing page for our product"

# Triggers the frontend skill (architect → designer → builder)
"Design and build a dashboard for our analytics platform"

# Triggers the security agent (STRIDE threat model)
"Review this API for security vulnerabilities"

# Triggers the performance agent (CWV audit)
"Optimize the performance of this Next.js app"
```

For detailed invocation prompts and manual chaining patterns, see **[docs/AGENT_GUIDE.md](docs/AGENT_GUIDE.md)**.

## React Hook Examples

SSR-safe React hooks in `examples/react-hooks/`. Copy what you need into your project.

| Hook | Description |
|------|-------------|
| useScrollProgress | Track scroll progress 0→1 in viewport or container |
| useMediaQuery | Reactive CSS media query matching |
| useTheme | Light/dark theme with system preference + persistence |
| useDebounce | Debounce a value by delay |
| useIntersectionObserver | Observe element intersection with viewport |
| useKeyboardShortcut | Register keyboard shortcuts with modifier support |
| useLocalStorage | useState backed by localStorage |
| useCopyToClipboard | Copy text with success/error feedback |
| useReducedMotion | Detect prefers-reduced-motion |
| useLockBodyScroll | Lock body scroll for modals |

For production hook libraries, see [usehooks-ts](https://usehooks-ts.com/), [Mantine hooks](https://mantine.dev/hooks/), or [react-use](https://github.com/streamich/react-use).

## Design Principles

1. **Modular independence.** Each domain works standalone.
2. **Deterministic where possible.** Tools produce pass/fail results with zero ambiguity.
3. **Cognitive science grounding.** Scrollytelling agents use perceptual psychology.
4. **Progressive disclosure.** Skills start simple and escalate complexity as needed.
5. **Healing loops.** When validation fails, the system diagnoses and proposes fixes automatically.

## Contributing

See [docs/ADDING_A_DOMAIN.md](docs/ADDING_A_DOMAIN.md) for how to add a new domain.

## License

[MIT](LICENSE)
