import { Box } from "@mui/material";
import { useState } from "react";
import Header from "./components/Header";
import ProjectSlider from "./components/ProjectSlider";
import HeroLoader from "./components/heroLoader/HeroLoader";

function App() {
    const [loaderComplete, setLoaderComplete] = useState(false);
    
    const handleLoaderComplete = () => {
        setLoaderComplete(true);
    };
    
    return (
        <>
            {/* Hero Loader */}
            {!loaderComplete && <HeroLoader onComplete={handleLoaderComplete} />}
            
            {/* Main Content (only visible after loader completes) */}
            <div style={{ visibility: loaderComplete ? 'visible' : 'hidden' }}>
                <Header />
                <Box sx={{ pt: 10 }}>
                    {/* Projects Grid Section */}
                    <section id="projects" style={{ padding: "5rem 2rem" }}>
                        <h2>Projects Grid (Coming soon)</h2>
                    </section>

                    {/* Project Slider Showcase */}
                    <section id="showcase" style={{ minHeight: "100vh" }}>
                        <ProjectSlider />
                    </section>

                    {/* Contact Section */}
                    <section id="contact" style={{ padding: "5rem 2rem" }}>
                        <h2>Contact Section (Coming soon)</h2>
                    </section>
                </Box>
            </div>
        </>
    );
}

export default App;
