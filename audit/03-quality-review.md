# Phase 3: Code Quality Review

**Agent:** Critic | **Iterations:** 7-12 | **Date:** 2026-03-31

---

## Iteration 7: Agent Quality (agents/**/*.md)

### Grading Criteria
- Well-structured prompt (role, constraints, output, chaining)
- Actionable instructions (not vague)
- No contradictions, undefined terms, or ambiguous scoping
- Output format works for downstream consumption

### Per-Agent Quality Assessment

| Agent | Structure | Actionability | Contradictions | Output Format | Grade |
|---|---|---|---|---|---|
| api-architect | Clear sections: Principles → Output → Constraints → Chaining | Specific: "Every endpoint has explicit auth" | None | Tables + numbered sections | A |
| token-architect | Clean: Token System → Spacing → Typography → Dark Mode → Components | Specific: "Components reference Tier 2/3 ONLY" | None | Code examples + tables | A- |
| deploy-planner | Clear: Pipeline → Environment → Deployment → Monitoring | Specific: "CI < 10 minutes for PR" | None | Tables with thresholds | B+ |
| frontend-architect | Excellent: 5 principles → 8 ADR sections → Constraints → Chaining | Highly specific: Component Boundary Rule with 5 roles | None | Complete ADR template | A+ |
| frontend-builder | Excellent: Principles → Patterns → Build Order → Checklist → Chaining | Code examples for every pattern | None | Checklist + code blocks | A+ |
| component-designer | Clean: Principles → Output → Constraints → Chaining | Specific: "5-8 props max" for UI primitives | None | Component Card template | A |
| profiler | Clear: Dimensions → Protocol → Playbook → Budgets | Specific thresholds but prescriptions could cite specific tools more | None | Tables with metrics | B+ |
| scrollytelling-director | Exceptional: Cognitive Foundation → Input → Output → Constraints → Chaining | Highly actionable: sparkline rules, scene limits, Von Restorff budget | None | Complete storyboard template | A+ |
| scrollytelling-choreographer | Exceptional: 7 output sections, each with rules | "Maximum 3 simultaneous animations per viewport" — precise | None | Trigger Map table + Parallax system | A+ |
| scrollytelling-typographer | Strong: Type Scale → Kinetic Taxonomy → Hierarchy → Contrast → Responsive | Reading-pace synchronization calculation (250 wpm) | None | Tables with responsive specs | A |
| scrollytelling-compositor | Strong: Composition boards → Color narrative → Asset optimization → Depth | "Maximum 5 colors per scene" — precise | None | Layer Stack tables | A |
| scrollytelling-auditor | Exceptional: 5 test categories → Healing Loop → Circuit Breaker | Every test has specific thresholds and report format | None | Validation Report template | A+ |
| threat-modeler | Solid: STRIDE → Checklist → Output → Constraints | Checklist is actionable ("bcrypt/scrypt/Argon2, cost ≥ 10") | None | Per-finding severity format | B+ |
| seo-auditor | Solid: 7 audit dimensions → Output → Constraints | Specific ("Title: 50-60 chars, primary keyword first") | None | Per-category score format | B+ |
| test-architect | Good: Diamond → Strategy by Layer → Coverage → Anti-Patterns | Specific anti-patterns and coverage targets | None | Table format | B+ |

### Common Strengths Across All Agents
1. **No vague instructions.** Every agent has specific numbers, rules, or criteria. No "make it good" or "ensure quality."
2. **No contradictions found** across any of the 15 agents.
3. **Consistent formatting:** YAML frontmatter → H1 title → Principles/Foundation → Output → Constraints → Chaining.
4. **Output formats are downstream-consumable:** Tables, checklists, and templates that the next agent can parse.

### Issues Found

| # | Issue | Agent | Location | Severity |
|---|---|---|---|---|
| Q1 | Chaining references use wrong names (see Recon Report R1-R4) | api-architect, frontend-architect, component-designer, builder | Various :75, :125-126, :77, :180 | Medium |
| Q2 | Non-scrollytelling agents are significantly less detailed than scrollytelling agents | All Tier 2 agents | N/A | Low |
| Q3 | No agent defines error/failure behavior for itself (what happens if the agent produces bad output?) | All | N/A | Low |

---

## Iteration 8: Skill Quality (skills/**/SKILL.md)

### Per-Skill Assessment

