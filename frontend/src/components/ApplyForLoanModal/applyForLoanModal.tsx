import { Alert, Box, Modal, Paper, Typography } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { FormTextField } from "~/components/FormTextField/formTextField";
import { PrimaryFormButton } from "~/components/PrimaryFormButton/primaryFormButton";
import { useCreateLoan } from "~/hooks/useCreateLoan";
import { parseApiError } from "~/lib/parseApiError";
import {
  applyForLoanSchema,
  type ApplyForLoanFormValues,
} from "./applyForLoanModalSchema";
import * as styles from "./applyForLoanModal.sx";

interface ApplyForLoanModalProps {
  open: boolean;
  onClose: () => void;
}

const defaultValues: ApplyForLoanFormValues = {
  amount: "",
  term_months: "",
  monthly_rate: "",
};

export function ApplyForLoanModal({ open, onClose }: ApplyForLoanModalProps) {
  const createLoanMutation = useCreateLoan();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      createLoanMutation.mutate(
        {
          amount: value.amount,
          term_months: Number(value.term_months),
          monthly_rate: value.monthly_rate,
        },
        { onSuccess: onClose }
      );
    },
    validators: {
      onBlur: applyForLoanSchema,
      onSubmit: applyForLoanSchema,
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
        <Typography variant="h6" sx={styles.titleSx} data-testid="apply-for-loan-modal-heading">
          Apply for a Loan
        </Typography>

        {createLoanMutation.isError && (
          <Box data-testid="apply-for-loan-modal-error">
            {parseApiError(createLoanMutation.error).map((message) => (
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
              label="Loan Amount (COP)"
              testId="apply-for-loan-modal-amount"
            />
          )}
        </form.Field>

        <form.Field name="term_months">
          {(field) => (
            <FormTextField
              field={field}
              label="Term (months)"
              testId="apply-for-loan-modal-term-months"
            />
          )}
        </form.Field>

        <form.Field name="monthly_rate">
          {(field) => (
            <FormTextField
              field={field}
              label="Monthly Interest Rate (%)"
              testId="apply-for-loan-modal-monthly-rate"
            />
          )}
        </form.Field>

        <PrimaryFormButton
          disabled={createLoanMutation.isPending}
          testId="apply-for-loan-modal-submit"
        >
          Submit Application
        </PrimaryFormButton>
      </Paper>
    </Modal>
  );
}
