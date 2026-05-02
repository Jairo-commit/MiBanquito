import { Alert, Box, Modal, Paper, Typography } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { FormTextField } from "~/components/FormTextField/formTextField";
import { PrimaryFormButton } from "~/components/PrimaryFormButton/primaryFormButton";
import { useCreateCdt } from "~/hooks/useCreateCdt";
import { parseApiError } from "~/lib/parseApiError";
import { openCdtSchema, type OpenCdtFormValues } from "./openCdtModalSchema";
import * as styles from "./openCdtModal.sx";

interface OpenCdtModalProps {
  open: boolean;
  onClose: () => void;
}

const defaultValues: OpenCdtFormValues = {
  amount: "",
  term_days: "",
  annual_rate: "",
  maturity_date: "",
};

export function OpenCdtModal({ open, onClose }: OpenCdtModalProps) {
  const createCdtMutation = useCreateCdt();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      createCdtMutation.mutate(
        {
          amount: value.amount,
          term_days: Number(value.term_days),
          annual_rate: value.annual_rate,
          maturity_date: value.maturity_date,
        },
        { onSuccess: onClose }
      );
    },
    validators: {
      onBlur: openCdtSchema,
      onSubmit: openCdtSchema,
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={styles.modalPaperSx}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Typography variant="h6" sx={styles.titleSx} data-testid="open-cdt-modal-heading">
          Open a CDT
        </Typography>

        {createCdtMutation.isError && (
          <Box data-testid="open-cdt-modal-error">
            {parseApiError(createCdtMutation.error).map((message) => (
              <Alert key={message} severity="error">
                {message}
              </Alert>
            ))}
          </Box>
        )}

        <form.Field name="amount">
          {(field) => (
            <FormTextField
              field={field}
              label="Investment Amount (COP)"
              testId="open-cdt-modal-amount"
            />
          )}
        </form.Field>

        <form.Field name="term_days">
          {(field) => (
            <FormTextField
              field={field}
              label="Term (days)"
              testId="open-cdt-modal-term-days"
            />
          )}
        </form.Field>

        <form.Field name="annual_rate">
          {(field) => (
            <FormTextField
              field={field}
              label="Annual Interest Rate (%)"
              testId="open-cdt-modal-annual-rate"
            />
          )}
        </form.Field>

        <form.Field name="maturity_date">
          {(field) => (
            <FormTextField
              field={field}
              label="Maturity Date (YYYY-MM-DD)"
              testId="open-cdt-modal-maturity-date"
            />
          )}
        </form.Field>

        <PrimaryFormButton
          disabled={createCdtMutation.isPending}
          testId="open-cdt-modal-submit"
        >
          Open CDT
        </PrimaryFormButton>
      </Paper>
    </Modal>
  );
}
