import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#00d6fc",
        },
        background: {
            default: "#0d0d0f",
            paper: "#1a1a1e",
        },
        text: {
            primary: "#e0f7fa",
        },
    },
    typography: {
        fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
        button: {
            textTransform: "uppercase",
            letterSpacing: "0.1em",
        },
    },
});

export default darkTheme;