# WEB-GOD GRADE-A FIX SWEEP (v2 — post-debate)
# Run from: /Users/inspectre/developer/web-god-pkg
# claude -p "$(cat .claude/prompts/grade-a-fixes.md)"
# Uses: Builder (primary), Sentinel (security fixes), Tester (tests + CI)
# Expected: 18 iterations, ~40 min. Commit after each phase.

You are executing a systematic fix sweep on the `web-god` package to resolve all issues
identified in the audit (see `audit/` directory) PLUS three strategic decisions made post-audit.

Read `audit/07-final-verdict.md` first for full context.

## STRATEGIC DECISIONS (owner-approved, non-negotiable)

1. **Keep all 15 agents** — but they must be properly invokable. Add an Agent Invocation Guide
   with exact prompts + a CLAUDE.md that wires them. 15 agents are a force multiplier ONLY if
   users know how to invoke them correctly. Without invocation wiring, they're dead weight.

2. **React hooks: Keep + fix SSR, demote to `examples/react-hooks/`** — They are companion
   code, not a headline feature. Move from `hooks/react/` to `examples/react-hooks/`.

3. **Thin domains (SEO/DevOps/Design System): Reframe as "reference docs with auto-activation"**
   — Honest positioning. The reference docs are the real value; agents are delivery wrappers.
   Update README to reflect this tiered reality.

---

## PHASE 1: P0 CRITICAL FIXES (iterations 1-2) — MUST SHIP

### Iteration 1: Security + PBX Residue

**Fix 1 — Command injection in `bin/cli.js`**
Replace ALL `execSync` with `execFileSync` using argument arrays:

```javascript
const { execFileSync } = require('child_process');

// For node scripts:
execFileSync('node', [
  `${ROOT}/tools/dom-auditor/index.js`,
  args[1] || 'http://localhost:3000',
  ...args.slice(2)
], { stdio: 'inherit' });

// For bash scripts:
execFileSync('bash', [
  `${ROOT}/tools/build-gate/gate.sh`,
  args[1] || '.',
  ...args.slice(2)
], { stdio: 'inherit' });
```

Do this for ALL commands in the COMMANDS object.

**Fix 2 — Remove "Degular" from `tools/dom-auditor/index.js`**
Delete the entire CHECK 5 (font fallback detection) block. It's PBX-specific and not
generalizable. Update the comment that counts checks (6 → 5).

### Iteration 2: README + LICENSE + CLAUDE.md

**Fix 3 — Create LICENSE file**
MIT license, year 2026, "Inspectre Technologies".

**Fix 4 — Create `.claude/CLAUDE.md`**
This is critical — it's what makes Claude Code understand the repo:
```markdown
# web-god

Web development intelligence layer: 15 specialized agents, 9 orchestrator skills,
deterministic tools, and production React hook examples.

## Structure
- agents/ — Claude Code agents (YAML frontmatter + markdown), organized by domain
- skills/ — Orchestrator skills (SKILL.md + references/ + scripts/)
- tools/ — Standalone CLI scripts (Node.js, bash)
- examples/react-hooks/ — SSR-safe React hooks for common patterns
- hooks/git/ — Pre-configured git hooks (Husky-compatible)

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
```