| Skill | Lines | Pipeline Steps | Review Checklist | Agent References Correct | Human Checkpoint | Grade |
|---|---|---|---|---|---|---|
| scrollytelling | 174 | 8 steps (detailed) | Yes (6 checklists) | Yes | Yes (Step 2) | A+ |
| frontend | 38 | 4 steps | Yes (6 items) | **No** — "Design System Engineer" | Yes (Step 1) | B+ |
| backend | 32 | 3 steps | Yes (5 items) | Yes | No | B |
| performance | 32 | 5 steps | No (just pipeline) | N/A (no agent references) | No | B- |
| testing | 30 | 5 steps | No | N/A | No | B- |
| security | 30 | 6 steps | No | N/A | No | B- |
| devops | 28 | 5 steps | No | N/A | No | B- |
| design-system | 24 | 5 steps | No | N/A | No | B- |
| seo | 19 | 7 steps (listed, not detailed) | No | N/A | No | C+ |

### Issues

| # | Issue | Location | Severity |
|---|---|---|---|
| Q4 | frontend/SKILL.md line 6 references "Design System Engineer" — agent name is `design-system-architect` | skills/frontend/SKILL.md:6 | Medium |
| Q5 | backend/SKILL.md line 31 references `npx web-god security .` — CLI doesn't have a `security` command | skills/backend/SKILL.md:31 | High |
| Q6 | 7 of 9 skills lack review checklists (only scrollytelling and frontend have them) | All non-scrollytelling/frontend skills | Medium |
| Q7 | 7 of 9 skills lack human checkpoints | All except scrollytelling and frontend | Medium |
| Q8 | seo/SKILL.md is only 19 lines — barely more than a list of steps | skills/seo/SKILL.md | Low |
| Q9 | Skills don't reference their reference docs explicitly ("Consult references/..." only in scrollytelling) | All except scrollytelling | Low |

### Pipeline Ordering Assessment

All skills that define a pipeline use correct ordering:
- Architecture/design before implementation
- Implementation before validation
- No out-of-order dependencies

---

## Iteration 9: Reference Doc Quality

### Per-Reference Assessment

| Reference | Lines | Accuracy | Depth | Currency | Grade |
|---|---|---|---|---|---|
| scrollytelling-principles.md | 146 | Accurate — cognitive science properly cited | Deep — 11 sections covering theory + practice | Current | A+ |
| backend-principles.md | 136 | Accurate — REST, JWT, logging standards correct | Deep — 6 sections with code examples | Current | A |
| design-system-principles.md | 127 | Accurate — token tiers, spacing, typography | Deep — 5 sections with implementation detail | Current | A |
| frontend-principles.md | 111 | Accurate — rendering tree, component taxonomy, state matrix | Good depth — 8 sections | Current | A |
| seo-principles.md | 92 | Accurate — JSON-LD, CWV, Next.js patterns | Adequate depth | Current | B+ |
| testing-principles.md | 79 | Accurate — Testing Diamond, query priority, flaky protocol | Adequate | Current | B+ |
| performance-principles.md | 77 | Accurate — CRP, CWV, GPU properties, bundle optimization | Adequate | Current | B+ |
| devops-principles.md | 67 | Accurate — 12-factor, migration safety, monitoring tiers | Slightly thin | Current | B |
| security-principles.md | 57 | Accurate — OWASP 2021, headers, auth checklist | **Thinnest reference** | **OWASP version is 2021, not 2024/2025** | B- |

### Issues

| # | Issue | Location | Severity |
|---|---|---|---|
| Q10 | Security reference cites "OWASP Top 10 (2021)" — should reference 2024/2025 version or note it's latest | security-principles.md:3 | Medium |
| Q11 | Security reference is 57 lines — significantly thinner than other references (avg 100+ lines) | security-principles.md | Low |
| Q12 | DevOps reference at 67 lines lacks CI/CD tooling specifics (GitHub Actions workflow examples) | devops-principles.md | Low |
| Q13 | No reference doc mentions web-god by name or explains how to use it — they're all standalone knowledge bases | All | Info |

### Factual Accuracy Spot-Checks

- **JWT refresh in httpOnly cookie:** Correct best practice ✓
- **bcrypt cost ≥ 10:** Correct, modern recommendation ✓
- **CLS < 0.1 as Google ranking factor:** Correct as of 2025 ✓
- **INP replaced FID:** Correctly uses INP throughout ✓
- **Testing Diamond model:** Established pattern, properly attributed ✓
- **SSIM thresholds (0.95 static, 0.90 animated):** Reasonable for visual regression ✓
- **50 bits/sec conscious processing:** Widely cited (Miller, Broadbent) ✓
- **Gestalt principles application:** Correctly applied to scroll design ✓

