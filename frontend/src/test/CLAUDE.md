# Testing — Técnicas y convenciones

## Stack

- **Vitest** — runner nativo de Vite; config en `vitest.config.ts` (raíz del frontend)
- **@testing-library/react** — render e interacción con componentes React
- **@testing-library/user-event** — simula eventos reales del usuario (pointer, teclado)
- **@testing-library/jest-dom** — matchers extra para el DOM (`toBeInTheDocument`, `toBeDisabled`, etc.)
- **MSW v2** — intercepta peticiones HTTP de Axios a nivel de red (`msw/node`)

## Estructura de carpetas

```
src/test/
├── setup.ts               — configuración global de todos los tests
├── testUtils.tsx          — render con providers y re-exports de utilidades
├── factories/             — constructores de datos de prueba tipados
│   ├── authTokenFactory.ts
│   └── userResponseFactory.ts
└── mocks/
    ├── handlers.ts        — handlers MSW happy-path (usan factories)
    └── server.ts          — instancia del servidor MSW
```

Los archivos de test viven junto al código que testean (co-located) y usan la extensión `.spec.tsx`. No usar subdirectorios `__tests__/`.

## Providers de test (`testUtils.tsx`)

Cada test recibe un `QueryClient` **nuevo** para evitar que la caché de React Query filtre estado entre tests. El wrapper incluye:

1. `QueryClientProvider` con `retry: false` en queries y mutations
2. `MemoryRouter` — reemplaza `BrowserRouter`; acepta `initialEntries` por opción
3. `CustomTheme` — necesario porque MUI lanza error sin `ThemeProvider`

```tsx
renderWithProviders(<Login />, { routerProps: { initialEntries: ["/login"] } });
```

## Factories

Las factories crean objetos tipados con valores por defecto sobreescribibles. Útil para reusar en handlers MSW y en aserciones de tests individuales.

```ts
authTokenFactory({ access: "custom-token" })   // solo sobreescribe lo que importa
userResponseFactory({ username: "jairo" })
```

El tipo de retorno es siempre el modelo de producción (`AuthToken`, `UserResponse`), por lo que TypeScript detecta campos incorrectos.

## MSW — mocks de red

Los handlers en `handlers.ts` cubren el happy-path. Para errores o casos especiales, se sobreescribe el handler **dentro del test** con `server.use(...)`. El `afterEach` del setup llama a `server.resetHandlers()` para que el override no afecte otros tests.

```ts
server.use(
  http.post("http://localhost:8000/token/", () =>
    HttpResponse.json({ detail: "No active account..." }, { status: 401 })
  )
);
```

`onUnhandledRequest: "error"` hace fallar el test si Axios hace una petición sin handler, evitando falsos positivos silenciosos.

## Mock de `useNavigate`

`vi.mock` se eleva antes que los imports, así que la variable del mock debe crearse con `vi.hoisted()`:

```ts
const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});
```

Se limpia en `afterEach` con `mockNavigate.mockClear()`.

## Aserciones asíncronas

Las mutaciones de React Query son asíncronas. Siempre usar `waitFor` para esperar que el DOM se actualice tras un submit:

```ts
await user.click(screen.getByRole("button", { name: /sign in/i }));
await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
```

Nunca afirmar síncronamente después de una acción que dispara una mutación.

## Cleanup

Con `globals: false` en Vitest, RTL no detecta el `afterEach` global y no limpia el DOM automáticamente. Se llama `cleanup()` explícitamente en `setup.ts`:

```ts
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
```

## Selectores en tests — siempre `data-testid`

**Regla absoluta:** usar únicamente `getByTestId` para encontrar elementos en los tests. Nunca usar `getByRole`, `getByLabelText`, `getByText`, `getByPlaceholderText` ni similares.

**Por qué:** los selectores basados en roles, labels o texto se rompen con cualquier cambio de copy, restructuración de HTML o actualización de librería de UI. `data-testid` es un contrato explícito entre el componente y su test, independiente de la presentación.

### Convención de nombres

```
{página|componente}-{elemento}           → login-username, register-submit
{página|componente}-{elemento}-error     → register-email-error (helper text de validación)
```

### Cómo agregar testids en componentes

**FormTextField** — acepta `testId?: string`:
- El `testId` se pone en el `<input>` nativo vía `slotProps.htmlInput`
- `${testId}-error` se pone en el helper text vía `slotProps.formHelperText`

**FormSelectField** — acepta `testId?: string`:
- El `testId` se pone en el `<FormControl>` wrapper vía `data-testid`

**PrimaryFormButton** — acepta `testId?: string`:
- El `testId` se pone en el `<Button>` vía `data-testid`

**Elementos directos en JSX** (headings, links, contenedores de error):
```tsx
<Typography data-testid="login-heading">Welcome back</Typography>
<Box data-testid="login-error">{errors}</Box>
<Link data-testid="login-register-link">Register</Link>
```

### Patrón en tests

```ts
// Verificar presencia
expect(screen.getByTestId("login-username")).toBeInTheDocument();

// Interactuar
await user.type(screen.getByTestId("login-username"), "testuser");
await user.click(screen.getByTestId("login-submit"));

// Verificar errores de validación
expect(screen.getByTestId("register-email-error")).toHaveTextContent(/please enter a valid email/i);

// Verificar errores de API (wrapper de alertas)
await waitFor(() => expect(screen.getByTestId("login-error")).toBeInTheDocument());
expect(screen.getByTestId("login-error")).toHaveTextContent("detail: ...");
```

## Comandos

```bash
# Watch mode (desarrollo)
docker compose exec frontend npm run test

# Single run (CI)
docker compose exec frontend npm run test:run

# Coverage HTML en coverage/index.html
docker compose exec frontend npm run coverage
```
