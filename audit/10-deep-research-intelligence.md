# Deep Research Intelligence Report

**40-Agent Web Intelligence Sweep | Date: 2026-03-31**
**Agents deployed:** 40 | **Web searches performed:** ~120 | **Sources cited:** ~200+

---

## 1. VALIDATED — What web-god already does correctly

| Finding | Source | Confidence |
|---|---|---|
| **Scrollytelling pipeline is genuinely unique** — no competing AI-powered multi-agent scrollytelling pipeline exists in the Claude Code ecosystem or elsewhere | M1, M2, M32 | High |
| **GSAP + Lenis is the correct production stack** — GSAP 3.13 stable, all plugins now free (Webflow acquisition); Lenis 1.3.21 is industry standard | M3, M4 | High |
| **Frontend architecture gap is real** — v0/Cursor/Windsurf don't encode architecture decisions; web-god's ADR output fills a confirmed gap | M5 | High |
| **Conductor → Specialist → Validator pattern is industry-standard** — confirmed by LangGraph, CrewAI, Azure, Osmani | M6 | High |
| **Shell scripts + Node tools is the RIGHT approach** over MCP for local dev tooling | Earlier research | High |
| **Duarte sparkline → scroll mapping is novel** — no one has formally applied Resonate to web scrollytelling; web-god is first-mover | M18 | High |
| **Cognitive science grounding is validated** — 50 bits/sec bottleneck now refined to 10 bits/sec (Caltech 2024), which strengthens the case for sequential disclosure | M17 | High |
| **Healing loop pattern is validated** — self-healing test loops confirmed by mabl, TestMu, Ministry of Testing | Earlier research | High |
| **Scrollytelling engagement is massive** — 85% engagement increase, 40% conversion boost, Awwwards 2026 dominated by scroll-driven narratives | M19, M24 | High |

## 2. OUTDATED — What web-god does that's behind the curve

| Finding | Source | Current web-god State | Required Update | Priority | Effort |
|---|---|---|---|---|---|
| **OWASP is now 2025, not 2021** — new categories: Supply Chain Failures (A03), Exceptional Conditions (A10) | M25 | References OWASP 2021 | Update security reference to OWASP 2025 | P0 | S |
| **Next.js is 16.2, not 15.x** — Turbopack stable, PPR stable via `"use cache"`, View Transitions experimental | M12 | No version references, but patterns are pre-16 | Update frontend agent patterns to Next.js 16.2 | P0 | M |
| **50 bits/sec → 10 bits/sec** — Caltech 2024 Meister/Zheng paper refines the attention bottleneck | M17 | Uses 50 bits/sec throughout | Update scrollytelling reference docs | P1 | S |
| **CWV thresholds tightened** — INP now 150ms (was 200ms), LCP target 2.0s (was 2.5s), new Visual Stability Index metric | M22 | Uses 200ms INP, 2.5s LCP | Update performance reference doc and agent | P0 | S |
| **Skills use only 2 of ~14 available frontmatter fields** — missing `context: fork`, `model`, `disable-model-invocation`, `hooks` | M7 | Only `name` and `description` | Add critical frontmatter fields to all 9 skills | P0 | S |
| **npm supply chain defense is dangerously thin** — `npm audit` alone is insufficient (Axios compromise March 2026) | M30 | Only mentions `npm audit in CI` | Add provenance verification, Socket.dev, lockfile detection | P0 | S |
| **Next.js has had critical CVEs** — middleware bypass (9.1), RCE (10.0), source code exposure, CSRF bypass | M29 | No Next.js-specific security guidance | Add Next.js threat section to security agent | P0 | S |
| **W3C Design Tokens spec is now stable (2025.10)** — entire industry adopting DTCG format | M15 | Uses ad-hoc token format | Update design-system agent to target DTCG + Style Dictionary v4 | P0 | S |
| **CSS scroll-driven animations are production-ready** — Chrome/Safari/Edge full support; Firefox via Interop 2026 | M9 | Relies solely on GSAP + JS | Add CSS `animation-timeline` progressive enhancement | P1 | S |
| **GSAP has official Agent Skills** — `greensock/gsap-skills` is a first-party complement | M3 | No reference to official GSAP skills | Reference in scrollytelling skill | P1 | S |

