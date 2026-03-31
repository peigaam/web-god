# Scrollytelling Factory — Implementation Roadmap

This document summarizes all deliverables from the Scrollytelling Factory blueprint, provides exact installation instructions for Claude Code, and documents how to invoke the pipeline.

---

## Deliverables Summary

| Phase | Output | Location |
|---|---|---|
| 1 — Research Ingestion | Research synthesis from 9 documents | `research-synthesis.md` |
| 2 — Visionary Architecture | Vision spec, tournament survivors/graveyard | `vision_handoff_spec.md`, `survivors.json`, `graveyard.json` |
| 3 — Agent Design | 5 specialized agents | `agents/*.md` |
| 4 — Skill Design | Orchestrator skill + reference + evaluator | `skills/scrollytelling/` |
| 5 — Playwright QA | Architecture, 3 sample test suites, healing loop | `playwright/` |
| 6 — Roadmap | This document | `implementation-roadmap.md` |

### Agent Roster

| Agent | Purpose | Model |
|---|---|---|
| **Director** | Narrative storyboard from creative brief (Duarte sparkline, STAR moments, scene breakdown) | opus |
| **Choreographer** | Scroll-driven animation spec (Lenis config, GSAP triggers, parallax, easing vocabulary) | sonnet |
| **Typographer** | Type system for scroll narrative (kinetic type, variable fonts, reading-pace sync) | sonnet |
| **Compositor** | Visual layer stack (depth, color narrative, asset optimization, blend modes) | sonnet |
| **Auditor** | Playwright QA (visual regression, scroll perf, accessibility, cross-browser, healing loop) | sonnet |

### Playwright Test Suites

| File | Category | Key Checks |
|---|---|---|
| `scroll-performance.spec.ts` | Performance | 60fps enforcement, jank rate per scene, reverse scroll, layout-trigger detection |
| `visual-regression.spec.ts` | Visual | Screenshot comparison at every trigger point x 3 viewports, CLS measurement |
| `accessibility.spec.ts` | Accessibility | axe-core per scene state, reduced motion validation, keyboard navigation, ARIA landmarks |

---

## Installation Guide

### Prerequisites

- **Claude Code** installed (CLI, desktop app, or IDE extension)
- Familiarity with Claude Code agents and skills (see [Building Skills for Claude](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/skills))

### Step 1: Install the Agents

Copy each agent file from this blueprint into your Claude Code agents directory. Agents are Markdown files with YAML frontmatter that Claude Code loads automatically when their description matches the current task.

```sh
# Create the agents directory if it does not exist
mkdir -p ~/.claude/agents

# Copy all 5 agents
cp ~/Developer/Documentation/blueprints/scrollytelling/agents/director.md \
   ~/.claude/agents/scrollytelling-director.md

cp ~/Developer/Documentation/blueprints/scrollytelling/agents/choreographer.md \
   ~/.claude/agents/scrollytelling-choreographer.md

cp ~/Developer/Documentation/blueprints/scrollytelling/agents/typographer.md \
   ~/.claude/agents/scrollytelling-typographer.md

cp ~/Developer/Documentation/blueprints/scrollytelling/agents/compositor.md \
   ~/.claude/agents/scrollytelling-compositor.md

cp ~/Developer/Documentation/blueprints/scrollytelling/agents/auditor.md \
   ~/.claude/agents/scrollytelling-auditor.md
```

Agent files are named with the `scrollytelling-` prefix so Claude Code can identify them by the `name` field in their frontmatter. The `description` field in each agent's frontmatter tells Claude when to invoke that agent automatically.

### Step 2: Install the Skill

Copy the entire skill directory into your Claude Code skills directory. Skills are folders containing a `SKILL.md` file (the main instructions) plus optional `references/`, `scripts/`, and `assets/` subdirectories.

```sh
# Create the skills directory if it does not exist
mkdir -p ~/.claude/skills

# Copy the full skill directory (preserves structure)
cp -r ~/Developer/Documentation/blueprints/scrollytelling/skills/scrollytelling \
   ~/.claude/skills/scrollytelling
```

