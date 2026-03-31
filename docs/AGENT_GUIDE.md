# Agent Invocation Guide

How to invoke each agent effectively. Copy-paste these prompts into Claude Code.

---

## Core Pipeline Agents

### Scrollytelling Pipeline (5 agents, use via skill)

The scrollytelling pipeline runs as a complete skill. The skill orchestrates all 5 agents in sequence.

**Invoke the full pipeline:**
```
Build a scrollytelling landing page.
Topic: [your product]
Audience: [who]
Tone: [cinematic/playful/editorial/prestige]
Assets: [what you have — images, copy, data, video]
Emotional arc: [start feeling → middle → peak → end feeling]
Objective: [CTA goal — signup, purchase, awareness]
```

**Invoke individual agents (advanced):**

| Agent | Prompt | When |
|-------|--------|------|
| `scrollytelling-director` | "Create a narrative storyboard for a scrollytelling experience about [topic]" | Starting a new scrollytelling project |
| `scrollytelling-choreographer` | "Create an animation spec with scroll triggers from this storyboard: [paste or reference file]" | After Director produces storyboard |
| `scrollytelling-typographer` | "Design the type system for this scrollytelling experience" | After Choreographer produces animation spec |
| `scrollytelling-compositor` | "Design the visual composition and layer stacks for this experience" | After Typographer produces type spec |
| `scrollytelling-auditor` | "Validate the scrollytelling experience at http://localhost:3000" | After implementation is running |

### Frontend Pipeline (3 agents)

| Agent | Prompt | When |
|-------|--------|------|
| `frontend-architect` | "Design the architecture for a [type] web application" | Starting a new frontend project |
| `frontend-component-designer` | "Design the component API for [component name]" | Designing new components |
| `frontend-builder` | "Implement the architecture spec" | After architecture/design is approved |

**Full pipeline prompt:**
```
Plan and build a [type] web application.
Product: [what it does]
Users: [who uses it]
Key features: [feature list]
Stack preference: [Next.js App Router / Remix / Vite+React]
```

### Backend (1 agent)

| Agent | Prompt | When |
|-------|--------|------|
| `backend-api-architect` | "Design a REST API for [product/feature]" | Designing a new API or restructuring |

**Full prompt:**
```
Design a backend API for [product].
Resources: [users, projects, tasks, etc.]
Auth: [JWT / session / OAuth]
Database: [PostgreSQL / MongoDB / etc.]
Special requirements: [real-time, file uploads, background jobs, etc.]
```

---

## Reference Wrapper Agents

These agents auto-activate when you mention their domain. You can also invoke directly.

| Agent | Trigger Phrases | Example Prompt |
|-------|----------------|---------------|
| `performance-profiler` | "optimize performance", "site is slow", "improve LCP/CLS/INP" | "Audit the performance of this Next.js app and produce an optimization plan" |
| `security-threat-modeler` | "security review", "audit vulnerabilities", "check auth", "OWASP" | "Perform a STRIDE threat model on this API" |
| `seo-auditor` | "SEO audit", "meta tags", "structured data", "sitemap" | "Audit the SEO of this site and produce a fix list with scores per category" |
| `test-architect` | "set up tests", "testing strategy", "improve coverage" | "Design a testing strategy for this app using the Testing Diamond model" |
| `devops-deploy-planner` | "set up CI/CD", "deploy", "Docker", "staging", "GitHub Actions" | "Design a GitHub Actions CI/CD pipeline for this Next.js app" |
| `design-system-architect` | "design tokens", "component library", "dark mode", "theme" | "Create a design token system with light/dark mode for this project" |

---

## Chaining Agents Manually

For complex tasks, chain agents yourself:

**Architecture → Implementation → Review:**
```
1. "Design the frontend architecture for [app]"
   → Review the ADR, approve
2. "Implement this architecture following the ADR"
   → Builder follows the spec
3. "Design a testing strategy for what was built"
   → Test Architect produces test plan
```

**Security-Aware API Design:**
```
1. "Design the REST API for [product]"
   → API Architect produces spec
2. "Review this API design for security vulnerabilities using STRIDE"
   → Threat Modeler reviews, produces findings
3. Fix findings, then implement
```

**Full-Stack with Performance:**
```
1. "Design the frontend architecture" → ADR
2. "Design the backend API" → API spec
3. "Implement the frontend" → Code
4. "Implement the backend" → Code
5. "Audit the performance" → Optimization plan
6. "Audit the SEO" → Meta tag fixes
```

---

## Tips

- **Skills vs. agents:** Skills orchestrate multiple agents automatically. Use skills when you want the full pipeline. Use individual agents when you need one specific output.
- **Human checkpoints:** The scrollytelling and frontend skills pause for your approval at critical decision points (storyboard approval, ADR approval). Don't skip these.
- **Reference docs:** Every agent reads from `skills/[domain]/references/`. These contain the domain expertise. You can read them directly to understand what the agent knows.
- **Healing loops:** The scrollytelling auditor automatically diagnoses failures and proposes fixes. It has a 3-strike circuit breaker — after 3 failed fix attempts, it escalates to you.
