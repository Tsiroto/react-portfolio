import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import type { IntroPhase, Mode } from "@/types/types";
import { UI_DEFAULTS } from "@/config/constants";
import { loadThemeMode } from "@/utils/modeMapping";

export type BackgroundType = "ambient" | "minimal" | "off";
export type VisualMode = "rich" | "simple";

export type UiState = {
    introPhase: IntroPhase;   // "idle" | "loading" | "select" | "exiting"
    mode: Mode;
    visualMode: VisualMode;   // "rich" = full effects, "simple" = reduced effects

    // background control
    backgroundType: BackgroundType;
    backgroundVisible: boolean;
    setBackgroundType: (bg: BackgroundType) => void;
    setBackgroundVisible: (visible: boolean) => void;

    // quick helpers
    showBackground: (bg: BackgroundType) => void;
    hideBackground: () => void;

    // state setters
    setIntroPhase: (p: IntroPhase) => void;
    setMode: (m: Mode) => void;
    setVisualMode: (v: VisualMode) => void;

    // reset
    resetUiPrefs: () => void;
};

const noopStorage: StateStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
};

export const useUiStore = create<UiState>()(
    persist(
        (set) => ({
            introPhase: "idle",
            mode: loadThemeMode(UI_DEFAULTS.mode), // read "light" | "dark" from storage
            visualMode: "simple",

            // background
            backgroundType: "ambient",
            backgroundVisible: false,

            // setters
            setIntroPhase: (p) => set({ introPhase: p }),
            setMode: (m) => set({ mode: m }),
            setVisualMode: (v) => set({ visualMode: v }),
            setBackgroundType: (bg) => set({ backgroundType: bg }),
            setBackgroundVisible: (visible) => set({ backgroundVisible: visible }),

            // helpers
            showBackground: (bg) => set({ backgroundType: bg, backgroundVisible: true }),
            hideBackground: () => set({ backgroundVisible: false }),

            resetUiPrefs: () =>
                set({
                    mode: UI_DEFAULTS.mode,
                    visualMode: "simple",
                    backgroundType: "ambient",
                    backgroundVisible: false,
                }),
        }),
        {
            name: "ui-store",
            storage: createJSONStorage(() =>
                typeof window !== "undefined" ? window.localStorage : noopStorage
            ),
            partialize: (s): Partial<UiState> => ({
                mode: s.mode,
                visualMode: s.visualMode,
                backgroundType: s.backgroundType,
                backgroundVisible: s.backgroundVisible,
            }),
            version: 4, // bumped: default mode changed to light
        }
    )
);
