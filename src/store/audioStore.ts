import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";
import type { AudioState } from "@/types/types";
import { AUDIO_DEFAULTS } from "@/config/constants";

const noopStorage: StateStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const useAudioStore = create<AudioState>()(
    persist(
        (set, get) => ({
            isMuted: AUDIO_DEFAULTS.isMuted,
            hasInteracted: false,
            sfxVolume: AUDIO_DEFAULTS.sfxVolume,
            bgVolume: AUDIO_DEFAULTS.bgVolume,

            setMuted: (muted) => set({ isMuted: muted }),
            toggleMuted: () => set({ isMuted: !get().isMuted }),
            setHasInteracted: (value) => set({ hasInteracted: value }),

            setSfxVolume: (v) => set({ sfxVolume: clamp01(v) }),
            setBgVolume:  (v) => set({ bgVolume:  clamp01(v) }),

            resetPrefs: () =>
                set({
                    isMuted: AUDIO_DEFAULTS.isMuted,
                    sfxVolume: AUDIO_DEFAULTS.sfxVolume,
                    bgVolume: AUDIO_DEFAULTS.bgVolume,
                }),
        }),
        {
            name: "audio-store",
            storage: createJSONStorage(() =>
                typeof window !== "undefined" ? window.localStorage : noopStorage
            ),
            // Persist only user prefs (and not hasInteracted)
            partialize: (state): Partial<AudioState> => ({
                isMuted: state.isMuted,
                sfxVolume: state.sfxVolume,
                bgVolume: state.bgVolume,
            }),
            version: 1,
        }
    )
);
