# Backend Architecture Principles

Shared knowledge base for all backend agents.

---

## 1. API Design Rules

### Resource Naming
- Plural nouns for collections: `/users`, `/projects`, `/orders`
- Singular resource via ID: `/users/:id`, `/projects/:id`
- Nested resources for relationships: `/projects/:id/tasks`
- Maximum 2 levels of nesting. Beyond that, use query parameters.
- Consistent casing: kebab-case for URLs, camelCase for JSON properties.

### HTTP Methods
| Method | Semantics | Idempotent | Safe | Response |
|---|---|---|---|---|
| GET | Read resource(s) | Yes | Yes | 200 + resource |
| POST | Create resource | No (use idempotency keys) | No | 201 + resource |
| PUT | Full replace | Yes | No | 200 + resource |
| PATCH | Partial update | Yes | No | 200 + resource |
| DELETE | Remove resource | Yes | No | 204 (no body) |

### Pagination
- Default: cursor-based for large/real-time datasets, offset-based for small/static
- Always return: `{ data: [...], pagination: { nextCursor, hasMore } }` or `{ data: [...], pagination: { page, totalPages, totalCount } }`
- Default page size: 20. Maximum: 100. Client-configurable via `?limit=N`.

### Filtering & Sorting
- Filtering: `?status=active&role=admin` (exact match), `?created_after=2024-01-01` (range)
- Sorting: `?sort=created_at:desc` or `?sort=-created_at` (prefix minus = descending)
- Search: `?q=search+term` (full-text search across relevant fields)

## 2. Database Design Rules

### Schema Conventions
- Every table: `id` (UUID or auto-increment), `created_at` (timestamptz), `updated_at` (timestamptz)
- Foreign keys: `{table_singular}_id` (e.g., `user_id`, `project_id`)
- Boolean columns: `is_` prefix (e.g., `is_active`, `is_verified`)
- Enum columns: use database enums or check constraints, not magic strings
- Soft delete: `deleted_at` (nullable timestamptz). Query with `WHERE deleted_at IS NULL`.

### Indexing Rules
- Primary key: automatic index
- Foreign keys: always index (joins and cascades)
- Columns in WHERE clauses: index if selectivity > 10%
- Columns in ORDER BY: index if used in pagination queries
- Composite indexes: order columns by selectivity (most selective first)
- Partial indexes: for common filtered queries (`WHERE is_active = true`)
- Don't over-index: each index slows writes. Measure before adding.

### Migration Rules
- Every migration has an UP and a DOWN (rollback)
- Migrations must be backward-compatible: add columns before code, remove after
- Never rename columns in production. Add new → migrate data → remove old.
- Data migrations separate from schema migrations
- Test migrations against a copy of production data size

## 3. Authentication Patterns

### JWT Best Practices
- Access token: short-lived (15 min), stored in memory (not localStorage)
- Refresh token: longer-lived (7 days), httpOnly + Secure + SameSite=Strict cookie
- Token rotation: issue new refresh token on each use, invalidate old one
- Payload: minimal (user ID, role, exp). No PII. No passwords.
- Secret: ≥ 256 bits, from environment variable, rotatable without downtime

### Session Security
- Regenerate session ID after login (prevents session fixation)
- Invalidate all sessions on password change
- Rate limit login attempts (5/min/IP, 20/min/account)
- Lock account after 10 failed attempts (require email verification to unlock)

## 4. Error Response Contract

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "requestId": "req_abc123",
    "details": {
      "fields": {
        "email": "Must be a valid email address",
        "name": "Required, minimum 2 characters"
      }
    }
  }
}
```

Rules:
- Always return `requestId` for traceability
- `code` is machine-readable (SCREAMING_SNAKE_CASE)
- `message` is human-readable (sentence case)
- `details` is optional, structured by error type
- Never expose stack traces, SQL queries, or internal paths

## 5. Input Validation Strategy

```
API Boundary → Zod schema validates shape + types + constraints
  → Service Layer → Business rules validate domain logic
    → Database → Constraints validate data integrity
```

- Validate at the boundary. Don't trust any input.
- Zod schemas generate TypeScript types AND runtime validation from one definition.
- Business validation returns domain errors ("user already has 5 projects on free plan")
- Database constraints are the last line of defense (unique, not null, check, foreign key)

## 6. Logging Standards

```json
{
  "level": "error",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_abc123",
  "userId": "user_xyz",
  "method": "POST",
  "path": "/api/projects",
  "statusCode": 500,
  "duration": 234,
  "error": {
    "name": "DatabaseError",
    "message": "Connection refused"
  }
}
```

- Structured JSON logs (not console.log strings)
- Every request gets a correlation ID (requestId)
- Log: request method, path, status, duration, user ID
- Never log: passwords, tokens, credit card numbers, PII in plain text
- Log levels: error (alertable), warn (investigate), info (audit trail), debug (dev only)
