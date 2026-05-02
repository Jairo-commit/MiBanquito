import { Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";
import * as styles from "./baseCard.sx";

interface BaseCardProps {
  children: ReactNode;
  title?: string;
  testId?: string;
}

export function BaseCard({ children, title, testId }: BaseCardProps) {
  return (
    <Paper sx={styles.paperSx} data-testid={testId}>
      {title && (
        <Typography
          variant="h6"
          data-testid={testId ? `${testId}-title` : undefined}
        >
          {title}
        </Typography>
      )}
      {children}
    </Paper>
  );
}
