import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";

// Base types
export type DeviceType = "mobile" | "desktop";
export type InputMethod = "touch" | "keyboard";
export type Mode = "light" | "enhanced";

// Component interfaces
export interface AudioVisualizerProps {
    isActive: boolean;
}

export interface AudioState {
    isMuted: boolean;
    hasInteracted: boolean;
    sfxVolume: number;
    bgVolume: number;
    setMuted: (muted: boolean) => void;
    toggleMuted: () => void;
    setHasInteracted: (value: boolean) => void;
    setSfxVolume: (v: number) => void;
    setBgVolume: (v: number) => void;
    reset: () => void;
}

export interface AudioToggleOwnProps {
    hidden?: boolean;
    sx?: SxProps<Theme>;
    onHover?: () => void;
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
    opacity?: number;   // 0..1
    speedSec?: number;  // seconds per loop
    lineColor?: string; // CSS color string
}

export interface WelcomeLoaderProps {
    duration?: number; // ms
    onComplete?: () => void;
}

export interface WelcomeScreenProps {
    onModeChange: (mode: Mode) => void;
}

export interface ModeButtonsProps {
    show: boolean;
    onLight: () => void;
    onEnhanced: () => void;
    onHover?: () => void;
}

export type IntroPhase = "idle" | "loading" | "select";