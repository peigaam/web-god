# WEB-GOD FINAL SWARM AUDIT — 40-Agent Parallel Review
# Run from: /Users/inspectre/developer/web-god-pkg
# Invoke: /swarm Execute the final swarm audit per .claude/prompts/final-swarm-audit.md
# Expected: ~5 min parallel execution → synthesis

You are the Conductor. Execute a comprehensive final audit of web-god using a 40-agent
parallel swarm. Each agent gets ONE focused task, runs independently, and reports back.
The Arbiter synthesizes all findings into a final ship/no-ship verdict.

This is the LAST gate before GitHub. Be ruthless.

---

## SWARM DEPLOYMENT — 40 Parallel Agents

### CLUSTER 1: PBX CONTAMINATION SWEEP (5 agents)

Each agent greps the ENTIRE repo for a different contamination category.
Report format: file:line — match — severity

**Agent 1 — Brand residue:**
```
grep -rni "pbx\|peigaam\|degular\|autospectre\|AutoSSD" --include="*.md" --include="*.js" --include="*.sh" --include="*.json" --include="*.ts" --include="*.py" . | grep -v ".git/" | grep -v "audit/"
```
PASS = zero matches. ANY match = P0 blocker.

**Agent 2 — Color residue:**
```
grep -rni "#00D4FF\|#6EFFB8\|tidal\|mint.*gradient" --include="*.md" --include="*.js" --include="*.sh" --include="*.json" --include="*.ts" . | grep -v ".git/" | grep -v "audit/" | grep -v "research/"
```

**Agent 3 — Project-specific residue:**
```
grep -rni "Mac Mini\|scrollytelling-polish\|FeeStructure\|PickACity\|StatClose\|ThreeMoves\|TheSignal\|Polymarket\|142M\|60bps\|launch-claude\|verify-pbx\|feature/scrollytelling" --include="*.md" --include="*.js" --include="*.sh" --include="*.json" --include="*.ts" . | grep -v ".git/" | grep -v "audit/" | grep -v "research/"
```

**Agent 4 — Hardcoded paths/usernames:**
```
grep -rni "yourusername\|/Volumes/\|192\.168\.\|localhost:3000" --include="*.md" --include="*.js" --include="*.sh" --include="*.json" --include="*.ts" . | grep -v ".git/" | grep -v "audit/" | grep -v "node_modules"
```
Note: localhost:3000 is acceptable in tool defaults and docs. Flag only if hardcoded without fallback.

**Agent 5 — Secret/credential patterns:**
```
grep -rni "sk-\|ghp_\|github_pat_\|AKIA\|xox-\|password.*=.*['\"]" --include="*.md" --include="*.js" --include="*.sh" --include="*.json" --include="*.ts" . | grep -v ".git/"
```

### CLUSTER 2: STRUCTURAL INTEGRITY (5 agents)

**Agent 6 — File inventory verification:**
Count all agents, skills, references, hooks, tools. Compare against README claims. Any mismatch = P1.

**Agent 7 — Agent frontmatter validation:**
For every .md file in agents/, verify YAML frontmatter has: name, description, tools, model.
Check the new `tier` field exists (core or reference). Report missing fields.

**Agent 8 — Agent cross-reference integrity:**
For every agent's Chaining section, verify every referenced agent name matches an actual
`name:` field in another agent file. Report any broken references.

**Agent 9 — Skill-to-agent name matching:**
For every SKILL.md, extract agent names referenced in backticks. Verify each matches an
actual agent `name:` field. Report mismatches.

**Agent 10 — Orphan file detection:**
Find files not referenced by any README, SKILL.md, agent, or CLAUDE.md.
Find directories that are empty or contain only .DS_Store.

### CLUSTER 3: SECURITY AUDIT (5 agents)

**Agent 11 — CLI security:**
Read bin/cli.js. Verify ALL user input goes through execFileSync with arrays, never execSync
with string interpolation. Test: could `web-god audit "; rm -rf /"` cause damage?

**Agent 12 — Shell script injection:**
Read tools/build-gate/gate.sh and install.sh. Check every variable interpolation for injection
risk. Verify kill-list JSON parsing doesn't eval user input.

