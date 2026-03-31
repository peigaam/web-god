# Phase 5: Testing Assessment

**Agent:** Tester | **Iterations:** 15-16 | **Date:** 2026-03-31

---

## Iteration 15: Playwright Test Suite Review

### scroll-performance.spec.ts (290 lines) — Grade: A-

**Would it run?** Yes, with a properly configured `scrollytelling.config.ts` and a running scrollytelling app with Lenis smooth scrolling.

**Assertion Quality:**

| Test | Assertion | Meaningful? | False Pass Risk |
|---|---|---|---|
| Forward scroll 60fps | `scene.maxFrameTime < 33` | Yes — concrete frame budget | Low — directly measures frames |
| Forward scroll jank rate | `scene.jankRate < 0.05` | Yes — per-scene granularity | Low |
| Reverse scroll jank rate | `scene.jankRate < 0.08` | Yes — relaxed for reverse (justified) | Low |
| Layout-triggering animations | `layoutViolations.length === 0` | Yes — checks specific banned properties | **Medium** — only checks CSS transitions, not GSAP. JS-driven layout animations would be missed |

**Threshold Reasonableness:**
- Jank rate 5% forward: Reasonable. 5% means ~6 janked frames per 120 total frames in a scene. Noticeable but not severe.
- Jank rate 8% reverse: Reasonable. GSAP ScrollTrigger reversal is inherently more expensive.
- Max frame 33ms: This is the 30fps floor. Correct — below 30fps is universally perceived as broken.
- P95 frame time tested in computation but not asserted in tests. **Gap:** Should add a P95 assertion.

**Issues:**

| # | Issue | Line | Severity |
|---|---|---|---|
| T1 | Layout violation test (line 250-289) only checks CSS `transitionProperty`, not GSAP animations on layout-triggering properties | 250-289 | Medium |
| T2 | `measureScrollPerformance` uses `requestAnimationFrame` timing, not CDP frame timing. This is less precise than CDP's `Performance.getMetrics()` | 62-108 | Low — architecture.md describes CDP, but the test uses rAF. Both are valid approaches |
| T3 | No P95 frame time assertion (computed but unused in test assertions) | 157 | Low |
| T4 | `stepDelay` calculation assumes constant scroll velocity, but Lenis smoothing changes actual scroll speed | 83-84 | Low — this is an inherent limitation of any scroll simulation |

### visual-regression.spec.ts (156 lines) — Grade: A-

**Would it run?** Yes, with config + app. Uses Playwright's built-in `toMatchSnapshot` which is well-supported.

**Assertion Quality:**

| Test | Assertion | Meaningful? |
|---|---|---|
| Trigger snapshots | `toMatchSnapshot` with configurable `maxDiffPixelRatio` | Yes — direct visual comparison |
| Static triggers | 0.05 max diff | Reasonable (95% match) |
| Animated triggers | 0.10 max diff | Reasonable (90% match, allows for sub-pixel differences) |
| CLS during scroll | `clsScore < 0.1` | Yes — matches Google's CWV threshold |

**Issues:**

| # | Issue | Line | Severity |
|---|---|---|---|
| T5 | CLS test uses `PerformanceObserver` with `buffered: true` which captures shifts from page load, not just scroll. Could inflate scores | 126-128 | Low — conservative (catches more) |
| T6 | `scrollToPercentage` uses `lenis.scrollTo(targetPx, { immediate: true })` — this bypasses Lenis smoothing, so screenshots may not match user-experienced states | 36-47 | Medium — but `waitForAnimationSettle` compensates |

### accessibility.spec.ts (389 lines) — Grade: A

**Would it run?** Yes, with `@axe-core/playwright` installed.

**Test Coverage:**

| Test Category | Tests | Meaningful? |
|---|---|---|
| axe-core per scene state | 1 test per scene | Yes — scrollytelling-specific (tests at scroll positions, not just page load) |
| Reduced motion: no CSS animations | 1 test per scene | Yes — checks computed styles |
| Reduced motion: no GSAP tweens | 1 test per scene | Yes — checks `gsap.getTweensOf("*")` |
| Reduced motion: Von Restorff visible | 1 test per scene | Yes — verifies content accessibility |
| Keyboard Tab order | 1 test | Yes — verifies monotonic scene order |
| Focus indicators | 1 test | Yes — checks outline or box-shadow |
| ARIA landmarks per scene | 1 test per scene | Yes — checks role + aria-label |
| Single `<main>` landmark | 1 test | Yes |

**Assessment:** This is the strongest test file. It tests accessibility at scroll states (novel for scrollytelling), validates reduced motion thoroughly, and checks keyboard navigation order. The axe-core integration filters for critical/serious only, which avoids noise.

**Issues:**

| # | Issue | Line | Severity |
|---|---|---|---|
| T7 | Reduced motion test allows opacity transitions under 200ms — this is permissive but justified (graceful fades) | 150-152 | Info — documented trade-off |
| T8 | Keyboard Tab test assumes `data-scene` attribute on scene sections — this is a convention that must be documented | 253 | Low |

