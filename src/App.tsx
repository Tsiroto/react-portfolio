import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
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

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

export default function App() {
    const mode = useUiStore((s) => s.mode);
    const theme = mode === "dark" ? darkTheme : lightTheme;

    const [welcomeDone, setWelcomeDone] = useState(
        () => localStorage.getItem(WELCOME_SEEN_KEY) === "true"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-mode", mode);
    }, [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ position: "relative", width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
                <BackgroundStage />

                {/* Welcome overlay — only shown on first visit */}
                <AnimatePresence>
                    {!welcomeDone && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 200,
                                background: "#0a0a0a",
                            }}
                        >
                            <WelcomeScreen onDone={() => setWelcomeDone(true)} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main app — mounts immediately but fades in after welcome */}
                <AnimatePresence>
                    {welcomeDone && (
                        <motion.div
                            key="app"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            style={{ minHeight: "100vh" }}
                        >
                            <Router>
                                <ScrollToTop />
                                <Routes>
                                    <Route element={<Layout />}>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/projects" element={<Projects />} />
                                        <Route path="/about" element={<About />} />
                                    </Route>
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </Router>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>
        </ThemeProvider>
    );
}
