---
name: testing
description: >
  Test architecture and implementation skill. Use when "set up tests", "write tests",
  "improve coverage", "add E2E tests", "testing strategy".
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
