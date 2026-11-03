# CustomTheme — Reference guide

The theme lives in `customTheme.tsx` and is the **single source of truth** for colors, gradients and typography. Never redefine these values in `*.sx.ts` files or in inline `sx` props.

## Typography variants

When you use a `<Typography>` component, always use the `variant` prop with the matching token. Never set `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` or colors inside an `sx`.

| Variant | Scenario |
|---|---|
| `accountBalance` | An account's main balance. Large font (3 rem, bold), text with the brand gradient. |
| `accountNumber` | Account number (e.g. `MB-0001-2025`). Small font (0.875 rem), wide tracking, `secondary.main` color. |

> **Rule:** if you need a new recurring typographic style, add it here as a variant (including the `TypographyPropsVariantOverrides` module augmentation in `customTheme.tsx`) and document it in this table. Do not create the style directly in the component.

## Palette tokens

| Token | Value | Use |
|---|---|---|
| `gradients.brand` | `linear-gradient(135deg, #0BC2F7, #7B61FF)` | Backgrounds of buttons and brand elements. |
| `gradients.brandHover` | `linear-gradient(135deg, #09aedd, #6a52e0)` | Hover state of brand buttons. |
| `gradients.brandText` | `linear-gradient(135deg, #0BC2F7, #7B61FF)` | Gradient text (via `background-clip: text`). Already applied in the `accountBalance` variant. |
| `background.default` | `#E9EBF9` | App background. |
| `background.paper` | `#FFFFFF` | Cards and elevated surfaces. |
| `primary.main` | `#0BC2F7` | Main color (cyan). |
| `primary.contrastText` | `#FFFFFF` | Text on primary backgrounds. |
| `primary.light` | `#E5F6FF` | Subtle primary backgrounds. |
| `secondary.main` | `#7B61FF` | Secondary color (violet). |
| `secondary.contrastText` | `#FFFFFF` | Text on secondary backgrounds. |
| `secondary.light` | `#EDE9FF` | Subtle secondary backgrounds. |
| `error.main` | `#FB5859` | Errors and alerts. |
| `success.main` | `#22C55E` | Confirmations and success. |
| `warning.main` | `#F59E0B` | Warnings. |
