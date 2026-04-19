import { alpha } from "@mui/material/styles";
import { type SxProps, type Theme } from "@mui/material/styles";

export const pageWrapperSx: SxProps<Theme> = (theme) => ({
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.palette.gradients.brand,
    padding: theme.spacing(2),
});

export const formCardSx: SxProps<Theme> = (theme) => ({
    background: alpha(theme.palette.background.paper, 0.55),
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${alpha(theme.palette.background.paper, 0.7)}`,
    borderRadius: "12px",
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
    width: "100%",
    maxWidth: 480,
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
});

export const titleSx: SxProps<Theme> = (theme) => ({
    fontWeight: 700,
    background: theme.palette.gradients.brandText,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    mb: 1,
});
