---
name: narrative
description: >
  Designs story architecture for any web project. Diagnoses audience awareness,
  produces emotional arcs, section structures, and voice direction. Chains to
  the web-copywriter for copy execution.
context: fork
model: opus
---

# Narrative Strategy Skill

Design the story architecture that dictates everything downstream — what the page says, how it's structured, and what emotions it triggers.

## Pipeline

| Step | Agent | Produces |
|---|---|---|
| 1 | Narrative Strategist | Audience diagnosis + Big Idea + Sparkline + Section brief |
| 2 | Web Copywriter | Headlines, body copy, CTAs, microcopy |
| 3 | Validation | Squawk Test + So What? Filter + awareness-level alignment |

## Step 1: Narrative Architecture

Invoke `narrative-strategist`. Provide: product/project description, target audience, business objective, available content assets.

The strategist will:
1. Diagnose awareness level (Schwartz)
2. Apply psycho-logic lens (Sutherland)
3. Produce Big Idea (Duarte formula)
4. Map the sparkline (section-by-section emotional arc)
5. Run anti-narrative check (is this a dashboard/utility?)

## Review Checklist
- [ ] Awareness level explicitly diagnosed
- [ ] Big Idea is a complete sentence with stakes
- [ ] Sparkline oscillates (no 3+ same-pole flatlines)
- [ ] Each section has a narrative function and proof type
- [ ] One Von Restorff target per section
- [ ] Anti-narrative check completed for utility products
- [ ] Voice direction specified per section

**Human checkpoint:** Present the narrative brief for approval before passing to the Copywriter.

## Step 2: Copy Execution

Invoke `web-copywriter` with the approved narrative brief.

## Step 3: Validation

- Squawk Test: cover the logo — is the copy distinctly yours?
- So What? Filter: every paragraph answers a customer question
- Awareness alignment: does the copy match the diagnosed level?

Consult `references/narrative-principles.md` for the full framework inventory.

## Companion Skills

The narrative skill works alongside existing web-god skills:
- **scrollytelling** — for scroll-driven narrative experiences (Director uses the narrative brief as creative brief input)
- **frontend** — narrative section structure informs architecture decisions
- **design-system** — voice direction maps to typography and color choices
