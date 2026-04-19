import { alpha } from "@mui/material/styles";
import { type SxProps, type Theme } from "@mui/material/styles";

export const pageContainerSx: SxProps<Theme> = (theme) => ({
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.palette.gradients.brand,
});

export const glassCardSx: SxProps<Theme> = (theme) => ({
    background: alpha(theme.palette.background.paper, 0.55),
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${alpha(theme.palette.background.paper, 0.7)}`,
    borderRadius: 3,
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    px: 6,
    py: 5,
    maxWidth: 420,
    width: "100%",
    textAlign: "center",
});

export const headingNumberSx: SxProps<Theme> = (theme) => ({
    fontSize: "6rem",
    fontWeight: 800,
    background: theme.palette.gradients.brandText,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: 1,
});

export const goHomeButtonSx: SxProps<Theme> = (theme) => ({
    mt: 1,
    borderRadius: 2,
    px: 4,
    background: theme.palette.gradients.brand,
    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
    "&:hover": {
        background: theme.palette.gradients.brandHover,
    },
});
