# Testing Principles

---

## 1. The Confidence Equation

Test value = (Probability of catching a real bug) × (Cost of that bug in production) / (Cost of writing and maintaining the test)

High-value tests: integration tests of critical user flows (high probability × high cost / medium maintenance).
Low-value tests: snapshot tests of large component trees (low probability × low cost / high maintenance).

## 2. What to Test at Each Level

### Unit (Vitest/Jest) — 20% of tests
- Pure functions with complex logic (calculations, transformations, validators)
- Utility libraries
- Data formatting functions
- Zod/Yup schema validation
- State machine transitions

### Integration (Testing Library) — 60% of tests
- Component renders correctly with given props
- User interactions trigger expected behavior (click, type, submit)
- Components work with their hooks, context, and mocked API data
- Form validation displays correct errors
- Conditional rendering based on state/props
- Accessibility: correct ARIA attributes, keyboard interaction

### E2E (Playwright) — 15% of tests
- Critical user journeys (signup, login, core workflow, payment)
- Cross-page navigation flows
- Authentication redirect behavior
- Real API integration (against staging)

### Visual Regression — 5% of tests
- Design system component variants
- Marketing/landing pages
- Complex data visualizations

## 3. Testing Library Best Practices

### Query Priority (use in this order)
1. `getByRole` — accessible name (best for a11y testing)
2. `getByLabelText` — form inputs
3. `getByPlaceholderText` — when label is absent
4. `getByText` — visible text
5. `getByTestId` — last resort (not user-visible)

### Assert Behavior, Not Implementation
```typescript
// BAD — tests implementation
expect(component.state.count).toBe(1);
expect(wrapper.find('.counter')).toHaveLength(1);

// GOOD — tests behavior
expect(screen.getByText('Count: 1')).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: /increment/i }));
expect(screen.getByText('Count: 2')).toBeInTheDocument();
```

### Avoid Act Warnings
Use `userEvent` over `fireEvent` — it simulates real user behavior including focus, blur, and event bubbling. `userEvent.setup()` is the modern API.

## 4. Test Data Strategy

- **Factories:** Use builder pattern for test data (e.g., `createUser({ role: 'admin' })`)
- **Fixtures:** Static data for visual/snapshot tests
- **MSW (Mock Service Worker):** Intercept network requests at the service worker level
- **Never test against production data**
- **Deterministic:** Tests produce the same result on every run. No Math.random(), no Date.now() without mocking.

## 5. Flaky Test Protocol

A flaky test is worse than no test — it trains the team to ignore failures.

1. **Detect:** CI flags any test that passes on retry (it's flaky even if it passes)
2. **Quarantine:** Move to a `flaky/` directory, run separately from main suite
3. **Fix or delete:** 48-hour deadline. If unfixable, delete and file a ticket.
4. **Root causes:** timing (add proper waits), ordering (tests depend on each other), environment (CI differs from local), non-determinism (random data, system clock)
