# web-god

**All-in-one web development intelligence layer.** Specialized AI agents, orchestrator skills, deterministic tools, and reusable hooks that make Claude Code dramatically better at web development.

Not a framework. Not a boilerplate. A *knowledge layer* that gives your AI coding assistant domain-specific expertise, structured workflows, and deterministic validation.

---

## Prerequisites

- **Node.js 18+** (for CLI tools and dom-auditor)
- **Claude Code** (recommended — agents auto-activate via description matching)
- **Playwright** (optional — required for dom-auditor and scrollytelling test suites)

## Quick Start

```bash
git clone https://github.com/inspectre/web-god.git
cd web-god && bash install.sh
```

This copies agents to `~/.claude/agents/` and skills to `~/.claude/skills/`. Agents auto-activate when Claude Code detects matching prompts.

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
| **Design System** | token-architect | `design-system` | Token hierarchy, spacing scale, dark mode strategy |

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
