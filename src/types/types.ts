import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";

/** Base */
export type DeviceType = "mobile" | "desktop";
export type InputMethod = "touch" | "keyboard";

/** Visitor-facing labels (UI) */
export type VisitorMode = "light" | "enhanced";

/** Actual MUI theme mode */
export type Mode = "light" | "dark";

/** Handlers */
export type VisitorModeChangeHandler = (mode: VisitorMode) => void;
export type ModeChangeHandler = (mode: Mode) => void;

/** Components */
export interface AudioVisualizerProps { isActive: boolean; }

export interface AudioState {
    isMuted: boolean;       // music / BGM mute
    isSfxMuted: boolean;    // effects mute (independent)
    hasInteracted: boolean;
    sfxVolume: number;
    bgVolume: number;
    setMuted: (muted: boolean) => void;
    toggleMuted: () => void;
    setSfxMuted: (muted: boolean) => void;
    toggleSfxMuted: () => void;
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

export interface ModeSelectorProps {
    show: boolean;
    onModeChange: VisitorModeChangeHandler;
    onHover?: () => void;
    currentMode?: VisitorMode;
    sx?: SxProps<Theme>;
    labels?: Partial<Record<VisitorMode, string>>;
}

export type ModeButtonsProps = ModeSelectorProps;

export interface RetroGridProps {
    opacity?: number;
    speedSec?: number;
    lineColor?: string;
}

export interface WelcomeLoaderProps {
    duration?: number;
    onComplete?: () => void;
}

export interface WelcomeScreenProps {
    onModeChange?: ModeChangeHandler;
}

export type IntroPhase = "idle" | "loading" | "select" | "exiting";
