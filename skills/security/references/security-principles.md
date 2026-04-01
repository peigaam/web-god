# Web Security Principles

---

## 1. OWASP Top 10 (2025) — Quick Reference

> Based on OWASP Top 10 2025. Check [owasp.org/Top10](https://owasp.org/www-project-top-ten/) for the authoritative current list.

| # | Vulnerability | Prevention |
|---|---|---|
| A01 | Broken Access Control | Auth on every endpoint, IDOR checks, CORS whitelist |
| A02 | Security Misconfiguration | Security headers, disable defaults, patch dependencies |
| A03 | Supply Chain Failures | Provenance verification, lockfile integrity, SCA scanning |
| A04 | Cryptographic Failures | HTTPS, encrypt PII at rest, bcrypt for passwords |
| A05 | Injection | Parameterized queries, input validation, output encoding |
| A06 | Insecure Design | Threat modeling, security requirements, abuse cases |
| A07 | Auth Failures | Rate limiting, MFA, secure session management |
| A08 | Data Integrity Failures | Signed updates, CI/CD pipeline security, SRI |
| A09 | Logging Failures | Structured logs, audit trails, alerting |
| A10 | Exceptional Conditions | Graceful error handling, fail-secure defaults, input bounds |

## 2. Security Headers Reference

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.yourdomain.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

> Note: `img-src https:` is deliberately permissive as a starter template. Restrict to specific CDN domains in production. `style-src 'unsafe-inline'` is a common compromise for CSS-in-JS frameworks.

## 3. Input Validation Rules

- Validate type, length, range, and format on ALL inputs
- Server-side validation is security. Client-side validation is UX.
- Reject by default, allow by exception (allowlist > blocklist)
- Sanitize for the output context (HTML encoding, SQL parameterization, URL encoding)
- File uploads: validate MIME type server-side, limit size, rename files, store outside webroot

## 4. Authentication Checklist

- [ ] Passwords: bcrypt/scrypt/Argon2, cost factor ≥ 10
- [ ] Password policy: ≥ 8 chars, check against breach databases (Have I Been Pwned API)
- [ ] Rate limiting: ≤ 5 login attempts per minute per IP
- [ ] Account lockout: after 10 failures, require email verification (note: lockout can be exploited for DoS — consider progressive delays as an alternative)
- [ ] Session: regenerate ID after login, invalidate on logout
- [ ] Tokens: access ≤ 15min, refresh ≤ 7d, rotate on use
- [ ] Storage: refresh token in httpOnly Secure SameSite=Strict cookie
- [ ] MFA: TOTP or WebAuthn for sensitive operations

## 5. Secrets Management

- Never commit secrets to version control (even in "private" repos)
- Use environment variables for all secrets
- Rotate secrets on a schedule (90 days for most, 30 days for high-value)
- Use different secrets per environment (dev ≠ staging ≠ production)
- Audit secret access (who accessed what, when)
- Revoke immediately on suspected compromise

## 6. Next.js-Specific Security

Next.js has had critical CVEs that the security agent must warn about:
- **Middleware bypass** (CVE-2025-29927, CVSS 9.1) — `x-middleware-subrequest` header
  bypasses all middleware including auth checks. Fixed in 15.2.3+.
- **Server Component RCE** (CVSS 10.0) — RSC source exposure allowing remote code
  execution in certain configurations. Verify `output: 'standalone'` is properly secured.
- **Server Action CSRF** — Server Actions without proper origin checking are vulnerable
  to cross-site request forgery. Always validate the Origin header.

### Mitigation checklist
- [ ] Pin Next.js to latest patch version
- [ ] Verify middleware cannot be bypassed via headers
- [ ] Server Actions validate Origin header
- [ ] RSC payloads don't expose server-only code
- [ ] `experimental.serverActions.bodySizeLimit` is set
