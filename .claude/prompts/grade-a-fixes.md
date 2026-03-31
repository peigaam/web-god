# WEB-GOD GRADE-A FIX SWEEP
# Run from: /Users/inspectre/developer/web-god-pkg
# claude -p "$(cat .claude/prompts/grade-a-fixes.md)"
# Uses: Builder (primary), Sentinel (security fixes), Tester (tests + CI)
# Expected: 15 iterations, ~30 min. Commit after each phase.

You are executing a systematic fix sweep on the `web-god` package to resolve all issues
identified in the audit (see `audit/` directory). The goal: move from Grade B to Grade A.

Read `audit/07-final-verdict.md` first for full context.

---

## PHASE 1: P0 CRITICAL FIXES (iterations 1-2) — MUST SHIP

### Iteration 1: Security + PBX Residue

**Fix 1 — Command injection in `bin/cli.js`**
Replace ALL `execSync` with `execFileSync` using argument arrays. Never pass user input into shell strings.

```javascript
// BEFORE (vulnerable):
execSync(`node ${ROOT}/tools/dom-auditor/index.js ${args[1]} ${args.slice(2).join(' ')}`, { stdio: 'inherit' });

// AFTER (safe):
const { execFileSync } = require('child_process');
execFileSync('node', [
  `${ROOT}/tools/dom-auditor/index.js`,
  args[1] || 'http://localhost:3000',
  ...args.slice(2)
], { stdio: 'inherit' });
```
Do this for ALL commands in the COMMANDS object. The `install` command (which has no user input) can remain as-is.

**Fix 2 — Remove "Degular" from `tools/dom-auditor/index.js`**
Line ~141 references "Degular" — a PBX-specific font. Two options:
- Option A: Remove the entire font fallback check (CHECK 5) — it's project-specific and not generalizable
- Option B: Make it configurable via CLI flag `--expected-font "FontName"`
Choose Option A (simpler, cleaner). Delete the entire CHECK 5 block and update the comment count.

### Iteration 2: README + LICENSE

**Fix 3 — Fix README.md**
The domain table at line ~29-39 lists tools that don't exist (api-validator, screenshot, lighthouse-runner, meta-validator, security-scanner, token-validator, etc.). Replace with ONLY tools that actually exist:

| Domain | Tools |
|--------|-------|
| Scrollytelling | dom-auditor |
| DevOps | build-gate |
| Testing | Playwright test templates |
| All others | — (agent + skill only) |

Also fix: replace `yourusername` with `inspectre` in the git clone URL.

**Fix 4 — Create LICENSE file**
Create a proper MIT LICENSE file at the repo root with the current year (2026) and author "Inspectre Technologies".

**Fix 5 — Create `.claude/CLAUDE.md`**
Create a project-level CLAUDE.md so Claude Code understands this repo:
```markdown
# web-god

Web development intelligence layer: agents, skills, tools, hooks.

## Structure
- agents/ — Claude Code agent files (YAML frontmatter + markdown)
- skills/ — Orchestrator skills (SKILL.md + references/ + scripts/)
- tools/ — Standalone scripts (Node.js, bash)
- hooks/react/ — React hooks (TypeScript)
- hooks/git/ — Git hooks (bash)

## Conventions
- Agents use YAML frontmatter: name, description, tools, model
- Skills reference agents by their frontmatter `name` field
- All React hooks are 'use client' and SSR-safe
```

**Commit:** `fix(p0): resolve 4 critical issues — injection, PBX residue, README, LICENSE`

---

## PHASE 2: HOOK FIXES (iterations 3-5) — SSR + TYPE SAFETY

### Iteration 3: Fix useMediaQuery SSR

The current `useState(false)` causes hydration mismatch. Fix:

```typescript
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });
  // ... rest stays the same
}
```

BUT — this still causes hydration mismatch because server returns false and client may return true. The proper fix is a two-pass approach:

```typescript
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  // Return defaultValue during SSR and first client render to prevent hydration mismatch
  if (!mounted) return defaultValue;
  return matches;
}
```

### Iteration 4: Fix useTheme FOUC

The current implementation flashes light theme before applying the real theme. Fix using a blocking approach:

1. Accept `defaultTheme` parameter
2. Use `mounted` pattern like useMediaQuery
3. Add `suppressHydrationWarning` guidance in the JSDoc
4. The initial render returns `defaultTheme` to match server

```typescript
export function useTheme(options: { storageKey?: string; defaultTheme?: ResolvedTheme } = {}) {
  const { storageKey = 'theme', defaultTheme = 'light' } = options;
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setThemeState(stored);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [theme, mounted, getSystemTheme]);

  // ... rest stays the same, but toggle/setTheme also stay
  // Return defaultTheme during SSR to prevent hydration mismatch
  return { theme, resolvedTheme: mounted ? resolvedTheme : defaultTheme, setTheme, toggle };
}
```

Add JSDoc note: "Add `suppressHydrationWarning` to your `<html>` element when using this hook."

### Iteration 5: Fix remaining hook issues

**Fix useCopyToClipboard** — Add unmount cleanup:
```typescript
// Add at the end of the hook, before return:
useEffect(() => {
  return () => clearTimeout(timeoutRef.current);
}, []);
```

