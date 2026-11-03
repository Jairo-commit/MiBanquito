---
paths:
  - "frontend/src/api/**"
  - "frontend/src/hooks/**"
  - "frontend/src/models/**"
  - "frontend/src/lib/**"
  - "frontend/src/constants/**"
---

# API calls, hooks and models

- **Data flows through three layers, and a component only touches the last one.**
  1. `src/api/requests/<resource>Requests.ts`: plain functions that call the shared `api` Axios instance and return typed data.
  2. `src/hooks/use<Thing>.ts`: one React Query hook per file wrapping one request.
  3. The component calls the hook.
  - Bad: `axios.get(...)` or `api.get(...)` inside a component or a `useEffect`.
  - Good: `const { data } = useAccount();`
- **Always use the `api` instance from `~/api/api`**, which sets the base URL and the Bearer token. Never create another Axios instance or set `Authorization` by hand.
- **Request paths are relative with a trailing slash, matching Django's router**: `api.get("accounts/")`. List requests unwrap pagination: `.then((res) => res.data.results ?? res.data)`.
- **Request functions declare their return type**: `(): Promise<SavingsAccount[]>`. Payload types are exported next to the request (`TransferPayload`).
- **Query keys are the resource name** (`["accounts"]`, `["transactions"]`). A mutation invalidates every query its write changes; a transfer invalidates both `["transactions"]` and `["accounts"]`.
- **Hooks are named for the action**: `useAccount` for reads, `useCreateAccount`, `useTransfer`, `useLogin` for writes. Side effects of a successful call that belong to the data (saving tokens) go in the hook's `onSuccess`; navigation stays in the component.
- **Models in `src/models/<name>.model.ts` mirror the API response exactly**, as exported `type`s with the backend's snake_case field names. Decimal amounts are `string`, dates are ISO `string`.
- **Tokens are read and written only through the keys in `~/constants/tokenConstants`** (`ACCESS_TOKEN_KEY`, `REFRESH_TOKEN_KEY`), never the literal strings.
- **The base URL comes from `import.meta.env.VITE_API_URL`**; never hard-code a host.