---

## Iteration 10: React Hook Quality

### Per-Hook Deep Review

#### useScrollProgress (60 lines) — Grade: A

- **Types:** Correct. `RefObject<HTMLElement | null>`, returns `number`.
- **SSR:** Safe — browser APIs in useEffect only.
- **Cleanup:** Returns `removeEventListener` ✓
- **Edge cases:** Handles zero-scrollable-height (returns 0), clamps to [0,1], threshold-based deduplication.
- **API:** Clean — `useScrollProgress(ref?, { threshold? })` → `number`.
- **Next.js:** Would work. `'use client'` directive present.

#### useIntersectionObserver (45 lines) — Grade: B+

- **Types:** `RefObject<HTMLDivElement | null>` — should be generic `HTMLElement`.
- **SSR:** Safe.
- **Cleanup:** `observer.disconnect()` ✓
- **Edge cases:** `freezeOnceVisible` works. Null ref handled.
- **Issue:** Ref type is hardcoded to `HTMLDivElement`. Users wanting to observe a `<section>` or `<article>` would need to cast. Should be `HTMLElement`.

#### useLocalStorage (43 lines) — Grade: A

- **Types:** Generic `<T>`, supports function updater pattern.
- **SSR:** Safe — `typeof window === 'undefined'` guard on read.
- **Cleanup:** N/A (no effects to clean up).
- **Edge cases:** JSON parse failure caught, localStorage quota exceeded warned.
- **API:** Mirrors `useState` API with added `removeValue`. Ergonomic.
- **Issue:** `setValue` accesses `window.localStorage` without SSR guard — but it's in a callback, so it only fires from user interaction (client-side). Acceptable.

#### useTheme (65 lines) — Grade: B-

- **Types:** `Theme = 'light' | 'dark' | 'system'`, resolved type separated. Good.
- **SSR:** **NOT SAFE.** Three issues:
  1. Line 32: `localStorage.getItem(storageKey)` in useEffect — technically safe but runs on first client render, causing flash.
  2. Line 42: `document.documentElement.setAttribute(...)` in useEffect — runs on mount, causes FOUC.
  3. Line 49: `window.matchMedia(...)` in useEffect — safe but initial state is `'light'` which may not match.
- **FOUC (Flash of Unstyled Content):** The initial render always uses `resolvedTheme: 'light'` → client then swaps to actual theme. This causes a visible flash in SSR apps.
- **Fix:** Should accept `defaultTheme` prop, use `suppressHydrationWarning`, or inject a blocking script like next-themes does.

#### useKeyboardShortcut (55 lines) — Grade: A

- **Types:** Clean interface for modifier keys.
- **SSR:** Safe — `window` in useEffect.
- **Smart behavior:** Ignores shortcuts in text inputs unless modifier combo is used. This is a thoughtful UX decision.
- **Edge cases:** Case-insensitive key matching.

#### useMediaQuery (25 lines) — Grade: B-

- **Types:** Simple `string → boolean`.
- **SSR:** **NOT SAFE.** Initial state is `useState(false)` — server renders `false`, client may match `true`. Hydration mismatch.
- **Fix:** Should initialize from `window.matchMedia` if available, or accept an SSR default.

#### useReducedMotion (14 lines) — Grade: B

- Delegates to useMediaQuery. Clean composition.
- Inherits useMediaQuery's SSR issue.

#### useDebounce (21 lines) — Grade: A

- **Types:** Generic `<T>`.
- **Cleanup:** `clearTimeout` in useEffect cleanup ✓
- **Edge cases:** None — simple and correct.

#### useLockBodyScroll (39 lines) — Grade: A

- **Types:** Simple `boolean → void`.
- **SSR:** Safe — `window`/`document` in useEffect.
- **Cleanup:** Restores all 4 body style properties + scroll position ✓
- **Edge cases:** `locked = false` early-returns from useEffect.

#### useCopyToClipboard (36 lines) — Grade: B+

- **Types:** Return type should be explicitly typed (currently inferred).
- **Issue:** Missing cleanup — `timeoutRef.current` timeout can fire after unmount. Should add `useEffect(() => () => clearTimeout(timeoutRef.current), [])`.
- **Async handling:** Properly async with try/catch.

### Summary of Hook Issues