**Fix useIntersectionObserver** — Change ref type from `HTMLDivElement` to `HTMLElement`:
```typescript
const ref = useRef<HTMLElement | null>(null);
// Return type also changes
}: { ref: RefObject<HTMLElement | null>; ... }
```

**Fix useReducedMotion** — Now inherits the fix from useMediaQuery. Verify it works:
```typescript
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
```
This now returns `false` during SSR (safe default — animations enabled during SSR).

**Commit:** `fix(hooks): resolve SSR hydration issues, FOUC, unmount cleanup, ref type`

---

## PHASE 3: AGENT & SKILL FIXES (iterations 6-9)

### Iteration 6: Fix agent chaining references

Read `audit/01-recon-report.md` for the exact mismatches. Fix these specific references:

1. `agents/frontend/architect.md` — "Component Designer" → `frontend-component-designer`, "Design System Engineer" → `design-system-architect`
2. `agents/frontend/component-designer.md` — "Design System Engineer" → `design-system-architect`
3. `agents/frontend/builder.md` — "Design System Architect (tokens)" → `design-system-architect`
4. `agents/backend/api-architect.md` — "Security Reviewer" → `security-threat-modeler`, "Schema Designer" → remove (doesn't exist), "Auth Engineer" → remove (doesn't exist)
5. `agents/performance/profiler.md` — "Frontend Architect" → `frontend-architect`, "Backend Architect" → `backend-api-architect`

For any agent missing a Chaining section entirely, add one. Read each agent file and verify every referenced agent name matches an actual file in `agents/`.

### Iteration 7: Fix skill agent name references

