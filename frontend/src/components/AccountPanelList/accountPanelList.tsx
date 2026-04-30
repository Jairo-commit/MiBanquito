import { Box, Skeleton } from "@mui/material";
import { AccountPanel } from "~/components/AccountPanel/accountPanel";
import { useAccount } from "~/hooks/useAccount";
import * as styles from "./accountPanelList.sx";

export function AccountPanelList() {
  const { data: accounts, isLoading } = useAccount();

  if (isLoading) {
    return (
      <Box data-testid="accountpanellist-loading" sx={styles.loadingContainerSx}>
        <Skeleton variant="text" width={300} height={72} />
        <Skeleton variant="text" width={180} height={24} />
      </Box>
    );
  }

  return (
    <>
      {accounts?.map((account) => (
        <AccountPanel key={account.id} account={account} />
      ))}
    </>
  );
}