**Fix 5 — README overhaul (do NOT skip this — it's the first thing users see)**

Restructure README to reflect the tiered reality:

1. Replace the domain table — remove all non-existent tools. Be honest about what exists:

| Domain | Tier | Agents | Skill | Tools |
|--------|------|--------|-------|-------|
| Scrollytelling | Core Pipeline | director, choreographer, typographer, compositor, auditor | `scrollytelling` | dom-auditor, Playwright test templates |
| Frontend | Core Pipeline | architect, component-designer, builder | `frontend` | — |
| Backend | Core Pipeline | api-architect | `backend` | — |
| Performance | Reference Wrapper | profiler | `performance` | — |
| Security | Reference Wrapper | threat-modeler | `security` | — |
| SEO | Reference Wrapper | seo-auditor | `seo` | — |
| Testing | Reference Wrapper | test-architect | `testing` | build-gate |
| DevOps | Reference Wrapper | deploy-planner | `devops` | build-gate |
| Design System | Reference Wrapper | token-architect | `design-system` | — |

2. Replace `yourusername` with `inspectre` in the git clone URL.

3. Add an "Agent Tiers" section explaining Core Pipeline vs Reference Wrapper.

4. Add a "Prerequisites" section: Node.js 18+, Claude Code (optional — agents work standalone too).

**Commit:** `fix(p0): security, PBX residue, README, LICENSE, CLAUDE.md`

---

## PHASE 2: AGENT INVOCATION GUIDE (iterations 3-4) — THE FORCE MULTIPLIER

This is what makes 15 agents useful instead of confusing.

### Iteration 3: Create the Invocation Guide

Create `docs/AGENT_GUIDE.md` — a complete reference for invoking every agent:

```markdown
# Agent Invocation Guide

How to invoke each agent effectively. Copy-paste these prompts into Claude Code.

## Core Pipeline Agents

### Scrollytelling Pipeline (5 agents, use via skill)
The scrollytelling pipeline is designed to run as a complete skill, not individual agents.

**Invoke the full pipeline:**
```
Build a scrollytelling landing page.
Topic: [your product]
Audience: [who]
Tone: [cinematic/playful/editorial/prestige]
Assets: [what you have — images, copy, data, video]
Emotional arc: [start → middle → peak → end]
Objective: [CTA goal]
```

**Invoke individual agents (advanced):**
| Agent | Prompt | When |
|-------|--------|------|
| Director | "Use the scrollytelling-director to create a storyboard for: [brief]" | Starting a new scrollytelling project |
| Choreographer | "Use the scrollytelling-choreographer to create an animation spec from this storyboard: [file]" | After Director produces storyboard |
| Typographer | "Use the scrollytelling-typographer to design the type system for: [storyboard + animation spec]" | After Choreographer |
| Compositor | "Use the scrollytelling-compositor to design the visual composition for: [all upstream specs]" | After Typographer |
| Auditor | "Use the scrollytelling-auditor to validate the experience at http://localhost:3000" | After implementation |

### Frontend Pipeline (3 agents)
| Agent | Prompt | When |
|-------|--------|------|
| Architect | "Use frontend-architect to design the architecture for: [product brief]" | Starting a new frontend project |
| Component Designer | "Use frontend-component-designer to design the component API for: [component name]" | Designing new components |
| Builder | "Use frontend-builder to implement: [architecture spec or component spec]" | After architecture/design is approved |

**Full pipeline prompt:**
```
Plan and build a [type] web application.
Product: [what it does]
Users: [who uses it]
Key features: [list]
Stack preference: [Next.js/Remix/Vite or let architect decide]
```

### Backend (1 agent)
| Agent | Prompt | When |
|-------|--------|------|
| API Architect | "Use backend-api-architect to design the API for: [product requirements]" | Designing a new API or restructuring |

## Reference Wrapper Agents

These agents auto-activate when you mention their domain. You can also invoke directly.

| Agent | Trigger Phrases | Example Prompt |
|-------|----------------|---------------|
| Performance Profiler | "optimize performance", "site is slow", "improve LCP" | "Audit the performance of this Next.js app and produce an optimization plan" |
| Security Threat Modeler | "security review", "audit vulnerabilities", "check auth" | "Perform a STRIDE threat model on this API" |
| SEO Auditor | "SEO audit", "meta tags", "structured data" | "Audit the SEO of this site and produce a fix list" |
| Test Architect | "set up tests", "testing strategy", "improve coverage" | "Design a testing strategy for this app using the Testing Diamond model" |
| DevOps Deploy Planner | "set up CI/CD", "deploy", "Docker", "staging" | "Design a GitHub Actions CI/CD pipeline for this Next.js app" |
| Design System Architect | "design tokens", "component library", "dark mode" | "Create a design token system with light/dark mode for this project" |

## Chaining Agents Manually

For complex tasks, chain agents yourself:

**Architecture → Implementation → Review:**
```
1. "Use frontend-architect to design the architecture for [app]"
   → Review the ADR, approve
2. "Use frontend-builder to implement this architecture"
   → Builder follows the ADR
3. "Use test-architect to design tests for what was built"
   → Test Architect produces test plan
```

**Security-Aware API Design:**
```
1. "Use backend-api-architect to design the API for [product]"
2. "Use security-threat-modeler to review this API design for vulnerabilities"
   → Sentinel reviews the API spec, produces findings
3. Fix the findings, then implement
```
```

### Iteration 4: Wire the guide into the system

1. Add a reference to the guide in `.claude/CLAUDE.md`: "See docs/AGENT_GUIDE.md for invocation prompts."
2. Add a link in `README.md` under a new "## How to Use the Agents" section.
3. Create `docs/ADDING_A_DOMAIN.md` — brief guide (30 lines) explaining how to add a new domain:
   - Create agent in `agents/[domain]/[name].md` with YAML frontmatter
   - Create skill in `skills/[domain]/SKILL.md`
   - Create reference doc in `skills/[domain]/references/[name]-principles.md`
   - Add to README domain table
   - Add to Agent Guide

**Commit:** `feat(docs): agent invocation guide, ADDING_A_DOMAIN guide, README wiring`

---

## PHASE 3: HOOK RESTRUCTURE + SSR FIXES (iterations 5-7)

### Iteration 5: Move hooks to examples/

```bash
mkdir -p examples/react-hooks/__tests__
mv hooks/react/* examples/react-hooks/
rmdir hooks/react
```

Update all internal references (README, any agent that mentions hooks/react/).
Add a `examples/react-hooks/README.md`:

```markdown
# React Hook Examples

SSR-safe React hooks that pair with web-god's frontend agents.
These are companion code — copy what you need into your project.

Not a published package. For production hook libraries, see:
- [usehooks-ts](https://usehooks-ts.com/) — 40+ typed hooks
- [Mantine hooks](https://mantine.dev/hooks/use-debounce/) — 50+ hooks
- [@uidotdev/usehooks](https://usehooks.com/) — collection with explanations

## Hooks Included
| Hook | Description | SSR Safe |
|------|-------------|----------|
| useScrollProgress | Track scroll progress 0→1 | ✅ |
| useMediaQuery | Reactive CSS media query | ✅ (mounted pattern) |
| useTheme | Light/dark with persistence | ✅ (defaultTheme) |
| useDebounce | Debounce a value | ✅ |
| useIntersectionObserver | Observe element visibility | ✅ |
| useKeyboardShortcut | Register keyboard shortcuts | ✅ |
| useLocalStorage | useState + localStorage | ✅ |
| useCopyToClipboard | Copy text with feedback | ✅ |
| useReducedMotion | Detect prefers-reduced-motion | ✅ |
| useLockBodyScroll | Lock body scroll for modals | ✅ |
```

### Iteration 6: Fix useMediaQuery SSR (hydration-safe mounted pattern)

Replace the entire `examples/react-hooks/useMediaQuery.ts`:

```typescript
'use client';
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  if (!mounted) return defaultValue;
  return matches;
}
```

### Iteration 7: Fix useTheme FOUC + useCopyToClipboard cleanup + useIntersectionObserver ref type

**useTheme** — Add `mounted` pattern, accept `defaultTheme`, prevent FOUC:
- Initial `resolvedTheme` returns `defaultTheme` until mounted
- Add JSDoc: "Add `suppressHydrationWarning` to your `<html>` element"
- The `mounted` guard prevents the DOM mutation during SSR

**useCopyToClipboard** — Add unmount cleanup:
```typescript
useEffect(() => {
  return () => clearTimeout(timeoutRef.current);
}, []);
```

**useIntersectionObserver** — Change `HTMLDivElement` → `HTMLElement` in ref and return type.

**useReducedMotion** — No code changes needed, inherits useMediaQuery fix.

**Commit:** `fix(hooks): move to examples/, fix SSR hydration, FOUC, cleanup, ref type`

---

## PHASE 4: AGENT & SKILL FIXES (iterations 8-11)

### Iteration 8: Fix agent chaining references

Read `audit/01-recon-report.md` for exact mismatches. Fix every Chaining section:

1. `agents/frontend/architect.md` — "Component Designer" → `frontend-component-designer`, "Design System Engineer" → `design-system-architect`
2. `agents/frontend/component-designer.md` — "Design System Engineer" → `design-system-architect`
3. `agents/frontend/builder.md` — "Design System Architect" → `design-system-architect`
4. `agents/backend/api-architect.md` — "Security Reviewer" → `security-threat-modeler`, remove references to non-existent "Schema Designer" and "Auth Engineer"
5. `agents/performance/profiler.md` — "Frontend Architect" → `frontend-architect`, "Backend Architect" → `backend-api-architect`
6. Any agent missing a Chaining section — add one citing actual agent names.

### Iteration 9: Add tier labels to agent frontmatter

Add a `tier` field to every agent's YAML frontmatter:

Core Pipeline agents get: `tier: core`
Reference Wrapper agents get: `tier: reference`

Example:
```yaml
---
name: frontend-architect
tier: core
description: >
  ...
```

This doesn't affect Claude Code behavior (it ignores unknown frontmatter fields) but documents intent and enables future tooling.

### Iteration 10: Strengthen thin skills

For each of these 7 skills (backend, performance, security, seo, testing, devops, design-system):

1. Add a **review checklist** (5-8 items with `- [ ]` checkboxes) after the implementation step
2. Add a **human checkpoint** note: "Present [deliverable] to the user for approval before proceeding"
3. Add `Consult references/[name]-principles.md for domain-specific guidelines.`
4. Ensure agent names in backticks match the `name:` field in YAML frontmatter

Keep each skill under 60 lines. Don't bloat.

### Iteration 11: Fix minor content issues

1. `skills/frontend/SKILL.md` — "Design System Engineer" → `design-system-architect`
2. `skills/backend/SKILL.md` — Remove `npx web-god security .` reference (CLI doesn't have it)
3. `skills/security/references/security-principles.md` — Add: "Based on OWASP Top 10 (2021). Check owasp.org for latest."
4. `skills/backend/references/backend-principles.md` line ~73 — Add: "Note: account lockout can be exploited for DoS. Consider progressive delays as an alternative."
5. `templates/configs/kill-list.example.json` — Replace `#00D4FF` with `#FF0000`, update description to generic example
6. `skills/security/references/security-principles.md` CSP — Add: "img-src https: is deliberately permissive for a starter template. Restrict to specific CDN domains in production."

**Commit:** `fix(agents): chaining refs, tier labels, skill strengthening, content fixes`

---

## PHASE 5: TOOL FIXES (iterations 12-13)

### Iteration 12: Fix gate.sh portability

1. Replace Python3 JSON parsing with Node.js:
```bash
# BEFORE:
python3 -c "import json,sys; [print(p) for p in json.load(open('$KILL_LIST')).get('patterns',[])]"

# AFTER:
node -e "const d=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));(d.patterns||[]).forEach(p=>console.log(p))" "$KILL_LIST"
```

2. Replace hardcoded `$PROJECT_ROOT/src` with auto-detection:
```bash
if [ -d "$PROJECT_ROOT/src" ]; then SRC_DIR="$PROJECT_ROOT/src"
elif [ -d "$PROJECT_ROOT/app" ]; then SRC_DIR="$PROJECT_ROOT/app"
elif [ -d "$PROJECT_ROOT/lib" ]; then SRC_DIR="$PROJECT_ROOT/lib"
else SRC_DIR="$PROJECT_ROOT"
fi
```
Replace all `"$PROJECT_ROOT/src"` with `"$SRC_DIR"`.

3. Fix install.sh — backup before rm -rf:
```bash
if [ -d "$dest_dir" ]; then
  mv "$dest_dir" "${dest_dir}.bak.$(date +%s)" 2>/dev/null || true
fi
```

### Iteration 13: CLI stub commands + honest error messages

Add stub commands for `security`, `perf`, and `seo` that print helpful redirects:

```javascript
security: {
  desc: 'Security audit (use via Claude Code agent)',
  run: () => {
    console.log('Security scanning runs via the security-threat-modeler agent in Claude Code.');
    console.log('');
    console.log('Invoke: "Use the security agent to perform a STRIDE threat model on this project"');
    console.log('');
    console.log('For dependency scanning: npm audit');
    process.exit(0);
  }
},
```

Same pattern for `perf` (pointing to performance-profiler agent + Lighthouse) and `seo` (pointing to seo-auditor agent).

**Commit:** `fix(tools): gate.sh portability, install.sh backup, CLI stub commands`

---

## PHASE 6: TESTS + CI (iterations 14-16)

### Iteration 14: Hook tests

Create `examples/react-hooks/__tests__/hooks.test.ts` testing the highest-risk hooks.
Create `vitest.config.ts` at repo root:
```typescript
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['examples/react-hooks/__tests__/**/*.test.ts'],
  },
});
```

Test: useDebounce (delay + cleanup), useLocalStorage (read/write/parse errors),
useCopyToClipboard (copy + timeout reset + unmount cleanup), useMediaQuery (defaultValue before mount).

### Iteration 15: Tool tests

Create `tools/__tests__/dom-auditor.test.js` — structural tests (require test, VIEWPORTS array, SKIP_TAGS set).
Create `tools/__tests__/gate.test.sh` — create temp project, run gate, verify PASS/FAIL.

### Iteration 16: GitHub Actions CI

Create `.github/workflows/ci.yml`:
- Verify structure (expected files exist, agent count ≥ 10)
- Shellcheck on all bash scripts
- Validate YAML frontmatter on all agents
- Verify CLI loads (`node bin/cli.js --help`)
- Test install script (`CLAUDE_HOME=/tmp/test bash install.sh`)

**Commit:** `feat(tests): hook tests, tool tests, GitHub Actions CI`

---

## PHASE 7: FINAL SWEEP (iterations 17-18)

### Iteration 17: Verify all fixes

1. `find . -type f -not -path './.git/*' -not -name '.DS_Store' | sort` — count everything
2. Verify README inventory numbers match reality
3. Read every P0 from `audit/07-final-verdict.md` — confirm each resolved
4. Run `node bin/cli.js --help` — no errors
5. Run `node bin/cli.js security` — prints stub message, not crash
6. Run `bash tools/build-gate/gate.sh .` — doesn't crash on its own repo
7. Verify `examples/react-hooks/` exists and `hooks/react/` is gone
8. Verify `docs/AGENT_GUIDE.md` exists and has prompts for all 15 agents
9. Verify `LICENSE` file exists
10. Verify `.claude/CLAUDE.md` exists with tier documentation

### Iteration 18: Update README badge counts + final commit

Update any badge counts if agent/skill numbers changed.
Ensure the README flows: Intro → Architecture → Agent Tiers → Domains Table → Quick Start → Agent Guide link → Hooks (demoted) → License.

**Final commit:** `chore: grade-a sweep complete — all P0/P1 resolved, tiers + invocation guide added`

---

## EXECUTION RULES

- Read the file BEFORE editing it. Every time.
- After each edit, verify no syntax errors (unclosed strings, broken markdown)
- One commit per phase (7 commits total)
- Don't skip any fix — the audit was specific, the fixes are specific
- If a fix is ambiguous, read the relevant audit report for exact details
- Don't consolidate or delete agents — all 15 stay, properly wired

## CIRCUIT BREAKERS
- If gate.sh won't run after fixes, stop and debug
- If CLI errors on --help after fixes, stop and debug
- If moving hooks breaks any references, fix before proceeding

Begin. Read `audit/07-final-verdict.md` first, then start Phase 1.
