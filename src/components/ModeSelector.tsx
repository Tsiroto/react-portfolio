import React from 'react';
import { COLORS, STRINGS, DURATIONS } from '../config/constants';
import '../styles/welcomeScreen.css';

type Mode = 'light' | 'enhanced';

interface ModeSelectorProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  visible: boolean;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ 
  currentMode, 
  onModeChange, 
  visible 
}) => {
  if (!visible) return null;

  return (
    <div 
      className="mode-selector"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${DURATIONS.transition}ms ease-in-out`
      }}
    >
      <button
        className={`mode-button ${currentMode === 'light' ? 'active' : ''}`}
        onClick={() => onModeChange('light')}
        style={{
          backgroundColor: currentMode === 'light' ? COLORS.primary : 'transparent',
          color: currentMode === 'light' ? COLORS.light : COLORS.primary,
          borderColor: COLORS.primary,
          transition: `all ${DURATIONS.transition}ms ease-in-out`
        }}
      >
        {STRINGS.lightMode}
      </button>
      
      <button
        className={`mode-button ${currentMode === 'enhanced' ? 'active' : ''}`}
        onClick={() => onModeChange('enhanced')}
        style={{
          backgroundColor: currentMode === 'enhanced' ? COLORS.secondary : 'transparent',
          color: currentMode === 'enhanced' ? COLORS.dark : COLORS.secondary,
          borderColor: COLORS.secondary,
          transition: `all ${DURATIONS.transition}ms ease-in-out`
        }}
      >
        {STRINGS.enhancedMode}
      </button>
    </div>
  );
};

export default ModeSelector;