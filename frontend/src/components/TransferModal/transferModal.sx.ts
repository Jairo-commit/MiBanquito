import type { SxProps, Theme } from "@mui/material/styles";

export const modalPaperSx: SxProps<Theme> = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 440,
  padding: theme.spacing(4),
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  outline: "none",
});

export const titleSx: SxProps<Theme> = (theme) => ({
  background: theme.palette.gradients.brandText,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});