After installation, the skill directory should look like:

```
~/.claude/skills/scrollytelling/
  SKILL.md                              # Main skill instructions (loaded by Claude)
  references/
    scrollytelling-principles.md        # Shared knowledge base (loaded on demand)
  scripts/
    evaluator.py                        # Deterministic spec evaluator
```

The `SKILL.md` frontmatter contains the `name` and `description` fields that Claude Code uses to decide when to load this skill. When a user says "build a scrollytelling page" or "create a scroll-driven experience," Claude will activate this skill automatically.

### Step 3: Install the Playwright Test Infrastructure (Per-Project)

The Playwright tests are project-specific — install them in the Next.js project where the scrollytelling experience will be built.

```sh
# From the root of your Next.js project:

# Install Playwright and dependencies
npm install -D @playwright/test @axe-core/playwright pixelmatch sharp

# Install browser engines
npx playwright install chromium firefox webkit

# Copy the sample tests into your project
mkdir -p tests/scrollytelling
cp ~/Developer/Documentation/blueprints/scrollytelling/playwright/sample-tests/*.spec.ts \
   tests/scrollytelling/
```

You will also need to create a `scrollytelling.config.ts` file in your `tests/` directory. This config maps the Director's storyboard into the machine-readable format the tests consume. See `playwright/architecture.md` for the interface definition. The Auditor agent generates this config from the Director's storyboard during the pipeline.

### Step 4: Verify Installation

```sh
# Verify agents are installed
ls -la ~/.claude/agents/scrollytelling-*.md
# Expected: 5 files (director, choreographer, typographer, compositor, auditor)

# Verify skill is installed
ls ~/.claude/skills/scrollytelling/SKILL.md
# Expected: SKILL.md exists

# Verify evaluator runs
python3 ~/.claude/skills/scrollytelling/scripts/evaluator.py --help
# Expected: prints usage documentation
```

---

## How to Invoke the Pipeline

### Option A: Full Pipeline via Skill

The recommended approach. The skill orchestrates all agents in sequence.

Start a Claude Code session in your Next.js project directory and provide a creative brief:

```
Build a scrollytelling landing page for our product launch.

Topic: Acme Analytics — a real-time business intelligence platform
Audience: VP-level decision makers at mid-market SaaS companies
Tone: Cinematic prestige (Fincher precision meets Scott atmosphere)
Assets: We have hero video (15s product flythrough), 4 key metrics,
        3 customer testimonials, product screenshots for each feature
Emotional arc: Start with the pain of delayed decisions, build through
               the revelation of real-time insight, peak at a live data
               visualization, resolve with confident clarity
Objective: Book a demo (calendar link CTA)
```

Claude will activate the `scrollytelling` skill and walk through the pipeline steps. The skill includes a human checkpoint after the Director stage — you will review and approve the storyboard before animation and implementation begin.

### Option B: Individual Agent Invocation

For iterating on a specific phase without re-running the full pipeline. Use the Agent tool to invoke a specific agent by name.

**Director only (narrative design):**
```
Use the scrollytelling-director agent to create a storyboard for this brief:
[paste your creative brief]
```

**Choreographer only (motion design):**
```
Use the scrollytelling-choreographer agent to create an animation spec
from this storyboard: [paste or reference the Director's output file]
```

**Auditor only (QA validation):**
```
Use the scrollytelling-auditor agent to validate the scrollytelling
experience running at http://localhost:3000
```

### Option C: Evaluator Script (Spec Validation)

Run the deterministic evaluator against spec files to check structural compliance before implementation:

