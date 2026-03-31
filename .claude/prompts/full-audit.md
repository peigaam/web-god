# WEB-GOD FULL AUDIT — Specialist Agent Team
# Paste into Claude Code from /Users/inspectre/developer/web-god-pkg
# Or run: claude -p "$(cat .claude/prompts/full-audit.md)"
# Uses: Conductor → Scout → Strategist → Critic → Sentinel → Tester → Scribe → Arbiter
# Expected: 20 iterations, ~45 min

You are executing a comprehensive audit of the `web-god` package — an all-in-one web development intelligence layer containing 15 agents, 9 skills, 9 reference docs, 10 React hooks, 3 git hooks, 7 tools, and 4 templates. The goal is to validate quality, identify gaps, and produce an actionable improvement plan before this ships to GitHub.

## PHASE 1: RECONNAISSANCE (Scout — iterations 1-3)

Use Scout to map the entire repository. Scout should:

### Iteration 1: Structure Inventory
- `find . -type f -not -path './.git/*' -not -name '.DS_Store' | sort`
- Count: files per directory, lines per file, total lines
- Verify the claimed inventory (15 agents, 9 skills, etc.) matches reality
- Flag any empty directories, stub files, or placeholder content

### Iteration 2: Cross-Reference Audit
For every agent that references another agent in its "Chaining" section:
- Does the referenced agent actually exist?
- Do the input/output contracts match? (Agent A says "hands off to B" — does B say "receives from A"?)
- Are there orphan agents (never referenced by any other agent or skill)?
- Are there missing agents (referenced but don't exist)?

### Iteration 3: Consistency Scan
Grep across all agents for:
- YAML frontmatter format consistency (`name`, `description`, `tools`, `model` present in all)
- Model assignments (which are opus vs sonnet — are the choices justified?)
- Tool declarations (do all agents that need Bash declare it?)
- Description trigger words (would Claude Code actually auto-activate these?)

**Scout deliverable:** `audit/01-recon-report.md` — complete inventory with discrepancies flagged.

---

## PHASE 2: ARCHITECTURE REVIEW (Strategist — iterations 4-6)

Use Strategist to evaluate the architectural decisions.

### Iteration 4: Domain Completeness
For each of the 9 domains (frontend, backend, scrollytelling, performance, security, SEO, testing, devops, design-system), evaluate:
- Does the agent roster cover the domain adequately? What roles are missing?
- Does the SKILL.md orchestrator actually chain agents in a useful pipeline?
- Is the reference doc substantive enough to be a real knowledge base, or is it surface-level?
- Compare against real-world production needs: what would a senior engineer need that isn't here?

### Iteration 5: Agent Architecture Evaluation
Evaluate the agent design philosophy:
- Are the agents too broad (trying to do everything) or too narrow (too specialized to be useful)?
- Is the Conductor/orchestrator pattern consistent across all skills?
- Do agents have clear boundaries or do responsibilities bleed across agents?
- Is the human checkpoint pattern applied consistently?
- Grade each agent: A (production-ready), B (needs polish), C (needs significant work), D (rewrite)

### Iteration 6: Tool & Hook Evaluation
Evaluate standalone tools and hooks:
- `tools/dom-auditor/index.js` — Is it truly project-agnostic? Does it work outside Next.js?
- `tools/build-gate/gate.sh` — Is the generalization from PBX complete? Any hardcoded assumptions?
- `hooks/react/*.ts` — Are they production-quality? Type-safe? Edge cases handled? SSR-safe?
- `hooks/git/*` — Do they follow Husky conventions? Are the error messages helpful?
- Playwright test suites — Are they functional as templates? Would they run?

**Strategist deliverable:** `audit/02-architecture-review.md` — grades per domain + gap analysis.

---

## PHASE 3: CODE QUALITY REVIEW (Critic — iterations 7-12)

Use Critic for deep quality review. One iteration per file category.

### Iteration 7: Agent Quality (agents/**/*.md)
For each of the 15 agent files:
- Is the agent prompt well-structured? (Clear role, constraints, output format, chaining)
- Are the instructions actionable or vague? ("Design a good API" = vague. "Every endpoint must specify auth, validation, error codes, idempotency" = actionable.)
- Does the agent avoid common AI prompt failures? (No contradictory instructions, no undefined terms, no ambiguous scoping)
- Does the output format actually work for downstream consumption?

### Iteration 8: Skill Quality (skills/**/SKILL.md)
For each of the 9 skill files:
- Is the pipeline order correct? Would executing steps out of order break?
- Are the review checklists complete and useful?
- Do the skills reference their agents by correct name?
- Is the human checkpoint placed at the right moment?
- Are quick commands / code snippets accurate?

### Iteration 9: Reference Doc Quality (skills/**/references/*.md)
For each of the 9 reference docs:
- Is the information accurate and current (March 2026)?
- Are there outdated recommendations? (deprecated APIs, old patterns)
- Is the depth appropriate? (Too shallow = useless. Too deep = overwhelming.)
- Are there factual errors or misleading advice?
- Do the principles actually inform the agent's decisions?

### Iteration 10: React Hook Quality (hooks/react/*.ts)
For each of the 10 hooks:
- TypeScript: Are types correct and complete? Any `any` types?
- SSR safety: Do all hooks guard against `window`/`document` in SSR?
- Cleanup: Do effects return cleanup functions where needed?
- Edge cases: What happens with null refs, unmounted components, rapid re-renders?
- API design: Are the return types ergonomic? Would you actually want to use this API?
- Test: mentally trace through each hook — would it work in a real Next.js app?

### Iteration 11: Tool Quality (tools/**/*.js, tools/**/*.sh)
For each tool:
- Does `dom-auditor/index.js` handle edge cases? (No Playwright installed, site unreachable, non-Next.js sites)
- Does `build-gate/gate.sh` work on macOS AND Linux? Any bash-isms that break on Ubuntu?
- Do the Playwright test suites import from `scrollytelling.config` correctly? Would they actually run?
- Are error messages clear and actionable?

### Iteration 12: Template Quality (templates/**/*.md, templates/**/*.json)
- Are the prompt templates truly generalized (no PBX-specific residue)?
- Are the config templates valid and well-documented?
- Would a first-time user understand how to customize these?

**Critic deliverable:** `audit/03-quality-review.md` — per-file grades + specific issues + fix recommendations.

---

## PHASE 4: SECURITY REVIEW (Sentinel — iterations 13-14)

Use Sentinel to audit security-related content.

### Iteration 13: Security Agent & Skill Accuracy
- Is the threat-modeler agent's STRIDE framework correctly applied?
- Is the OWASP Top 10 reference accurate for 2024/2025?
- Are the auth patterns (JWT, session, refresh token) correct and not dangerously misleading?
- Does the CSP template actually work? Is it too permissive?
- Are there any security anti-patterns in the advice?

### Iteration 14: Security of the Package Itself
- Does `install.sh` do anything dangerous? (arbitrary code execution, permission escalation)
- Does `bin/cli.js` properly sanitize user input before passing to execSync?
- Could a malicious `kill-list.json` cause command injection in `gate.sh`?
- Are there any path traversal risks in file copy operations?

**Sentinel deliverable:** `audit/04-security-review.md` — vulnerability findings + severity ratings.

---

## PHASE 5: TESTING ASSESSMENT (Tester — iterations 15-16)

Use Tester to evaluate testability and test coverage.

### Iteration 15: Playwright Test Suite Review
For each of the 3 test files (scroll-performance, visual-regression, accessibility):
- Would these tests actually run with a real scrollytelling.config.ts?
- Are the assertions meaningful or would they produce false passes?
- Are the thresholds reasonable (e.g., SSIM 0.95, jank rate 5%)?
- Is the test infrastructure (helpers, fixtures, setup) complete?

### Iteration 16: Test Gap Analysis
- Which tools have zero tests? (dom-auditor, build-gate, evaluator.py)
- Which hooks have zero tests? (all of them)
- What would a minimal test suite look like for the React hooks?
- What would CI look like for this repo? (GitHub Actions workflow missing)

**Tester deliverable:** `audit/05-test-assessment.md` — coverage gaps + recommended test additions.

---

## PHASE 6: DOCUMENTATION REVIEW (Scribe — iterations 17-18)

Use Scribe to evaluate documentation quality.

### Iteration 17: README & Onboarding
- Is the README accurate to the current state of the repo?
- Could a developer who's never seen this repo understand what it is in 60 seconds?
- Is the installation flow clear? Would `bash install.sh` actually work?
- Are the "Use with Claude Code" examples realistic?
- Is there a CONTRIBUTING.md? Should there be?

### Iteration 18: Per-Domain Documentation
- Does each domain have enough documentation to use independently?
- Are the agent descriptions clear enough for Claude Code auto-activation?
- Is there a "how to add a new domain" guide?
- Is the research/ directory useful to users or is it internal-only?

**Scribe deliverable:** `audit/06-documentation-review.md` — doc quality grades + specific rewrites needed.

---

## PHASE 7: SYNTHESIS (Arbiter — iterations 19-20)

Use Arbiter to synthesize all findings into an actionable plan.

### Iteration 19: Prioritized Issue List
Synthesize all 6 agent reports into a single prioritized list:

| Priority | Issue | Source | Effort | Impact |
|---|---|---|---|---|
| P0 | [Critical — blocks shipping] | [which agent found it] | S/M/L | High |
| P1 | [Important — should fix before v0.2] | ... | ... | ... |
| P2 | [Nice to have — future improvement] | ... | ... | ... |

### Iteration 20: Ship Readiness Verdict
Produce a final verdict:
- **SHIP** — ready for GitHub with known issues documented
- **FIX FIRST** — N critical issues must be resolved before shipping
- **RESTRUCTURE** — fundamental architecture problems require redesign

Include:
- Top 5 things to fix before pushing to GitHub
- Top 5 things to add in v0.2
- Top 5 things that are already excellent and should not be changed
- Suggested GitHub repo description, topics, and README badge strategy

**Arbiter deliverable:** `audit/07-final-verdict.md` — ship/no-ship decision + action plan.

---

## EXECUTION RULES

### Per-Iteration Cycle
1. **Read** the relevant files for this iteration (use Read tool, not guesswork)
2. **Analyze** against the criteria specified above
3. **Write** findings to the appropriate audit report file in `audit/`
4. **Commit** — `git add audit/ && git commit -m "audit(phase-N): iteration M — [what]"`

### File Discipline
- Create `audit/` directory for all outputs
- One report per phase (7 reports total)
- Reports are Markdown with tables, not prose dumps
- Every issue has: description, location (file:line or file), severity, fix recommendation

### Model Routing
- Scout iterations (1-3): use Sonnet (fast, cheap, exploratory)
- Strategist iterations (4-6): use Opus (deep architectural reasoning)
- Critic iterations (7-12): use Sonnet (systematic, high-volume review)
- Sentinel iterations (13-14): use Opus (security requires deep reasoning)
- Tester iterations (15-16): use Sonnet
- Scribe iterations (17-18): use Sonnet
- Arbiter iterations (19-20): use Opus (synthesis requires highest reasoning)

### Circuit Breakers
- If a single phase produces 50+ issues, summarize top 10 + "N more in category X"
- If the repo is fundamentally broken (won't install, agents don't load), stop and report
- Don't fix issues during the audit — only document them
- If context exceeds 50%, compact before starting the next phase

### Quality Standard
This audit should be the kind of review a senior principal engineer would do before approving an open-source release. Be specific, be harsh, be constructive. No "looks good" without evidence. No "could be improved" without saying exactly how. Every finding must cite the specific file and specific text that's problematic.

### Banned Behaviors
- Skimming files instead of reading them fully
- Saying "overall the code looks good" without specific evidence
- Marking something as "fine" because it compiles/parses
- Generic recommendations ("add more tests") without specifying which tests
- Self-rating the audit ("I'd give this a thorough review")

Begin. Create the `audit/` directory and start with Phase 1, Iteration 1. Read every file before judging it.
