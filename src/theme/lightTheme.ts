import { createTheme } from "@mui/material/styles";
import { brandPalette, typography, components } from "./base";

export default createTheme({
    palette: {
        mode: "light",
        ...brandPalette,
        accent: { main: "#ff6b6b" },
        glow: { main: "rgba(80, 227, 194, 0.6)" },
        background: { default: "#ffffff", paper: "#f7f7f7" }, // old COLORS.light
        text: { primary: "#000000", secondary: "#444444" },
        divider: "rgba(0,0,0,0.12)",
        action: { hover: "rgba(0,0,0,0.04)" },
    },
    typography,
    components: {
        ...components,
        MuiCssBaseline: { styleOverrides: { body: { backgroundImage: "none" } } },
    },
});
