import { create } from "zustand";

type ThemeMode = "light" | "dark";

type ThemeState = {
    mode: ThemeMode;
    setMode: (m: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
    mode: "dark",
    setMode: (mode) => set({ mode }),
}));