| # | Issue | Hook | Severity | Fix |
|---|---|---|---|---|
| Q14 | SSR hydration mismatch — initial `false` doesn't match client | useMediaQuery | High | Initialize from `window.matchMedia` with SSR fallback |
| Q15 | SSR hydration mismatch — inherited from useMediaQuery | useReducedMotion | High | Depends on Q14 fix |
| Q16 | FOUC — initial `'light'` theme flashes before client applies actual | useTheme | High | Accept SSR default, use blocking script pattern |
| Q17 | Missing unmount cleanup for timeout | useCopyToClipboard | Medium | Add `useEffect(() => () => clearTimeout(timeoutRef.current), [])` |
| Q18 | Ref type hardcoded to `HTMLDivElement` | useIntersectionObserver | Low | Change to `HTMLElement` |

---

## Iteration 11: Tool Quality

### `dom-auditor/index.js` — Issues

| # | Issue | Line | Severity | Fix |
|---|---|---|---|---|
| Q19 | PBX-specific "Degular" font name hardcoded | 141 | **P0 Critical** | Replace with configurable expected font or remove check |
| Q20 | `SKIP_CLASSES` includes `__next` (Next.js-specific) | 21 | Low | Acceptable — Next.js is the primary target |
| Q21 | No error message when Playwright not installed | N/A | Low | Add try/catch around require('playwright') |
| Q22 | `waitForTimeout(2000)` — fixed 2-second wait is fragile | 38 | Low | Consider `waitForLoadState('networkidle')` already present; 2s is a belt-and-suspenders. Acceptable. |

### `build-gate/gate.sh` — Issues

| # | Issue | Line | Severity | Fix |
|---|---|---|---|---|
| Q23 | Python3 dependency for JSON parsing | 84 | **P1 High** | Replace with `node -e` or `jq` |
| Q24 | Hardcoded `$PROJECT_ROOT/src` search path | 53, 78, 88, 97 | **P1 High** | Auto-detect or make configurable |
| Q25 | Kill list path used in Python string without sanitization | 84 | P2 Medium | Use parameterized input |
| Q26 | `shift 2>/dev/null || true` on line 11 — silent argument shifting | 11 | Low | Acceptable defensive coding |

### `bin/cli.js` — Issues

| # | Issue | Line | Severity | Fix |
|---|---|---|---|---|
| Q27 | `args.slice(2).join(' ')` passed to `execSync` — potential command injection | 9-10 | **P1 High** | Sanitize arguments or use `execFileSync` with array args |
| Q28 | Only 3 commands (audit, gate, install) but README implies more | N/A | Medium | README lists non-existent tools per domain |

### Playwright Test Suites — Issues

| # | Issue | File | Severity |
|---|---|---|---|
| Q29 | Import path `../scrollytelling.config` doesn't match template location | All 3 test files | Medium — users must copy and rename template |
| Q30 | Tests depend on `@axe-core/playwright` but no package.json declares it | accessibility.spec.ts:13 | Low — it's a template, not a runnable package |
| Q31 | `scrollytellingConfig.scenes` could be empty — no guard | All test files | Low — would produce 0 tests, not a crash |

---

## Iteration 12: Template Quality

### `templates/configs/kill-list.example.json` — Grade: B

- Well-documented with `description` and `notes` fields.
- **Issue (Q32):** Pattern `#00D4FF` appears to be a PBX-specific brand color. Should be replaced with a generic example like `#FF0000` with a comment "Replace with your legacy color values."

### `templates/configs/scrollytelling.config.example.ts` — Grade: A

- Complete interface documentation in the architecture doc.
- Provides a working example scene with trigger.
- Clear instructions: "Copy to tests/scrollytelling.config.ts and customize."

### `templates/prompts/structural-refactor.md` — Grade: A-

- Well-generalized from PBX. Variables section with clear [customize] markers.
- Includes circuit breakers and banned behaviors.
- **Minor:** "git add -A" in commit command could accidentally stage unwanted files. Should recommend `git add <specific-files>`.

### `templates/prompts/visual-polish.md` — Grade: A-

- Well-generalized. Brand constraint variables are clearly marked.
- Includes iteration protocol with screenshot verification.
- **Minor:** Same `git add -A` issue as structural-refactor.

### Template PBX Residue Summary

| # | Issue | File | Severity |
|---|---|---|---|
| Q32 | `#00D4FF` appears PBX-specific | kill-list.example.json | Low |
| Q19 | "Degular" font name | dom-auditor/index.js:141 | **P0** |
| Q33 | Both prompt templates use `git add -A` | structural-refactor.md:17, visual-polish.md:16 | Low |
