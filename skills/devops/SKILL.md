---
name: devops
description: >
  Deployment and CI/CD skill. Use when "deploy", "CI/CD pipeline", "Docker",
  "GitHub Actions", "staging", "environment setup".
---

# DevOps Skill

Design deployment pipelines and infrastructure configuration.

## Pipeline
1. **CI/CD** — GitHub Actions pipeline (quality → e2e → deploy)
2. **Environments** — Dev → Staging → Production with env var management
3. **Docker** — Multi-stage builds for containerized deployments
4. **Monitoring** — Uptime, errors, performance, database health
5. **Rollback** — Zero-downtime deploy with rollback safety

## Environment Variable Validation
```typescript
import { z } from 'zod';
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});
export const env = envSchema.parse(process.env);
```

## Review Checklist
- [ ] CI pipeline runs in under 10 minutes
- [ ] All environment variables documented in .env.example
- [ ] Deployment is rollback-safe within 5 minutes
- [ ] Database migrations are backward-compatible
- [ ] No manual deployment steps required
- [ ] Monitoring covers uptime, errors, latency, CWV

**Human checkpoint:** Present the CI/CD pipeline design for approval before configuring.

Consult `references/devops-principles.md` for domain-specific guidelines.
