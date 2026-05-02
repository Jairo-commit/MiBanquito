import type { SxProps, Theme } from "@mui/material/styles";

export const modalPaperSx: SxProps<Theme> = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 400,
  padding: theme.spacing(4),
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  outline: "none",
});

export const headerSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export const titleSx: SxProps<Theme> = (theme) => ({
  background: theme.palette.gradients.brandText,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});
