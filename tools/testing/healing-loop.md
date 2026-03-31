# Autonomous Healing Loop

The healing loop is the factory's self-repair mechanism. When the Auditor's Playwright tests fail, the system generates a structured diagnostic, the Builder applies a targeted fix, and the Auditor re-validates. A 3-strike circuit breaker prevents infinite loops.

---

## Flow

```
Auditor runs full test suite
         |
         v
    All pass? ──yes──> Pipeline complete. Report to user.
         |
        no
         |
         v
  Generate Diagnostic Report
  (per failure: what, expected, observed,
   root cause hypothesis, proposed fix)
         |
         v
  Builder implements proposed fix(es)
         |
         v
  Auditor re-runs ONLY failed tests
         |
         v
    All pass? ──yes──> Pipeline complete. Report to user.
         |
        no
         |
         v
  Strike count < 3? ──yes──> Generate new diagnostic (must differ
         |                     from previous — no repeat fixes)
        no                              |
         |                              v
         v                    Builder implements new fix
  ESCALATE to human                     |
  Write escalation report               v
  with full attempt history     Auditor re-runs failed tests
                                        |
                                        v
                                   All pass? ──yes──> Done
                                        |
                                       no
                                        |
                                        v
                                  Strike 3: ESCALATE
```

## Rules

### 1. Targeted re-runs only

After the Builder applies a fix, the Auditor re-runs only the specific tests that failed. It does not re-run the entire suite. This prevents cascading false failures from environmental flakiness and keeps iteration fast.

Re-run command format:
```
npx playwright test {test-file} --grep "{test-name}" --project={browser}
```

### 2. No repeat fixes

Each healing loop iteration must apply a different fix than the previous attempt. If the Auditor proposes the same fix twice, the loop has stopped compounding — escalate immediately rather than burning the third strike.

The diagnostic report includes a "Healing Loop History" table that tracks what was tried:

| Strike | Test | Previous Fix | Result | New Fix |
|---|---|---|---|---|
| 1 | T03 mobile SSIM | Adjusted card margins | Still failing | Changed card layout to flexbox |
| 2 | T03 mobile SSIM | Changed to flexbox | Still failing | ESCALATE — 2 structural fixes failed |

### 3. The 3-strike circuit breaker

- **Strike 1:** First failure. Auditor generates diagnostic. Builder applies fix. Auditor re-runs.
- **Strike 2:** If same test still fails, Auditor generates a new diagnostic with different root cause hypothesis. Builder applies a different fix. Auditor re-runs.
- **Strike 3:** If still failing, ESCALATE. Do not attempt a fourth fix.

The circuit breaker is per-test, not per-suite. If Test A fails and is fixed on Strike 1, but Test B fails on the same run, Test B gets its own 3-strike budget.

### 4. Escalation report format

When the circuit breaker trips, the Auditor writes an escalation report:

```
## ESCALATION — {Test ID}

### Test
{Full test name, category, scene, scroll position}

### Attempts
| Strike | Root Cause Hypothesis | Fix Applied | Result |
|---|---|---|---|
| 1 | ... | ... | Still failing |
| 2 | ... | ... | Still failing |
| 3 | N/A — circuit breaker | N/A | ESCALATED |

### Current State
{What the test currently shows — the exact measurement or screenshot diff}

### Why Automation Failed
{Auditor's honest assessment of why 2 fix attempts did not resolve the issue.
 Common reasons: the root cause is in a library (Lenis/GSAP bug), the issue is
 a design problem not a code problem, or the fix requires architectural changes
 that exceed the Builder's scope}

### Recommended Human Action
{Specific guidance for the human reviewer:
 - "Review the parallax depth in Scene 4 — the Choreographer spec may need
   a shallower differential for this content type"
 - "The GSAP ScrollTrigger pin in Scene 6 causes a Safari-specific rendering
   artifact — consider an alternative pinning strategy"
 - "The contrast ratio failure in Scene 3 is caused by the Compositor's
   blend mode choice — the blend mode creates an unpredictable background
   that cannot be fixed by changing text color alone"}
```

---

## Failure Category Playbooks

Each test category has a diagnostic playbook — a prioritized list of root cause hypotheses the Auditor works through.

### Scroll Performance Failures

