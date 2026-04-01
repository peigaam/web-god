---
name: scrollytelling
description: >
  Orchestrates a 5-agent scrollytelling production pipeline. Takes a creative brief
  and produces a validated scroll-driven experience with GSAP, Lenis, and Playwright QA.
context: fork
model: opus
---

# Scrollytelling Factory

Orchestrate the production of an Awwwards-quality scrollytelling experience from a creative brief through six specialized agents, producing a validated Next.js application with Lenis smooth scrolling and GSAP scroll-driven animation.

## Prerequisites

Before starting, verify:
1. The project has a Next.js application initialized (App Router preferred)
2. Dependencies available: `lenis`, `gsap` (with ScrollTrigger plugin), `framer-motion`
3. Playwright installed for QA validation
4. The user has provided or will provide a creative brief

If prerequisites are missing, help the user set them up before entering the pipeline.

## Companion Skills

The scrollytelling pipeline works best alongside these official ecosystem skills:

- **greensock/gsap-skills** — Official GSAP Agent Skills covering ScrollTrigger,
  timelines, easing, and animation patterns. Install separately if available.
  web-god's Choreographer agent produces animation SPECS; GSAP skills help with
  IMPLEMENTATION of those specs.

If the official GSAP skills are installed, the Builder step can reference them
for implementation details. If not, the Choreographer's spec + the scrollytelling
reference doc contain sufficient guidance.

## Pipeline Overview

The pipeline executes in strict sequential order. Each agent's output feeds the next. Do not skip stages or run agents out of order — downstream agents depend on upstream specifications.

| Step | Agent | Produces | Depends On |
|---|---|---|---|
| 1 | Director | Narrative storyboard with sparkline | Creative brief |
| 2 | Choreographer | Animation spec with scroll triggers | Director's storyboard |
| 3 | Typographer | Type system specification | Director + Choreographer |
| 4 | Compositor | Visual composition specification | Director + Choreographer + Typographer |
| 5 | Builder | Next.js implementation | All upstream specs |
| 6 | Auditor | Validation report + healing loop | Built experience + all specs |

## Step 1: Gather the Creative Brief

If the user has not provided a complete brief, collect these elements:

- **Topic/Product:** What is being presented?
- **Target Audience:** Who is the primary viewer?
- **Tone:** Choose from or blend: cinematic, playful, editorial, prestige, minimalist, data-driven
- **Content Assets:** List available text, images, videos, data points, testimonials
- **Desired Emotional Arc:** What should the user feel at start, middle, and end?
- **Business Objective:** What action should the viewer take? (sign-up, explore, donate, purchase)

Do not proceed until all 6 elements are captured. A brief missing the business objective produces a beautiful experience that converts nothing.

## Step 2: Director — Narrative Architecture

Invoke the `scrollytelling-director` agent with the creative brief.

Review the Director's output for:
- [ ] Big Idea is a complete sentence with stakes
- [ ] Sparkline oscillates (no 3+ consecutive same-pole scenes)
- [ ] STAR moment is placed between 55-75% scroll depth
- [ ] Maximum 12 scenes
- [ ] Each scene has exactly 1 Von Restorff target
- [ ] Reduced motion narrative is specified

**Human checkpoint:** Present the storyboard and sparkline map to the user for approval before proceeding. The Director's output is the creative foundation — course-correcting later is expensive.

## Step 3: Choreographer — Motion Design

Invoke the `scrollytelling-choreographer` agent with the approved storyboard.

Review the Choreographer's output for:
- [ ] Lenis configuration specified
- [ ] Every Director scene has corresponding scroll triggers
- [ ] Maximum 3 simultaneous animations per viewport
- [ ] Parallax depth differential does not exceed 1.0x
- [ ] Easing vocabulary matches Director's cinematic references
- [ ] All reduced motion fallbacks specified

## Step 4: Typographer — Type System

Invoke the `scrollytelling-typographer` agent with the storyboard and animation spec.

Review the Typographer's output for:
- [ ] Maximum 2 font families (3 if monospace needed)
- [ ] Body text minimum 16px mobile, 18px desktop
- [ ] Kinetic type techniques limited to 2 per scene
- [ ] Reading-pace synchronization accounted for
- [ ] All reduced motion fallbacks specified

