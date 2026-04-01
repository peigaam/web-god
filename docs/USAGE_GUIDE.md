# web-god Usage Guide

**How to get the full power of 17 agents and 11 skills in every project.**

---

## 1. Installation (one time, works everywhere)

```bash
git clone https://github.com/inspectre/web-god.git
cd web-god && bash install.sh
```

This installs globally to `~/.claude/`. Every project you open in Claude Code now has access to all 17 agents, 11 skills, and the global activation rule. Your existing project CLAUDE.md files are never touched.

---

## 2. The 60-Second Mental Model

web-god has two tiers of agents:

**Pipeline Agents** (produce structured artifacts through multi-step chains):
- Scrollytelling (5 agents) — creative brief → validated scroll experience
- Frontend (3 agents) — product brief → architecture → components → code
- Narrative (1 agent) — brand/product → story architecture + audience diagnosis

**Reference Experts** (deep knowledge that activates on demand):
- Copywriter, Security, Performance, SEO, Testing, DevOps, Design System

You don't need to memorize agent names. Just describe what you need.

---

## 3. Starting a New Project

### Step 1: Open Claude Code in your project
```bash
cd ~/Developer/my-new-project
claude
```

### Step 2: Tell Claude what you're building
Claude Code reads the global web-god rule and knows what agents are available. Just say what you need:

```
"I'm building a SaaS dashboard for financial analytics. 
Help me plan the architecture."
```

Claude activates: `frontend-architect` + `narrative-strategist` (for positioning) + `security-threat-modeler` (financial data = security-critical)

You don't invoke agents by name unless you want to. They activate from context.

---

## 4. Project-Type Playbooks

### 🎬 Scrollytelling / Narrative Landing Page

**The full pipeline (best results):**
```
Build a scrollytelling landing page.

Topic: [your product/brand]
Audience: [who they are, what they know]
Tone: [cinematic / playful / editorial / prestige]
Assets: [images, video, copy, data points you have]
Emotional arc: [what they should feel at start → middle → end]
Objective: [sign up / buy / donate / explore]
```

This triggers the complete chain:
1. **Narrative Strategist** diagnoses audience awareness (Schwartz) → designs story arc
2. **Scrollytelling Director** translates arc into scene-by-scene storyboard
3. **Choreographer** specifies scroll triggers, parallax, easing
4. **Typographer** designs kinetic type system
5. **Compositor** assembles visual layers
6. **Web Copywriter** writes the actual headlines, CTAs, body copy
7. **Frontend Builder** implements in Next.js + GSAP + Lenis
8. **Scrollytelling Auditor** validates via Playwright (60fps, a11y, visual regression)

**Quick version (skip the pipeline, get straight to building):**
```
"Build a scroll-driven page with 5 sections: hero, problem, solution, proof, CTA. 
Use GSAP ScrollTrigger + Lenis. Dark theme, cinematic feel."
```

---

### 📊 SaaS Dashboard / Web3 Dashboard

**Start with architecture:**
```
"Design the frontend architecture for a real-time analytics dashboard.
Stack: Next.js App Router, TypeScript, Tailwind.
Features: live data charts, user settings, team management, billing.
Auth: Clerk. Database: Supabase."
```
→ Triggers `frontend-architect` (ADR) → `design-system-architect` (tokens)

**Then narrative + copy (yes, dashboards need narrative too):**
```
"Use the narrative strategist to design the onboarding experience 
and empty states for this dashboard."
```
→ Triggers `narrative-strategist` in Glanceability mode (not storytelling mode)
→ Produces: onboarding flow narrative, empty state copy, dashboard microcopy

**Security review (critical for financial/web3):**
```
"Audit this dashboard for security vulnerabilities. 
It handles wallet connections and transaction signing."
```
→ Triggers `security-threat-modeler` with STRIDE analysis

---

### 🛍️ E-Commerce / Product Site

```
"Design the narrative and copy for a DTC skincare brand website.
Products: 5 SKUs. Audience: women 25-40, skincare-educated.
Objective: purchase. Tone: clean, scientific, trustworthy."
```
→ Triggers `narrative-strategist` (Schwartz: audience is Solution-Aware)
→ Then `web-copywriter` (product descriptions, headlines, CTAs)
→ Then `seo-auditor` (product schema, meta tags)

---

### 🔧 API / Backend Project

```
"Design a REST API for a multi-tenant project management SaaS.
Features: workspaces, projects, tasks, comments, file uploads.
Auth: JWT with refresh tokens. Database: PostgreSQL."
```
→ Triggers `backend-api-architect`
→ Produces: endpoint spec, database schema, auth flow, middleware chain, error handling

**Follow up with security:**
```
"Review this API design for security vulnerabilities."
```
→ Triggers `security-threat-modeler`

---

### 🎨 Component Library / Design System

```
"Create a design token system for a fintech product.
Brand colors: navy (#1a2332), gold (#d4a574).
Support light and dark mode. Target the W3C DTCG format."
```
→ Triggers `design-system-architect`
→ Produces: 3-tier token system, dark mode strategy, component conventions

---

### 📝 Blog / Content Site

```
"Audit the SEO of this Next.js blog and fix all issues."
```
→ Triggers `seo-auditor`
→ Produces: meta tag fixes, JSON-LD structured data, sitemap config, OG tags

---

## 5. Chaining Agents Manually

For complex projects, chain agents explicitly:

### Architecture → Narrative → Copy → Build
```
Step 1: "Use the frontend architect to design the architecture for this app"
  → Review ADR, approve

Step 2: "Use the narrative strategist to design the story and positioning"
  → Review narrative brief, approve

Step 3: "Use the web copywriter to write all copy based on the narrative brief"
  → Review copy, approve

Step 4: "Build the frontend following the architecture and using this copy"
  → Builder implements everything
```

