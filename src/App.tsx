import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import darkTheme from "./theme/darkTheme";
import WelcomeScreen from "./pages/WelcomeScreen";

function RoutedPages() {
    const navigate = useNavigate();
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <WelcomeScreen
                        onModeChange={(mode: "light" | "enhanced") => navigate(`/${mode}`)}
                    />
                }
            />
            <Route path="/light" element={<div>Light Mode Page</div>} />
            <Route path="/enhanced" element={<div>Enhanced Mode Page</div>} />
        </Routes>
    );
}

export default function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            {/* If you deploy under a subfolder, uncomment basename */}
            {/* <Router basename={import.meta.env.BASE_URL}> */}
            <Router>
                <RoutedPages />
            </Router>
        </ThemeProvider>
    );
}
