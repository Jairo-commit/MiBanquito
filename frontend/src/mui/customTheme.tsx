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
    interface TypographyVariants {
        accountBalance: React.CSSProperties;
        accountNumber: React.CSSProperties;
    }
    interface TypographyVariantsOptions {
        accountBalance?: React.CSSProperties;
        accountNumber?: React.CSSProperties;
    }
}

declare module "@mui/material/Typography" {
    interface TypographyPropsVariantOverrides {
        accountBalance: true;
        accountNumber: true;
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
    typography: {
        accountBalance: {
            fontWeight: 700,
            fontSize: "3rem",
            lineHeight: 1.2,
        },
        accountNumber: {
            fontSize: "0.875rem",
            letterSpacing: "0.1em",
        },
    },
    components: {
        MuiTypography: {
            variants: [
                {
                    props: { variant: "accountBalance" },
                    style: ({ theme }) => ({
                        background: theme.palette.gradients.brandText,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }),
                },
                {
                    props: { variant: "accountNumber" },
                    style: ({ theme }) => ({
                        color: theme.palette.secondary.main,
                    }),
                },
            ],
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
