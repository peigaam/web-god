# DevOps Principles

---

## 1. The Twelve-Factor App (Web-Adapted)

| Factor | Rule | Implementation |
|---|---|---|
| Codebase | One repo per deployable unit | Monorepo or multi-repo, never shared code via copy-paste |
| Dependencies | Explicitly declare and isolate | package-lock.json committed, exact versions |
| Config | Store in environment | .env.local for dev, platform env vars for prod |
| Backing services | Treat as attached resources | Database URL is a config value, not hardcoded |
| Build/Release/Run | Strictly separate stages | CI builds → artifact → deploy. Never build on prod. |
| Processes | Stateless, share-nothing | No in-memory sessions. Use Redis/DB for shared state. |
| Port binding | Export via port | App listens on $PORT, no assumptions about port 3000 |
| Concurrency | Scale via process model | Horizontal scaling. Each instance is identical. |
| Disposability | Fast startup, graceful shutdown | Handle SIGTERM. Finish in-flight requests. |
| Dev/Prod parity | Keep environments similar | Same OS, same node version, same DB engine |
| Logs | Treat as event streams | JSON to stdout. Log aggregator collects. |
| Admin | Run admin tasks as one-off processes | Migrations, seeds, scripts run via `npm run` or CI |

## 2. CI Pipeline Design Rules

- **Fast feedback:** PR pipeline < 10 minutes. Developers won't wait longer.
- **Fail early:** Run cheapest checks first (lint → types → unit → integration → E2E → build).
- **Deterministic:** Same commit → same result. Pin all tool versions. Cache dependencies.
- **Isolated:** Each job runs in a clean environment. No state leaks between runs.
- **Parallel where possible:** Lint, type check, and unit tests can run in parallel.

## 3. Deployment Strategy Matrix

| Strategy | Downtime | Rollback Speed | Risk | Use When |
|---|---|---|---|---|
| Rolling | Zero | Medium (redeploy) | Medium | Default for most apps |
| Blue/Green | Zero | Instant (switch) | Low | Critical production services |
| Canary | Zero | Fast (route change) | Low | High-traffic, gradual rollout |
| Recreate | Brief | Slow (redeploy) | High | Only for dev/staging |

## 4. Database Migration Safety

### Safe Operations (no downtime)
- Add a new table
- Add a new nullable column
- Add a new index (use CONCURRENTLY in Postgres)
- Add a new column with a default (Postgres 11+ is instant)

### Unsafe Operations (require careful planning)
- Remove a column → deploy code that doesn't use it first, then drop
- Rename a column → add new, copy data, update code, drop old
- Change column type → add new column, backfill, swap in code, drop old
- Add NOT NULL to existing column → add with default first, backfill NULLs, then add constraint

### Migration Checklist
- [ ] Migration has a rollback (DOWN migration)
- [ ] Tested against production-size data (large tables take time)
- [ ] Run on staging before production
- [ ] Backward-compatible (old code works with new schema)
- [ ] No locks on large tables during peak traffic

## 5. Monitoring & Alerting Tiers

| Tier | What | Alert Channel | Response Time |
|---|---|---|---|
| P0 — Outage | Site down, data loss, security breach | PagerDuty + phone | < 15 min |
| P1 — Degraded | Error rate > 5%, latency > 5s, partial outage | Slack + email | < 1 hour |
| P2 — Warning | Error rate > 1%, CWV degraded, disk > 80% | Slack | < 1 day |
| P3 — Info | Deployment completed, cron job status | Dashboard | Next standup |

## 6. npm Supply Chain Defense

- `npm audit` alone is insufficient — it only catches known CVEs, not malicious packages
- Use Socket.dev or Snyk for real-time supply chain monitoring
- Enable npm package provenance (`npm publish --provenance`)
- Use lockfile-lint to verify lockfile integrity
- Pin dependencies to exact versions in production
- Monitor for typosquatting on critical packages
