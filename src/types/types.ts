// Base types
export type DeviceType = 'mobile' | 'desktop';
export type InputMethod = 'touch' | 'keyboard';
export type Mode = 'light' | 'enhanced';

// Component interfaces
export interface AudioVisualizerProps {
    isActive: boolean;
}

export interface AudioToggleProps {
    hidden?: boolean; // pass true in Light mode
}

export interface GlitchTypingTextProps {
    text: string;
}

export interface GlowingPromptProps {
    deviceType: InputMethod;
    onStart: () => void;
}

export interface ModeSelectorProps {
    currentMode: Mode;
    onModeChange: (mode: Mode) => void;
    visible: boolean;
}

export interface RetroGridProps {
    opacity?: number;    // 0..1
    speedSec?: number;   // seconds per loop
    lineColor?: string;  // CSS color string
}

export interface WelcomeLoaderProps {
    duration?: number; // in ms
    onComplete?: () => void;
}

export interface WelcomeScreenProps {
    onModeChange: (mode: "light" | "enhanced") => void;
}