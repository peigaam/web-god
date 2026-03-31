# Playwright Autonomous QA System Architecture

The Scrollytelling Factory's QA system validates that built experiences meet the factory's cognitive, performance, and accessibility standards. It operates as 5 test categories, a structured reporting format, and an autonomous healing loop with a 3-strike circuit breaker.

---

## System Overview

The QA system is invoked by the Auditor agent after the Builder agent produces a running Next.js application. It requires:

- **Playwright** with Chromium, Firefox, and WebKit browser engines installed
- **@axe-core/playwright** for accessibility scanning
- **pixelmatch** or **sharp** for visual regression diff computation
- A running instance of the scrollytelling experience (local dev server or deployed URL)
- The upstream spec files (Director storyboard, Choreographer animation spec, Typographer type spec, Compositor composition spec) as validation targets

### Test Execution Order

Tests execute in dependency order. A critical failure in an earlier category can skip later categories to avoid wasting compute on a fundamentally broken build.

| Priority | Category | Blocks Downstream? | Rationale |
|---|---|---|---|
| 1 | Scroll Performance | Yes — if < 30fps, skip visual regression | Screenshots of janky animation are unreliable baselines |
| 2 | Visual Regression | No | Captures state at trigger points regardless of accessibility |
| 3 | Accessibility | No | Independent of visual correctness |
| 4 | Cross-Browser | No | Runs the same performance + visual tests in Firefox and WebKit |
| 5 | Cognitive Load Profile | No — experimental, never blocks | Informational only until H6 falsification threshold is validated |

### Configuration

The test suite reads a `scrollytelling.config.ts` configuration file co-located with the Playwright config. This file maps the Director's storyboard into machine-readable test parameters:

```
interface ScrollytellingConfig {
  baseUrl: string;
  totalScrollHeight: number; // px, measured after Lenis init
  scenes: Scene[];
  goldenBaselineDir: string;
  viewports: Viewport[];
}

interface Scene {
  id: string;          // e.g. "S1-Hero"
  scrollStart: number; // percentage 0-100
  scrollEnd: number;
  triggers: Trigger[];
  cognitiveLoadBudget: number; // 1-5 from Director spec
  vonRestorffTarget: string;  // CSS selector of attention target
}

interface Trigger {
  id: string;         // e.g. "T01"
  scrollPosition: number; // percentage
  description: string;
  isAnimated: boolean;    // true = use relaxed SSIM threshold (0.90)
}

interface Viewport {
  name: string;
  width: number;
  height: number;
}
```

Default viewports:
- `mobile`: 375 x 812
- `tablet`: 768 x 1024
- `desktop`: 1440 x 900

---

## Category 1: Scroll Performance

### Purpose

Enforce the 60fps frame budget during continuous scroll. The Doherty Threshold demands sub-400ms interaction responsiveness; dropped frames during scroll break the cognitive synchronization between the user's physical scroll gesture and the visual response.

### Method

1. Launch Chromium with Chrome DevTools Protocol (CDP) enabled
2. Navigate to the experience URL, wait for Lenis initialization (detect `[data-lenis]` or `html.lenis` attribute)
3. Start a CDP Performance trace via `page.context().newCDPSession(page)` and `Performance.enable()`
4. Execute a controlled smooth scroll from top to bottom at 500px/sec using `page.mouse.wheel()` in increments (simulating realistic scroll behavior, not instant `scrollTo`)
5. Record every frame timestamp from CDP `Performance.getMetrics()` and `requestAnimationFrame` timing injected via `page.evaluate()`
6. Stop the trace and compute:
   - Per-frame duration (ms)
   - Per-scene jank rate: (frames > 16.67ms) / (total frames in scene scroll range)
   - Maximum single-frame time
   - 95th percentile frame time
7. Run the scroll in reverse (bottom to top) to catch asymmetric performance issues (e.g., cleanup failures on scroll-back)

### Thresholds

