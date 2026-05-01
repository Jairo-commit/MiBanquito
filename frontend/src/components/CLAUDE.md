# Componentes — Convenciones

## Estructura de carpetas

Cada componente vive en su propia carpeta con el nombre en PascalCase. Los archivos dentro usan camelCase:

```
src/components/
├── MyComponent/
│   ├── myComponent.tsx          — lógica y JSX
│   ├── myComponent.sx.ts        — estilos SX (si los hay)
│   ├── myComponent.helpers.ts   — funciones puras (si las hay)
│   └── myComponent.helpers.spec.ts — tests unitarios de helpers
└── protectedRoute.tsx           — excepción: componentes de una sola responsabilidad sin estilos propios
```

## Estilos SX

Los estilos SX van siempre en un archivo separado `*.sx.ts` en la misma carpeta. Nunca escribir objetos SX inline en el JSX.

**Tipo base:**

```ts
import { type SxProps, type Theme } from "@mui/material/styles";

export const mySx: SxProps<Theme> = { ... };
```

**Cuando el estilo depende del tema** (colores, gradientes, spacing), usar el callback:

```ts
export const mySx: SxProps<Theme> = (theme) => ({
  background: theme.palette.gradients.brand,
  color: theme.palette.primary.contrastText,
  mt: theme.spacing(1),
});
```

## Colores y tipografía

**Regla absoluta:** todos los valores de color, gradiente y fuente deben venir del `customTheme`. Nunca usar valores hardcodeados (p. ej. `"#0BC2F7"`, `"white"`, `"700"`). Nunca redefinir en un `*.sx.ts` propiedades que ya están en el tema.

| Necesidad | Token del tema |
|-----------|---------------|
| Gradiente de marca | `theme.palette.gradients.brand` |
| Gradiente hover | `theme.palette.gradients.brandHover` |
| Color primario | `theme.palette.primary.main` |
| Color secundario | `theme.palette.secondary.main` |
| Texto sobre primario | `theme.palette.primary.contrastText` |
| Fondo de tarjeta | `theme.palette.background.paper` |
| Fondo general | `theme.palette.background.default` |
| Sombra suave | `alpha(theme.palette.primary.main, 0.3)` (importar `alpha` de `@mui/material/styles`) |

## Typography — uso de variants

Cuando uses `<Typography>`, el estilo tipográfico (fuente, peso, tamaño, color, gradiente) va **siempre** en el prop `variant`, nunca en `sx`. El único uso permitido de `sx` sobre `<Typography>` es para **espaciado y layout** (p. ej. `mt`, `mb`, `display`).

```tsx
// Correcto
<Typography variant="accountBalance">COP 1.200.000</Typography>
<Typography variant="accountNumber" sx={{ mt: 1 }}>MB-0001-2025</Typography>

// Incorrecto — no redefinir tipografía en sx
<Typography sx={{ fontSize: "3rem", fontWeight: 700 }}>COP 1.200.000</Typography>
```

Si necesitas un nuevo estilo tipográfico que se repita en varios lugares, agrégalo como variante en `customTheme.tsx` y documéntalo en `src/mui/CLAUDE.md`. Consulta esa guía para ver las variantes disponibles.

## Estado local de UI

El estado de apertura de menús, modales y tooltips (`anchorEl`, `open`) vive en el propio componente con `useState`. No sube al store global.

```ts
const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
const handleClose = () => setAnchorEl(null);
```

## Funciones puras (helpers)

Cualquier función pura que derive un valor a partir de datos (formateo, cálculos, transformaciones) va en un archivo `*.helpers.ts` separado dentro de la carpeta del componente. Nunca definir estas funciones inline en el `.tsx`.

```ts
// accountPanel.helpers.ts
export const formatBalance = (balance: string): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(balance));
```

Cada archivo `*.helpers.ts` debe tener su `*.helpers.spec.ts` con tests unitarios que cubran los casos relevantes (valor normal, cero, borde):

```ts
// accountPanel.helpers.spec.ts
import { describe, it, expect } from "vitest";
import { formatBalance } from "./accountPanel.helpers";

describe("formatBalance", () => {
  it("formats a positive balance", () => {
    expect(formatBalance("1000000.00")).toBe("$ 1.000.000");
  });
  it("formats zero", () => {
    expect(formatBalance("0")).toBe("$ 0");
  });
});
```

## Formularios en modales

Cuando un modal contiene un formulario (TanStack Form), nunca usar `useEffect` para hacer `form.reset()` al cerrar. En su lugar, envolver `onClose` en un `handleClose` local que resetea primero:

```tsx
const handleClose = () => {
  form.reset();
  onClose();
};
```

Usar `handleClose` en todos los puntos de cierre:
- `<Modal onClose={handleClose}>` — cubre cierre por backdrop/ESC
- `{ onSuccess: handleClose }` en la mutación — cubre cierre tras éxito

Esto hace el reset explícito y directo en lugar de un efecto secundario reactivo.

## Iconos

Usar `@mui/icons-material`. Importar solo el icono necesario (tree-shakeable):

```ts
import { AccountCircle } from "@mui/icons-material";
```
