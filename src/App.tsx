import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import darkTheme from "@/theme/darkTheme";
import lightTheme from "@/theme/lightTheme";
import { useUiStore } from "@/store/uiStore";
import WelcomeScreen from "@/pages/WelcomeScreen";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import About from "@/pages/About";
import Layout from "@/components/layout/Layout";
import BackgroundStage from "@/components/backgrounds/BackgroundStage.tsx";

export const WELCOME_SEEN_KEY = "portfolio_welcome_seen";

/** At `/`: if already seen → go straight to /home */
function WelcomeGuard() {
    const seen = localStorage.getItem(WELCOME_SEEN_KEY) === "true";
    if (seen) return <Navigate to="/home" replace />;
    return <WelcomeScreen />;
}

/** Wraps inner pages: if welcome not seen → send back to / */
function RequireWelcome() {
    const seen = localStorage.getItem(WELCOME_SEEN_KEY) === "true";
    if (!seen) return <Navigate to="/" replace />;
    return <Outlet />;
}

export default function App() {
    const mode = useUiStore((s) => s.mode);
    const theme = mode === "dark" ? darkTheme : lightTheme;

    useEffect(() => {
        document.documentElement.setAttribute("data-mode", mode);
    }, [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ position: "relative", width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
                <BackgroundStage />

                <Router>
                    <Routes>
                        <Route path="/" element={<WelcomeGuard />} />
                        {/* RequireWelcome redirects to / if flag not set */}
                        <Route element={<RequireWelcome />}>
                            <Route element={<Layout />}>
                                <Route path="/home" element={<Home />} />
                                <Route path="/projects" element={<Projects />} />
                                <Route path="/about" element={<About />} />
                            </Route>
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </Box>
        </ThemeProvider>
    );
}
