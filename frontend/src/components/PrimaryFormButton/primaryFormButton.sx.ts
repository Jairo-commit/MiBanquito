import { alpha } from "@mui/material/styles";
import { type SxProps, type Theme } from "@mui/material/styles";

export const primaryFormButtonSx: SxProps<Theme> = (theme) => ({
    mt: theme.spacing(1),
    py: theme.spacing(1.5),
    background: theme.palette.gradients.brand,
    color: theme.palette.background.paper,
    fontWeight: 700,
    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
    "&:hover": {
        background: theme.palette.gradients.brandHover,
    },
});
