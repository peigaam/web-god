---
name: copywriting
description: >
  Writes web copy for any interface — headlines, CTAs, value propositions, body copy,
  microcopy, error messages, empty states, onboarding. Applies PAS/AIDA/BAB formulas
  with Voice-of-Customer research.
model: sonnet
---

# Web Copywriting Skill

Write production-grade copy for web interfaces, from landing page headlines to dashboard error messages.

## Pipeline

| Step | Action | Produces |
|---|---|---|
| 1 | Research | Voice-of-Customer mining (reviews, support tickets, forums) |
| 2 | Write | Headlines, body, CTAs, microcopy using appropriate formula |
| 3 | Test | Squawk Test, So What? Filter, reading level check |

## Step 1: Research

Before writing, mine customer language:
- Extract pain points, adjectives, desired outcomes from reviews
- Note the specific vocabulary customers use (not your internal jargon)
- Identify awareness level if not provided by Narrative Strategist

## Step 2: Write

Invoke `web-copywriter` with:
- Project type (SaaS, e-commerce, dashboard, web3, portfolio, nonprofit, API)
- Awareness level
- Voice direction (if available from narrative brief)
- Specific deliverables needed (headlines, body, microcopy, etc.)

## Step 3: Test

Apply quality checks:
- **Squawk Test:** could a competitor have written this? If yes, rewrite.
- **So What? Filter:** every paragraph must answer the customer's question
- **Reading level:** target 8th grade Flesch-Kincaid
- **Rule of One:** one reader, one idea, one CTA per piece

## Review Checklist
- [ ] Customer language used (not company jargon)
- [ ] Headlines follow a formula (not freeform)
- [ ] Every paragraph passes the So What? Filter
- [ ] Squawk Test passed (distinctly branded)
- [ ] One CTA per section, one primary per page
- [ ] Error messages use problem + solution (never blame)
- [ ] Reading level at 8th grade or below
- [ ] Numbers are specific, relative, and personal

**Human checkpoint:** Present copy for approval before integration.

Consult `references/copywriting-principles.md` for formulas, patterns, and operational rules.
