import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#0c0c0c",
            paper: "#1a1a1a",
        },
        primary: {
            main: "#00bcd4", // bright cyan accent
        },
        secondary: {
            main: "#ff4081", // vibrant magenta for hover/active
        },
        text: {
            primary: "#f5f5f5",
            secondary: "#b0b0b0",
        },
    },
    typography: {
        fontFamily: `"Poppins", "Helvetica Neue", sans-serif`,
        h1: {
            fontSize: "4rem",
            fontWeight: 700,
            letterSpacing: "-1px",
        },
        h2: {
            fontSize: "3rem",
            fontWeight: 600,
        },
        h3: {
            fontSize: "2rem",
            fontWeight: 500,
        },
        body1: {
            fontSize: "1.125rem",
        },
        button: {
            textTransform: "none",
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "2rem",
                    padding: "0.75rem 2rem",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        backgroundColor: "#00acc1",
                        transform: "scale(1.05)",
                    },
                },
            },
        },
        MuiContainer: {
            defaultProps: {
                maxWidth: "lg",
            },
        },
    },
});

export default theme;
