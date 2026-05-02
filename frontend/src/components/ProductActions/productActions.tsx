import { useState } from "react";
import { Button, Stack } from "@mui/material";
import { Savings, RequestPage, AccountBalance } from "@mui/icons-material";
import { BaseCard } from "~/components/BaseCard/baseCard";
import { OpenSavingsAccountModal } from "~/components/OpenSavingsAccountModal/openSavingsAccountModal";
import { ApplyForLoanModal } from "~/components/ApplyForLoanModal/applyForLoanModal";
import { OpenCdtModal } from "~/components/OpenCdtModal/openCdtModal";
import * as styles from "./productActions.sx";

export function ProductActions() {
  const [savingsOpen, setSavingsOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);
  const [cdtOpen, setCdtOpen] = useState(false);

  return (
    <>
      <BaseCard title="Banking Products" testId="product-actions">
        <Stack spacing={2}>
          <Button
            variant="contained"
            startIcon={<Savings />}
            onClick={() => setSavingsOpen(true)}
            sx={styles.actionButtonSx}
            data-testid="product-actions-open-savings"
          >
            Open Savings Account
          </Button>
          <Button
            variant="contained"
            startIcon={<RequestPage />}
            onClick={() => setLoanOpen(true)}
            sx={styles.actionButtonSx}
            data-testid="product-actions-apply-loan"
          >
            Apply for a Loan
          </Button>
          <Button
            variant="contained"
            startIcon={<AccountBalance />}
            onClick={() => setCdtOpen(true)}
            sx={styles.actionButtonSx}
            data-testid="product-actions-open-cdt"
          >
            Open a CDT
          </Button>
        </Stack>
      </BaseCard>

      <OpenSavingsAccountModal
        open={savingsOpen}
        onClose={() => setSavingsOpen(false)}
      />
      <ApplyForLoanModal
        open={loanOpen}
        onClose={() => setLoanOpen(false)}
      />
      <OpenCdtModal
        open={cdtOpen}
        onClose={() => setCdtOpen(false)}
      />
    </>
  );
}
