import { type SxProps, type Theme } from "@mui/material/styles";

export const rowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  py: 1.5,
};

export const amountSx: SxProps<Theme> = {
  ml: "auto",
};

export const dateSx: SxProps<Theme> = {
  minWidth: 80,
};
