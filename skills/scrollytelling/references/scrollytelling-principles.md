# Scrollytelling Principles Reference

Cognitive science grounding, perceptual grammar rules, and performance budgets for the Scrollytelling Factory pipeline. This document is the shared knowledge base read by all agents.

---

## 1. The Attentional Bottleneck

- **Conscious processing bandwidth:** ~50 bits/sec (Miller, Broadbent, decades of psychophysics confirmation)
- **Pre-attentive processing window:** 200-250ms for parallel pattern recognition (Gestalt grouping, motion detection, color salience)
- **Working memory capacity:** 4-7 chunks (Miller's Law); scenes must not present more simultaneous elements than this
- **Implication:** Every visual element competes for the 50 bits/sec channel. Elements that do not serve the narrative steal bandwidth from elements that do.

## 2. Duarte's Resonate Methodology (Digital Adaptation)

### The Digital Sparkline
- **X-axis:** Emotional state (left = Status Quo/pain, right = Visionary Future/release)
- **Y-axis:** Scroll depth (top = 0%, bottom = 100%)
- **Rule:** The sparkline must oscillate. Three consecutive scenes on the same pole is a "flatline" and causes engagement dropout.

### The Three-Act Structure for Scroll
- **Act 1 (0-20% scroll):** The Departure. Hero section establishes the inciting incident. The user's Status Quo is acknowledged, the Visionary Future is glimpsed.
- **Act 2 (20-75% scroll):** The Initiation. Features are "magical gifts" (Mentor archetype). Problems are "ordeals." The narrative oscillates between proof-of-pain and proof-of-solution.
- **Act 3 (75-100% scroll):** The Return. Resolution, STAR moment climax, CTA as "The New Bliss."

### The Big Idea Formula
Every scrollytelling experience must be anchored by a Big Idea: a single complete sentence (Subject + Verb + Outcome) that:
1. Articulates a unique point of view
2. Conveys what is at stake (Status Quo vs. Visionary Future)
3. Is a complete sentence, not a fragment

### The Mentor Archetype
The interface is the Mentor (Yoda); the user is the Hero (Luke). Copy and UX must:
- Frame features as empowerments, not capabilities ("See your future revenue" not "AI-Powered Analytics Engine")
- Celebrate the user's wins, not the system's status
- Never blame the Hero for errors

## 3. Gestalt Principles as Scroll Grammar

| Principle | Scroll Application | Agent Responsible |
|---|---|---|
| **Proximity** | Groups elements into scenes; whitespace = scene cut | Director (scene boundaries), Compositor (spacing) |
| **Continuity** | Alignment rails and motion paths create scroll momentum | Choreographer (motion paths), Typographer (reading flow) |
| **Closure** | Content cut at viewport edge invites scrolling | Compositor (viewport cropping strategy) |
| **Common Region** | Background shifts and containers encapsulate scenes | Compositor (layer stack, color narrative) |
| **Similarity** | Consistent visual treatment for consistent content types | Typographer (type hierarchy), Compositor (color semantics) |
| **Figure-Ground** | Unambiguous separation between focus content and background | Compositor (layer depth, contrast), Typographer (text contrast) |

## 4. Von Restorff Effect Budget

- **Rule:** Maximum 1 visually isolated (Von Restorff) element per viewport
- **Mechanism:** The deviant stimulus captures attention via contrast against a homogeneous background
- **Overuse penalty:** The "Christmas Tree Effect" — when everything is highlighted, nothing is. Banner blindness engages.
- **Application:** The Director assigns the Von Restorff target per scene. The Compositor ensures visual isolation. All other elements are subordinate.

## 5. Hick's Law and Progressive Disclosure

- **Formula:** RT = a + b * log2(n + 1), where n = number of choices
- **Application:** Each scroll section should minimize visible choices (interactive elements, navigation options)
- **Scroll as progressive disclosure:** The scroll itself is the ultimate progressive disclosure mechanism. Information is revealed only as the user advances. Do not front-load.
- **Menu/navigation:** 5-7 high-level categories maximum if a scroll-position indicator is used

## 6. The Peak-End Rule

- **Rule (Kahneman):** Users judge an experience by its peak emotional moment and its ending, not the average
- **Peak placement:** The STAR moment must be the highest-intensity scene. Place between 55-75% scroll depth.
- **End curation:** The final scene must be deliberately designed as a resolution, not a default footer with social links and copyright. The ending is the second thing users remember.

## 7. STAR Moments (Something They'll Always Remember)

Five mechanisms from Duarte, translated to digital:

| Analog Mechanism | Digital Translation | Technical Stack |
|---|---|---|
| Memorable Dramatization | Interactive Simulation | Canvas/WebGL, user-driven parameters |
| Repeatable Sound Bite | Shareable Data Callout | Animated counter + social share hook |
| Evocative Visual | Cinematic Motion Design | GSAP timeline, parallax depth, atmospheric layers |
| Emotive Storytelling | Scroll-Driven Personal Narrative | Scroll-triggered progressive text reveal |
| Shocking Statistic | Data Scrollytelling Reveal | Number animation with contextual visualization |

## 8. Cinematic Vocabulary

| Director | Scroll Translation | Mood | When to Use |
|---|---|---|---|
| **Fincher** | Locked viewport, precise scroll-triggered reveals, minimal camera movement, desaturated palette | Control, tension, precision | Problem/agitation scenes, data-heavy sections |
| **Scott** | Multi-layer parallax (4+ layers), atmospheric textures, high-contrast lighting | Epic, immersive, textured | World-building scenes, product environment shots |
| **Anderson** | Centered compositions, symmetrical layouts, flat depth, pastel palette | Contemplative, curated, whimsical | Brand identity sections, team/about content |
| **Jonze** | Soft-focus backgrounds, scale-on-scroll close-ups, warm palette (no blue) | Intimate, emotional, human | Testimonials, user stories, empathy-building scenes |
| **Buckley** | Compressed narrative (1 viewport = complete micro-arc), high production contrast with unexpected content | Efficient, punchy, memorable | CTA scenes, feature highlight vignettes |

## 9. Performance Budget

| Metric | Target | Failure Threshold | Measurement |
|---|---|---|---|
| Frame rate | 60fps sustained | Any frame > 33ms (< 30fps) | CDP Performance trace during automated scroll |
| Interaction to Next Paint (INP) | < 200ms | > 200ms | Lighthouse / CDP |
| Largest Contentful Paint (LCP) | < 2.5s | > 4.0s | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | > 0.25 | Lighthouse / layout-shift observer |
| Total Blocking Time (TBT) | < 200ms | > 600ms | Lighthouse |
| Jank rate per scene | < 3% frames | > 5% frames janked | CDP frame timing during scroll |
| Max simultaneous animations | 3 per viewport | > 5 | Static analysis of trigger map |
| Image payload (per asset) | < 200KB | > 400KB (non-hero) | Asset audit |

### GPU-Safe Animation Properties
Only these properties should be animated in the scroll hot path:
- `transform` (translate3d, scale, rotate)
- `opacity`
- `clip-path` (with caution — GPU-accelerated in modern browsers but can be expensive with complex paths)
- `filter` (blur, brightness — GPU-accelerated but expensive; use sparingly)

### Banned in Scroll Hot Path
- `width`, `height` (triggers layout)
- `top`, `left`, `right`, `bottom` (triggers layout)
- `margin`, `padding` (triggers layout)
- `border-radius` animation (triggers paint)
- `box-shadow` animation (triggers paint, extremely expensive)

## 10. Accessibility Baseline

| Requirement | Standard | Test Method |
|---|---|---|
| Color contrast (body text) | WCAG AA: 4.5:1 minimum | axe-core + manual verification against parallax backgrounds |
| Color contrast (large text) | WCAG AA: 3:1 minimum | axe-core |
| `prefers-reduced-motion` | Complete, coherent static experience | Emulated media query + full scroll-through |
| Keyboard navigation | All interactive elements reachable via Tab; focus order = scroll order | Automated Tab-through |
| Screen reader | ARIA landmarks per scene; meaningful alt text on all images | axe-core + manual VoiceOver/NVDA test |
| Touch targets | Minimum 44x44px | Computed style check |
| Focus visibility | Visible focus indicator on all interactive elements | Automated focus-visible check |

## 11. The Perceptual Grammar Primitives

### Scene Types (Director's vocabulary)
1. **Hero Hook:** Full-viewport, minimal elements, Big Idea headline + single image/video
2. **Agitation Block:** Problem evidence — statistics, comparison tables, "the old way" visualization
3. **Solution Reveal:** Product/concept introduction — clean composition, visual shift from problem palette
4. **Proof Stack:** Social proof, testimonials, data evidence — card layouts, quoted text, metric callouts
5. **STAR Stage:** Maximum visual intensity — interactive element, cinematic transition, or data visualization climax
6. **Resolution CTA:** Clean, focused, single action — the curated ending

### Transition Types (Choreographer's vocabulary)
1. **Parallax Reveal:** Next scene's content rises from below as current scene's content drifts up, creating depth
2. **Cross-Fade:** Opacity transition between scenes, typically over 3-5% scroll distance
3. **Hard Cut:** Instant switch with no transition, mimics film cut — used for dramatic sparkline pole switches
4. **Pin-and-Swap:** Current scene pins while internal content changes (slides, tabs, state changes within a fixed frame)
5. **Zoom Transition:** Scale animation creates the feeling of moving into or out of the next scene
6. **Color Wipe:** Background color transition that sweeps across the viewport, carrying the next scene's content
