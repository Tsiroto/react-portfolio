import { createTheme } from "@mui/material/styles";

type ThemeOpts = NonNullable<Parameters<typeof createTheme>[0]>;

type TypographyOption =
    ThemeOpts extends { typography?: infer T }
        ? Exclude<NonNullable<T>, (...args: unknown[]) => unknown>
        : never;

type ComponentsOption =
    ThemeOpts extends { components?: infer C } ? NonNullable<C> : never;

type PaletteOption =
    ThemeOpts extends { palette?: infer P } ? NonNullable<P> : never;

export const brandPalette: Pick<PaletteOption, "primary" | "secondary"> = {
    primary: { main: "#00bcd4" },
    secondary: { main: "#ff4081" },
};

export const typography: TypographyOption = {
    fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
    h1: { fontSize: "4rem", fontWeight: 700, letterSpacing: "-1px" },
    h2: { fontSize: "3rem", fontWeight: 600 },
    h3: { fontSize: "2rem", fontWeight: 500 },
    body1: { fontSize: "1.125rem" },
    button: { textTransform: "none", fontWeight: 500 },
};

export const components: ComponentsOption = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: "2rem",
                padding: "1rem 1.25rem",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                // "&:hover": { backgroundColor: "#00acc1", transform: "scale(1.05)" },
            },
        },
    },
    MuiContainer: { defaultProps: { maxWidth: "lg" } },
};
