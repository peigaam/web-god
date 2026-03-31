---
name: security
description: >
  Web application security audit skill. Use when "review security", "audit vulnerabilities",
  "penetration test", "OWASP compliance".
---

# Security Skill

Systematic security assessment using the STRIDE threat model.

## Pipeline
1. **Threat Model** — Map attack surface using STRIDE framework
2. **Code Review** — Scan for OWASP Top 10 vulnerabilities
3. **Auth Review** — Validate authentication and authorization flows
4. **Header Audit** — Check security headers and CSP
5. **Dependency Audit** — Scan for known vulnerable dependencies
6. **Report** — Produce prioritized findings with remediations

## Quick Commands
```bash
npm audit --audit-level=high
npx web-god security .
```

## Severity Levels
- Critical: fix immediately (auth bypass, SQL injection, XSS)
- High: fix within 1 sprint (missing headers, weak auth)
- Medium: fix within 1 month (configuration issues)
- Low: track and fix (best practice deviations)
