import type { SxProps, Theme } from "@mui/material/styles";

export const actionButtonSx: SxProps<Theme> = (theme) => ({
  background: theme.palette.gradients.brand,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  borderRadius: "8px",
  justifyContent: "flex-start",
  "&:hover": {
    background: theme.palette.gradients.brandHover,
  },
});
