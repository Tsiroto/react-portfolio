import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ThemeRoot from "@/theme/ThemeRoot";
import { useThemeStore } from "@/store/themeStore";
import WelcomeScreen from "./pages/WelcomeScreen";
import Portfolio from "@/pages/Portfolio";

function RoutedPages() {
    const navigate = useNavigate();
    const setMode = useThemeStore((s) => s.setMode); // ✅ you were missing this

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <WelcomeScreen
                        onModeChange={(mode) => {
                            // UX "enhanced" -> MUI dark theme
                            setMode(mode === "enhanced" ? "dark" : "light");
                            navigate("/portfolio");
                        }}
                    />
                }
            />
            <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
    );
}

export default function App() {
    return (
        <ThemeRoot>
            <Router>
                <RoutedPages />
            </Router>
        </ThemeRoot>
    );
}
