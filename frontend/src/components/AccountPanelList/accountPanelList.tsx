import { Box, Skeleton } from "@mui/material";
import { AccountPanel } from "~/components/AccountPanel/accountPanel";
import { BaseCard } from "~/components/BaseCard/baseCard";
import { useAccount } from "~/hooks/useAccount";
import * as styles from "./accountPanelList.sx";

export function AccountPanelList() {
  const { data: accounts, isLoading } = useAccount();

  if (isLoading) {
    return (
      <BaseCard title="Bank Accounts" testId="accountpanellist-loading">
        <Box sx={styles.loadingContainerSx}>
          <Skeleton variant="text" width={300} height={72} />
          <Skeleton variant="text" width={180} height={24} />
        </Box>
      </BaseCard>
    );
  }

  return (
    <BaseCard title="Bank Accounts" testId="accountpanellist">
      <Box sx={styles.listContainerSx}>
        {accounts?.map((account) => (
          <AccountPanel key={account.id} account={account} />
        ))}
      </Box>
    </BaseCard>
  );
}
