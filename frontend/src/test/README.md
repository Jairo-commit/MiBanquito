# Frontend Testing

## The stack and what each layer does

Think of it as three concentric layers:

```
┌─────────────────────────────────┐
│  Vitest                         │  runs tests, provides expect/vi/describe
│  ┌───────────────────────────┐  │
│  │  @testing-library/react   │  │  renders components into jsdom
│  │  ┌─────────────────────┐  │  │
│  │  │  jest-dom /vitest   │  │  │  teaches expect() to understand the DOM
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
│                                 │
│  MSW  (sits outside, intercepts network)
└─────────────────────────────────┘
```

**Vitest** — finds and runs `.spec.tsx` files. Provides `describe`, `it`, `expect`, `vi`. Built on Vite, so it understands TypeScript and path aliases out of the box.

**@testing-library/react** — mounts components into a fake DOM (jsdom). Gives you `render`, `screen`, and `waitFor` to find elements. Does not provide assertion matchers — only finders.

**@testing-library/jest-dom** — extends `expect` with DOM-aware matchers like `toBeInTheDocument()`, `toBeDisabled()`, `toHaveTextContent()`. These do not exist in Vitest by default; jest-dom plugs them in via `expect.extend()`.

**MSW** — intercepts Axios requests at the network level. Your components make real HTTP calls; MSW returns fake responses without a server running. `onUnhandledRequest: "error"` makes the test fail if a request has no handler, preventing silent false positives.

---

## Critical rules

### Always import from `/vitest`, never `/matchers`

```ts
// setup.ts

import "@testing-library/jest-dom/vitest"; // ✓ handles runtime + TypeScript types
import * as matchers from "@testing-library/jest-dom/matchers"; // ✗ runtime only, TS still errors
```

The `/vitest` entry does two things in one import:
1. Calls `expect.extend()` so the matchers work at runtime.
2. Applies a module augmentation (`declare module 'vitest'`) so TypeScript knows `Assertion<T>` has `toBeInTheDocument()` etc.

Using `/matchers` only does step 1. Your tests pass but the editor shows red squiggles.

### Co-locate test files with source

```
src/pages/login/
├── login.tsx
└── login.spec.tsx   ✓ import path is "./login"
```

```
src/pages/login/
└── __tests__/
    └── login.spec.tsx   ✗ import path is "../login" — breaks if you move the file
```

The `__tests__/` convention comes from Jest/Node projects. In a component-based frontend, co-location is simpler and survives refactoring better.

### Clean install when packages behave strangely

npm can leave package installs in a broken state (missing `.mjs` files, empty `types/` folders) if you install incrementally over time. When something looks corrupted:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Why `testUtils.tsx` re-exports `screen`, `waitFor`, etc.

Two reasons:

**1. Single import line per test file**

Instead of:
```ts
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderWithProviders } from "~/test/testUtils";
```

Every test writes:
```ts
import { renderWithProviders, screen, waitFor, fireEvent, setup } from "~/test/testUtils";
```

**2. `setup` enforces the correct `userEvent` pattern**

```ts
export const setup = () => userEvent.setup();
```

This isn't just a passthrough — it ensures each test gets a fresh `userEvent` instance, which is required for correct pointer and keyboard event simulation. If tests imported `userEvent` directly, a developer might call `userEvent.type(...)` (the legacy API) instead of `userEvent.setup().type(...)`. Re-exporting only `setup()` makes the right thing the only option.

---

## Mocking `useNavigate` — why the pattern is what it is

```ts
const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});
```

**Why not a simple mock?**

```ts
vi.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate })); // ✗
```

This replaces the *entire* module. Your component also uses `Link`, `useLocation`, etc. — they'd all be `undefined` and the render would crash.

**Why `importOriginal`**

Loads the real module first, then spreads it and overrides only `useNavigate`. The rest of the library (used by the component and by the `MemoryRouter` in `testUtils.tsx`) stays real.

**Why `vi.hoisted()`**

`vi.mock(...)` is hoisted to the top of the file by Vitest — it runs *before* any imports. A plain `const mockNavigate = vi.fn()` would be in the temporal dead zone when the mock factory executes. `vi.hoisted()` runs its callback at hoist time too, so the variable exists when it's needed.

All three parts are load-bearing; none can be removed.

---

## Running tests

```bash
# One-shot (CI)
npm run test:run

# Watch mode (development)
npm test

# Coverage report → coverage/index.html
npm run coverage
```
