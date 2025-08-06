import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import darkTheme from "./theme/darkTheme";
import WelcomeScreen from "./pages/WelcomeScreen";
import {ThemeProvider} from "@mui/material";

const App = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <Router>
                <Routes>
                    <Route path="/" element={<WelcomeScreen />} />
                    <Route path="/light" element={<div>Light Mode Page</div>} />
                    <Route path="/enhanced" element={<div>Enhanced Mode Page</div>} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
