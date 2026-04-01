# WEB-GOD A+ SWEEP — Universal Clone-Ready Toolkit
# Run from: /Users/inspectre/developer/web-god-pkg
# claude -p "$(cat .claude/prompts/a-plus-sweep.md)"
# This is the FINAL engineering pass. After this, ship.

You are executing the A+ engineering sweep on web-god. The goal: make this package
immediately useful when cloned into ANY web project — scrollytelling sites, web3
dashboards, SaaS apps, marketing pages, anything.

The owner's use case: "I build web apps with Claude Code. Sometimes scrollytelling,
sometimes web3 dashboards with zero scrollytelling. I need an all-inclusive repo I can
clone into any project and start using immediately."

This means every domain must be independently useful at clone time, not just the
scrollytelling pipeline.

Read `audit/07-final-verdict.md` and `audit/10-deep-research-intelligence.md` first.

---

## PHASE 1: CLAUDE.md — The Activation Layer (iteration 1)

This is the highest-leverage file in the entire repo. When someone clones web-god into
a project and opens Claude Code, CLAUDE.md determines what happens.

Rewrite `.claude/CLAUDE.md` to be project-type-aware:

```markdown
# web-god — Web Development Intelligence Layer

Drop-in toolkit: 15 specialized agents, 9 skills, reference-grade knowledge bases,
and deterministic tools. Works in any web project.

## How This Works

When you open Claude Code in a project with web-god installed, agents auto-activate
based on what you ask. You don't need to configure anything.

### For ANY web project (always active)
- **Frontend Architect** — component structure, state management, rendering strategy
- **Security Threat Modeler** — STRIDE analysis, auth review, OWASP 2025 compliance
- **Performance Profiler** — Core Web Vitals audit, bundle optimization, image strategy
- **Test Architect** — testing strategy, coverage standards, CI integration
- **DevOps Deploy Planner** — CI/CD, Docker, environment management

### For scrollytelling / narrative sites (activate when relevant)
- **Full 5-agent pipeline**: Director → Choreographer → Typographer → Compositor → Auditor
- Invoke with: "Build a scrollytelling page for [brief]"
- Stack: GSAP ScrollTrigger + Lenis smooth scroll

### For component libraries / design systems
- **Design System Architect** — 3-tier tokens (primitive → semantic → component), dark mode
- **Component Designer** — prop interfaces, composition patterns, a11y contracts

### For content / marketing sites
- **SEO Auditor** — meta tags, JSON-LD structured data, sitemap, Core Web Vitals

### For API-driven apps
- **Backend API Architect** — REST design, database schema, auth flows, error handling

## Quick Start Prompts
```
"Review the architecture of this project"           → Frontend Architect
"Audit this for security vulnerabilities"            → Security Threat Modeler
"Optimize the performance of this app"               → Performance Profiler
"Design a testing strategy for this codebase"        → Test Architect
"Set up CI/CD for this project"                      → DevOps Deploy Planner
"Build a scrollytelling landing page"                → Scrollytelling Pipeline
"Create a design token system"                       → Design System Architect
"Design the API for [feature]"                       → Backend API Architect
"Audit the SEO of this site"                         → SEO Auditor
```

## Agent Tiers
- **Core Pipeline** (9 agents): Scrollytelling (5) + Frontend (3) + Backend (1)
  Full multi-agent orchestration with chained outputs
- **Reference Experts** (6 agents): Security, Performance, SEO, Testing, DevOps, Design System
  Deep knowledge bases with auto-activation — each backed by a comprehensive reference doc

## Tools (run without AI)
- `node tools/dom-auditor/index.js <url>` — 5-check spatial audit across 3 viewports
- `bash tools/build-gate/gate.sh <dir>` — build integrity gate (orphan imports, kill list, build, DOM)

## Structure
- `agents/` — 15 Claude Code agents (YAML frontmatter + markdown)
- `skills/` — 9 orchestrator skills with reference docs
- `examples/react-hooks/` — 10 SSR-safe React hooks (companion code)
- `hooks/git/` — pre-commit, pre-push, commit-msg hooks
- `tools/` — standalone CLI scripts + Playwright test templates
```

This CLAUDE.md does three things the current one doesn't:
1. Shows agents organized BY USE CASE, not by domain
2. Gives copy-paste quick start prompts
3. Makes it clear what activates for what project type

---

## PHASE 2: Factual Currency (iterations 2-4)

