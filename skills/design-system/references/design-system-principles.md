# Design System Principles

---

## 1. The Token Hierarchy

Tokens are the single source of truth for all visual values. No magic numbers in components.

### Tier 1: Primitives
Raw values with no semantic meaning. Named by their visual property.
```
color.blue.500: #3B82F6
color.gray.900: #111827
spacing.4: 16px
radius.md: 8px
```

### Tier 2: Semantic
Map primitives to purposes. These change between themes (light/dark).
```
color.primary: {color.blue.500}
color.text.default: {color.gray.900}     → dark: {color.gray.50}
color.bg.default: {color.white}          → dark: {color.gray.950}
color.border.default: {color.gray.200}   → dark: {color.gray.800}
```

### Tier 3: Component
Override semantic tokens for specific components. Use sparingly.
```
button.bg.primary: {color.primary}
button.text.primary: {color.white}
card.shadow: {shadow.md}
```

**Rule:** Components reference Tier 2 or 3. Never Tier 1 directly.

## 2. Spacing System

Use a consistent base unit (4px recommended) with a limited scale:

| Token | Value | Use |
|---|---|---|
| 0 | 0px | Reset |
| 0.5 | 2px | Hairline borders |
| 1 | 4px | Tight inner padding |
| 2 | 8px | Default inner padding |
| 3 | 12px | Compact gaps |
| 4 | 16px | Default component gap |
| 5 | 20px | Medium spacing |
| 6 | 24px | Section inner padding |
| 8 | 32px | Section gaps |
| 10 | 40px | Large section gaps |
| 12 | 48px | Page section spacing |
| 16 | 64px | Major divisions |

**Rule:** Only use values from the scale. If you need 13px, question the design.

## 3. Color System Architecture

### Functional Color Categories
- **Brand:** Primary, secondary — identity colors
- **Neutral:** Gray scale — text, backgrounds, borders
- **Feedback:** Success (green), warning (amber), error (red), info (blue)
- **Interactive:** Focus ring, hover states, active states

### Dark Mode Implementation
Dark mode = Tier 2 token swap. Tier 1 primitives stay the same.

Light: `color.bg.default: white` → Dark: `color.bg.default: gray.950`
Light: `color.text.default: gray.900` → Dark: `color.text.default: gray.50`

**Rules:**
- Don't invert. Dark backgrounds need different saturation/lightness than light.
- Reduce contrast slightly in dark mode (pure white on pure black is harsh).
- Colored elements (buttons, badges) may need lighter shades in dark mode.
- Test every color combination for WCAG AA contrast in BOTH themes.

## 4. Typography Scale

Use a modular scale with consistent line-heights:

| Name | Size | Line Height | Weight | Use |
|---|---|---|---|---|
| xs | 12px | 16px (1.33) | 400 | Captions, fine print |
| sm | 14px | 20px (1.43) | 400 | Secondary text, metadata |
| base | 16px | 24px (1.5) | 400 | Body text (the anchor) |
| lg | 18px | 28px (1.56) | 400 | Lead paragraphs |
| xl | 20px | 28px (1.4) | 600 | Card titles |
| 2xl | 24px | 32px (1.33) | 600 | Section headings |
| 3xl | 30px | 36px (1.2) | 700 | Page titles |
| 4xl | 36px | 40px (1.11) | 700 | Hero headings |

**Rules:**
- Maximum 2 font families (display + body). 3 if monospace needed.
- body ≥ 16px on all devices. Below 16px, iOS Safari zooms on input focus.
- Line height ≥ 1.4 for body text (readability).
- Line height ≤ 1.2 for large display text (visual tightness).
- Maximum line length: 65-75 characters (optimal reading measure).

## 5. Component API Conventions

### Universal Props (every component)
```typescript
size?: 'sm' | 'md' | 'lg'              // default: 'md'
variant?: 'solid' | 'outline' | 'ghost'  // default: context-dependent
disabled?: boolean                       // never 'isDisabled'
className?: string                       // escape hatch
children?: ReactNode                     // primary content
```

### Interactive Component Contract
```typescript
// Every interactive component MUST implement:
onFocus?: (e: FocusEvent) => void
onBlur?: (e: FocusEvent) => void
tabIndex?: number                       // default: 0
aria-label?: string                     // required if no visible text
aria-describedby?: string               // for error messages, help text
```

### State Convention
```
default → hover → focus → active → disabled
         loading → loaded → error (for async)
```

Visual: each state must be visually distinguishable. Focus ≠ hover. Disabled ≠ inactive.
