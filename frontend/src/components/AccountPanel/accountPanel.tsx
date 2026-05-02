import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";
import { TransferModal } from "~/components/TransferModal/transferModal";
import type { SavingsAccount } from "~/models/account.model";
import { formatBalance } from "./accountPanel.helpers";
import * as styles from "./accountPanel.sx";

type AccountPanelProps = {
  account: SavingsAccount;
};

export function AccountPanel({ account }: AccountPanelProps) {
  const [transferOpen, setTransferOpen] = useState(false);

  return (
    <>
      <Box sx={styles.containerSx}>
        <Typography variant="accountBalance" data-testid="accountpanel-balance">
          {formatBalance(account.balance)}
        </Typography>
        <Box sx={styles.accountNumberRowSx}>
          <Typography variant="caption">Bank Number:</Typography>
          <Typography
            variant="accountNumber"
            data-testid="accountpanel-account-number"
          >
            {account.account_number}
          </Typography>
        </Box>
        <Box sx={styles.actionRowSx}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<SwapHoriz />}
            onClick={() => setTransferOpen(true)}
            data-testid="accountpanel-transfer-button"
          >
            Transfer
          </Button>
        </Box>
      </Box>
      <TransferModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        sourceAccount={account}
      />
    </>
  );
}
