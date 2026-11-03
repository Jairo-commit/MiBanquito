---
paths:
  - "frontend/src/components/**"
  - "frontend/src/pages/**"
---

# Components and pages

- **One component per `.tsx` file, never two.** A helper component needed by a feature is extracted to its own folder in `src/components/`.
  - Bad: a `function Row()` declared next to `export function TransactionList()` in `transactionList.tsx`.
  - Good: `src/components/TransactionRow/transactionRow.tsx`, imported by the list.
- **Each component owns a PascalCase folder; the files inside are camelCase and share its name.**
  ```
  src/components/MyComponent/
  ├── myComponent.tsx              logic and JSX
  ├── myComponent.sx.ts            SX styles
  ├── myComponent.helpers.ts       pure functions
  ├── myComponent.helpers.spec.ts  unit tests for the helpers
  ├── myComponentSchema.ts         Zod schema and form value types
  └── myComponent.spec.tsx         component tests
  ```
  Pages follow the same layout under `src/pages/<camelCaseName>/`. `components/protectedRoute.tsx` is the only flat file: a single-purpose component with no styles.
- **Components are named function exports; no default exports.**
  - Bad: `export default function Login()`
  - Good: `export function Login()`, imported as `import { Login } from "~/pages/login/login"`
- **Props are an `interface <Component>Props`** declared above the component and destructured in the signature.
- **Pure functions that derive a value from data (formatting, totals, labels) go in `<name>.helpers.ts`, never inline in the `.tsx`**, and every helpers file has a `.helpers.spec.ts` covering the normal case, zero and edge values.
- **Currency and number formatting uses `Intl.NumberFormat("es-CO", { currency: "COP", ... })`**, the way `accountPanel.helpers.ts` does.
- **UI state for menus, modals and tooltips (`open`, `anchorEl`) is a local `useState`** in the component that renders them; it never goes to global state.
- **Import with the `~/` alias across folders and a relative `./` path only inside the component's own folder.**
  - Good: `import { useTransfer } from "~/hooks/useTransfer"`; `import * as styles from "./transferModal.sx"`
- **Icons are imported one by one from `@mui/icons-material`**: `import { AccountCircle } from "@mui/icons-material"`.
- **Every user-facing string is in English.**
