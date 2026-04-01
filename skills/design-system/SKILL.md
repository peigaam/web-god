---
name: design-system
description: >
  Designs design token hierarchies, component API conventions, and theming systems
  including dark mode. Targets the W3C DTCG token format.
model: sonnet
---

# Design System Skill

Create a complete design token system with theming and component conventions.

## Pipeline
1. **Primitives** — Define raw values (colors, spacing, typography, shadows, motion)
2. **Semantics** — Map primitives to purposes (primary, text, border, focus)
3. **Theming** — Light/dark mode via Tier 2 token swaps
4. **Components** — Establish API conventions (size, variant, state props)
5. **Documentation** — Storybook or docs site structure

## Token Implementation
CSS custom properties with data-theme attribute for dark mode toggling.
Persist preference in localStorage + respect prefers-color-scheme.

## Component Convention
All components: size (sm/md/lg), variant (solid/outline/ghost), disabled, loading, children, className.

## Review Checklist
- [ ] Token hierarchy follows 3-tier system (primitive → semantic → component)
- [ ] Dark mode implemented via Tier 2 token swap
- [ ] All colors pass WCAG AA contrast in both themes
- [ ] Maximum 2 font families (3 if monospace needed)
- [ ] Component API conventions consistent (size, variant, disabled props)

**Human checkpoint:** Present the token definitions and theme configuration for approval before building components.

Consult `references/design-system-principles.md` for domain-specific guidelines.
