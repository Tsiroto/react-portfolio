import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import type { AudioState } from "@/types/types";

const noopStorage: StateStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const useAudioStore = create<AudioState>()(
    persist(
        (set, get) => ({
            isMuted: false,
            hasInteracted: false,

            // defaults
            sfxVolume: 1,
            bgVolume: 0.5,

            setMuted: (muted) => set({ isMuted: muted }),
            toggleMuted: () => set({ isMuted: !get().isMuted }),
            setHasInteracted: (value) => set({ hasInteracted: value }),

            setSfxVolume: (v) => set({ sfxVolume: clamp01(v) }),
            setBgVolume:  (v) => set({ bgVolume:  clamp01(v) }),

            reset: () =>
                set({
                    isMuted: false,
                    hasInteracted: false,
                    sfxVolume: 1,
                    bgVolume: 0.5,
                }),
        }),
        {
            name: "audio-store",
            storage: createJSONStorage(() =>
                typeof window !== "undefined" ? window.localStorage : noopStorage
            ),
            partialize: (state): Partial<AudioState> => ({
                isMuted: state.isMuted,
                sfxVolume: state.sfxVolume,
                bgVolume: state.bgVolume,
            }),
            version: 1,
        }
    )
);
