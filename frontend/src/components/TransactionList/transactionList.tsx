import { Box, Divider, Skeleton, Typography } from "@mui/material";
import { BaseCard } from "~/components/BaseCard/baseCard";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { useTransactions } from "~/hooks/useTransactions";
import {
  formatAmount,
  formatDate,
  getTransactionParties,
} from "./transactionList.helpers";
import * as styles from "./transactionList.sx";

export function TransactionList() {
  const { data: transactions, isLoading } = useTransactions();
  const { data: currentUser } = useCurrentUser();
  const isSuperuser = currentUser?.is_superuser ?? false;

  if (isLoading) {
    return (
      <BaseCard title="Transactions">
        <Box data-testid="transactionlist-loading">
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={300} height={40} />
        </Box>
      </BaseCard>
    );
  }

  return (
    <BaseCard title="Movimientos">
      {transactions?.map((tx, index) => {
        const { source, destination } = getTransactionParties(tx, isSuperuser);
        return (
          <Box key={tx.id}>
            <Box sx={styles.rowSx} data-testid="transactionlist-item">
              <Typography variant="body2">
                {source} → {destination}
              </Typography>
              <Typography variant="transactionAmount" sx={styles.amountSx}>
                {formatAmount(tx.amount)}
              </Typography>
              <Typography variant="transactionDate" sx={styles.dateSx}>
                {formatDate(tx.created_at)}
              </Typography>
            </Box>
            {index < transactions.length - 1 && <Divider />}
          </Box>
        );
      })}
    </BaseCard>
  );
}
