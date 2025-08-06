import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import ProjectSlider from '../components/ProjectSlider';
import AudioVisualizer from '../components/AudioVisualizer';

const EnhancedPortfolio: React.FC = () => {
  const [audioActive, setAudioActive] = useState(false);
  
  useEffect(() => {
    // Enable audio visualizer after a short delay
    const timer = setTimeout(() => {
      setAudioActive(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="enhanced-portfolio">
      {/* Background audio visualizer for enhanced experience */}
      <AudioVisualizer isActive={audioActive} />
      
      <Header />
      <Box sx={{ 
        pt: 10,
        position: 'relative',
        zIndex: 1,
        color: '#fff',
        // Add some enhanced styling
        '& section': {
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '8px',
          margin: '2rem',
          transition: 'all 0.3s ease'
        }
      }}>
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

export default EnhancedPortfolio;