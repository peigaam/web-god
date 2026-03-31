# Phase 4: Security Review

**Agent:** Sentinel | **Iterations:** 13-14 | **Date:** 2026-03-31

---

## Iteration 13: Security Agent & Skill Accuracy

### STRIDE Framework Application — Grade: A

The threat-modeler agent correctly applies STRIDE with all 6 categories:
- Spoofing ✓ (with auth verification questions)
- Tampering ✓ (data integrity in transit/at rest)
- Repudiation ✓ (audit trail requirement)
- Information Disclosure ✓ (data leak prevention)
- Denial of Service ✓ (availability)
- Elevation of Privilege ✓ (authorization)

**No misapplications found.** The STRIDE table at `agents/security/threat-modeler.md:22-29` is accurate.

### OWASP Top 10 Reference Accuracy

The security-principles.md cites "OWASP Top 10 (2021)":

| # | Listed Vulnerability | Accurate for 2021? | Still Relevant 2025? |
|---|---|---|---|
| A01 | Broken Access Control | ✓ | ✓ |
| A02 | Cryptographic Failures | ✓ | ✓ |
| A03 | Injection | ✓ | ✓ |
| A04 | Insecure Design | ✓ | ✓ |
| A05 | Security Misconfiguration | ✓ | ✓ |
| A06 | Vulnerable Components | ✓ | ✓ |
| A07 | Auth Failures | ✓ | ✓ |
| A08 | Data Integrity Failures | ✓ | ✓ |
| A09 | Logging Failures | ✓ | ✓ |
| A10 | SSRF | ✓ | ✓ |

**Assessment:** The OWASP 2021 list is correctly reproduced. The prevention recommendations are sound. However, the reference should note which OWASP version is cited and whether updates have been published since.

### Authentication Pattern Review

**JWT Pattern (backend-principles.md:62-72):**
- Access token 15min ✓ (industry standard)
- Refresh token 7 days in httpOnly cookie ✓ (correct)
- Token rotation on use ✓ (prevents replay)
- No PII in payload ✓
- Secret ≥ 256 bits ✓
- **No dangerous advice found.**

**Session Security (backend-principles.md:69-73):**
- Session regeneration after login ✓ (prevents fixation)
- Rate limiting per IP + per account ✓
- Account lockout after 10 failures ✓
- **Potential issue:** Lockout after 10 failures can be abused for account denial-of-service (attacker locks out a legitimate user by submitting bad passwords). The recommendation should mention this trade-off and suggest progressive delays as an alternative.

**Threat-modeler agent checklist (threat-modeler.md:34-67):**
- All items are accurate and specific
- Covers auth, authz, input validation, headers, data protection, dependencies
- No dangerous anti-patterns recommended

### CSP Template Review

`security-principles.md:23-24`:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.yourdomain.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'
```

| Directive | Assessment |
|---|---|
| `default-src 'self'` | Good — restrictive default |
| `script-src 'self' 'nonce-{random}'` | Good — nonce-based, no unsafe-eval |
| `style-src 'self' 'unsafe-inline'` | **Acceptable but not ideal** — `unsafe-inline` for styles is common (CSS-in-JS, Tailwind) but a strict CSP would use nonces for styles too |
| `img-src 'self' data: https:` | **Overly permissive** — `https:` allows images from ANY https source. Should be restricted to known CDN domains in production |
| `connect-src 'self' https://api.yourdomain.com` | Good — explicit API domain |
| `frame-src 'none'` | Good — prevents framing |
| `object-src 'none'` | Good — prevents Flash/plugins |

**Verdict:** The CSP is a reasonable starting template. The `img-src https:` is too permissive for production but fine as a starting point. The `style-src 'unsafe-inline'` is a common compromise.

### Security Anti-Patterns Search

Searched all agent and reference files for security anti-patterns:

| Pattern | Found? | Location |
|---|---|---|
| "disable CORS" or "CORS *" | No ✓ | — |
| "eval(" in code examples | No ✓ | — |
| Hardcoded secrets in examples | No ✓ | — |
| "skip verification" or "--no-verify" | No ✓ | — |
| SQL string concatenation | No ✓ | — |
| `dangerouslySetInnerHTML` without warning | Mentioned with warning ✓ | threat-modeler.md:50 |
| "trust user input" | No ✓ | — |

**No security anti-patterns found in any advice or code examples.**

---

## Iteration 14: Security of the Package Itself

### `install.sh` Security Audit

```bash
#!/usr/bin/env bash
set -eo pipefail  # Good — fails on errors
```

| Line | Operation | Risk | Assessment |
|---|---|---|---|
| 4 | `CLAUDE_HOME:-$HOME/.claude` | None | Standard env var with default |
| 13 | `mkdir -p "$AGENTS_DIR" "$SKILLS_DIR"` | None | Creates directories if missing |
| 20-26 | `cp "$agent_file" "$dest"` | None | Copies files, no execution |
| 34 | `rm -rf "$dest_dir"` | **Low** | Removes existing skill directory before copy. Could delete user modifications. |
| 35 | `cp -r "$skill_dir" "$dest_dir"` | None | Directory copy |

