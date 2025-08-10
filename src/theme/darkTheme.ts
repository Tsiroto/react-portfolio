import { createTheme } from "@mui/material/styles";
import { brandPalette, typography, components } from "./base";

export default createTheme({
    palette: {
        mode: "dark",
        ...brandPalette,
        accent: { main: "#ff6b6b" },              // from old COLORS.accent
        glow: { main: "rgba(80, 227, 194, 0.6)" },// from old COLORS.glow
        background: { default: "#0c0c0c", paper: "#1a1a1a" }, // old COLORS.dark
        text: { primary: "#f5f5f5", secondary: "#b0b0b0" },
        divider: "rgba(255,255,255,0.12)",
        action: { hover: "rgba(255,255,255,0.04)" },
    },
    typography,
    components: {
        ...components,
        // (optional) remove any default body background image
        MuiCssBaseline: { styleOverrides: { body: { backgroundImage: "none" } } },
    },
    // (optional) global rounding
    shape: { borderRadius: 16 },
});
