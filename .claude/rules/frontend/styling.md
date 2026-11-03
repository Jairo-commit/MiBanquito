---
paths:
  - "frontend/src/**/*.tsx"
  - "frontend/src/**/*.sx.ts"
  - "frontend/src/mui/**"
---

# Styling with MUI and the custom theme

- **SX styles live in the component's `*.sx.ts` file, never inline in the JSX.** Each style is an exported `SxProps<Theme>` named `<purpose>Sx`, and the component imports them all as `styles`.
  - Bad: `<Paper sx={{ padding: 32, borderRadius: "12px" }}>`
  - Good: `<Paper sx={styles.modalPaperSx}>` with `export const modalPaperSx: SxProps<Theme> = (theme) => ({ padding: theme.spacing(4), ... })`
  - The one exception: a single spacing or layout prop on a `Typography`, such as `sx={{ mt: 1 }}`.
- **Use the theme callback `(theme) => ({ ... })` whenever a style needs a color, gradient or spacing.**
- **Every color, gradient and font comes from `src/mui/customTheme.tsx`; never hard-code one.** Read `src/mui/CLAUDE.md` for the token table before styling.
  - Bad: `color: "#0BC2F7"`, `background: "white"`, `fontWeight: 700`
  - Good: `theme.palette.primary.main`, `theme.palette.background.paper`, `theme.palette.gradients.brand`
  - Shadows and tints: `alpha(theme.palette.primary.main, 0.3)` with `alpha` from `@mui/material/styles`.
- **Typography style goes in `variant`, never in `sx`.** `sx` on a `<Typography>` may only carry spacing and layout (`mt`, `mb`, `display`).
  - Bad: `<Typography sx={{ fontSize: "3rem", fontWeight: 700 }}>`
  - Good: `<Typography variant="accountBalance">`
- **A typographic style used in more than one place becomes a new theme variant** in `customTheme.tsx`, documented in the variant table of `src/mui/CLAUDE.md`, with its TypeScript module augmentation.
- **Never redefine in a `*.sx.ts` a property the theme already sets.**
