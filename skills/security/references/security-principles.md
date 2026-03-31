# Web Security Principles

---

## 1. OWASP Top 10 (2021) — Quick Reference

| # | Vulnerability | Prevention |
|---|---|---|
| A01 | Broken Access Control | Auth on every endpoint, IDOR checks, CORS whitelist |
| A02 | Cryptographic Failures | HTTPS, encrypt PII at rest, bcrypt for passwords |
| A03 | Injection | Parameterized queries, input validation, output encoding |
| A04 | Insecure Design | Threat modeling, security requirements, abuse cases |
| A05 | Security Misconfiguration | Security headers, disable defaults, patch dependencies |
| A06 | Vulnerable Components | npm audit, dependency updates, SCA scanning |
| A07 | Auth Failures | Rate limiting, MFA, secure session management |
| A08 | Data Integrity Failures | Signed updates, CI/CD pipeline security, SRI |
| A09 | Logging Failures | Structured logs, audit trails, alerting |
| A10 | SSRF | URL validation, allowlists, network segmentation |

## 2. Security Headers Reference

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.yourdomain.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

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
- [ ] Account lockout: after 10 failures, require email verification
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
