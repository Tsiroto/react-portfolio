import type {PropsWithChildren} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useThemeStore } from "@/store/themeStore";
import darkTheme from "./darkTheme";
import lightTheme from "./lightTheme";

export default function ThemeRoot({ children }: PropsWithChildren) {
    const mode = useThemeStore((s) => s.mode);
    const theme = mode === "dark" ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
