// 🎨 UI colors
export const COLORS = {
    primary: '#4a90e2',
    secondary: '#50e3c2',
    dark: '#121212',
    light: '#f5f5f5',
    accent: '#ff6b6b',
    glow: 'rgba(80, 227, 194, 0.6)',
    audioIcon: 'rgba(80, 227, 194, 0.6)', // AudioToggle icon color
};

// ⏱ Animation durations (ms)
export const DURATIONS = {
    loadingMinimum: 2000,
    loadingDefault: 3000,
};

// 🔲 Opacity levels
export const OPACITY = {
    gridIdle: 0.35,
    gridActive: 1,
    overlayIn: 1,
    overlayOut: 0,
} as const;

// 🔄 Transition presets
export const TRANSITIONS = {
    gridFade: { duration: 0.6, ease: "easeInOut" },
    overlayFade: { duration: 0.6, ease: "easeInOut" },
    audioToggleFade: { duration: 0.4, ease: "easeOut" },
    fast: { type: "spring", stiffness: 300, damping: 24, duration: 0.25 },
} as const;

// 📍 Fixed UI element positions
export const POSITIONS = {
    audioToggle: { top: 16, right: 16, zIndex: 9999 },
};

// 📝 UI strings
export const STRINGS = {
    lightMode: 'Light Mode',
    enhancedMode: 'Enhanced Mode',
    pressEnter: 'Interact to Begin',
    tapToStart: 'Tap to Start',
    loading: 'Loading...',
    muteAudio: 'Mute Audio',
    mute: "Mute",
    unmuteAudio: 'Unmute Audio',
    volume: "Volume",
    sfxVolume: "SFX Volume",
    bgmVolume: "Background Volume",
    audioToggleLabelOn: "Mute audio",
    audioToggleLabelOff: "Unmute audio",
    audioToggleTipOn: "Click to mute",
    audioToggleTipOff: "Click to unmute",
};

// ⚙ Feature toggles
export const FEATURES = {
    audioEnabled: true,
};
