# Testing — Techniques and conventions

## Stack

- **Vitest** — Vite's native runner; config in `vitest.config.ts` (frontend root)
- **@testing-library/react** — rendering and interacting with React components
- **@testing-library/user-event** — simulates real user events (pointer, keyboard)
- **@testing-library/jest-dom** — extra DOM matchers (`toBeInTheDocument`, `toBeDisabled`, etc.)
- **MSW v2** — intercepts Axios HTTP requests at the network level (`msw/node`)

## Folder structure

```
src/test/
├── setup.ts               — global configuration for all tests
├── testUtils.tsx          — render with providers and re-exported utilities
├── factories/             — typed test data builders
│   ├── accountFactory.ts
│   ├── authTokenFactory.ts
│   ├── cdtFactory.ts
│   ├── loanRequestFactory.ts
│   ├── transactionFactory.ts
│   └── userResponseFactory.ts
└── mocks/
    ├── handlers.ts        — happy-path MSW handlers (use the factories)
    └── server.ts          — MSW server instance
```

Test files live next to the code they test (co-located) and use the `.spec.tsx` extension (`.spec.ts` for helpers). Do not use `__tests__/` subdirectories.

## Test providers (`testUtils.tsx`)

Each test gets a **new** `QueryClient` so React Query's cache never leaks state between tests. The wrapper includes:

1. `QueryClientProvider` with `retry: false` on queries and mutations
2. `MemoryRouter` — replaces `BrowserRouter`; accepts `initialEntries` as an option
3. `CustomTheme` — required because MUI throws without a `ThemeProvider`

```tsx
renderWithProviders(<Login />, { routerProps: { initialEntries: ["/login"] } });
```

## Factories

Factories (built with `factory.ts`) create typed objects with overridable defaults. Reuse them in MSW handlers and in individual test assertions.

```ts
authTokenFactory.build({ access: "custom-token" })   // override only what matters
userResponseFactory.build({ username: "jairo" })
```

The return type is always the production model (`AuthToken`, `UserResponse`, `SavingsAccount`…), so TypeScript catches wrong fields.

## MSW — network mocks

The handlers in `handlers.ts` cover the happy path. For errors or special cases, override the handler **inside the test** with `server.use(...)`. The `afterEach` in setup calls `server.resetHandlers()` so the override does not affect other tests.

```ts
server.use(
  http.post("http://localhost:8000/token/", () =>
    HttpResponse.json({ detail: "No active account..." }, { status: 401 })
  )
);
```

`onUnhandledRequest: "error"` fails the test if Axios makes a request with no handler, preventing silent false positives.

## Mocking `useNavigate`

`vi.mock` is hoisted above the imports, so the mock variable must be created with `vi.hoisted()`:

```ts
const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});
```

Clear it in `afterEach` with `mockNavigate.mockClear()`.

## Async assertions

React Query mutations are asynchronous. Always use `waitFor` to wait for the DOM to update after a submit:

```ts
await user.click(screen.getByTestId("login-submit"));
await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
```

Never assert synchronously after an action that triggers a mutation.

## Cleanup

With `globals: false` in Vitest, RTL does not detect the global `afterEach` and does not clean up the DOM automatically. `cleanup()` is called explicitly in `setup.ts`:

```ts
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
```

## Test selectors — always `data-testid`

**Absolute rule:** only use `getByTestId` to find elements in tests. Never use `getByRole`, `getByLabelText`, `getByText`, `getByPlaceholderText` or similar.

**Why:** role-, label- or text-based selectors break with any copy change, HTML restructuring or UI library update. `data-testid` is an explicit contract between the component and its test, independent of presentation.

### Naming convention

```
{page|component}-{element}           → login-username, register-submit
{page|component}-{element}-error     → register-email-error (validation helper text)
```

### How to add test ids to components

**FormTextField** — accepts `testId?: string`:
- `testId` goes on the native `<input>` via `slotProps.htmlInput`
- `${testId}-error` goes on the helper text via `slotProps.formHelperText`

**FormSelectField** — accepts `testId?: string`:
- `testId` goes on the `<FormControl>` wrapper via `data-testid`

**PrimaryFormButton** — accepts `testId?: string`:
- `testId` goes on the `<Button>` via `data-testid`

**Elements directly in JSX** (headings, links, error containers):
```tsx
<Typography data-testid="login-heading">Welcome back</Typography>
<Box data-testid="login-error">{errors}</Box>
<Link data-testid="login-register-link">Register</Link>
```

### Pattern in tests

```ts
// Check presence
expect(screen.getByTestId("login-username")).toBeInTheDocument();

// Interact
await user.type(screen.getByTestId("login-username"), "testuser");
await user.click(screen.getByTestId("login-submit"));

// Check validation errors
expect(screen.getByTestId("register-email-error")).toHaveTextContent(/please enter a valid email/i);

// Check API errors (alert wrapper)
await waitFor(() => expect(screen.getByTestId("login-error")).toBeInTheDocument());
expect(screen.getByTestId("login-error")).toHaveTextContent("detail: ...");
```

## Commands

```bash
# Watch mode (development)
docker compose exec frontend npm run test

# Single run (CI)
docker compose exec frontend npm run test:run

# HTML coverage in coverage/index.html
docker compose exec frontend npm run coverage
```
