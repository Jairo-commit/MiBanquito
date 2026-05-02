import type { SxProps, Theme } from "@mui/material/styles";

export const paperSx: SxProps<Theme> = (theme) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
});
