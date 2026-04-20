import { Alert, Box, Typography } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { registerSchema, RegisterFormValues } from "./registerSchema";
import { FormTextField } from "~/components/FormTextField/formTextField";
import { FormSelectField } from "~/components/FormSelectField/formSelectField";
import { PrimaryFormButton } from "~/components/PrimaryFormButton/primaryFormButton";
import { DOCUMENT_TYPE_OPTIONS } from "~/constants/documentTypeOptions";
import { useRegister } from "~/hooks/useRegister";
import { parseApiError } from "~/lib/parseApiError";
import * as styles from "./register.sx";

const defaultValues: RegisterFormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  document_type: "CC",
  document_number: "",
  full_name: "",
  city: "",
  phone: "",
};

export function Register() {
  const registerMutation = useRegister();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const { confirmPassword, ...payload } = value;
      registerMutation.mutate(payload, {
        onSuccess: () => navigate("/login"),
      });
    },
    validators: {
      onBlur: registerSchema,
      onSubmit: registerSchema,
    },
  });

  return (
    <Box sx={styles.pageWrapperSx}>
      <Box
        sx={styles.formCardSx}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Typography variant="h5" sx={styles.titleSx}>
          Create your account
        </Typography>

        {registerMutation.isError &&
          parseApiError(registerMutation.error).map((message) => (
            <Alert key={message} severity="error" sx={styles.errorAlertSx}>
              {message}
            </Alert>
          ))}

        <form.Field name="username">
          {(field) => <FormTextField field={field} label="Username" />}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <FormTextField field={field} label="Email" type="email" />
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <FormTextField field={field} label="Password" type="password" />
          )}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => (
            <FormTextField
              field={field}
              label="Confirm Password"
              type="password"
            />
          )}
        </form.Field>

        <form.Field name="document_type">
          {(field) => (
            <FormSelectField
              field={field}
              label="Document Type"
              options={DOCUMENT_TYPE_OPTIONS}
            />
          )}
        </form.Field>

        <form.Field name="document_number">
          {(field) => <FormTextField field={field} label="Document Number" />}
        </form.Field>

        <form.Field name="full_name">
          {(field) => (
            <FormTextField field={field} label="Full Name (optional)" />
          )}
        </form.Field>

        <form.Field name="city">
          {(field) => <FormTextField field={field} label="City (optional)" />}
        </form.Field>

        <form.Field name="phone">
          {(field) => <FormTextField field={field} label="Phone (optional)" />}
        </form.Field>

        <PrimaryFormButton disabled={registerMutation.isPending}>
          Register
        </PrimaryFormButton>
      </Box>
    </Box>
  );
}