### Security-First API Design
```
Step 1: "Use the backend API architect to design the API"
Step 2: "Use the security threat modeler to review this API design"
Step 3: Fix findings, then implement
```

### Full Scrollytelling Pipeline
```
Step 1: "Use the narrative strategist for this project" → narrative brief
Step 2: "Use the scrollytelling director with this brief" → storyboard
Step 3: "Use the web copywriter for each scene" → copy per scene
Step 4: "Build it" → implementation
Step 5: "Audit it" → Playwright validation
```

---

## 6. Reference Expert Quick Commands

These agents activate from natural language. No special syntax needed.

| What You Say | Agent That Activates | What You Get |
|---|---|---|
| "Audit this for security" | `security-threat-modeler` | STRIDE analysis + OWASP 2025 check |
| "Optimize performance" | `performance-profiler` | CWV audit + optimization plan |
| "Set up CI/CD" | `devops-deploy-planner` | GitHub Actions pipeline + Docker config |
| "Design a testing strategy" | `test-architect` | Testing Diamond plan + coverage targets |
| "Audit the SEO" | `seo-auditor` | Meta tags + JSON-LD + sitemap + OG |
| "Create design tokens" | `design-system-architect` | 3-tier token system + dark mode |
| "Write copy for this page" | `web-copywriter` | Headlines, CTAs, microcopy, value props |
| "Design the story for this" | `narrative-strategist` | Audience diagnosis + story architecture |

---

## 7. Standalone Tools (No AI Needed)

### DOM Auditor
Checks any website for layout issues across 3 viewports:
```bash
node path/to/web-god/tools/dom-auditor/index.js http://localhost:3000
# Add --strict for edge-padding checks
node path/to/web-god/tools/dom-auditor/index.js http://localhost:3000 --strict
```
Checks: overflow, text size (mobile), touch targets, contrast ratios, edge padding.

### Build Gate
Validates build integrity for any web project:
```bash
bash path/to/web-god/tools/build-gate/gate.sh /path/to/project
# With kill list (flags banned patterns)
bash path/to/web-god/tools/build-gate/gate.sh /path/to/project --kill-list kill-list.json
# With deleted component tracking
bash path/to/web-god/tools/build-gate/gate.sh /path/to/project DeletedComponent AnotherOne
```

### Git Hooks
Copy into your project for automated quality gates:
```bash
cp path/to/web-god/hooks/git/pre-commit .husky/pre-commit
cp path/to/web-god/hooks/git/pre-push .husky/pre-push
cp path/to/web-god/hooks/git/commit-msg .husky/commit-msg
chmod +x .husky/pre-commit .husky/pre-push .husky/commit-msg
```

---

## 8. Getting the Most Out of web-god

### Do's
- **Start with narrative.** Even for dashboards. "Use the narrative strategist" before designing. It diagnoses your audience and structures everything that follows.
- **Let agents chain.** Don't try to do architecture + copy + design in one prompt. Let each agent do its job and hand off.
- **Use the reference docs directly.** Every skill has a `references/` folder with deep knowledge. Ask Claude to read them: `"Read the security-principles.md reference doc and apply it to this project."`
- **Run the tools.** The DOM auditor catches things AI misses. Run it on every build.

### Don'ts
- **Don't invoke all 17 agents on one project.** A blog doesn't need the scrollytelling pipeline. A dashboard doesn't need SEO. Use what fits.
- **Don't skip the Schwartz diagnosis.** The narrative strategist asks about audience awareness level FIRST. This isn't busywork — it determines your entire page structure.
- **Don't apply scrollytelling thinking to dashboards.** The narrative strategist has a built-in anti-narrative check. If it detects a utility/dashboard project, it switches to Glanceability mode (Glance/Scan/Study hierarchy) instead of story mode.
- **Don't ignore the security agent for web3 projects.** Wallet connections, transaction signing, and smart contract interactions have unique attack surfaces.

---

## 9. Updating web-god

```bash
cd path/to/web-god
git pull origin main
bash install.sh
```

This re-installs all agents, skills, and the global rule. Your project CLAUDE.md files are never affected.

---

## 10. Quick Reference Card

```
━━━ PIPELINES (multi-agent chains) ━━━
SCROLLYTELLING    "Build a scrollytelling page for [brief]"
FRONTEND          "Design the architecture for [app description]"  
NARRATIVE         "Design the story and positioning for [product]"

━━━ REFERENCE EXPERTS (single-agent, deep knowledge) ━━━
COPY              "Write copy for [page/section/component]"
SECURITY          "Audit for security vulnerabilities"
PERFORMANCE       "Optimize performance / audit Core Web Vitals"
SEO               "Audit SEO / add structured data"
TESTING           "Design a testing strategy"
DEVOPS            "Set up CI/CD / deployment pipeline"
DESIGN SYSTEM     "Create design tokens / component conventions"
BACKEND           "Design the API for [feature]"

━━━ TOOLS (standalone, no AI) ━━━
DOM AUDIT         node tools/dom-auditor/index.js <url>
BUILD GATE        bash tools/build-gate/gate.sh <dir>
GIT HOOKS         Copy hooks/git/* to .husky/

━━━ NARRATIVE STRATEGY MODES ━━━
STORYTELLING      Landing pages, product sites, scrollytelling
GLANCEABILITY     Dashboards, admin panels, data-heavy tools
HYBRID            SaaS apps (marketing pages = story, app = glance)
```
