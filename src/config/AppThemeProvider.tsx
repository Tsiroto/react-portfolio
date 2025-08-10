import React, { useEffect } from "react";
import { ThemeProvider, GlobalStyles } from "@mui/material";
import darkTheme from "@/theme/darkTheme";
import lightTheme from "@/theme/lightTheme";
import { useUiStore } from "@/store/uiStore";

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const mode = useUiStore((s) => s.mode); // "light" | "enhanced"
    const theme = mode === "enhanced" ? darkTheme : lightTheme;

    // expose a data-theme for CSS files
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", mode);
    }, [mode]);

    return (
        <ThemeProvider theme={theme}>
            {/* Map a few theme tokens to CSS variables for your /styles/*.css */}
            <GlobalStyles
                styles={(t) => ({
                    ":root": {
                        // background/text
                        "--bg": t.palette.background.default,
                        "--bg-paper": t.palette.background.paper,
                        "--text": t.palette.text.primary,
                        "--text-secondary": t.palette.text.secondary,

                        // accents
                        "--primary": t.palette.primary.main,
                        "--secondary": t.palette.secondary?.main ?? t.palette.primary.light,
                        "--divider": t.palette.divider,
                        "--glow": "rgba(80, 227, 194, 0.6)", // keep if you rely on glow effects
                        // spacing/radius (if you want)
                        "--radius": `${t.shape.borderRadius}px`,
                    },
                })}
            />
            {children}
        </ThemeProvider>
    );
}
