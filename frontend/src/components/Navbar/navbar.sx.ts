import { type SxProps, type Theme } from "@mui/material/styles";

export const appBarSx: SxProps<Theme> = (theme) => ({
  background: theme.palette.gradients.brand,
});

export const navEndSx: SxProps<Theme> = {
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: 1,
};
