import { Box } from "@mui/material";
import { type ReactNode } from "react";
import * as styles from "./splitLayout.sx";

interface SplitLayoutProps {
    left: ReactNode;
    right: ReactNode;
    leftWidth?: number;
}

export function SplitLayout({ left, right, leftWidth = 50 }: SplitLayoutProps) {
    return (
        <Box sx={styles.containerSx}>
            <Box sx={styles.leftPanelSx(leftWidth)} data-testid="splitlayout-left">{left}</Box>
            <Box sx={styles.rightPanelSx} data-testid="splitlayout-right">{right}</Box>
        </Box>
    );
}
