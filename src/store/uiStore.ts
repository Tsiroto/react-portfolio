import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import type { Mode } from "@/types/types";

type IntroPhase = "idle" | "loading" | "select";

interface UiState {
    introPhase: IntroPhase;
    mode: Mode; // "light" | "enhanced"
    setIntroPhase: (p: IntroPhase) => void;
    setMode: (m: Mode) => void;
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
            mode: "light",
            setIntroPhase: (p) => set({ introPhase: p }),
            setMode: (m) => set({ mode: m }),
        }),
        {
            name: "ui-store",
            storage: createJSONStorage(() =>
                typeof window !== "undefined" ? window.localStorage : noopStorage
            ),
            partialize: (s): Partial<UiState> => ({ mode: s.mode }), // persist ONLY mode
            version: 1,
        }
    )
);