```sh
# Validate a Director storyboard
python3 ~/.claude/skills/scrollytelling/scripts/evaluator.py \
  storyboard path/to/storyboard.md

# Validate a Choreographer animation spec
python3 ~/.claude/skills/scrollytelling/scripts/evaluator.py \
  animation path/to/animation-spec.md \
  --storyboard path/to/storyboard.md

# Validate a Compositor composition spec
python3 ~/.claude/skills/scrollytelling/scripts/evaluator.py \
  composition path/to/composition-spec.md

# Validate all specs in a directory (cross-spec consistency)
python3 ~/.claude/skills/scrollytelling/scripts/evaluator.py \
  full path/to/specs-directory/
```

---

## Example Prompts for Each Phase

### Phase 1 — Creative Brief Intake

Provide a complete brief. The more specific you are, the better the Director's storyboard will be.

**Minimal brief:**
```
Create a scrollytelling page for Acme Analytics.
Audience: SaaS executives. Goal: book a demo.
```

**Detailed brief (recommended):**
```
Build a scrollytelling experience for Acme Analytics' Series B launch.

Topic: Acme Analytics — real-time BI that replaces 6 dashboard tools
Audience: VP Engineering and VP Product at Series A-C SaaS companies
          (technical enough to appreciate data architecture,
           busy enough to need a fast narrative)
Tone: Cinematic prestige. Think the BMW Group annual report meets
      The Pudding's data journalism. Dark palette, precise typography,
      atmospheric depth.
Assets:
  - Hero: 15-second product flythrough video (dark UI, glowing data)
  - Metrics: 73% reduction in decision latency, 4.2x faster anomaly
    detection, $2.1M average annual savings, 99.97% uptime
  - Testimonials: 3 VP-level quotes with headshots
  - Screenshots: Dashboard, Alert Builder, Real-time Feed, API Console
  - Logo cloud: 12 customer logos (Series B-D companies)
Emotional arc:
  - Start: Frustration of delayed, fragmented dashboards (the "old way")
  - Middle: Progressive revelation of real-time capabilities
  - Peak: Live data visualization showing anomaly detection in action
  - End: Calm confidence — the "new normal" of instant insight
Objective: Book a demo via Calendly embed
```

### Phase 2 — Storyboard Review (Human Checkpoint)

After the Director produces the storyboard, you will see it presented for approval. Review prompts:

```
The storyboard looks great, but move the STAR moment earlier —
I want the live data visualization at 60% scroll, not 70%.
```

```
Scene 4 feels redundant with Scene 3. Merge them and use the
saved space for a stronger proof section with the customer logos.
```

```
Approved. Proceed to the Choreographer.
```

### Phase 3 — Animation Iteration

If the Choreographer's spec needs adjustment:

```
The parallax feels too aggressive in the hero section.
Reduce the depth differential from 0.3x-1.3x to 0.5x-1.2x
for scenes S1-S3.
```

```
Use elastic easing for the stat card entrance — I want them to
feel physical, like they're snapping into place.
```

### Phase 4 — Implementation Guidance

If you need to guide the Builder on specific implementation choices:

```
Use Tailwind for styling, not CSS Modules. Our project is already
set up with Tailwind and I want consistency.
```

```
For the STAR moment video, use scroll-scrubbed playback —
the user's scroll should control the video timeline frame by frame.
```

### Phase 5 — QA and Healing

```
Run the Auditor on http://localhost:3000 and fix any performance
issues. The STAR moment scene is janky on mobile.
```

```
The visual regression test is failing on tablet viewport for Scene 3.
Show me the diff and propose a fix.
```

```
Run accessibility validation only — I want to verify the reduced
motion experience before we deploy.
```

---

## Project Setup for New Scrollytelling Experiences

When starting a new scrollytelling project from scratch:

```sh
# Create the Next.js project
npx create-next-app@latest my-scrollytelling --typescript --app --tailwind

cd my-scrollytelling

# Install scrollytelling dependencies
npm install lenis gsap @gsap/react framer-motion

# Install Playwright for QA
npm install -D @playwright/test @axe-core/playwright
npx playwright install chromium firefox webkit

# Copy the test infrastructure
mkdir -p tests/scrollytelling
cp ~/Developer/Documentation/blueprints/scrollytelling/playwright/sample-tests/*.spec.ts \
   tests/scrollytelling/

# Register GSAP ScrollTrigger (required — GSAP plugins need explicit registration)
# The Builder agent handles this in the implementation, but verify it exists:
# In your app's layout or scrollytelling component:
#   import { gsap } from "gsap";
#   import { ScrollTrigger } from "gsap/ScrollTrigger";
#   gsap.registerPlugin(ScrollTrigger);
```

