import { Button } from "@mui/material";
import type { ReactNode } from "react";
import * as styles from "./primaryFormButton.sx";

interface PrimaryFormButtonProps {
  children: ReactNode;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
}

export function PrimaryFormButton({
  children,
  type = "submit",
  disabled,
}: PrimaryFormButtonProps) {
  return (
    <Button
      type={type}
      variant="contained"
      fullWidth
      disabled={disabled}
      sx={styles.primaryFormButtonSx}
    >
      {children}
    </Button>
  );
}
