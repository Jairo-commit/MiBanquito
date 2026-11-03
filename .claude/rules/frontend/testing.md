---
paths:
  - "frontend/src/**/*.spec.ts"
  - "frontend/src/**/*.spec.tsx"
  - "frontend/src/test/**"
---

# Frontend tests

- **Read `src/test/CLAUDE.md` and `src/test/README.md` before writing a test.** They explain the setup this rule depends on.
- **Tests sit next to the code they test as `<name>.spec.tsx` (or `.spec.ts` for helpers)**; never in `__tests__/`. Run them with `docker compose exec frontend npm run test:run`.
- **Find elements with `getByTestId` only.** Never `getByRole`, `getByText`, `getByLabelText` or `getByPlaceholderText`: copy and markup change, a test id is an explicit contract.
  - Ids are `<page|component>-<element>` in kebab-case, and `<page|component>-<element>-error` for validation text: `login-username`, `transfer-modal-amount-error`.
- **Import test utilities from `~/test/testUtils`**: `renderWithProviders`, `screen`, `waitFor` and `setup`. Never render with bare `render`, and never call `userEvent` directly; `const user = setup();` gives each test a fresh instance.
- **Mock the network with MSW, never the request functions or hooks.** `src/test/mocks/handlers.ts` holds the happy path; override a case inside the test with `server.use(http.post(...))`, which `setup.ts` resets after each test.
- **Build response data with the factories in `src/test/factories/`** (`accountFactory.build({ balance: "0.00" })`), typed against the production model. Add a factory for every new model.
- **Wait for anything that follows a mutation or query with `await waitFor(...)`**; never assert synchronously after a submit.
- **Mock `useNavigate` with `vi.hoisted` plus `importOriginal`**, overriding only `useNavigate` and keeping the rest of `react-router-dom` real.
- **Import `describe`, `it`, `expect` and `vi` from `vitest`**; globals are off.
- **Each test name says what the user sees**: `"shows validation errors when form is submitted empty"`, `"calls onClose after successful submission"`.
