# Web-God: Web Research Findings & Strategic Recommendations
## Post-Audit Intelligence Report — March 31, 2026

---

## 1. COMPETITIVE LANDSCAPE (as of March 2026)

### The Ecosystem Has Exploded

The Claude Code skill ecosystem is now massive and standardized:

- **VoltAgent/awesome-agent-skills**: 1,234+ skills, 22,000+ GitHub stars, compatible across Claude Code, Codex, Gemini CLI, Cursor, Antigravity IDE. The universal SKILL.md format is now an open standard.
- **alirezarezvani/claude-skills**: 220+ skills, 5,200+ stars, 11 platforms. Organized by domain (engineering, marketing, product, C-level).
- **Anthropic official skills repo**: Pre-built document skills (pptx, xlsx, docx, pdf) with 277K+ installs for frontend-design alone.
- **SkillsMP.com**: A marketplace/directory scraping GitHub for skills.
- **Agent Skills open standard (agentskills.io)**: Released Dec 2025. Skills are now portable across Claude Code, ChatGPT/Codex, Cursor, Gemini CLI.

### What This Means for web-god

**web-god is entering a crowded general market but an empty niche.** The 1,234+ skills in awesome-agent-skills are fragmented individual skills. Nobody has built a cohesive, multi-agent pipeline for scrollytelling — or for any domain really. The pipeline orchestration (skill chains agents in sequence with healing loops) is genuinely uncommon.

However: the commodity domains (SEO, DevOps, Design System) compete directly with existing standalone skills that have more stars and more installs. web-god's value is NOT in breadth — it's in depth of the scrollytelling and frontend pipelines.

---

## 2. TECHNOLOGY VALIDATION

### GSAP + Lenis: Confirmed Correct Stack

Research confirms web-god's technology choices:

- **Lenis is the 2026 industry standard** for smooth momentum scrolling. Multiple sources confirm it has "usurped all competitors." 3KB footprint. Doesn't break CSS sticky or IntersectionObserver. Last updated March 2026.
- **GSAP ScrollTrigger remains the production choice** for complex scroll-driven animation. Now 100% free for commercial use (changed from previous paid model).
- **CSS scroll-timeline (animation-timeline: scroll())** is emerging but NOT ready for production. Chrome 115+ only. Firefox/Safari support via GSAP fallback. web-god's decision to use GSAP as primary with CSS as future consideration is correct.

### Future-Proofing Opportunity

CSS Scroll-Driven Animations spec is maturing. web-god's choreographer agent should eventually include guidance on progressive enhancement: use native CSS scroll-timeline where supported, GSAP ScrollTrigger as fallback. This would be a v0.3+ addition.

### View Transitions API

Not currently mentioned in web-god. The View Transitions API is the next frontier for page-level transitions in Next.js App Router. The scrollytelling pipeline should eventually incorporate this for inter-page narrative transitions.

---

## 3. SKILL FORMAT EVOLUTION

### Claude Code Skills 2.0 Architecture

Since web-god was designed, Claude Code skills have evolved significantly:

- **context: fork** — Skills can now spawn isolated subagents with their own context windows. web-god's scrollytelling skill should use this for the Director (opus) stage.
- **agent: Explore/Plan** — Built-in agent types for read-only exploration. web-god's Scout equivalent is now built into Claude Code.
- **Dynamic context injection** — Shell commands in frontmatter can inject live data before Claude sees the prompt (e.g., `!git diff` results).
- **Lifecycle hooks** — Skills can hook into PreToolUse, PostToolUse, Stop, PreCompact events.
- **Bundled skills** — `/init`, `/review`, `/pr` ship with Claude Code and spawn parallel agents.

### Recommendation: Modernize Skill Format

web-god's skills should adopt the new frontmatter features:

```yaml
---
name: scrollytelling
description: Build scroll-driven narrative experiences
context: fork          # NEW — runs in isolated context
agent: Plan            # NEW — uses Plan agent for architecture
allowed-tools:         # NEW — restrict tool access
  - Read
  - Write
  - Bash(npm *)
---
```

This is a high-leverage, low-effort upgrade.

---

## 4. STRATEGIC RECOMMENDATIONS

### Tier 1: Do Before GitHub Push (< 1 hour)

1. **Add `context: fork` to scrollytelling SKILL.md** — This is the single highest-leverage format change. The Director stage should run in a forked context so it doesn't pollute the main conversation.

2. **Add agentskills.io compatibility note to README** — web-god skills follow the open standard. State this explicitly: "Compatible with the Agent Skills open standard (agentskills.io). Works in Claude Code, Codex CLI, Gemini CLI, and any tool supporting the SKILL.md format."

