# Phase 2: Architecture Review

**Agent:** Strategist | **Iterations:** 4-6 | **Date:** 2026-03-31

---

## 1. Domain Completeness Assessment

### Per-Domain Evaluation

| Domain | Agent Coverage | Skill Quality | Reference Depth | Grade | Gap |
|---|---|---|---|---|---|
| Frontend | architect + builder + component-designer (3 agents) | Strong pipeline with human checkpoint | 111 lines, solid principles | A | None — best covered domain |
| Backend | api-architect (1 agent) | Adequate 3-step pipeline | 136 lines, comprehensive | B+ | Missing: database agent, caching specialist |
| Scrollytelling | director + choreographer + typographer + compositor + auditor (5 agents) | Exceptional 8-step pipeline (174 lines) | 146 lines, cognitively grounded | A+ | None — deepest domain by far |
| Performance | profiler (1 agent) | Adequate 5-step pipeline | 77 lines, solid | B | Missing: runtime profiler, bundle analyzer agent |
| Security | threat-modeler (1 agent) | Adequate 6-step pipeline | 57 lines — thinnest reference | B- | Missing: pen-test agent, dependency auditor |
| SEO | seo-auditor (1 agent) | Minimal 7-step pipeline (19 lines) | 92 lines, good | B | Skill too thin — just a checklist |
| Testing | test-architect (1 agent) | Adequate 5-step pipeline | 79 lines, practical | B | Missing: test implementation agent |
| DevOps | deploy-planner (1 agent) | Adequate 5-step pipeline | 67 lines | B | Missing: monitoring agent |
| Design System | token-architect (1 agent) | Adequate 5-step pipeline | 127 lines, thorough | B+ | Missing: component library builder |

### Architectural Imbalance

The package has a **dramatic asymmetry**: scrollytelling gets 5 agents + 1 evaluator script + 3 test suites + config template, while every other domain gets exactly 1 agent. This creates two tiers:

- **Tier 1 (deep):** Scrollytelling (5 agents, 544 lines), Frontend (3 agents, 383 lines)
- **Tier 2 (shallow):** All other 7 domains (1 agent each, 68-84 lines)

**Assessment:** This is not necessarily wrong — scrollytelling is the differentiating feature. But the README presents all 9 domains as equals, which is misleading. Consider either: (a) deepening other domains, or (b) positioning scrollytelling as the primary feature with other domains as supporting.

### What a Senior Engineer Would Need But Can't Find

1. **State management agent** — State architecture decisions are the #1 source of frontend bugs. Currently handled as a subsection of frontend-architect, but deserves its own agent or deeper coverage.
2. **Database migration agent** — Backend agent handles schema but not migration strategy in depth.
3. **API integration/client agent** — Frontend agents handle rendering but there's no dedicated agent for API client patterns (React Query setup, error handling, optimistic updates as a focused topic).
4. **Monitoring/observability agent** — DevOps agent covers deployment but post-deploy monitoring is a paragraph, not a workflow.
5. **Accessibility specialist agent** — Referenced by frontend-builder as "Auditor (a11y)" but doesn't exist. The scrollytelling-auditor handles a11y within scrollytelling only.

---

## 2. Agent Architecture Evaluation

### Agent Sizing Analysis

| Size Category | Agents | Assessment |
|---|---|---|
| Large (100+ lines) | architect, builder, director, choreographer, compositor, typographer, auditor | Detailed, actionable instructions |
| Medium (70-99 lines) | api-architect, deploy-planner, profiler, component-designer, threat-modeler, seo-auditor, test-architect | Adequate but could be deeper |
| Small (< 70 lines) | token-architect (68 lines) | Borderline — covers the basics |

### Responsibility Boundaries

**Clean boundaries:**
- Scrollytelling pipeline has excellent separation: Director (narrative) → Choreographer (motion) → Typographer (text) → Compositor (visual) → Auditor (QA). Each agent has a clear, non-overlapping domain.
- Frontend pipeline: Architect (decisions) → Component Designer (APIs) → Builder (code). Clean separation.

**Blurry boundaries:**
- `api-architect` produces both API contracts AND database schemas AND auth design. This could be 3 agents, but the current scope is manageable for a single agent.
- `deploy-planner` covers CI/CD, Docker, environment vars, deployment strategies, and monitoring. This is broad but each section is a page or less.

### Human Checkpoint Consistency

| Skill | Has Checkpoint? | Placement |
|---|---|---|
| frontend | Yes | After ADR (Step 1) |
| scrollytelling | Yes | After storyboard (Step 2) |
| backend | No | Should have one after API spec |
| performance | No | Acceptable — measurement before action |
| security | No | Should have one after threat model |
| seo | No | Acceptable — audit is read-only |
| testing | No | Acceptable — strategy before implementation |
| devops | No | Should have one after pipeline design |
| design-system | No | Should have one after token definition |

**Issue:** Only 2/9 skills have human checkpoints. The prompt says "Is the human checkpoint pattern applied consistently?" — No, it is not. Backend, security, devops, and design-system should have checkpoints after their architecture/design phases.

### Per-Agent Grades

| Agent | Grade | Rationale |
|---|---|---|
| frontend-architect | A | Comprehensive ADR, clear taxonomy, state matrix |
| frontend-builder | A | Excellent code patterns, build order, checklists |
| frontend-component-designer | A- | Clear prop system, accessibility contracts |
| backend-api-architect | B+ | Complete but could have more examples |
| scrollytelling-director | A | Cognitively grounded, Duarte methodology well-applied |
| scrollytelling-choreographer | A | Precise trigger maps, parallax system, easing vocabulary |
| scrollytelling-typographer | A | Reading-pace sync, kinetic type taxonomy |
| scrollytelling-compositor | A | Layer stacks, color narrative, asset strategy |
| scrollytelling-auditor | A+ | Healing loop, circuit breaker, 5 test categories |
| performance-profiler | B+ | Good diagnostics but prescriptions could be more specific |
| security-threat-modeler | B+ | Solid STRIDE + OWASP, good checklist |
| seo-auditor | B | Adequate coverage, could use more Next.js specifics |
| test-architect | B+ | Testing Diamond is good, anti-patterns well-identified |
| devops-deploy-planner | B | Covers basics, monitoring section thin |
| design-system-architect | B | Token system excellent, could add more on motion/animation tokens |

