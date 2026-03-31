---
name: design-system
description: >
  Design system creation skill. Use when "create design system", "design tokens",
  "component library", "dark mode", "theme", "brand colors".
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
