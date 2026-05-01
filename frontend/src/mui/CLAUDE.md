# CustomTheme — Guía de referencia

El tema vive en `customTheme.tsx` y es la **única fuente de verdad** para colores, gradientes y tipografía. No se deben redefinir estos valores en archivos `*.sx.ts` ni en props `sx` inline.

## Typography variants

Cuando uses un componente `<Typography>`, usa siempre el prop `variant` con el token correspondiente. Nunca definas `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` ni colores dentro de un `sx`.

| Variant | Escenario |
|---|---|
| `accountBalance` | Saldo principal de una cuenta. Fuente grande (3 rem, bold), texto con gradiente de marca. |
| `accountNumber` | Número de cuenta (p. ej. `MB-0001-2025`). Fuente pequeña (0.875 rem), tracking amplio, color `secondary.main`. |

> **Regla:** si necesitas un nuevo estilo tipográfico recurrente, agrégalo aquí como variante y documéntalo en esta tabla. No crees el estilo directamente en el componente.

## Palette tokens

| Token | Valor | Uso |
|---|---|---|
| `gradients.brand` | `linear-gradient(135deg, #0BC2F7, #7B61FF)` | Fondos de botones y elementos de marca. |
| `gradients.brandHover` | `linear-gradient(135deg, #09aedd, #6a52e0)` | Estado hover de botones de marca. |
| `gradients.brandText` | `linear-gradient(135deg, #0BC2F7, #7B61FF)` | Texto con gradiente (via `background-clip: text`). Ya aplicado en el variant `accountBalance`. |
| `background.default` | `#E9EBF9` | Fondo general de la app. |
| `background.paper` | `#FFFFFF` | Tarjetas y superficies elevadas. |
| `primary.main` | `#0BC2F7` | Color principal (cian). |
| `primary.contrastText` | `#FFFFFF` | Texto sobre fondos primarios. |
| `primary.light` | `#E5F6FF` | Fondos sutiles primarios. |
| `secondary.main` | `#7B61FF` | Color secundario (violeta). |
| `secondary.contrastText` | `#FFFFFF` | Texto sobre fondos secundarios. |
| `secondary.light` | `#EDE9FF` | Fondos sutiles secundarios. |
| `error.main` | `#FB5859` | Errores y alertas. |
| `success.main` | `#22C55E` | Confirmaciones y éxito. |
| `warning.main` | `#F59E0B` | Advertencias. |