| Priority | Hypothesis | Diagnostic Check | Typical Fix |
|---|---|---|---|
| 1 | Non-GPU property animation | Inspect animated properties at failing scroll position | Replace width/height/top/left animation with transform: translate/scale |
| 2 | Too many simultaneous tweens | Count active GSAP tweens at scroll position | Stagger animation starts or reduce animation count per scene |
| 3 | Unoptimized image decode | Check image sizes and loading attributes in failing scene | Add loading="lazy" decoding="async", convert to WebP, reduce dimensions |
| 4 | WebGL shader recompilation | Check if shader compilation occurs during scroll (Chrome DevTools Performance panel) | Move shader compilation to page load, use pre-compiled shaders |
| 5 | Layout thrashing | Check for forced reflows (reading layout properties inside animation loops) | Batch DOM reads before writes, use requestAnimationFrame correctly |
| 6 | Memory pressure | Check total page memory via CDP | Reduce particle counts, dispose of off-screen Three.js scenes, limit texture sizes |

### Visual Regression Failures

| Priority | Hypothesis | Diagnostic Check | Typical Fix |
|---|---|---|---|
| 1 | Layout shift at trigger point | Compare element positions between baseline and current | Fix CSS causing shift — typically missing width/height on images or font loading flash |
| 2 | Animation state mismatch | Check if animation has settled at capture time | Increase settle wait time, or fix GSAP timeline so it completes before scroll reaches trigger |
| 3 | Font rendering difference | Check if web fonts have loaded when screenshot is taken | Add font preload, wait for document.fonts.ready before capture |
| 4 | Responsive breakpoint issue | Compare at exact viewport width — may be hitting a breakpoint edge | Adjust CSS breakpoint or viewport size in test config |
| 5 | Z-index or layer order wrong | Compare visual diff — is an element on top that should be behind? | Fix z-index in Compositor's layer stack |

### Accessibility Failures

| Priority | Hypothesis | Diagnostic Check | Typical Fix |
|---|---|---|---|
| 1 | Contrast ratio below threshold | Get actual computed background color at text position | Darken background overlay opacity, or lighten text, or add text-shadow |
| 2 | Reduced motion animation leak | Identify which animation is not wrapped in prefers-reduced-motion check | Add @media (prefers-reduced-motion: reduce) override or GSAP matchMedia guard |
| 3 | Missing ARIA landmark | Check scene section for role and label attributes | Add role="region" aria-label="{scene title}" to section element |
| 4 | Focus order broken | Check if scene sections use correct DOM order or tabindex | Fix DOM order to match visual/scroll order, remove positive tabindex values |
| 5 | Touch target too small | Measure interactive element dimensions | Increase padding or min-width/min-height to 44x44px |

### Cross-Browser Failures

| Priority | Hypothesis | Diagnostic Check | Typical Fix |
|---|---|---|---|
| 1 | Lenis initialization failure | Check if Lenis class is applied to html in that browser | Verify Lenis version supports the browser; check for ES module compatibility |
| 2 | GSAP easing rendering difference | Compare easing curves visually across browsers | Use standard CSS easing fallbacks; avoid browser-specific timing functions |
| 3 | WebKit sticky positioning bug | Test position:sticky elements in Safari WebKit | Add -webkit-sticky prefix; restructure nested sticky containers |
| 4 | Firefox will-change memory | Check memory usage in Firefox during scroll | Remove will-change from elements not currently animating; apply/remove dynamically |
| 5 | clip-path rendering path | Compare clip-path animations across browsers | Use simpler clip-path shapes; fall back to opacity for Firefox if needed |

---

## Integration with the Auditor Agent

The Auditor agent orchestrates the healing loop by:

1. **Running the tests** via Bash tool: `npx playwright test --reporter=json`
2. **Parsing the JSON report** to identify failures
3. **Looking up the playbook** for each failure category
4. **Working through hypotheses** in priority order, checking the most likely cause first
5. **Writing the diagnostic** using the template from the architecture document
6. **Handing the diagnostic to the Builder** via the Conductor/Skill orchestrator
7. **Tracking strike count** per failing test in the validation report
8. **Escalating** when the circuit breaker trips

The Auditor does not write implementation code. It reads test output, diagnoses, and prescribes. The Builder executes. This separation prevents the QA system from introducing its own bugs.