Then start a Claude Code session in the project directory and provide your creative brief.

---

## Architecture Decisions Record

| Decision | Choice | Rationale |
|---|---|---|
| Scroll library | Lenis | Smooth scroll with inertia, Lenis-ScrollTrigger integration is the standard pattern, sub-1KB |
| Animation engine | GSAP + ScrollTrigger | Industry standard for scroll-driven animation, 10+ years of browser compat, timeline-based API matches the storyboard model |
| Micro-interactions | Framer Motion | React-native animation API for component-level hover/tap states, complements GSAP for non-scroll animations |
| Framework | Next.js (App Router) | SSR for SEO, file-based routing, React Server Components for performance, image optimization built in |
| QA framework | Playwright | Multi-browser (Chromium/Firefox/WebKit), CDP access for performance profiling, built-in screenshot comparison |
| Accessibility scanning | axe-core | Industry standard, WCAG 2.1 AA rule set, Playwright integration via @axe-core/playwright |
| Agent model allocation | Director=opus, rest=sonnet | Director requires deep creative reasoning (narrative architecture); Choreographer/Typographer/Compositor/Auditor are translation/validation tasks suited to sonnet's speed |

---

## Known Limitations and Future Work

### Current Limitations

1. **The perceptual grammar is not formally validated.** The claim that S-tier scrollytelling decomposes into finite primitives (survivor H4) needs testing against 20+ Awwwards winners. The grammar may need expansion for novel techniques like WebGL particle systems or scroll-driven 3D camera paths.

2. **The cognitive load profiler is experimental.** The heuristic scores (element density, color complexity, motion count, text density) have not been correlated against real user engagement metrics. The Auditor flags cognitive load results as informational, not pass/fail, until the H6 falsification condition is tested (Pearson r > 0.4 across 30 experiences).

3. **Cross-browser visual regression thresholds are generous.** The 0.88 SSIM threshold for cross-browser comparison allows significant rendering differences. This may need tightening as browser engines converge, or loosening for specific edge cases (font rendering, subpixel antialiasing).

4. **The healing loop cannot fix design problems.** If a performance failure is caused by an overly ambitious Choreographer spec (too many simultaneous animations), the Builder cannot fix it by optimizing code — the spec itself needs revision. The 3-strike circuit breaker escalates these cases to human review.

### Future Work

1. **Engagement metric correlation study.** Deploy 20+ factory-produced experiences with analytics. Correlate the cognitive load profiler scores with scroll completion rate, time-per-section, and conversion rate. This validates or falsifies H6 and calibrates the profiler weights.

2. **Grammar expansion via decomposition analysis.** Analyze 20 Awwwards SOTD winners, decompose each into the grammar's primitives, and identify gaps. Add new scene types and transition types as needed. Target: < 25% of winners require novel primitives (H4 falsification threshold).

3. **GSAP-Lenis integration hardening.** The Lenis-ScrollTrigger synchronization pattern has known edge cases (race conditions during rapid scroll direction changes, iOS Safari momentum scroll). Encode these workarounds into the Choreographer's knowledge base.

4. **Automated storyboard generation from URL analysis.** Given a competitor's landing page URL, the Director could analyze its narrative structure (via screenshot analysis and content extraction) and produce a storyboard that improves on its weaknesses. This closes the "brief quality" gap.

5. **Real-time collaboration protocol.** Allow multiple Claude Code sessions to work on different scenes simultaneously. The Director produces the storyboard, then Choreographer/Typographer/Compositor can work in parallel per-scene (currently they work sequentially per the full experience).