## Step 5: Compositor — Visual Assembly

Invoke the `scrollytelling-compositor` agent with all upstream specs.

Review the Compositor's output for:
- [ ] Every scene has a defined layer stack
- [ ] Von Restorff isolation matches Director's targets
- [ ] Color narrative follows sparkline emotional arc
- [ ] Asset optimization strategy covers all visual assets
- [ ] No image exceeds 200KB (hero max 400KB)
- [ ] Total viewport layer count does not exceed 8

## Step 6: Builder — Implementation

This step uses the standard Builder agent (not a custom scrollytelling agent). Provide the Builder with ALL four upstream specs and these implementation instructions:

**Tech Stack:**
- Next.js (App Router) with TypeScript
- Lenis for smooth scroll (configured per Choreographer spec)
- GSAP with ScrollTrigger plugin for scroll-driven animation
- Framer Motion for component-level micro-interactions
- CSS Modules or Tailwind for styling

**Implementation Order:**
1. Scaffold the page structure matching the Director's scene breakdown
2. Wire Lenis smooth scroll with the Choreographer's global config
3. Implement scroll triggers from the Choreographer's trigger map
4. Apply the Typographer's type system (font loading, scales, kinetic animations)
5. Build the Compositor's layer stacks per scene
6. Implement the STAR moment as specified
7. Add `prefers-reduced-motion` fallbacks for every animated element
8. Add ARIA landmarks and keyboard focus management per the Director's scene order
9. Optimize all assets per the Compositor's strategy

**Performance Guardrails (enforce during implementation):**
- Only animate `transform` and `opacity` in the scroll hot path
- Use `will-change: transform` on parallax layers
- Lazy load all below-fold images via IntersectionObserver
- Set explicit `width`/`height` on all images
- Use `loading="lazy"` and `decoding="async"` on images

## Step 7: Auditor — Validation

Invoke the `scrollytelling-auditor` agent to run the full test suite.

If the Auditor reports failures:
1. Review the diagnostic report
2. Feed the proposed fixes to the Builder
3. Builder implements fixes
4. Auditor re-runs failed tests only
5. Repeat up to 3 times (circuit breaker)
6. If still failing after 3 rounds, present the Auditor's escalation report to the user

## Step 8: Final Review

When the Auditor passes all categories, present to the user:
- Summary of the experience (scene count, STAR moment type, key animations)
- Performance scores (average FPS, jank rate, CLS score)
- Accessibility status (axe-core violations, contrast compliance, reduced motion status)
- Any experimental data (cognitive load profile scores vs. Director's targets)

Ask the user if they want to:
- **Deploy:** Proceed with deployment
- **Revise:** Return to a specific agent for changes (identify which spec to modify)
- **Generate golden baselines:** Capture the current visual state as the regression baseline for future changes

## Reference Material

Consult `references/scrollytelling-principles.md` for the cognitive science grounding, perceptual grammar rules, and performance budgets that inform every agent's decisions.

## Troubleshooting

### Lenis scroll feels sluggish or too fast
Adjust the scroll duration in the Choreographer's global config. Values below 0.8 feel snappy/web-like. Values above 1.5 feel heavy/cinematic. Start at 1.2 and adjust.

### GSAP ScrollTrigger animations don't fire
Verify Lenis and ScrollTrigger are synchronized. The Choreographer's spec should include the Lenis-ScrollTrigger integration pattern (Lenis `scroll` event updating ScrollTrigger).

### Parallax creates a "detached" feeling
Reduce the parallax depth differential. If the Choreographer specified 0.3x-1.3x, try 0.5x-1.2x. The human eye is sensitive to unnatural depth differentials.

### Performance drops during STAR moment
The STAR moment is typically the most animation-heavy scene. Check: (1) WebGL shader is not recompiling per frame, (2) particle count is within budget, (3) images in the scene are pre-loaded before the user scrolls to it.

### Reduced motion mode looks broken
The Typographer and Choreographer both specify fallbacks. If the fallbacks are correct but the implementation is wrong, check that the `prefers-reduced-motion` media query is applied at the correct specificity level and that GSAP's `matchMedia` is used for JS-driven animations.
