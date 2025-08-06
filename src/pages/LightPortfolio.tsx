import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import ProjectSlider from '../components/ProjectSlider';

const LightPortfolio: React.FC = () => {
  return (
    <div className="light-portfolio">
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
  );
};

export default LightPortfolio;