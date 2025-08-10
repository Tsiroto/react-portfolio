import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import type { Mode } from "@/types/types";
import { UI_DEFAULTS } from "@/config/constants";

type IntroPhase = "idle" | "loading" | "select";

interface UiState {
    introPhase: IntroPhase;
    mode: Mode; // "light" | "enhanced"
    setIntroPhase: (p: IntroPhase) => void;
    setMode: (m: Mode) => void;
    resetUiPrefs: () => void; // <- new
}

const noopStorage: StateStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
};

export const useUiStore = create<UiState>()(
    persist(
        (set) => ({
            introPhase: "idle",
            mode: UI_DEFAULTS.mode,                 // <- default enhanced
            setIntroPhase: (p) => set({ introPhase: p }),
            setMode: (m) => set({ mode: m }),
            resetUiPrefs: () => set({ mode: UI_DEFAULTS.mode }),  // <- reset to enhanced
        }),
        {
            name: "ui-store",
            storage: createJSONStorage(() =>
                typeof window !== "undefined" ? window.localStorage : noopStorage
            ),
            partialize: (s): Partial<UiState> => ({ mode: s.mode }),
            version: 1,
        }
    )
);