**Agent 13 — Dependency supply chain:**
Read package.json. Check all declared dependencies and peerDependencies. Are versions pinned?
Are there unnecessary dependencies? Is there anything sus?

**Agent 14 — Security advice accuracy:**
Read agents/security/threat-modeler.md and skills/security/references/security-principles.md.
Is any advice dangerously wrong? Would following these recommendations create vulnerabilities?

**Agent 15 — Permissions audit:**
Read install.sh. Does it: escalate privileges? Write outside ~/.claude/? Execute remote code?
Delete user data without backup? `rm -rf` without safety?

### CLUSTER 4: CODE QUALITY — HOOKS (5 agents)

**Agent 16 — useMediaQuery SSR audit:**
Read examples/react-hooks/useMediaQuery.ts. Verify the mounted pattern prevents hydration
mismatch. Trace: server render → client hydrate → effect fires. Any flash?

**Agent 17 — useTheme FOUC audit:**
Read examples/react-hooks/useTheme.ts. Verify: no Flash of Unstyled Content. Does initial
render match server? Does the mounted guard work? Is localStorage access SSR-safe?

**Agent 18 — Hook cleanup audit:**
Read ALL hooks. For every useEffect, verify a cleanup function exists where needed.
Specific: useCopyToClipboard timeout, useMediaQuery listener, useIntersectionObserver observer,
useKeyboardShortcut listener, useLockBodyScroll style restoration.

**Agent 19 — Hook TypeScript audit:**
Read ALL hooks. Check: any `any` types? All return types explicit or correctly inferred?
Generic constraints correct? RefObject types correct (should be HTMLElement not HTMLDivElement)?

**Agent 20 — Hook test coverage:**
Read examples/react-hooks/__tests__/hooks.test.ts. Does it test the critical paths?
Missing: SSR behavior, unmount cleanup, edge cases (empty values, rapid re-renders)?

### CLUSTER 5: DOCUMENTATION QUALITY (5 agents)

**Agent 21 — README accuracy:**
Read README.md line by line. Every claim must be verifiable. Check: file counts, domain
table, tool names, installation instructions, CLI commands. One false claim = P1.

**Agent 22 — Agent Guide completeness:**
Read docs/AGENT_GUIDE.md. Verify: every one of the 15 agents has an invocation prompt.
Are the prompts actually useful? Would they trigger auto-activation?

**Agent 23 — CLAUDE.md adequacy:**
Read .claude/CLAUDE.md. Does it give Claude Code enough context to understand this repo?
Is the tier system explained? Would a fresh Claude Code session know how to navigate?

