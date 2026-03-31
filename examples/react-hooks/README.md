# React Hook Examples

SSR-safe React hooks that pair with web-god's frontend agents.
These are companion code — copy what you need into your project.

Not a published package. For production hook libraries, see:
- [usehooks-ts](https://usehooks-ts.com/) — 40+ typed hooks
- [Mantine hooks](https://mantine.dev/hooks/) — 50+ hooks
- [@uidotdev/usehooks](https://usehooks.com/) — collection with explanations

## Hooks Included

| Hook | Description | SSR Safe |
|------|-------------|----------|
| useScrollProgress | Track scroll progress 0-1 | Yes |
| useMediaQuery | Reactive CSS media query | Yes (mounted pattern) |
| useTheme | Light/dark with persistence | Yes (defaultTheme) |
| useDebounce | Debounce a value | Yes |
| useIntersectionObserver | Observe element visibility | Yes |
| useKeyboardShortcut | Register keyboard shortcuts | Yes |
| useLocalStorage | useState + localStorage | Yes |
| useCopyToClipboard | Copy text with feedback | Yes |
| useReducedMotion | Detect prefers-reduced-motion | Yes |
| useLockBodyScroll | Lock body scroll for modals | Yes |

## Usage

```typescript
// Copy individual hooks into your project's hooks/ directory
import { useScrollProgress } from './useScrollProgress';
import { useTheme } from './useTheme';
```

All hooks are MIT licensed, dependency-free (React only), and use 'use client' for Next.js compatibility.
