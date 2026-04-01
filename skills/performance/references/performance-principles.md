# Web Performance Principles

---

## 1. The Critical Rendering Path

Browser renders in this order:
1. Parse HTML → build DOM tree
2. Parse CSS → build CSSOM tree
3. Combine → Render tree
4. Layout (compute geometry)
5. Paint (fill pixels)
6. Composite (layer assembly)

**Blocking resources:** CSS blocks rendering. JS blocks HTML parsing (unless async/defer).
**Optimization target:** Minimize resources that block steps 1-3. Everything else can be deferred.

## 2. Core Web Vitals Deep Dive

**Note:** Google periodically tightens CWV thresholds. The values below reflect
the official web.dev documentation as of early 2026. Always verify current thresholds
at https://web.dev/vitals/ before setting project budgets. Some industry sources
report tightened targets (INP 150ms, LCP 2.0s) but these have not been confirmed
in official Google documentation.

### LCP (Largest Contentful Paint) — Loading
What it measures: Time until the largest visible element renders.
LCP elements: images, video posters, background images via url(), block-level text.
Common causes of slow LCP:
- Slow server response (TTFB > 600ms)
- Render-blocking CSS/JS
- Slow resource load (unoptimized image, no preload)
- Client-side rendering (content not in initial HTML)

### INP (Interaction to Next Paint) — Responsiveness
What it measures: Worst-case delay between user input and visual response.
Common causes of slow INP:
- Long tasks on main thread (>50ms)
- Heavy React re-renders on interaction
- Synchronous storage access (localStorage in render path)
- Third-party scripts blocking main thread

### CLS (Cumulative Layout Shift) — Visual Stability
What it measures: Sum of unexpected layout shifts during page lifetime.
Common causes of high CLS:
- Images/iframes without dimensions
- Dynamically injected content above fold
- Web fonts causing text reflow (FOUT)
- Late-loading ads or embeds

## 3. The GPU-Safe Property List

Only these properties can be animated at 60fps without layout/paint:
- `transform` (translate, scale, rotate) — GPU composited
- `opacity` — GPU composited
- `filter` (blur, brightness) — GPU composited, but expensive
- `clip-path` — GPU composited in modern browsers

Everything else triggers layout or paint:
- `width`, `height`, `top`, `left` → layout + paint + composite
- `margin`, `padding` → layout + paint + composite
- `border-radius` → paint + composite
- `box-shadow` → paint + composite (very expensive to animate)
- `color`, `background` → paint + composite

## 4. Bundle Optimization Hierarchy

1. **Don't ship it** — Remove unused code, dead dependencies
2. **Ship less** — Tree-shaking, code splitting, dynamic imports
3. **Ship it smaller** — Minification, compression (gzip/brotli)
4. **Ship it later** — Lazy loading, prefetching, defer
5. **Ship it faster** — CDN, edge caching, preconnect

## 5. Image Optimization Checklist

| Format | Use For | Size vs JPEG |
|---|---|---|
| AVIF | Photos, complex images | 50% smaller |
| WebP | Photos, illustrations | 30% smaller |
| PNG | Icons, logos with transparency | Varies |
| SVG | Icons, logos, illustrations | Infinitely scalable |

Rules: AVIF > WebP > JPEG for photos. SVG for icons. PNG only when transparency needed and SVG won't work.
