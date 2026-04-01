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

const heading = `'Space Grotesk', sans-serif`;
const body = `'Inter', sans-serif`;

export const typography: TypographyOption = {
    fontFamily: body,
    h1: { fontFamily: heading, fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontFamily: heading, fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontFamily: heading, fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontFamily: heading, fontWeight: 700 },
    h5: { fontFamily: heading, fontWeight: 600 },
    h6: { fontFamily: heading, fontWeight: 600 },
    overline: { fontFamily: body, fontWeight: 600 },
    body1: { fontFamily: body, fontSize: "1rem" },
    body2: { fontFamily: body, fontSize: "0.875rem" },
    button: { fontFamily: body, textTransform: "none", fontWeight: 600 },
};

export const components: ComponentsOption = {
    MuiButton: {
        styleOverrides: {
            root: {
                // borderRadius: "2rem",
                padding: "1rem 1.25rem",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                // "&:hover": { backgroundColor: "#00acc1", transform: "scale(1.05)" },
            },
        },
    },
    MuiContainer: { defaultProps: { maxWidth: "lg" } },
};
