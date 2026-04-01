import type { Transition } from "framer-motion";
import type { Mode } from "@/types/types";

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

// 🔄 Transition presets (properly typed)
export const TRANSITIONS = {
    gridFade: { duration: 0.6, ease: "easeInOut" },
    overlayFade: { duration: 0.6, ease: "easeInOut" },
    fast: { type: "spring", stiffness: 300, damping: 24 },
} satisfies Record<"gridFade" | "overlayFade" | "fast", Transition>;

// 📍 Fixed UI element positions
export const POSITIONS = {
    siteOptions: { top: 16, right: 16, zIndex: 9999 },
} as const;

// 🔊 Audio defaults
export const AUDIO_DEFAULTS = {
    isMuted: false,
    sfxVolume: 0.6,
    bgVolume: 0.8,
} as const;

// 🌗 Theme defaults (THEME mode only)
export const DEFAULT_THEME: Mode = "light";

export const UI_DEFAULTS: { mode: Mode } = {
    mode: DEFAULT_THEME, // "light" | "dark"
};

// ⚙ Feature toggles
export const FEATURES = {
    audioEnabled: true,
} as const;

// 📏 UI timing values
export const POPOVER_MS = 250 as const;

// 📝 UI strings (visitor-facing labels)
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
