import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";

// Base types
export type DeviceType = "mobile" | "desktop";
export type InputMethod = "touch" | "keyboard";
export type Mode = "light" | "enhanced";

// Reusable handler
export type ModeChangeHandler = (mode: Mode) => void;

// Components
export interface AudioVisualizerProps { isActive: boolean; }

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
    resetPrefs: () => void;
}

export interface AudioToggleOwnProps {
    hidden?: boolean;
    sx?: SxProps<Theme>;
    onHover?: () => void;
}

export interface GlitchTypingTextProps { text: string; }

export interface GlowingPromptProps {
    deviceType: InputMethod;
    onStart: () => void;
}

// 🔁 Single, shared props for ANY mode selector UI (buttons, popover, etc.)
export interface ModeSelectorProps {
    show: boolean;
    onModeChange: ModeChangeHandler;
    onHover?: () => void;
    currentMode?: Mode; // optional, if you ever want to show the selected state
}

export interface RetroGridProps {
    opacity?: number;
    speedSec?: number;
    lineColor?: string;
}

export interface WelcomeLoaderProps {
    duration?: number;
    onComplete?: () => void;
}

// WelcomeScreen now uses the same handler name
export interface WelcomeScreenProps {
    onModeChange: ModeChangeHandler;
}

export type IntroPhase = "idle" | "loading" | "select";
