# Frontend Architecture Principles

Shared knowledge base for all frontend agents. These principles are non-negotiable constraints that inform every architecture and implementation decision.

---

## 1. The Rendering Decision Tree

```
Does this page need SEO?
  YES → Does it change frequently?
    YES → SSR (revalidate on request or ISR with interval)
    NO  → SSG (build-time static)
  NO  → Does it need data at request time?
    YES → SSR or CSR with loading state
    NO  → SSG or CSR (client-only)
```

Rules:
- Default to Server Components (zero client JS). Escalate to client only when interactivity demands it.
- SSG > ISR > SSR > CSR in performance. Use the leftmost option that satisfies your requirements.
- Marketing pages are always SSG. Dashboards are usually SSR. Settings pages can be CSR.

## 2. The Component Taxonomy

| Type | Characteristics | State | Side Effects | Examples |
|---|---|---|---|---|
| Page | Maps to a route, composes features | None (passes data down) | Data fetching via Server Components | `app/dashboard/page.tsx` |
| Feature | Vertical business slice, self-contained | Owns its state | Data fetching, mutations | `features/projects/ProjectList` |
| UI | Presentation only, maximally reusable | Props only (controlled) | None | `ui/Button`, `ui/Card` |
| Layout | Structural positioning | None | None | `ui/Stack`, `ui/Grid`, `app/layout.tsx` |
| Provider | Context injection | Manages shared state | Context creation | `providers/AuthProvider` |

**The Single Responsibility Test:** If you can't describe a component's purpose in one sentence without using "and," split it.

## 3. State Management Decision Matrix

| Question | Mechanism |
|---|---|
| Data from an API? | Server state (React Query, SWR, Server Components) |
| Form input values? | Form state (React Hook Form, useActionState) |
| UI toggle in one component? | Local state (useState) |
| UI state shared across components? | Shared client state (Zustand, Jotai) |
| Should survive page refresh? | URL state (searchParams, nuqs) |
| User identity/session? | Auth state (Context + server session) |

**The "Where Does This State Live?" Test:**
1. Can it be derived from existing state? → Don't store it. Compute it.
2. Does only one component need it? → useState in that component.
3. Does it need to be in the URL? → searchParams.
4. Does it come from the server? → Server state (React Query).
5. Multiple components need it? → Zustand/Jotai (last resort for client state).

## 4. Performance Budget

| Metric | Budget | Why |
|---|---|---|
| First Contentful Paint | < 1.8s | User perceives site as loading |
| Largest Contentful Paint | < 2.5s | Google ranking factor |
| Interaction to Next Paint | < 200ms | Doherty Threshold — feels instant |
| Cumulative Layout Shift | < 0.1 | Visual stability, Google ranking |
| Total Blocking Time | < 200ms | Main thread availability |
| Initial JS bundle | < 200KB gzipped | Parse/execute cost on mobile |
| Initial CSS | < 50KB gzipped | Render-blocking resource |
| Web font files | < 4 files, < 200KB | Render-blocking if not optimized |

## 5. Accessibility Baseline (WCAG 2.1 AA)

Non-negotiable requirements for every component:

- **Color contrast:** 4.5:1 for body text, 3:1 for large text (≥18px bold or ≥24px)
- **Keyboard navigation:** All interactive elements reachable via Tab. Logical focus order.
- **Focus indicators:** Visible focus ring on all interactive elements (min 2px)
- **Touch targets:** Minimum 44x44px on mobile
- **Screen readers:** Semantic HTML, ARIA labels on icons, alt text on images
- **Reduced motion:** `prefers-reduced-motion` disables all non-essential animation
- **Error identification:** Form errors announced to screen readers, associated with inputs

## 6. Error Handling Hierarchy

```
Global (app/error.tsx)
  └── Route Group ((auth)/error.tsx)
       └── Feature (features/dashboard/error.tsx)
            └── Component (ErrorBoundary around risky widgets)
                 └── Inline (try/catch in event handlers, .catch on promises)
```

Rules:
- Every level shows: what went wrong + how to recover + alternative navigation
- Never show stack traces to users
- Log errors with context (user ID, route, action attempted)
- Error boundaries don't catch: event handlers, async code, SSR errors, errors in the boundary itself

## 7. Image Strategy

1. Use `next/image` (or equivalent framework image component) for ALL images
2. Serve modern formats: AVIF > WebP > JPEG (automatic with next/image)
3. Set explicit `width` and `height` on every image (prevents CLS)
4. LCP image: `priority={true}` + `fetchPriority="high"`
5. Below-fold images: `loading="lazy"` (default in next/image)
6. Responsive: Use `sizes` prop to serve appropriate size per viewport
7. Never serve a 2000px image for a 400px container

## 8. Font Strategy

1. Use `next/font` for automatic self-hosting and zero-CLS font loading
2. Maximum 2 font families (1 display/heading + 1 body)
3. Use variable fonts to reduce total file count
4. Subset to required character ranges for non-Latin scripts
5. `font-display: swap` for critical fonts, `optional` for decorative fonts
