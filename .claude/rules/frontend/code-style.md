---
paths:
  - "frontend/**/*.ts"
  - "frontend/**/*.tsx"
---

# TypeScript style

- **Everything is in English**: identifiers, comments, labels, headings, error and validation messages.
- **Import types with `import type` (or an inline `type`)**: `import type { SavingsAccount } from "~/models/account.model"`.
- **Never use `any`.** Take an unknown error as `unknown` and narrow it, as `parseApiError` does with `isAxiosError`.
- **Use the lowercase primitive types**: `boolean`, `string`, `number`, never `Boolean` or `String`.
- **Shared constants live in `src/constants/`, generic utilities in `src/utils/`, app-wide setup (`queryClient`, `parseApiError`) in `src/lib/`.** Nothing is duplicated across components.
- **No stray `console.log`** in committed code.