1. `skills/frontend/SKILL.md` — References "Design System Engineer" → change to `design-system-architect`
2. `skills/backend/SKILL.md` — References `npx web-god security .` → remove (CLI doesn't have this command)
3. All skills: ensure agent names in backticks match the `name:` field in the agent's YAML frontmatter

### Iteration 8: Strengthen thin skills

For each of these 7 skills (backend, performance, security, seo, testing, devops, design-system):

1. Add a **review checklist** (5-8 items with `- [ ]` checkboxes) after the implementation step
2. Add a **human checkpoint** note: "Present [deliverable] to the user for approval before proceeding"
3. Add a **"Consult `references/[name]-principles.md`"** line pointing to their reference doc
4. Ensure the pipeline steps reference the correct agent by `name:` field

Don't bloat them — keep each skill under 60 lines. The scrollytelling skill at 174 lines is for a 5-agent pipeline; single-agent domains should be 40-60 lines.

### Iteration 9: Fix minor content issues

1. `skills/security/references/security-principles.md` — Add note: "Based on OWASP Top 10 (2021). Check owasp.org for the latest version."
2. `skills/backend/references/backend-principles.md` line ~73 — Add note after account lockout: "Note: account lockout can be exploited for denial-of-service. Consider progressive delays as an alternative."
3. `templates/configs/kill-list.example.json` — Replace `#00D4FF` with `#FF0000` and update description
4. `skills/security/references/security-principles.md` CSP section — Add note: "The `img-src https:` directive is deliberately permissive for a starter template. Restrict to specific CDN domains in production."

**Commit:** `fix(agents): resolve chaining references, strengthen skills, fix content issues`

---

## PHASE 4: TOOL FIXES (iterations 10-11)

### Iteration 10: Fix gate.sh portability

1. Replace Python3 JSON parsing with Node.js:
```bash
# BEFORE:
python3 -c "import json,sys; [print(p) for p in json.load(open('$KILL_LIST')).get('patterns',[])]"

# AFTER:
node -e "const d=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));(d.patterns||[]).forEach(p=>console.log(p))" "$KILL_LIST"
```

2. Replace hardcoded `$PROJECT_ROOT/src` with auto-detection:
```bash
# Auto-detect source directory
if [ -d "$PROJECT_ROOT/src" ]; then
  SRC_DIR="$PROJECT_ROOT/src"
elif [ -d "$PROJECT_ROOT/app" ]; then
  SRC_DIR="$PROJECT_ROOT/app"
elif [ -d "$PROJECT_ROOT/lib" ]; then
  SRC_DIR="$PROJECT_ROOT/lib"
else
  SRC_DIR="$PROJECT_ROOT"
fi
```
Then replace all `"$PROJECT_ROOT/src"` with `"$SRC_DIR"`.

3. Fix install.sh — Add backup before `rm -rf`:
```bash
if [ -d "$dest_dir" ]; then
  echo "   Updating $skill_name (backing up existing)..."
  mv "$dest_dir" "${dest_dir}.bak.$(date +%s)" 2>/dev/null || true
fi
cp -r "$skill_dir" "$dest_dir"
```

### Iteration 11: Expand CLI to match referenced commands

The README and skills reference `web-god security`, `web-god perf`, `web-god seo` but the CLI only has 3 commands. Add stub commands that print helpful messages:

```javascript
security: {
  desc: 'Run security scan (coming in v0.2)',
  run: () => {
    console.log('Security scanning is planned for v0.2.');
    console.log('For now, use the security-threat-modeler agent in Claude Code:');
    console.log('  "Use the security agent to audit this project"');
    process.exit(0);
  }
},
```

Do this for `security`, `perf`, and `seo`. This way the commands exist (no broken workflow) but honestly communicate current state.

**Commit:** `fix(tools): gate.sh portability, install.sh backup, CLI stub commands`

---

## PHASE 5: TESTS + CI (iterations 12-14)

### Iteration 12: React hook tests

Create `hooks/react/__tests__/` with tests for the highest-risk hooks. Use Vitest + Testing Library patterns (but write them as plain test files, not requiring a build):

Create `hooks/react/__tests__/hooks.test.ts` — a test spec document that validates:
- useDebounce: updates after delay, cleanup on unmount
- useLocalStorage: reads/writes localStorage, handles JSON parse errors
- useCopyToClipboard: copies text, resets after timeout, cleans up on unmount
- useScrollProgress: returns 0-1 range, handles zero scroll height
- useMediaQuery: returns defaultValue during SSR, updates on media change
- useTheme: returns defaultTheme before mount, persists to localStorage

These should be actual runnable tests. Create a minimal `vitest.config.ts` at repo root:
```typescript
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['hooks/react/__tests__/**/*.test.ts'],
  },
});
```

### Iteration 13: Tool tests

Create `tools/__tests__/gate.test.sh` — a bash test script that:
- Creates a temp directory with a minimal Next.js-like project structure
- Runs gate.sh against it
- Verifies STATUS: PASS for clean projects
- Verifies STATUS: FAIL when orphan imports exist
- Cleans up temp directory

Create `tools/__tests__/dom-auditor.test.js` — a Node.js test that:
- Verifies the script loads without errors (require test)
- Verifies VIEWPORTS array contains 3 viewports
- Verifies SKIP_TAGS set contains expected tags
- Doesn't require a running server (structural tests only)

### Iteration 14: GitHub Actions CI

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Verify structure
        run: |
          # Check all expected files exist
          test -f README.md
          test -f LICENSE
          test -f package.json
          test -f install.sh
          test -f bin/cli.js
          # Count agents
          AGENT_COUNT=$(find agents -name '*.md' | wc -l)
          echo "Agents: $AGENT_COUNT"
          [ "$AGENT_COUNT" -ge 10 ] || exit 1

      - name: Shellcheck
        run: |
          sudo apt-get install -y shellcheck
          shellcheck tools/build-gate/gate.sh || true
          shellcheck install.sh || true
          shellcheck hooks/git/pre-commit || true
          shellcheck hooks/git/pre-push || true
          shellcheck hooks/git/commit-msg || true

      - name: Validate YAML frontmatter
        run: |
          for f in $(find agents -name '*.md'); do
            head -1 "$f" | grep -q '^---' || { echo "FAIL: $f missing frontmatter"; exit 1; }
            echo "✅ $f"
          done

      - name: Node.js tests
        uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: |
          # Verify CLI loads
          node bin/cli.js --help
          # Verify dom-auditor loads
          node -e "require('./tools/dom-auditor/index.js')" 2>/dev/null || echo "dom-auditor requires playwright (expected in CI)"

      - name: Install test
        run: |
          mkdir -p /tmp/test-claude/{agents,skills}
          CLAUDE_HOME=/tmp/test-claude bash install.sh
          INSTALLED=$(ls /tmp/test-claude/agents/webgod-*.md | wc -l)
          echo "Installed agents: $INSTALLED"
          [ "$INSTALLED" -ge 10 ] || exit 1
```

**Commit:** `feat(tests): add hook tests, tool tests, GitHub Actions CI`

---

## PHASE 6: FINAL SWEEP (iteration 15)

### Iteration 15: Verify + commit

1. Run `find . -type f -not -path './.git/*' -not -name '.DS_Store' | sort` and count everything
2. Verify README inventory numbers match actual file counts
3. Read every P0 issue from `audit/07-final-verdict.md` and confirm each is resolved
4. Read every P1 issue and confirm each is either resolved or has a tracked TODO
5. Run: `node bin/cli.js --help` — verify no errors
6. Run: `bash tools/build-gate/gate.sh .` — verify it doesn't crash on its own repo
7. Update README badge counts if agent/skill counts changed

**Final commit:** `chore: grade-a sweep complete — all P0 resolved, P1s addressed`

Push: `git push origin main`

---

## EXECUTION RULES

- Read the file BEFORE editing it. Every time.
- After each edit, verify the edit didn't break the file (check for syntax errors, unclosed strings)
- One commit per phase (5 commits total)
- Don't skip any fix — the audit was specific, the fixes should be specific
- If a fix is ambiguous, read the audit report for the exact issue description
- Don't restructure or consolidate agents (that's a v0.2 decision). Just fix what's broken.

## CIRCUIT BREAKERS
- If gate.sh won't run on the repo itself after fixes, stop and debug
- If CLI errors on --help after fixes, stop and debug
- If any hook edit breaks TypeScript syntax, fix before proceeding

Begin. Read `audit/07-final-verdict.md` first, then start Phase 1.
