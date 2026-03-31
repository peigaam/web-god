# Phase 6: Documentation Review

**Agent:** Scribe | **Iterations:** 17-18 | **Date:** 2026-03-31

---

## Iteration 17: README & Onboarding

### README.md (124 lines) — Grade: B-

#### 60-Second Comprehension Test

A developer encountering this repo for the first time would understand:
- ✓ What it is ("All-in-one web development intelligence layer")
- ✓ What it contains (agents, skills, tools, hooks)
- ✓ How to install (`bash install.sh`)
- ✓ How to use with Claude Code (prompt examples)
- ✗ **Why they should use it** — no unique value proposition vs. just prompting Claude directly
- ✗ **What makes this different** — no comparison to alternatives
- ✗ **Who this is for** — no target audience statement

#### Domain Table Accuracy

The README's domain table (lines 29-39) lists tools per domain. **8 of the listed tools do not exist:**

| Domain | Listed Tool | Exists? |
|---|---|---|
| Frontend | dom-auditor | ✓ |
| Backend | api-validator | **NO** |
| Scrollytelling | dom-auditor | ✓ |
| Scrollytelling | screenshot | **NO** |
| Performance | lighthouse-runner | **NO** |
| Performance | bundle-analyzer | **NO** |
| Security | security-scanner | **NO** |
| SEO | meta-validator | **NO** |
| Testing | visual-regression | ✓ (Playwright test, not standalone tool) |
| Testing | a11y-scanner | **NO** |
| DevOps | build-gate | ✓ |
| Design System | token-validator | **NO** |

**Severity: P1 High.** The README claims tools that don't exist. This is misleading.

#### Installation Flow Assessment

```bash
git clone https://github.com/yourusername/web-god.git
cd web-god && bash install.sh
```

- **Would it work?** Yes, install.sh is functional and well-tested.
- **Issue D1:** `yourusername` placeholder in the git clone URL — must be updated before publishing.
- **Issue D2:** No mention of prerequisites (Node.js 18+, Playwright for tools, Python3 for evaluator).
- **Issue D3:** No mention that `npm install` is NOT needed — this is a file-copy package, not an npm dependency. This could confuse developers expecting `npm install web-god`.

#### Missing Content

| What's Missing | Impact |
|---|---|
| Prerequisites section (Node.js, Playwright, etc.) | Users will fail silently on missing deps |
| CONTRIBUTING.md | Standard for open-source projects |
| CHANGELOG.md | Version tracking |
| LICENSE file (separate from README mention) | Legal requirement — MIT mentioned but no LICENSE file |
| GitHub repo URL (uses placeholder) | Can't be cloned |
| Badge strategy (CI status, version, license) | Polish item |
| Architecture diagram (visual) | Would help comprehension |
| "How to add a new domain" guide | Limits contribution |

### "Use with Claude Code" Examples Assessment

```
# Triggers the frontend skill
"Build a component library with proper design tokens"
```

**Would this actually trigger the skill?** Depends on Claude Code's skill matching algorithm. The skill description says: `Use when "build a web app", "design a frontend", "structure a React/Next.js project"`. The example prompt "Build a component library with proper design tokens" matches `design-system` better than `frontend`. **The examples may trigger wrong skills.**

**Recommendation:** Each example should include the expected agent/skill that would activate and why.

---

## Iteration 18: Per-Domain Documentation

### Agent Description Quality for Auto-Activation

Claude Code uses agent `description` fields to decide when to auto-activate. Assessment:

