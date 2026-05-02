import { Alert, Box, Modal, Paper, Typography } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { FormNumberField } from "~/components/FormNumberField/formNumberField";
import { FormTextField } from "~/components/FormTextField/formTextField";
import { PrimaryFormButton } from "~/components/PrimaryFormButton/primaryFormButton";
import { useTransfer } from "~/hooks/useTransfer";
import { parseApiError } from "~/lib/parseApiError";
import type { SavingsAccount } from "~/models/account.model";
import { transferSchema, type TransferFormValues } from "./transferModalSchema";
import * as styles from "./transferModal.sx";

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  sourceAccount: SavingsAccount;
}

const defaultValues: TransferFormValues = {
  to_account_number: "",
  amount: 0,
  description: "",
};

export function TransferModal({ open, onClose, sourceAccount }: TransferModalProps) {
  const transferMutation = useTransfer();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      transferMutation.mutate(
        {
          source_account: sourceAccount.id,
          to_account_number: value.to_account_number,
          transaction_type: "INTERNAL",
          amount: String(value.amount),
          description: value.description ?? "",
        },
        { onSuccess: handleClose }
      );
    },
    validators: {
      onBlur: transferSchema,
      onSubmit: transferSchema,
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        sx={styles.modalPaperSx}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Typography variant="h6" sx={styles.titleSx} data-testid="transfer-modal-heading">
          Transfer Funds
        </Typography>

        {transferMutation.isError && (
          <Box data-testid="transfer-modal-error">
            {parseApiError(transferMutation.error).map((message) => (
              <Alert key={message} severity="error">
                {message}
              </Alert>
            ))}
          </Box>
        )}

        <form.Field name="to_account_number">
          {(field) => (
            <FormTextField
              field={field}
              label="Destination Account Number"
              testId="transfer-modal-to-account-number"
            />
          )}
        </form.Field>

        <form.Field name="amount">
          {(field) => (
            <FormNumberField
              field={field}
              label="Amount (COP)"
              min={1}
              step={1}
              testId="transfer-modal-amount"
            />
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <FormTextField
              field={field}
              label="Description (optional)"
              testId="transfer-modal-description"
            />
          )}
        </form.Field>

        <PrimaryFormButton
          disabled={transferMutation.isPending}
          testId="transfer-modal-submit"
        >
          Transfer
        </PrimaryFormButton>
      </Paper>
    </Modal>
  );
}