---

## Iteration 16: Test Gap Analysis

### Components with Zero Tests

| Component | Lines | Test Status | Impact |
|---|---|---|---|
| hooks/react/useScrollProgress.ts | 60 | **No tests** | High — complex scroll math |
| hooks/react/useIntersectionObserver.ts | 45 | **No tests** | Medium |
| hooks/react/useLocalStorage.ts | 43 | **No tests** | High — persistence logic |
| hooks/react/useTheme.ts | 65 | **No tests** | High — SSR issues need testing |
| hooks/react/useKeyboardShortcut.ts | 55 | **No tests** | Medium |
| hooks/react/useMediaQuery.ts | 25 | **No tests** | High — SSR issue needs testing |
| hooks/react/useReducedMotion.ts | 14 | **No tests** | Low — thin wrapper |
| hooks/react/useDebounce.ts | 21 | **No tests** | Medium |
| hooks/react/useLockBodyScroll.ts | 39 | **No tests** | Medium |
| hooks/react/useCopyToClipboard.ts | 36 | **No tests** | Medium |
| tools/dom-auditor/index.js | 184 | **No tests** | High — deterministic tool should be tested |
| tools/build-gate/gate.sh | 179 | **No tests** | High — build integrity checker should verify itself |
| skills/scrollytelling/scripts/evaluator.py | 405 | **No tests** | High — 405-line Python script with zero tests |
| bin/cli.js | 21 | **No tests** | Low — thin CLI wrapper |

**Total testable code with zero tests: 1,192 lines (100% of executable code)**

### Recommended Minimal Test Suite for React Hooks

```
hooks/react/__tests__/
├── useScrollProgress.test.ts     # Test: scroll calculation, threshold, cleanup
├── useMediaQuery.test.ts         # Test: SSR behavior, match/unmatch, listener cleanup
├── useTheme.test.ts              # Test: SSR behavior, localStorage, system pref, DOM update
├── useLocalStorage.test.ts       # Test: get/set/remove, JSON parsing, SSR guard
├── useKeyboardShortcut.test.ts   # Test: modifier combos, input field ignore, cleanup
├── useDebounce.test.ts           # Test: delay behavior, cleanup on unmount
├── useIntersectionObserver.test.ts  # Test: observe/disconnect, freeze behavior
├── useLockBodyScroll.test.ts     # Test: style application, scroll position restore
├── useCopyToClipboard.test.ts    # Test: clipboard API, error handling, timeout cleanup
```

**Priority order:**
1. useMediaQuery (SSR bug needs verification)
2. useTheme (SSR bug needs verification)
3. useLocalStorage (persistence edge cases)
4. useScrollProgress (complex math)
5. Others (lower risk)

### Recommended Tests for Tools

```
tools/__tests__/
├── dom-auditor.test.js           # Test: overflow detection, contrast calculation, skip logic
├── gate.test.sh                  # Test: framework detection, kill list parsing, exit codes
```

**Key tests for dom-auditor:**
- Test contrast ratio calculation against known RGB pairs
- Test overflow detection with mock DOM
- Test `shouldSkip` logic for various elements
- Test the 25-issue cap

**Key tests for gate.sh:**
- Test framework auto-detection (create temp dirs with next.config.js, vite.config.ts)
- Test kill list JSON parsing (with and without Python3)
- Test exit codes (0 for pass, 1 for fail)
- Test behavior with no `src/` directory

### Missing CI Infrastructure

**No GitHub Actions workflow exists.** For a package claiming production-quality tooling, this is a significant gap.

Recommended `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx tsc --noEmit        # Type check hooks
      - run: npm test                 # Unit tests (when added)
      - run: shellcheck tools/build-gate/gate.sh hooks/git/*  # Shell lint
```

### Evaluator.py Test Gap

`skills/scrollytelling/scripts/evaluator.py` is 405 lines of Python with zero tests. It's the largest single script in the repo. Key test areas:
- Input parsing (scrollytelling config)
- Score computation (cognitive load formula)
- Threshold comparison logic
- Output formatting

---

## Test Assessment Summary

| # | Gap | Priority | Effort |
|---|---|---|---|
| T9 | Zero tests for 10 React hooks (1,192 lines untested) | **P0** | Large — ~500 lines of tests |
| T10 | Zero tests for dom-auditor (184 lines) | P1 | Medium — ~200 lines of tests |
| T11 | Zero tests for gate.sh (179 lines) | P1 | Medium — ~100 lines of shell tests |
| T12 | Zero tests for evaluator.py (405 lines) | P1 | Medium — ~200 lines of Python tests |
| T13 | No GitHub Actions CI workflow | P1 | Small — ~30 lines YAML |
| T14 | No shellcheck linting for shell scripts | P2 | Small — add to CI |
| T15 | Playwright test import path mismatch with template location | P2 | Small — document or restructure |
