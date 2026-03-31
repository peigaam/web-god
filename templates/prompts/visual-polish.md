# VISUAL POLISH — Multi-Iteration Pass
# Generalized from web-god. Customize the variables below for your project.

## PROJECT VARIABLES (customize these)

- **Branch:** `feature/visual-polish`
- **Dev server:** `npm run dev` (localhost:3000)
- **Brand font:** [Your font family]
- **Accent color:** [Your accent hex]
- **Body text color:** [Your body text color]
- **Background:** [Your bg color(s)]

## ITERATION PROTOCOL (8 iterations)

### Per-Iteration Cycle (MANDATORY)
1. **Screenshot** — Playwright at 1440x900 AND 375x812, viewport-only, JPEG quality 70
2. **Diagnose** — Be specific about what's wrong
3. **Fix** — Target the exact file and code
4. **Build check** — `npm run build` must pass (or `bash tools/build-gate/gate.sh`)
5. **Re-screenshot** — Verify the fix visually
6. **Commit** — `git add -A && git commit -m "fix(polish): iter N — [what]"`
7. **Push** every 3rd iteration

### Common Polish Targets
- Scroll pacing (section heights, animation thresholds)
- Card/component glow and border treatments
- Background differentiation between sections
- Typography hierarchy and spacing
- Touch targets on mobile (44px minimum)
- Contrast ratios (WCAG AA: 4.5:1 body, 3:1 large)
- Font loading and fallback detection

## BRAND CONSTRAINTS (customize)
- Font: [primary] (headlines), [secondary] (body)
- Accent: [color] — NOT [old color]
- Dark backgrounds only / Light backgrounds only / Both
- Body text: [color] (off-white / dark gray / etc)
- WCAG AA contrast on all text
- Touch targets 44px+ on mobile

## BANNED BEHAVIORS
- Adding or removing major sections (fix what's there)
- Changing font families or brand colors
- fullPage screenshots (viewport-only ALWAYS)
- Reverting without 5+ debug attempts
- Self-rating ("I'd give this an 8/10")
- Restarting dev server instead of fixing code

## CIRCUIT BREAKERS
- 3 consecutive build failures on same issue → STOP, commit WIP, push
- Component exceeds reasonable size → refactor before continuing
- Dev server crashes 3x → STOP