| Metric | Pass | Warning | Fail |
|---|---|---|---|
| Per-scene jank rate | < 3% | 3-5% | > 5% |
| Max single frame | < 20ms | 20-33ms | > 33ms (below 30fps) |
| 95th percentile frame | < 16.67ms | 16.67-20ms | > 20ms |
| Reverse scroll jank rate | < 5% | 5-8% | > 8% |

### Common Failure Patterns and Diagnostics

| Symptom | Likely Cause | Diagnostic Check |
|---|---|---|
| Jank spike at specific scroll % | Non-GPU property animation at that trigger point | Inspect the trigger map; check for `width`/`height`/`top`/`left` animations |
| Sustained jank across entire scene | Too many simultaneous GSAP tweens | Count active tweens via `gsap.getTweensOf("*")` at that scroll position |
| Jank only on first scroll-through | Image decode blocking main thread | Check if images in that scene have `loading="lazy"` and `decoding="async"` |
| Jank on reverse scroll only | GSAP ScrollTrigger cleanup/reversal issue | Check `toggleActions` config; ensure `onLeaveBack` does not trigger expensive re-renders |

---

## Category 2: Visual Regression

### Purpose

Verify that every scroll trigger point produces the expected visual state. Golden baselines are captured once (during initial approval) and compared against on every subsequent build.

### Method

1. For each viewport in the config:
   a. Set viewport size via `page.setViewportSize()`
   b. Navigate to the experience, wait for Lenis init + LCP
   c. For each trigger in the scene config:
      - Scroll to `trigger.scrollPosition` using Lenis-aware scroll injection (`page.evaluate(() => window.lenis.scrollTo(targetPx, { immediate: true }))`)
      - Wait 300ms for animations to settle (accounts for GSAP easing tails)
      - Capture full-viewport screenshot via `page.screenshot({ fullPage: false })`
      - If a golden baseline exists, compute pixel diff using `pixelmatch`
      - Calculate SSIM score from the diff
2. Store diff images for any failing comparisons in `test-results/visual-diffs/`

### Thresholds

| Scenario | SSIM Threshold |
|---|---|
| Static scene trigger (no animation at capture point) | > 0.95 |
| Animated scene trigger (`isAnimated: true`) | > 0.90 |
| Cross-browser comparison (Chrome vs Firefox/WebKit) | > 0.88 |

### Golden Baseline Management

- **Initial capture:** Run `npx playwright test --update-snapshots` after human approval of the first build
- **Baseline storage:** Committed to the repository under `tests/golden-baselines/{viewport}/{trigger-id}.png`
- **Baseline refresh:** Required when the Director's storyboard changes. The Auditor never auto-approves new baselines — this prevents silent regression
- **Partial refresh:** When only one scene changes, regenerate baselines for that scene's triggers only

---

## Category 3: Accessibility

### Purpose

Validate WCAG 2.1 AA compliance with scrollytelling-specific extensions: each scroll state must be accessible (not just the page-load state), reduced motion must produce a complete experience, and keyboard navigation must follow scroll order.

### Method

#### 3a. axe-core Scan Per Scene State

For each scene in the config:
1. Scroll to scene midpoint
2. Wait for animations to settle
3. Run `@axe-core/playwright` scan: `new AxeBuilder({ page }).analyze()`
4. Filter violations by severity (critical, serious, moderate, minor)
5. Map violations to the specific scene for the report

#### 3b. Contrast Ratio Verification

For each text element visible at each scene's scroll position:
1. Capture the rendered pixel color behind the text element (accounts for parallax backgrounds, overlay opacity, blend modes)
2. Capture the computed text color
3. Calculate the WCAG contrast ratio
4. Fail if body text < 4.5:1 or large text < 3:1

Implementation: inject a script via `page.evaluate()` that uses `getComputedStyle()` for text color and `canvas.drawImage()` of the page screenshot to sample the actual background pixel at the text element's coordinates.

#### 3c. Reduced Motion Validation

1. Emulate reduced motion: `page.emulateMedia({ reducedMotion: 'reduce' })`
2. Scroll through the entire experience at each trigger point
3. At each trigger, verify:
   - No CSS `animation` or `transition` properties with duration > 0 on any visible element (excluding `opacity` transitions under 200ms for graceful fade-in)
   - No GSAP tweens active (inject: `page.evaluate(() => gsap.getTweensOf("*").length === 0)`)
   - No parallax movement (all parallax layers at 1.0x scroll speed)