**Findings:**
| # | Issue | Severity | Details |
|---|---|---|---|
| S1 | `rm -rf "$dest_dir"` removes existing skills without backup or confirmation | Low | Line 34 — if user has modified installed skills, changes are lost. Should warn or backup. |
| S2 | No integrity verification of copied files | Low | No checksums or signatures. Acceptable for a dev tool. |
| S3 | Script is well-contained — no network access, no permission escalation | N/A | Positive finding |

### `bin/cli.js` Security Audit

```javascript
const { execSync } = require('child_process');
const args = process.argv.slice(2);
const command = args[0];
```

| Line | Code | Risk | Assessment |
|---|---|---|---|
| 9 | `execSync(\`node ${ROOT}/tools/dom-auditor/index.js ${args[1] \|\| 'http://localhost:3000'} ${args.slice(2).join(' ')}\`, { stdio: 'inherit' })` | **HIGH** | User-controlled arguments passed directly to shell via template literal |
| 10 | `execSync(\`bash ${ROOT}/tools/build-gate/gate.sh ${args[1] \|\| '.'} ${args.slice(2).join(' ')}\`, { stdio: 'inherit' })` | **HIGH** | Same — user args in shell command |
| 11 | `execSync(\`bash ${ROOT}/install.sh\`, { stdio: 'inherit' })` | None | No user input |

**Finding S4 — COMMAND INJECTION VULNERABILITY (P0 Critical):**

`bin/cli.js` lines 9-10 pass user-supplied command-line arguments directly into `execSync()` template literals without sanitization. An attacker could inject shell commands:

```bash
web-god audit "http://localhost:3000; rm -rf /"
```

This would execute: `node .../index.js http://localhost:3000; rm -rf / `

**Remediation:** Use `execFileSync` with an array of arguments instead of `execSync` with string interpolation:

```javascript
const { execFileSync } = require('child_process');
execFileSync('node', [
  `${ROOT}/tools/dom-auditor/index.js`,
  args[1] || 'http://localhost:3000',
  ...args.slice(2)
], { stdio: 'inherit' });
```

**Mitigating factors:**
- This is a developer tool, not a web-facing service
- The attacker would need local shell access (at which point they already have full access)
- But it's still bad practice and would fail security review in any organization

### `tools/build-gate/gate.sh` Security Audit

| Line | Code | Risk | Assessment |
|---|---|---|---|
| 9 | `PROJECT_ROOT="$(cd "$PROJECT_ROOT" && pwd)"` | None | Canonicalizes path safely |
| 84 | `python3 -c "...json.load(open('$KILL_LIST'))..."` | **Medium** | Kill list file path interpolated into Python string |
| 53-55 | `grep -rn ... "$PROJECT_ROOT/src"` | None | Path is canonicalized |
| 111 | `npx tsc --noEmit 2>&1` | None | Standard tool invocation |

**Finding S5 — Kill List Path Injection (P2 Medium):**

Line 84: The `$KILL_LIST` variable is interpolated directly into a Python code string:
```bash
python3 -c "import json,sys; [print(p) for p in json.load(open('$KILL_LIST')).get('patterns',[])]"
```

A malicious kill list path like `'))]; import os; os.system('rm -rf /'); #` could inject Python code.

**Mitigating factors:**
- Kill list path comes from `--kill-list` CLI argument, typically controlled by the developer
- A developer with shell access could just run `rm -rf /` directly
- But defense-in-depth says: never interpolate paths into code strings

**Remediation:** Use `node -e` instead:
```bash
node -e "const f=require('fs');const d=JSON.parse(f.readFileSync(process.argv[1],'utf8'));(d.patterns||[]).forEach(p=>console.log(p))" "$KILL_LIST"
```

### Path Traversal Assessment

| Component | Path Handling | Risk |
|---|---|---|
| install.sh | Uses `$(cd ... && pwd)` for canonicalization | None |
| gate.sh | Uses `$(cd "$PROJECT_ROOT" && pwd)` | None |
| cli.js | Passes user args to shell commands | Command injection (S4), not path traversal |
| dom-auditor/index.js | URL input only, no file operations | None |

**No path traversal vulnerabilities found.**

---

## Security Summary

| # | Finding | Severity | Location | Remediation |
|---|---|---|---|---|
| S4 | Command injection in CLI | **P0 Critical** | bin/cli.js:9-10 | Use `execFileSync` with arg array |
| Q23 | Python3 dependency creates attack surface | P1 High | gate.sh:84 | Replace with Node.js JSON parsing |
| S5 | Kill list path injection | P2 Medium | gate.sh:84 | Use parameterized invocation |
| S1 | `rm -rf` without backup/confirmation | P3 Low | install.sh:34 | Add backup or confirmation prompt |
| — | OWASP version should be updated | P3 Low | security-principles.md:3 | Note version or update |
| — | CSP `img-src https:` overly permissive | P3 Low | security-principles.md:24 | Document as "customize for production" |
| — | Account lockout can be abused for DoS | P3 Low | backend-principles.md:73 | Note trade-off in recommendation |
