import { create } from "zustand";

interface AudioState {
    isMuted: boolean;
    hasInteracted: boolean; // browser-allowed playback
    setMuted: (val: boolean) => void;
    setInteracted: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
    isMuted: JSON.parse(localStorage.getItem("isMuted") || "false"),
    hasInteracted: false,
    setMuted: (val) => {
        localStorage.setItem("isMuted", JSON.stringify(val));
        set({ isMuted: val });
    },
    setInteracted: () => set({ hasInteracted: true }),
}));