These are not feature additions. They're corrections to wrong information.

### Iteration 2: Security reference — OWASP + Next.js

Edit `skills/security/references/security-principles.md`:

1. Change "OWASP Top 10 (2021)" header to "OWASP Top 10 (2025)"
2. Update the table — key changes from 2021 → 2025:
   - A03 is now "Supply Chain Failures" (was "Injection" at A03 in 2021)
   - A10 is now "Exceptional Conditions" (new category)
   - Note: "Check owasp.org for the authoritative current list."

3. Add a NEW section "## Next.js-Specific Security" after the headers section:
```markdown
## Next.js-Specific Security

Next.js has had critical CVEs that the security agent must warn about:
- **Middleware bypass** (CVE-2025-29927, CVSS 9.1) — `x-middleware-subrequest` header
  bypasses all middleware including auth checks. Fixed in 15.2.3+.
- **Server Component RCE** (CVSS 10.0) — RSC source exposure allowing remote code
  execution in certain configurations. Verify `output: 'standalone'` is properly secured.
- **Server Action CSRF** — Server Actions without proper origin checking are vulnerable
  to cross-site request forgery. Always validate the Origin header.

### Mitigation checklist
- [ ] Pin Next.js to latest patch version
- [ ] Verify middleware cannot be bypassed via headers
- [ ] Server Actions validate Origin header
- [ ] RSC payloads don't expose server-only code
- [ ] `experimental.serverActions.bodySizeLimit` is set
```

### Iteration 3: Performance reference — CWV note + npm supply chain

Edit `skills/performance/references/performance-principles.md`:

1. Add a note to the CWV section:
```markdown
**Note:** Google periodically tightens CWV thresholds. The values below reflect
the official web.dev documentation as of early 2026. Always verify current thresholds
at https://web.dev/vitals/ before setting project budgets. Some industry sources
report tightened targets (INP 150ms, LCP 2.0s) but these have not been confirmed
in official Google documentation.
```

Edit `skills/devops/references/devops-principles.md`:

2. Find the dependency/security section and add:
```markdown
### npm Supply Chain Defense
- `npm audit` alone is insufficient — it only catches known CVEs, not malicious packages
- Use Socket.dev or Snyk for real-time supply chain monitoring
- Enable npm package provenance (`npm publish --provenance`)
- Use lockfile-lint to verify lockfile integrity
- Pin dependencies to exact versions in production
- Monitor for typosquatting on critical packages
```

### Iteration 4: Attention bandwidth note + backend tier fix

Edit `skills/scrollytelling/references/scrollytelling-principles.md`:

1. Find the "50 bits/sec" reference in section 1 and update to:
```markdown
- **Conscious processing bandwidth:** Classical models cite ~50 bits/sec
  (Miller, Broadbent). Recent research (Meister & Zheng, Caltech 2024)
  suggests conscious decision-making may operate at ~10 bits/sec. Either
  figure validates sequential disclosure as the optimal scroll strategy —
  the bottleneck is real and severe regardless of exact measurement.
```

Edit `agents/backend/api-architect.md`:

2. Change `tier: core` to `tier: reference` in the YAML frontmatter.
   It's one agent with no downstream pipeline — honest labeling.

Edit `README.md`:

