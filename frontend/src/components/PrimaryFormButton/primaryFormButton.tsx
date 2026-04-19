import { Button } from "@mui/material";
import type { ReactNode } from "react";
import * as styles from "./primaryFormButton.sx";

interface PrimaryFormButtonProps {
    children: ReactNode;
    type?: "submit" | "button" | "reset";
}

export function PrimaryFormButton({ children, type = "submit" }: PrimaryFormButtonProps) {
    return (
        <Button type={type} variant="contained" fullWidth sx={styles.primaryFormButtonSx}>
            {children}
        </Button>
    );
}