4. Verify all text content from the Director's storyboard is visible and readable
5. Capture screenshots at each trigger — these form the "reduced motion baseline"

#### 3d. Keyboard Navigation

1. Start focus at the top of the page
2. Press Tab repeatedly, recording the focus order
3. Verify:
   - Focus moves through scenes in scroll order (S1 → S2 → S3 → ...)
   - All interactive elements (buttons, links, form inputs) receive focus
   - Focus is visible (`:focus-visible` indicator present, minimum 2px outline)
   - No focus traps (Tab always advances; only modals may trap focus temporarily)
4. Verify `Escape` key closes any pinned/modal scenes

#### 3e. ARIA Landmark Validation

At the page-load state (before scrolling):
1. Query all elements with `role="region"`, `role="article"`, or equivalent landmark roles
2. Verify each scene section has a landmark with an `aria-label` matching the Director's scene title
3. Verify a `<main>` landmark wraps the scrollytelling content
4. Verify a `<nav>` landmark exists if scroll-position indicators are present

### Severity Classification

| Issue Type | Severity |
|---|---|
| axe-core critical or serious violation | Critical |
| Contrast ratio below threshold | Critical |
| Reduced motion shows active animation | Critical |
| Focus order skips a scene | Major |
| Missing ARIA landmark on a scene | Major |
| axe-core moderate violation | Major |
| Focus indicator below 2px | Minor |
| axe-core minor violation | Minor |

---

## Category 4: Cross-Browser Scroll Behavior

### Purpose

Validate that the scrollytelling experience behaves consistently across Chromium, Firefox, and WebKit (Safari proxy). Lenis smooth scroll, GSAP ScrollTrigger, and CSS scroll-snap implementations vary across engines.

### Method

1. Run the full scroll performance test (Category 1) in each browser engine
2. Run visual regression captures (Category 2) at each trigger point in each browser
3. Compare cross-browser screenshots against the Chromium baseline (SSIM > 0.88)
4. Verify Lenis initialization in each browser:
   - `page.evaluate(() => !!window.lenis)` returns true
   - The `html` element has the `lenis` class applied
   - A test scroll of 100px via `window.lenis.scrollTo(100)` produces smooth interpolated scroll (not instant jump)
5. Emulate touch scroll in each browser: use `page.touchscreen.tap()` followed by touch-drag gestures to verify scroll sensitivity parity

### Known Cross-Browser Issues to Test

| Issue | Chrome | Firefox | WebKit |
|---|---|---|---|
| `will-change: transform` memory | Aggressive optimization OK | Can cause excessive memory use | May disable subpixel antialiasing |
| IntersectionObserver threshold | Precise | Slight timing variation | Slight timing variation |
| `position: sticky` in scroll containers | Full support | Full support | Edge cases with nested containers |
| WebGL context loss | Rare | Possible under memory pressure | Possible on mobile Safari |
| `clip-path` animation performance | GPU-accelerated | May fall back to CPU | GPU-accelerated |

---

## Category 5: Cognitive Load Profile (Experimental)

### Purpose

