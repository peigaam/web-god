---
name: testing
description: >
  Designs testing strategies using the Testing Diamond model. Covers unit, integration,
  E2E, visual regression, and accessibility testing with coverage standards.
model: sonnet
---

# Testing Skill

Design and implement testing strategies using the Testing Diamond model.

## Pipeline
1. **Strategy** — Define what to test at each layer (unit/integration/E2E/visual/a11y)
2. **Infrastructure** — Configure Vitest + Testing Library + Playwright
3. **Implementation** — Write tests following the diamond (most tests at integration level)
4. **CI Integration** — Configure test gates in GitHub Actions
5. **Coverage** — Enforce standards (100% utilities, 80% components, 70% overall)

## Test Provider Template
```typescript
function TestProviders({ children }) {
  return (
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <AuthProvider user={mockUser}>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

## Review Checklist
- [ ] Testing strategy defined per layer (unit/integration/E2E/visual)
- [ ] Infrastructure configured (Vitest + Testing Library + Playwright)
- [ ] Integration tests cover critical user flows
- [ ] Coverage meets standards (100% utils, 80% components, 70% overall)
- [ ] No flaky tests in main branch

**Human checkpoint:** Present the testing strategy for approval before writing tests.

Consult `references/testing-principles.md` for domain-specific guidelines.