## 3. MISSING — What web-god should add

| Finding | Source | Recommendation | Priority | Effort |
|---|---|---|---|---|
| **Astro as scrollytelling target** — Cloudflare-acquired, 2-3x faster than Next.js for content sites | M16 | Add Astro as first-class framework option in scrollytelling skill | P1 | M |
| **View Transitions API** — baseline browser support, Next.js 16.2 experimental, React 19.2 native | M10 | Add to frontend agent guidance | P1 | M |
| **Playwright MCP** — official tool for AI-driven browser control and test generation | M13 | Integrate into testing skill for AI-assisted test gen | P1 | M |
| **AI-specific security (ASTRIDE, OWASP Agentic Skills Top 10)** — skill files are an attack surface | M26 | Add agentic security module to threat modeler | P1 | L |
| **Edge deployment patterns** — Vercel Edge Functions, Cloudflare Workers, edge databases | M31 | Add edge section to devops agent | P1 | M |
| **Database selection decision tree** — Neon vs Supabase vs D1/Turso | M32 | Add to backend agent | P1 | S |
| **WebGPU for 3D scroll effects** — production-ready, Three.js r171 supports it, ~70% browser coverage | M36 | Update 3D scroll templates to `three/webgpu` | P1 | S |
| **Hook density / first-viewport principle** — 1.7-second decision window, front-load compelling content | M19 | Add to scrollytelling skill guidance | P1 | M |
| **WCAG 2.2.2 on-page pause controls** — AA-required for auto-playing scroll animations | M20 | Add to accessibility layer of scrollytelling | P1 | M |
| **GSAPify-style GSAP timeline generation** — text prompt → GSAP code exists but only for single snippets | M34 | Choreographer agent could own full-timeline generation | P2 | M |
| **Marketplace registration** — Claude Code plugin marketplace launched Feb 2026 | M39 | Register web-god on claudemarketplaces.com, skillsmp.com | P0 | S |
| **Web Components / Lit output** — framework-agnostic design system delivery | M16 | Add as optional output for design-system agent | P2 | M |

## 4. SERENDIPITY — Unexpected opportunities discovered

| Finding | Source | Opportunity |
|---|---|---|
| **Haptic feedback is now trivial on mobile** — `navigator.vibrate()` packages exist; Microsoft pushing Web Haptics API | M33 | Add haptic milestone pulses to scrollytelling (chapter transitions). Zero dependencies on mobile. |
| **CSS `animation-trigger` (Chrome 145, Feb 2026)** — fires time-based animations on scroll offset crossing, native replacement for IntersectionObserver | M35 | Add to scrollytelling grammar as progressive enhancement. Compositor thread, zero JS. |
| **CSS `scroll-state()` queries (Chrome 133+)** — detect stuck/snapped/overflowing elements in pure CSS | M35 | Game-changer for data viz sticky axis labels. Add to frontend reference. |
| **Caltech 10 bits/sec paper** — conscious attention is 5x slower than previously cited. Validates sequential disclosure even more strongly. | M17 | Marketing gold: "web-god is designed for how the brain actually works — 10 bits per second" |
| **Next.js 16.2 ships AGENTS.md in create-next-app** — scaffolded projects include AI agent context | M12 | web-god can provide a richer AGENTS.md as an install artifact |
| **63,000+ agent skills in ecosystem** — but 36% have security vulnerabilities | M1 | web-god's security-first approach (audited, no secrets, MIT-licensed) is a differentiation angle |
| **120fps is the new target** — Spotify, Duolingo, Disney deploy 120fps via Rive; rAF still capped at 60fps in browsers | M23 | Monitor but don't change 60fps target yet — browser API is the bottleneck, not the aspiration |
| **Spatial computing is 12-18 months out** — WebXR + AI-personalized narratives emerging but premature for production | M40 | Plan `webgod-webxr` and `webgod-narrative-ai` skills. Don't build yet. |

## 5. STRATEGIC DIRECTION

