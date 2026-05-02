import { Box, Divider, Skeleton, Typography } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { BaseCard } from "~/components/BaseCard/baseCard";
import { useTransactions } from "~/hooks/useTransactions";
import { formatAmount, formatDate } from "./transactionList.helpers";
import * as styles from "./transactionList.sx";

export function TransactionList() {
  const { data: transactions, isLoading } = useTransactions();

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
      {transactions?.map((tx, index) => (
        <Box key={tx.id}>
          <Box sx={styles.rowSx} data-testid="transactionlist-item">
            <ArrowUpwardIcon sx={{ color: "error.main" }} fontSize="small" />
            <Typography variant="body2">
              {tx.source_account_number ?? "—"}
            </Typography>
            <ArrowDownwardIcon sx={{ color: "success.main" }} fontSize="small" />
            <Typography variant="body2">
              {tx.destination_account_number ?? "—"}
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
      ))}
    </BaseCard>
  );
}
