import type { Transition } from "framer-motion";

// ⏱ Animation durations (ms)
export const DURATIONS = {
    loadingMinimum: 2000,
    loadingDefault: 3000,
} as const;

// 🔲 Opacity levels
export const OPACITY = {
    bgDim: 0.35,
    bgFull: 1,
    overlayIn: 1,
    overlayOut: 0,
} as const;

export interface TransitionConfig {
    duration: number;
    ease?: string;
    type?: string;
    stiffness?: number;
    damping?: number;
}

// 🔄 Transition presets
export const TRANSITIONS: Record<"gridFade" | "overlayFade" | "fast", Transition> = {
    gridFade: { duration: 0.6, ease: "easeInOut" },
    overlayFade: { duration: 0.6, ease: "easeInOut" },
    fast: { type: "spring", stiffness: 300, damping: 24 }
};

// 📍 Fixed UI element positions
export const POSITIONS = {
    siteOptions: { top: 16, right: 16, zIndex: 9999 },
} as const;

// 🔊 Audio defaults
export const AUDIO_DEFAULTS = {
    isMuted: false,
    sfxVolume: 0.60,
    bgVolume: 0.80,
} as const;

// 🎨 UI defaults
export const UI_DEFAULTS = {
    mode: "enhanced" as const,
};

// ⚙ Feature toggles
export const FEATURES = {
    audioEnabled: true,
} as const;

// 📏 UI timing values
export const POPOVER_MS = 250 as const;

// 🌗 Theme options
export const DEFAULT_THEME: "dark" | "light" = "dark";

// 📝 UI strings
export const STRINGS = {
    siteOptions: "Site Options",
    theme: "Theme",
    lightMode: "Light Mode",
    enhancedMode: "Enhanced Mode",
    pressEnter: "Interact to Begin",
    tapToStart: "Tap to Start",
    loading: "Loading...",
    volume: "Audio",
    mute: "Mute",
    sfxVolume: "SFX Volume",
    bgmVolume: "Background Volume",
    reset: "Reset to defaults",
} as const;