3. Find any reference to "token-architect" and change to "design-system-architect"
   (matching the agent's actual `name:` field).

**Commit:** `fix: factual currency — OWASP 2025, Next.js CVEs, CWV note, supply chain, attention bandwidth`

---

## PHASE 3: Skill Frontmatter Modernization (iteration 5)

Claude Code Skills 2.0 supports `context: fork`, `model`, and other fields.
Add them to ALL 9 skills. This is the single highest-leverage code change.

For each SKILL.md in skills/*/SKILL.md, update the frontmatter:

**Scrollytelling** (the Director needs opus in isolated context):
```yaml
---
name: scrollytelling
description: >
  End-to-end scrollytelling production pipeline. Takes a creative brief and orchestrates
  5 specialized agents to produce a validated scroll-driven experience.
context: fork
model: opus
---
```

**Frontend:**
```yaml
---
name: frontend
description: >
  Frontend architecture and implementation. Produces Architecture Decision Records,
  component specs, and validated implementations for React/Next.js applications.
context: fork
model: opus
---
```

**Backend:**
```yaml
---
name: backend
description: >
  Backend API architecture. Produces endpoint specs, database schemas, auth designs,
  and middleware chains for Node.js/Express/Next.js API routes.
context: fork
model: sonnet
---
```

**For all 6 reference-wrapper skills** (performance, security, seo, testing, devops, design-system):
```yaml
---
name: [existing name]
description: >
  [existing description]
context: fork
model: sonnet
---
```

`context: fork` means each skill runs in an isolated subagent context — it doesn't
pollute the main conversation. This is how production agent pipelines should work.

**Commit:** `feat: modernize skill frontmatter — context:fork + model routing on all 9 skills`

---

## PHASE 4: GSAP Skills Reference (iteration 6)

The GSAP ecosystem now has official Agent Skills (`greensock/gsap-skills`).
web-god's scrollytelling pipeline should complement, not duplicate.

Edit `skills/scrollytelling/SKILL.md`:

Add a section after Prerequisites:

```markdown
## Companion Skills

The scrollytelling pipeline works best alongside these official ecosystem skills:

- **greensock/gsap-skills** — Official GSAP Agent Skills covering ScrollTrigger,
  timelines, easing, and animation patterns. Install separately if available.
  web-god's Choreographer agent produces animation SPECS; GSAP skills help with
  IMPLEMENTATION of those specs.

If the official GSAP skills are installed, the Builder step can reference them
for implementation details. If not, the Choreographer's spec + the scrollytelling
reference doc contain sufficient guidance.
```

**Commit:** `feat: reference official GSAP agent skills as companion dependency`

---

## PHASE 5: README Reframe (iteration 7)

The README needs to serve the "clone into any project" use case.
Current README leads with architecture. It should lead with USE CASES.

Rewrite the top section of README.md (keep everything below the domain table):

```markdown
# web-god

**Drop-in web development intelligence for Claude Code.** Clone into any project —
scrollytelling sites, web3 dashboards, SaaS apps, marketing pages — and get
specialized AI agents that activate automatically based on what you're building.

## What You Get

**15 specialized agents** organized by what you're building:

| Building... | Agents That Activate | Depth |
|---|---|---|
| Any web project | Security, Performance, Testing, DevOps | Reference Expert |
| Scrollytelling / narrative site | Director → Choreographer → Typographer → Compositor → Auditor | Full Pipeline (unique — zero competitors) |
| Frontend app (React/Next.js) | Architect, Component Designer, Builder | Full Pipeline |
| API / backend | API Architect | Reference Expert |
| Component library | Design System Architect, Component Designer | Reference Expert |
| Content / marketing site | SEO Auditor, Frontend Architect | Reference Expert |

**Plus:** 9 orchestrator skills, deep reference docs per domain, a DOM spatial
auditor, a build integrity gate, Playwright test templates, SSR-safe React hooks,
and git hooks.

## Install

```bash
# Clone into your project
git clone https://github.com/inspectre/web-god.git .web-god

# Install agents + skills into Claude Code
cd .web-god && bash install.sh
```

Then open Claude Code in your project. Agents auto-activate based on your prompts.
No configuration needed.

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
```

**Commit:** `feat: README reframe — use-case-first for clone-into-any-project workflow`

---

## PHASE 6: Verify + Ship (iteration 8)

1. `find . -type f -not -path './.git/*' -not -name '.DS_Store' | wc -l` — count files
2. Verify README inventory matches actual counts
3. Verify CLAUDE.md quick start prompts reference correct agent names
4. `node bin/cli.js --help` — no errors
5. `bash tools/build-gate/gate.sh .` — doesn't crash on own repo
6. Grep for any remaining PBX residue (excluding audit/ and .claude/prompts/)
7. Verify all 9 skills have `context: fork` in frontmatter
8. Verify backend-api-architect has `tier: reference`
9. Verify security reference says "2025" not "2021"

**Final commit:** `chore: A+ sweep complete — factually current, properly wired, clone-ready`

---

## WHAT THIS DOES NOT DO (by design)

- Does NOT add new agents or domains
- Does NOT restructure the 15-agent roster
- Does NOT chase emerging specs (CSS scroll-timeline, WebGPU, View Transitions)
- Does NOT add Astro support (v0.2 roadmap)
- Does NOT change the W3C design token format (conceptual model unchanged)
- Does NOT rename the package

Every change is either: a factual correction, a modern wiring improvement,
or a positioning clarification. Zero feature additions. Pure engineering precision.

Begin. Read the audit reports, then execute Phase 1.
