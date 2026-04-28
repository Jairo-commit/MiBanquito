import { type SxProps, type Theme } from "@mui/material/styles";

export const containerSx: SxProps<Theme> = (theme) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    padding: "40px",
});

export const accountNumberSx: SxProps<Theme> = (theme) => ({
    mt: theme.spacing(1),
});