3. **Add the `smixs/creative-director-skill` as a comparison reference** — This is the closest competitor to the scrollytelling Director agent (recursive self-assessment, 20+ methodologies). web-god's cognitive science grounding (Duarte, Gestalt, Von Restorff) is deeper but the creative-director-skill has more methodologies. Study it.

### Tier 2: Do in v0.2 (1-2 weeks)

4. **Add CSS scroll-timeline progressive enhancement to choreographer agent** — The choreographer should mention: "For browsers supporting CSS scroll-timeline (Chrome 115+), prefer native animation-timeline: scroll() for simple reveals. Use GSAP ScrollTrigger for complex sequences, pinning, and cross-browser support."

5. **Register as a Plugin Marketplace** — Claude Code supports `/plugin marketplace add`. web-god should be installable via: `/plugin marketplace add inspectre/web-god` then `/plugin install scrollytelling@web-god`. This requires a `plugin-manifest.json`.

6. **Add View Transitions API guidance** — The frontend-architect agent should include View Transitions API for page transitions in Next.js App Router. This is the next wave.

7. **Create a `context: fork` version of each thin domain skill** — When a thin skill runs in a forked context with its reference doc pre-loaded, it becomes significantly more useful than pasting the reference doc manually.

### Tier 3: Do in v0.3+ (1-2 months)

8. **Build a GSAP ScrollTrigger skill** — The official GSAP ecosystem now has Agent Skills (mentioned in awesome-agent-skills). web-god's scrollytelling pipeline should integrate or reference these rather than duplicating GSAP knowledge.

9. **Add AI-aware security (ASTRIDE)** — The audit flagged this. STRIDE extended with AI-specific threats (prompt injection, training data extraction, model manipulation). This would differentiate the security agent.

10. **Evaluate consolidation vs deepening** — After 3 months of real usage data, decide: are users invoking the thin domain agents? If yes, deepen them. If no, consolidate into broader agents.

---

## 5. POSITIONING STRATEGY

### Lead With What's Unique

The README and GitHub description should lead with scrollytelling, not "all-in-one web development." The honest positioning:

> **web-god**: AI-powered scrollytelling factory + web architecture intelligence for Claude Code. The only cognitive-science-grounded scroll-driven animation pipeline. Also includes frontend/backend architecture agents and reference-grade web development knowledge bases.

### Don't Compete With awesome-agent-skills

web-god is NOT a skill library (1,234 skills). It's a production pipeline (5 orchestrated agents producing a validated scrollytelling experience). This is a fundamentally different value proposition. Frame it as such.

### GitHub Topics for Discovery

```
claude-code, agent-skills, scrollytelling, gsap, lenis, nextjs, 
web-architecture, playwright, accessibility, cognitive-science,
scroll-driven-animations, design-system
```

---

## 6. SWARM AUDIT FINDINGS INTEGRATION

From the screenshot: all 6 parallel agent clusters returned. Key findings to address:

1. **Scrollytelling agents use prose references instead of backtick agent names** — Style inconsistency. Standardize to backtick format for machine-readability.
2. **backend-api-architect labeled "core" but functions as single-agent domain** — Either relabel as "reference" tier or add schema-designer + auth-engineer agents to make it a real pipeline. Recommendation: relabel as "reference" for honesty. It's one agent with a great reference doc.
3. **README shows filename "token-architect" but agent name: field is "design-system-architect"** — Fix README to show the `name:` field value, since that's what users invoke.
4. **Agent backup mechanism missing from install.sh for agent files** — Skills get backed up but agents don't. Add the same backup pattern.

---

## 7. FINAL VERDICT

**SHIP IT.** The P0s are fixed. The architecture is validated by industry research. The scrollytelling pipeline is genuinely unique. The format follows the open standard. The remaining issues (thin domains, hook commodity, agent count) are honest trade-offs documented in the tiered README.

### Exact Ship Command

```bash
cd /Users/inspectre/developer/web-god-pkg
gh repo create web-god --public \
  --description "AI-powered scrollytelling factory + web architecture intelligence for Claude Code. Cognitive-science-grounded scroll animation pipeline with Duarte methodology, GSAP+Lenis, Playwright QA, and healing loops." \
  --source=. --push
```

### Post-Ship Priority (first week)

1. Register as Claude Code plugin marketplace
2. Add `context: fork` to scrollytelling skill
3. Post to Claude Code community (Discord, GitHub discussions)
4. Submit to VoltAgent/awesome-agent-skills for listing
