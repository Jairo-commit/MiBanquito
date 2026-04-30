import { type SxProps, type Theme } from "@mui/material/styles";

export const containerSx: SxProps<Theme> = {
    display: "flex",
    minHeight: "calc(100vh - 64px)",
};

export const leftPanelSx = (leftWidth: number): SxProps<Theme> => ({
    width: `${leftWidth}%`,
    minHeight: "100%",
    overflow: "hidden",
});

export const rightPanelSx: SxProps<Theme> = {
    flex: 1,
    minHeight: "100%",
    overflow: "hidden",
};