### v0.2 (Next Release — Immediate)
1. **Update all 9 skill frontmatters** — add `model`, `context: fork`, `disable-model-invocation` (P0, S)
2. **Update OWASP to 2025** — security reference and agent (P0, S)
3. **Update CWV thresholds** — INP 150ms, LCP 2.0s (P0, S)
4. **Update design tokens to DTCG format** — W3C stable spec (P0, S)
5. **Add Next.js security section** — middleware bypass, RSC exposure, Server Action CSRF (P0, S)
6. **Register on skill marketplaces** — claudemarketplaces.com, skillsmp.com, VoltAgent (P0, S)
7. **Reference official GSAP skills** — `greensock/gsap-skills` (P1, S)
8. **Add npm supply chain defenses** — provenance, Socket.dev (P0, S)

### v0.3 (Next Quarter)
1. **Add Astro as scrollytelling target** — Cloudflare-acquired, faster for content (P1, M)
2. **Add View Transitions API guidance** — Next.js 16.2 + React 19.2 (P1, M)
3. **Add CSS scroll-driven animations** — progressive enhancement + polyfill (P1, S)
4. **Integrate Playwright MCP** — AI-driven test generation (P1, M)
5. **Add edge deployment patterns** — Vercel Edge + Cloudflare Workers (P1, M)
6. **Add database decision tree** — Neon/Supabase/D1/Turso (P1, S)
7. **Update 10 bits/sec reference** — replace 50 bits/sec with Caltech 2024 (P1, S)
8. **Add WCAG 2.2.2 pause controls** — AA-required for scroll animations (P1, M)

### v1.0 (6 Months)
1. **AI-specific security module** — ASTRIDE + OWASP Agentic Skills Top 10 (P1, L)
2. **WebGPU 3D scroll templates** — `three/webgpu` with WebGL fallback (P1, S)
3. **Web Components output** — framework-agnostic design system delivery (P2, M)
4. **Open-core monetization** — premium scrollytelling + enterprise security variants (P2, M)
5. **Full-timeline GSAP generation** — choreographer emitting ScrollTrigger code from briefs (P2, M)

### v2.0 (12+ Months — Horizon)
1. **`webgod-webxr` skill** — spatial storytelling with Three.js/A-Frame + WebXR
2. **`webgod-narrative-ai` skill** — LLM-driven adaptive/personalized scroll narratives
3. **Haptic scroll feedback** — Web Haptics API integration for chapter milestones
4. **CSS-native scrollytelling mode** — zero-JS scroll experiences via `animation-trigger` + `scroll-state()`

---

## Updated Vision Statement

> **web-god** is the first AI-powered scrollytelling factory and web development intelligence layer. It encodes cognitive science, narrative design theory (Duarte sparkline), and production web engineering into a system of 15 specialized agents that produce Awwwards-grade scroll-driven experiences from creative briefs — something no other tool in the 63,000+ agent skill ecosystem does.
>
> The scrollytelling pipeline is the crown jewel. The web development domains (frontend, backend, security, SEO, testing, devops, design system) provide the supporting infrastructure that makes the pipeline production-complete.
>
> web-god is designed for how the brain actually works: 10 bits per second of conscious attention, sequentially processed. Every agent, every skill, every validation rule exists to ensure that those 10 bits carry the right information, in the right order, at the right emotional charge.

---

## Key Numbers

| Metric | Value | Source |
|---|---|---|
| Agent skills in ecosystem | 63,000+ | M1 |
| Skills with security vulns | 36% | M1 |
| Scrollytelling engagement boost | 85% | M19 |
| Scrollytelling conversion boost | 40% | M19 |
| Conscious attention bandwidth | 10 bits/sec | M17 (Caltech 2024) |
| GSAP license | 100% free (Webflow) | M3 |
| CSS scroll-driven animations browser coverage | ~95% (excl. Firefox behind flag) | M9 |
| WebGPU browser coverage | ~70% | M36 |
| Next.js current version | 16.2.1 (March 18, 2026) | M12 |
| Lenis current version | 1.3.21 (March 26, 2026) | M4 |
| OWASP Top 10 version | 2025 (released Jan 2026) | M25 |
| INP "good" threshold | 150ms (tightened from 200ms) | M22 |
| W3C Design Tokens spec | Stable 2025.10 (Oct 2025) | M15 |
| Claude Code marketplace | Launched Feb 2026 | M39 |
