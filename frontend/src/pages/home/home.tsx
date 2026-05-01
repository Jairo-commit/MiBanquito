import { Box } from "@mui/material";
import { Navbar } from "~/components/Navbar/navbar";
import { SplitLayout } from "~/components/SplitLayout/splitLayout";
import { AccountPanelList } from "~/components/AccountPanelList/accountPanelList";
import { TransactionList } from "~/components/TransactionList/transactionList";

export function Home() {
  return (
    <Box>
      <Navbar />
      <SplitLayout
        left={
          <>
            <AccountPanelList />
            <TransactionList />
          </>
        }
        right={<Box />}
        leftWidth={70}
      />
    </Box>
  );
}