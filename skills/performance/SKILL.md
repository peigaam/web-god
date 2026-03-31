---
name: performance
description: >
  Web performance audit and optimization skill. Use when "optimize performance", "site is
  slow", "improve Core Web Vitals", "reduce bundle size".
---

# Performance Skill

Measure, diagnose, and optimize web application performance.

## Pipeline
1. **Measure** — Capture baseline Core Web Vitals + bundle analysis
2. **Diagnose** — Identify root causes using the profiler's decision trees
3. **Prescribe** — Produce prioritized optimization plan (impact/effort ratio)
4. **Implement** — Apply one optimization at a time, re-measure after each
5. **Validate** — Confirm metrics are within budget

## Quick Commands
```bash
# Lighthouse audit
npx lighthouse http://localhost:3000 --output json --chrome-flags="--headless"

# Bundle analysis (Next.js)
ANALYZE=true npm run build

# DOM audit
node tools/dom-auditor/index.js http://localhost:3000
```

## Performance Budget
LCP < 2.5s, INP < 200ms, CLS < 0.1, TBT < 200ms, JS < 200KB initial, TTFB < 800ms.

## Review Checklist
- [ ] Baseline Core Web Vitals captured (LCP, INP, CLS, TBT, TTFB)
- [ ] Root causes identified for each failing metric
- [ ] Optimizations prioritized by impact/effort ratio
- [ ] One optimization applied at a time with re-measurement
- [ ] Performance budget thresholds met after optimization

**Human checkpoint:** Present the baseline measurements and optimization plan for approval before implementing changes.

Consult `references/performance-principles.md` for domain-specific guidelines.
