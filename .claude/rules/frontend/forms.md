---
paths:
  - "frontend/src/components/**/*Modal*/**"
  - "frontend/src/components/Form*/**"
  - "frontend/src/pages/**"
  - "frontend/src/**/*Schema.ts"
---

# Forms

- **Forms use TanStack Form (`useForm`) validated by a Zod schema** that lives in `<name>Schema.ts` next to the component, together with its `<Name>FormValues` type.
  - Validate on both blur and submit: `validators: { onBlur: schema, onSubmit: schema }`.
  - Schema messages are user-facing English sentences: `"Destination account number is required"`.
- **Declare `defaultValues` as a typed constant outside the component.** A number input starts as `null`, not `0`.
- **Render fields through the shared wrappers, never a raw MUI `TextField`**: `FormTextField`, `FormNumberField`, `FormSelectField`, and submit with `PrimaryFormButton`. Each takes a `testId`, which also produces `<testId>-error` on the helper text.
  ```tsx
  <form.Field name="amount">
    {(field) => <FormNumberField field={field} label="Amount (COP)" testId="transfer-modal-amount" />}
  </form.Field>
  ```
- **The form element calls `e.preventDefault()` and then `form.handleSubmit()`**; `onSubmit` calls `mutation.mutate(payload, { onSuccess })`.
- **Disable the submit button while the mutation runs**: `disabled={mutation.isPending}`.
- **Show API errors with `parseApiError(mutation.error)`**, one `<Alert severity="error">` per message, inside a `Box` with a `<name>-error` test id.
- **A modal form resets in a local `handleClose`, never in a `useEffect`.** Use `handleClose` at every exit: `<Modal onClose={handleClose}>` and `{ onSuccess: handleClose }`.
  ```tsx
  const handleClose = () => {
    form.reset();
    onClose();
  };
  ```
- **Convert form values to the API's shape at submit time** (`amount: String(value.amount)`), so the form keeps the types the inputs need.
- **References**: `src/components/TransferModal/`, `src/pages/register/`.
