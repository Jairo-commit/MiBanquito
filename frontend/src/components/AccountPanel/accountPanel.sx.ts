import { type SxProps, type Theme } from "@mui/material/styles";

export const containerSx: SxProps<Theme> = (theme) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(2.5, 3),
  borderRadius: 2,
  background: theme.palette.primary.light,
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  mb: theme.spacing(1.5),
  "&:last-child": { mb: 0 },
});

export const accountNumberRowSx: SxProps<Theme> = (theme) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  mt: theme.spacing(0.5),
});

export const actionRowSx: SxProps<Theme> = (theme) => ({
  display: "flex",
  justifyContent: "flex-end",
  mt: theme.spacing(1.5),
});