Compute a heuristic cognitive load score at each scene's midpoint and compare against the Director's budget. This category is informational until the correlation with real engagement metrics is validated (per survivor H6's falsification condition: Pearson r > 0.4 required).

### Method

At each scene's midpoint scroll position:

1. **Element density:** Count visible DOM elements within the viewport rect via `page.evaluate()`:
   ```
   elements = document.querySelectorAll('*')
   visibleCount = [...elements].filter(el => {
     rect = el.getBoundingClientRect()
     return rect.top < viewportHeight && rect.bottom > 0
       && rect.left < viewportWidth && rect.right > 0
       && getComputedStyle(el).display !== 'none'
       && getComputedStyle(el).opacity !== '0'
   }).length
   ```

2. **Color complexity:** Capture a viewport screenshot, sample pixels at a 10x10 grid, count unique hue buckets (quantized to 30-degree increments = 12 max buckets)

3. **Motion count:** Query active GSAP tweens: `gsap.getTweensOf("*").filter(t => t.isActive()).length`

4. **Text density:** Count words visible in viewport via text node extraction

5. **Compute heuristic load score:**
   ```
   score = (elementDensity / 50) * 0.3    // normalized: 50 elements = 1.0
         + (colorBuckets / 8) * 0.2        // normalized: 8 hue buckets = 1.0
         + (motionCount / 3) * 0.3         // normalized: 3 active tweens = 1.0
         + (wordCount / 100) * 0.2         // normalized: 100 words = 1.0
   // Scale to 1-5 range:
   loadScore = Math.min(5, Math.max(1, score * 5))
   ```

6. Compare against Director's budget for that scene. Delta > 1.5 is flagged (warning, not failure).

### Limitations

- This is a proxy metric. High element density might mean "dense data visualization" (expected) or "visual clutter" (bug). Context from the Director's storyboard disambiguates.
- Motion count measures active GSAP tweens at a single point in time. A scene with a staggered animation might read as "1 active tween" if sampled at the right moment.
- The weights (0.3, 0.2, 0.3, 0.2) are initial estimates. Calibrate against real engagement data when available.

---

## Report Output Format

The Auditor produces a single `validation-report.md` file with this structure:

```
# Scrollytelling Validation Report
Generated: {timestamp}
Experience: {url}
Build: {commit hash or build identifier}

## Summary
| Category | Status | Pass | Warn | Fail |
|---|---|---|---|---|
| Scroll Performance | PASS | 8 | 1 | 0 |
| Visual Regression | FAIL | 42 | 0 | 3 |
| Accessibility | PASS | 15 | 2 | 0 |
| Cross-Browser | PASS | 6 | 0 | 0 |
| Cognitive Load | INFO | 5 | 2 | 0 |

## Overall Verdict: FAIL
Reason: 3 visual regression failures in mobile viewport

## Category Details
{detailed tables per category as specified above}

## Diagnostic Report (if failures exist)
{healing loop diagnostic per the Auditor agent's format}

## Healing Loop History (if retries occurred)
| Attempt | Failures | Fix Applied | Result |
|---|---|---|---|
| 1 | T03 mobile SSIM 0.88 | Adjusted stat card margin for mobile | PASS |
| 2 | T07 desktop SSIM 0.84 | Fixed parallax layer z-index overlap | PASS |
| 3 | T12 mobile perf 6.2% jank | Deferred STAR video preload | PASS |
```

---

## Diagnostic Prompt Template

When the Auditor agent needs to propose a fix for the Builder, it uses this structured prompt template to communicate the failure precisely:

```
## Scrollytelling QA Diagnostic

### Failure
- **Test:** {category} > {specific test name}
- **Scene:** {scene ID from Director storyboard}
- **Scroll Position:** {percentage}%
- **Viewport:** {viewport name and dimensions}
- **Browser:** {Chromium | Firefox | WebKit}

### Expected
{What the test expected to see — SSIM threshold, FPS target, contrast ratio, etc.}

### Observed
{What the test actually measured — the number, the screenshot diff path, the axe-core violation ID}

### Root Cause Hypothesis
{Auditor's best assessment:}
- For performance: which specific animation property or asset is likely causing the jank
- For visual regression: which element shifted, which animation state was wrong
- For accessibility: which specific element and WCAG criterion

### Proposed Fix
{Specific, actionable instruction for the Builder:}
- "Convert the background image in Scene 3 from PNG (1.2MB) to WebP (~180KB) and add decoding='async'"
- "Change the stat card entrance animation from animating 'top' to animating 'transform: translateY()'"
- "Add aria-label='{scene title}' to the section element wrapping Scene 4"

### Files to Modify
{List of specific file paths the Builder should touch}

### Re-test Command
{The specific Playwright command to re-run only the failed test}
npx playwright test {test-file} --grep "{test-name}" --project={browser}
```