---

## 3. Tool & Hook Evaluation

### `tools/dom-auditor/index.js` — Grade: B

**Strengths:**
- Project-agnostic viewport testing (Mobile, Tablet, Desktop)
- 6 check categories: overflow, small text, touch targets, contrast, font fallback, edge touch
- Deduplication of issues via `seen` Set
- Cap at 25 issues per viewport (prevents noise)

**Issues:**
- **PBX-specific residue (P0):** Line 141 references "Degular" font by name: `expected Degular/custom font`. This is a hardcoded reference to a specific project's font — must be removed or made configurable.
- **Non-Next.js sites:** Works on any site via Playwright URL parameter. However, `SKIP_CLASSES` includes `__next` (Next.js-specific) and `gsap`, `lenis`, `scroll` — somewhat framework-specific filtering.
- **No error for missing Playwright:** If Playwright isn't installed, `require('playwright')` throws a generic module-not-found error. Should provide a helpful message.
- **CommonJS only:** Uses `require()` — no ESM support. Minor issue.

### `tools/build-gate/gate.sh` — Grade: B-

**Strengths:**
- Framework auto-detection (Next.js, Vite, Remix, generic)
- 5-step pipeline (orphan imports, kill list, TypeScript, build, DOM audit)
- Clear pass/fail/warning verdicts

**Issues:**
- **Python3 dependency (P1):** Line 84 uses `python3 -c` to parse JSON kill list. Should use `node -e` or `jq` for portability. Many CI environments may not have Python3 available.
- **Hardcoded `src/` path (P1):** Lines 53, 78, 88, 97-98 all search in `$PROJECT_ROOT/src`. Projects using `app/`, `lib/`, or root-level files will get no coverage. Should be configurable or auto-detect.
- **macOS vs Linux:** Uses `wc -l | tr -d ' '` — this works on both. `grep -rn` is standard. No bash-isms that would break on Ubuntu. POSIX-compatible overall.
- **Kill list command injection risk (P2):** Line 84: `python3 -c "...json.load(open('$KILL_LIST'))..."` — the `$KILL_LIST` path is used directly in a Python string. A malicious path containing `'))...` could inject Python code. Low risk (requires attacker-controlled file path), but should use parameterized input.

### `hooks/react/*.ts` — Grade: B+

**SSR Safety Analysis:**

| Hook | SSR-Safe? | Issue |
|---|---|---|
| useScrollProgress | Yes | Browser APIs in useEffect only |
| useMediaQuery | **NO** | Initial state `false` causes hydration mismatch |
| useDebounce | Yes | Pure React, no browser APIs |
| useIntersectionObserver | Yes | Browser APIs in useEffect only |
| useKeyboardShortcut | Yes | `window` access in useEffect only |
| useLocalStorage | Yes | `typeof window === 'undefined'` guard present |
| useLockBodyScroll | Yes | Browser APIs in useEffect only |
| useTheme | **NO** | `localStorage.getItem()` outside useEffect (line 32), `document.documentElement` outside guard (lines 42-43) |
| useCopyToClipboard | Yes | `navigator.clipboard` in callback only |
| useReducedMotion | **NO** | Inherits useMediaQuery's SSR issue |

**Other Issues:**
- **useCopyToClipboard:** Missing cleanup of timeout on unmount. `timeoutRef.current` timeout fires after unmount, calling `setCopied(false)` on unmounted component. Should add `useEffect(() => () => clearTimeout(timeoutRef.current), [])`.
- **useIntersectionObserver:** Hardcoded to `HTMLDivElement` ref type — should be generic `HTMLElement`.
- **useTheme:** Three separate useEffect hooks for initialization, DOM application, and system preference listening. Could be simplified but functional as-is.

**Overall:** Hooks are clean, well-typed, and well-documented with JSDoc + examples. The SSR issues in useMediaQuery, useReducedMotion, and useTheme are the main concerns.

### `hooks/git/*` — Grade: A-

**Strengths:**
- Follow Husky conventions with clear install instructions
- pre-commit: lint-staged + debug artifact detection + .env file protection
- commit-msg: commitlint with fallback regex validation
- pre-push: TypeScript + tests + build gate

**Issues:**
- **pre-push runs full build** — this can be slow (minutes). Some teams prefer pre-push to only run types + tests, with build verification in CI. The README doesn't mention this trade-off.
- **commit-msg fallback regex** doesn't validate scope parentheses properly — `feat): description` would pass.
- All hooks are well-documented in README.md with setup instructions. Solid.

### Playwright Test Suites — Grade: A-

**Assessment:**
- All 3 test files (scroll-performance, visual-regression, accessibility) are production-quality templates
- They import from `../scrollytelling.config` — the config file needs to exist at `tools/scrollytelling.config.ts` for the imports to resolve. Users must copy the template config from `templates/configs/`.
- Tests are well-structured with helpers, proper cleanup, and meaningful assertions
- Thresholds are reasonable (SSIM 0.95 static / 0.90 animated, jank rate 5%, CLS 0.1)
- The cognitive load profiler (Category 5) is appropriately marked as experimental
- **Would they run?** Yes, with proper config and a running scrollytelling app. They are templates, not ready-to-run tests.
