# Components — Conventions

## Folder structure

Each component lives in its own PascalCase folder. The files inside use camelCase:

```
src/components/
├── MyComponent/
│   ├── myComponent.tsx              — logic and JSX
│   ├── myComponent.sx.ts            — SX styles (if any)
│   ├── myComponent.helpers.ts       — pure functions (if any)
│   ├── myComponent.helpers.spec.ts  — unit tests for the helpers
│   ├── myComponentSchema.ts         — Zod schema and form value types (if it has a form)
│   └── myComponent.spec.tsx         — component tests
└── protectedRoute.tsx               — exception: single-purpose component with no styles of its own
```

## SX styles

SX styles always go in a separate `*.sx.ts` file in the same folder. Never write SX objects inline in the JSX.

**Base type:**

```ts
import { type SxProps, type Theme } from "@mui/material/styles";

export const mySx: SxProps<Theme> = { ... };
```

**When the style depends on the theme** (colors, gradients, spacing), use the callback:

```ts
export const mySx: SxProps<Theme> = (theme) => ({
  background: theme.palette.gradients.brand,
  color: theme.palette.primary.contrastText,
  mt: theme.spacing(1),
});
```

## Colors and typography

**Absolute rule:** every color, gradient and font value must come from `customTheme`. Never use hard-coded values (e.g. `"#0BC2F7"`, `"white"`, `"700"`). Never redefine in a `*.sx.ts` a property the theme already sets.

| Need | Theme token |
|------|-------------|
| Brand gradient | `theme.palette.gradients.brand` |
| Hover gradient | `theme.palette.gradients.brandHover` |
| Gradient text | `theme.palette.gradients.brandText` |
| Primary color | `theme.palette.primary.main` |
| Secondary color | `theme.palette.secondary.main` |
| Text on primary | `theme.palette.primary.contrastText` |
| Card background | `theme.palette.background.paper` |
| App background | `theme.palette.background.default` |
| Soft shadow | `alpha(theme.palette.primary.main, 0.3)` (import `alpha` from `@mui/material/styles`) |

## Typography — using variants

When you use `<Typography>`, the typographic style (font, weight, size, color, gradient) **always** goes in the `variant` prop, never in `sx`. The only allowed use of `sx` on `<Typography>` is **spacing and layout** (e.g. `mt`, `mb`, `display`).

```tsx
// Correct
<Typography variant="accountBalance">COP 1.200.000</Typography>
<Typography variant="accountNumber" sx={{ mt: 1 }}>MB-0001-2025</Typography>

// Incorrect — do not redefine typography in sx
<Typography sx={{ fontSize: "3rem", fontWeight: 700 }}>COP 1.200.000</Typography>
```

If you need a new typographic style that repeats in several places, add it as a variant in `customTheme.tsx` and document it in `src/mui/CLAUDE.md`. Check that guide for the available variants.

## Local UI state

The open state of menus, modals and tooltips (`anchorEl`, `open`) lives in the component itself with `useState`. It never moves up to global state.

```ts
const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
const handleClose = () => setAnchorEl(null);
```

## Pure functions (helpers)

Any pure function that derives a value from data (formatting, calculations, transformations) goes in a separate `*.helpers.ts` file inside the component's folder. Never define these functions inline in the `.tsx`.

```ts
// accountPanel.helpers.ts
export const formatBalance = (balance: string): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(balance));
```

Every `*.helpers.ts` file must have its `*.helpers.spec.ts` with unit tests covering the relevant cases (normal value, zero, edge). Build the expected currency string with the same `Intl.NumberFormat` instead of hard-coding it, because the formatter emits a non-breaking space:

```ts
// accountPanel.helpers.spec.ts
import { describe, it, expect } from "vitest";
import { formatBalance } from "./accountPanel.helpers";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

describe("formatBalance", () => {
  it("formats a positive balance", () => {
    expect(formatBalance("1000000.00")).toBe(fmt(1000000));
  });
  it("formats zero", () => {
    expect(formatBalance("0")).toBe(fmt(0));
  });
});
```

## Forms in modals

When a modal contains a form (TanStack Form), never use `useEffect` to call `form.reset()` on close. Instead, wrap `onClose` in a local `handleClose` that resets first:

```tsx
const handleClose = () => {
  form.reset();
  onClose();
};
```

Use `handleClose` at every exit point:
- `<Modal onClose={handleClose}>` — covers closing via backdrop/ESC
- `{ onSuccess: handleClose }` on the mutation — covers closing after success

This makes the reset explicit and direct instead of a reactive side effect.

## Icons

Use `@mui/icons-material`. Import only the icon you need (tree-shakeable):

```ts
import { AccountCircle } from "@mui/icons-material";
```