| Agent | Description Triggers | Auto-Activation Likelihood |
|---|---|---|
| api-architect | "API design, backend architecture" | **High** — clear triggers |
| token-architect | "create design system", "design tokens", "dark mode", "theme" | **High** — specific keywords |
| deploy-planner | "deploy", "CI/CD", "Docker", "GitHub Actions" | **High** — common terms |
| frontend-architect | "build a web app", "design the frontend", "structure this project" | **High** — natural triggers |
| frontend-builder | "implement this", "build this component", "code this feature" | **High** — action verbs |
| component-designer | "designing new components", "component libraries" | **Medium** — somewhat generic |
| profiler | "optimize performance", "site is slow", "Core Web Vitals" | **High** — pain-point language |
| scrollytelling-director | "scrollytelling project", "creative brief" | **High** — unique domain terms |
| scrollytelling-choreographer | "after the Director has produced a storyboard" | **Low** — pipeline-dependent, not natural language |
| scrollytelling-typographer | "after the Choreographer has produced an animation spec" | **Low** — pipeline-dependent |
| scrollytelling-compositor | "after the Director, Choreographer, and Typographer" | **Low** — pipeline-dependent |
| scrollytelling-auditor | "after the Builder has implemented" | **Low** — pipeline-dependent |
| threat-modeler | "review security", "audit vulnerabilities", "design auth" | **High** — clear triggers |
| seo-auditor | "SEO", "meta tags", "structured data", "sitemap" | **High** — specific terms |
| test-architect | "set up tests", "write tests", "improve coverage" | **High** — common requests |

**Issue D4:** 4 scrollytelling pipeline agents (choreographer, typographer, compositor, auditor) have descriptions that reference upstream agents, not user-facing language. They would almost never auto-activate from natural user prompts. This is by design (they're invoked by the scrollytelling skill), but the descriptions should clarify this: "Invoked by the scrollytelling skill pipeline. Not typically invoked directly."

### Per-Domain Independence

| Domain | Can It Be Used Independently? | Issues |
|---|---|---|
| Frontend | Yes — 3 agents + skill + reference | References "Design System Engineer" that doesn't exist by that name |
| Backend | Yes — 1 agent + skill + reference | Skill references non-existent CLI command `npx web-god security .` |
| Scrollytelling | Yes — 5 agents + skill + reference + evaluator + test suites | Strongest standalone domain |
| Performance | Yes — 1 agent + skill + reference | References dom-auditor which is bundled |
| Security | Yes — 1 agent + skill + reference | Reference doc is thin (57 lines) |
| SEO | Yes — 1 agent + skill + reference | Skill is only 19 lines |
| Testing | Yes — 1 agent + skill + reference | No bundled test infrastructure beyond scrollytelling tests |
| DevOps | Yes — 1 agent + skill + reference | No CI workflow template included |
| Design System | Yes — 1 agent + skill + reference | No token generation script included |

### "How to Add a New Domain" Guide

**Does not exist.** There is no documentation explaining how to:
- Add a new agent to the package
- Add a new skill domain
- Add a reference doc
- Follow the naming conventions
- Test a new addition

**Impact:** Makes external contribution difficult and internal extension error-prone.

### Research Directory Assessment

```
research/
├── graveyard.json           (27 lines — killed hypotheses/components)
├── implementation-roadmap.md (382 lines — detailed roadmap)
├── survivors.json           (61 lines — surviving hypotheses)
├── synthesis.md             (57 lines — synthesis of research)
├── vision-spec.md           (91 lines — original vision document)
```

**Assessment:** This is internal documentation from the package's development process. It documents the intellectual journey from research to product.

**Should it ship?**
- **Yes for transparency** — shows the thinking behind design decisions
- **No for cleanliness** — adds 618 lines of non-functional content
- **Recommendation:** Move to a `docs/design-rationale/` directory and add a one-line README explaining what it is. Or exclude from the `files` list in package.json.

---

## Documentation Summary

| # | Issue | Priority | Effort |
|---|---|---|---|
| D5 | README lists 8 non-existent tools | **P0** | Small — update table |
| D1 | Placeholder `yourusername` in git clone URL | P0 | Trivial |
| D6 | No prerequisites section in README | P1 | Small |
| D7 | No LICENSE file (only mentioned in README) | P1 | Trivial — create MIT LICENSE |
| D4 | Pipeline agents have non-auto-activatable descriptions | P2 | Small |
| D3 | No explanation that this is a file-copy package, not npm install | P2 | Small |
| D8 | No "How to Add a New Domain" contributor guide | P2 | Medium |
| D9 | No CONTRIBUTING.md | P2 | Medium |
| D10 | No GitHub Actions CI workflow | P2 (also T13) | Small |
| D11 | Research directory should be organized or excluded from `files` | P3 | Trivial |
| D12 | Claude Code usage examples may trigger wrong skills | P3 | Small — verify and update |
