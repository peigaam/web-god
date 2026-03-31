# web-god

**All-in-one web development intelligence layer.** Skills, agents, tools, and hooks for S-tier frontend, backend, performance, security, SEO, testing, and deployment — designed for Claude Code but portable to any AI-assisted workflow.

---

## What This Is

`web-god` is a modular toolkit of AI agents, orchestrator skills, deterministic tools, and reusable hooks that encode hard-won best practices across every layer of modern web development. Each module is independently usable but they compose into full production pipelines.

**Not a framework. Not a boilerplate.** This is a *knowledge layer* — it makes your AI coding assistant (Claude Code, Cursor, etc.) dramatically better at web development by giving it domain-specific expertise, deterministic validation tools, and structured workflows.

## Architecture

```
web-god/
├── agents/          # Specialized AI agents (Claude Code agent format)
├── skills/          # Orchestrator skills that chain agents into pipelines  
├── tools/           # Standalone scripts — run without AI
├── hooks/           # Reusable patterns (React hooks, git hooks, CI hooks)
├── templates/       # Prompt templates, config scaffolds, project starters
├── research/        # Theoretical foundations and design rationale
└── docs/            # Usage guides and API reference
```

## Domains

| Domain | Agents | Skill | Tools | Status |
|--------|--------|-------|-------|--------|
| **Frontend Architecture** | architect, component-designer | `frontend` | dom-auditor | ✅ |
| **Backend Architecture** | api-architect | `backend` | api-validator | ✅ |
| **Scrollytelling** | director, choreographer, typographer, compositor, auditor | `scrollytelling` | dom-auditor, screenshot | ✅ |
| **Performance** | profiler | `performance` | lighthouse-runner, bundle-analyzer | ✅ |
| **Security** | threat-modeler | `security` | security-scanner | ✅ |
| **SEO & Meta** | seo-auditor | `seo` | meta-validator | ✅ |
| **Testing** | test-architect | `testing` | visual-regression, a11y-scanner | ✅ |
| **DevOps** | deploy-planner | `devops` | build-gate | ✅ |
| **Design System** | token-architect | `design-system` | token-validator | ✅ |

## Quick Start

### Install for Claude Code

```bash
git clone https://github.com/yourusername/web-god.git
cd web-god && bash install.sh
```

This copies agents to `~/.claude/agents/` and skills to `~/.claude/skills/`.

### Use with Claude Code

Once installed, agents and skills activate automatically based on your prompts:

```
# Triggers the frontend skill
"Build a component library with proper design tokens"

# Triggers the scrollytelling skill  
"Create a scroll-driven landing page for our product"

# Triggers the performance skill
"Audit and optimize the performance of this Next.js app"

# Triggers the security skill
"Review this API for security vulnerabilities"

# Triggers the backend skill
"Design a REST API for a multi-tenant SaaS platform"
```

### Standalone CLI Tools

```bash
# Run the DOM auditor on any site
node tools/dom-auditor/index.js http://localhost:3000

# Run the build gate
bash tools/build-gate/gate.sh /path/to/project
```

## Agent Format

Each agent is a Markdown file with YAML frontmatter compatible with Claude Code:

```yaml
---
name: agent-name
description: >
  When to invoke this agent. Claude Code uses this to decide automatic activation.
tools:
  - Read
  - Write
  - Bash
model: sonnet  # or opus for high-reasoning tasks
---

# Agent Title
Instructions, constraints, I/O format, chaining rules.
```

## Skill Format

Each skill is a directory containing a `SKILL.md` orchestrator plus supporting files:

```
skills/domain-name/
├── SKILL.md                    # Main orchestrator
├── references/                 # Shared knowledge base
│   └── principles.md
└── scripts/                    # Deterministic validators
    └── evaluator.py
```

## Design Principles

1. **Modular independence.** Each domain works standalone.
2. **Deterministic where possible.** Tools produce pass/fail results with zero ambiguity.
3. **Cognitive science grounding.** Frontend and scrollytelling modules use perceptual psychology.
4. **Progressive disclosure.** Skills start simple and escalate complexity as needed.
5. **Healing loops.** When validation fails, the system diagnoses and proposes fixes automatically.

## License

MIT