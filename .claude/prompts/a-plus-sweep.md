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

## PHASE 1: Global Rule — The Activation Layer (iteration 1)

CRITICAL ARCHITECTURE: web-god does NOT use project-level CLAUDE.md for activation.
Users will clone web-god into projects that ALREADY have their own CLAUDE.md (describing
their project's stack, conventions, etc.). web-god must not clobber that.

Instead, web-god installs a GLOBAL RULE at `~/.claude/rules/common/web-god.md`.
Claude Code loads global rules ALONGSIDE any project CLAUDE.md — no conflict.

The rule file is already created at `rules/web-god.md` and install.sh copies it.
Review `rules/web-god.md` and ensure it contains project-type-aware activation.

The existing `.claude/CLAUDE.md` stays — it describes the web-god repo itself (for
contributors working ON web-god). It does NOT get installed into user projects.

Verify:
1. `rules/web-god.md` exists and contains project-type-aware agent activation
2. `install.sh` copies `rules/web-god.md` to `~/.claude/rules/common/web-god.md`
3. `.claude/CLAUDE.md` describes the web-god repo itself (for contributors), NOT for end users
4. No step in install.sh touches any project-level `.claude/CLAUDE.md`

**Commit:** `feat: global rule activation — web-god loads via rules/common, not project CLAUDE.md`

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
But NOT all skills should use all fields. Per Anthropic docs:

> "context: fork only makes sense for skills with explicit instructions.
> If your skill contains guidelines without a task, the subagent receives
> the guidelines but no actionable prompt, and returns without meaningful output."

This means: ONLY pipeline skills (scrollytelling, frontend) get `context: fork`.
Reference-wrapper skills (security, performance, etc.) are GUIDELINES — they
should NOT fork because they'd have no actionable task in isolation.

Also per docs: "Always write descriptions in third person" — they're injected
into the system prompt.

For each SKILL.md in skills/*/SKILL.md, update the frontmatter:

**Scrollytelling** (pipeline — DOES fork, opus for Director reasoning):
```yaml
---
name: scrollytelling
description: >
  Orchestrates a 5-agent scrollytelling production pipeline. Takes a creative brief
  and produces a validated scroll-driven experience with GSAP, Lenis, and Playwright QA.
context: fork
model: opus
---
```

**Frontend** (pipeline — DOES fork, opus for architecture reasoning):
```yaml
---
name: frontend
description: >
  Orchestrates frontend architecture and implementation. Produces Architecture Decision
  Records, component specs, and validated implementations for React/Next.js applications.
context: fork
model: opus
---
```

**Backend** (single agent, but has explicit pipeline steps — fork is borderline,
keep it simple and DON'T fork since it's essentially guidelines + one agent):
```yaml
---
name: backend
description: >
  Designs backend API architecture including endpoint specs, database schemas,
  auth flows, and middleware chains for Node.js and Next.js API routes.
model: sonnet
---
```

**For all 6 reference-wrapper skills** (performance, security, seo, testing, devops,
design-system) — these are GUIDELINES, NOT pipelines. Per Anthropic docs, do NOT
add context:fork. Just add model routing and fix descriptions to third person:
```yaml
---
name: [existing name]
description: >
  [Rewrite in third person. E.g., "Audits web performance including Core Web Vitals,
  bundle sizes, and rendering bottlenecks. Produces optimization plans with measured
  before/after targets."]
model: sonnet
---
```

Specific description rewrites needed (all third person):
- performance: "Audits web application performance including Core Web Vitals, bundle sizes, rendering performance, and network waterfalls. Produces prioritized optimization plans."
- security: "Performs STRIDE threat modeling, OWASP 2025 compliance checking, and authentication flow review. Produces security assessment reports with severity-rated findings."
- seo: "Audits technical SEO including meta tags, structured data, sitemaps, Open Graph, and Core Web Vitals impact. Produces per-category score reports."
- testing: "Designs testing strategies using the Testing Diamond model. Covers unit, integration, E2E, visual regression, and accessibility testing with coverage standards."
- devops: "Designs CI/CD pipelines, Docker configurations, deployment strategies, and environment management. Produces deployment runbooks and monitoring plans."
- design-system: "Designs design token hierarchies, component API conventions, and theming systems including dark mode. Targets the W3C DTCG token format."

Do NOT add `context: fork` to any of these 6. They are reference experts
that load inline alongside the conversation, exactly as Anthropic intends.

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
```

**Commit:** `feat: README reframe — use-case-first for clone-into-any-project workflow`

---

## PHASE 6: Verify + Ship (iteration 8)

1. `find . -type f -not -path './.git/*' -not -name '.DS_Store' | wc -l` — count files
2. Verify README inventory matches actual counts
3. Verify `rules/web-god.md` exists and has project-type-aware activation
4. Verify `install.sh` copies rules to `~/.claude/rules/common/web-god.md`
5. Verify `.claude/CLAUDE.md` describes the web-god repo (NOT end-user activation)
6. `node bin/cli.js --help` — no errors
7. `bash tools/build-gate/gate.sh .` — doesn't crash on own repo
8. Grep for any remaining PBX residue (excluding audit/ and .claude/prompts/)
9. Verify scrollytelling + frontend skills have `context: fork`; other 7 do NOT
10. Verify all 9 skill descriptions are third person (no "you", no "your")
10. Verify backend-api-architect has `tier: reference`
11. Verify security reference says "2025" not "2021"
12. Test install: `CLAUDE_HOME=/tmp/test-claude bash install.sh` — verify rules/ dir created

**Final commit:** `chore: A+ sweep complete — factually current, rules-based activation, clone-ready`

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
