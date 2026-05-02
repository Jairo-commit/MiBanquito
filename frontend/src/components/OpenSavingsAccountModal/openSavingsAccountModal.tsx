import { Alert, Box, Modal, Paper, Typography } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { FormNumberField } from "~/components/FormNumberField/formNumberField";
import { PrimaryFormButton } from "~/components/PrimaryFormButton/primaryFormButton";
import { useCreateAccount } from "~/hooks/useCreateAccount";
import { parseApiError } from "~/lib/parseApiError";
import {
  openSavingsAccountSchema,
  type OpenSavingsAccountFormValues,
} from "./openSavingsAccountModalSchema";
import * as styles from "./openSavingsAccountModal.sx";

interface OpenSavingsAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const defaultValues: OpenSavingsAccountFormValues = {
  balance: 0,
};

export function OpenSavingsAccountModal({ open, onClose }: OpenSavingsAccountModalProps) {
  const createAccountMutation = useCreateAccount();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      createAccountMutation.mutate(
        { balance: String(value.balance) },
        { onSuccess: handleClose }
      );
    },
    validators: {
      onBlur: openSavingsAccountSchema,
      onSubmit: openSavingsAccountSchema,
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
        <Typography variant="h6" sx={styles.titleSx} data-testid="open-savings-account-modal-heading">
          Open Savings Account
        </Typography>

        {createAccountMutation.isError && (
          <Box data-testid="open-savings-account-modal-error">
            {parseApiError(createAccountMutation.error).map((message) => (
              <Alert key={message} severity="error">
                {message}
              </Alert>
            ))}
          </Box>
        )}

        <form.Field name="balance">
          {(field) => (
            <FormNumberField
              field={field}
              label="Initial Deposit (COP)"
              min={0}
              testId="open-savings-account-modal-balance"
            />
          )}
        </form.Field>

        <PrimaryFormButton
          disabled={createAccountMutation.isPending}
          testId="open-savings-account-modal-submit"
        >
          Open Account
        </PrimaryFormButton>
      </Paper>
    </Modal>
  );
}
