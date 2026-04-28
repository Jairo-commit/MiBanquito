import { Box, Typography } from "@mui/material";
import type { SavingsAccount } from "~/models/account.model";
import { formatBalance } from "./accountPanel.helpers";
import * as styles from "./accountPanel.sx";

type AccountPanelProps = {
  account: SavingsAccount;
};

export function AccountPanel({ account }: AccountPanelProps) {
  return (
    <Box sx={styles.containerSx}>
      <Typography variant="accountBalance" data-testid="accountpanel-balance">
        {formatBalance(account.balance)}
      </Typography>
      <Typography
        variant="accountNumber"
        sx={styles.accountNumberSx}
        data-testid="accountpanel-account-number"
      >
        {account.account_number}
      </Typography>
    </Box>
  );
}