**Agent 24 — Reference doc currency:**
Read all 9 reference docs in skills/*/references/. Check for: outdated API recommendations,
deprecated patterns, wrong version numbers, stale URLs. Current date: March 2026.

**Agent 25 — Onboarding path test:**
Simulate a new user: read README → install.sh → CLAUDE.md → AGENT_GUIDE. Is the path
clear? Are there dead ends? Missing steps? Confusing jargon without explanation?

### CLUSTER 6: TOOL QUALITY (5 agents)

**Agent 26 — dom-auditor portability:**
Read tools/dom-auditor/index.js. Test mentally: would this work on a Vite app? A Remix app?
A plain HTML site? What assumptions does it make about the target?

**Agent 27 — build-gate portability:**
Read tools/build-gate/gate.sh. Verify: no Python3 dependency remaining. Source directory
auto-detection works. Works on both macOS and Ubuntu. No bash-isms that break on sh.

**Agent 28 — CI workflow validity:**
Read .github/workflows/ci.yml. Would this actually pass on a fresh Ubuntu runner?
Are all referenced tools available? Are the assertions correct?

**Agent 29 — Playwright test validity:**
Read all 3 test files in tools/testing/. Would they run if given a valid scrollytelling.config.ts?
Are imports correct? Are assertions meaningful?

**Agent 30 — evaluator.py validity:**
Read skills/scrollytelling/scripts/evaluator.py. Run a mental trace: what happens when
you pass it a well-formed storyboard? A malformed one? Does it catch real issues?

### CLUSTER 7: ARCHITECTURE VISION (5 agents)

**Agent 31 — Competitive positioning:**
Web search: what Claude Code skill packages exist as of March 2026? How does web-god
compare? Is the "Core Pipeline vs Reference Wrapper" tier honest and well-positioned?

**Agent 32 — Scrollytelling pipeline uniqueness:**
Web search: does any competing AI-powered scrollytelling pipeline exist? Validate the
claim that this is "genuinely unique." If competitors exist, how does web-god compare?

**Agent 33 — Agent count assessment:**
Read all 15 agents. Are all 15 justified? Are any redundant? Does the tier system
(9 core + 6 reference) make the count manageable? Or is it still confusing?

**Agent 34 — Extensibility assessment:**
Read docs/ADDING_A_DOMAIN.md. Is the architecture actually extensible? Could a contributor
add a 10th domain without understanding the entire codebase? What's missing?

**Agent 35 — Value proposition clarity:**
Read the full README. In one sentence, what is web-god's value proposition? Is it clear?
Would a developer scrolling GitHub understand why they should install this in 10 seconds?

### CLUSTER 8: EDGE CASES & STRESS (5 agents)

**Agent 36 — Empty/null inputs:**
For each tool (dom-auditor, build-gate, CLI): what happens with no arguments? Empty string?
Invalid URL? Non-existent directory? Do they fail gracefully or crash?

**Agent 37 — Large-scale test:**
Could web-god's agents handle a 500-component Next.js app? A 100-page scrollytelling site?
Are there any O(n²) patterns in the tools that would choke on large inputs?

**Agent 38 — Conflict detection:**
If a user has existing ~/.claude/agents/ files, does install.sh clobber them? The `webgod-`
prefix should prevent conflicts — verify this is consistent.

**Agent 39 — Offline usability:**
Does web-god work fully offline? Or do any agents/tools require network access?
(Agents should work offline. Web search in research agents is expected to need network.)

**Agent 40 — License compliance:**
Read LICENSE and package.json. Is MIT license properly declared in both? Are there any
dependencies with incompatible licenses? Any code that appears copied without attribution?

---

## SYNTHESIS PROTOCOL

After all 40 agents report, the Arbiter synthesizes:

### 1. Contamination Verdict (Cluster 1)
CLEAN or CONTAMINATED. If contaminated: exact locations, exact strings.

### 2. Integrity Verdict (Cluster 2)
SOUND or BROKEN. If broken: which references are wrong, which files are orphaned.

### 3. Security Verdict (Cluster 3)
SECURE or VULNERABLE. If vulnerable: exact CVE-style descriptions.

### 4. Code Quality Verdict (Cluster 4)
PRODUCTION or DRAFT. If draft: exact hooks with exact bugs.

### 5. Documentation Verdict (Cluster 5)
CLEAR or MISLEADING. If misleading: exact false claims with corrections.

### 6. Tool Verdict (Cluster 6)
PORTABLE or FRAGILE. If fragile: which tools break on which platforms.

### 7. Architecture Verdict (Cluster 7)
DIFFERENTIATED or COMMODITY. Where exactly does web-god win vs. the market?

### 8. Robustness Verdict (Cluster 8)
RESILIENT or BRITTLE. Which edge cases would embarrass a public release?

### FINAL VERDICT

```
╔══════════════════════════════════════════════╗
║           WEB-GOD FINAL VERDICT              ║
╠══════════════════════════════════════════════╣
║  Grade: [A/B/C/D/F]                         ║
║  Decision: [SHIP / FIX FIRST / NO SHIP]     ║
║  P0 Blockers: [count]                        ║
║  P1 Issues: [count]                          ║
║  P2 Nice-to-haves: [count]                   ║
╚══════════════════════════════════════════════╝
```

If SHIP: produce the exact `gh repo create` command with description and topics.
If FIX FIRST: produce exact fix list with file:line for each.
If NO SHIP: explain what's fundamentally wrong.

Write the full synthesis to `audit/08-swarm-final-verdict.md`.
