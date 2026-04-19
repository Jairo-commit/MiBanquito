import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material";
import { PropsWithChildren } from "react";

declare module "@mui/material/styles" {
    interface Palette {
        gradients: {
            brand: string;
            brandHover: string;
            brandText: string;
        };
    }
    interface PaletteOptions {
        gradients?: {
            brand?: string;
            brandHover?: string;
            brandText?: string;
        };
    }
}

export const customTheme = createTheme({
    cssVariables: true,
    palette: {
        gradients: {
            brand: "linear-gradient(135deg, #0BC2F7 0%, #7B61FF 100%)",
            brandHover: "linear-gradient(135deg, #09aedd, #6a52e0)",
            brandText: "linear-gradient(135deg, #0BC2F7, #7B61FF)",
        },
        background: {
            default: "#E9EBF9",
            paper: "#FFFFFF",
        },
        primary: {
            main: "#0BC2F7",
            contrastText: "#FFFFFF",
            light: "#E5F6FF",
        },
        secondary: {
            main: "#7B61FF",
            contrastText: "#FFFFFF",
            light: "#EDE9FF",
        },
        error: {
            main: "#FB5859",
            light: "#F24243",
        },
        success: {
            main: "#22C55E",
            light: "#DCFCE7",
        },
        warning: {
            main: "#F59E0B",
            light: "#FEF3C7",
        },
    },
});

export const CustomTheme = ({ children }: PropsWithChildren): React.ReactElement => {
    return (
        <ThemeProvider theme={customTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};
